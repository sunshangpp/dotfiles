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
      it("tokenizes non-default class parameters", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" ($myvar) {').tokens;
        expect(tokens[5]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.no-default.untyped.puppet', 'variable.other.puppet', 'punctuation.definition.variable.puppet']
        });
        return expect(tokens[6]).toEqual({
          value: 'myvar',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.no-default.untyped.puppet', 'variable.other.puppet']
        });
      });
      it("tokenizes default class parameters", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" ($myvar = "myval") {').tokens;
        expect(tokens[5]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.default.untyped.puppet', 'variable.other.puppet', 'punctuation.definition.variable.puppet']
        });
        return expect(tokens[6]).toEqual({
          value: 'myvar',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.default.untyped.puppet', 'variable.other.puppet']
        });
      });
      it("tokenizes non-default class parameter types", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" (String $myvar) {').tokens;
        return expect(tokens[5]).toEqual({
          value: 'String',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.no-default.typed.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes default class parameter types", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" (String $myvar = "myval") {').tokens;
        return expect(tokens[5]).toEqual({
          value: 'String',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.default.typed.puppet', 'storage.type.puppet']
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
