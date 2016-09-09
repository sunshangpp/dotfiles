(function() {
  var AtomConfig, PathHelper, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  PathHelper = require('./util/pathhelper');

  AtomConfig = require('./util/atomconfig');

  describe('build', function() {
    var directory, dispatch, editor, filePath, mainModule, oldGoPath, pathhelper, secondEditor, secondFilePath, testEditor, testFilePath, thirdEditor, thirdFilePath, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], dispatch = _ref[2], secondEditor = _ref[3], thirdEditor = _ref[4], testEditor = _ref[5], directory = _ref[6], filePath = _ref[7], secondFilePath = _ref[8], thirdFilePath = _ref[9], testFilePath = _ref[10], oldGoPath = _ref[11], pathhelper = _ref[12];
    beforeEach(function() {
      var atomconfig;
      atomconfig = new AtomConfig();
      pathhelper = new PathHelper();
      atomconfig.allfunctionalitydisabled();
      directory = temp.mkdirSync();
      oldGoPath = process.env.GOPATH;
      if (process.env.GOPATH == null) {
        oldGoPath = pathhelper.home() + path.sep + 'go';
      }
      process.env['GOPATH'] = directory;
      atom.project.setPaths(directory);
      return jasmine.unspy(window, 'setTimeout');
    });
    afterEach(function() {
      return process.env['GOPATH'] = oldGoPath;
    });
    describe('when syntax check on save is enabled', function() {
      var ready;
      ready = false;
      beforeEach(function() {
        atom.config.set('go-plus.goPath', directory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus.go');
        testFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus_test.go');
        fs.writeFileSync(filePath, '');
        fs.writeFileSync(testFilePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(testFilePath).then(function(e) {
            return testEditor = e;
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
      it('displays errors for unused code', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe('6');
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('42 evaluated but not used');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('displays errors for unused code in a test file', function() {
        var done;
        done = false;
        runs(function() {
          var testBuffer;
          fs.unlinkSync(filePath);
          testBuffer = testEditor.getBuffer();
          testBuffer.setText('package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\t42\n\tt.Error("Example Test")\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3;
            expect(fs.readFileSync(testFilePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\t42\n\tt.Error("Example Test")\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe('6');
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('42 evaluated but not used');
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('cleans up test file', function() {
        var done;
        done = false;
        runs(function() {
          var go, testBuffer;
          fs.unlinkSync(filePath);
          testBuffer = testEditor.getBuffer();
          testBuffer.setText('package main\n\nimport "testing"\n\nfunc TestExample(t *testing.T) {\n\tt.Error("Example Test")\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          go = dispatch.goexecutable.current();
          dispatch.once('dispatch-complete', function() {
            expect(fs.existsSync(path.join(directory, 'src', 'github.com', 'testuser', 'example', 'example.test' + go.exe))).toBe(false);
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it("does not error when a file is saved that is missing the 'package ...' directive", function() {
        var done;
        done = false;
        runs(function() {
          var testBuffer;
          fs.unlinkSync(filePath);
          testBuffer = testEditor.getBuffer();
          testBuffer.setText("");
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1;
            expect(fs.readFileSync(testFilePath, {
              encoding: 'utf8'
            })).toBe('');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.msg : void 0).toBe("expected 'package', found 'EOF'");
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    describe('when working with multiple files', function() {
      var buffer, done, secondBuffer, testBuffer, thirdBuffer, _ref1;
      _ref1 = [], buffer = _ref1[0], secondBuffer = _ref1[1], thirdBuffer = _ref1[2], testBuffer = _ref1[3], done = _ref1[4];
      beforeEach(function() {
        buffer = null;
        secondBuffer = null;
        thirdBuffer = null;
        testBuffer = null;
        done = false;
        atom.config.set('go-plus.goPath', directory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus.go');
        secondFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'util', 'util.go');
        thirdFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'util', 'strings.go');
        testFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus_test.go');
        fs.writeFileSync(filePath, '');
        fs.writeFileSync(secondFilePath, '');
        fs.writeFileSync(thirdFilePath, '');
        fs.writeFileSync(testFilePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(secondFilePath).then(function(e) {
            return secondEditor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(thirdFilePath).then(function(e) {
            return thirdEditor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(testFilePath).then(function(e) {
            return testEditor = e;
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
          var _ref2;
          return (_ref2 = mainModule.dispatch) != null ? _ref2.ready : void 0;
        });
        return runs(function() {
          return dispatch = mainModule.dispatch;
        });
      });
      it('does not display errors for dependent functions spread across multiple files in the same package', function() {
        runs(function() {
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          secondBuffer = secondEditor.getBuffer();
          thirdBuffer = thirdEditor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\nimport "github.com/testuser/example/util"\n\nfunc main() {\n\tfmt.Println("Hello, world!")\n\tutil.ProcessString("Hello, world!")\n}');
          secondBuffer.setText('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
          thirdBuffer.setText('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\treturn text + "-stringified"\n}');
          buffer.save();
          secondBuffer.save();
          return thirdBuffer.save();
        });
        waitsFor(function() {
          return !buffer.isModified() && !secondBuffer.isModified() && !thirdBuffer.isModified();
        });
        runs(function() {
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(secondFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          return secondBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('does display errors for errors in dependent functions spread across multiple files in the same package', function() {
        runs(function() {
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          secondBuffer = secondEditor.getBuffer();
          thirdBuffer = thirdEditor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\nimport "github.com/testuser/example/util"\n\nfunc main() {\n\tfmt.Println("Hello, world!")\n\tutil.ProcessString("Hello, world!")\n}');
          secondBuffer.setText('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
          thirdBuffer.setText('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
          buffer.save();
          secondBuffer.save();
          return thirdBuffer.save();
        });
        waitsFor(function() {
          return !buffer.isModified() && !secondBuffer.isModified() && !thirdBuffer.isModified();
        });
        runs(function() {
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(secondFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].file).toBe(thirdFilePath);
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('42 evaluated but not used');
            expect(dispatch.messages[0].type).toBe('error');
            expect(dispatch.messages[0].column).toBe(false);
            return done = true;
          });
          return secondBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('displays errors for unused code in a file under test', function() {
        runs(function() {
          fs.unlinkSync(filePath);
          secondBuffer = secondEditor.getBuffer();
          thirdBuffer = thirdEditor.getBuffer();
          testBuffer = testEditor.getBuffer();
          secondBuffer.setText('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
          thirdBuffer.setText('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
          testBuffer.setText('package util\n\nimport "testing"\nimport "fmt"\n\nfunc TestExample(t *testing.T) {\n\tfmt.Println(Stringify("Testing"))\n}');
          secondBuffer.save();
          thirdBuffer.save();
          return testBuffer.save();
        });
        waitsFor(function() {
          return !secondBuffer.isModified() && !thirdBuffer.isModified() && !testBuffer.isModified();
        });
        runs(function() {
          expect(fs.readFileSync(thirdFilePath, {
            encoding: 'utf8'
          })).toBe('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(secondFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\nimport "fmt"\n\n// ProcessString processes strings\nfunc ProcessString(text string) {\n\tfmt.Println("Processing...")\n\tfmt.Println(Stringify("Testing"))\n}');
            expect(fs.readFileSync(thirdFilePath, {
              encoding: 'utf8'
            })).toBe('package util\n\n// Stringify stringifies text\nfunc Stringify(text string) string {\n\t42\n\treturn text + "-stringified"\n}');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].file).toBe(thirdFilePath);
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('42 evaluated but not used');
            expect(dispatch.messages[0].type).toBe('error');
            expect(dispatch.messages[0].column).toBe(false);
            return done = true;
          });
          return testBuffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when files are opened outside a gopath', function() {
      var otherdirectory, ready;
      otherdirectory = [][0];
      ready = false;
      beforeEach(function() {
        otherdirectory = temp.mkdirSync();
        process.env['GOPATH'] = otherdirectory;
        atom.config.set('go-plus.goPath', otherdirectory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus.go');
        testFilePath = path.join(directory, 'src', 'github.com', 'testuser', 'example', 'go-plus_test.go');
        fs.writeFileSync(filePath, '');
        fs.writeFileSync(testFilePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open(testFilePath).then(function(e) {
            return testEditor = e;
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
      return it('displays warnings about the gopath, but still displays errors', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          fs.unlinkSync(testFilePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main()  {\n42\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(2);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH [' + otherdirectory + '] does not contain a "src" directory - please review http://golang.org/doc/code.html#Workspaces');
            expect((_ref4 = dispatch.messages[1]) != null ? _ref4.column : void 0).toBe(false);
            expect((_ref5 = dispatch.messages[1]) != null ? _ref5.file : void 0).toBe(fs.realpathSync(filePath));
            expect((_ref6 = dispatch.messages[1]) != null ? _ref6.line : void 0).toBe('6');
            expect((_ref7 = dispatch.messages[1]) != null ? _ref7.msg : void 0).toBe('42 evaluated but not used');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvYnVpbGQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxrS0FBQTtBQUFBLElBQUEsT0FBaUssRUFBakssRUFBQyxvQkFBRCxFQUFhLGdCQUFiLEVBQXFCLGtCQUFyQixFQUErQixzQkFBL0IsRUFBNkMscUJBQTdDLEVBQTBELG9CQUExRCxFQUFzRSxtQkFBdEUsRUFBaUYsa0JBQWpGLEVBQTJGLHdCQUEzRixFQUEyRyx1QkFBM0csRUFBMEgsdUJBQTFILEVBQXdJLG9CQUF4SSxFQUFtSixxQkFBbkosQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBRGpCLENBQUE7QUFBQSxNQUVBLFVBQVUsQ0FBQyx3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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/gobuild-spec.coffee
