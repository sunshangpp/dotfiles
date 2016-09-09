(function() {
  var AtomConfig, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  AtomConfig = require('./util/atomconfig');

  describe('Go Plus', function() {
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
    return describe('when the editor is destroyed', function() {
      beforeEach(function() {
        atom.config.set('go-plus.formatOnSave', true);
        return editor.destroy();
      });
      return it('unsubscribes from the buffer', function() {
        var done;
        editor.destroy();
        done = false;
        runs(function() {
          var bufferSubscription;
          buffer.setText('package main\n\nfunc main()  {\n}\n');
          expect(editor.getGrammar().scopeName).toBe('source.go');
          bufferSubscription = buffer.onDidSave(function() {
            if (bufferSubscription != null) {
              bufferSubscription.dispose();
            }
            expect(fs.readFileSync(filePath, {
              encoding: 'utf8'
            })).toBe('package main\n\nfunc main()  {\n}\n');
            return done = true;
          });
          buffer.save();
          return expect(buffer.getText()).toBe('package main\n\nfunc main()  {\n}\n');
        });
        waits(function() {
          return 500;
        });
        runs(function() {
          return expect(fs.readFileSync(filePath, {
            encoding: 'utf8'
          })).toBe('package main\n\nfunc main()  {\n}\n');
        });
        return waitsFor(function() {
          return done === true;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvcGx1cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsb0RBQUE7QUFBQSxJQUFBLE9BQW1ELEVBQW5ELEVBQUMsb0JBQUQsRUFBYSxnQkFBYixFQUFxQixrQkFBckIsRUFBK0IsZ0JBQS9CLEVBQXVDLGtCQUF2QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxxQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxVQUFVLENBQUMsd0JBQVgsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBLENBRlosQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLFNBQXRCLENBSEEsQ0FBQTtBQUFBLE1BSUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixZQUFyQixDQUpYLENBQUE7QUFBQSxNQUtBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLEVBQTNCLENB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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/goplus-spec.coffee
