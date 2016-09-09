Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _renameDialog = require('./rename-dialog');

'use babel';

var Gorename = (function () {
  function Gorename(goconfigFunc, gogetFunc) {
    var _this = this;

    _classCallCheck(this, Gorename);

    this.goconfig = goconfigFunc;
    this.goget = gogetFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'golang:gorename', function () {
      _this.commandInvoked();
    }));
  }

  _createClass(Gorename, [{
    key: 'commandInvoked',
    value: function commandInvoked() {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      if (!this.isValidEditor(editor)) {
        return;
      }
      this.checkForTool(editor).then(function (cmd) {
        if (!cmd) {
          // TODO: Show a notification?
          return;
        }

        var info = _this2.wordAndOffset(editor);
        var cursor = editor.getCursorBufferPosition();

        var dialog = new _renameDialog.RenameDialog(info.word, function (newName) {
          _this2.saveAllEditors();
          var file = editor.getBuffer().getPath();
          var cwd = _path2['default'].dirname(file);

          // restore cursor position after gorename completes and the buffer is reloaded
          if (cursor) {
            (function () {
              var disp = editor.getBuffer().onDidReload(function () {
                editor.setCursorBufferPosition(cursor, { autoscroll: false });
                var element = atom.views.getView(editor);
                if (element) {
                  element.focus();
                }
                disp.dispose();
              });
            })();
          }
          _this2.runGorename(file, info.offset, cwd, newName, cmd);
        });
        dialog.onCancelled(function () {
          editor.setCursorBufferPosition(cursor, { autoscroll: false });
          var element = atom.views.getView(editor);
          if (element) {
            element.focus();
          }
        });
        dialog.attach();
        return;
      })['catch'](function (e) {
        if (e.handle) {
          e.handle();
        }
        console.log(e);
      });
    }
  }, {
    key: 'saveAllEditors',
    value: function saveAllEditors() {
      for (var editor of atom.workspace.getTextEditors()) {
        if (editor.isModified() && this.isValidEditor(editor)) {
          editor.save();
        }
      }
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
    key: 'wordAndOffset',
    value: function wordAndOffset(editor) {
      var cursor = editor.getLastCursor();
      var range = cursor.getCurrentWordBufferRange();
      var middle = new _atom.Point(range.start.row, Math.floor((range.start.column + range.end.column) / 2));
      var charOffset = editor.buffer.characterIndexForPosition(middle);
      var text = editor.getText().substring(0, charOffset);
      return { word: editor.getTextInBufferRange(range), offset: Buffer.byteLength(text, 'utf8') };
    }
  }, {
    key: 'runGorename',
    value: function runGorename(file, offset, cwd, newName, cmd) {
      var config = this.goconfig();
      if (!config || !config.executor) {
        return { success: false, result: null };
      }

      var args = ['-offset', file + ':#' + offset, '-to', newName];
      return config.executor.exec(cmd, args, { cwd: cwd, env: config.environment() }).then(function (r) {
        if (r.error) {
          if (r.error.code === 'ENOENT') {
            atom.notifications.addError('Missing Rename Tool', {
              detail: 'The gorename tool is required to perform a rename. Please run go get -u golang.org/x/tools/cmd/gorename to get it.',
              dismissable: true
            });
          } else {
            atom.notifications.addError('Rename Error', {
              detail: r.error.message,
              dismissable: true
            });
          }
          return { success: false, result: r };
        }

        var message = r.stderr.trim() + '\r\n' + r.stdout.trim();
        if (r.exitcode !== 0 || r.stderr && r.stderr.trim() !== '') {
          atom.notifications.addWarning('Rename Error', {
            detail: message.trim(),
            dismissable: true
          });
          return { success: false, result: r };
        }

        atom.notifications.addSuccess(message.trim());
        return { success: true, result: r };
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

      return config.locator.findTool('gorename', options).then(function (cmd) {
        if (cmd) {
          return cmd;
        }

        if (!_this3.goget || !_this3.goget()) {
          return false;
        }

        var get = _this3.goget();
        if (_this3.toolCheckComplete) {
          return false;
        }

        _this3.toolCheckComplete = true;
        return get.get({
          name: 'gorename',
          packageName: 'gorename',
          packagePath: 'golang.org/x/tools/cmd/gorename',
          type: 'missing'
        }).then(function (r) {
          if (r.success) {
            return config.locator.findTool('gorename', options);
          }

          console.log('gorename is not available and could not be installed via "go get -u golang.org/x/tools/cmd/gorename"; please manually install it to enable gorename behavior.');
          return false;
        })['catch'](function (e) {
          console.log(e);
          return false;
        });
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.goconfig = null;
    }
  }]);

  return Gorename;
})();

exports.Gorename = Gorename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvcmVuYW1lL2xpYi9nb3JlbmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNrQixNQUFNOzs0QkFDcEIsaUJBQWlCOztBQUo1QyxXQUFXLENBQUE7O0lBTUwsUUFBUTtBQUNBLFdBRFIsUUFBUSxDQUNDLFlBQVksRUFBRSxTQUFTLEVBQUU7OzswQkFEbEMsUUFBUTs7QUFFVixRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQTtBQUM1QixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLFlBQU07QUFDcEYsWUFBSyxjQUFjLEVBQUUsQ0FBQTtLQUN0QixDQUFDLENBQUMsQ0FBQTtHQUNKOztlQVJHLFFBQVE7O1dBVUcsMEJBQUc7OztBQUNoQixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDakQsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDL0IsZUFBTTtPQUNQO0FBQ0QsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDdEMsWUFBSSxDQUFDLEdBQUcsRUFBRTs7QUFFUixpQkFBTTtTQUNQOztBQUVELFlBQUksSUFBSSxHQUFHLE9BQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JDLFlBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFBOztBQUU3QyxZQUFJLE1BQU0sR0FBRywrQkFBaUIsSUFBSSxDQUFDLElBQUksRUFBRSxV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QUFRLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1dBQ3BEOztBQUVELGlCQUFPLENBQUMsR0FBRyxDQUFDLCtKQUErSixDQUFDLENBQUE7QUFDNUssaUJBQU8sS0FBSyxDQUFBO1NBQ2IsQ0FBQyxTQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDZCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNkLGlCQUFPLEtBQUssQ0FBQTtTQUNiLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7S0FDckI7OztTQWhMRyxRQUFROzs7UUFtTE4sUUFBUSxHQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ29yZW5hbWUvbGliL2dvcmVuYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgUG9pbnR9IGZyb20gJ2F0b20nXG5pbXBvcnQge1JlbmFtZURpYWxvZ30gZnJvbSAnLi9yZW5hbWUtZGlhbG9nJ1xuXG5jbGFzcyBHb3JlbmFtZSB7XG4gIGNvbnN0cnVjdG9yIChnb2NvbmZpZ0Z1bmMsIGdvZ2V0RnVuYykge1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ0Z1bmNcbiAgICB0aGlzLmdvZ2V0ID0gZ29nZXRGdW5jXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnZ29sYW5nOmdvcmVuYW1lJywgKCkgPT4ge1xuICAgICAgdGhpcy5jb21tYW5kSW52b2tlZCgpXG4gICAgfSkpXG4gIH1cblxuICBjb21tYW5kSW52b2tlZCAoKSB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmNoZWNrRm9yVG9vbChlZGl0b3IpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgLy8gVE9ETzogU2hvdyBhIG5vdGlmaWNhdGlvbj9cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBpbmZvID0gdGhpcy53b3JkQW5kT2Zmc2V0KGVkaXRvcilcbiAgICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgICBsZXQgZGlhbG9nID0gbmV3IFJlbmFtZURpYWxvZyhpbmZvLndvcmQsIChuZXdOYW1lKSA9PiB7XG4gICAgICAgIHRoaXMuc2F2ZUFsbEVkaXRvcnMoKVxuICAgICAgICBsZXQgZmlsZSA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRQYXRoKClcbiAgICAgICAgbGV0IGN3ZCA9IHBhdGguZGlybmFtZShmaWxlKVxuXG4gICAgICAgIC8vIHJlc3RvcmUgY3Vyc29yIHBvc2l0aW9uIGFmdGVyIGdvcmVuYW1lIGNvbXBsZXRlcyBhbmQgdGhlIGJ1ZmZlciBpcyByZWxvYWRlZFxuICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgbGV0IGRpc3AgPSBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRSZWxvYWQoKCkgPT4ge1xuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGN1cnNvciwge2F1dG9zY3JvbGw6IGZhbHNlfSlcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlzcC5kaXNwb3NlKClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucnVuR29yZW5hbWUoZmlsZSwgaW5mby5vZmZzZXQsIGN3ZCwgbmV3TmFtZSwgY21kKVxuICAgICAgfSlcbiAgICAgIGRpYWxvZy5vbkNhbmNlbGxlZCgoKSA9PiB7XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihjdXJzb3IsIHthdXRvc2Nyb2xsOiBmYWxzZX0pXG4gICAgICAgIGxldCBlbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGRpYWxvZy5hdHRhY2goKVxuICAgICAgcmV0dXJuXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmIChlLmhhbmRsZSkge1xuICAgICAgICBlLmhhbmRsZSgpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH0pXG4gIH1cblxuICBzYXZlQWxsRWRpdG9ycyAoKSB7XG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkpIHtcbiAgICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpICYmIHRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkRWRpdG9yIChlZGl0b3IpIHtcbiAgICBpZiAoIWVkaXRvciB8fCAhZWRpdG9yLmdldEdyYW1tYXIoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5nbycpXG4gIH1cblxuICB3b3JkQW5kT2Zmc2V0IChlZGl0b3IpIHtcbiAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGxldCByYW5nZSA9IGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKClcbiAgICBsZXQgbWlkZGxlID0gbmV3IFBvaW50KHJhbmdlLnN0YXJ0LnJvdyxcbiAgICAgIE1hdGguZmxvb3IoKHJhbmdlLnN0YXJ0LmNvbHVtbiArIHJhbmdlLmVuZC5jb2x1bW4pIC8gMikpXG4gICAgbGV0IGNoYXJPZmZzZXQgPSBlZGl0b3IuYnVmZmVyLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24obWlkZGxlKVxuICAgIGxldCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKS5zdWJzdHJpbmcoMCwgY2hhck9mZnNldClcbiAgICByZXR1cm4ge3dvcmQ6IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSksIG9mZnNldDogQnVmZmVyLmJ5dGVMZW5ndGgodGV4dCwgJ3V0ZjgnKX1cbiAgfVxuXG4gIHJ1bkdvcmVuYW1lIChmaWxlLCBvZmZzZXQsIGN3ZCwgbmV3TmFtZSwgY21kKSB7XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGlmICghY29uZmlnIHx8ICFjb25maWcuZXhlY3V0b3IpIHtcbiAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIHJlc3VsdDogbnVsbH1cbiAgICB9XG5cbiAgICBsZXQgYXJncyA9IFsnLW9mZnNldCcsIGAke2ZpbGV9OiMke29mZnNldH1gLCAnLXRvJywgbmV3TmFtZV1cbiAgICByZXR1cm4gY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCBhcmdzLCB7Y3dkOiBjd2QsIGVudjogY29uZmlnLmVudmlyb25tZW50KCl9KS50aGVuKChyKSA9PiB7XG4gICAgICBpZiAoci5lcnJvcikge1xuICAgICAgICBpZiAoci5lcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTWlzc2luZyBSZW5hbWUgVG9vbCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogJ1RoZSBnb3JlbmFtZSB0b29sIGlzIHJlcXVpcmVkIHRvIHBlcmZvcm0gYSByZW5hbWUuIFBsZWFzZSBydW4gZ28gZ2V0IC11IGdvbGFuZy5vcmcveC90b29scy9jbWQvZ29yZW5hbWUgdG8gZ2V0IGl0LicsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdSZW5hbWUgRXJyb3InLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHIuZXJyb3IubWVzc2FnZSxcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3N1Y2Nlc3M6IGZhbHNlLCByZXN1bHQ6IHJ9XG4gICAgICB9XG5cbiAgICAgIGxldCBtZXNzYWdlID0gci5zdGRlcnIudHJpbSgpICsgJ1xcclxcbicgKyByLnN0ZG91dC50cmltKClcbiAgICAgIGlmIChyLmV4aXRjb2RlICE9PSAwIHx8IHIuc3RkZXJyICYmIHIuc3RkZXJyLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1JlbmFtZSBFcnJvcicsIHtcbiAgICAgICAgICBkZXRhaWw6IG1lc3NhZ2UudHJpbSgpLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIHJlc3VsdDogcn1cbiAgICAgIH1cblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MobWVzc2FnZS50cmltKCkpXG4gICAgICByZXR1cm4ge3N1Y2Nlc3M6IHRydWUsIHJlc3VsdDogcn1cbiAgICB9KVxuICB9XG5cbiAgY2hlY2tGb3JUb29sIChlZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZ29jb25maWcgfHwgIXRoaXMuZ29jb25maWcoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgb3B0aW9ucy5maWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUob3B0aW9ucy5maWxlKVxuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5kaXJlY3RvcnkgJiYgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoID4gMCkge1xuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgIH1cblxuICAgIHJldHVybiBjb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29yZW5hbWUnLCBvcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmIChjbWQpIHtcbiAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZ29nZXQgfHwgIXRoaXMuZ29nZXQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IGdldCA9IHRoaXMuZ29nZXQoKVxuICAgICAgaWYgKHRoaXMudG9vbENoZWNrQ29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGUgPSB0cnVlXG4gICAgICByZXR1cm4gZ2V0LmdldCh7XG4gICAgICAgIG5hbWU6ICdnb3JlbmFtZScsXG4gICAgICAgIHBhY2thZ2VOYW1lOiAnZ29yZW5hbWUnLFxuICAgICAgICBwYWNrYWdlUGF0aDogJ2dvbGFuZy5vcmcveC90b29scy9jbWQvZ29yZW5hbWUnLFxuICAgICAgICB0eXBlOiAnbWlzc2luZydcbiAgICAgIH0pLnRoZW4oKHIpID0+IHtcbiAgICAgICAgaWYgKHIuc3VjY2Vzcykge1xuICAgICAgICAgIHJldHVybiBjb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29yZW5hbWUnLCBvcHRpb25zKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ2dvcmVuYW1lIGlzIG5vdCBhdmFpbGFibGUgYW5kIGNvdWxkIG5vdCBiZSBpbnN0YWxsZWQgdmlhIFwiZ28gZ2V0IC11IGdvbGFuZy5vcmcveC90b29scy9jbWQvZ29yZW5hbWVcIjsgcGxlYXNlIG1hbnVhbGx5IGluc3RhbGwgaXQgdG8gZW5hYmxlIGdvcmVuYW1lIGJlaGF2aW9yLicpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gIH1cbn1cblxuZXhwb3J0IHtHb3JlbmFtZX1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/gorename/lib/gorename.js
