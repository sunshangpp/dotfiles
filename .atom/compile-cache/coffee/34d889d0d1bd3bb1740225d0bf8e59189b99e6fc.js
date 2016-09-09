(function() {
  var BufferedProcess, EditorView, ScalaLineProcessor, ScalaProcess;

  EditorView = require('atom').EditorView;

  BufferedProcess = require('atom').BufferedProcess;

  ScalaProcess = require('./scala-process');

  ScalaLineProcessor = require('./scala-line-processor');

  module.exports = {
    configDefaults: {
      scalaProcess: "scala"
    },
    activate: function(state) {
      return atom.workspaceView.command("scala-worksheet:run", (function(_this) {
        return function() {
          return _this.prepareRun(function() {
            return _this.executeWorkSheet(_this.sourcesEditor.getText(), _this.sourcesEditors);
          });
        };
      })(this));
    },
    deactivate: function() {
      this.scalaProcess.stdin.end();
      return this.scalaProcess.kill();
    },
    prepareRun: function(callback) {
      var sourcesPane;
      sourcesPane = this.findSourcesPane();
      this.sourcesEditor = sourcesPane.getActiveEditor();
      this.scalaLiner = new ScalaLineProcessor(this.sourcesEditor);
      if (this.scalaProcess == null) {
        this.scalaProcess = new ScalaProcess(atom.config.get('scala-worksheet.scalaProcess'));
        this.scalaProcess.setBlockCallback((function(_this) {
          return function(block) {
            var line, _i, _len, _ref, _results;
            _ref = block.split("\n");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              line = _ref[_i];
              _results.push(_this.scalaLiner.processLine(line));
            }
            return _results;
          };
        })(this));
        this.scalaProcess.setErrorCallback(function(error) {
          return console.log("Error: " + error);
        });
        this.scalaProcess.initialize(function() {
          return callback();
        });
      }
      return callback();
    },
    findSourcesPane: function() {
      var panes;
      panes = atom.workspace.getPanes();
      return panes[0];
    },
    executeWorkSheet: function(source, targetEditor) {
      return this.scalaProcess.writeBlock(source);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUhyQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsT0FBZDtLQURGO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHFCQUEzQixFQUFrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoRCxLQUFDLENBQUEsVUFBRCxDQUFZLFNBQUEsR0FBQTttQkFBTSxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBbEIsRUFBNEMsS0FBQyxDQUFBLGNBQTdDLEVBQU47VUFBQSxDQUFaLEVBRGdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEQsRUFEUTtJQUFBLENBSFY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQXBCLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQUEsRUFGVTtJQUFBLENBUFo7QUFBQSxJQVdBLFVBQUEsRUFBWSxTQUFDLFFBQUQsR0FBQTtBQUNWLFVBQUEsV0FBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQixXQUFXLENBQUMsZUFBWixDQUFBLENBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsa0JBQUEsQ0FBbUIsSUFBQyxDQUFBLGFBQXBCLENBSGxCLENBQUE7QUFJQSxNQUFBLElBQU8seUJBQVA7QUFDRSxRQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBYixDQUFwQixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLGdCQUFkLENBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDN0IsZ0JBQUEsOEJBQUE7QUFBQTtBQUFBO2lCQUFBLDJDQUFBOzhCQUFBO0FBQ0UsNEJBQUEsS0FBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLElBQXhCLEVBQUEsQ0FERjtBQUFBOzRCQUQ2QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLENBREEsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxnQkFBZCxDQUErQixTQUFDLEtBQUQsR0FBQTtpQkFDN0IsT0FBTyxDQUFDLEdBQVIsQ0FBYSxTQUFBLEdBQVEsS0FBckIsRUFENkI7UUFBQSxDQUEvQixDQUpBLENBQUE7QUFBQSxRQU1BLElBQUMsQ0FBQSxZQUFZLENBQUMsVUFBZCxDQUF5QixTQUFBLEdBQUE7aUJBQUssUUFBQSxDQUFBLEVBQUw7UUFBQSxDQUF6QixDQU5BLENBREY7T0FKQTthQWFBLFFBQUEsQ0FBQSxFQWRVO0lBQUEsQ0FYWjtBQUFBLElBNEJBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBUixDQUFBO2FBQ0EsS0FBTSxDQUFBLENBQUEsRUFGUztJQUFBLENBNUJqQjtBQUFBLElBZ0NBLGdCQUFBLEVBQWtCLFNBQUMsTUFBRCxFQUFTLFlBQVQsR0FBQTthQUNoQixJQUFDLENBQUEsWUFBWSxDQUFDLFVBQWQsQ0FBeUIsTUFBekIsRUFEZ0I7SUFBQSxDQWhDbEI7R0FORixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ssun/.atom/packages/scala-worksheet/lib/scala-worksheet.coffee