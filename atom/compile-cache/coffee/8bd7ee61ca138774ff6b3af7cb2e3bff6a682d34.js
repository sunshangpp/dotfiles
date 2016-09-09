(function() {
  var AtomConfig, PathHelper, fs, path, temp, _;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  _ = require('underscore-plus');

  PathHelper = require('./util/pathhelper');

  AtomConfig = require('./util/atomconfig');

  describe('gocover', function() {
    var atomconfig, directory, dispatch, editor, filePath, mainModule, oldGoPath, pathhelper, testEditor, testFilePath, _ref;
    _ref = [], mainModule = _ref[0], atomconfig = _ref[1], editor = _ref[2], dispatch = _ref[3], testEditor = _ref[4], directory = _ref[5], filePath = _ref[6], testFilePath = _ref[7], oldGoPath = _ref[8], pathhelper = _ref[9];
    beforeEach(function() {
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
    return describe('when run coverage on save is enabled', function() {
      var ready;
      ready = false;
      beforeEach(function() {
        atom.config.set('go-plus.runCoverageOnSave', true);
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
      return it('displays coverage for go source', function() {
        var buffer, done;
        buffer = [][0];
        done = false;
        runs(function() {
          var testBuffer;
          buffer = editor.getBuffer();
          buffer.setText('package main\n\nimport "fmt"\n\nfunc main()  {\n\tfmt.Println(Hello())\n}\n\nfunc Hello() string {\n\treturn "Hello, 世界"\n}\n');
          testBuffer = testEditor.getBuffer();
          testBuffer.setText('package main\n\nimport "testing"\n\nfunc TestHello(t *testing.T) {\n\tresult := Hello()\n\tif result != "Hello, 世界" {\n\t\tt.Errorf("Expected %s - got %s", "Hello, 世界", result)\n\t}\n}');
          dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
          dispatch.once('coverage-complete', function() {
            expect(dispatch.messages != null).toBe(true);
            expect(_.size(dispatch.messages)).toBe(0);
            dispatch.once('coverage-complete', function() {
              var markers, range;
              expect(dispatch.messages != null).toBe(true);
              expect(_.size(dispatch.messages)).toBe(0);
              markers = buffer.findMarkers({
                "class": 'gocover'
              });
              expect(markers).toBeDefined();
              expect(markers.length).toBe(2);
              expect(markers[0]).toBeDefined();
              range = markers[0].getRange();
              expect(range.start.row).toBe(4);
              expect(range.start.column).toBe(13);
              expect(range.end.row).toBe(6);
              expect(range.end.column).toBe(1);
              expect(markers[1]).toBeDefined();
              range = markers[1].getRange();
              expect(range).toBeDefined();
              expect(range.start.row).toBe(8);
              expect(range.start.column).toBe(20);
              expect(range.end.row).toBe(10);
              expect(range.end.column).toBe(1);
              return done = true;
            });
            return testBuffer.save();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvY292ZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSxvSEFBQTtBQUFBLElBQUEsT0FBbUgsRUFBbkgsRUFBQyxvQkFBRCxFQUFhLG9CQUFiLEVBQXlCLGdCQUF6QixFQUFpQyxrQkFBakMsRUFBMkMsb0JBQTNDLEVBQXVELG1CQUF2RCxFQUFrRSxrQkFBbEUsRUFBNEUsc0JBQTVFLEVBQTBGLG1CQUExRixFQUFxRyxvQkFBckcsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBRGpCLENBQUE7QUFBQSxNQUVBLFVBQVUsQ0FBQyx3QkFBWCxDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFM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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/gocover-spec.coffee
