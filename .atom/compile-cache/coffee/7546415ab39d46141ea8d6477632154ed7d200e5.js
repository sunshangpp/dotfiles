(function() {
  var AtomConfig, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('lint', function() {
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
    return describe('when lint on save is enabled', function() {
      beforeEach(function() {
        return atom.config.set('go-plus.lintOnSave', true);
      });
      it('displays errors for missing documentation', function() {
        var done;
        done = false;
        runs(function() {
          buffer.setText('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].column).toBe('6');
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('exported type T should have comment or be unexported');
            return done = true;
          });
          return buffer.save();
        });
        return waitsFor(function() {
          return done === true;
        });
      });
      return it('allows lint args to be specified', function() {
        var done;
        done = false;
        runs(function() {
          atom.config.set('go-plus.golintArgs', '-min_confidence=0.8');
          buffer.setText('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
          dispatch.once('dispatch-complete', function() {
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nimport "fmt"\n\ntype T int\n\nfunc main()  {\nreturn\nfmt.Println("Unreachable...")}\n');
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(1);
            expect(dispatch.messages[0].column).toBe('6');
            expect(dispatch.messages[0].line).toBe('5');
            expect(dispatch.messages[0].msg).toBe('exported type T should have comment or be unexported');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvbGludC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBRlAsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUpiLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsTUFBVCxFQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLG9EQUFBO0FBQUEsSUFBQSxPQUFtRCxFQUFuRCxFQUFDLG9CQUFELEVBQWEsZ0JBQWIsRUFBcUIsa0JBQXJCLEVBQStCLGdCQUEvQixFQUF1QyxrQkFBdkMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEscUJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsVUFBVSxDQUFDLHdCQUFYLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUZaLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixTQUF0QixDQUhBLENBQUE7QUFBQSxNQUlBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FKWCxDQUFBO0FBQUEs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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/golint-spec.coffee
