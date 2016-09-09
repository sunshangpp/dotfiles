(function() {
  var AtomConfig,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = AtomConfig = (function() {
    function AtomConfig() {
      this.allfunctionalitydisabled = __bind(this.allfunctionalitydisabled, this);
    }

    AtomConfig.prototype.defaults = function() {
      atom.config.set('go-plus.environmentOverridesConfiguration', true);
      atom.config.set('go-plus.formatArgs', '-w -e');
      atom.config.set('go-plus.vetArgs', '');
      atom.config.set('go-plus.formatTool', 'goimports');
      atom.config.set('go-plus.goPath', '');
      atom.config.set('go-plus.golintArgs', '');
      atom.config.set('go-plus.showPanel', true);
      return atom.config.set('go-plus.showPanelWhenNoIssuesExist', false);
    };

    AtomConfig.prototype.allfunctionalitydisabled = function() {
      this.defaults();
      atom.config.set('go-plus.syntaxCheckOnSave', false);
      atom.config.set('go-plus.formatOnSave', false);
      atom.config.set('go-plus.formatTool', 'gofmt');
      atom.config.set('go-plus.getMissingTools', false);
      atom.config.set('go-plus.vetOnSave', false);
      atom.config.set('go-plus.lintOnSave', false);
      atom.config.set('go-plus.runCoverageOnSave', false);
      return atom.config.set('autocomplete-plus.enableAutoActivation', false);
    };

    return AtomConfig;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL3V0aWwvYXRvbWNvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0tBRUo7O0FBQUEseUJBQUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJDQUFoQixFQUE2RCxJQUE3RCxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsT0FBdEMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLEVBQW1DLEVBQW5DLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxXQUF0QyxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsRUFBa0MsRUFBbEMsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLEVBQXRDLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQyxJQUFyQyxDQU5BLENBQUE7YUFPQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLEVBQXNELEtBQXRELEVBUlE7SUFBQSxDQUFWLENBQUE7O0FBQUEseUJBVUEsd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLE1BQUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsRUFBNkMsS0FBN0MsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLEtBQXhDLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxPQUF0QyxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsRUFBMkMsS0FBM0MsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLEtBQXJDLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQyxLQUF0QyxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsRUFBNkMsS0FBN0MsQ0FQQSxDQUFBO2FBUUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxLQUExRCxFQVR3QjtJQUFBLENBVjFCLENBQUE7O3NCQUFBOztNQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/util/atomconfig.coffee
