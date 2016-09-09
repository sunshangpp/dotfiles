Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _godocView = require('./godoc-view');

var _godocView2 = _interopRequireDefault(_godocView);

'use babel';

var Godoc = (function () {
  function Godoc(goconfigFunc, gogetFunc) {
    var _this = this;

    _classCallCheck(this, Godoc);

    this.view = _godocView2['default'].create();
    this.view.setCloseCallback(function () {
      _this.hideView();
    });

    this.goconfig = goconfigFunc;
    this.goget = gogetFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'godoc:showdoc', function () {
      return _this.commandInvoked();
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor.godoc-display-active', 'godoc:hide', function () {
      return _this.hideView();
    }));
  }

  _createClass(Godoc, [{
    key: 'commandInvoked',
    value: function commandInvoked() {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      if (!this.isValidEditor(editor)) {
        return;
      }
      if (editor.isModified()) {
        editor.save();
      }

      this.hideView();
      this.marker = editor.markBufferRange(editor.getLastCursor().getCurrentWordBufferRange());

      // the decoration created here is destroyed when the corresponding marker is
      editor.decorateMarker(this.marker, {
        type: 'overlay',
        item: this.view,
        position: 'tail'
      });
      this.view.setInProgress();

      return this.checkForTool(editor).then(function (cmd) {
        if (!cmd) {
          // TODO: notification?
          return { success: false, result: null };
        }
        var file = editor.getBuffer().getPath();
        var cwd = _path2['default'].dirname(file);
        var offset = _this2.editorByteOffset(editor);
        return _this2.getDoc(file, offset, cwd, cmd);
      });
    }
  }, {
    key: 'checkForTool',
    value: function checkForTool(editor) {
      var _this3 = this;

      if (!this.goconfig || !this.goconfig()) {
        return Promise.resolve(false);
      }

      var config = this.goconfig();
      var options = {};
      if (editor && editor.getPath()) {
        options.file = editor.getPath();
        options.directory = _path2['default'].dirname(options.file);
      }

      if (!options.directory && atom.project.getPaths().length > 0) {
        options.directory = atom.project.getPaths()[0];
      }

      return config.locator.findTool('gogetdoc', options).then(function (cmd) {
        if (cmd) {
          return cmd;
        }
        // first check for Go 1.6+, if we don't have that, don't even offer to
        // 'go get', since it will definitely fail
        return config.locator.runtime(options).then(function (runtime) {
          if (!runtime) {
            return false;
          }
          var components = runtime.semver.split('.');
          if (!components || components.length < 2) {
            return false;
          }
          var minor = parseInt(components[1]);
          if (minor < 6) {
            atom.notifications.addError('godoc requires Go 1.6 or later', {
              detail: 'The godoc package uses the `gogetdoc` tool, which requires Go 1.6 or later; please update your Go installation to use this package.',
              dismissable: true
            });
            _this3.hideView();
            return false;
          }
          if (!_this3.goget || !_this3.goget()) {
            _this3.hideView();
            return false;
          }
          var get = _this3.goget();
          return get.get({
            name: 'gogetdoc',
            packageName: 'gogetdoc',
            packagePath: 'github.com/zmb3/gogetdoc',
            type: 'missing'
          }).then(function (r) {
            if (r.success) {
              return config.locator.findTool('gogetdoc', options);
            }
            _this3.hideView();
            console.log('gogetdoc is not available and could not be installed via "go get -u github.com/zmb3/gogetdoc"; please manually install it to enable doc functionality');
            return false;
          })['catch'](function (e) {
            console.log(e);
          });
        });
      });
    }
  }, {
    key: 'hideView',
    value: function hideView() {
      if (this.marker) {
        this.marker.destroy();
        this.marker = null;
      }
      if (this.view) {
        this.view.removeActiveClassFromEditor();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.hideView();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.goconfig = null;
    }
  }, {
    key: 'getDoc',
    value: function getDoc(file, offset, cwd, cmd) {
      var _this4 = this;

      var config = this.goconfig();
      if (!config || !config.executor) {
        return { success: false, result: null };
      }

      // use a large line length because Atom will wrap the paragraphs automatically
      var args = ['-pos', file + ':#' + offset, '-linelength', '999'];

      return config.executor.exec(cmd, args, { cwd: cwd }).then(function (r) {
        if (r.error) {
          if (r.error.code === 'ENOENT') {
            atom.notifications.addError('Missing Tool', {
              detail: 'Missing the `gogetdoc` tool.',
              dismissable: true
            });
          } else {
            atom.notifications.addError('Error', {
              detail: r.error.message,
              dismissable: true
            });
          }
          return { success: false, result: r };
        }
        var message = r.stdout.trim();
        if (message) {
          _this4.view.updateText(message);
        }

        if (r.exitcode !== 0 || r.stderr && r.stderr.trim() !== '') {
          // TODO: notification?
          return { success: false, result: r };
        }

        return { success: true, result: r };
      });
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {
      if (!editor) {
        return false;
      }
      var grammar = editor.getGrammar();
      return grammar && grammar.scopeName === 'source.go';
    }
  }, {
    key: 'editorByteOffset',
    value: function editorByteOffset(editor) {
      var cursor = editor.getLastCursor();
      var range = cursor.getCurrentWordBufferRange();
      var middle = new _atom.Point(range.start.row, Math.floor((range.start.column + range.end.column) / 2));
      var charOffset = editor.buffer.characterIndexForPosition(middle);
      var text = editor.getText().substring(0, charOffset);
      return Buffer.byteLength(text, 'utf8');
    }
  }]);

  return Godoc;
})();

