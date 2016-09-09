(function() {
  var Base, Delete, Selector, compositedisposable,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  compositedisposable = require('atom').compositedisposable;

  Base = require('./base');

  Selector = require('./selector');

  module.exports = Delete = (function(_super) {
    __extends(Delete, _super);

    function Delete(config) {
      this.command = config.deleteSurroundCommand;
      this.context = "atom-text-editor.vim-mode.normal-mode";
      Delete.__super__.constructor.call(this, config);
    }

    Delete.prototype.getName = function(key) {
      return "delete-" + key;
    };

    Delete.prototype.getRunner = function(left, right) {
      return function() {
        var editor, selector;
        editor = atom.workspace.getActiveTextEditor();
        selector = new Selector(editor, left, right);
        return editor.transact(function() {
          var cursorPos;
          cursorPos = editor.getCursorBufferPosition();
          selector.inside().select();
          editor.selections.forEach(function(selection) {
            var text;
            text = selection.getText();
            editor.setCursorBufferPosition(cursorPos);
            selector.outside().select();
            return editor.selections.forEach(function(selection) {
              return selection.insertText(text);
            });
          });
          return editor.setCursorBufferPosition(cursorPos);
        });
      };
    };

    return Delete;

  })(Base);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL2xpYi9jb21tYW5kL2RlbGV0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BQU0sQ0FBQyxxQkFBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyx1Q0FEWCxDQUFBO0FBQUEsTUFFQSx3Q0FBTSxNQUFOLENBRkEsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBS0EsT0FBQSxHQUFTLFNBQUMsR0FBRCxHQUFBO2FBQVUsU0FBQSxHQUFTLElBQW5CO0lBQUEsQ0FMVCxDQUFBOztBQUFBLHFCQU9BLFNBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7YUFBaUIsU0FBQSxHQUFBO0FBQzFCLFlBQUEsZ0JBQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsUUFDQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQVMsTUFBVCxFQUFpQixJQUFqQixFQUF1QixLQUF2QixDQURmLENBQUE7ZUFHQSxNQUFNLENBQUMsUUFBUCxDQUFnQixTQUFBLEdBQUE7QUFDZCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFaLENBQUE7QUFBQSxVQUVBLFFBQVEsQ0FBQyxNQUFULENBQUEsQ0FBaUIsQ0FBQyxNQUFsQixDQUFBLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFsQixDQUEwQixTQUFDLFNBQUQsR0FBQTtBQUN4QixnQkFBQSxJQUFBO0FBQUEsWUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFQLENBQUE7QUFBQSxZQUdBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixTQUEvQixDQUhBLENBQUE7QUFBQSxZQUlBLFFBQVEsQ0FBQyxPQUFULENBQUEsQ0FBa0IsQ0FBQyxNQUFuQixDQUFBLENBSkEsQ0FBQTttQkFNQSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQWxCLENBQTBCLFNBQUMsU0FBRCxHQUFBO3FCQUN4QixTQUFTLENBQUMsVUFBVixDQUFxQixJQUFyQixFQUR3QjtZQUFBLENBQTFCLEVBUHdCO1VBQUEsQ0FBMUIsQ0FIQSxDQUFBO2lCQWNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixTQUEvQixFQWZjO1FBQUEsQ0FBaEIsRUFKMEI7TUFBQSxFQUFqQjtJQUFBLENBUFgsQ0FBQTs7a0JBQUE7O0tBRG9DLEtBTHRDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ssun/.atom/packages/vim-surround/lib/command/delete.coffee
