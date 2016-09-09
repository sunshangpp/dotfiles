(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('format', function() {
    var buffer, dispatch, editor, filePath, mainModule, _ref;
    _ref = [], mainModule = _ref[0], editor = _ref[1], dispatch = _ref[2], buffer = _ref[3], filePath = _ref[4];
    beforeEach(function() {
      var atomconfig, directory;
      atomconfig = new AtomConfig();
      atomconfig.allfunctionalitydisabled();
      directory = temp.mkdirSync();
      atom.project.setPaths(directory);
      filePath = path.join(directory, 'go-plus.go');
      fs.writeFileSync(filePath, '');
      jasmine.unspy(window, 'setTimeout');
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(e) {
          editor = e;
          return buffer = editor.getBuffer();
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
    describe('when format on save is enabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.formatOnSave', true);
      });
      it('reformats the file', function() {
        var done;
        done = false;
        runs(function() {
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('reformats the file after multiple saves', function() {
        var displayDone, done;
        done = false;
        displayDone = false;
        runs(function() {
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          dispatch.once('display-complete', function() {
            return displayDone = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        waitsFor(function() {
          return done === true;
        });
        waitsFor(function() {
          return displayDone === true;
        });
        runs(function() {
          done = false;
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main() {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('collects errors when the input is invalid', function() {
        var done;
        done = false;
        runs(function() {
          dispatch.once('dispatch-complete', function(editor) {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main(!)  {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].column).toBe('11');
            expect(dispatch.messages[0].line).toBe('3');
            expect(dispatch.messages[0].msg).toBe('expected type, found \'!\'');
            return done = true;
          });
          buffer.setText('package main\n\nfunc main(!)  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      it('uses goimports to reorganize imports if enabled', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.formatTool', 'goimports');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, 世界")\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n\tfmt.Println("Hello, 世界")\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('uses goreturns to handle returns if enabled', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.formatTool', 'goreturns');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package demo\n\nimport "errors"\n\nfunc F() (string, int, error) {\n\treturn "", 0, errors.New("foo")\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package demo\n\nfunc F() (string, int, error)     {\nreturn errors.New("foo") }');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
    return describe('when format on save is disabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.formatOnSave', false);
      });
      return it('does not reformat the file', function() {
        var done;
        done = false;
        runs(function() {
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main()  {\n}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            return done = true;
          });
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvZm10LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG1CQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLG9EQUFBO0FBQUEsSUFBQSxPQUFtRCxFQUFuRCxFQUFDLG9CQUFELEVBQWEsZ0JBQWIsRUFBcUIsa0JBQXJCLEVBQStCLGdCQUEvQixFQUF1QyxrQkFBdkMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEscUJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsVUFBVSxDQUFDLHdCQUFYLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUZaLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixTQUF0QixDQUhBLENBQUE7QUFBQSxNQUlBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FKWCxDQUFBO0FBQUEs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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/gofmt-spec.coffee
