(function() {
  var Point, Subscriber, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require("underscore-plus");

  Subscriber = require('emissary').Subscriber;

  Point = require('atom').Point;

  describe("godef", function() {
    var bufferTextOffset, bufferTextPos, cursorToOffset, cursorToText, dispatch, editor, editorView, filePath, godefDone, mainModule, offsetCursorPos, testDisposables, testText, triggerCommand, waitsForCommand, waitsForDispatchComplete, waitsForGodef, waitsForGodefReturn, workspaceElement, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], editorView = _ref[2], dispatch = _ref[3], filePath = _ref[4], workspaceElement = _ref[5];
    testDisposables = [];
    testText = "package main\nimport \"fmt\"\nvar testvar = \"stringy\"\n\nfunc f(){\n  localVar := \" says 世界中の世界中の!\"\n  fmt.Println( testvar + localVar )}";
    beforeEach(function() {
      var directory;
      atom.config.set("go-plus.formatOnSave", false);
      atom.config.set("go-plus.lintOnSave", false);
      atom.config.set("go-plus.vetOnSave", false);
      atom.config.set("go-plus.syntaxCheckOnSave", false);
      atom.config.set("go-plus.runCoverageOnSave", false);
      directory = temp.mkdirSync();
      atom.project.setPaths(directory);
      filePath = path.join(directory, 'go-plus-testing.go');
      fs.writeFileSync(filePath, '');
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      jasmine.unspy(window, 'setTimeout');
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-go');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('go-plus').then(function(g) {
          return mainModule = g.mainModule;
        });
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = mainModule.dispatch) != null ? _ref1.ready : void 0;
      });
      return runs(function() {
        return dispatch = mainModule.dispatch;
      });
    });
    triggerCommand = function(command) {
      return atom.commands.dispatch(workspaceElement, dispatch.godef[command]);
    };
    godefDone = function() {
      return new Promise(function(resolve, reject) {
        testDisposables.push(dispatch.godef.onDidComplete(resolve));
      });
    };
    bufferTextOffset = function(text, count, delta) {
      var buffer, i, index, _i;
      if (count == null) {
        count = 1;
      }
      if (delta == null) {
        delta = 0;
      }
      buffer = editor.getText();
      index = -1;
      for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
        index = buffer.indexOf(text, (index === -1 ? 0 : index + text.length));
        if (index === -1) {
          break;
        }
      }
      if (index === -1) {
        return index;
      }
      return index + delta;
    };
    offsetCursorPos = function(offset) {
      if (offset < 0) {
        return;
      }
      return editor.getBuffer().positionForCharacterIndex(offset);
    };
    bufferTextPos = function(text, count, delta) {
      if (count == null) {
        count = 1;
      }
      if (delta == null) {
        delta = 0;
      }
      return offsetCursorPos(bufferTextOffset(text, count, delta));
    };
    cursorToOffset = function(offset) {
      if (offset === -1) {
        return;
      }
      editor.setCursorBufferPosition(offsetCursorPos(offset));
    };
    cursorToText = function(text, count, delta) {
      if (count == null) {
        count = 1;
      }
      if (delta == null) {
        delta = 0;
      }
      return cursorToOffset(bufferTextOffset(text, count, delta));
    };
    afterEach(function() {
      var disposable, _i, _len;
      for (_i = 0, _len = testDisposables.length; _i < _len; _i++) {
        disposable = testDisposables[_i];
        disposable.dispose();
      }
      return testDisposables = [];
    });
    waitsForCommand = function(command) {
      var godefPromise;
      godefPromise = void 0;
      runs(function() {
        godefPromise = godefDone();
        return triggerCommand(command);
      });
      waitsForPromise(function() {
        return godefPromise;
      });
    };
    waitsForGodef = function() {
      return waitsForCommand('godefCommand');
    };
    waitsForGodefReturn = function() {
      return waitsForCommand('returnCommand');
    };
    waitsForDispatchComplete = function(action) {
      var dispatchComplete;
      dispatchComplete = false;
      runs(function() {
        return dispatch.once('dispatch-complete', function() {
          return dispatchComplete = true;
        });
      });
      runs(action);
      return waitsFor(function() {
        return dispatchComplete;
      });
    };
    describe("wordAtCursor (| represents cursor pos)", function() {
      var godef;
      godef = null;
      beforeEach(function() {
        godef = dispatch.godef;
        godef.editor = editor;
        return editor.setText("foo foo.bar bar");
      });
      it("should return foo for |foo", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 0]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo');
        return expect(range).toEqual([[0, 0], [0, 3]]);
      });
      it("should return foo for fo|o", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 2]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo');
        return expect(range).toEqual([[0, 0], [0, 3]]);
      });
      it("should return no word for foo| foo", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 3]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo');
        return expect(range).toEqual([[0, 0], [0, 3]]);
      });
      it("should return bar for |bar", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 12]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('bar');
        return expect(range).toEqual([[0, 12], [0, 15]]);
      });
      it("should return foo.bar for !foo.bar", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 4]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo.bar');
        return expect(range).toEqual([[0, 4], [0, 11]]);
      });
      return it("should return foo.bar for foo.ba|r", function() {
        var range, word, _ref1;
        editor.setCursorBufferPosition([0, 10]);
        _ref1 = godef.wordAtCursor(), word = _ref1.word, range = _ref1.range;
        expect(word).toEqual('foo.bar');
        return expect(range).toEqual([[0, 4], [0, 11]]);
      });
    });
    describe("when go-plus is loaded", function() {
      return it("should have registered the golang:godef command", function() {
        var cmd, currentCommands, godefCommand;
        currentCommands = atom.commands.findCommands({
          target: editorView
        });
        godefCommand = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = currentCommands.length; _i < _len; _i++) {
            cmd = currentCommands[_i];
            if (cmd.name === dispatch.godef.godefCommand) {
              _results.push(cmd);
            }
          }
          return _results;
        })();
        return expect(godefCommand.length).toEqual(1);
      });
    });
    describe("when godef command is invoked", function() {
      describe("if there is more than one cursor", function() {
        return it("displays a warning message", function() {
          waitsForDispatchComplete(function() {
            editor.setText(testText);
            return editor.save();
          });
          runs(function() {
            editor.setCursorBufferPosition([0, 0]);
            return editor.addCursorAtBufferPosition([1, 0]);
          });
          waitsForGodef();
          return runs(function() {
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            return expect(dispatch.messages[0].type).toBe("warning");
          });
        });
      });
      describe("with no word under the cursor", function() {
        return it("displays a warning message", function() {
          editor.setCursorBufferPosition([0, 0]);
          waitsForGodef();
          return runs(function() {
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            return expect(dispatch.messages[0].type).toBe("warning");
          });
        });
      });
      return describe("with a word under the cursor", function() {
        beforeEach(function() {
          return waitsForDispatchComplete(function() {
            editor.setText(testText);
            return editor.save();
          });
        });
        describe("defined within the current file", function() {
          beforeEach(function() {
            cursorToText("testvar", 2);
            return waitsForGodef();
          });
          it("should move the cursor to the definition", function() {
            return runs(function() {
              return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("testvar", 1));
            });
          });
          return it("should create a highlight decoration of the correct class", function() {
            return runs(function() {
              var d, goPlusHighlightDecs, higlightClass;
              higlightClass = 'definition';
              goPlusHighlightDecs = (function() {
                var _i, _len, _ref1, _results;
                _ref1 = editor.getHighlightDecorations();
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  d = _ref1[_i];
                  if (d.getProperties()['class'] === higlightClass) {
                    _results.push(d);
                  }
                }
                return _results;
              })();
              return expect(goPlusHighlightDecs.length).toBe(1);
            });
          });
        });
        describe("defined outside the current file", function() {
          return it("should open a new text editor", function() {
            runs(function() {
              return cursorToText("fmt.Println", 1, "fmt.".length);
            });
            waitsForGodef();
            return runs(function() {
              var currentEditor;
              currentEditor = atom.workspace.getActiveTextEditor();
              return expect(currentEditor.getTitle()).toBe('print.go');
            });
          });
        });
        describe("defined as a local variable", function() {
          return it("should jump to the local var definition", function() {
            runs(function() {
              return cursorToText("localVar", 2);
            });
            waitsForGodef();
            return runs(function() {
              return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 1));
            });
          });
        });
        describe("defined as a local import prefix", function() {
          return it("should jump to the import", function() {
            runs(function() {
              return cursorToText("fmt.Println");
            });
            waitsForGodef();
            return runs(function() {
              return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("\"fmt\""));
            });
          });
        });
        return describe("an import statement", function() {
          return it("should open the first (lexicographical) .go file in the imported package", function() {
            runs(function() {
              return cursorToText("\"fmt\"");
            });
            waitsForGodef();
            return runs(function() {
              var activeEditor, file;
              activeEditor = atom.workspace.getActiveTextEditor();
              file = activeEditor.getURI();
              expect(path.basename(file)).toEqual("doc.go");
              return expect(path.basename(path.dirname(file))).toEqual("fmt");
            });
          });
        });
      });
    });
    return describe("when godef-return command is invoked", function() {
      beforeEach(function() {
        return waitsForDispatchComplete(function() {
          editor.setText(testText);
          return editor.save();
        });
      });
      it("will return across files to the location where godef was invoked", function() {
        runs(function() {
          return cursorToText("fmt.Println", 1, "fmt.".length);
        });
        waitsForGodef();
        runs(function() {
          var activeEditor;
          activeEditor = atom.workspace.getActiveTextEditor();
          return expect(path.basename(activeEditor.getURI())).toEqual("print.go");
        });
        waitsForGodefReturn();
        return runs(function() {
          expect(atom.workspace.getActiveTextEditor()).toBe(editor);
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("fmt.Println", 1, "fmt.".length));
        });
      });
      it("will return within the same file to the location where godef was invoked", function() {
        runs(function() {
          return cursorToText("localVar", 2);
        });
        waitsForGodef();
        runs(function() {
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 1));
        });
        waitsForGodefReturn();
        return runs(function() {
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 2));
        });
      });
      return it('will do nothing if the return stack is empty', function() {
        runs(function() {
          dispatch.godef.clearReturnHistory();
          return cursorToText("localVar", 2);
        });
        waitsForGodefReturn();
        return runs(function() {
          return expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 2));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvZGVmLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUyxpQkFBVCxDQUhKLENBQUE7O0FBQUEsRUFJQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFKRCxDQUFBOztBQUFBLEVBS0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBTEQsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixRQUFBLCtSQUFBO0FBQUEsSUFBQSxPQUF5RSxFQUF6RSxFQUFDLG9CQUFELEVBQWEsZ0JBQWIsRUFBcUIsb0JBQXJCLEVBQWlDLGtCQUFqQyxFQUEyQyxrQkFBM0MsRUFBcUQsMEJBQXJELENBQUE7QUFBQSxJQUNBLGVBQUEsR0FBa0IsRUFEbEIsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLCtJQUZYLENBQUE7QUFBQSxJQVdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFFVCxVQUFBLFNBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsS0FBeEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLEtBQXRDLENBREEsQ0FBQTtBQUFBLE1B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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/godef-spec.coffee
