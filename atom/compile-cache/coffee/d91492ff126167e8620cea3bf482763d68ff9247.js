(function() {
  var ScalaLineProcessor;

  module.exports = ScalaLineProcessor = (function() {
    function ScalaLineProcessor(targetEditor) {
      this.targetEditor = targetEditor;
      this.targetEditor.moveCursorToTop();
      this.editorLines = this.targetEditor.getText().split("\n");
      this.editorLineIndex = 0;
      this.metFirstScalaPrompt = false;
      this.firstEmptyLine = true;
      this.currentLine = "";
      this.maxLength = 50;
      console.log("scala-line-processor created");
    }

    ScalaLineProcessor.prototype.processLine = function(line) {
      var editorLine, isEmptyLine, isLineBreak, isScalaPrompt;
      isScalaPrompt = line.match(this.regexps.scalaPrompt);
      isEmptyLine = line.match(this.regexps.emptyLine);
      isLineBreak = line.match(this.regexps.lineBreak);
      if (!this.metFirstScalaPrompt) {
        this.metFirstScalaPrompt = isScalaPrompt;
      }
      if (!this.metFirstScalaPrompt) {
        return;
      }
      if (isScalaPrompt) {
        return;
      }
      if (isLineBreak) {
        line = "";
      }
      if (isEmptyLine) {
        if (this.firstEmptyLine) {
          this.firstEmptyLine = false;
          return;
        }
      } else {
        this.firstEmptyLine = true;
      }
      if (!(isEmptyLine || isLineBreak)) {
        editorLine = this.editorLines[this.editorLineIndex];
        editorLine = this.formatLine(editorLine);
        this.editorLines[this.editorLineIndex] = editorLine + "  // " + line;
        this.targetEditor.setText(this.editorLines.join("\n"));
      }
      return this.editorLineIndex = this.editorLineIndex + 1;
    };

    ScalaLineProcessor.prototype.formatLine = function(line) {
      line = line.replace(this.regexps.comment);
      if (line.length > this.maxLength) {
        return line.substring(0, this.maxLength);
      }
      return line + this.repeat(" ", this.maxLength - line.length);
    };

    ScalaLineProcessor.prototype.repeat = function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
  };

    ScalaLineProcessor.prototype.regexps = {
      scalaPrompt: /^scala\>/,
      lineBreak: /^\s+\|/,
      emptyLine: /^\s*$/,
      comment: /\/\/.*$/
    };

    return ScalaLineProcessor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNEJBQUUsWUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZUFBQSxZQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsZUFBZCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxDQUF1QixDQUFDLEtBQXhCLENBQThCLElBQTlCLENBRGYsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsQ0FGbkIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLG1CQUFELEdBQXVCLEtBSHZCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBSmxCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFMZixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBTmIsQ0FBQTtBQUFBLE1BT0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSw4QkFBWixDQVBBLENBRFc7SUFBQSxDQUFiOztBQUFBLGlDQVVBLFdBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsbURBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQXBCLENBQWhCLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBcEIsQ0FEZCxDQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQXBCLENBRmQsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLElBQTZDLENBQUEsbUJBQTdDO0FBQUEsUUFBQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsYUFBdkIsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLG1CQUFmO0FBQUEsY0FBQSxDQUFBO09BTEE7QUFPQSxNQUFBLElBQVUsYUFBVjtBQUFBLGNBQUEsQ0FBQTtPQVBBO0FBUUEsTUFBQSxJQUFhLFdBQWI7QUFBQSxRQUFBLElBQUEsR0FBTyxFQUFQLENBQUE7T0FSQTtBQVVBLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxjQUFKO0FBQ0UsVUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUFsQixDQUFBO0FBQ0EsZ0JBQUEsQ0FGRjtTQURGO09BQUEsTUFBQTtBQUtFLFFBQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBbEIsQ0FMRjtPQVZBO0FBbUJBLE1BQUEsSUFBQSxDQUFBLENBQU8sV0FBQSxJQUFlLFdBQXRCLENBQUE7QUFDRSxRQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsV0FBWSxDQUFBLElBQUMsQ0FBQSxlQUFELENBQTFCLENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsVUFBRCxDQUFZLFVBQVosQ0FEYixDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsV0FBWSxDQUFBLElBQUMsQ0FBQSxlQUFELENBQWIsR0FBaUMsVUFBQSxHQUFhLE9BQWIsR0FBdUIsSUFGeEQsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQXNCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQixDQUF0QixDQUhBLENBREY7T0FuQkE7YUF5QkEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUExQjNCO0lBQUEsQ0FWYixDQUFBOztBQUFBLGlDQXVDQSxVQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBdEIsQ0FBUCxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBQyxDQUFBLFNBQWxCO0FBQ0UsZUFBTyxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBQyxDQUFBLFNBQW5CLENBQVAsQ0FERjtPQURBO0FBSUEsYUFBTyxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQUQsQ0FBUSxHQUFSLEVBQWMsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFJLENBQUMsTUFBaEMsQ0FBZCxDQUxVO0lBQUEsQ0F2Q1osQ0FBQTs7QUFBQSxpQ0E4Q0EsTUFBQSxHQUFROzs7Ozs7OztHQTlDUixDQUFBOztBQUFBLGlDQXdEQSxPQUFBLEdBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxVQUFiO0FBQUEsTUFDQSxTQUFBLEVBQVcsUUFEWDtBQUFBLE1BRUEsU0FBQSxFQUFXLE9BRlg7QUFBQSxNQUdBLE9BQUEsRUFBUyxTQUhUO0tBekRGLENBQUE7OzhCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ssun/.atom/packages/scala-worksheet/lib/scala-line-processor.coffee