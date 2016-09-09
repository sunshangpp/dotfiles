(function() {
  var Base, CompositeDisposable, Surround,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Base = require('./base');

  module.exports = Surround = (function(_super) {
    __extends(Surround, _super);

    function Surround(config) {
      this.command = config.surroundCommand;
      this.context = "atom-text-editor.vim-mode.visual-mode";
      Surround.__super__.constructor.call(this, config);
    }

    Surround.prototype.getName = function(key) {
      return "surround-" + key;
    };

    Surround.prototype.getRunner = function(left, right) {
      return function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        return editor.transact(function() {
          return editor.selections.forEach(function(selection) {
            var text;
            text = selection.getText();
            return selection.insertText("" + left + text + right);
          });
        });
      };
    };

    return Surround;

  })(Base);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL2xpYi9jb21tYW5kL3N1cnJvdW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsK0JBQUEsQ0FBQTs7QUFBYSxJQUFBLGtCQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUMsZUFBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyx1Q0FEWCxDQUFBO0FBQUEsTUFFQSwwQ0FBTSxNQUFOLENBRkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsdUJBS0EsT0FBQSxHQUFTLFNBQUMsR0FBRCxHQUFBO2FBQVUsV0FBQSxHQUFXLElBQXJCO0lBQUEsQ0FMVCxDQUFBOztBQUFBLHVCQU9BLFNBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7YUFBaUIsU0FBQSxHQUFBO0FBQzFCLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsUUFBUCxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFsQixDQUEwQixTQUFDLFNBQUQsR0FBQTtBQUN4QixnQkFBQSxJQUFBO0FBQUEsWUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFQLENBQUE7bUJBQ0EsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsRUFBQSxHQUFHLElBQUgsR0FBVSxJQUFWLEdBQWlCLEtBQXRDLEVBRndCO1VBQUEsQ0FBMUIsRUFEYztRQUFBLENBQWhCLEVBRjBCO01BQUEsRUFBakI7SUFBQSxDQVBYLENBQUE7O29CQUFBOztLQURzQyxLQUp4QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ssun/.atom/packages/vim-surround/lib/command/surround.coffee
