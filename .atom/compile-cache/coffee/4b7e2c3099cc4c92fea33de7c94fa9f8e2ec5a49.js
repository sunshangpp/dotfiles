(function() {
  var BufferedProcess, Path, RepoListView, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  Path = require('flavored-path');

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, _ref;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, _ref;
      project = atom.project;
      path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options) {
      if (options == null) {
        options = {
          env: process.env
        };
      }
      return new Promise(function(resolve, reject) {
        var output, _ref;
        output = '';
        try {
          return new BufferedProcess({
            command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
            args: args,
            options: options,
            stdout: function(data) {
              return output += data.toString();
            },
            stderr: function(data) {
              return output += data.toString();
            },
            exit: function(code) {
              if (code === 0) {
                return resolve(output);
              } else {
                return reject(output);
              }
            }
          });
        } catch (_error) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        }
      });
    },
    getConfig: function(setting, workingDirectory) {
      if (workingDirectory == null) {
        workingDirectory = null;
      }
      if (workingDirectory == null) {
        workingDirectory = Path.get('~');
      }
      return git.cmd(['config', '--get', setting], {
        cwd: workingDirectory
      })["catch"](function(error) {
        if ((error != null) && error !== '') {
          return notifier.addError(error);
        } else {
          return '';
        }
      });
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0');
        } else {
          return [];
        }
      });
    },
    refresh: function() {
      return atom.project.getRepositories().forEach(function(repo) {
        if (repo != null) {
          repo.refreshStatus();
          return git.cmd(['add', '--refresh', '--', '.'], {
            cwd: repo.getWorkingDirectory()
          });
        }
      });
    },
    relativize: function(path) {
      var _ref, _ref1, _ref2, _ref3;
      return (_ref = (_ref1 = (_ref2 = git.getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepositories()[0]) != null ? _ref3.relativize(path) : void 0) != null ? _ref : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo, stdout) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data);
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, _arg) {
      var args, showUntracked;
      showUntracked = (_arg != null ? _arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data));
        } else {
          return _prettify(data);
        }
      });
    },
    add: function(repo, _arg) {
      var args, file, update, _ref;
      _ref = _arg != null ? _arg : {}, file = _ref.file, update = _ref.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        if (output !== false) {
          notifier.addSuccess("Added " + (file != null ? file : 'all files'));
          return true;
        }
      });
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getSubmodule: function(path) {
      var _ref, _ref1, _ref2;
      if (path == null) {
        path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      }
      return (_ref1 = atom.project.getRepositories().filter(function(r) {
        var _ref2;
        return r != null ? (_ref2 = r.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (_ref2 = _ref1.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMElBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVIsQ0FIZixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSlgsQ0FBQTs7QUFBQSxFQU1BLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFlBQVAsR0FBQTtBQUNsQixRQUFBLElBQUE7O01BRHlCLGVBQWE7S0FDdEM7QUFBQSxJQUFBLElBQUEsR0FBTyxDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLG9CQUFuQixDQUFQLENBQUE7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2FBQ0osWUFBWSxDQUFDLE1BQWIsQ0FBb0Isa0JBQUEsQ0FBbUIsSUFBbkIsQ0FBcEIsRUFESTtJQUFBLENBRE4sRUFGa0I7RUFBQSxDQU5wQixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsUUFBQSxPQUFBO0FBQUEsSUFBQSxJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sRUFBUCxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFEeEIsQ0FBQTs7O0FBRUs7V0FB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

//# sourceURL=/Users/ssun/.atom/packages/git-plus/lib/git.coffee
