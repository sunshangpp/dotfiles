(function() {
  var BranchListView, DeleteBranchListView, git, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = DeleteBranchListView = (function(_super) {
    __extends(DeleteBranchListView, _super);

    function DeleteBranchListView() {
      return DeleteBranchListView.__super__.constructor.apply(this, arguments);
    }

    DeleteBranchListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      return DeleteBranchListView.__super__.initialize.apply(this, arguments);
    };

    DeleteBranchListView.prototype.confirmed = function(_arg) {
      var branch, name, remote;
      name = _arg.name;
      if (name.startsWith("*")) {
        name = name.slice(1);
      }
      if (name.indexOf('/') === -1) {
        this["delete"](name);
      } else {
        branch = name.substring(name.indexOf('/') + 1);
        remote = name.substring(0, name.indexOf('/'));
        this["delete"](branch, remote, true);
      }
      return this.cancel();
    };

    DeleteBranchListView.prototype["delete"] = function(branch, remote, isRemote) {
      if (branch == null) {
        branch = '';
      }
      if (remote == null) {
        remote = '';
      }
      if (isRemote == null) {
        isRemote = false;
      }
      if (!isRemote) {
        return git.cmd({
          args: ['branch', '-D', branch],
          cwd: this.repo.getWorkingDirectory(),
          stdout: function(data) {
            return notifier.addSuccess(data.toString());
          }
        });
      } else {
        return git.cmd({
          args: ['push', remote, '--delete', branch],
          cwd: this.repo.getWorkingDirectory(),
          stderr: function(data) {
            return notifier.addSuccess(data.toString());
          }
        });
      }
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);
