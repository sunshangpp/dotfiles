(function() {
  var BranchListView, BufferedProcess, OutputViewManager, PullBranchListView, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = PullBranchListView = (function(_super) {
    __extends(PullBranchListView, _super);

    function PullBranchListView() {
      return PullBranchListView.__super__.constructor.apply(this, arguments);
    }

    PullBranchListView.prototype.initialize = function(repo, data, remote, extraArgs, resolve) {
      this.repo = repo;
      this.data = data;
      this.remote = remote;
      this.extraArgs = extraArgs;
      this.resolve = resolve;
      return PullBranchListView.__super__.initialize.apply(this, arguments);
    };

    PullBranchListView.prototype.parseData = function() {
      var branches, currentBranch, items;
      this.currentBranchString = '== Current ==';
      currentBranch = {
        name: this.currentBranchString
      };
      items = this.data.split("\n");
      branches = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item.replace(/\s/g, '')
        };
      });
      if (branches.length === 1) {
        this.pull(branches[0]);
      } else {
        this.setItems([currentBranch].concat(branches));
      }
      return this.focusFilterEditor();
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      if (name === this.currentBranchString) {
        this.pull();
      } else {
        this.pull(name.substring(name.indexOf('/') + 1));
      }
      return this.cancel();
    };

    PullBranchListView.prototype.pull = function(remoteBranch) {
      var startMessage, view, _ref;
      if (remoteBranch == null) {
        remoteBranch = '';
      }
      view = OutputViewManager["new"]();
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      return new BufferedProcess({
        command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
        args: ['pull'].concat(this.extraArgs, this.remote, remoteBranch).filter(function(arg) {
          return arg !== '';
        }),
        options: {
          cwd: this.repo.getWorkingDirectory()
        },
        stdout: function(data) {
          return view.addLine(data.toString());
        },
        stderr: function(data) {
          return view.addLine(data.toString());
        },
        exit: (function(_this) {
          return function(code) {
            _this.resolve();
            view.finish();
            return startMessage.dismiss();
          };
        })(this)
      });
    };

    return PullBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3B1bGwtYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUhqQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FHUTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxFQUFnQixNQUFoQixFQUF5QixTQUF6QixFQUFxQyxPQUFyQyxHQUFBO0FBQWlELE1BQWhELElBQUMsQ0FBQSxPQUFBLElBQStDLENBQUE7QUFBQSxNQUF6QyxJQUFDLENBQUEsT0FBQSxJQUF3QyxDQUFBO0FBQUEsTUFBbEMsSUFBQyxDQUFBLFNBQUEsTUFBaUMsQ0FBQTtBQUFBLE1BQXpCLElBQUMsQ0FBQSxZQUFBLFNBQXdCLENBQUE7QUFBQSxNQUFiLElBQUMsQ0FBQSxVQUFBLE9BQVksQ0FBQTthQUFBLG9EQUFBLFNBQUEsRUFBakQ7SUFBQSxDQUFaLENBQUE7O0FBQUEsaUNBRUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsOEJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixlQUF2QixDQUFBO0FBQUEsTUFDQSxhQUFBLEdBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxJ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

//# sourceURL=/Users/ssun/.atom/packages/git-plus/lib/views/pull-branch-list-view.coffee