exports.Godoc = Godoc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZG9jL2xpYi9nb2RvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNrQixNQUFNOzt5QkFDekIsY0FBYzs7OztBQUpwQyxXQUFXLENBQUE7O0lBTUwsS0FBSztBQUNHLFdBRFIsS0FBSyxDQUNJLFlBQVksRUFBRSxTQUFTLEVBQUU7OzswQkFEbEMsS0FBSzs7QUFFUCxRQUFJLENBQUMsSUFBSSxHQUFHLHVCQUFVLE1BQU0sRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBTTtBQUFFLFlBQUssUUFBUSxFQUFFLENBQUE7S0FBRSxDQUFDLENBQUE7O0FBRXJELFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ3RDLGtCQUFrQixFQUFFLGVBQWUsRUFDbkM7YUFBTSxNQUFLLGNBQWMsRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBO0FBQy9CLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUN0Qyx1Q0FBdUMsRUFBRSxZQUFZLEVBQ3JEO2FBQU0sTUFBSyxRQUFRLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQTtHQUMxQjs7ZUFkRyxLQUFLOztXQWdCTSwwQkFBRzs7O0FBQ2hCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNqRCxVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMvQixlQUFNO09BQ1A7QUFDRCxVQUFJLE1B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QkFBeUIsRUFBRSxDQUFBO0FBQzlDLFVBQUksTUFBTSxHQUFHLGdCQUFVLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDaEcsVUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRSxVQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNwRCxhQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0tBQ3ZDOzs7U0FyTEcsS0FBSzs7O1FBd0xILEtBQUssR0FBTCxLQUFLIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZG9jL2xpYi9nb2RvYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIFBvaW50fSBmcm9tICdhdG9tJ1xuaW1wb3J0IEdvZG9jVmlldyBmcm9tICcuL2dvZG9jLXZpZXcnXG5cbmNsYXNzIEdvZG9jIHtcbiAgY29uc3RydWN0b3IgKGdvY29uZmlnRnVuYywgZ29nZXRGdW5jKSB7XG4gICAgdGhpcy52aWV3ID0gR29kb2NWaWV3LmNyZWF0ZSgpXG4gICAgdGhpcy52aWV3LnNldENsb3NlQ2FsbGJhY2soKCkgPT4geyB0aGlzLmhpZGVWaWV3KCkgfSlcblxuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ0Z1bmNcbiAgICB0aGlzLmdvZ2V0ID0gZ29nZXRGdW5jXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcicsICdnb2RvYzpzaG93ZG9jJyxcbiAgICAgICgpID0+IHRoaXMuY29tbWFuZEludm9rZWQoKSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yLmdvZG9jLWRpc3BsYXktYWN0aXZlJywgJ2dvZG9jOmhpZGUnLFxuICAgICAgKCkgPT4gdGhpcy5oaWRlVmlldygpKSlcbiAgfVxuXG4gIGNvbW1hbmRJbnZva2VkICgpIHtcbiAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCF0aGlzLmlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgfVxuXG4gICAgdGhpcy5oaWRlVmlldygpXG4gICAgdGhpcy5tYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSgpKVxuXG4gICAgLy8gdGhlIGRlY29yYXRpb24gY3JlYXRlZCBoZXJlIGlzIGRlc3Ryb3llZCB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIG1hcmtlciBpc1xuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLm1hcmtlciwge1xuICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgcG9zaXRpb246ICd0YWlsJ1xuICAgIH0pXG4gICAgdGhpcy52aWV3LnNldEluUHJvZ3Jlc3MoKVxuXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tGb3JUb29sKGVkaXRvcikudGhlbigoY21kKSA9PiB7XG4gICAgICBpZiAoIWNtZCkge1xuICAgICAgICAvLyBUT0RPOiBub3RpZmljYXRpb24/XG4gICAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIHJlc3VsdDogbnVsbH1cbiAgICAgIH1cbiAgICAgIGxldCBmaWxlID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldFBhdGgoKVxuICAgICAgbGV0IGN3ZCA9IHBhdGguZGlybmFtZShmaWxlKVxuICAgICAgbGV0IG9mZnNldCA9IHRoaXMuZWRpdG9yQnl0ZU9mZnNldChlZGl0b3IpXG4gICAgICByZXR1cm4gdGhpcy5nZXREb2MoZmlsZSwgb2Zmc2V0LCBjd2QsIGNtZClcbiAgICB9KVxuICB9XG5cbiAgY2hlY2tGb3JUb29sIChlZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZ29jb25maWcgfHwgIXRoaXMuZ29jb25maWcoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgb3B0aW9ucy5maWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUob3B0aW9ucy5maWxlKVxuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5kaXJlY3RvcnkgJiYgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoID4gMCkge1xuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgIH1cblxuICAgIHJldHVybiBjb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29nZXRkb2MnLCBvcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmIChjbWQpIHtcbiAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgfVxuICAgICAgLy8gZmlyc3QgY2hlY2sgZm9yIEdvIDEuNissIGlmIHdlIGRvbid0IGhhdmUgdGhhdCwgZG9uJ3QgZXZlbiBvZmZlciB0b1xuICAgICAgLy8gJ2dvIGdldCcsIHNpbmNlIGl0IHdpbGwgZGVmaW5pdGVseSBmYWlsXG4gICAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IucnVudGltZShvcHRpb25zKS50aGVuKChydW50aW1lKSA9PiB7XG4gICAgICAgIGlmICghcnVudGltZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGxldCBjb21wb25lbnRzID0gcnVudGltZS5zZW12ZXIuc3BsaXQoJy4nKVxuICAgICAgICBpZiAoIWNvbXBvbmVudHMgfHwgY29tcG9uZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1pbm9yID0gcGFyc2VJbnQoY29tcG9uZW50c1sxXSlcbiAgICAgICAgaWYgKG1pbm9yIDwgNikge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignZ29kb2MgcmVxdWlyZXMgR28gMS42IG9yIGxhdGVyJywge1xuICAgICAgICAgICAgZGV0YWlsOiAnVGhlIGdvZG9jIHBhY2thZ2UgdXNlcyB0aGUgYGdvZ2V0ZG9jYCB0b29sLCB3aGljaCByZXF1aXJlcyBHbyAxLjYgb3IgbGF0ZXI7IHBsZWFzZSB1cGRhdGUgeW91ciBHbyBpbnN0YWxsYXRpb24gdG8gdXNlIHRoaXMgcGFja2FnZS4nLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuaGlkZVZpZXcoKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5nb2dldCB8fCAhdGhpcy5nb2dldCgpKSB7XG4gICAgICAgICAgdGhpcy5oaWRlVmlldygpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGdldCA9IHRoaXMuZ29nZXQoKVxuICAgICAgICByZXR1cm4gZ2V0LmdldCh7XG4gICAgICAgICAgbmFtZTogJ2dvZ2V0ZG9jJyxcbiAgICAgICAgICBwYWNrYWdlTmFtZTogJ2dvZ2V0ZG9jJyxcbiAgICAgICAgICBwYWNrYWdlUGF0aDogJ2dpdGh1Yi5jb20vem1iMy9nb2dldGRvYycsXG4gICAgICAgICAgdHlwZTogJ21pc3NpbmcnXG4gICAgICAgIH0pLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICBpZiAoci5zdWNjZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvZ2V0ZG9jJywgb3B0aW9ucylcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5oaWRlVmlldygpXG4gICAgICAgICAgY29uc29sZS5sb2coJ2dvZ2V0ZG9jIGlzIG5vdCBhdmFpbGFibGUgYW5kIGNvdWxkIG5vdCBiZSBpbnN0YWxsZWQgdmlhIFwiZ28gZ2V0IC11IGdpdGh1Yi5jb20vem1iMy9nb2dldGRvY1wiOyBwbGVhc2UgbWFudWFsbHkgaW5zdGFsbCBpdCB0byBlbmFibGUgZG9jIGZ1bmN0aW9uYWxpdHknKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBoaWRlVmlldyAoKSB7XG4gICAgaWYgKHRoaXMubWFya2VyKSB7XG4gICAgICB0aGlzLm1hcmtlci5kZXN0cm95KClcbiAgICAgIHRoaXMubWFya2VyID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlQWN0aXZlQ2xhc3NGcm9tRWRpdG9yKClcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLmhpZGVWaWV3KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gIH1cblxuICBnZXREb2MgKGZpbGUsIG9mZnNldCwgY3dkLCBjbWQpIHtcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKCFjb25maWcgfHwgIWNvbmZpZy5leGVjdXRvcikge1xuICAgICAgcmV0dXJuIHtzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiBudWxsfVxuICAgIH1cblxuICAgIC8vIHVzZSBhIGxhcmdlIGxpbmUgbGVuZ3RoIGJlY2F1c2UgQXRvbSB3aWxsIHdyYXAgdGhlIHBhcmFncmFwaHMgYXV0b21hdGljYWxseVxuICAgIGxldCBhcmdzID0gWyctcG9zJywgYCR7ZmlsZX06IyR7b2Zmc2V0fWAsICctbGluZWxlbmd0aCcsICc5OTknXVxuXG4gICAgcmV0dXJuIGNvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywge2N3ZDogY3dkfSkudGhlbigocikgPT4ge1xuICAgICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgICAgaWYgKHIuZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ01pc3NpbmcgVG9vbCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogJ01pc3NpbmcgdGhlIGBnb2dldGRvY2AgdG9vbC4nLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3InLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHIuZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3N1Y2Nlc3M6IGZhbHNlLCByZXN1bHQ6IHJ9XG4gICAgICB9XG4gICAgICBsZXQgbWVzc2FnZSA9IHIuc3Rkb3V0LnRyaW0oKVxuICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy52aWV3LnVwZGF0ZVRleHQobWVzc2FnZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHIuZXhpdGNvZGUgIT09IDAgfHwgci5zdGRlcnIgJiYgci5zdGRlcnIudHJpbSgpICE9PSAnJykge1xuICAgICAgICAvLyBUT0RPOiBub3RpZmljYXRpb24/XG4gICAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIHJlc3VsdDogcn1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlLCByZXN1bHQ6IHJ9XG4gICAgfSlcbiAgfVxuXG4gIGlzVmFsaWRFZGl0b3IgKGVkaXRvcikge1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG4gICAgcmV0dXJuIGdyYW1tYXIgJiYgZ3JhbW1hci5zY29wZU5hbWUgPT09ICdzb3VyY2UuZ28nXG4gIH1cblxuICBlZGl0b3JCeXRlT2Zmc2V0IChlZGl0b3IpIHtcbiAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGxldCByYW5nZSA9IGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKClcbiAgICBsZXQgbWlkZGxlID0gbmV3IFBvaW50KHJhbmdlLnN0YXJ0LnJvdywgTWF0aC5mbG9vcigocmFuZ2Uuc3RhcnQuY29sdW1uICsgcmFuZ2UuZW5kLmNvbHVtbikgLyAyKSlcbiAgICBsZXQgY2hhck9mZnNldCA9IGVkaXRvci5idWZmZXIuY2hhcmFjdGVySW5kZXhGb3JQb3NpdGlvbihtaWRkbGUpXG4gICAgbGV0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpLnN1YnN0cmluZygwLCBjaGFyT2Zmc2V0KVxuICAgIHJldHVybiBCdWZmZXIuYnl0ZUxlbmd0aCh0ZXh0LCAndXRmOCcpXG4gIH1cbn1cblxuZXhwb3J0IHtHb2RvY31cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/godoc/lib/godoc.js
