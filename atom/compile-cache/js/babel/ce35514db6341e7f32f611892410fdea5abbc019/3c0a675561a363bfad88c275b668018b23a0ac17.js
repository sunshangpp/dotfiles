Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _navigationStack = require('./navigation-stack');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var Godef = (function () {
  function Godef(goconfigFunc, gogetFunc) {
    var _this = this;

    _classCallCheck(this, Godef);

    this.goget = gogetFunc;
    this.goconfig = goconfigFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.godefCommand = 'golang:godef';
    this.returnCommand = 'golang:godef-return';
    this.navigationStack = new _navigationStack.NavigationStack();
    atom.commands.add('atom-workspace', 'golang:godef', function () {
      if (_this.ready()) {
        _this.gotoDefinitionForWordAtCursor();
      }
    });
    atom.commands.add('atom-workspace', 'golang:godef-return', function () {
      if (_this.navigationStack) {
        _this.navigationStack.restorePreviousLocation();
      }
    });
    this.cursorOnChangeSubscription = null;
  }

  _createClass(Godef, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      this.goget = null;
      this.goconfig = null;
      this.toolCheckComplete = null;
    }
  }, {
    key: 'ready',
    value: function ready() {
      if (!this.goconfig || !this.goconfig()) {
        return false;
      }

      return true;
    }
  }, {
    key: 'clearReturnHistory',
    value: function clearReturnHistory() {
      this.navigationStack.reset();
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
    key: 'gotoDefinitionForWordAtCursor',
    value: function gotoDefinitionForWordAtCursor() {
      var _this2 = this;

      var editor = this.getEditor();
      if (!editor) {
        return Promise.resolve(false);
      }

      if (editor.hasMultipleCursors()) {
        atom.notifications.addWarning('navigator-godef', {
          dismissable: true,
          icon: 'location',
          detail: 'godef only works with a single cursor'
        });
        return Promise.resolve(false);
      }

      return Promise.resolve().then(function () {
        var editorCursorUTF8Offset = function editorCursorUTF8Offset(e) {
          var characterOffset = e.getBuffer().characterIndexForPosition(e.getCursorBufferPosition());
          var text = e.getText().substring(0, characterOffset);
          return Buffer.byteLength(text, 'utf8');
        };

        var offset = editorCursorUTF8Offset(editor);
        if (_this2.cursorOnChangeSubscription) {
          _this2.cursorOnChangeSubscription.dispose();
          _this2.cursorOnChangeSubscription = null;
        }
        return _this2.gotoDefinitionWithParameters(['-o', offset, '-i'], editor.getText());
      });
    }
  }, {
    key: 'gotoDefinitionForWord',
    value: function gotoDefinitionForWord(word) {
      return this.gotoDefinitionWithParameters([word], undefined);
    }
  }, {
    key: 'gotoDefinitionWithParameters',
    value: function gotoDefinitionWithParameters(cmdArgs) {
      var _this3 = this;

      var cmdInput = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

      var editor = this.getEditor();
      var config = this.goconfig();
      return this.checkForTool(editor).then(function (cmd) {
        if (!cmd) {
          return;
        }

        var filepath = editor.getPath();
        var args = ['-f', filepath].concat(cmdArgs);
        var options = _this3.getExecutorOptions(editor);
        if (cmdInput) {
          options.input = cmdInput;
        }
        return config.executor.exec(cmd, args, options).then(function (r) {
          if (r.exitcode !== 0) {
            // TODO: Notification?
            return false;
          }
          if (r.stderr && r.stderr.trim() !== '') {
            console.log('navigator-godef: (stderr) ' + r.stderr);
          }
          return _this3.visitLocation(_this3.parseGodefLocation(r.stdout));
        })['catch'](function (e) {
          console.log(e);
          return false;
        });
      });
    }
  }, {
    key: 'getLocatorOptions',
    value: function getLocatorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      var options = {};
      if (editor) {
        options.file = editor.getPath();
        options.directory = _path2['default'].dirname(editor.getPath());
      }
      if (!options.directory && atom.project.paths.length) {
        options.directory = atom.project.paths[0];
      }

      return options;
    }
  }, {
    key: 'getExecutorOptions',
    value: function getExecutorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      var o = this.getLocatorOptions(editor);
      var options = {};
      if (o.directory) {
        options.cwd = o.directory;
      }
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
    key: 'checkForTool',
    value: function checkForTool() {
      var _this4 = this;

      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      var config = this.goconfig();
      var options = this.getLocatorOptions(editor);
      return config.locator.findTool('godef', options).then(function (cmd) {
        if (cmd) {
          return cmd;
        }

        if (!cmd && !_this4.toolCheckComplete) {
          _this4.toolCheckComplete = true;
          var goget = _this4.goget();
          if (!goget) {
            return false;
          }
          goget.get({
            name: 'navigator-godef',
            packageName: 'godef',
            packagePath: 'github.com/rogpeppe/godef',
            type: 'missing'
          }).then(function (r) {
            if (!r.success) {
              return false;
            }
            return _this4.updateTools(editor);
          })['catch'](function (e) {
            console.log(e);
          });
        }

        return false;
      });
    }
  }, {
    key: 'parseGodefLocation',
    value: function parseGodefLocation(godefStdout) {
      var outputs = godefStdout.trim().split(':');
      var colNumber = 0;
      var rowNumber = 0;
      if (outputs.length > 1) {
        colNumber = outputs.pop();
        rowNumber = outputs.pop();
      }

      var targetFilePath = outputs.join(':');

      // godef on an import returns the imported package directory with no
      // row and column information: handle this appropriately
      if (targetFilePath.length === 0 && rowNumber) {
        targetFilePath = [rowNumber, colNumber].join(':');
        rowNumber = undefined;
        colNumber = undefined;
      }

      // atom's cursors are 0-based; godef uses diff-like 1-based
      var p = function p(rawPosition) {
        return parseInt(rawPosition, 10) - 1;
      };

      var result = {
        filepath: targetFilePath,
        raw: godefStdout
      };

      if (rowNumber && colNumber) {
        result.pos = new _atom.Point(p(rowNumber), p(colNumber));
      }
      return result;
    }
  }, {
    key: 'visitLocation',
    value: function visitLocation(loc, callback) {
      var _this5 = this;

      if (!loc || !loc.filepath) {
        if (loc) {
          atom.notifications.addWarning('navigator-godef', {
            dismissable: true,
            icon: 'location',
            description: JSON.stringify(loc.raw),
            detail: 'godef returned malformed output'
          });
        } else {
          atom.notifications.addWarning('navigator-godef', {
            dismissable: true,
            icon: 'location',
            detail: 'godef returned malformed output'
          });
        }

        return false;
      }

      return _fs2['default'].stat(loc.filepath, function (err, stats) {
        if (err) {
          if (err.handle) {
            err.handle();
          }
          atom.notifications.addWarning('navigator-godef', {
            dismissable: true,
            icon: 'location',
            detail: 'godef returned invalid file path',
            description: loc.filepath
          });
          return false;
        }

        _this5.navigationStack.pushCurrentLocation();
        if (stats.isDirectory()) {
          return _this5.visitDirectory(loc, callback);
        } else {
          return _this5.visitFile(loc, callback);
        }
      });
    }
  }, {
    key: 'visitFile',
    value: function visitFile(loc, callback) {
      var _this6 = this;

      return atom.workspace.open(loc.filepath).then(function (editor) {
        if (loc.pos) {
          editor.scrollToBufferPosition(loc.pos);
          editor.setCursorBufferPosition(loc.pos);
          _this6.cursorOnChangeSubscription = _this6.highlightWordAtCursor(editor);
        }
      });
    }
  }, {
    key: 'visitDirectory',
    value: function visitDirectory(loc, callback) {
      var _this7 = this;

      return this.findFirstGoFile(loc.filepath).then(function (file) {
        return _this7.visitFile({ filepath: file, raw: loc.raw }, callback);
      })['catch'](function (err) {
        if (err.handle) {
          err.handle();
        }
        atom.notifications.addWarning('navigator-godef', {
          dismissable: true,
          icon: 'location',
          detail: 'godef return invalid directory',
          description: loc.filepath
        });
      });
    }
  }, {
    key: 'findFirstGoFile',
    value: function findFirstGoFile(dir) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        _fs2['default'].readdir(dir, function (err, files) {
          if (err) {
            reject(err);
          }

          var filepath = _this8.firstGoFilePath(dir, files.sort());
          if (filepath) {
            resolve(filepath);
          } else {
            reject(dir + 'has no non-test .go file');
          }
        });
      });
    }
  }, {
    key: 'firstGoFilePath',
    value: function firstGoFilePath(dir, files) {
      for (var file of files) {
        if (file.endsWith('.go') && file.indexOf('_test') === -1) {
          return _path2['default'].join(dir, file);
        }
      }

      return;
    }
  }, {
    key: 'wordAtCursor',
    value: function wordAtCursor() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.editor : arguments[0];

      var options = {
        wordRegex: /[\w+\.]*/
      };

      var cursor = editor.getLastCursor();
      var range = cursor.getCurrentWordBufferRange(options);
      var word = editor.getTextInBufferRange(range);
      return { word: word, range: range };
    }
  }, {
    key: 'highlightWordAtCursor',
    value: function highlightWordAtCursor() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.editor : arguments[0];

      var _wordAtCursor = this.wordAtCursor(editor);

      var range = _wordAtCursor.range;

      var marker = editor.markBufferRange(range, { invalidate: 'inside' });
      editor.decorateMarker(marker, { type: 'highlight', 'class': 'definition' });
      var cursor = editor.getLastCursor();
      cursor.onDidChangePosition(function () {
        marker.destroy();
      });
    }
  }]);

  return Godef;
})();

