Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gocoverParser = require('./gocover-parser');

var _gocoverParser2 = _interopRequireDefault(_gocoverParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

'use babel';

var Tester = (function () {
  function Tester(goconfigFunc, gogetFunc) {
    _classCallCheck(this, Tester);

    this.goget = gogetFunc;
    this.goconfig = goconfigFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.saveSubscriptions = new _atom.CompositeDisposable();
    this.observeConfig();
    this.observeTextEditors();
    this.handleCommands();
    this.subscribeToSaveEvents();
    this.running = false;
    _temp2['default'].track();
  }

  _createClass(Tester, [{
    key: 'dispose',
    value: function dispose() {
      this.running = true;
      this.removeTempDir();
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      if (this.saveSubscriptions) {
        this.saveSubscriptions.dispose();
      }
      this.saveSubscriptions = null;
      this.goget = null;
      this.goconfig = null;
      this.running = null;
    }
  }, {
    key: 'handleCommands',
    value: function handleCommands() {
      var _this = this;

      this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:gocover', function () {
        if (!_this.ready() || !_this.getEditor()) {
          return;
        }
        _this.runCoverage();
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:cleargocover', function () {
        if (!_this.ready() || !_this.getEditor()) {
          return;
        }
        _this.clearMarkersFromEditors();
      }));
    }
  }, {
    key: 'observeTextEditors',
    value: function observeTextEditors() {
      var _this2 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        _this2.addMarkersToEditor(editor);
      }));
    }
  }, {
    key: 'observeConfig',
    value: function observeConfig() {
      var _this3 = this;

      this.subscriptions.add(atom.config.observe('tester-go.runCoverageOnSave', function (runCoverageOnSave) {
        if (_this3.saveSubscriptions) {
          _this3.saveSubscriptions.dispose();
        }
        _this3.saveSubscriptions = new _atom.CompositeDisposable();
        if (runCoverageOnSave) {
          _this3.subscribeToSaveEvents();
        }
      }));
    }
  }, {
    key: 'subscribeToSaveEvents',
    value: function subscribeToSaveEvents() {
      var _this4 = this;

      this.saveSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        if (!editor || !editor.getBuffer()) {
          return;
        }

        var bufferSubscriptions = new _atom.CompositeDisposable();
        bufferSubscriptions.add(editor.getBuffer().onDidSave(function (filePath) {
          if (atom.config.get('tester-go.runCoverageOnSave')) {
            _this4.runCoverage(editor);
            return;
          }
        }));
        bufferSubscriptions.add(editor.getBuffer().onDidDestroy(function () {
          bufferSubscriptions.dispose();
        }));
        _this4.saveSubscriptions.add(bufferSubscriptions);
      }));
    }
  }, {
    key: 'getEditor',
    value: function getEditor() {
      if (!atom || !atom.workspace) {
        return;
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!this.isValidEditor(editor)) {
        return;
      }

      return editor;
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {
      if (!editor || !editor.getGrammar()) {
        return false;
      }

      return editor.getGrammar().scopeName === 'source.go';
    }
  }, {
    key: 'addMarkersToEditors',
    value: function addMarkersToEditors() {
      var editors = atom.workspace.getTextEditors();
      for (var editor of editors) {
        this.addMarkersToEditor(editor);
      }
    }
  }, {
    key: 'clearMarkersFromEditors',
    value: function clearMarkersFromEditors() {
      var editors = atom.workspace.getTextEditors();
      for (var editor of editors) {
        this.clearMarkers(editor);
      }
    }
  }, {
    key: 'addMarkersToEditor',
    value: function addMarkersToEditor(editor) {
      if (!this.isValidEditor(editor)) {
        return;
      }
      var file = editor.getPath();
      var buffer = editor.getBuffer();
      if (!file || !buffer) {
        return;
      }
      this.clearMarkers(editor);
      if (!this.ranges || this.ranges.length <= 0) {
        return;
      }

      var editorRanges = _lodash2['default'].filter(this.ranges, function (r) {
        return _lodash2['default'].endsWith(file, r.file);
      });

      if (!editorRanges || editorRanges.length <= 0) {
        return;
      }

      try {
        for (var range of editorRanges) {
          var marker = buffer.markRange(range.range, { 'class': 'gocover', gocovercount: range.count, invalidate: 'touch' });
          var c = 'uncovered';
          if (range.count > 0) {
            c = 'covered';
          }
          editor.decorateMarker(marker, { type: 'highlight', 'class': c, onlyNonEmpty: true });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: 'clearMarkers',
    value: function clearMarkers(editor) {
      if (!editor || !editor.getBuffer()) {
        return;
      }

      try {
        var markers = editor.getBuffer().findMarkers({ 'class': 'gocover' });
        if (!markers || markers.length <= 0) {
          return;
        }
        for (var marker of markers) {
          marker.destroy();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: 'removeTempDir',
    value: function removeTempDir() {
      if (this.tempDir) {
        (0, _rimraf2['default'])(this.tempDir, function (e) {
          if (e) {
            if (e.handle) {
              e.handle();
            }
            console.log(e);
          }
        });
        this.tempDir = null;
      }
    }
  }, {
    key: 'createCoverageFile',
    value: function createCoverageFile() {
      this.removeTempDir();
      if (!this.tempDir) {
        this.tempDir = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
      }
      this.coverageFile = _path2['default'].join(this.tempDir, 'coverage.out');
    }
  }, {
    key: 'projectPath',
    value: function projectPath(editor) {
      if (editor && editor.getPath()) {
        return editor.getPath();
      }

      if (atom.project.getPaths().length) {
        return atom.project.getPaths()[0];
      }

      return false;
    }
  }, {
    key: 'getLocatorOptions',
    value: function getLocatorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      var options = {};
      var p = this.projectPath(editor);
      if (p) {
        options.directory = p;
      }

      return options;
    }
  }, {
    key: 'getExecutorOptions',
    value: function getExecutorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      var o = this.getLocatorOptions(editor);
      var options = {};
      options.cwd = _path2['default'].dirname(editor.getPath());
      var config = this.goconfig();
      if (config) {
        options.env = config.environment(o);
      }
      if (!options.env) {
        options.env = process.env;
      }
      return options;
    }
  }, {
    key: 'ready',
    value: function ready() {
      return this.goconfig && this.goconfig();
    }
  }, {
    key: 'runCoverage',
    value: function runCoverage() {
      var _this5 = this;

      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      if (!this.isValidEditor(editor)) {
        return Promise.resolve();
      }
      var buffer = editor.getBuffer();
      if (!buffer) {
        return Promise.resolve();
      }
      if (this.running) {
        return Promise.resolve();
      }

      return Promise.resolve().then(function () {
        _this5.running = true;
        _this5.clearMarkersFromEditors();
        _this5.createCoverageFile();
        var config = _this5.goconfig();
        var go = false;
        var cover = false;
        var locatorOptions = _this5.getLocatorOptions(editor);
        return config.locator.findTool('go', locatorOptions).then(function (cmd) {
          if (!cmd) {
            return false;
          }
          go = cmd;
          return config.locator.findTool('cover', locatorOptions);
        }).then(function (cmd) {
          if (!cmd) {
            return false;
          }
          cover = cmd;
        }).then(function () {
          if (!go || !cover) {
            _this5.running = false;
            return;
          }

          var cmd = go;
          var args = ['test', '-coverprofile=' + _this5.coverageFile];
          if (atom.config.get('tester-go.runCoverageWithShortFlag')) {
            args.push('-short');
          }
          var executorOptions = _this5.getExecutorOptions(editor);
          return config.executor.exec(cmd, args, executorOptions).then(function (r) {
            if (r.stderr && r.stderr.trim() !== '') {
              console.log('tester-go: (stderr) ' + r.stderr);
            }

            if (r.exitcode === 0) {
              _this5.ranges = _gocoverParser2['default'].ranges(_this5.coverageFile);
              _this5.addMarkersToEditors();
            }

            _this5.running = false;
          });
        })['catch'](function (e) {
          if (e.handle) {
            e.handle();
          }
          console.log(e);
          _this5.running = false;
          return Promise.resolve();
        });
      });
    }
  }]);

  return Tester;
})();

exports.Tester = Tester;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3Rlc3Rlci1nby9saWIvdGVzdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWtDLE1BQU07O3NCQUMxQixRQUFROzs7O2tCQUNQLElBQUk7Ozs7NkJBQ0Esa0JBQWtCOzs7O29CQUNwQixNQUFNOzs7O3NCQUNKLFFBQVE7Ozs7b0JBQ1YsTUFBTTs7OztBQVJ2QixXQUFXLENBQUE7O0lBVUwsTUFBTTtBQUNFLFdBRFIsTUFBTSxDQUNHLFlBQVksRUFBRSxTQUFTLEVBQUU7MEJBRGxDLE1BQU07O0FBRVIsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsK0JBQXlCLENBQUE7QUFDbEQsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNyQixRQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixzQkFBSyxLQUFLLEVBQUUsQ0FBQTtHQUNiOztlQVpHLE1BQU07O1dBY0YsbUJBQUc7QUFDVCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDcEIsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDN0I7QUFDRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUMxQixZQUFJLENBQUMsaUJBQWlCLENBQUMs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LEtBQUssQ0FBQTtXQUNyQixDQUFDLENBQUE7U0FDSCxDQUFDLFNBQU0sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNkLGNBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNaLGFBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtXQUNYO0FBQ0QsaUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDZCxpQkFBSyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLGlCQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUN6QixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O1NBdlNHLE1BQU07OztRQXlTSixNQUFNLEdBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy90ZXN0ZXItZ28vbGliL3Rlc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9nb2NvdmVyLXBhcnNlcidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcmltcmFmIGZyb20gJ3JpbXJhZidcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnXG5cbmNsYXNzIFRlc3RlciB7XG4gIGNvbnN0cnVjdG9yIChnb2NvbmZpZ0Z1bmMsIGdvZ2V0RnVuYykge1xuICAgIHRoaXMuZ29nZXQgPSBnb2dldEZ1bmNcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdGdW5jXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5vYnNlcnZlQ29uZmlnKClcbiAgICB0aGlzLm9ic2VydmVUZXh0RWRpdG9ycygpXG4gICAgdGhpcy5oYW5kbGVDb21tYW5kcygpXG4gICAgdGhpcy5zdWJzY3JpYmVUb1NhdmVFdmVudHMoKVxuICAgIHRoaXMucnVubmluZyA9IGZhbHNlXG4gICAgdGVtcC50cmFjaygpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlXG4gICAgdGhpcy5yZW1vdmVUZW1wRGlyKClcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBpZiAodGhpcy5zYXZlU3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvZ2V0ID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gICAgdGhpcy5ydW5uaW5nID0gbnVsbFxuICB9XG5cbiAgaGFuZGxlQ29tbWFuZHMgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2dvbGFuZzpnb2NvdmVyJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnJlYWR5KCkgfHwgIXRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnJ1bkNvdmVyYWdlKClcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdnb2xhbmc6Y2xlYXJnb2NvdmVyJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnJlYWR5KCkgfHwgIXRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmNsZWFyTWFya2Vyc0Zyb21FZGl0b3JzKClcbiAgICB9KSlcbiAgfVxuXG4gIG9ic2VydmVUZXh0RWRpdG9ycyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgdGhpcy5hZGRNYXJrZXJzVG9FZGl0b3IoZWRpdG9yKVxuICAgIH0pKVxuICB9XG5cbiAgb2JzZXJ2ZUNvbmZpZyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCd0ZXN0ZXItZ28ucnVuQ292ZXJhZ2VPblNhdmUnLCAocnVuQ292ZXJhZ2VPblNhdmUpID0+IHtcbiAgICAgIGlmICh0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9XG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgaWYgKHJ1bkNvdmVyYWdlT25TYXZlKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG9TYXZlRXZlbnRzKClcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuXG4gIHN1YnNjcmliZVRvU2F2ZUV2ZW50cyAoKSB7XG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0QnVmZmVyKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBidWZmZXJTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgYnVmZmVyU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZmlsZVBhdGgpID0+IHtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgndGVzdGVyLWdvLnJ1bkNvdmVyYWdlT25TYXZlJykpIHtcbiAgICAgICAgICB0aGlzLnJ1bkNvdmVyYWdlKGVkaXRvcilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmFkZChlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgYnVmZmVyU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5hZGQoYnVmZmVyU3Vic2NyaXB0aW9ucylcbiAgICB9KSlcbiAgfVxuXG4gIGdldEVkaXRvciAoKSB7XG4gICAgaWYgKCFhdG9tIHx8ICFhdG9tLndvcmtzcGFjZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdG9yXG4gIH1cblxuICBpc1ZhbGlkRWRpdG9yIChlZGl0b3IpIHtcbiAgICBpZiAoIWVkaXRvciB8fCAhZWRpdG9yLmdldEdyYW1tYXIoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lID09PSAnc291cmNlLmdvJ1xuICB9XG5cbiAgYWRkTWFya2Vyc1RvRWRpdG9ycyAoKSB7XG4gICAgbGV0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIGVkaXRvcnMpIHtcbiAgICAgIHRoaXMuYWRkTWFya2Vyc1RvRWRpdG9yKGVkaXRvcilcbiAgICB9XG4gIH1cblxuICBjbGVhck1hcmtlcnNGcm9tRWRpdG9ycyAoKSB7XG4gICAgbGV0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIGVkaXRvcnMpIHtcbiAgICAgIHRoaXMuY2xlYXJNYXJrZXJzKGVkaXRvcilcbiAgICB9XG4gIH1cblxuICBhZGRNYXJrZXJzVG9FZGl0b3IgKGVkaXRvcikge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsZXQgZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgaWYgKCFmaWxlIHx8ICFidWZmZXIpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmNsZWFyTWFya2VycyhlZGl0b3IpXG4gICAgaWYgKCF0aGlzLnJhbmdlcyB8fCB0aGlzLnJhbmdlcy5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IGVkaXRvclJhbmdlcyA9IF8uZmlsdGVyKHRoaXMucmFuZ2VzLCAocikgPT4geyByZXR1cm4gXy5lbmRzV2l0aChmaWxlLCByLmZpbGUpIH0pXG5cbiAgICBpZiAoIWVkaXRvclJhbmdlcyB8fCBlZGl0b3JSYW5nZXMubGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKGxldCByYW5nZSBvZiBlZGl0b3JSYW5nZXMpIHtcbiAgICAgICAgbGV0IG1hcmtlciA9IGJ1ZmZlci5tYXJrUmFuZ2UocmFuZ2UucmFuZ2UsIHtjbGFzczogJ2dvY292ZXInLCBnb2NvdmVyY291bnQ6IHJhbmdlLmNvdW50LCBpbnZhbGlkYXRlOiAndG91Y2gnfSlcbiAgICAgICAgbGV0IGMgPSAndW5jb3ZlcmVkJ1xuICAgICAgICBpZiAocmFuZ2UuY291bnQgPiAwKSB7XG4gICAgICAgICAgYyA9ICdjb3ZlcmVkJ1xuICAgICAgICB9XG4gICAgICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6IGMsIG9ubHlOb25FbXB0eTogdHJ1ZX0pXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cblxuICBjbGVhck1hcmtlcnMgKGVkaXRvcikge1xuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0QnVmZmVyKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBsZXQgbWFya2VycyA9IGVkaXRvci5nZXRCdWZmZXIoKS5maW5kTWFya2Vycyh7Y2xhc3M6ICdnb2NvdmVyJ30pXG4gICAgICBpZiAoIW1hcmtlcnMgfHwgbWFya2Vycy5sZW5ndGggPD0gMCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IG1hcmtlciBvZiBtYXJrZXJzKSB7XG4gICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVRlbXBEaXIgKCkge1xuICAgIGlmICh0aGlzLnRlbXBEaXIpIHtcbiAgICAgIHJpbXJhZih0aGlzLnRlbXBEaXIsIChlKSA9PiB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgaWYgKGUuaGFuZGxlKSB7XG4gICAgICAgICAgICBlLmhhbmRsZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnRlbXBEaXIgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ292ZXJhZ2VGaWxlICgpIHtcbiAgICB0aGlzLnJlbW92ZVRlbXBEaXIoKVxuICAgIGlmICghdGhpcy50ZW1wRGlyKSB7XG4gICAgICB0aGlzLnRlbXBEaXIgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoKSlcbiAgICB9XG4gICAgdGhpcy5jb3ZlcmFnZUZpbGUgPSBwYXRoLmpvaW4odGhpcy50ZW1wRGlyLCAnY292ZXJhZ2Uub3V0JylcbiAgfVxuXG4gIHByb2plY3RQYXRoIChlZGl0b3IpIHtcbiAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgIHJldHVybiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgfVxuXG4gICAgaWYgKGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXRMb2NhdG9yT3B0aW9ucyAoZWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBsZXQgcCA9IHRoaXMucHJvamVjdFBhdGgoZWRpdG9yKVxuICAgIGlmIChwKSB7XG4gICAgICBvcHRpb25zLmRpcmVjdG9yeSA9IHBcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZ2V0RXhlY3V0b3JPcHRpb25zIChlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgbGV0IG8gPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgb3B0aW9ucy5jd2QgPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgb3B0aW9ucy5lbnYgPSBjb25maWcuZW52aXJvbm1lbnQobylcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmVudikge1xuICAgICAgb3B0aW9ucy5lbnYgPSBwcm9jZXNzLmVudlxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgcmVhZHkgKCkge1xuICAgIHJldHVybiB0aGlzLmdvY29uZmlnICYmIHRoaXMuZ29jb25maWcoKVxuICB9XG5cbiAgcnVuQ292ZXJhZ2UgKGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5jbGVhck1hcmtlcnNGcm9tRWRpdG9ycygpXG4gICAgICB0aGlzLmNyZWF0ZUNvdmVyYWdlRmlsZSgpXG4gICAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgICBsZXQgZ28gPSBmYWxzZVxuICAgICAgbGV0IGNvdmVyID0gZmFsc2VcbiAgICAgIGxldCBsb2NhdG9yT3B0aW9ucyA9IHRoaXMuZ2V0TG9jYXRvck9wdGlvbnMoZWRpdG9yKVxuICAgICAgcmV0dXJuIGNvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnbycsIGxvY2F0b3JPcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBnbyA9IGNtZFxuICAgICAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2NvdmVyJywgbG9jYXRvck9wdGlvbnMpXG4gICAgICB9KS50aGVuKChjbWQpID0+IHtcbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBjb3ZlciA9IGNtZFxuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICghZ28gfHwgIWNvdmVyKSB7XG4gICAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbWQgPSBnb1xuICAgICAgICBsZXQgYXJncyA9IFsndGVzdCcsICctY292ZXJwcm9maWxlPScgKyB0aGlzLmNvdmVyYWdlRmlsZV1cbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgndGVzdGVyLWdvLnJ1bkNvdmVyYWdlV2l0aFNob3J0RmxhZycpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKCctc2hvcnQnKVxuICAgICAgICB9XG4gICAgICAgIGxldCBleGVjdXRvck9wdGlvbnMgPSB0aGlzLmdldEV4ZWN1dG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgICAgIHJldHVybiBjb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIGV4ZWN1dG9yT3B0aW9ucykudGhlbigocikgPT4ge1xuICAgICAgICAgIGlmIChyLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGVzdGVyLWdvOiAoc3RkZXJyKSAnICsgci5zdGRlcnIpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHIuZXhpdGNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucmFuZ2VzID0gcGFyc2VyLnJhbmdlcyh0aGlzLmNvdmVyYWdlRmlsZSlcbiAgICAgICAgICAgIHRoaXMuYWRkTWFya2Vyc1RvRWRpdG9ycygpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGlmIChlLmhhbmRsZSkge1xuICAgICAgICAgIGUuaGFuZGxlKClcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0IHtUZXN0ZXJ9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/tester-go/lib/tester.js
