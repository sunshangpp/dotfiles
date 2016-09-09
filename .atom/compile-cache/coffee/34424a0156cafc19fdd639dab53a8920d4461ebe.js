(function() {
  var $$, GitGrepView, Point, SelectListView, View, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  SelectListView = require('atom').SelectListView;

  path = require('path');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, SelectListView = _ref.SelectListView;

  module.exports = GitGrepView = (function(_super) {
    __extends(GitGrepView, _super);

    function GitGrepView() {
      return GitGrepView.__super__.constructor.apply(this, arguments);
    }

    GitGrepView.prototype.getFilterKey = function() {
      return 'filePath';
    };

    GitGrepView.prototype.initialize = function(serializeState) {
      GitGrepView.__super__.initialize.apply(this, arguments);
      return this.addClass('git-grep overlay from-top');
    };

    GitGrepView.prototype.viewForItem = function(line) {
      return "<li>\n  <span class='path'>" + line.filePath + "</span>\n  :\n  <span class='line-number'>L" + line.line + "</span>\n  :\n  <span class='content'>" + line.content + "</span>\n</li>";
    };

    GitGrepView.prototype.confirmed = function(item) {
      this.openPath(path.join(atom.project.rootDirectory.path, item.filePath), item.line - 1);
      return this.hide();
    };

    GitGrepView.prototype.serialize = function() {};

    GitGrepView.prototype.openPath = function(filePath, lineNumber) {
      if (filePath) {
        return atom.workspaceView.open(filePath).done((function(_this) {
          return function() {
            return _this.moveToLine(lineNumber);
          };
        })(this));
      }
    };

    GitGrepView.prototype.moveToLine = function(lineNumber) {
      var editorView, position;
      if (lineNumber == null) {
        lineNumber = -1;
      }
      if (!(lineNumber >= 0)) {
        return;
      }
      if (editorView = atom.workspaceView.getActiveView()) {
        position = new Point(lineNumber);
        editorView.scrollToBufferPosition(position, {
          center: true
        });
        editorView.editor.setCursorBufferPosition(position);
        return editorView.editor.moveCursorToFirstCharacterOfLine();
      }
    };

    GitGrepView.prototype.destroy = function() {
      return this.detach();
    };

    return GitGrepView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0MsaUJBQWtCLE9BQUEsQ0FBUSxNQUFSLEVBQWxCLGNBREQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxPQUE4QixPQUFBLENBQVEsTUFBUixDQUE5QixFQUFDLFVBQUEsRUFBRCxFQUFLLGFBQUEsS0FBTCxFQUFZLHNCQUFBLGNBSFosQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsMEJBQUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLFdBQUg7SUFBQSxDQUFkLENBQUE7O0FBQUEsMEJBRUEsVUFBQSxHQUFZLFNBQUMsY0FBRCxHQUFBO0FBQ1YsTUFBQSw2Q0FBQSxTQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsMkJBQVYsRUFGVTtJQUFBLENBRlosQ0FBQTs7QUFBQSwwQkFNQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7YUFDUiw2QkFBQSxHQUNlLElBQUksQ0FBQyxRQURwQixHQUM4Qiw2Q0FEOUIsR0FHZSxJQUFJLENBQUMsSUFIcEIsR0FHMEIsd0NBSDFCLEdBS0UsSUFBSSxDQUFDLE9BTFAsR0FLZ0IsaUJBTlI7SUFBQSxDQU5iLENBQUE7O0FBQUEsMEJBZUEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsUUFBRCxDQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBckMsRUFBMkMsSUFBSSxDQUFDLFFBQWhELENBQVgsRUFBc0UsSUFBSSxDQUFDLElBQUwsR0FBVSxDQUFoRixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBRlM7SUFBQSxDQWZYLENBQUE7O0FBQUEsMEJBbUJBLFNBQUEsR0FBVyxTQUFBLEdBQUEsQ0FuQlgsQ0FBQTs7QUFBQSwwQkFxQkEsUUFBQSxHQUFVLFNBQUMsUUFBRCxFQUFXLFVBQVgsR0FBQTtBQUNSLE1BQUEsSUFBRyxRQUFIO2VBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixRQUF4QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsRUFERjtPQURRO0lBQUEsQ0FyQlYsQ0FBQTs7QUFBQSwwQkF5QkEsVUFBQSxHQUFZLFNBQUMsVUFBRCxHQUFBO0FBQ1YsVUFBQSxvQkFBQTs7UUFEVyxhQUFXLENBQUE7T0FDdEI7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFjLFVBQUEsSUFBYyxDQUE1QixDQUFBO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUcsVUFBQSxHQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBbkIsQ0FBQSxDQUFoQjtBQUNFLFFBQUEsUUFBQSxHQUFlLElBQUEsS0FBQSxDQUFNLFVBQU4sQ0FBZixDQUFBO0FBQUEsUUFDQSxVQUFVLENBQUMsc0JBQVgsQ0FBa0MsUUFBbEMsRUFBNEM7QUFBQSxVQUFBLE1BQUEsRUFBUSxJQUFSO1NBQTVDLENBREEsQ0FBQTtBQUFBLFFBRUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBbEIsQ0FBMEMsUUFBMUMsQ0FGQSxDQUFBO2VBR0EsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQ0FBbEIsQ0FBQSxFQUpGO09BRlU7SUFBQSxDQXpCWixDQUFBOztBQUFBLDBCQWlDQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURPO0lBQUEsQ0FqQ1QsQ0FBQTs7dUJBQUE7O0tBRHdCLGVBTjFCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ssun/.atom/packages/git-grep/lib/git-grep-view.coffee