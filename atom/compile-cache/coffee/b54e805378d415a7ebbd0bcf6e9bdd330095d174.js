(function() {
  describe("Puppet grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-puppet");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.puppet");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.puppet");
    });
    describe("separators", function() {
      it("tokenizes attribute separator", function() {
        var tokens;
        tokens = grammar.tokenizeLine('ensure => present').tokens;
        return expect(tokens[1]).toEqual({
          value: '=>',
          scopes: ['source.puppet', 'punctuation.separator.key-value.puppet']
        });
      });
      return it("tokenizes attribute separator with string values", function() {
        var tokens;
        tokens = grammar.tokenizeLine('ensure => "present"').tokens;
        return expect(tokens[1]).toEqual({
          value: '=>',
          scopes: ['source.puppet', 'punctuation.separator.key-value.puppet']
        });
      });
    });
    return describe("blocks", function() {
      it("tokenizes single quoted node", function() {
        var tokens;
        tokens = grammar.tokenizeLine("node 'hostname' {").tokens;
        return expect(tokens[0]).toEqual({
          value: 'node',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes double quoted node", function() {
        var tokens;
        tokens = grammar.tokenizeLine('node "hostname" {').tokens;
        return expect(tokens[0]).toEqual({
          value: 'node',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes include as an include function", function() {
        var tokens;
        tokens = grammar.tokenizeLine("contain foo").tokens;
        return expect(tokens[0]).toEqual({
          value: 'contain',
          scopes: ['source.puppet', 'meta.include.puppet', 'keyword.control.import.include.puppet']
        });
      });
      it("tokenizes contain as an include function", function() {
        var tokens;
        tokens = grammar.tokenizeLine('include foo').tokens;
        return expect(tokens[0]).toEqual({
          value: 'include',
          scopes: ['source.puppet', 'meta.include.puppet', 'keyword.control.import.include.puppet']
        });
      });
      it("tokenizes resource type and string title", function() {
        var tokens;
        tokens = grammar.tokenizeLine("package {'foo':}").tokens;
        expect(tokens[0]).toEqual({
          value: 'package',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
        return expect(tokens[2]).toEqual({
          value: "'foo'",
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'entity.name.section.puppet']
        });
      });
      it("tokenizes resource type and variable title", function() {
        var tokens;
        tokens = grammar.tokenizeLine("package {$foo:}").tokens;
        expect(tokens[0]).toEqual({
          value: 'package',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
        return expect(tokens[2]).toEqual({
          value: '$foo',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'entity.name.section.puppet']
        });
      });
      it("tokenizes require classname as an include", function() {
        var tokens;
        tokens = grammar.tokenizeLine("require ::foo").tokens;
        return expect(tokens[0]).toEqual({
          value: 'require',
          scopes: ['source.puppet', 'meta.include.puppet', 'keyword.control.import.include.puppet']
        });
      });
      it("tokenizes require => variable as a parameter", function() {
        var tokens;
        tokens = grammar.tokenizeLine("require => Class['foo']").tokens;
        return expect(tokens[0]).toEqual({
          value: 'require ',
          scopes: ['source.puppet', 'constant.other.key.puppet']
        });
      });
      it("tokenizes regular variables", function() {
        var tokens;
        tokens = grammar.tokenizeLine('$foo').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        expect(tokens[1]).toEqual({
          value: 'foo',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
        tokens = grammar.tokenizeLine('$_foo').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        expect(tokens[1]).toEqual({
          value: '_foo',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
        tokens = grammar.tokenizeLine('$_foo_').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        expect(tokens[1]).toEqual({
          value: '_foo_',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
        tokens = grammar.tokenizeLine('$::foo').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        return expect(tokens[1]).toEqual({
          value: '::foo',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
      });
      return it("tokenizes resource types correctly", function() {
        var tokens;
        tokens = grammar.tokenizeLine("file {'/var/tmp':}").tokens;
        expect(tokens[0]).toEqual({
          value: 'file',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
        tokens = grammar.tokenizeLine("package {'foo':}").tokens;
        return expect(tokens[0]).toEqual({
          value: 'package',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtcHVwcGV0L3NwZWMvcHVwcGV0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixpQkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTthQUdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQyxFQURQO01BQUEsQ0FBTCxFQUpTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVNBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsVUFBaEIsQ0FBQSxDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQWYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixlQUEvQixFQUZ1QjtJQUFBLENBQXpCLENBVEEsQ0FBQTtBQUFBLElBYUEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxZQUFBLE1BQUE7QUFBQSxRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsbUJBQXJCLEVBQVYsTUFBRCxDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIs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

//# sourceURL=/Users/ssun/.atom/packages/language-puppet/spec/puppet-spec.coffee
