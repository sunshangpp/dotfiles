'use babel';
/* eslint-env jasmine */

describe('godef', function () {
  var mainModule = null;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('go-config').then(function () {
        return atom.packages.activatePackage('navigator-godef');
      }).then(function (pack) {
        mainModule = pack.mainModule;
      });
    });

    waitsFor(function () {
      return mainModule.getGoconfig() !== false;
    });
  });
});

/*
path = require('path')
fs = require('fs-plus')
temp = require('temp').track()
_ = require ("underscore-plus")
{Subscriber} = require 'emissary'
{Point} = require 'atom'

describe "godef", ->
  [mainModule, editor, editorView, dispatch, filePath, workspaceElement] = []
  testDisposables = []
  testText = """package main
                import "fmt"
                var testvar = "stringy"

                func f(){
                  localVar := " says 世界中の世界中の!"
                  fmt.Println( testvar + localVar )}
             """

  beforeEach ->
    # don't run any of the on-save tools
    atom.config.set("go-plus.formatOnSave", false)
    atom.config.set("go-plus.lintOnSave", false)
    atom.config.set("go-plus.vetOnSave", false)
    atom.config.set("go-plus.syntaxCheckOnSave", false)
    atom.config.set("go-plus.runCoverageOnSave", false)

    directory = temp.mkdirSync()
    atom.project.setPaths(directory)
    filePath = path.join(directory, 'go-plus-testing.go')
    fs.writeFileSync(filePath, '')
    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)
    jasmine.unspy(window, 'setTimeout')

    waitsForPromise -> atom.workspace.open(filePath).then (e) ->
      editor = e
      editorView = atom.views.getView(editor)

    waitsForPromise ->
      atom.packages.activatePackage('language-go')

    waitsForPromise -> atom.packages.activatePackage('go-plus').then (g) ->
      mainModule = g.mainModule

    waitsFor ->
      mainModule.dispatch?.ready

    runs ->
      dispatch = mainModule.dispatch

  triggerCommand = (command) ->
    atom.commands.dispatch(workspaceElement, dispatch.godef[command])

  godefDone = ->
    new Promise (resolve, reject) ->
      testDisposables.push(dispatch.godef.onDidComplete(resolve))
      return

  bufferTextOffset = (text, count = 1, delta = 0) ->
    buffer = editor.getText()
    index = -1
    for i in [1..count]
      index = buffer.indexOf(text, (if index is -1 then 0 else index + text.length))
      break if index is -1
    return index if index is -1
    index + delta

  offsetCursorPos = (offset) ->
    return if offset < 0
    editor.getBuffer().positionForCharacterIndex(offset)

  bufferTextPos = (text, count = 1, delta = 0) ->
    offsetCursorPos(bufferTextOffset(text, count, delta))

  cursorToOffset = (offset) ->
    return if offset is -1
    editor.setCursorBufferPosition(offsetCursorPos(offset))
    return

  cursorToText = (text, count = 1, delta = 0) ->
    cursorToOffset(bufferTextOffset(text, count, delta))

  afterEach ->
    disposable.dispose() for disposable in testDisposables
    testDisposables = []

  waitsForCommand = (command) ->
    godefPromise = undefined
    runs ->
      # Create the promise before triggering the command because triggerCommand
      # may call onDidComplete synchronously.
      godefPromise = godefDone()
      triggerCommand(command)
    waitsForPromise -> godefPromise
    return

  waitsForGodef = ->
    waitsForCommand 'godefCommand'

  waitsForGodefReturn = ->
    waitsForCommand 'returnCommand'

  waitsForDispatchComplete = (action) ->
    dispatchComplete = false
    runs ->
      dispatch.once 'dispatch-complete', -> dispatchComplete = true
    runs action
    waitsFor -> dispatchComplete

  describe "wordAtCursor (| represents cursor pos)", ->
    godef = null
    beforeEach ->
      godef = dispatch.godef
      godef.editor = editor
      editor.setText("foo foo.bar bar")

    it "should return foo for |foo", ->
      editor.setCursorBufferPosition([0, 0])
      {word, range} = godef.wordAtCursor()
      expect(word).toEqual('foo')
      expect(range).toEqual([[0, 0], [0, 3]])

    it "should return foo for fo|o", ->
      editor.setCursorBufferPosition([0, 2])
      {word, range} = godef.wordAtCursor()
      expect(word).toEqual('foo')
      expect(range).toEqual([[0, 0], [0, 3]])

    # TODO: Check with https://github.com/crispinb - this test used to fail and
    # it is possible the semantics of cursor.getCurrentWordBufferRange have
    # changed
    it "should return no word for foo| foo", ->
      editor.setCursorBufferPosition([0, 3])
      {word, range} = godef.wordAtCursor()
      expect(word).toEqual('foo')
      expect(range).toEqual([[0, 0], [0, 3]])

    it "should return bar for |bar", ->
      editor.setCursorBufferPosition([0, 12])
      {word, range} = godef.wordAtCursor()
      expect(word).toEqual('bar')
      expect(range).toEqual([[0, 12], [0, 15]])

    it "should return foo.bar for !foo.bar", ->
      editor.setCursorBufferPosition([0, 4])
      {word, range} = godef.wordAtCursor()
      expect(word).toEqual('foo.bar')
      expect(range).toEqual([[0, 4], [0, 11]])

    it "should return foo.bar for foo.ba|r", ->
      editor.setCursorBufferPosition([0, 10])
      {word, range} = godef.wordAtCursor()
      expect(word).toEqual('foo.bar')
      expect(range).toEqual([[0, 4], [0, 11]])

  describe "when go-plus is loaded", ->
    it "should have registered the golang:godef command",  ->
      currentCommands = atom.commands.findCommands({target: editorView})
      godefCommand = (cmd for cmd in currentCommands when cmd.name is dispatch.godef.godefCommand)
      expect(godefCommand.length).toEqual(1)

  describe "when godef command is invoked", ->
    describe "if there is more than one cursor", ->
      it "displays a warning message", ->
        waitsForDispatchComplete ->
          editor.setText testText
          editor.save()
        runs ->
          editor.setCursorBufferPosition([0, 0])
          editor.addCursorAtBufferPosition([1, 0])

        waitsForGodef()

        runs ->
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe 1
          expect(dispatch.messages[0].type).toBe("warning")

    describe "with no word under the cursor", ->
      it "displays a warning message", ->
        editor.setCursorBufferPosition([0, 0])
        waitsForGodef()
        runs ->
          expect(dispatch.messages?).toBe(true)
          expect(_.size(dispatch.messages)).toBe 1
          expect(dispatch.messages[0].type).toBe("warning")

    describe "with a word under the cursor", ->
      beforeEach ->
        waitsForDispatchComplete ->
          editor.setText testText
          editor.save()

      describe "defined within the current file", ->
        beforeEach ->
          cursorToText("testvar", 2)
          waitsForGodef()

        it "should move the cursor to the definition", ->
          runs ->
            expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("testvar", 1))

        it "should create a highlight decoration of the correct class", ->
          runs ->
            higlightClass = 'definition'
            goPlusHighlightDecs = (d for d in editor.getHighlightDecorations() when d.getProperties()['class'] is higlightClass)
            expect(goPlusHighlightDecs.length).toBe(1)

      describe "defined outside the current file", ->
        it "should open a new text editor", ->
          runs ->
            # Go to the Println in fmt.Println:
            cursorToText("fmt.Println", 1, "fmt.".length)
          waitsForGodef()
          runs ->
            currentEditor = atom.workspace.getActiveTextEditor()
            expect(currentEditor.getTitle()).toBe('print.go')

      describe "defined as a local variable", ->
        it "should jump to the local var definition", ->
          runs ->
            cursorToText("localVar", 2)
          waitsForGodef()
          runs ->
            expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 1))

      describe "defined as a local import prefix", ->
        it "should jump to the import", ->
          runs -> cursorToText("fmt.Println")
          waitsForGodef()
          runs ->
            expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("\"fmt\""))

      describe "an import statement", ->
        it "should open the first (lexicographical) .go file in the imported package", ->
          runs -> cursorToText("\"fmt\"")
          waitsForGodef()
          runs ->
            activeEditor = atom.workspace.getActiveTextEditor()
            file = activeEditor.getURI()
            expect(path.basename(file)).toEqual("doc.go")
            expect(path.basename(path.dirname(file))).toEqual("fmt")

  describe "when godef-return command is invoked", ->
    beforeEach ->
      waitsForDispatchComplete ->
        editor.setText testText
        editor.save()

    it "will return across files to the location where godef was invoked", ->
      runs -> cursorToText("fmt.Println", 1, "fmt.".length)
      waitsForGodef()
      runs ->
        activeEditor = atom.workspace.getActiveTextEditor()
        expect(path.basename(activeEditor.getURI())).toEqual("print.go")
      waitsForGodefReturn()
      runs ->
        expect(atom.workspace.getActiveTextEditor()).toBe(editor)
        expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("fmt.Println", 1, "fmt.".length))

    it "will return within the same file to the location where godef was invoked", ->
      runs -> cursorToText("localVar", 2)
      waitsForGodef()
      runs ->
        expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 1))
      waitsForGodefReturn()
      runs ->
        expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 2))

    it 'will do nothing if the return stack is empty', ->
      runs ->
        dispatch.godef.clearReturnHistory()
        cursorToText("localVar", 2)
      waitsForGodefReturn()
      runs ->
        expect(editor.getCursorBufferPosition()).toEqual(bufferTextPos("localVar", 2))

*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL25hdmlnYXRvci1nb2RlZi9zcGVjL2dvZGVmLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7QUFHWCxRQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdEIsTUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFBOztBQUVyQixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzNELGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtPQUN4RCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hCLGtCQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQTtPQUM3QixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsWUFBUSxDQUFDLFlBQU07QUFDYixhQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLENBQUE7S0FDMUMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL25hdmlnYXRvci1nb2RlZi9zcGVjL2dvZGVmLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmRlc2NyaWJlKCdnb2RlZicsICgpID0+IHtcbiAgbGV0IG1haW5Nb2R1bGUgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZ28tY29uZmlnJykudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbmF2aWdhdG9yLWdvZGVmJylcbiAgICAgIH0pLnRoZW4oKHBhY2spID0+IHtcbiAgICAgICAgbWFpbk1vZHVsZSA9IHBhY2subWFpbk1vZHVsZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuIG1haW5Nb2R1bGUuZ2V0R29jb25maWcoKSAhPT0gZmFsc2VcbiAgICB9KVxuICB9KVxufSlcblxuLypcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbmZzID0gcmVxdWlyZSgnZnMtcGx1cycpXG50ZW1wID0gcmVxdWlyZSgndGVtcCcpLnRyYWNrKClcbl8gPSByZXF1aXJlIChcInVuZGVyc2NvcmUtcGx1c1wiKVxue1N1YnNjcmliZXJ9ID0gcmVxdWlyZSAnZW1pc3NhcnknXG57UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxuZGVzY3JpYmUgXCJnb2RlZlwiLCAtPlxuICBbbWFpbk1vZHVsZSwgZWRpdG9yLCBlZGl0b3JWaWV3LCBkaXNwYXRjaCwgZmlsZVBhdGgsIHdvcmtzcGFjZUVsZW1lbnRdID0gW11cbiAgdGVzdERpc3Bvc2FibGVzID0gW11cbiAgdGVzdFRleHQgPSBcIlwiXCJwYWNrYWdlIG1haW5cbiAgICAgICAgICAgICAgICBpbXBvcnQgXCJmbXRcIlxuICAgICAgICAgICAgICAgIHZhciB0ZXN0dmFyID0gXCJzdHJpbmd5XCJcblxuICAgICAgICAgICAgICAgIGZ1bmMgZigpe1xuICAgICAgICAgICAgICAgICAgbG9jYWxWYXIgOj0gXCIgc2F5cyDkuJbnlYzkuK3jga7kuJbnlYzkuK3jga4hXCJcbiAgICAgICAgICAgICAgICAgIGZtdC5QcmludGxuKCB0ZXN0dmFyICsgbG9jYWxWYXIgKX1cbiAgICAgICAgICAgICBcIlwiXCJcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgIyBkb24ndCBydW4gYW55IG9mIHRoZSBvbi1zYXZlIHRvb2xzXG4gICAgYXRvbS5jb25maWcuc2V0KFwiZ28tcGx1cy5mb3JtYXRPblNhdmVcIiwgZmFsc2UpXG4gICAgYXRvbS5jb25maWcuc2V0KFwiZ28tcGx1cy5saW50T25TYXZlXCIsIGZhbHNlKVxuICAgIGF0b20uY29uZmlnLnNldChcImdvLXBsdXMudmV0T25TYXZlXCIsIGZhbHNlKVxuICAgIGF0b20uY29uZmlnLnNldChcImdvLXBsdXMuc3ludGF4Q2hlY2tPblNhdmVcIiwgZmFsc2UpXG4gICAgYXRvbS5jb25maWcuc2V0KFwiZ28tcGx1cy5ydW5Db3ZlcmFnZU9uU2F2ZVwiLCBmYWxzZSlcblxuICAgIGRpcmVjdG9yeSA9IHRlbXAubWtkaXJTeW5jKClcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoZGlyZWN0b3J5KVxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgJ2dvLXBsdXMtdGVzdGluZy5nbycpXG4gICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgJycpXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG4gICAgamFzbWluZS51bnNweSh3aW5kb3csICdzZXRUaW1lb3V0JylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKS50aGVuIChlKSAtPlxuICAgICAgZWRpdG9yID0gZVxuICAgICAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1nbycpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2dvLXBsdXMnKS50aGVuIChnKSAtPlxuICAgICAgbWFpbk1vZHVsZSA9IGcubWFpbk1vZHVsZVxuXG4gICAgd2FpdHNGb3IgLT5cbiAgICAgIG1haW5Nb2R1bGUuZGlzcGF0Y2g/LnJlYWR5XG5cbiAgICBydW5zIC0+XG4gICAgICBkaXNwYXRjaCA9IG1haW5Nb2R1bGUuZGlzcGF0Y2hcblxuICB0cmlnZ2VyQ29tbWFuZCA9IChjb21tYW5kKSAtPlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgZGlzcGF0Y2guZ29kZWZbY29tbWFuZF0pXG5cbiAgZ29kZWZEb25lID0gLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdGVzdERpc3Bvc2FibGVzLnB1c2goZGlzcGF0Y2guZ29kZWYub25EaWRDb21wbGV0ZShyZXNvbHZlKSlcbiAgICAgIHJldHVyblxuXG4gIGJ1ZmZlclRleHRPZmZzZXQgPSAodGV4dCwgY291bnQgPSAxLCBkZWx0YSA9IDApIC0+XG4gICAgYnVmZmVyID0gZWRpdG9yLmdldFRleHQoKVxuICAgIGluZGV4ID0gLTFcbiAgICBmb3IgaSBpbiBbMS4uY291bnRdXG4gICAgICBpbmRleCA9IGJ1ZmZlci5pbmRleE9mKHRleHQsIChpZiBpbmRleCBpcyAtMSB0aGVuIDAgZWxzZSBpbmRleCArIHRleHQubGVuZ3RoKSlcbiAgICAgIGJyZWFrIGlmIGluZGV4IGlzIC0xXG4gICAgcmV0dXJuIGluZGV4IGlmIGluZGV4IGlzIC0xXG4gICAgaW5kZXggKyBkZWx0YVxuXG4gIG9mZnNldEN1cnNvclBvcyA9IChvZmZzZXQpIC0+XG4gICAgcmV0dXJuIGlmIG9mZnNldCA8IDBcbiAgICBlZGl0b3IuZ2V0QnVmZmVyKCkucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChvZmZzZXQpXG5cbiAgYnVmZmVyVGV4dFBvcyA9ICh0ZXh0LCBjb3VudCA9IDEsIGRlbHRhID0gMCkgLT5cbiAgICBvZmZzZXRDdXJzb3JQb3MoYnVmZmVyVGV4dE9mZnNldCh0ZXh0LCBjb3VudCwgZGVsdGEpKVxuXG4gIGN1cnNvclRvT2Zmc2V0ID0gKG9mZnNldCkgLT5cbiAgICByZXR1cm4gaWYgb2Zmc2V0IGlzIC0xXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKG9mZnNldEN1cnNvclBvcyhvZmZzZXQpKVxuICAgIHJldHVyblxuXG4gIGN1cnNvclRvVGV4dCA9ICh0ZXh0LCBjb3VudCA9IDEsIGRlbHRhID0gMCkgLT5cbiAgICBjdXJzb3JUb09mZnNldChidWZmZXJUZXh0T2Zmc2V0KHRleHQsIGNvdW50LCBkZWx0YSkpXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgZGlzcG9zYWJsZS5kaXNwb3NlKCkgZm9yIGRpc3Bvc2FibGUgaW4gdGVzdERpc3Bvc2FibGVzXG4gICAgdGVzdERpc3Bvc2FibGVzID0gW11cblxuICB3YWl0c0ZvckNvbW1hbmQgPSAoY29tbWFuZCkgLT5cbiAgICBnb2RlZlByb21pc2UgPSB1bmRlZmluZWRcbiAgICBydW5zIC0+XG4gICAgICAjIENyZWF0ZSB0aGUgcHJvbWlzZSBiZWZvcmUgdHJpZ2dlcmluZyB0aGUgY29tbWFuZCBiZWNhdXNlIHRyaWdnZXJDb21tYW5kXG4gICAgICAjIG1heSBjYWxsIG9uRGlkQ29tcGxldGUgc3luY2hyb25vdXNseS5cbiAgICAgIGdvZGVmUHJvbWlzZSA9IGdvZGVmRG9uZSgpXG4gICAgICB0cmlnZ2VyQ29tbWFuZChjb21tYW5kKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBnb2RlZlByb21pc2VcbiAgICByZXR1cm5cblxuICB3YWl0c0ZvckdvZGVmID0gLT5cbiAgICB3YWl0c0ZvckNvbW1hbmQgJ2dvZGVmQ29tbWFuZCdcblxuICB3YWl0c0ZvckdvZGVmUmV0dXJuID0gLT5cbiAgICB3YWl0c0ZvckNvbW1hbmQgJ3JldHVybkNvbW1hbmQnXG5cbiAgd2FpdHNGb3JEaXNwYXRjaENvbXBsZXRlID0gKGFjdGlvbikgLT5cbiAgICBkaXNwYXRjaENvbXBsZXRlID0gZmFsc2VcbiAgICBydW5zIC0+XG4gICAgICBkaXNwYXRjaC5vbmNlICdkaXNwYXRjaC1jb21wbGV0ZScsIC0+IGRpc3BhdGNoQ29tcGxldGUgPSB0cnVlXG4gICAgcnVucyBhY3Rpb25cbiAgICB3YWl0c0ZvciAtPiBkaXNwYXRjaENvbXBsZXRlXG5cbiAgZGVzY3JpYmUgXCJ3b3JkQXRDdXJzb3IgKHwgcmVwcmVzZW50cyBjdXJzb3IgcG9zKVwiLCAtPlxuICAgIGdvZGVmID0gbnVsbFxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGdvZGVmID0gZGlzcGF0Y2guZ29kZWZcbiAgICAgIGdvZGVmLmVkaXRvciA9IGVkaXRvclxuICAgICAgZWRpdG9yLnNldFRleHQoXCJmb28gZm9vLmJhciBiYXJcIilcblxuICAgIGl0IFwic2hvdWxkIHJldHVybiBmb28gZm9yIHxmb29cIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG4gICAgICB7d29yZCwgcmFuZ2V9ID0gZ29kZWYud29yZEF0Q3Vyc29yKClcbiAgICAgIGV4cGVjdCh3b3JkKS50b0VxdWFsKCdmb28nKVxuICAgICAgZXhwZWN0KHJhbmdlKS50b0VxdWFsKFtbMCwgMF0sIFswLCAzXV0pXG5cbiAgICBpdCBcInNob3VsZCByZXR1cm4gZm9vIGZvciBmb3xvXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDJdKVxuICAgICAge3dvcmQsIHJhbmdlfSA9IGdvZGVmLndvcmRBdEN1cnNvcigpXG4gICAgICBleHBlY3Qod29yZCkudG9FcXVhbCgnZm9vJylcbiAgICAgIGV4cGVjdChyYW5nZSkudG9FcXVhbChbWzAsIDBdLCBbMCwgM11dKVxuXG4gICAgIyBUT0RPOiBDaGVjayB3aXRoIGh0dHBzOi8vZ2l0aHViLmNvbS9jcmlzcGluYiAtIHRoaXMgdGVzdCB1c2VkIHRvIGZhaWwgYW5kXG4gICAgIyBpdCBpcyBwb3NzaWJsZSB0aGUgc2VtYW50aWNzIG9mIGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlIGhhdmVcbiAgICAjIGNoYW5nZWRcbiAgICBpdCBcInNob3VsZCByZXR1cm4gbm8gd29yZCBmb3IgZm9vfCBmb29cIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgM10pXG4gICAgICB7d29yZCwgcmFuZ2V9ID0gZ29kZWYud29yZEF0Q3Vyc29yKClcbiAgICAgIGV4cGVjdCh3b3JkKS50b0VxdWFsKCdmb28nKVxuICAgICAgZXhwZWN0KHJhbmdlKS50b0VxdWFsKFtbMCwgMF0sIFswLCAzXV0pXG5cbiAgICBpdCBcInNob3VsZCByZXR1cm4gYmFyIGZvciB8YmFyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDEyXSlcbiAgICAgIHt3b3JkLCByYW5nZX0gPSBnb2RlZi53b3JkQXRDdXJzb3IoKVxuICAgICAgZXhwZWN0KHdvcmQpLnRvRXF1YWwoJ2JhcicpXG4gICAgICBleHBlY3QocmFuZ2UpLnRvRXF1YWwoW1swLCAxMl0sIFswLCAxNV1dKVxuXG4gICAgaXQgXCJzaG91bGQgcmV0dXJuIGZvby5iYXIgZm9yICFmb28uYmFyXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDRdKVxuICAgICAge3dvcmQsIHJhbmdlfSA9IGdvZGVmLndvcmRBdEN1cnNvcigpXG4gICAgICBleHBlY3Qod29yZCkudG9FcXVhbCgnZm9vLmJhcicpXG4gICAgICBleHBlY3QocmFuZ2UpLnRvRXF1YWwoW1swLCA0XSwgWzAsIDExXV0pXG5cbiAgICBpdCBcInNob3VsZCByZXR1cm4gZm9vLmJhciBmb3IgZm9vLmJhfHJcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMTBdKVxuICAgICAge3dvcmQsIHJhbmdlfSA9IGdvZGVmLndvcmRBdEN1cnNvcigpXG4gICAgICBleHBlY3Qod29yZCkudG9FcXVhbCgnZm9vLmJhcicpXG4gICAgICBleHBlY3QocmFuZ2UpLnRvRXF1YWwoW1swLCA0XSwgWzAsIDExXV0pXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGdvLXBsdXMgaXMgbG9hZGVkXCIsIC0+XG4gICAgaXQgXCJzaG91bGQgaGF2ZSByZWdpc3RlcmVkIHRoZSBnb2xhbmc6Z29kZWYgY29tbWFuZFwiLCAgLT5cbiAgICAgIGN1cnJlbnRDb21tYW5kcyA9IGF0b20uY29tbWFuZHMuZmluZENvbW1hbmRzKHt0YXJnZXQ6IGVkaXRvclZpZXd9KVxuICAgICAgZ29kZWZDb21tYW5kID0gKGNtZCBmb3IgY21kIGluIGN1cnJlbnRDb21tYW5kcyB3aGVuIGNtZC5uYW1lIGlzIGRpc3BhdGNoLmdvZGVmLmdvZGVmQ29tbWFuZClcbiAgICAgIGV4cGVjdChnb2RlZkNvbW1hbmQubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGdvZGVmIGNvbW1hbmQgaXMgaW52b2tlZFwiLCAtPlxuICAgIGRlc2NyaWJlIFwiaWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBjdXJzb3JcIiwgLT5cbiAgICAgIGl0IFwiZGlzcGxheXMgYSB3YXJuaW5nIG1lc3NhZ2VcIiwgLT5cbiAgICAgICAgd2FpdHNGb3JEaXNwYXRjaENvbXBsZXRlIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQgdGVzdFRleHRcbiAgICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFsxLCAwXSlcblxuICAgICAgICB3YWl0c0ZvckdvZGVmKClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGRpc3BhdGNoLm1lc3NhZ2VzPykudG9CZSh0cnVlKVxuICAgICAgICAgIGV4cGVjdChfLnNpemUoZGlzcGF0Y2gubWVzc2FnZXMpKS50b0JlIDFcbiAgICAgICAgICBleHBlY3QoZGlzcGF0Y2gubWVzc2FnZXNbMF0udHlwZSkudG9CZShcIndhcm5pbmdcIilcblxuICAgIGRlc2NyaWJlIFwid2l0aCBubyB3b3JkIHVuZGVyIHRoZSBjdXJzb3JcIiwgLT5cbiAgICAgIGl0IFwiZGlzcGxheXMgYSB3YXJuaW5nIG1lc3NhZ2VcIiwgLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcbiAgICAgICAgd2FpdHNGb3JHb2RlZigpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoZGlzcGF0Y2gubWVzc2FnZXM/KS50b0JlKHRydWUpXG4gICAgICAgICAgZXhwZWN0KF8uc2l6ZShkaXNwYXRjaC5tZXNzYWdlcykpLnRvQmUgMVxuICAgICAgICAgIGV4cGVjdChkaXNwYXRjaC5tZXNzYWdlc1swXS50eXBlKS50b0JlKFwid2FybmluZ1wiKVxuXG4gICAgZGVzY3JpYmUgXCJ3aXRoIGEgd29yZCB1bmRlciB0aGUgY3Vyc29yXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yRGlzcGF0Y2hDb21wbGV0ZSAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0IHRlc3RUZXh0XG4gICAgICAgICAgZWRpdG9yLnNhdmUoKVxuXG4gICAgICBkZXNjcmliZSBcImRlZmluZWQgd2l0aGluIHRoZSBjdXJyZW50IGZpbGVcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGN1cnNvclRvVGV4dChcInRlc3R2YXJcIiwgMilcbiAgICAgICAgICB3YWl0c0ZvckdvZGVmKClcblxuICAgICAgICBpdCBcInNob3VsZCBtb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIGRlZmluaXRpb25cIiwgLT5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwoYnVmZmVyVGV4dFBvcyhcInRlc3R2YXJcIiwgMSkpXG5cbiAgICAgICAgaXQgXCJzaG91bGQgY3JlYXRlIGEgaGlnaGxpZ2h0IGRlY29yYXRpb24gb2YgdGhlIGNvcnJlY3QgY2xhc3NcIiwgLT5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBoaWdsaWdodENsYXNzID0gJ2RlZmluaXRpb24nXG4gICAgICAgICAgICBnb1BsdXNIaWdobGlnaHREZWNzID0gKGQgZm9yIGQgaW4gZWRpdG9yLmdldEhpZ2hsaWdodERlY29yYXRpb25zKCkgd2hlbiBkLmdldFByb3BlcnRpZXMoKVsnY2xhc3MnXSBpcyBoaWdsaWdodENsYXNzKVxuICAgICAgICAgICAgZXhwZWN0KGdvUGx1c0hpZ2hsaWdodERlY3MubGVuZ3RoKS50b0JlKDEpXG5cbiAgICAgIGRlc2NyaWJlIFwiZGVmaW5lZCBvdXRzaWRlIHRoZSBjdXJyZW50IGZpbGVcIiwgLT5cbiAgICAgICAgaXQgXCJzaG91bGQgb3BlbiBhIG5ldyB0ZXh0IGVkaXRvclwiLCAtPlxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICMgR28gdG8gdGhlIFByaW50bG4gaW4gZm10LlByaW50bG46XG4gICAgICAgICAgICBjdXJzb3JUb1RleHQoXCJmbXQuUHJpbnRsblwiLCAxLCBcImZtdC5cIi5sZW5ndGgpXG4gICAgICAgICAgd2FpdHNGb3JHb2RlZigpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgY3VycmVudEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3IuZ2V0VGl0bGUoKSkudG9CZSgncHJpbnQuZ28nKVxuXG4gICAgICBkZXNjcmliZSBcImRlZmluZWQgYXMgYSBsb2NhbCB2YXJpYWJsZVwiLCAtPlxuICAgICAgICBpdCBcInNob3VsZCBqdW1wIHRvIHRoZSBsb2NhbCB2YXIgZGVmaW5pdGlvblwiLCAtPlxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGN1cnNvclRvVGV4dChcImxvY2FsVmFyXCIsIDIpXG4gICAgICAgICAgd2FpdHNGb3JHb2RlZigpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsKGJ1ZmZlclRleHRQb3MoXCJsb2NhbFZhclwiLCAxKSlcblxuICAgICAgZGVzY3JpYmUgXCJkZWZpbmVkIGFzIGEgbG9jYWwgaW1wb3J0IHByZWZpeFwiLCAtPlxuICAgICAgICBpdCBcInNob3VsZCBqdW1wIHRvIHRoZSBpbXBvcnRcIiwgLT5cbiAgICAgICAgICBydW5zIC0+IGN1cnNvclRvVGV4dChcImZtdC5QcmludGxuXCIpXG4gICAgICAgICAgd2FpdHNGb3JHb2RlZigpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsKGJ1ZmZlclRleHRQb3MoXCJcXFwiZm10XFxcIlwiKSlcblxuICAgICAgZGVzY3JpYmUgXCJhbiBpbXBvcnQgc3RhdGVtZW50XCIsIC0+XG4gICAgICAgIGl0IFwic2hvdWxkIG9wZW4gdGhlIGZpcnN0IChsZXhpY29ncmFwaGljYWwpIC5nbyBmaWxlIGluIHRoZSBpbXBvcnRlZCBwYWNrYWdlXCIsIC0+XG4gICAgICAgICAgcnVucyAtPiBjdXJzb3JUb1RleHQoXCJcXFwiZm10XFxcIlwiKVxuICAgICAgICAgIHdhaXRzRm9yR29kZWYoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgZmlsZSA9IGFjdGl2ZUVkaXRvci5nZXRVUkkoKVxuICAgICAgICAgICAgZXhwZWN0KHBhdGguYmFzZW5hbWUoZmlsZSkpLnRvRXF1YWwoXCJkb2MuZ29cIilcbiAgICAgICAgICAgIGV4cGVjdChwYXRoLmJhc2VuYW1lKHBhdGguZGlybmFtZShmaWxlKSkpLnRvRXF1YWwoXCJmbXRcIilcblxuICBkZXNjcmliZSBcIndoZW4gZ29kZWYtcmV0dXJuIGNvbW1hbmQgaXMgaW52b2tlZFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yRGlzcGF0Y2hDb21wbGV0ZSAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCB0ZXN0VGV4dFxuICAgICAgICBlZGl0b3Iuc2F2ZSgpXG5cbiAgICBpdCBcIndpbGwgcmV0dXJuIGFjcm9zcyBmaWxlcyB0byB0aGUgbG9jYXRpb24gd2hlcmUgZ29kZWYgd2FzIGludm9rZWRcIiwgLT5cbiAgICAgIHJ1bnMgLT4gY3Vyc29yVG9UZXh0KFwiZm10LlByaW50bG5cIiwgMSwgXCJmbXQuXCIubGVuZ3RoKVxuICAgICAgd2FpdHNGb3JHb2RlZigpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBleHBlY3QocGF0aC5iYXNlbmFtZShhY3RpdmVFZGl0b3IuZ2V0VVJJKCkpKS50b0VxdWFsKFwicHJpbnQuZ29cIilcbiAgICAgIHdhaXRzRm9yR29kZWZSZXR1cm4oKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKS50b0JlKGVkaXRvcilcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsKGJ1ZmZlclRleHRQb3MoXCJmbXQuUHJpbnRsblwiLCAxLCBcImZtdC5cIi5sZW5ndGgpKVxuXG4gICAgaXQgXCJ3aWxsIHJldHVybiB3aXRoaW4gdGhlIHNhbWUgZmlsZSB0byB0aGUgbG9jYXRpb24gd2hlcmUgZ29kZWYgd2FzIGludm9rZWRcIiwgLT5cbiAgICAgIHJ1bnMgLT4gY3Vyc29yVG9UZXh0KFwibG9jYWxWYXJcIiwgMilcbiAgICAgIHdhaXRzRm9yR29kZWYoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwoYnVmZmVyVGV4dFBvcyhcImxvY2FsVmFyXCIsIDEpKVxuICAgICAgd2FpdHNGb3JHb2RlZlJldHVybigpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbChidWZmZXJUZXh0UG9zKFwibG9jYWxWYXJcIiwgMikpXG5cbiAgICBpdCAnd2lsbCBkbyBub3RoaW5nIGlmIHRoZSByZXR1cm4gc3RhY2sgaXMgZW1wdHknLCAtPlxuICAgICAgcnVucyAtPlxuICAgICAgICBkaXNwYXRjaC5nb2RlZi5jbGVhclJldHVybkhpc3RvcnkoKVxuICAgICAgICBjdXJzb3JUb1RleHQoXCJsb2NhbFZhclwiLCAyKVxuICAgICAgd2FpdHNGb3JHb2RlZlJldHVybigpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbChidWZmZXJUZXh0UG9zKFwibG9jYWxWYXJcIiwgMikpXG5cbiovXG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/navigator-godef/spec/godef-spec.js
