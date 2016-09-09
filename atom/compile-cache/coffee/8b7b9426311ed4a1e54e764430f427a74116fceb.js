(function() {
  var GitGrepDialogView, GitGrepView, Line, exec, path;

  GitGrepView = require('./git-grep-view');

  GitGrepDialogView = require('./git-grep-dialog-view');

  exec = require('child_process').exec;

  path = require('path');

  Line = (function() {
    function Line(_arg) {
      this.line = _arg.line, this.filePath = _arg.filePath, this.content = _arg.content, this.raw = _arg.raw;
    }

    return Line;

  })();

  module.exports = {
    gitGrepView: null,
    activate: function(state) {
      return atom.workspaceView.command("git-grep:grep", (function(_this) {
        return function() {
          return _this.grep(state);
        };
      })(this));
    },
    grep: function(state) {
      if (this.gitGrepView == null) {
        this.gitGrepView = new GitGrepView(state.GitGrepViewState);
      }
      if (this.gitGrepView.hasParent()) {
        return this.gitGrepView.detach();
      } else {
        this.dialog = new GitGrepDialogView({
          rootPath: atom.project.rootDirectory.path,
          onConfirm: (function(_this) {
            return function(query) {
              return _this._grep(query, function(lines) {
                _this.gitGrepView.show();
                atom.workspaceView.append(_this.gitGrepView);
                _this.gitGrepView.setItems(lines);
                return _this.gitGrepView.focusFilterEditor();
              });
            };
          })(this)
        });
        return this.dialog.attach();
      }
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.gitGrepView) != null ? _ref.remove() : void 0;
    },
    serialize: function() {
      return {
        gitGrepViewState: this.gitGrepView.serialize()
      };
    },
    parseGitGrep: function(stdout) {
      var at, content, filePath, line, _i, _len, _ref, _ref1, _results;
      _ref = stdout.split('\n');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (!(line.length > 5)) {
          continue;
        }
        _ref1 = line.split(/\:\d+\:/), filePath = _ref1[0], content = _ref1[1];
        at = parseInt(line.match(/\:\d+\:/)[0].slice(1, +(line.length - 2) + 1 || 9e9), 10);
        _results.push(new Line({
          filePath: filePath,
          line: at,
          content: content,
          raw: line
        }));
      }
      return _results;
    },
    _grep: function(query, callback) {
      var command;
      command = "git grep -n --no-color " + query;
      return exec(command, {
        cwd: atom.project.rootDirectory.path
      }, (function(_this) {
        return function(err, stdout, stderr) {
          var lines;
          if (err) {
            return callback([]);
          }
          if (stderr) {
            if (stderr) {
              throw stderr;
            }
          }
          lines = _this.parseGitGrep(stdout);
          return callback(lines);
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxFQUVDLE9BQVEsT0FBQSxDQUFRLGVBQVIsRUFBUixJQUZELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS007QUFDUyxJQUFBLGNBQUMsSUFBRCxHQUFBO0FBQXNDLE1BQXBDLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLGdCQUFBLFVBQVUsSUFBQyxDQUFBLGVBQUEsU0FBUyxJQUFDLENBQUEsV0FBQSxHQUFPLENBQXRDO0lBQUEsQ0FBYjs7Z0JBQUE7O01BTkYsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFdBQUEsRUFBYSxJQUFiO0FBQUEsSUFDQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGVBQTNCLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QyxFQURRO0lBQUEsQ0FEVjtBQUFBLElBSUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxHQUFBOztRQUNKLElBQUMsQ0FBQSxjQUFtQixJQUFBLFdBQUEsQ0FBWSxLQUFLLENBQUMsZ0JBQWxCO09BQXBCO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixDQUFBLENBQUg7ZUFDRSxJ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
//# sourceURL=/Users/ssun/.atom/packages/git-grep/lib/git-grep.coffee