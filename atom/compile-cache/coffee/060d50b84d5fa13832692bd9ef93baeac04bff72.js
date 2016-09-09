(function() {
  var $, EditorView, GitGrepDialog, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, EditorView = _ref.EditorView, View = _ref.View;

  module.exports = GitGrepDialog = (function(_super) {
    __extends(GitGrepDialog, _super);

    function GitGrepDialog() {
      return GitGrepDialog.__super__.constructor.apply(this, arguments);
    }

    GitGrepDialog.content = function(params) {
      return this.div({
        "class": 'git-grep-dialog overlay from-top'
      }, (function(_this) {
        return function() {
          _this.label("git grep: " + params.rootPath);
          return _this.subview('miniEditor', new EditorView({
            mini: true
          }));
        };
      })(this));
    };

    GitGrepDialog.prototype.initialize = function(_arg) {
      this.onConfirm = _arg.onConfirm;
      this.on('core:confirm', (function(_this) {
        return function() {
          _this.onConfirm(_this.miniEditor.getText());
          return _this.close();
        };
      })(this));
      this.on('core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
      return this.miniEditor.hiddenInput.on('focusout', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
    };

    GitGrepDialog.prototype.attach = function() {
      this.miniEditor.setText('');
      atom.workspaceView.append(this);
      return this.miniEditor.focus();
    };

    GitGrepDialog.prototype.close = function() {
      this.hide();
      this.remove();
      return atom.workspaceView.focus();
    };

    GitGrepDialog.prototype.cancel = function() {
      return this.hide();
    };

    return GitGrepDialog;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsTUFBUixDQUF4QixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBQUosRUFBZ0IsWUFBQSxJQUFoQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sa0NBQVA7T0FBTCxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlDLFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBUSxZQUFBLEdBQVcsTUFBTSxDQUFDLFFBQTFCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxVQUFBLENBQVc7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQVgsQ0FBM0IsRUFGOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUtBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLE1BRFksSUFBQyxDQUFBLFlBQUYsS0FBRSxTQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxFQUFELENBQUksY0FBSixFQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsS0FBQyxDQUFBLFNBQUQsQ0FBVyxLQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFYLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFBLEVBRmtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsQ0FBQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsRUFBRCxDQUFJLGFBQUosRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQUpBLENBQUE7YUFLQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUF4QixDQUEyQixVQUEzQixFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLEVBTlU7SUFBQSxDQUxaLENBQUE7O0FBQUEsNEJBYUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLEVBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFuQixDQUEwQixJQUExQixDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxFQUhNO0lBQUEsQ0FiUixDQUFBOztBQUFBLDRCQWtCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQW5CLENBQUEsRUFISztJQUFBLENBbEJQLENBQUE7O0FBQUEsNEJBdUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsSUFBRCxDQUFBLEVBRE07SUFBQSxDQXZCUixDQUFBOzt5QkFBQTs7S0FEMEIsS0FINUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ssun/.atom/packages/git-grep/lib/git-grep-dialog-view.coffee