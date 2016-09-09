(function() {
  var $$, BufferedProcess, ListView, OutputViewManager, PullBranchListView, SelectListView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  PullBranchListView = require('./pull-branch-list-view');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data, _arg) {
      var _ref1;
      this.repo = repo;
      this.data = data;
      _ref1 = _arg != null ? _arg : {}, this.mode = _ref1.mode, this.tag = _ref1.tag, this.extraArgs = _ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(_arg) {
      var name;
      name = _arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      if (this.mode === 'pull') {
        if (name === this.currentBranchString) {
          this.execute();
        } else {
          git.cmd(['branch', '-r'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new PullBranchListView(_this.repo, data, name, _this.extraArgs, _this.resolve);
            };
          })(this));
        }
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs) {
      var args, command, message, startMessage, view, _ref1;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      view = OutputViewManager["new"]();
      args = [this.mode];
      if (extraArgs.length > 0) {
        args.push(extraArgs);
      }
      args = args.concat([remote, this.tag]).filter(function(arg) {
        return arg !== '';
      });
      command = (_ref1 = atom.config.get('git-plus.gitPath')) != null ? _ref1 : 'git';
      message = "" + (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return new BufferedProcess({
        command: command,
        args: args,
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
            if (code === 128) {
              view.reset();
              return new BufferedProcess({
                command: command,
                args: [_this.mode, '-u', remote, 'HEAD'],
                options: {
                  cwd: _this.repo.getWorkingDirectory()
                },
                stdout: function(data) {
                  return view.addLine(data.toString());
                },
                stderr: function(data) {
                  return view.addLine(data.toString());
                },
                exit: function(code) {
                  view.finish();
                  return startMessage.dismiss();
                }
              });
            } else {
              view.finish();
              return startMessage.dismiss();
            }
          };
        })(this)
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FETCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FMcEIsQ0FBQTs7QUFBQSxFQU1BLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx5QkFBUixDQU5yQixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxFQUFlLElBQWYsR0FBQTtBQUNWLFVBQUEsS0FBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE9BQUEsSUFDbkIsQ0FBQTtBQUFBLDZCQUR5QixPQUEwQixJQUF6QixJQUFDLENBQUEsYUFBQSxNQUFNLElBQUMsQ0FBQSxZQUFBLEtBQUssSUFBQyxDQUFBLGtCQUFBLFNBQ3hDLENBQUE7QUFBQSxNQUFBLDBDQUFBLFNBQUEsQ0FBQSxDQUFBOztRQUNBLElBQUMsQ0FBQSxNQUFPO09BRFI7O1FBRUEsSUFBQyxDQUFBLFlBQWE7T0FGZDtB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

//# sourceURL=/Users/ssun/.atom/packages/git-plus/lib/views/remote-list-view.coffee
