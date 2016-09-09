function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-env jasmine */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

'use babel';

var nl = '\n';

describe('formatter', function () {
  var mainModule = null;
  var formatter = null;

  beforeEach(function () {
    _temp2['default'].track();
    atom.config.set('gofmt.formatOnSave', false);
    atom.config.set('editor.defaultLineEnding', 'LF');

    waitsForPromise(function () {
      return atom.packages.activatePackage('go-config').then(function () {
        return atom.packages.activatePackage('language-go');
      }).then(function () {
        return atom.packages.activatePackage('gofmt');
      }).then(function (pack) {
        mainModule = pack.mainModule;
      });
    });

    waitsFor(function () {
      return mainModule.goconfig;
    });

    waitsFor(function () {
      formatter = mainModule.getFormatter();
      return formatter;
    });

    waitsFor(function () {
      return formatter.ready();
    });
  });

  describe('when a simple file is opened', function () {
    var editor = undefined;
    var filePath = undefined;
    var saveSubscription = undefined;
    var actual = undefined;

    beforeEach(function () {
      var directory = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
      atom.project.setPaths([directory]);
      filePath = _path2['default'].join(directory, 'main.go');
      _fs2['default'].writeFileSync(filePath, '');
      waitsForPromise(function () {
        return atom.workspace.open(filePath).then(function (e) {
          editor = e;
          saveSubscription = e.onDidSave(function () {
            actual = e.getText();
          });
        });
      });
    });

    afterEach(function () {
      if (saveSubscription) {
        saveSubscription.dispose();
      }

      actual = undefined;
    });

    describe('when format on save is disabled and gofmt is the tool', function () {
      beforeEach(function () {
        atom.config.set('gofmt.formatOnSave', false);
        formatter.resetFormatterCache();
        formatter.updateFormatterCache();
        atom.config.set('gofmt.formatTool', 'gofmt');
        waitsFor(function () {
          return formatter.ready();
        });
      });

      it('does not format the file on save', function () {
        var text = 'package main' + nl + nl + 'func main()  {' + nl + '}' + nl;
        var expected = text;
        var formatted = 'package main' + nl + nl + 'func main() {' + nl + '}' + nl;

        runs(function () {
          var buffer = editor.getBuffer();
          buffer.setText(text);
          buffer.save();
        });

        waitsFor(function () {
          return actual;
        });

        runs(function () {
          expect(actual).toBe(expected);
          expect(actual).not.toBe(formatted);
        });
      });

      it('formats the file on command', function () {
        var text = 'package main' + nl + nl + 'func main()  {' + nl + '}' + nl;
        var unformatted = text;
        var formatted = 'package main' + nl + nl + 'func main() {' + nl + '}' + nl;

        runs(function () {
          var buffer = editor.getBuffer();
          buffer.setText(text);
          buffer.save();
        });

        waitsFor(function () {
          return actual;
        });

        runs(function () {
          expect(actual).toBe(unformatted);
          expect(actual).not.toBe(formatted);
          var target = atom.views.getView(editor);
          atom.commands.dispatch(target, 'golang:gofmt');
        });

        runs(function () {
          expect(editor.getText()).toBe(formatted);
        });
      });
    });

    describe('when format on save is enabled and gofmt is the tool', function () {
      beforeEach(function () {
        atom.config.set('gofmt.formatOnSave', true);
        formatter.resetFormatterCache();
        formatter.updateFormatterCache();
        atom.config.set('gofmt.formatTool', 'gofmt');
        waitsFor(function () {
          return formatter.ready();
        });
      });

      it('formats the file on save', function () {
        var text = 'package main' + nl + nl + 'func main()  {' + nl + '}' + nl;
        var expected = 'package main' + nl + nl + 'func main() {' + nl + '}' + nl;

        runs(function () {
          var buffer = editor.getBuffer();
          buffer.setText(text);
          buffer.save();
        });

        waitsFor(function () {
          return actual;
        });

        runs(function () {
          expect(actual).toBe(expected);
        });
      });
    });

    describe('when format on save is enabled and goimports is the tool', function () {
      beforeEach(function () {
        atom.config.set('gofmt.formatOnSave', true);
        formatter.resetFormatterCache();
        formatter.updateFormatterCache();
        atom.config.set('gofmt.formatTool', 'goimports');
        waitsFor(function () {
          return formatter.ready();
        });
      });

      it('formats the file on save', function () {
        var text = 'package main' + nl + nl + 'func main()  {' + nl + '}' + nl;
        var expected = 'package main' + nl + nl + 'func main() {' + nl + '}' + nl;

        runs(function () {
          var buffer = editor.getBuffer();
          buffer.setText(text);
          buffer.save();
        });

        waitsFor(function () {
          return actual;
        });

        runs(function () {
          expect(actual).toBe(expected);
        });
      });
    });

    describe('when format on save is enabled and goreturns is the tool', function () {
      beforeEach(function () {
        atom.config.set('gofmt.formatOnSave', true);
        formatter.resetFormatterCache();
        formatter.updateFormatterCache();
        atom.config.set('gofmt.formatTool', 'goreturns');
        waitsFor(function () {
          return formatter.ready();
        });
      });

      it('formats the file on save', function () {
        var text = 'package main' + nl + nl + 'func main()  {' + nl + '}' + nl;
        var expected = 'package main' + nl + nl + 'func main() {' + nl + '}' + nl;

        runs(function () {
          var buffer = editor.getBuffer();
          buffer.setText(text);
          buffer.save();
        });

        waitsFor(function () {
          return actual;
        });

        runs(function () {
          expect(actual).toBe(expected);
        });
      });
    });
  });
});

