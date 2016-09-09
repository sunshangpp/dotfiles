(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git.cmd(['stash', 'apply'], {
      cwd: cwd
    }).then(function(msg) {
      if (msg !== '') {
        return OutputViewManager.create().addLine(msg).finish();
      }
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtYXBwbHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FGcEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTixDQUFBO1dBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxPQUFWLENBQVIsRUFBNEI7QUFBQSxNQUFDLEtBQUEsR0FBRDtLQUE1QixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsR0FBRCxHQUFBO0FBQ0osTUFBQSxJQUFvRCxHQUFBLEtBQVMsRUFBN0Q7ZUFBQSxpQkFBaUIsQ0FBQyxNQUFsQixDQUFBLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsR0FBbkMsQ0FBdUMsQ0FBQyxNQUF4QyxDQUFBLEVBQUE7T0FESTtJQUFBLENBRE4sQ0FHQSxDQUFDLE9BQUQsQ0FIQSxDQUdPLFNBQUMsR0FBRCxHQUFBO2FBQ0wsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsRUFESztJQUFBLENBSFAsRUFGZTtFQUFBLENBSmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ssun/.atom/packages/git-plus/lib/models/git-stash-apply.coffee
