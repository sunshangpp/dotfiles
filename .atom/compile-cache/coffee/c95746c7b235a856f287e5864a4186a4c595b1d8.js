(function() {
  var $, BufferedProcess, GoRenameView, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = GoRenameView = (function(_super) {
    __extends(GoRenameView, _super);

    function GoRenameView() {
      return GoRenameView.__super__.constructor.apply(this, arguments);
    }

    GoRenameView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div('rename identifier:');
          return _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
        };
      })(this));
    };

    GoRenameView.prototype.initialize = function() {
      atom.commands.add('atom-text-editor', 'go-rename:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
      this.miniEditor.on('blur', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      atom.commands.add(this.miniEditor.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.miniEditor.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
    };

    GoRenameView.prototype.toggle = function() {
      if (this.panel.isVisible()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    GoRenameView.prototype.close = function() {
      var _ref1;
      this.panel.hide();
      if ((_ref1 = this.focusElement) != null ? _ref1.isOnDom() : void 0) {
        return this.focusElement.focus();
      } else {
        return atom.views.getView(atom.workspace).focus();
      }
    };

    GoRenameView.prototype.open = function() {
      var buffer, wordStart;
      buffer = atom.workspace.getActiveTextEditor();
      if (buffer.isModified()) {
        buffer.save();
      }
      buffer.moveToBeginningOfWord();
      buffer.selectToEndOfWord();
      wordStart = buffer.getSelectedBufferRange().start;
      this.byteOffset = buffer.getTextInBufferRange([[0, 0], wordStart]).length;
      this.filePath = buffer.getPath();
      this.focusElement = $(':focus');
      this.panel.show();
      this.miniEditor.getModel().setText(buffer.getSelectedText());
      this.miniEditor.getModel().selectAll();
      return this.miniEditor.focus();
    };

    GoRenameView.prototype.confirm = function() {
      var args, command, exit, process, stderr, text;
      this.close();
      text = this.miniEditor.getModel().getText();
      if (text.length > 0) {
        command = atom.config.get('go-rename.path');
        args = ['-offset', "" + this.filePath + ":#" + this.byteOffset, '-to', text];
        stderr = (function(_this) {
          return function(output) {
            return _this.result = output;
          };
        })(this);
        exit = (function(_this) {
          return function(code) {
            if (code === 0) {
              return atom.notifications.addSuccess(_this.result);
            } else {
              return atom.notifications.addError(_this.result);
            }
          };
        })(this);
        return process = new BufferedProcess({
          command: command,
          args: args,
          stderr: stderr,
          exit: exit
        });
      }
    };

    return GoRenameView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcmVuYW1lL2xpYi9nby1yZW5hbWUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNERBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxzQkFBQSxjQUFKLEVBQW9CLFlBQUEsSUFEcEIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNILFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxvQkFBTCxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFmLENBQTNCLEVBRkc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMkJBS0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxrQkFBdEMsRUFBMEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxD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

//# sourceURL=/Users/ssun/.atom/packages/go-rename/lib/go-rename-view.coffee
