(function() {
  module.exports = {
    config: {
      environmentOverridesConfiguration: {
        title: 'Environment Overrides Config',
        description: 'Use the environment\'s value for GOPATH (if set) instead of the configured value for GOPATH (below)',
        type: 'boolean',
        "default": true,
        order: 1
      },
      goPath: {
        title: 'GOPATH',
        description: 'You should set your GOPATH in the environment, and launch Atom using the `atom` command line tool; if you would like to set it explicitly, you can do so here (e.g. ~/go)',
        type: 'string',
        "default": '',
        order: 2
      },
      goInstallation: {
        title: 'Go Installation Path',
        description: 'You should not normally set this; if you have a non-standard go installation path and `go` is not available on your PATH, you can use this to configure the location to `go` (e.g. /usr/local/othergo/bin/go or c:\\othergo\\bin\\go.exe)',
        type: 'string',
        "default": '',
        order: 3
      },
      formatOnSave: {
        title: 'Run Format Tool On Save',
        description: 'Run the configured format tool each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 4
      },
      formatTool: {
        title: 'Format Tool',
        description: 'Choose one: goimports, goreturns, or gofmt',
        type: 'string',
        "default": 'goimports',
        "enum": ['goimports', 'goreturns', 'gofmt'],
        order: 5
      },
      formatArgs: {
        title: 'Format Arguments',
        description: '`-w` will always be used; you can specify additional arguments for the format tool if desired',
        type: 'string',
        "default": '-w -e',
        order: 6
      },
      lintOnSave: {
        title: 'Run Lint Tool On Save',
        description: 'Run `golint` each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 7
      },
      golintArgs: {
        title: 'Lint Arguments',
        description: 'Arguments to pass to `golint` (these are not usually needed)',
        type: 'string',
        "default": '',
        order: 8
      },
      runCoverageOnSave: {
        title: 'Run Coverage Tool On Save',
        description: 'Run `go test -coverprofile` each time a file is saved',
        type: 'boolean',
        "default": false,
        order: 9
      },
      syntaxCheckOnSave: {
        title: 'Run Syntax Check On Save',
        description: 'Run `go build` / `go test` each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 10
      },
      vetOnSave: {
        title: 'Run Vet Tool On Save',
        description: 'Run `go vet` each time a file is saved',
        type: 'boolean',
        "default": true,
        order: 11
      },
      vetArgs: {
        title: 'Vet Arguments',
        description: 'Arguments to pass to `go vet` (these are not usually needed)',
        type: 'string',
        "default": '',
        order: 12
      },
      getMissingTools: {
        title: 'Automatically Get Missing Tools',
        description: 'Run `go get -u` to retrieve any tools that are required but not currently available in the go tool directory, the PATH, or your GOPATH',
        type: 'boolean',
        "default": true,
        order: 13
      },
      showPanel: {
        title: 'Show Message Panel',
        description: 'Show the go-plus message panel to provide information about issues with your source',
        type: 'boolean',
        "default": true,
        order: 14
      },
      showPanelWhenNoIssuesExist: {
        title: 'Show Message Panel When No Issues Exist',
        description: 'Show the go-plus message panel even when no issues exist',
        type: 'boolean',
        "default": false,
        order: 15
      },
      autocompleteBlacklist: {
        title: 'Autocomplete Scope Blacklist',
        description: 'Autocomplete suggestions will not be shown when the cursor is inside the following comma-delimited scope(s).',
        type: 'string',
        "default": '.source.go .comment',
        order: 16
      },
      suppressBuiltinAutocompleteProvider: {
        title: 'Suppress Built-In Autocomplete Plus Provider',
        description: 'Suppress the provider built-in to the autocomplete-plus package when editing .go files.',
        type: 'boolean',
        "default": true,
        order: 17
      },
      suppressAutocompleteActivationForCharacters: {
        title: 'Suppress Autocomplete Activation For Characters',
        description: 'Suggestions will not be provided when you type one of these characters.',
        type: 'array',
        "default": ['comma', 'newline', 'space', 'tab', '/', '\\', '(', ')', '"', '\'', ':', ';', '<', '>', '~', '!', '@', '#', '$', '%', '^', '&', '*', '|', '+', '=', '[', ']', '{', '}', '`', '~', '?', '-'],
        items: {
          type: 'string'
        },
        order: 18
      }
    },
    activate: function(state) {
      var run;
      run = (function(_this) {
        return function() {
          return _this.getDispatch();
        };
      })(this);
      return setTimeout(run.bind(this), 0);
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.provider) != null) {
        _ref.dispose();
      }
      this.provider = null;
      if ((_ref1 = this.dispatch) != null) {
        _ref1.destroy();
      }
      return this.dispatch = null;
    },
    getDispatch: function() {
      var Dispatch;
      if (this.dispatch != null) {
        return this.dispatch;
      }
      Dispatch = require('./dispatch');
      this.dispatch = new Dispatch();
      this.setDispatch();
      return this.dispatch;
    },
    setDispatch: function() {
      if ((this.provider != null) && (this.dispatch != null)) {
        return this.provider.setDispatch(this.dispatch);
      }
    },
    getProvider: function() {
      var GocodeProvider;
      if (this.provider != null) {
        return this.provider;
      }
      GocodeProvider = require('./gocodeprovider');
      this.provider = new GocodeProvider();
      this.setDispatch();
      return this.provider;
    },
    provide: function() {
      return this.getProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ28tcGx1cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxpQ0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sOEJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxxR0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0FBQUEsTUFNQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsMktBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsRUFIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FQRjtBQUFBLE1BWUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sc0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyT0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxFQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQWJGO0FBQUEsTUFrQkEsWUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8seUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwwREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQW5CRjtBQUFBLE1Bd0JBLFVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw0Q0FEYjtB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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/go-plus.coffee
