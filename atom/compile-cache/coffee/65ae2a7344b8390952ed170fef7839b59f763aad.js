(function() {
  var BufferedProcess, GitRepository, RepoListView, dir, getRepo, getRepoForCurrentFile, getSubmodule, gitAdd, gitCmd, gitDiff, gitRefresh, gitResetHead, gitStagedFiles, gitStatus, gitUnstagedFiles, gitUntrackedFiles, notifier, relativize, _getGitPath, _prettify, _prettifyDiff, _prettifyUntracked, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, GitRepository = _ref.GitRepository;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitCmd = function(_arg) {
    var args, c_stdout, command, cwd, error, exit, options, stderr, stdout, _ref1;
    _ref1 = _arg != null ? _arg : {}, args = _ref1.args, cwd = _ref1.cwd, options = _ref1.options, stdout = _ref1.stdout, stderr = _ref1.stderr, exit = _ref1.exit;
    command = _getGitPath();
    if (options == null) {
      options = {};
    }
    if (options.cwd == null) {
      options.cwd = cwd;
    }
    if (stderr == null) {
      stderr = function(data) {
        return notifier.addError(data.toString());
      };
    }
    if ((stdout != null) && (exit == null)) {
      c_stdout = stdout;
      stdout = function(data) {
        if (this.save == null) {
          this.save = '';
        }
        return this.save += data;
      };
      exit = function(exit) {
        c_stdout(this.save != null ? this.save : this.save = '');
        return this.save = null;
      };
    }
    try {
      return new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    } catch (_error) {
      error = _error;
      return notifier.addError('Git Plus is unable to locate git command. Please ensure process.env.PATH can access git.');
    }
  };

  gitStatus = function(repo, stdout) {
    return gitCmd({
      args: ['status', '--porcelain', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(data.length > 2 ? data.split('\0') : []);
      }
    });
  };

  gitStagedFiles = function(repo, stdout) {
    var files;
    files = [];
    return gitCmd({
      args: ['diff-index', '--cached', 'HEAD', '--name-status', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return files = _prettify(data);
      },
      stderr: function(data) {
        if (data.toString().includes("ambiguous argument 'HEAD'")) {
          return files = [1];
        } else {
          notifier.addError(data.toString());
          return files = [];
        }
      },
      exit: function(code) {
        return stdout(files);
      }
    });
  };

  gitUnstagedFiles = function(repo, _arg, stdout) {
    var showUntracked;
    showUntracked = (_arg != null ? _arg : {}).showUntracked;
    return gitCmd({
      args: ['diff-files', '--name-status', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data), stdout);
        } else {
          return stdout(_prettify(data));
        }
      }
    });
  };

  gitUntrackedFiles = function(repo, dataUnstaged, stdout) {
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    return gitCmd({
      args: ['ls-files', '-o', '--exclude-standard', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(dataUnstaged.concat(_prettifyUntracked(data)));
      }
    });
  };

  gitDiff = function(repo, path, stdout) {
    return gitCmd({
      args: ['diff', '-p', '-U1', path],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(_prettifyDiff(data));
      }
    });
  };

  gitRefresh = function() {
    atom.project.getRepositories().forEach(function(r) {
      return r != null ? r.refreshStatus() : void 0;
    });
    return gitCmd({
      args: ['add', '--refresh', '--', '.'],
      stderr: function(data) {}
    });
  };

  gitAdd = function(repo, _arg) {
    var exit, file, stderr, stdout, _ref1;
    _ref1 = _arg != null ? _arg : {}, file = _ref1.file, stdout = _ref1.stdout, stderr = _ref1.stderr, exit = _ref1.exit;
    if (exit == null) {
      exit = function(code) {
        if (code === 0) {
          return notifier.addSuccess("Added " + (file != null ? file : 'all files'));
        }
      };
    }
    return gitCmd({
      args: ['add', '--all', file != null ? file : '.'],
      cwd: repo.getWorkingDirectory(),
      stdout: stdout != null ? stdout : void 0,
      stderr: stderr != null ? stderr : void 0,
      exit: exit
    });
  };

  gitResetHead = function(repo) {
    return gitCmd({
      args: ['reset', 'HEAD'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return notifier.addSuccess('All changes unstaged');
      }
    });
  };

  _getGitPath = function() {
    var p, _ref1;
    p = (_ref1 = atom.config.get('git-plus.gitPath')) != null ? _ref1 : 'git';
    console.log("Git-plus: Using git at", p);
    return p;
  };

  _prettify = function(data) {
    var files, i, mode;
    data = data.split('\0').slice(0, -1);
    return files = (function() {
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
    var file, files;
    if (data == null) {
      return [];
    }
    data = data.split('\0').slice(0, -1);
    return files = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        file = data[_i];
        _results.push({
          mode: '?',
          path: file
        });
      }
      return _results;
    })();
  };

  _prettifyDiff = function(data) {
    var line, _ref1;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref1 = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        line = _ref2[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref1;
    return data;
  };

  dir = function(andSubmodules) {
    if (andSubmodules == null) {
      andSubmodules = true;
    }
    return new Promise(function(resolve, reject) {
      var submodule;
      if (andSubmodules && (submodule = getSubmodule())) {
        return resolve(submodule.getWorkingDirectory());
      } else {
        return getRepo().then(function(repo) {
          return resolve(repo.getWorkingDirectory());
        });
      }
    });
  };

  relativize = function(path) {
    var _ref1, _ref2, _ref3, _ref4;
    return (_ref1 = (_ref2 = (_ref3 = getSubmodule(path)) != null ? _ref3.relativize(path) : void 0) != null ? _ref2 : (_ref4 = atom.project.getRepositories()[0]) != null ? _ref4.relativize(path) : void 0) != null ? _ref1 : path;
  };

  getSubmodule = function(path) {
    var repo, submodule, _ref1, _ref2;
    if (path == null) {
      path = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
    }
    repo = GitRepository.open((_ref2 = atom.workspace.getActiveTextEditor()) != null ? _ref2.getPath() : void 0, {
      refreshOnWindowFocus: false
    });
    submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
    if (repo != null) {
      if (typeof repo.destroy === "function") {
        repo.destroy();
      }
    }
    return submodule;
  };

  getRepo = function() {
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
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, _ref1;
      project = atom.project;
      path = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
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

  module.exports.cmd = gitCmd;

  module.exports.stagedFiles = gitStagedFiles;

  module.exports.unstagedFiles = gitUnstagedFiles;

  module.exports.diff = gitDiff;

  module.exports.refresh = gitRefresh;

  module.exports.status = gitStatus;

  module.exports.reset = gitResetHead;

  module.exports.add = gitAdd;

  module.exports.dir = dir;

  module.exports.relativize = relativize;

  module.exports.getSubmodule = getSubmodule;

  module.exports.getRepo = getRepo;

}).call(this);
