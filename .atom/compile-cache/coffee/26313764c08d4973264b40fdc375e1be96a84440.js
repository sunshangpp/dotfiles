(function() {
  var StatusView, git, gitStashDrop;

  git = require('../git');

  StatusView = require('../views/status-view');

  gitStashDrop = function() {
    return git.cmd({
      args: ['stash', 'drop'],
      stdout: function(data) {
        return new StatusView({
          type: 'success',
          message: data
        });
      }
    });
  };

  module.exports = gitStashDrop;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLFNBQUEsR0FBQTtXQUNiLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQU47QUFBQSxNQUNBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUFjLElBQUEsVUFBQSxDQUFXO0FBQUEsVUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFVBQWlCLE9BQUEsRUFBUyxJQUExQjtTQUFYLEVBQWQ7TUFBQSxDQURSO0tBREYsRUFEYTtFQUFBLENBSGYsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBUmpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ssun/.atom/packages/git-plus/lib/models/git-stash-drop.coffee