/*
path = require('path')
fs = require('fs-plus')
temp = require('temp').track()
_ = require('lodash')
AtomConfig = require('./util/atomconfig')

describe 'format', ->
  [mainModule, editor, dispatch, buffer, filePath] = []

  beforeEach ->
    atomconfig = new AtomConfig()
    atomconfig.allfunctionalitydisabled()
    directory = temp.mkdirSync()
    atom.project.setPaths(directory)
    filePath = path.join(directory, 'go-plus.go')
    fs.writeFileSync(filePath, '')
    jasmine.unspy(window, 'setTimeout')

    waitsForPromise -> atom.workspace.open(filePath).then (e) ->
      editor = e
      buffer = editor.getBuffer()

    waitsForPromise ->
      atom.packages.activatePackage('language-go')

    waitsForPromise -> atom.packages.activatePackage('go-plus').then (g) ->
      mainModule = g.mainModule

    waitsFor ->
      mainModule.dispatch?.ready

    runs ->
      dispatch = mainModule.dispatch

  describe 'when format on save is enabled', ->
    beforeEach ->
      atom.config.set('go-plus.formatOnSave', true)

    it 'reformats the file', ->
      done = false
      runs ->
        dispatch.once 'dispatch-complete', ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package main\n\nfunc main() {\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(0)
          done = true
        buffer.setText('package main\n\nfunc main()  {\n}\n')
        buffer.save()

      waitsFor ->
        done is true

    it 'reformats the file after multiple saves', ->
      done = false
      displayDone = false

      runs ->
        dispatch.once 'dispatch-complete', ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package main\n\nfunc main() {\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(0)
          done = true
        dispatch.once 'display-complete', ->
          displayDone = true
        buffer.setText('package main\n\nfunc main()  {\n}\n')
        buffer.save()

      waitsFor ->
        done is true

      waitsFor ->
        displayDone is true

      runs ->
        done = false
        dispatch.once 'dispatch-complete', ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package main\n\nfunc main() {\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(0)
          done = true
        buffer.setText('package main\n\nfunc main()  {\n}\n')
        buffer.save()

      waitsFor ->
        done is true

    it 'collects errors when the input is invalid', ->
      done = false
      runs ->
        dispatch.once 'dispatch-complete', (editor) ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package main\n\nfunc main(!)  {\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(1)
          expect(dispatch.messages[0].column).toBe('11')
          expect(dispatch.messages[0].line).toBe('3')
          expect(dispatch.messages[0].msg).toBe('expected type, found \'!\'')
          done = true
        buffer.setText('package main\n\nfunc main(!)  {\n}\n')
        buffer.save()

      waitsFor ->
        done is true

    it 'uses goimports to reorganize imports if enabled', ->
      done = false
      runs ->
        atom.config.set('go-plus.formatTool', 'goimports')
        dispatch.once 'dispatch-complete', ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, 世界")\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(0)
          done = true
        buffer.setText('package main\n\nfunc main()  {\n\tfmt.Println("Hello, 世界")\n}\n')
        buffer.save()

      waitsFor ->
        done is true

    it 'uses goreturns to handle returns if enabled', ->
      done = false
      runs ->
        atom.config.set('go-plus.formatTool', 'goreturns')
        dispatch.once 'dispatch-complete', ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package demo\n\nimport "errors"\n\nfunc F() (string, int, error) {\n\treturn "", 0, errors.New("foo")\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(0)
          done = true
        buffer.setText('package demo\n\nfunc F() (string, int, error)     {\nreturn errors.New("foo") }')
        buffer.save()

      waitsFor ->
        done is true

  describe 'when format on save is disabled', ->
    beforeEach ->
      atom.config.set('go-plus.formatOnSave', false)

    it 'does not reformat the file', ->
      done = false
      runs ->
        dispatch.once 'dispatch-complete', ->
          expect(fs.readFileSync(filePath, {encoding: 'utf8'})).toBe('package main\n\nfunc main()  {\n}\n')
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe(0)
          done = true
        buffer.setText('package main\n\nfunc main()  {\n}\n')
        buffer.save()

      waitsFor ->
        done is true

*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZm10L3NwZWMvZm9ybWF0dGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztrQkFHZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ04sTUFBTTs7OztBQUx2QixXQUFXLENBQUE7O0FBT1gsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFBOztBQUViLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDckIsTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFBOztBQUVwQixZQUFVLENBQUMsWUFBTTtBQUNmLHNCQUFLLEtBQUssRUFBRSxDQUFBO0FBQ1osUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRWpELG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzNELGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUE7T0FDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ1osZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hCLGtCQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQTtPQUM3QixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsWUFBUSxDQUFDLFlBQU07QUFDYixhQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUE7S0FDM0IsQ0FBQyxDQUFBOztBQUVGLFlBQVEsQ0FBQyxZQUFNO0FB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Q0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUM5QixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ29mbXQvc3BlYy9mb3JtYXR0ZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnXG5cbmxldCBubCA9ICdcXG4nXG5cbmRlc2NyaWJlKCdmb3JtYXR0ZXInLCAoKSA9PiB7XG4gIGxldCBtYWluTW9kdWxlID0gbnVsbFxuICBsZXQgZm9ybWF0dGVyID0gbnVsbFxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHRlbXAudHJhY2soKVxuICAgIGF0b20uY29uZmlnLnNldCgnZ29mbXQuZm9ybWF0T25TYXZlJywgZmFsc2UpXG4gICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3IuZGVmYXVsdExpbmVFbmRpbmcnLCAnTEYnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZ28tY29uZmlnJykudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtZ28nKVxuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZ29mbXQnKVxuICAgICAgfSkudGhlbigocGFjaykgPT4ge1xuICAgICAgICBtYWluTW9kdWxlID0gcGFjay5tYWluTW9kdWxlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gbWFpbk1vZHVsZS5nb2NvbmZpZ1xuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICBmb3JtYXR0ZXIgPSBtYWluTW9kdWxlLmdldEZvcm1hdHRlcigpXG4gICAgICByZXR1cm4gZm9ybWF0dGVyXG4gICAgfSlcblxuICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgIHJldHVybiBmb3JtYXR0ZXIucmVhZHkoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYSBzaW1wbGUgZmlsZSBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclxuICAgIGxldCBmaWxlUGF0aFxuICAgIGxldCBzYXZlU3Vic2NyaXB0aW9uXG4gICAgbGV0IGFjdHVhbFxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBsZXQgZGlyZWN0b3J5ID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKCkpXG4gICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW2RpcmVjdG9yeV0pXG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnksICdtYWluLmdvJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsICcnKVxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLnRoZW4oKGUpID0+IHtcbiAgICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgICAgc2F2ZVN1YnNjcmlwdGlvbiA9IGUub25EaWRTYXZlKCgpID0+IHtcbiAgICAgICAgICAgIGFjdHVhbCA9IGUuZ2V0VGV4dCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICBpZiAoc2F2ZVN1YnNjcmlwdGlvbikge1xuICAgICAgICBzYXZlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgfVxuXG4gICAgICBhY3R1YWwgPSB1bmRlZmluZWRcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gZm9ybWF0IG9uIHNhdmUgaXMgZGlzYWJsZWQgYW5kIGdvZm10IGlzIHRoZSB0b29sJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZ29mbXQuZm9ybWF0T25TYXZlJywgZmFsc2UpXG4gICAgICAgIGZvcm1hdHRlci5yZXNldEZvcm1hdHRlckNhY2hlKClcbiAgICAgICAgZm9ybWF0dGVyLnVwZGF0ZUZvcm1hdHRlckNhY2hlKClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnb2ZtdC5mb3JtYXRUb29sJywgJ2dvZm10JylcbiAgICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXIucmVhZHkoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ2RvZXMgbm90IGZvcm1hdCB0aGUgZmlsZSBvbiBzYXZlJywgKCkgPT4ge1xuICAgICAgICBsZXQgdGV4dCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSAgeycgKyBubCArICd9JyArIG5sXG4gICAgICAgIGxldCBleHBlY3RlZCA9IHRleHRcbiAgICAgICAgbGV0IGZvcm1hdHRlZCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSB7JyArIG5sICsgJ30nICsgbmxcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgICAgYnVmZmVyLnNldFRleHQodGV4dClcbiAgICAgICAgICBidWZmZXIuc2F2ZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgd2FpdHNGb3IoKCkgPT4geyByZXR1cm4gYWN0dWFsIH0pXG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGFjdHVhbCkudG9CZShleHBlY3RlZClcbiAgICAgICAgICBleHBlY3QoYWN0dWFsKS5ub3QudG9CZShmb3JtYXR0ZWQpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnZm9ybWF0cyB0aGUgZmlsZSBvbiBjb21tYW5kJywgKCkgPT4ge1xuICAgICAgICBsZXQgdGV4dCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSAgeycgKyBubCArICd9JyArIG5sXG4gICAgICAgIGxldCB1bmZvcm1hdHRlZCA9IHRleHRcbiAgICAgICAgbGV0IGZvcm1hdHRlZCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSB7JyArIG5sICsgJ30nICsgbmxcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgICAgYnVmZmVyLnNldFRleHQodGV4dClcbiAgICAgICAgICBidWZmZXIuc2F2ZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBhY3R1YWxcbiAgICAgICAgfSlcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QoYWN0dWFsKS50b0JlKHVuZm9ybWF0dGVkKVxuICAgICAgICAgIGV4cGVjdChhY3R1YWwpLm5vdC50b0JlKGZvcm1hdHRlZClcbiAgICAgICAgICBsZXQgdGFyZ2V0ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhcmdldCwgJ2dvbGFuZzpnb2ZtdCcpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoZm9ybWF0dGVkKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gZm9ybWF0IG9uIHNhdmUgaXMgZW5hYmxlZCBhbmQgZ29mbXQgaXMgdGhlIHRvb2wnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnb2ZtdC5mb3JtYXRPblNhdmUnLCB0cnVlKVxuICAgICAgICBmb3JtYXR0ZXIucmVzZXRGb3JtYXR0ZXJDYWNoZSgpXG4gICAgICAgIGZvcm1hdHRlci51cGRhdGVGb3JtYXR0ZXJDYWNoZSgpXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZ29mbXQuZm9ybWF0VG9vbCcsICdnb2ZtdCcpXG4gICAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gZm9ybWF0dGVyLnJlYWR5KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdmb3JtYXRzIHRoZSBmaWxlIG9uIHNhdmUnLCAoKSA9PiB7XG4gICAgICAgIGxldCB0ZXh0ID0gJ3BhY2thZ2UgbWFpbicgKyBubCArIG5sICsgJ2Z1bmMgbWFpbigpICB7JyArIG5sICsgJ30nICsgbmxcbiAgICAgICAgbGV0IGV4cGVjdGVkID0gJ3BhY2thZ2UgbWFpbicgKyBubCArIG5sICsgJ2Z1bmMgbWFpbigpIHsnICsgbmwgKyAnfScgKyBubFxuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgICAgICBidWZmZXIuc2V0VGV4dCh0ZXh0KVxuICAgICAgICAgIGJ1ZmZlci5zYXZlKClcbiAgICAgICAgfSlcblxuICAgICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGFjdHVhbFxuICAgICAgICB9KVxuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChhY3R1YWwpLnRvQmUoZXhwZWN0ZWQpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiBmb3JtYXQgb24gc2F2ZSBpcyBlbmFibGVkIGFuZCBnb2ltcG9ydHMgaXMgdGhlIHRvb2wnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnb2ZtdC5mb3JtYXRPblNhdmUnLCB0cnVlKVxuICAgICAgICBmb3JtYXR0ZXIucmVzZXRGb3JtYXR0ZXJDYWNoZSgpXG4gICAgICAgIGZvcm1hdHRlci51cGRhdGVGb3JtYXR0ZXJDYWNoZSgpXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZ29mbXQuZm9ybWF0VG9vbCcsICdnb2ltcG9ydHMnKVxuICAgICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGZvcm1hdHRlci5yZWFkeSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnZm9ybWF0cyB0aGUgZmlsZSBvbiBzYXZlJywgKCkgPT4ge1xuICAgICAgICBsZXQgdGV4dCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSAgeycgKyBubCArICd9JyArIG5sXG4gICAgICAgIGxldCBleHBlY3RlZCA9ICdwYWNrYWdlIG1haW4nICsgbmwgKyBubCArICdmdW5jIG1haW4oKSB7JyArIG5sICsgJ30nICsgbmxcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgICAgYnVmZmVyLnNldFRleHQodGV4dClcbiAgICAgICAgICBidWZmZXIuc2F2ZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBhY3R1YWxcbiAgICAgICAgfSlcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QoYWN0dWFsKS50b0JlKGV4cGVjdGVkKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gZm9ybWF0IG9uIHNhdmUgaXMgZW5hYmxlZCBhbmQgZ29yZXR1cm5zIGlzIHRoZSB0b29sJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZ29mbXQuZm9ybWF0T25TYXZlJywgdHJ1ZSlcbiAgICAgICAgZm9ybWF0dGVyLnJlc2V0Rm9ybWF0dGVyQ2FjaGUoKVxuICAgICAgICBmb3JtYXR0ZXIudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvZm10LmZvcm1hdFRvb2wnLCAnZ29yZXR1cm5zJylcbiAgICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXIucmVhZHkoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ2Zvcm1hdHMgdGhlIGZpbGUgb24gc2F2ZScsICgpID0+IHtcbiAgICAgICAgbGV0IHRleHQgPSAncGFja2FnZSBtYWluJyArIG5sICsgbmwgKyAnZnVuYyBtYWluKCkgIHsnICsgbmwgKyAnfScgKyBubFxuICAgICAgICBsZXQgZXhwZWN0ZWQgPSAncGFja2FnZSBtYWluJyArIG5sICsgbmwgKyAnZnVuYyBtYWluKCkgeycgKyBubCArICd9JyArIG5sXG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgICAgIGJ1ZmZlci5zZXRUZXh0KHRleHQpXG4gICAgICAgICAgYnVmZmVyLnNhdmUoKVxuICAgICAgICB9KVxuXG4gICAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gYWN0dWFsXG4gICAgICAgIH0pXG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGFjdHVhbCkudG9CZShleHBlY3RlZClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8qXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5mcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKVxudGVtcCA9IHJlcXVpcmUoJ3RlbXAnKS50cmFjaygpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbkF0b21Db25maWcgPSByZXF1aXJlKCcuL3V0aWwvYXRvbWNvbmZpZycpXG5cbmRlc2NyaWJlICdmb3JtYXQnLCAtPlxuICBbbWFpbk1vZHVsZSwgZWRpdG9yLCBkaXNwYXRjaCwgYnVmZmVyLCBmaWxlUGF0aF0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBhdG9tY29uZmlnID0gbmV3IEF0b21Db25maWcoKVxuICAgIGF0b21jb25maWcuYWxsZnVuY3Rpb25hbGl0eWRpc2FibGVkKClcbiAgICBkaXJlY3RvcnkgPSB0ZW1wLm1rZGlyU3luYygpXG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKGRpcmVjdG9yeSlcbiAgICBmaWxlUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnksICdnby1wbHVzLmdvJylcbiAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCAnJylcbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLnRoZW4gKGUpIC0+XG4gICAgICBlZGl0b3IgPSBlXG4gICAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWdvJylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZ28tcGx1cycpLnRoZW4gKGcpIC0+XG4gICAgICBtYWluTW9kdWxlID0gZy5tYWluTW9kdWxlXG5cbiAgICB3YWl0c0ZvciAtPlxuICAgICAgbWFpbk1vZHVsZS5kaXNwYXRjaD8ucmVhZHlcblxuICAgIHJ1bnMgLT5cbiAgICAgIGRpc3BhdGNoID0gbWFpbk1vZHVsZS5kaXNwYXRjaFxuXG4gIGRlc2NyaWJlICd3aGVuIGZvcm1hdCBvbiBzYXZlIGlzIGVuYWJsZWQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5mb3JtYXRPblNhdmUnLCB0cnVlKVxuXG4gICAgaXQgJ3JlZm9ybWF0cyB0aGUgZmlsZScsIC0+XG4gICAgICBkb25lID0gZmFsc2VcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZGlzcGF0Y2gub25jZSAnZGlzcGF0Y2gtY29tcGxldGUnLCAtPlxuICAgICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSkpLnRvQmUoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpIHtcXG59XFxuJylcbiAgICAgICAgICBleHBlY3QoZGlzcGF0Y2gubWVzc2FnZXM/KS50b0JlKHRydWUpXG4gICAgICAgICAgZXhwZWN0KF8uc2l6ZShkaXNwYXRjaC5tZXNzYWdlcykpLnRvQmUoMClcbiAgICAgICAgICBkb25lID0gdHJ1ZVxuICAgICAgICBidWZmZXIuc2V0VGV4dCgncGFja2FnZSBtYWluXFxuXFxuZnVuYyBtYWluKCkgIHtcXG59XFxuJylcbiAgICAgICAgYnVmZmVyLnNhdmUoKVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBkb25lIGlzIHRydWVcblxuICAgIGl0ICdyZWZvcm1hdHMgdGhlIGZpbGUgYWZ0ZXIgbXVsdGlwbGUgc2F2ZXMnLCAtPlxuICAgICAgZG9uZSA9IGZhbHNlXG4gICAgICBkaXNwbGF5RG9uZSA9IGZhbHNlXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZGlzcGF0Y2gub25jZSAnZGlzcGF0Y2gtY29tcGxldGUnLCAtPlxuICAgICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSkpLnRvQmUoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpIHtcXG59XFxuJylcbiAgICAgICAgICBleHBlY3QoZGlzcGF0Y2gubWVzc2FnZXM/KS50b0JlKHRydWUpXG4gICAgICAgICAgZXhwZWN0KF8uc2l6ZShkaXNwYXRjaC5tZXNzYWdlcykpLnRvQmUoMClcbiAgICAgICAgICBkb25lID0gdHJ1ZVxuICAgICAgICBkaXNwYXRjaC5vbmNlICdkaXNwbGF5LWNvbXBsZXRlJywgLT5cbiAgICAgICAgICBkaXNwbGF5RG9uZSA9IHRydWVcbiAgICAgICAgYnVmZmVyLnNldFRleHQoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpICB7XFxufVxcbicpXG4gICAgICAgIGJ1ZmZlci5zYXZlKClcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZG9uZSBpcyB0cnVlXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGRpc3BsYXlEb25lIGlzIHRydWVcblxuICAgICAgcnVucyAtPlxuICAgICAgICBkb25lID0gZmFsc2VcbiAgICAgICAgZGlzcGF0Y2gub25jZSAnZGlzcGF0Y2gtY29tcGxldGUnLCAtPlxuICAgICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSkpLnRvQmUoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpIHtcXG59XFxuJylcbiAgICAgICAgICBleHBlY3QoZGlzcGF0Y2gubWVzc2FnZXM/KS50b0JlKHRydWUpXG4gICAgICAgICAgZXhwZWN0KF8uc2l6ZShkaXNwYXRjaC5tZXNzYWdlcykpLnRvQmUoMClcbiAgICAgICAgICBkb25lID0gdHJ1ZVxuICAgICAgICBidWZmZXIuc2V0VGV4dCgncGFja2FnZSBtYWluXFxuXFxuZnVuYyBtYWluKCkgIHtcXG59XFxuJylcbiAgICAgICAgYnVmZmVyLnNhdmUoKVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBkb25lIGlzIHRydWVcblxuICAgIGl0ICdjb2xsZWN0cyBlcnJvcnMgd2hlbiB0aGUgaW5wdXQgaXMgaW52YWxpZCcsIC0+XG4gICAgICBkb25lID0gZmFsc2VcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZGlzcGF0Y2gub25jZSAnZGlzcGF0Y2gtY29tcGxldGUnLCAoZWRpdG9yKSAtPlxuICAgICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSkpLnRvQmUoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbighKSAge1xcbn1cXG4nKVxuICAgICAgICAgIGV4cGVjdChkaXNwYXRjaC5tZXNzYWdlcz8pLnRvQmUodHJ1ZSlcbiAgICAgICAgICBleHBlY3QoXy5zaXplKGRpc3BhdGNoLm1lc3NhZ2VzKSkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChkaXNwYXRjaC5tZXNzYWdlc1swXS5jb2x1bW4pLnRvQmUoJzExJylcbiAgICAgICAgICBleHBlY3QoZGlzcGF0Y2gubWVzc2FnZXNbMF0ubGluZSkudG9CZSgnMycpXG4gICAgICAgICAgZXhwZWN0KGRpc3BhdGNoLm1lc3NhZ2VzWzBdLm1zZykudG9CZSgnZXhwZWN0ZWQgdHlwZSwgZm91bmQgXFwnIVxcJycpXG4gICAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgYnVmZmVyLnNldFRleHQoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbighKSAge1xcbn1cXG4nKVxuICAgICAgICBidWZmZXIuc2F2ZSgpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGRvbmUgaXMgdHJ1ZVxuXG4gICAgaXQgJ3VzZXMgZ29pbXBvcnRzIHRvIHJlb3JnYW5pemUgaW1wb3J0cyBpZiBlbmFibGVkJywgLT5cbiAgICAgIGRvbmUgPSBmYWxzZVxuICAgICAgcnVucyAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMuZm9ybWF0VG9vbCcsICdnb2ltcG9ydHMnKVxuICAgICAgICBkaXNwYXRjaC5vbmNlICdkaXNwYXRjaC1jb21wbGV0ZScsIC0+XG4gICAgICAgICAgZXhwZWN0KGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KSkudG9CZSgncGFja2FnZSBtYWluXFxuXFxuaW1wb3J0IFwiZm10XCJcXG5cXG5mdW5jIG1haW4oKSB7XFxuXFx0Zm10LlByaW50bG4oXCJIZWxsbywg5LiW55WMXCIpXFxufVxcbicpXG4gICAgICAgICAgZXhwZWN0KGRpc3BhdGNoLm1lc3NhZ2VzPykudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChfLnNpemUoZGlzcGF0Y2gubWVzc2FnZXMpKS50b0JlKDApXG4gICAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgYnVmZmVyLnNldFRleHQoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpICB7XFxuXFx0Zm10LlByaW50bG4oXCJIZWxsbywg5LiW55WMXCIpXFxufVxcbicpXG4gICAgICAgIGJ1ZmZlci5zYXZlKClcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZG9uZSBpcyB0cnVlXG5cbiAgICBpdCAndXNlcyBnb3JldHVybnMgdG8gaGFuZGxlIHJldHVybnMgaWYgZW5hYmxlZCcsIC0+XG4gICAgICBkb25lID0gZmFsc2VcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1wbHVzLmZvcm1hdFRvb2wnLCAnZ29yZXR1cm5zJylcbiAgICAgICAgZGlzcGF0Y2gub25jZSAnZGlzcGF0Y2gtY29tcGxldGUnLCAtPlxuICAgICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSkpLnRvQmUoJ3BhY2thZ2UgZGVtb1xcblxcbmltcG9ydCBcImVycm9yc1wiXFxuXFxuZnVuYyBGKCkgKHN0cmluZywgaW50LCBlcnJvcikge1xcblxcdHJldHVybiBcIlwiLCAwLCBlcnJvcnMuTmV3KFwiZm9vXCIpXFxufVxcbicpXG4gICAgICAgICAgZXhwZWN0KGRpc3BhdGNoLm1lc3NhZ2VzPykudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChfLnNpemUoZGlzcGF0Y2gubWVzc2FnZXMpKS50b0JlKDApXG4gICAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgYnVmZmVyLnNldFRleHQoJ3BhY2thZ2UgZGVtb1xcblxcbmZ1bmMgRigpIChzdHJpbmcsIGludCwgZXJyb3IpICAgICB7XFxucmV0dXJuIGVycm9ycy5OZXcoXCJmb29cIikgfScpXG4gICAgICAgIGJ1ZmZlci5zYXZlKClcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZG9uZSBpcyB0cnVlXG5cbiAgZGVzY3JpYmUgJ3doZW4gZm9ybWF0IG9uIHNhdmUgaXMgZGlzYWJsZWQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5mb3JtYXRPblNhdmUnLCBmYWxzZSlcblxuICAgIGl0ICdkb2VzIG5vdCByZWZvcm1hdCB0aGUgZmlsZScsIC0+XG4gICAgICBkb25lID0gZmFsc2VcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZGlzcGF0Y2gub25jZSAnZGlzcGF0Y2gtY29tcGxldGUnLCAtPlxuICAgICAgICAgIGV4cGVjdChmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSkpLnRvQmUoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpICB7XFxufVxcbicpXG4gICAgICAgICAgZXhwZWN0KGRpc3BhdGNoLm1lc3NhZ2VzPykudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChfLnNpemUoZGlzcGF0Y2gubWVzc2FnZXMpKS50b0JlKDApXG4gICAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgYnVmZmVyLnNldFRleHQoJ3BhY2thZ2UgbWFpblxcblxcbmZ1bmMgbWFpbigpICB7XFxufVxcbicpXG4gICAgICAgIGJ1ZmZlci5zYXZlKClcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZG9uZSBpcyB0cnVlXG5cbiovXG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/gofmt/spec/formatter-spec.js
