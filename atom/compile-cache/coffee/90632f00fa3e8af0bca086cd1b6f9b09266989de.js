(function() {
  describe('Linter Config', function() {
    var getLinter, getMessage, linter, _ref;
    linter = null;
    _ref = require('./common'), getLinter = _ref.getLinter, getMessage = _ref.getMessage;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    describe('ignoredMessageTypes', function() {
      return it('ignores certain types of messages', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.messages.publicMessages.length).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        expect(linter.messages.publicMessages.length).toBe(2);
        atom.config.set('linter.ignoredMessageTypes', ['Error']);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        return expect(linter.messages.publicMessages.length).toBe(1);
      });
    });
    return describe('statusIconScope', function() {
      return it('only shows messages of the current scope', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.views.bottomContainer.status.count).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error', '/tmp/test.coffee')]
        });
        linter.messages.updatePublic();
        expect(linter.views.bottomContainer.status.count).toBe(1);
        atom.config.set('linter.statusIconScope', 'File');
        expect(linter.views.bottomContainer.status.count).toBe(0);
        atom.config.set('linter.statusIconScope', 'Project');
        return expect(linter.views.bottomContainer.status.count).toBe(1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29uZmlnLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLG1DQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsSUFDQSxPQUEwQixPQUFBLENBQVEsVUFBUixDQUExQixFQUFDLGlCQUFBLFNBQUQsRUFBWSxrQkFBQSxVQURaLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUEsR0FBQTtpQkFDM0MsTUFBQSxHQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxVQUFVLENBQUMsU0FEbEI7UUFBQSxDQUE3QyxFQURjO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFPQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO2FBQzlCLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsWUFBQSxjQUFBO0FBQUEsUUFBQSxjQUFBLEdBQWlCLFNBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBdEMsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFuRCxDQURBLENBQUE7QUFBQSxRQUVBLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBaEIsQ0FBb0I7QUFBQSxVQUFDLE1BQUEsRUFBUSxjQUFUO0FB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

//# sourceURL=/Users/ssun/.atom/packages/linter/spec/config-spec.coffee