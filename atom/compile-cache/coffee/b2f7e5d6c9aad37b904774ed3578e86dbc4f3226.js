(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('gopath', function() {
    var directory, dispatch, editor, filePath, mainModule, oldGoPath, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], dispatch = _ref[2], directory = _ref[3], filePath = _ref[4], oldGoPath = _ref[5];
    beforeEach(function() {
      var atomconfig;
      atomconfig = new AtomConfig();
      atomconfig.allfunctionalitydisabled();
      directory = temp.mkdirSync();
      oldGoPath = process.env.GOPATH;
      process.env['GOPATH'] = directory;
      atom.project.setPaths(directory);
      return jasmine.unspy(window, 'setTimeout');
    });
    afterEach(function() {
      return process.env['GOPATH'] = oldGoPath;
    });
    describe('when syntax check on save is enabled and goPath is set', function() {
      beforeEach(function() {
        atom.config.set('go-plus.goPath', directory);
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'wrongsrc', 'github.com', 'testuser', 'example', 'go-plus.go');
        fs.writeFileSync(filePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
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
      it("displays a warning for a GOPATH without 'src' directory", function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          fs.unlinkSync(filePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nfunc main() {\n\treturn\n}\n');
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n\treturn\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH [' + directory + '] does not contain a "src" directory - please review http://golang.org/doc/code.html#Workspaces');
            expect((_ref4 = dispatch.messages[0]) != null ? _ref4.type : void 0).toBe('warning');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('displays a warning for a non-existent GOPATH', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          dispatch.goexecutable.current().gopath = path.join(directory, 'nonexistent');
          fs.unlinkSync(filePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nfunc main() {\n\treturn\n}\n');
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n\treturn\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH [' + path.join(directory, 'nonexistent') + '] does not exist');
            expect((_ref4 = dispatch.messages[0]) != null ? _ref4.type : void 0).toBe('warning');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when syntax check on save is enabled and GOPATH is not set', function() {
      beforeEach(function() {
        atom.config.set('go-plus.goPath', '');
        atom.config.set('go-plus.syntaxCheckOnSave', true);
        filePath = path.join(directory, 'wrongsrc', 'github.com', 'testuser', 'example', 'go-plus.go');
        fs.writeFileSync(filePath, '');
        waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function(e) {
            return editor = e;
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
      return it('displays warnings for an unset GOPATH', function() {
        var done;
        done = false;
        runs(function() {
          var buffer;
          dispatch.goexecutable.current().env['GOPATH'] = '';
          dispatch.goexecutable.current().gopath = '';
          fs.unlinkSync(filePath);
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nfunc main() {\n\treturn\n}\n');
          dispatch.once('dispatch-complete', function() {
            var _ref1, _ref2, _ref3, _ref4;
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n\treturn\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect((_ref1 = dispatch.messages[0]) != null ? _ref1.column : void 0).toBe(false);
            expect((_ref2 = dispatch.messages[0]) != null ? _ref2.line : void 0).toBe(false);
            expect((_ref3 = dispatch.messages[0]) != null ? _ref3.msg : void 0).toBe('Warning: GOPATH is not set – either set the GOPATH environment variable or define the Go Path in go-plus package preferences');
            expect((_ref4 = dispatch.messages[0]) != null ? _ref4.type : void 0).toBe('warning');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvcGF0aC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBRlAsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUpiLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsUUFBQSxrRUFBQTtBQUFBLElBQUEsT0FBaUUsRUFBakUsRUFBQyxvQkFBRCxFQUFhLGdCQUFiLEVBQXFCLGtCQUFyQixFQUErQixtQkFBL0IsRUFBMEMsa0JBQTFDLEVBQW9ELG1CQUFwRCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUNBLFVBQVUsQ0FBQyx3QkFBWCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FGWixDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUh4QixDQUFBO0FBQUEsTUFJQSxPQUFPLENBQUMsR0FBSSxDQUFBLFFBQUEsQ0FBWixHQUF3QixTQUp4QixDQUFBO0FBQUEsTUFL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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/gopath-spec.coffee