exports.Godef = Godef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL25hdmlnYXRvci1nb2RlZi9saWIvZ29kZWYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFeUMsTUFBTTs7K0JBQ2pCLG9CQUFvQjs7b0JBQ2pDLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OztBQUxuQixXQUFXLENBQUE7O0lBT0wsS0FBSztBQUNHLFdBRFIsS0FBSyxDQUNJLFlBQVksRUFBRSxTQUFTLEVBQUU7OzswQkFEbEMsS0FBSzs7QUFFUCxRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxDQUFBO0FBQ2xDLFFBQUksQ0FBQyxhQUFhLEdBQUcscUJBQXFCLENBQUE7QUFDMUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxzQ0FBcUIsQ0FBQTtBQUM1QyxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsWUFBTTtBQUN4RCxVQUFJLE1BQUssS0FBSyxFQUFFLEVBQUU7QUFDaEIsY0FBSyw2QkFBNkIsRUFBRSxDQUFBO09BQ3JDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsWUFBTTtBQUMvRCxVQUFJLE1BQUssZUFBZSxFQUFFO0FBQ3hCLGNBQUssZUFBZSxDQUFDLHVCQUF1QixFQUFFLENBQUE7T0FDL0M7S0FDRixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFBO0dBQ3ZDOztlQW5CRyxLQUFLOztXQXFCRCxtQkFBRztBQUNULFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFB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QUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ25DLFVBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNyRCxVQUFJLElBQUksR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDN0MsYUFBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFBO0tBQ2xDOzs7V0FFcUIsaUNBQXVCO1VBQXRCLE1BQU0seURBQUcsSUFBSSxDQUFDLE1BQU07OzBCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQzs7VUFBbEMsS0FBSyxpQkFBTCxLQUFLOztBQUNWLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7QUFDbEUsWUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQU8sWUFBWSxFQUFDLENBQUMsQ0FBQTtBQUN2RSxVQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDbkMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLFlBQU07QUFDL0IsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2pCLENBQUMsQ0FBQTtLQUNIOzs7U0FwVkcsS0FBSzs7O1FBdVZILEtBQUssR0FBTCxLQUFLIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL25hdmlnYXRvci1nb2RlZi9saWIvZ29kZWYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIFBvaW50fSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtOYXZpZ2F0aW9uU3RhY2t9IGZyb20gJy4vbmF2aWdhdGlvbi1zdGFjaydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmNsYXNzIEdvZGVmIHtcbiAgY29uc3RydWN0b3IgKGdvY29uZmlnRnVuYywgZ29nZXRGdW5jKSB7XG4gICAgdGhpcy5nb2dldCA9IGdvZ2V0RnVuY1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ0Z1bmNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5nb2RlZkNvbW1hbmQgPSAnZ29sYW5nOmdvZGVmJ1xuICAgIHRoaXMucmV0dXJuQ29tbWFuZCA9ICdnb2xhbmc6Z29kZWYtcmV0dXJuJ1xuICAgIHRoaXMubmF2aWdhdGlvblN0YWNrID0gbmV3IE5hdmlnYXRpb25TdGFjaygpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2dvbGFuZzpnb2RlZicsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnJlYWR5KCkpIHtcbiAgICAgICAgdGhpcy5nb3RvRGVmaW5pdGlvbkZvcldvcmRBdEN1cnNvcigpXG4gICAgICB9XG4gICAgfSlcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnZ29sYW5nOmdvZGVmLXJldHVybicsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5hdmlnYXRpb25TdGFjaykge1xuICAgICAgICB0aGlzLm5hdmlnYXRpb25TdGFjay5yZXN0b3JlUHJldmlvdXNMb2NhdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmN1cnNvck9uQ2hhbmdlU3Vic2NyaXB0aW9uID0gbnVsbFxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5nb2dldCA9IG51bGxcbiAgICB0aGlzLmdvY29uZmlnID0gbnVsbFxuICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGUgPSBudWxsXG4gIH1cblxuICByZWFkeSAoKSB7XG4gICAgaWYgKCF0aGlzLmdvY29uZmlnIHx8ICF0aGlzLmdvY29uZmlnKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBjbGVhclJldHVybkhpc3RvcnkgKCkge1xuICAgIHRoaXMubmF2aWdhdGlvblN0YWNrLnJlc2V0KClcbiAgfVxuXG4gIGdldEVkaXRvciAoKSB7XG4gICAgaWYgKCFhdG9tIHx8ICFhdG9tLndvcmtzcGFjZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdG9yXG4gIH1cblxuICBpc1ZhbGlkRWRpdG9yIChlZGl0b3IpIHtcbiAgICBpZiAoIWVkaXRvciB8fCAhZWRpdG9yLmdldEdyYW1tYXIoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lID09PSAnc291cmNlLmdvJ1xuICB9XG5cbiAgZ290b0RlZmluaXRpb25Gb3JXb3JkQXRDdXJzb3IgKCkge1xuICAgIGxldCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5oYXNNdWx0aXBsZUN1cnNvcnMoKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ25hdmlnYXRvci1nb2RlZicsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGljb246ICdsb2NhdGlvbicsXG4gICAgICAgIGRldGFpbDogJ2dvZGVmIG9ubHkgd29ya3Mgd2l0aCBhIHNpbmdsZSBjdXJzb3InXG4gICAgICB9KVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBsZXQgZWRpdG9yQ3Vyc29yVVRGOE9mZnNldCA9IChlKSA9PiB7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJPZmZzZXQgPSBlLmdldEJ1ZmZlcigpLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24oZS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgICBsZXQgdGV4dCA9IGUuZ2V0VGV4dCgpLnN1YnN0cmluZygwLCBjaGFyYWN0ZXJPZmZzZXQpXG4gICAgICAgIHJldHVybiBCdWZmZXIuYnl0ZUxlbmd0aCh0ZXh0LCAndXRmOCcpXG4gICAgICB9XG5cbiAgICAgIGxldCBvZmZzZXQgPSBlZGl0b3JDdXJzb3JVVEY4T2Zmc2V0KGVkaXRvcilcbiAgICAgIGlmICh0aGlzLmN1cnNvck9uQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuY3Vyc29yT25DaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgIHRoaXMuY3Vyc29yT25DaGFuZ2VTdWJzY3JpcHRpb24gPSBudWxsXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nb3RvRGVmaW5pdGlvbldpdGhQYXJhbWV0ZXJzKFsnLW8nLCBvZmZzZXQsICctaSddLCBlZGl0b3IuZ2V0VGV4dCgpKVxuICAgIH0pXG4gIH1cblxuICBnb3RvRGVmaW5pdGlvbkZvcldvcmQgKHdvcmQpIHtcbiAgICByZXR1cm4gdGhpcy5nb3RvRGVmaW5pdGlvbldpdGhQYXJhbWV0ZXJzKFt3b3JkXSwgdW5kZWZpbmVkKVxuICB9XG5cbiAgZ290b0RlZmluaXRpb25XaXRoUGFyYW1ldGVycyAoY21kQXJncywgY21kSW5wdXQgPSB1bmRlZmluZWQpIHtcbiAgICBsZXQgZWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKVxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICByZXR1cm4gdGhpcy5jaGVja0ZvclRvb2woZWRpdG9yKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmICghY21kKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgZmlsZXBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBsZXQgYXJncyA9IFsnLWYnLCBmaWxlcGF0aF0uY29uY2F0KGNtZEFyZ3MpXG4gICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0RXhlY3V0b3JPcHRpb25zKGVkaXRvcilcbiAgICAgIGlmIChjbWRJbnB1dCkge1xuICAgICAgICBvcHRpb25zLmlucHV0ID0gY21kSW5wdXRcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIG9wdGlvbnMpLnRoZW4oKHIpID0+IHtcbiAgICAgICAgaWYgKHIuZXhpdGNvZGUgIT09IDApIHtcbiAgICAgICAgICAvLyBUT0RPOiBOb3RpZmljYXRpb24/XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIuc3RkZXJyICYmIHIuc3RkZXJyLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbmF2aWdhdG9yLWdvZGVmOiAoc3RkZXJyKSAnICsgci5zdGRlcnIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaXRMb2NhdGlvbih0aGlzLnBhcnNlR29kZWZMb2NhdGlvbihyLnN0ZG91dCkpXG4gICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldExvY2F0b3JPcHRpb25zIChlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIG9wdGlvbnMuZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIG9wdGlvbnMuZGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5kaXJlY3RvcnkgJiYgYXRvbS5wcm9qZWN0LnBhdGhzLmxlbmd0aCkge1xuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBhdG9tLnByb2plY3QucGF0aHNbMF1cbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZ2V0RXhlY3V0b3JPcHRpb25zIChlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgbGV0IG8gPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgaWYgKG8uZGlyZWN0b3J5KSB7XG4gICAgICBvcHRpb25zLmN3ZCA9IG8uZGlyZWN0b3J5XG4gICAgfVxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBvcHRpb25zLmVudiA9IGNvbmZpZy5lbnZpcm9ubWVudChvKVxuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuZW52KSB7XG4gICAgICBvcHRpb25zLmVudiA9IHByb2Nlc3MuZW52XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBjaGVja0ZvclRvb2wgKGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvZGVmJywgb3B0aW9ucykudGhlbigoY21kKSA9PiB7XG4gICAgICBpZiAoY21kKSB7XG4gICAgICAgIHJldHVybiBjbWRcbiAgICAgIH1cblxuICAgICAgaWYgKCFjbWQgJiYgIXRoaXMudG9vbENoZWNrQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IHRydWVcbiAgICAgICAgbGV0IGdvZ2V0ID0gdGhpcy5nb2dldCgpXG4gICAgICAgIGlmICghZ29nZXQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBnb2dldC5nZXQoe1xuICAgICAgICAgIG5hbWU6ICduYXZpZ2F0b3ItZ29kZWYnLFxuICAgICAgICAgIHBhY2thZ2VOYW1lOiAnZ29kZWYnLFxuICAgICAgICAgIHBhY2thZ2VQYXRoOiAnZ2l0aHViLmNvbS9yb2dwZXBwZS9nb2RlZicsXG4gICAgICAgICAgdHlwZTogJ21pc3NpbmcnXG4gICAgICAgIH0pLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICBpZiAoIXIuc3VjY2Vzcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVRvb2xzKGVkaXRvcilcbiAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgcGFyc2VHb2RlZkxvY2F0aW9uIChnb2RlZlN0ZG91dCkge1xuICAgIGxldCBvdXRwdXRzID0gZ29kZWZTdGRvdXQudHJpbSgpLnNwbGl0KCc6JylcbiAgICBsZXQgY29sTnVtYmVyID0gMFxuICAgIGxldCByb3dOdW1iZXIgPSAwXG4gICAgaWYgKG91dHB1dHMubGVuZ3RoID4gMSkge1xuICAgICAgY29sTnVtYmVyID0gb3V0cHV0cy5wb3AoKVxuICAgICAgcm93TnVtYmVyID0gb3V0cHV0cy5wb3AoKVxuICAgIH1cblxuICAgIGxldCB0YXJnZXRGaWxlUGF0aCA9IG91dHB1dHMuam9pbignOicpXG5cbiAgICAvLyBnb2RlZiBvbiBhbiBpbXBvcnQgcmV0dXJucyB0aGUgaW1wb3J0ZWQgcGFja2FnZSBkaXJlY3Rvcnkgd2l0aCBub1xuICAgIC8vIHJvdyBhbmQgY29sdW1uIGluZm9ybWF0aW9uOiBoYW5kbGUgdGhpcyBhcHByb3ByaWF0ZWx5XG4gICAgaWYgKHRhcmdldEZpbGVQYXRoLmxlbmd0aCA9PT0gMCAmJiByb3dOdW1iZXIpIHtcbiAgICAgIHRhcmdldEZpbGVQYXRoID0gW3Jvd051bWJlciwgY29sTnVtYmVyXS5qb2luKCc6JylcbiAgICAgIHJvd051bWJlciA9IHVuZGVmaW5lZFxuICAgICAgY29sTnVtYmVyID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgLy8gYXRvbSdzIGN1cnNvcnMgYXJlIDAtYmFzZWQ7IGdvZGVmIHVzZXMgZGlmZi1saWtlIDEtYmFzZWRcbiAgICBsZXQgcCA9IChyYXdQb3NpdGlvbikgPT4ge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHJhd1Bvc2l0aW9uLCAxMCkgLSAxXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgIGZpbGVwYXRoOiB0YXJnZXRGaWxlUGF0aCxcbiAgICAgIHJhdzogZ29kZWZTdGRvdXRcbiAgICB9XG5cbiAgICBpZiAocm93TnVtYmVyICYmIGNvbE51bWJlcikge1xuICAgICAgcmVzdWx0LnBvcyA9IG5ldyBQb2ludChwKHJvd051bWJlciksIHAoY29sTnVtYmVyKSlcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgdmlzaXRMb2NhdGlvbiAobG9jLCBjYWxsYmFjaykge1xuICAgIGlmICghbG9jIHx8ICFsb2MuZmlsZXBhdGgpIHtcbiAgICAgIGlmIChsb2MpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ25hdmlnYXRvci1nb2RlZicsIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBpY29uOiAnbG9jYXRpb24nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBKU09OLnN0cmluZ2lmeShsb2MucmF3KSxcbiAgICAgICAgICBkZXRhaWw6ICdnb2RlZiByZXR1cm5lZCBtYWxmb3JtZWQgb3V0cHV0J1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ25hdmlnYXRvci1nb2RlZicsIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBpY29uOiAnbG9jYXRpb24nLFxuICAgICAgICAgIGRldGFpbDogJ2dvZGVmIHJldHVybmVkIG1hbGZvcm1lZCBvdXRwdXQnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmcy5zdGF0KGxvYy5maWxlcGF0aCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKGVyci5oYW5kbGUpIHtcbiAgICAgICAgICBlcnIuaGFuZGxlKClcbiAgICAgICAgfVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnbmF2aWdhdG9yLWdvZGVmJywge1xuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIGljb246ICdsb2NhdGlvbicsXG4gICAgICAgICAgZGV0YWlsOiAnZ29kZWYgcmV0dXJuZWQgaW52YWxpZCBmaWxlIHBhdGgnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBsb2MuZmlsZXBhdGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMubmF2aWdhdGlvblN0YWNrLnB1c2hDdXJyZW50TG9jYXRpb24oKVxuICAgICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaXREaXJlY3RvcnkobG9jLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpc2l0RmlsZShsb2MsIGNhbGxiYWNrKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB2aXNpdEZpbGUgKGxvYywgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbihsb2MuZmlsZXBhdGgpLnRoZW4oKGVkaXRvcikgPT4ge1xuICAgICAgaWYgKGxvYy5wb3MpIHtcbiAgICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24obG9jLnBvcylcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGxvYy5wb3MpXG4gICAgICAgIHRoaXMuY3Vyc29yT25DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmhpZ2hsaWdodFdvcmRBdEN1cnNvcihlZGl0b3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHZpc2l0RGlyZWN0b3J5IChsb2MsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEZpcnN0R29GaWxlKGxvYy5maWxlcGF0aCkudGhlbigoZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudmlzaXRGaWxlKHtmaWxlcGF0aDogZmlsZSwgcmF3OiBsb2MucmF3fSwgY2FsbGJhY2spXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyci5oYW5kbGUpIHtcbiAgICAgICAgZXJyLmhhbmRsZSgpXG4gICAgICB9XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnbmF2aWdhdG9yLWdvZGVmJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgaWNvbjogJ2xvY2F0aW9uJyxcbiAgICAgICAgZGV0YWlsOiAnZ29kZWYgcmV0dXJuIGludmFsaWQgZGlyZWN0b3J5JyxcbiAgICAgICAgZGVzY3JpcHRpb246IGxvYy5maWxlcGF0aFxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZmluZEZpcnN0R29GaWxlIChkaXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZnMucmVhZGRpcihkaXIsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbGVwYXRoID0gdGhpcy5maXJzdEdvRmlsZVBhdGgoZGlyLCBmaWxlcy5zb3J0KCkpXG4gICAgICAgIGlmIChmaWxlcGF0aCkge1xuICAgICAgICAgIHJlc29sdmUoZmlsZXBhdGgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KGRpciArICdoYXMgbm8gbm9uLXRlc3QgLmdvIGZpbGUnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBmaXJzdEdvRmlsZVBhdGggKGRpciwgZmlsZXMpIHtcbiAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBpZiAoZmlsZS5lbmRzV2l0aCgnLmdvJykgJiYgKGZpbGUuaW5kZXhPZignX3Rlc3QnKSA9PT0gLTEpKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oZGlyLCBmaWxlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVyblxuICB9XG5cbiAgd29yZEF0Q3Vyc29yIChlZGl0b3IgPSB0aGlzLmVkaXRvcikge1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgd29yZFJlZ2V4OiAvW1xcdytcXC5dKi9cbiAgICB9XG5cbiAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGxldCByYW5nZSA9IGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKG9wdGlvbnMpXG4gICAgbGV0IHdvcmQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgcmV0dXJuIHt3b3JkOiB3b3JkLCByYW5nZTogcmFuZ2V9XG4gIH1cblxuICBoaWdobGlnaHRXb3JkQXRDdXJzb3IgKGVkaXRvciA9IHRoaXMuZWRpdG9yKSB7XG4gICAgbGV0IHtyYW5nZX0gPSB0aGlzLndvcmRBdEN1cnNvcihlZGl0b3IpXG4gICAgbGV0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UsIHtpbnZhbGlkYXRlOiAnaW5zaWRlJ30pXG4gICAgZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ2RlZmluaXRpb24nfSlcbiAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGN1cnNvci5vbkRpZENoYW5nZVBvc2l0aW9uKCgpID0+IHtcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7R29kZWZ9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/navigator-godef/lib/godef.js
