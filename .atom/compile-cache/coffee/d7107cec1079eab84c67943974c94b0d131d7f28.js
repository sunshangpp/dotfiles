(function() {
  var AtomConfig, path, _;

  path = require('path');

  _ = require('underscore-plus');

  AtomConfig = require('./util/atomconfig');

  describe('gocode', function() {
    var autocompleteMain, autocompleteManager, buffer, completionDelay, dispatch, editor, editorView, goplusMain, provider, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], editor = _ref[1], editorView = _ref[2], dispatch = _ref[3], buffer = _ref[4], completionDelay = _ref[5], goplusMain = _ref[6], autocompleteMain = _ref[7], autocompleteManager = _ref[8], provider = _ref[9];
    beforeEach(function() {
      runs(function() {
        var atomconfig, pack;
        atomconfig = new AtomConfig();
        atomconfig.allfunctionalitydisabled();
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('go-plus.suppressBuiltinAutocompleteProvider', false);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        pack = atom.packages.loadPackage('go-plus');
        goplusMain = pack.mainModule;
        spyOn(goplusMain, 'provide').andCallThrough();
        spyOn(goplusMain, 'setDispatch').andCallThrough();
        pack = atom.packages.loadPackage('autocomplete-plus');
        autocompleteMain = pack.mainModule;
        spyOn(autocompleteMain, 'consumeProvider').andCallThrough();
        return jasmine.unspy(window, 'setTimeout');
      });
      waitsForPromise(function() {
        return atom.workspace.open('gocode.go').then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-plus');
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = autocompleteMain.autocompleteManager) != null ? _ref1.ready : void 0;
      });
      runs(function() {
        autocompleteManager = autocompleteMain.getAutocompleteManager();
        spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        spyOn(autocompleteManager, 'showSuggestionList').andCallThrough();
        return spyOn(autocompleteManager, 'hideSuggestionList').andCallThrough();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-go');
      });
      runs(function() {
        expect(goplusMain.provide).not.toHaveBeenCalled();
        return expect(goplusMain.provide.calls.length).toBe(0);
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('go-plus');
      });
      waitsFor(function() {
        return goplusMain.provide.calls.length === 1;
      });
      waitsFor(function() {
        return autocompleteMain.consumeProvider.calls.length === 1;
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = goplusMain.dispatch) != null ? _ref1.ready : void 0;
      });
      waitsFor(function() {
        return goplusMain.setDispatch.calls.length >= 1;
      });
      return runs(function() {
        expect(goplusMain.provide).toHaveBeenCalled();
        expect(goplusMain.provider).toBeDefined();
        provider = goplusMain.provider;
        spyOn(provider, 'getSuggestions').andCallThrough();
        provider.onDidInsertSuggestion = jasmine.createSpy();
        expect(_.size(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go'))).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go')[0]).toEqual(provider);
        buffer = editor.getBuffer();
        dispatch = atom.packages.getLoadedPackage('go-plus').mainModule.dispatch;
        return dispatch.goexecutable.detect();
      });
    });
    afterEach(function() {
      jasmine.unspy(goplusMain, 'provide');
      jasmine.unspy(goplusMain, 'setDispatch');
      jasmine.unspy(autocompleteManager, 'displaySuggestions');
      jasmine.unspy(autocompleteMain, 'consumeProvider');
      jasmine.unspy(autocompleteManager, 'hideSuggestionList');
      jasmine.unspy(autocompleteManager, 'showSuggestionList');
      return jasmine.unspy(provider, 'getSuggestions');
    });
    return describe('when the gocode autocomplete-plus provider is enabled', function() {
      it('displays suggestions from gocode', function() {
        runs(function() {
          expect(provider).toBeDefined();
          expect(provider.getSuggestions).not.toHaveBeenCalled();
          expect(autocompleteManager.displaySuggestions).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([5, 6]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('P');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.showSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus span.word') != null;
        });
        return runs(function() {
          expect(provider.getSuggestions).toHaveBeenCalled();
          expect(provider.getSuggestions.calls.length).toBe(1);
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView.querySelector('.autocomplete-plus span.word').innerHTML).toBe('<span class="character-match">P</span>rint(<span class="snippet-completion">a ...interface{}</span>)');
          expect(editorView.querySelector('.autocomplete-plus span.left-label').innerHTML).toBe('n int, err error');
          return editor.backspace();
        });
      });
      it('confirms a suggestion when the prefix case does not match', function() {
        runs(function() {
          expect(provider).toBeDefined();
          expect(provider.getSuggestions).not.toHaveBeenCalled();
          expect(autocompleteManager.displaySuggestions).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([7, 0]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('    fmt.');
          editor.insertText('p');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.showSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus span.word') != null;
        });
        runs(function() {
          var suggestionListView;
          expect(provider.getSuggestions).toHaveBeenCalled();
          expect(provider.getSuggestions.calls.length).toBe(1);
          expect(provider.onDidInsertSuggestion).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus span.word').innerHTML).toBe('<span class="character-match">P</span>rint(<span class="snippet-completion">a ...interface{}</span>)');
          suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          return atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
        });
        waitsFor(function() {
          return provider.onDidInsertSuggestion.calls.length === 1;
        });
        return runs(function() {
          expect(provider.onDidInsertSuggestion).toHaveBeenCalled();
          return expect(buffer.getTextInRange([[7, 4], [7, 9]])).toBe('fmt.P');
        });
      });
      it('confirms a suggestion when the prefix case does not match', function() {
        runs(function() {
          expect(provider).toBeDefined();
          expect(provider.getSuggestions).not.toHaveBeenCalled();
          expect(autocompleteManager.displaySuggestions).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([7, 0]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('    fmt.p');
          editor.insertText('r');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.showSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return editorView.querySelector('.autocomplete-plus span.word') != null;
        });
        runs(function() {
          var suggestionListView;
          expect(provider.getSuggestions).toHaveBeenCalled();
          expect(provider.getSuggestions.calls.length).toBe(1);
          expect(provider.onDidInsertSuggestion).not.toHaveBeenCalled();
          expect(editorView.querySelector('.autocomplete-plus span.word').innerHTML).toBe('<span class="character-match">P</span><span class="character-match">r</span>int(<span class="snippet-completion">a ...interface{}</span>)');
          suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          return atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
        });
        waitsFor(function() {
          return provider.onDidInsertSuggestion.calls.length === 1;
        });
        return runs(function() {
          expect(provider.onDidInsertSuggestion).toHaveBeenCalled();
          return expect(buffer.getTextInRange([[7, 4], [7, 10]])).toBe('fmt.Pr');
        });
      });
      xit('does not display suggestions when no gocode suggestions exist', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([6, 15]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        runs(function() {
          editor.insertText('w');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 2;
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      return it('does not display suggestions at the end of a line when no gocode suggestions exist', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorScreenPosition([5, 15]);
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.hideSuggestionList.calls.length === 1;
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 0;
        });
        runs(function() {
          editor.insertText(')');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return autocompleteManager.displaySuggestions.calls.length === 1;
        });
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          return editor.insertText(';');
        });
        waitsFor(function() {
          autocompleteManager.displaySuggestions.calls.length === 1;
          return advanceClock(completionDelay);
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2dvY29kZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVIsQ0FGYixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsMElBQUE7QUFBQSxJQUFBLE9BQXlJLEVBQXpJLEVBQUMsMEJBQUQsRUFBbUIsZ0JBQW5CLEVBQTJCLG9CQUEzQixFQUF1QyxrQkFBdkMsRUFBaUQsZ0JBQWpELEVBQXlELHlCQUF6RCxFQUEwRSxvQkFBMUUsRUFBc0YsMEJBQXRGLEVBQXdHLDZCQUF4RyxFQUE2SCxrQkFBN0gsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsZ0JBQUE7QUFBQSxRQUFBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsVUFBVSxDQUFDLHdCQUFYLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFELENBSkEsQ0FBQTtBQUFBLFFBS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZDQUFoQixFQUErRCxLQUEvRCxDQUxBLENBQUE7QUFBQSxRQU9BLGVBQUEsR0FBa0IsR0FQbEIsQ0FBQTtBQUFBLFFBUUEsSUFBSSxDQUFDLE1B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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/gocode-spec.coffee
