(function() {
  var SelectInsideBrackets, SelectInsideQuotes, Selector, vimModePath, _ref;

  vimModePath = atom.packages.resolvePackagePath('vim-mode') || atom.packages.resolvePackagePath('vim-mode-next');

  _ref = require("" + vimModePath + "/lib/text-objects"), SelectInsideQuotes = _ref.SelectInsideQuotes, SelectInsideBrackets = _ref.SelectInsideBrackets;

  module.exports = Selector = (function() {
    function Selector(editor, left, right) {
      this.editor = editor;
      this.left = left.trim();
      this.right = right.trim();
    }

    Selector.prototype.inside = function() {
      if (this.isBraket()) {
        return new SelectInsideBrackets(this.editor, this.left, this.right, false);
      } else {
        return new SelectInsideQuotes(this.editor, this.left, false);
      }
    };

    Selector.prototype.outside = function() {
      if (this.isBraket()) {
        return new SelectInsideBrackets(this.editor, this.left, this.right, true);
      } else {
        return new SelectInsideQuotes(this.editor, this.left, true);
      }
    };

    Selector.prototype.isBraket = function() {
      var _base;
      return (typeof (_base = ['[', ']', '{', '}', '<', '>', '(', ')']).indexOf === "function" ? _base.indexOf(this.left.trim()) : void 0) >= 0;
    };

    return Selector;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL2xpYi9jb21tYW5kL3NlbGVjdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRUFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLFVBQWpDLENBQUEsSUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLGVBQWpDLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE9BQTZDLE9BQUEsQ0FBUSxFQUFBLEdBQUcsV0FBSCxHQUFlLG1CQUF2QixDQUE3QyxFQUFDLDBCQUFBLGtCQUFELEVBQXFCLDRCQUFBLG9CQUhyQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDUixJQUFBLGtCQUFFLE1BQUYsRUFBVSxJQUFWLEVBQWdCLEtBQWhCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsSUFBTixDQUFBLENBRFQsQ0FEVztJQUFBLENBQWI7O0FBQUEsdUJBSUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUg7ZUFDTSxJQUFBLG9CQUFBLENBQXFCLElBQUMsQ0FBQSxNQUF0QixFQUE4QixJQUFDLENBQUEsSUFBL0IsRUFBcUMsSUFBQyxDQUFBLEtBQXRDLEVBQTZDLEtBQTdDLEVBRE47T0FBQSxNQUFBO2VBR00sSUFBQSxrQkFBQSxDQUFtQixJQUFDLENBQUEsTUFBcEIsRUFBNEIsSUFBQyxDQUFBLElBQTdCLEVBQW1DLEtBQW5DLEVBSE47T0FETTtJQUFBLENBSlIsQ0FBQTs7QUFBQSx1QkFVQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBSDtlQUNNLElBQUEsb0JBQUEsQ0FBcUIsSUFBQyxDQUFBLE1BQXRCLEVBQThCLElBQUMsQ0FBQSxJQUEvQixFQUFxQyxJQUFDLENBQUEsS0FBdEMsRUFBNkMsSUFBN0MsRUFETjtPQUFBLE1BQUE7ZUFHTSxJQUFBLGtCQUFBLENBQW1CLElBQUMsQ0FBQSxNQUFwQixFQUE0QixJQUFDLENBQUEsSUFBN0IsRUFBbUMsSUFBbkMsRUFITjtPQURPO0lBQUEsQ0FWVCxDQUFBOztBQUFBLHVCQWdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxLQUFBO3NHQUF3QyxDQUFDLFFBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUEsWUFBbEQsSUFBbUUsRUFEM0Q7SUFBQSxDQWhCVixDQUFBOztvQkFBQTs7TUFORixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ssun/.atom/packages/vim-surround/lib/command/selector.coffee
