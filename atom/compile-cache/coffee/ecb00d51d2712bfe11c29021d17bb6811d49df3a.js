(function() {
  var EditorLocationStack, doneAlready;

  doneAlready = function() {
    return new Promise(function(resolve, reject) {
      return resolve();
    });
  };

  module.exports = EditorLocationStack = (function() {
    function EditorLocationStack(maxSize) {
      this.maxSize = maxSize != null ? maxSize : 500;
      if (this.maxSize < 1) {
        this.maxSize = 1;
      }
      this.stack = [];
    }

    EditorLocationStack.prototype.isEmpty = function() {
      return !this.stack.length;
    };

    EditorLocationStack.prototype.reset = function() {
      return this.stack = [];
    };

    EditorLocationStack.prototype.pushCurrentLocation = function() {
      var editor, loc, _ref, _ref1;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      loc = {
        position: editor.getCursorBufferPosition(),
        file: editor.getURI()
      };
      if (!(loc.file && ((_ref = loc.position) != null ? _ref.row : void 0) && ((_ref1 = loc.position) != null ? _ref1.column : void 0))) {
        return;
      }
      this.push(loc);
    };

    EditorLocationStack.prototype.restorePreviousLocation = function() {
      var lastLocation;
      if (this.isEmpty()) {
        return doneAlready();
      }
      lastLocation = this.stack.pop();
      return atom.workspace.open(lastLocation.file).then((function(_this) {
        return function(editor) {
          return _this.moveEditorCursorTo(editor, lastLocation.position);
        };
      })(this));
    };

    EditorLocationStack.prototype.moveEditorCursorTo = function(editor, pos) {
      if (!editor) {
        return;
      }
      editor.scrollToBufferPosition(pos);
      editor.setCursorBufferPosition(pos);
    };

    EditorLocationStack.prototype.push = function(loc) {
      this.stack.push(loc);
      if (this.stack.length > this.maxSize) {
        this.stack.splice(0, this.stack.length - this.maxSize);
      }
    };

    return EditorLocationStack;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvdXRpbC9lZGl0b3ItbG9jYXRpb24tc3RhY2suY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLFNBQUEsR0FBQTtXQUNSLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTthQUNWLE9BQUEsQ0FBQSxFQURVO0lBQUEsQ0FBUixFQURRO0VBQUEsQ0FBZCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsNkJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsNEJBQUEsVUFBVSxHQUN2QixDQUFBO0FBQUEsTUFBQSxJQUFnQixJQUFDLENBQUEsT0FBRCxHQUFXLENBQTNCO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQVgsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFQsQ0FEVztJQUFBLENBQWI7O0FBQUEsa0NBSUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLENBQUEsSUFBSyxDQUFBLEtBQUssQ0FBQyxPQURKO0lBQUEsQ0FKVCxDQUFBOztBQUFBLGtDQU9BLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsS0FBRCxHQUFTLEdBREo7SUFBQSxDQVBQLENBQUE7O0FBQUEsa0NBVUEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsd0JBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsTUFBQTtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFFQSxHQUFBLEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFWO0FBQUEsUUFDQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUROO09BSEYsQ0FBQTtBQUtBLE1BQUEsSUFBQSxDQUFBLENBQWMsR0FBRyxDQUFDLElBQUoseUNBQXlCLENBQUUsYUFBM0IsMkNBQStDLENBQUUsZ0JBQS9ELENBQUE7QUFBQSxjQUFBLENBQUE7T0FMQTtBQUFBLE1BTUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxHQUFOLENBTkEsQ0FEbUI7SUFBQSxDQVZyQixDQUFBOztBQUFBLGtDQXNCQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxZQUFBO0FBQUEsTUFBQSxJQUF3QixJQUFDLENBQUEsT0FBRCxDQUFBLENBQXhCO0FBQUEsZUFBTyxXQUFBLENBQUEsQ0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLFlBQUEsR0FBZSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBQSxDQURmLENBQUE7YUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBWSxDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUMxQyxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsTUFBcEIsRUFBNEIsWUFBWSxDQUFDLFFBQXpDLEVBRDBDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUMsRUFIdUI7SUFBQSxDQXRCekIsQ0FBQTs7QUFBQSxrQ0E0QkEsa0JBQUEsR0FBb0IsU0FBQyxNQUFELEVBQVMsR0FBVCxHQUFBO0FBQ2xCLE1BQUEsSUFBQSxDQUFBLE1BQUE7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLEdBQTlCLENBREEsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLEdBQS9CLENBRkEsQ0FEa0I7SUFBQSxDQTVCcEIsQ0FBQTs7QUFBQSxrQ0FrQ0EsSUFBQSxHQUFNLFNBQUMsR0FBRCxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBOEMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWdCLElBQUMsQ0FBQSxPQUEvRDtBQUFBLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsQ0FBZCxFQUFpQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0IsSUFBQyxDQUFBLE9BQWxDLENBQUEsQ0FBQTtPQUZJO0lBQUEsQ0FsQ04sQ0FBQTs7K0JBQUE7O01BTkosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/util/editor-location-stack.coffee
