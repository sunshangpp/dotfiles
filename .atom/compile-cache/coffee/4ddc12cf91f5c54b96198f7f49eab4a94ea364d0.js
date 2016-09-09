(function() {
  var EditorLocationStack, Emitter, Godef, Point, Subscriber, fs, path, _ref,
    __slice = [].slice;

  Point = require('atom').Point;

  _ref = require('emissary'), Emitter = _ref.Emitter, Subscriber = _ref.Subscriber;

  path = require('path');

  fs = require('fs');

  EditorLocationStack = require('./util/editor-location-stack');

  module.exports = Godef = (function() {
    Subscriber.includeInto(Godef);

    Emitter.includeInto(Godef);

    function Godef(dispatch) {
      this.dispatch = dispatch;
      this.godefCommand = "golang:godef";
      this.returnCommand = "golang:godef-return";
      this.name = 'def';
      this.didCompleteNotification = "" + this.name + "-complete";
      this.godefLocationStack = new EditorLocationStack();
      atom.commands.add('atom-workspace', {
        "golang:godef": (function(_this) {
          return function() {
            return _this.gotoDefinitionForWordAtCursor();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        "golang:godef-return": (function(_this) {
          return function() {
            return _this.godefReturn();
          };
        })(this)
      });
      this.cursorOnChangeSubscription = null;
    }

    Godef.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Godef.prototype.reset = function(editor) {
      var _ref1;
      this.emit('reset', this.editor);
      return (_ref1 = this.cursorOnChangeSubscription) != null ? _ref1.dispose() : void 0;
    };

    Godef.prototype.clearReturnHistory = function() {
      return this.godefLocationStack.reset();
    };

    Godef.prototype.onDidComplete = function(callback) {
      return this.on(this.didCompleteNotification, callback);
    };

    Godef.prototype.godefReturn = function() {
      return this.godefLocationStack.restorePreviousLocation().then((function(_this) {
        return function() {
          return _this.emitDidComplete();
        };
      })(this));
    };

    Godef.prototype.gotoDefinitionForWordAtCursor = function() {
      var done, editorCursorUTF8Offset, offset, _ref1, _ref2;
      this.editor = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspace) != null ? _ref1.getActiveTextEditor() : void 0 : void 0;
      done = (function(_this) {
        return function(err, messages) {
          var _ref2;
          return (_ref2 = _this.dispatch) != null ? _ref2.resetAndDisplayMessages(_this.editor, messages) : void 0;
        };
      })(this);
      if (!((_ref2 = this.dispatch) != null ? _ref2.isValidEditor(this.editor) : void 0)) {
        this.emitDidComplete();
        return;
      }
      if (this.editor.hasMultipleCursors()) {
        this.bailWithWarning('Godef only works with a single cursor', done);
        return;
      }
      editorCursorUTF8Offset = function(e) {
        var characterOffset, text;
        characterOffset = e.getBuffer().characterIndexForPosition(e.getCursorBufferPosition());
        text = e.getText().substring(0, characterOffset);
        return Buffer.byteLength(text, "utf8");
      };
      offset = editorCursorUTF8Offset(this.editor);
      this.reset(this.editor);
      return this.gotoDefinitionWithParameters(['-o', offset, '-i'], this.editor.getText(), done);
    };

    Godef.prototype.gotoDefinitionForWord = function(word, callback) {
      if (callback == null) {
        callback = function() {
          return void 0;
        };
      }
      return this.gotoDefinitionWithParameters([word], void 0, callback);
    };

    Godef.prototype.gotoDefinitionWithParameters = function(cmdArgs, cmdInput, callback) {
      var args, cmd, cwd, done, env, filePath, go, gopath, message;
      if (cmdInput == null) {
        cmdInput = void 0;
      }
      if (callback == null) {
        callback = function() {
          return void 0;
        };
      }
      message = null;
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if (exitcode !== 0) {
            _this.bailWithWarning(stderr, callback);
            return;
          }
          return _this.visitLocation(_this.parseGodefLocation(stdout), callback);
        };
      })(this);
      go = this.dispatch.goexecutable.current();
      cmd = go.godef();
      if (cmd === false) {
        this.bailWithError('Godef Tool Missing', callback);
        return;
      }
      gopath = go.buildgopath();
      if ((gopath == null) || gopath === '') {
        this.bailWithError('GOPATH is Missing', callback);
        return;
      }
      env = this.dispatch.env();
      env['GOPATH'] = gopath;
      filePath = this.editor.getPath();
      cwd = path.dirname(filePath);
      args = ['-f', filePath].concat(__slice.call(cmdArgs));
      return this.dispatch.executor.exec(cmd, cwd, env, done, args, cmdInput);
    };

    Godef.prototype.parseGodefLocation = function(godefStdout) {
      var colNumber, outputs, p, rowNumber, targetFilePath, targetFilePathSegments, _i;
      outputs = godefStdout.trim().split(':');
      targetFilePathSegments = 3 <= outputs.length ? __slice.call(outputs, 0, _i = outputs.length - 2) : (_i = 0, []), rowNumber = outputs[_i++], colNumber = outputs[_i++];
      targetFilePath = targetFilePathSegments.join(':');
      if (targetFilePath.length === 0 && rowNumber) {
        targetFilePath = [rowNumber, colNumber].filter(function(x) {
          return x;
        }).join(':');
        rowNumber = colNumber = void 0;
      }
      p = function(rawPosition) {
        return parseInt(rawPosition, 10) - 1;
      };
      return {
        filepath: targetFilePath,
        pos: (rowNumber != null) && (colNumber != null) ? new Point(p(rowNumber), p(colNumber)) : void 0,
        raw: godefStdout
      };
    };

    Godef.prototype.visitLocation = function(loc, callback) {
      if (!loc.filepath) {
        this.bailWithWarning("godef returned malformed output: " + (JSON.stringify(loc.raw)), callback);
        return;
      }
      return fs.stat(loc.filepath, (function(_this) {
        return function(err, stats) {
          if (err) {
            _this.bailWithWarning("godef returned invalid file path: \"" + loc.filepath + "\"", callback);
            return;
          }
          _this.godefLocationStack.pushCurrentLocation();
          if (stats.isDirectory()) {
            return _this.visitDirectory(loc, callback);
          } else {
            return _this.visitFile(loc, callback);
          }
        };
      })(this));
    };

    Godef.prototype.visitFile = function(loc, callback) {
      return atom.workspace.open(loc.filepath).then((function(_this) {
        return function(editor) {
          _this.editor = editor;
          if (loc.pos) {
            _this.editor.scrollToBufferPosition(loc.pos);
            _this.editor.setCursorBufferPosition(loc.pos);
            _this.cursorOnChangeSubscription = _this.highlightWordAtCursor(atom.workspace.getActiveTextEditor());
          }
          _this.emitDidComplete();
          return callback(null, []);
        };
      })(this));
    };

    Godef.prototype.visitDirectory = function(loc, callback) {
      var failure, success;
      success = (function(_this) {
        return function(goFile) {
          return _this.visitFile({
            filepath: goFile,
            raw: loc.raw
          }, callback);
        };
      })(this);
      failure = (function(_this) {
        return function(err) {
          return _this.bailWithWarning("godef return invalid directory " + loc.filepath + ": " + err, callback);
        };
      })(this);
      return this.findFirstGoFile(loc.filepath).then(success)["catch"](failure);
    };

    Godef.prototype.findFirstGoFile = function(dir) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return fs.readdir(dir, function(err, files) {
            var goFilePath;
            if (err) {
              reject(err);
            }
            goFilePath = _this.firstGoFilePath(dir, files.sort());
            if (goFilePath) {
              return resolve(goFilePath);
            } else {
              return reject("" + dir + " has no non-test .go file");
            }
          });
        };
      })(this));
    };

    Godef.prototype.firstGoFilePath = function(dir, files) {
      var file, isGoSourceFile, _i, _len;
      isGoSourceFile = function(file) {
        return file.endsWith('.go') && file.indexOf('_test') === -1;
      };
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (isGoSourceFile(file)) {
          return path.join(dir, file);
        }
      }
    };

    Godef.prototype.emitDidComplete = function() {
      return this.emit(this.didCompleteNotification, this.editor, false);
    };

    Godef.prototype.bailWithWarning = function(warning, callback) {
      return this.bailWithMessage('warning', warning, callback);
    };

    Godef.prototype.bailWithError = function(error, callback) {
      return this.bailWithMessage('error', error, callback);
    };

    Godef.prototype.bailWithMessage = function(type, msg, callback) {
      var message;
      message = {
        line: false,
        column: false,
        msg: msg,
        type: type,
        source: this.name
      };
      callback(null, [message]);
      return this.emitDidComplete();
    };

    Godef.prototype.wordAtCursor = function(editor) {
      var cursor, options, range, word;
      if (editor == null) {
        editor = this.editor;
      }
      options = {
        wordRegex: /[\w+\.]*/
      };
      cursor = editor.getLastCursor();
      range = cursor.getCurrentWordBufferRange(options);
      word = this.editor.getTextInBufferRange(range);
      return {
        word: word,
        range: range
      };
    };

    Godef.prototype.highlightWordAtCursor = function(editor) {
      var cursor, decoration, marker, range, word, _ref1;
      if (editor == null) {
        editor = this.editor;
      }
      _ref1 = this.wordAtCursor(editor), word = _ref1.word, range = _ref1.range;
      marker = editor.markBufferRange(range, {
        invalidate: 'inside'
      });
      decoration = editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'definition'
      });
      cursor = editor.getLastCursor();
      return cursor.onDidChangePosition(function() {
        return marker.destroy();
      });
    };

    return Godef;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29kZWYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxlQUFBLE9BQUQsRUFBVSxrQkFBQSxVQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw4QkFBUixDQUx0QixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsS0FBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsS0FBcEIsQ0FEQSxDQUFBOztBQUdhLElBQUEsZUFBRSxRQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsY0FBaEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIscUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FGUixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsdUJBQUQsR0FBMkIsRUFBQSxHQUFHLElBQUMsQ0FBQSxJQUFKLEdBQVMsV0FIcEMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGtCQUFELEdBQTBCLElBQUEsbUJBQUEsQ0FBQSxDQUoxQixDQUFBO0FB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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/godef.coffee
