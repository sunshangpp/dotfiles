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

        // package up unsaved buffers in the Guru archive format
        var archive = '';
        for (var e of atom.workspace.getTextEditors()) {
          if (e.isModified() && _this2.isValidEditor(e)) {
            archive += e.getTitle() + '\n';
            archive += Buffer.byteLength(e.getText(), 'utf8') + '\n';
            archive += e.getText();
          }
        }
        return _this2.getDoc(file, offset, cwd, cmd, archive);
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
          var minor = parseInt(components[1], 10);
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
    value: function getDoc(file, offset, cwd, cmd, stdin) {
      var _this4 = this;

      var config = this.goconfig();
      if (!config || !config.executor) {
        return { success: false, result: null };
      }

      // use a large line length because Atom will wrap the paragraphs automatically
      var args = ['-pos', file + ':#' + offset, '-linelength', '999'];

      var options = { cwd: cwd };
      if (stdin && stdin !== '') {
        args.push('-modified');
        options.input = stdin;
        console.log(stdin);
      }

      return config.executor.exec(cmd, args, options).then(function (r) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZG9jL2xpYi9nb2RvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNrQixNQUFNOzt5QkFDekIsY0FBYzs7OztBQUpwQyxXQUFXLENBQUE7O0lBTUwsS0FBSztBQUNHLFdBRFIsS0FBSyxDQUNJLFlBQVksRUFBRSxTQUFTLEVBQUU7OzswQkFEbEMsS0FBSzs7QUFFUCxRQUFJLENBQUMsSUFBSSxHQUFHLHVCQUFVLE1BQU0sRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBTTtBQUFFLFlBQUssUUFBUSxFQUFFLENBQUE7S0FBRSxDQUFDLENBQUE7O0FBRXJELFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ3RDLGtCQUFrQixFQUFFLGVBQWUsRUFDbkM7YUFBTSxNQUFLLGNBQWMsRUFBRTtLQUFBLENBQUMsQ0FBQyxDQUFBO0FBQy9CLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUN0Qyx1Q0FBdUMsRUFBRSxZQUFZLEVBQ3JEO2FBQU0sTUFBSyxRQUFRLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQTtHQUMxQjs7ZUFkRyxLQUFLOztXQWdCTSwwQkFBRzs7O0FBQ2hCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNqRCxVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMvQixlQUFNO09BQ1A7O0FBRUQsVUFBSSxD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OztTQW5NRyxLQUFLOzs7UUFzTUgsS0FBSyxHQUFMLEtBQUsiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ29kb2MvbGliL2dvZG9jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgUG9pbnR9IGZyb20gJ2F0b20nXG5pbXBvcnQgR29kb2NWaWV3IGZyb20gJy4vZ29kb2MtdmlldydcblxuY2xhc3MgR29kb2Mge1xuICBjb25zdHJ1Y3RvciAoZ29jb25maWdGdW5jLCBnb2dldEZ1bmMpIHtcbiAgICB0aGlzLnZpZXcgPSBHb2RvY1ZpZXcuY3JlYXRlKClcbiAgICB0aGlzLnZpZXcuc2V0Q2xvc2VDYWxsYmFjaygoKSA9PiB7IHRoaXMuaGlkZVZpZXcoKSB9KVxuXG4gICAgdGhpcy5nb2NvbmZpZyA9IGdvY29uZmlnRnVuY1xuICAgIHRoaXMuZ29nZXQgPSBnb2dldEZ1bmNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yJywgJ2dvZG9jOnNob3dkb2MnLFxuICAgICAgKCkgPT4gdGhpcy5jb21tYW5kSW52b2tlZCgpKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgJ2F0b20tdGV4dC1lZGl0b3IuZ29kb2MtZGlzcGxheS1hY3RpdmUnLCAnZ29kb2M6aGlkZScsXG4gICAgICAoKSA9PiB0aGlzLmhpZGVWaWV3KCkpKVxuICB9XG5cbiAgY29tbWFuZEludm9rZWQgKCkge1xuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmhpZGVWaWV3KClcbiAgICB0aGlzLm1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKCkpXG5cbiAgICAvLyB0aGUgZGVjb3JhdGlvbiBjcmVhdGVkIGhlcmUgaXMgZGVzdHJveWVkIHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgbWFya2VyIGlzXG4gICAgZWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMubWFya2VyLCB7XG4gICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICBwb3NpdGlvbjogJ3RhaWwnXG4gICAgfSlcbiAgICB0aGlzLnZpZXcuc2V0SW5Qcm9ncmVzcygpXG5cbiAgICByZXR1cm4gdGhpcy5jaGVja0ZvclRvb2woZWRpdG9yKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmICghY21kKSB7XG4gICAgICAgIC8vIFRPRE86IG5vdGlmaWNhdGlvbj9cbiAgICAgICAgcmV0dXJuIHtzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiBudWxsfVxuICAgICAgfVxuICAgICAgbGV0IGZpbGUgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UGF0aCgpXG4gICAgICBsZXQgY3dkID0gcGF0aC5kaXJuYW1lKGZpbGUpXG4gICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5lZGl0b3JCeXRlT2Zmc2V0KGVkaXRvcilcblxuICAgICAgLy8gcGFja2FnZSB1cCB1bnNhdmVkIGJ1ZmZlcnMgaW4gdGhlIEd1cnUgYXJjaGl2ZSBmb3JtYXRcbiAgICAgIGxldCBhcmNoaXZlID0gJydcbiAgICAgIGZvciAobGV0IGUgb2YgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKSkge1xuICAgICAgICBpZiAoZS5pc01vZGlmaWVkKCkgJiYgdGhpcy5pc1ZhbGlkRWRpdG9yKGUpKSB7XG4gICAgICAgICAgYXJjaGl2ZSArPSBlLmdldFRpdGxlKCkgKyAnXFxuJ1xuICAgICAgICAgIGFyY2hpdmUgKz0gQnVmZmVyLmJ5dGVMZW5ndGgoZS5nZXRUZXh0KCksICd1dGY4JykgKyAnXFxuJ1xuICAgICAgICAgIGFyY2hpdmUgKz0gZS5nZXRUZXh0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0RG9jKGZpbGUsIG9mZnNldCwgY3dkLCBjbWQsIGFyY2hpdmUpXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrRm9yVG9vbCAoZWRpdG9yKSB7XG4gICAgaWYgKCF0aGlzLmdvY29uZmlnIHx8ICF0aGlzLmdvY29uZmlnKCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgIG9wdGlvbnMuZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIG9wdGlvbnMuZGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKG9wdGlvbnMuZmlsZSlcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMuZGlyZWN0b3J5ICYmIGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCA+IDApIHtcbiAgICAgIG9wdGlvbnMuZGlyZWN0b3J5ID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvZ2V0ZG9jJywgb3B0aW9ucykudGhlbigoY21kKSA9PiB7XG4gICAgICBpZiAoY21kKSB7XG4gICAgICAgIHJldHVybiBjbWRcbiAgICAgIH1cbiAgICAgIC8vIGZpcnN0IGNoZWNrIGZvciBHbyAxLjYrLCBpZiB3ZSBkb24ndCBoYXZlIHRoYXQsIGRvbid0IGV2ZW4gb2ZmZXIgdG9cbiAgICAgIC8vICdnbyBnZXQnLCBzaW5jZSBpdCB3aWxsIGRlZmluaXRlbHkgZmFpbFxuICAgICAgcmV0dXJuIGNvbmZpZy5sb2NhdG9yLnJ1bnRpbWUob3B0aW9ucykudGhlbigocnVudGltZSkgPT4ge1xuICAgICAgICBpZiAoIXJ1bnRpbWUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29tcG9uZW50cyA9IHJ1bnRpbWUuc2VtdmVyLnNwbGl0KCcuJylcbiAgICAgICAgaWYgKCFjb21wb25lbnRzIHx8IGNvbXBvbmVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGxldCBtaW5vciA9IHBhcnNlSW50KGNvbXBvbmVudHNbMV0sIDEwKVxuICAgICAgICBpZiAobWlub3IgPCA2KSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdnb2RvYyByZXF1aXJlcyBHbyAxLjYgb3IgbGF0ZXInLCB7XG4gICAgICAgICAgICBkZXRhaWw6ICdUaGUgZ29kb2MgcGFja2FnZSB1c2VzIHRoZSBgZ29nZXRkb2NgIHRvb2wsIHdoaWNoIHJlcXVpcmVzIEdvIDEuNiBvciBsYXRlcjsgcGxlYXNlIHVwZGF0ZSB5b3VyIEdvIGluc3RhbGxhdGlvbiB0byB1c2UgdGhpcyBwYWNrYWdlLicsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5oaWRlVmlldygpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdvZ2V0IHx8ICF0aGlzLmdvZ2V0KCkpIHtcbiAgICAgICAgICB0aGlzLmhpZGVWaWV3KClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBsZXQgZ2V0ID0gdGhpcy5nb2dldCgpXG4gICAgICAgIHJldHVybiBnZXQuZ2V0KHtcbiAgICAgICAgICBuYW1lOiAnZ29nZXRkb2MnLFxuICAgICAgICAgIHBhY2thZ2VOYW1lOiAnZ29nZXRkb2MnLFxuICAgICAgICAgIHBhY2thZ2VQYXRoOiAnZ2l0aHViLmNvbS96bWIzL2dvZ2V0ZG9jJyxcbiAgICAgICAgICB0eXBlOiAnbWlzc2luZydcbiAgICAgICAgfSkudGhlbigocikgPT4ge1xuICAgICAgICAgIGlmIChyLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29nZXRkb2MnLCBvcHRpb25zKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmhpZGVWaWV3KClcbiAgICAgICAgICBjb25zb2xlLmxvZygnZ29nZXRkb2MgaXMgbm90IGF2YWlsYWJsZSBhbmQgY291bGQgbm90IGJlIGluc3RhbGxlZCB2aWEgXCJnbyBnZXQgLXUgZ2l0aHViLmNvbS96bWIzL2dvZ2V0ZG9jXCI7IHBsZWFzZSBtYW51YWxseSBpbnN0YWxsIGl0IHRvIGVuYWJsZSBkb2MgZnVuY3Rpb25hbGl0eScpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhpZGVWaWV3ICgpIHtcbiAgICBpZiAodGhpcy5tYXJrZXIpIHtcbiAgICAgIHRoaXMubWFya2VyLmRlc3Ryb3koKVxuICAgICAgdGhpcy5tYXJrZXIgPSBudWxsXG4gICAgfVxuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5yZW1vdmVBY3RpdmVDbGFzc0Zyb21FZGl0b3IoKVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMuaGlkZVZpZXcoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgfVxuXG4gIGdldERvYyAoZmlsZSwgb2Zmc2V0LCBjd2QsIGNtZCwgc3RkaW4pIHtcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKCFjb25maWcgfHwgIWNvbmZpZy5leGVjdXRvcikge1xuICAgICAgcmV0dXJuIHtzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiBudWxsfVxuICAgIH1cblxuICAgIC8vIHVzZSBhIGxhcmdlIGxpbmUgbGVuZ3RoIGJlY2F1c2UgQXRvbSB3aWxsIHdyYXAgdGhlIHBhcmFncmFwaHMgYXV0b21hdGljYWxseVxuICAgIGxldCBhcmdzID0gWyctcG9zJywgYCR7ZmlsZX06IyR7b2Zmc2V0fWAsICctbGluZWxlbmd0aCcsICc5OTknXVxuXG4gICAgbGV0IG9wdGlvbnMgPSB7Y3dkOiBjd2R9XG4gICAgaWYgKHN0ZGluICYmIHN0ZGluICE9PSAnJykge1xuICAgICAgYXJncy5wdXNoKCctbW9kaWZpZWQnKVxuICAgICAgb3B0aW9ucy5pbnB1dCA9IHN0ZGluXG4gICAgICBjb25zb2xlLmxvZyhzdGRpbilcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCBhcmdzLCBvcHRpb25zKS50aGVuKChyKSA9PiB7XG4gICAgICBpZiAoci5lcnJvcikge1xuICAgICAgICBpZiAoci5lcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTWlzc2luZyBUb29sJywge1xuICAgICAgICAgICAgZGV0YWlsOiAnTWlzc2luZyB0aGUgYGdvZ2V0ZG9jYCB0b29sLicsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdFcnJvcicsIHtcbiAgICAgICAgICAgIGRldGFpbDogci5lcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIHJlc3VsdDogcn1cbiAgICAgIH1cbiAgICAgIGxldCBtZXNzYWdlID0gci5zdGRvdXQudHJpbSgpXG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICB0aGlzLnZpZXcudXBkYXRlVGV4dChtZXNzYWdlKVxuICAgICAgfVxuXG4gICAgICBpZiAoci5leGl0Y29kZSAhPT0gMCB8fCByLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgIC8vIFRPRE86IG5vdGlmaWNhdGlvbj9cbiAgICAgICAgcmV0dXJuIHtzdWNjZXNzOiBmYWxzZSwgcmVzdWx0OiByfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge3N1Y2Nlc3M6IHRydWUsIHJlc3VsdDogcn1cbiAgICB9KVxuICB9XG5cbiAgaXNWYWxpZEVkaXRvciAoZWRpdG9yKSB7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKClcbiAgICByZXR1cm4gZ3JhbW1hciAmJiBncmFtbWFyLnNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5nbydcbiAgfVxuXG4gIGVkaXRvckJ5dGVPZmZzZXQgKGVkaXRvcikge1xuICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgbGV0IHJhbmdlID0gY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2UoKVxuICAgIGxldCBtaWRkbGUgPSBuZXcgUG9pbnQocmFuZ2Uuc3RhcnQucm93LCBNYXRoLmZsb29yKChyYW5nZS5zdGFydC5jb2x1bW4gKyByYW5nZS5lbmQuY29sdW1uKSAvIDIpKVxuICAgIGxldCBjaGFyT2Zmc2V0ID0gZWRpdG9yLmJ1ZmZlci5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKG1pZGRsZSlcbiAgICBsZXQgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCkuc3Vic3RyaW5nKDAsIGNoYXJPZmZzZXQpXG4gICAgcmV0dXJuIEJ1ZmZlci5ieXRlTGVuZ3RoKHRleHQsICd1dGY4JylcbiAgfVxufVxuXG5leHBvcnQge0dvZG9jfVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/godoc/lib/godoc.js
