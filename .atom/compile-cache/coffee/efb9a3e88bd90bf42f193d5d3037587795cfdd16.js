(function() {
  var Point, StatusBarView, View, copyPaste, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, Point = _ref.Point;

  copyPaste = require('copy-paste').noConflict().silent();

  StatusBarView = (function(_super) {
    __extends(StatusBarView, _super);

    function StatusBarView() {
      return StatusBarView.__super__.constructor.apply(this, arguments);
    }

    StatusBarView.content = function() {
      return this.div({
        "class": 'tool-panel panel-bottom padded text-smaller'
      }, (function(_this) {
        return function() {
          return _this.dl({
            "class": 'linter-statusbar',
            outlet: 'violations'
          });
        };
      })(this));
    };

    StatusBarView.prototype.show = function() {
      StatusBarView.__super__.show.apply(this, arguments);
      this.on('click', '.copy', function() {
        return copyPaste.copy(this.parentElement.getElementsByClassName('error-message')[0].innerText);
      });
      return this.on('click', '.goToError', function() {
        var col, line, _ref1;
        line = parseInt(this.dataset.line, 10);
        col = parseInt(this.dataset.col, 10);
        return (_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.setCursorBufferPosition(new Point(line, col)) : void 0;
      });
    };

    StatusBarView.prototype.highlightLines = function(currentLine) {
      var $line;
      if (!this.showAllErrors) {
        return;
      }
      this.find('.error-message').removeClass('message-highlighted');
      $line = this.find('.linter-line-' + currentLine);
      return $line != null ? $line.addClass('message-highlighted') : void 0;
    };

    StatusBarView.prototype.hide = function() {
      this.off('click', '.copy');
      this.off('click', '.goToError');
      return StatusBarView.__super__.hide.apply(this, arguments);
    };

    StatusBarView.prototype.computeMessages = function(messages, position, currentLine, limitOnErrorRange) {
      var index, item, pos, showInRange, showOnLine, violation, _i, _len, _ref1, _ref2;
      this.violations.empty();
      if (this.showAllErrors) {
        messages.sort(function(a, b) {
          return a.line - b.line;
        });
      }
      for (index = _i = 0, _len = messages.length; _i < _len; index = ++_i) {
        item = messages[index];
        showInRange = ((_ref1 = item.range) != null ? _ref1.containsPoint(position) : void 0) && index <= 10 && limitOnErrorRange;
        showOnLine = ((_ref2 = item.range) != null ? _ref2.start.row : void 0) === currentLine && !limitOnErrorRange;
        if (showInRange || showOnLine || this.showAllErrors) {
          pos = "line: " + item.line;
          if (item.col != null) {
            pos = "" + pos + " / col: " + item.col;
          }
          violation = "<dt>\n  <span class='highlight-" + item.level + "'>" + item.linter + "</span>\n</dt>\n<dd>\n  <span class='copy icon-clippy'></span>\n  <span class='goToError' data-line='" + (item.line - 1) + "' data-col='" + (item.col - 1 || 0) + "'>\n    <span class='error-message linter-line-" + (item.line - 1) + "'>" + item.message + "</span>\n    <span class='pos'>" + pos + "</span>\n  </span>\n</dd>";
          this.violations.append(violation);
        }
      }
      if (violation != null) {
        this.show();
        return this.highlightLines(currentLine);
      }
    };

    StatusBarView.prototype.getCursorPosition = function() {
      var e, error, paneItem, position;
      try {
        if (!paneItem) {
          paneItem = atom.workspaceView.getActivePaneItem();
          position = paneItem != null ? typeof paneItem.getCursorBufferPosition === "function" ? paneItem.getCursorBufferPosition() : void 0 : void 0;
        }
      } catch (_error) {
        e = _error;
        error = e;
      }
      return position || void 0;
    };

    StatusBarView.prototype.render = function(messages, paneItem) {
      var currentLine, limitOnErrorRange, position;
      atom.workspaceView.prependToBottom(this);
      limitOnErrorRange = atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange');
      this.showAllErrors = atom.config.get('linter.showAllErrorsInStatusBar');
      this.hide();
      if (!(messages.length > 0)) {
        return;
      }
      position = this.getCursorPosition();
      if (!position) {
        return;
      }
      currentLine = position.row;
      return this.computeMessages(messages, position, currentLine, limitOnErrorRange);
    };

    return StatusBarView;

  })(View);

  module.exports = StatusBarView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsTUFBUixDQUFoQixFQUFDLFlBQUEsSUFBRCxFQUFPLGFBQUEsS0FBUCxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxZQUFSLENBQ1YsQ0FBQyxVQURTLENBQUEsQ0FFVixDQUFDLE1BRlMsQ0FBQSxDQUZaLENBQUE7O0FBQUEsRUFPTTtBQUVKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDZDQUFQO09BQUwsRUFBMkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDekQsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFBMkIsTUFBQSxFQUFRLFlBQW5DO1dBQUosRUFEeUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzRCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUlBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLHlDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxPQUFiLEVBQXNCLFNBQUEsR0FBQTtlQUNwQixTQUFTLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBc0MsZUFBdEMsQ0FBdUQsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUF6RSxFQURvQjtNQUFBLENBQXRCLENBRkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxFQUFELENBQUksT0FB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
//# sourceURL=/Users/ssun/.atom/packages/linter/lib/statusbar-view.coffee