(function() {
  var CompositeDisposable, GitCommit, GitPush, Path, fs, git, notifier, os;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('path');

  os = require('os');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  module.exports = GitCommit = (function() {
    GitCommit.prototype.setCommentChar = function(char) {
      if (char === '') {
        char = '#';
      }
      return this.commentchar = char;
    };

    GitCommit.prototype.dir = function() {
      if (this.submodule != null ? this.submodule : this.submodule = git.getSubmodule()) {
        return this.submodule.getWorkingDirectory();
      } else {
        return this.repo.getWorkingDirectory();
      }
    };

    GitCommit.prototype.filePath = function() {
      return Path.join(this.dir(), 'COMMIT_EDITMSG');
    };

    function GitCommit(repo, _arg) {
      var _ref;
      this.repo = repo;
      _ref = _arg != null ? _arg : {}, this.amend = _ref.amend, this.andPush = _ref.andPush;
      this.currentPane = atom.workspace.getActivePane();
      this.disposables = new CompositeDisposable;
      if (this.amend == null) {
        this.amend = '';
      }
      this.isAmending = this.amend.length > 0;
      git.cmd({
        args: ['config', '--get', 'core.commentchar'],
        stdout: (function(_this) {
          return function(data) {
            return _this.setCommentChar(data.trim());
          };
        })(this),
        stderr: (function(_this) {
          return function() {
            return _this.setCommentChar('#');
          };
        })(this)
      });
      git.stagedFiles(this.repo, (function(_this) {
        return function(files) {
          if (_this.amend !== '' || files.length >= 1) {
            return git.cmd({
              args: ['status'],
              cwd: _this.repo.getWorkingDirectory(),
              stdout: function(data) {
                return _this.prepFile(data);
              }
            });
          } else {
            _this.cleanup();
            return notifier.addInfo('Nothing to commit.');
          }
        };
      })(this));
    }

    GitCommit.prototype.prepFile = function(status) {
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + this.commentchar + " ");
      fs.writeFileSync(this.filePath(), "" + this.amend + "\n" + this.commentchar + " Please enter the commit message for your changes. Lines starting\n" + this.commentchar + " with '" + this.commentchar + "' will be ignored, and an empty message aborts the commit.\n" + this.commentchar + "\n" + this.commentchar + " " + status);
      return this.showFile();
    };

    GitCommit.prototype.showFile = function() {
      return atom.workspace.open(this.filePath(), {
        searchAllPanes: true
      }).done((function(_this) {
        return function(textEditor) {
          if (atom.config.get('git-plus.openInPane')) {
            return _this.splitPane(atom.config.get('git-plus.splitPane'), textEditor);
          } else {
            _this.disposables.add(textEditor.onDidSave(function() {
              return _this.commit();
            }));
            return _this.disposables.add(textEditor.onDidDestroy(function() {
              if (_this.isAmending) {
                return _this.undoAmend();
              } else {
                return _this.cleanup();
              }
            }));
          }
        };
      })(this));
    };

    GitCommit.prototype.splitPane = function(splitDir, oldEditor) {
      var directions, hookEvents, options, pane;
      pane = atom.workspace.paneForURI(this.filePath());
      options = {
        copyActiveItem: true
      };
      hookEvents = (function(_this) {
        return function(textEditor) {
          oldEditor.destroy();
          _this.disposables.add(textEditor.onDidSave(function() {
            return _this.commit();
          }));
          return _this.disposables.add(textEditor.onDidDestroy(function() {
            if (_this.isAmending) {
              return _this.undoAmend();
            } else {
              return _this.cleanup();
            }
          }));
        };
      })(this);
      directions = {
        left: (function(_this) {
          return function() {
            pane = pane.splitLeft(options);
            return hookEvents(pane.getActiveEditor());
          };
        })(this),
        right: function() {
          pane = pane.splitRight(options);
          return hookEvents(pane.getActiveEditor());
        },
        up: function() {
          pane = pane.splitUp(options);
          return hookEvents(pane.getActiveEditor());
        },
        down: function() {
          pane = pane.splitDown(options);
          return hookEvents(pane.getActiveEditor());
        }
      };
      return directions[splitDir]();
    };

    GitCommit.prototype.commit = function() {
      var args;
      args = ['commit', '--cleanup=strip', "--file=" + (this.filePath())];
      return git.cmd({
        args: args,
        options: {
          cwd: this.dir()
        },
        stdout: (function(_this) {
          return function(data) {
            notifier.addSuccess(data);
            if (_this.andPush) {
              new GitPush(_this.repo);
            }
            _this.isAmending = false;
            _this.destroyActiveEditorView();
            if (_this.currentPane.alive) {
              _this.currentPane.activate();
            }
            return git.refresh();
          };
        })(this),
        stderr: (function(_this) {
          return function(err) {
            return _this.destroyActiveEditorView();
          };
        })(this)
      });
    };

    GitCommit.prototype.destroyActiveEditorView = function() {
      if (atom.workspace.getActivePane().getItems().length > 1) {
        return atom.workspace.destroyActivePaneItem();
      } else {
        return atom.workspace.destroyActivePane();
      }
    };

    GitCommit.prototype.undoAmend = function(err) {
      if (err == null) {
        err = '';
      }
      return git.cmd({
        args: ['reset', 'ORIG_HEAD'],
        stdout: function() {
          return notifier.addError("" + (err + ': ') + "Commit amend aborted!");
        },
        stderr: function() {
          return notifier.addError('ERROR! Undoing the amend failed! Please fix your repository manually!');
        },
        exit: (function(_this) {
          return function() {
            _this.isAmending = false;
            _this.destroyActiveEditorView();
            return _this.cleanup();
          };
        })(this)
      });
    };

    GitCommit.prototype.cleanup = function() {
      if (this.currentPane.alive) {
        this.currentPane.activate();
      }
      this.disposables.dispose();
      try {
        return fs.unlinkSync(this.filePath());
      } catch (_error) {}
    };

    return GitCommit;

  })();

}).call(this);
