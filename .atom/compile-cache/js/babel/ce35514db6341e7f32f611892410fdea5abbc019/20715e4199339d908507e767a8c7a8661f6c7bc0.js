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
    this.markedEditors = new Map();
    this.running = false;
    _temp2['default'].track();
  }

  _createClass(Tester, [{
    key: 'dispose',
    value: function dispose() {
      this.running = true;
      this.removeTempDir();
      this.clearMarkersFromEditors();
      if (this.markedEditors) {
        this.markedEditors.clear();
      }
      this.markedEditors = null;
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
      if (!editor.id) {
        return;
      }

      if (!file) {
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
        var coveredLayer = editor.addMarkerLayer();
        var uncoveredLayer = editor.addMarkerLayer();
        this.markedEditors.set(editor.id, coveredLayer.id + ',' + uncoveredLayer.id);
        for (var range of editorRanges) {
          if (range.count > 0) {
            coveredLayer.markBufferRange(range.range, { invalidate: 'touch' });
          } else {
            uncoveredLayer.markBufferRange(range.range, { invalidate: 'touch' });
          }
        }
        editor.decorateMarkerLayer(coveredLayer, { type: 'highlight', 'class': 'covered', onlyNonEmpty: true });
        editor.decorateMarkerLayer(uncoveredLayer, { type: 'highlight', 'class': 'uncovered', onlyNonEmpty: true });
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: 'clearMarkers',
    value: function clearMarkers(editor) {
      if (!editor || !editor.id || !editor.getBuffer() || !this.markedEditors) {
        return;
      }

      if (!this.markedEditors.has(editor.id)) {
        return;
      }

      try {
        var layersid = this.markedEditors.get(editor.id);
        if (!layersid) {
          return;
        }

        for (var layerid of layersid.split(',')) {
          var layer = editor.getMarkerLayer(layerid);
          if (layer) {
            layer.destroy();
          }
        }

        this.markedEditors['delete'](editor.id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3Rlc3Rlci1nby9saWIvdGVzdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWtDLE1BQU07O3NCQUMxQixRQUFROzs7O2tCQUNQLElBQUk7Ozs7NkJBQ0Esa0JBQWtCOzs7O29CQUNwQixNQUFNOzs7O3NCQUNKLFFBQVE7Ozs7b0JBQ1YsTUFBTTs7OztBQVJ2QixXQUFXLENBQUE7O0lBVUwsTUFBTTtBQUNFLFdBRFIsTUFBTSxDQUNHLFlBQVksRUFBRSxTQUFTLEVBQUU7MEJBRGxDLE1BQU07O0FBRVIsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsK0JBQXlCLENBQUE7QUFDbEQsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNyQixRQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDOUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDcEIsc0JBQUssS0FBSyxFQUFFLENBQUE7R0FDYjs7ZUFiRyxNQUFNOztXQWVGLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbkIsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFBO0FBQzlCLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO09BQzNCO0FBQ0QsVUFBSSxDQUFDLGFB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Q2QsaUJBQUssT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixpQkFBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7U0FDekIsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztTQTlURyxNQUFNOzs7UUFnVUosTUFBTSxHQUFOLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdGVzdGVyLWdvL2xpYi90ZXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGFyc2VyIGZyb20gJy4vZ29jb3Zlci1wYXJzZXInXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHJpbXJhZiBmcm9tICdyaW1yYWYnXG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJ1xuXG5jbGFzcyBUZXN0ZXIge1xuICBjb25zdHJ1Y3RvciAoZ29jb25maWdGdW5jLCBnb2dldEZ1bmMpIHtcbiAgICB0aGlzLmdvZ2V0ID0gZ29nZXRGdW5jXG4gICAgdGhpcy5nb2NvbmZpZyA9IGdvY29uZmlnRnVuY1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMub2JzZXJ2ZUNvbmZpZygpXG4gICAgdGhpcy5vYnNlcnZlVGV4dEVkaXRvcnMoKVxuICAgIHRoaXMuaGFuZGxlQ29tbWFuZHMoKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9TYXZlRXZlbnRzKClcbiAgICB0aGlzLm1hcmtlZEVkaXRvcnMgPSBuZXcgTWFwKClcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZVxuICAgIHRlbXAudHJhY2soKVxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuICAgIHRoaXMucmVtb3ZlVGVtcERpcigpXG4gICAgdGhpcy5jbGVhck1hcmtlcnNGcm9tRWRpdG9ycygpXG4gICAgaWYgKHRoaXMubWFya2VkRWRpdG9ycykge1xuICAgICAgdGhpcy5tYXJrZWRFZGl0b3JzLmNsZWFyKClcbiAgICB9XG4gICAgdGhpcy5tYXJrZWRFZGl0b3JzID0gbnVsbFxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIGlmICh0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29nZXQgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgICB0aGlzLnJ1bm5pbmcgPSBudWxsXG4gIH1cblxuICBoYW5kbGVDb21tYW5kcyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnZ29sYW5nOmdvY292ZXInLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucmVhZHkoKSB8fCAhdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMucnVuQ292ZXJhZ2UoKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2dvbGFuZzpjbGVhcmdvY292ZXInLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucmVhZHkoKSB8fCAhdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYXJNYXJrZXJzRnJvbUVkaXRvcnMoKVxuICAgIH0pKVxuICB9XG5cbiAgb2JzZXJ2ZVRleHRFZGl0b3JzICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLmFkZE1hcmtlcnNUb0VkaXRvcihlZGl0b3IpXG4gICAgfSkpXG4gIH1cblxuICBvYnNlcnZlQ29uZmlnICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ3Rlc3Rlci1nby5ydW5Db3ZlcmFnZU9uU2F2ZScsIChydW5Db3ZlcmFnZU9uU2F2ZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH1cbiAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICBpZiAocnVuQ292ZXJhZ2VPblNhdmUpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUb1NhdmVFdmVudHMoKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgc3Vic2NyaWJlVG9TYXZlRXZlbnRzICgpIHtcbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgaWYgKCFlZGl0b3IgfHwgIWVkaXRvci5nZXRCdWZmZXIoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IGJ1ZmZlclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmFkZChlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRTYXZlKChmaWxlUGF0aCkgPT4ge1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd0ZXN0ZXItZ28ucnVuQ292ZXJhZ2VPblNhdmUnKSkge1xuICAgICAgICAgIHRoaXMucnVuQ292ZXJhZ2UoZWRpdG9yKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICAgIGJ1ZmZlclN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSkpXG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmFkZChidWZmZXJTdWJzY3JpcHRpb25zKVxuICAgIH0pKVxuICB9XG5cbiAgZ2V0RWRpdG9yICgpIHtcbiAgICBpZiAoIWF0b20gfHwgIWF0b20ud29ya3NwYWNlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHJldHVybiBlZGl0b3JcbiAgfVxuXG4gIGlzVmFsaWRFZGl0b3IgKGVkaXRvcikge1xuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0R3JhbW1hcigpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT09ICdzb3VyY2UuZ28nXG4gIH1cblxuICBhZGRNYXJrZXJzVG9FZGl0b3JzICgpIHtcbiAgICBsZXQgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgZWRpdG9ycykge1xuICAgICAgdGhpcy5hZGRNYXJrZXJzVG9FZGl0b3IoZWRpdG9yKVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyTWFya2Vyc0Zyb21FZGl0b3JzICgpIHtcbiAgICBsZXQgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgZWRpdG9ycykge1xuICAgICAgdGhpcy5jbGVhck1hcmtlcnMoZWRpdG9yKVxuICAgIH1cbiAgfVxuXG4gIGFkZE1hcmtlcnNUb0VkaXRvciAoZWRpdG9yKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBmaWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmICghZWRpdG9yLmlkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIWZpbGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmNsZWFyTWFya2VycyhlZGl0b3IpXG4gICAgaWYgKCF0aGlzLnJhbmdlcyB8fCB0aGlzLnJhbmdlcy5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IGVkaXRvclJhbmdlcyA9IF8uZmlsdGVyKHRoaXMucmFuZ2VzLCAocikgPT4geyByZXR1cm4gXy5lbmRzV2l0aChmaWxlLCByLmZpbGUpIH0pXG5cbiAgICBpZiAoIWVkaXRvclJhbmdlcyB8fCBlZGl0b3JSYW5nZXMubGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBsZXQgY292ZXJlZExheWVyID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKClcbiAgICAgIGxldCB1bmNvdmVyZWRMYXllciA9IGVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgICB0aGlzLm1hcmtlZEVkaXRvcnMuc2V0KGVkaXRvci5pZCwgY292ZXJlZExheWVyLmlkICsgJywnICsgdW5jb3ZlcmVkTGF5ZXIuaWQpXG4gICAgICBmb3IgKGxldCByYW5nZSBvZiBlZGl0b3JSYW5nZXMpIHtcbiAgICAgICAgaWYgKHJhbmdlLmNvdW50ID4gMCkge1xuICAgICAgICAgIGNvdmVyZWRMYXllci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UucmFuZ2UsIHtpbnZhbGlkYXRlOiAndG91Y2gnfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bmNvdmVyZWRMYXllci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UucmFuZ2UsIHtpbnZhbGlkYXRlOiAndG91Y2gnfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWRpdG9yLmRlY29yYXRlTWFya2VyTGF5ZXIoY292ZXJlZExheWVyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnY292ZXJlZCcsIG9ubHlOb25FbXB0eTogdHJ1ZX0pXG4gICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXJMYXllcih1bmNvdmVyZWRMYXllciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ3VuY292ZXJlZCcsIG9ubHlOb25FbXB0eTogdHJ1ZX0pXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cblxuICBjbGVhck1hcmtlcnMgKGVkaXRvcikge1xuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuaWQgfHwgIWVkaXRvci5nZXRCdWZmZXIoKSB8fCAhdGhpcy5tYXJrZWRFZGl0b3JzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubWFya2VkRWRpdG9ycy5oYXMoZWRpdG9yLmlkKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGxldCBsYXllcnNpZCA9IHRoaXMubWFya2VkRWRpdG9ycy5nZXQoZWRpdG9yLmlkKVxuICAgICAgaWYgKCFsYXllcnNpZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbGF5ZXJpZCBvZiBsYXllcnNpZC5zcGxpdCgnLCcpKSB7XG4gICAgICAgIGxldCBsYXllciA9IGVkaXRvci5nZXRNYXJrZXJMYXllcihsYXllcmlkKVxuICAgICAgICBpZiAobGF5ZXIpIHtcbiAgICAgICAgICBsYXllci5kZXN0cm95KClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLm1hcmtlZEVkaXRvcnMuZGVsZXRlKGVkaXRvci5pZClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVRlbXBEaXIgKCkge1xuICAgIGlmICh0aGlzLnRlbXBEaXIpIHtcbiAgICAgIHJpbXJhZih0aGlzLnRlbXBEaXIsIChlKSA9PiB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgaWYgKGUuaGFuZGxlKSB7XG4gICAgICAgICAgICBlLmhhbmRsZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnRlbXBEaXIgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ292ZXJhZ2VGaWxlICgpIHtcbiAgICB0aGlzLnJlbW92ZVRlbXBEaXIoKVxuICAgIGlmICghdGhpcy50ZW1wRGlyKSB7XG4gICAgICB0aGlzLnRlbXBEaXIgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoKSlcbiAgICB9XG4gICAgdGhpcy5jb3ZlcmFnZUZpbGUgPSBwYXRoLmpvaW4odGhpcy50ZW1wRGlyLCAnY292ZXJhZ2Uub3V0JylcbiAgfVxuXG4gIHByb2plY3RQYXRoIChlZGl0b3IpIHtcbiAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgIHJldHVybiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgfVxuXG4gICAgaWYgKGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXRMb2NhdG9yT3B0aW9ucyAoZWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBsZXQgcCA9IHRoaXMucHJvamVjdFBhdGgoZWRpdG9yKVxuICAgIGlmIChwKSB7XG4gICAgICBvcHRpb25zLmRpcmVjdG9yeSA9IHBcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZ2V0RXhlY3V0b3JPcHRpb25zIChlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgbGV0IG8gPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgb3B0aW9ucy5jd2QgPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgb3B0aW9ucy5lbnYgPSBjb25maWcuZW52aXJvbm1lbnQobylcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmVudikge1xuICAgICAgb3B0aW9ucy5lbnYgPSBwcm9jZXNzLmVudlxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgcmVhZHkgKCkge1xuICAgIHJldHVybiB0aGlzLmdvY29uZmlnICYmIHRoaXMuZ29jb25maWcoKVxuICB9XG5cbiAgcnVuQ292ZXJhZ2UgKGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5jbGVhck1hcmtlcnNGcm9tRWRpdG9ycygpXG4gICAgICB0aGlzLmNyZWF0ZUNvdmVyYWdlRmlsZSgpXG4gICAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgICBsZXQgZ28gPSBmYWxzZVxuICAgICAgbGV0IGNvdmVyID0gZmFsc2VcbiAgICAgIGxldCBsb2NhdG9yT3B0aW9ucyA9IHRoaXMuZ2V0TG9jYXRvck9wdGlvbnMoZWRpdG9yKVxuICAgICAgcmV0dXJuIGNvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnbycsIGxvY2F0b3JPcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBnbyA9IGNtZFxuICAgICAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2NvdmVyJywgbG9jYXRvck9wdGlvbnMpXG4gICAgICB9KS50aGVuKChjbWQpID0+IHtcbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBjb3ZlciA9IGNtZFxuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICghZ28gfHwgIWNvdmVyKSB7XG4gICAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbWQgPSBnb1xuICAgICAgICBsZXQgYXJncyA9IFsndGVzdCcsICctY292ZXJwcm9maWxlPScgKyB0aGlzLmNvdmVyYWdlRmlsZV1cbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgndGVzdGVyLWdvLnJ1bkNvdmVyYWdlV2l0aFNob3J0RmxhZycpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKCctc2hvcnQnKVxuICAgICAgICB9XG4gICAgICAgIGxldCBleGVjdXRvck9wdGlvbnMgPSB0aGlzLmdldEV4ZWN1dG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgICAgIHJldHVybiBjb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIGV4ZWN1dG9yT3B0aW9ucykudGhlbigocikgPT4ge1xuICAgICAgICAgIGlmIChyLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGVzdGVyLWdvOiAoc3RkZXJyKSAnICsgci5zdGRlcnIpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHIuZXhpdGNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucmFuZ2VzID0gcGFyc2VyLnJhbmdlcyh0aGlzLmNvdmVyYWdlRmlsZSlcbiAgICAgICAgICAgIHRoaXMuYWRkTWFya2Vyc1RvRWRpdG9ycygpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGlmIChlLmhhbmRsZSkge1xuICAgICAgICAgIGUuaGFuZGxlKClcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuZXhwb3J0IHtUZXN0ZXJ9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/tester-go/lib/tester.js
