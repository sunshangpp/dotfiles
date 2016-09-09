(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, dir, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile, splitPane,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
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

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1)
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(_arg) {
      var mode, path;
      mode = _arg.mode, path = _arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "removed:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(_arg) {
      var path;
      path = _arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var _ref;
      return (_ref = p.path, __indexOf.call(currentPaths, _ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var lines, message, prevChangedFiles;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '';
    });
    message = [];
    prevChangedFiles = [];
    lines.forEach(function(line) {
      if (!/(([ MADRCU?!])\s(.*))/.test(line)) {
        return message.push(line);
      } else {
        return prevChangedFiles.push(line.replace(/[ MADRCU?!](\s)(\s)*/, line[0]));
      }
    });
    return [message.join('\n'), prevChangedFiles];
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = "" + (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(_arg) {
    var filePath, message, prevChangedFiles, status;
    message = _arg.message, prevChangedFiles = _arg.prevChangedFiles, status = _arg.status, filePath = _arg.filePath;
    return git.getConfig('core.commentchar', Path.dirname(filePath)).then(function(commentchar) {
      commentchar = commentchar.length > 0 ? commentchar.trim() : '#';
      status = cleanupUnstagedText(status);
      status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentchar + " ").replace("committed:\n" + commentchar, "committed:\n" + (prevChangedFiles.map(function(f) {
        return "" + commentchar + "   " + f;
      }).join("\n")));
      return fs.writeFileSync(filePath, "" + message + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
    });
  };

  showFile = function(filePath) {
    return atom.workspace.open(filePath, {
      searchAllPanes: true
    }).then(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return textEditor;
      }
    });
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.alive) {
      currentPane.activate();
    }
    disposables.dispose();
    try {
      return fs.unlinkSync(filePath);
    } catch (_error) {}
  };

  module.exports = function(repo) {
    var currentPane, cwd, filePath;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg[0], prevChangedFiles = _arg[1];
      return getStagedFiles(repo).then(function(files) {
        return [message, prettifyFileStatuses(diffFiles(prevChangedFiles, files))];
      });
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg[0], prevChangedFiles = _arg[1];
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(dir(repo), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LWFtZW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwUUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBTFosQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBUGQsQ0FBQTs7QUFBQSxFQVNBLG1CQUFBLEdBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLFFBQUEsT0FBQTtBQUFBLElBQUEsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEVBQVAsQ0FBQTtLQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCLGFBRHhCLENBQUE7OztBQUVLO1dBQUEsc0RBQUE7dUJBQUE7QUFDSCxzQkFBQTtBQUFBLFVBQUMsTUFBQSxJQUFEO0FBQUEsVUFBTyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQWxCO1VBQUEsQ0FERztBQUFBOztTQUhlO0VBQUEsQ0FUdEIsQ0FBQTs7QUFBQSxFQWVBLHFCQUFBLEdBQXdCLFNBQUMsSUFBRCxHQUFBO1dBQ3RCO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBWDtBQUFBLE1BQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixDQUROO01BRHNCO0VBQUEsQ0FmeEIsQ0FBQTs7QUFBQSxFQW1CQSxvQkFBQSxHQUF1QixTQUFDLEtBQUQsR0FBQTtXQUNyQixLQUFLLENBQUMsR0FBTixDQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsVUFBQSxVQUFBO0FBQUEsTUFEVSxZQUFBLE1BQU0sWUFBQSxJQUNoQixDQUFBO0FBQUEsY0FBTyxJQUFQO0FBQUEsYUFDTyxHQURQO2lCQUVLLGNBQUEsR0FBYyxLQUZuQjtBQUFBLGFBR08sR0FIUDtpQkFJSyxjQUFBLEdBQWMsS0FKbkI7QUFBQSxhQUtPLEdBTFA7aUJBTUssYUFBQSxHQUFhLEtBTmxCO0FBQUEsYUFPTyxHQVBQO2lCQVFLLGFBQUEsR0FBYSxLQVJsQjtBQUFBLE9BRFE7SUFBQSxDQUFWLEVBRHFCO0VBQUEsQ0FuQnZCLENBQUE7O0FBQUEsRUErQkEsY0FBQSxHQUFpQixTQUFDLElBQUQsR0FBQTtXQUNmLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxLQUFELEdBQUE7QUFDekIsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLElBQWdCLENBQW5CO0FBQ0UsUUFBQSxJQUFBLEdBQU8sQ0FBQyxZQUFELEVBQWUsVUFBZixFQUEyQixNQUEzQixFQUFtQyxlQUFuQyxFQUFvRCxJQUFwRCxDQUFQLENBQUE7ZUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2lCQUFVLG1CQUFBLENBQW9CLElBQXBCLEVBQVY7UUFBQSxDQUROLEVBRkY7T0FBQSxNQUFBO2VBS0UsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsRUFBaEIsRUFMRjtPQUR5QjtJQUFBLENBQTNCLEVBRGU7RUFBQSxDQS9CakIsQ0FBQTs7QUFBQSxFQXdDQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7V0FDYixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxDQUFSLEVBQW9CO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFwQixFQURhO0VBQUEsQ0F4Q2YsQ0FBQTs7QUFBQSxFQTJDQSxTQUFBLEdBQVksU0FBQyxhQUFELEVBQWdCLFlBQWhCLEdBQUE7QUFDVixRQUFBLFlBQUE7QUFBQSxJQUFBLGFBQUEsR0FBZ0IsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsU0FBQyxDQUFELEdBQUE7YUFBTyxxQkFBQSxDQUFzQixDQUF0QixFQUFQO0lBQUEsQ0FBbEIsQ0FBaEIsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFlLFlBQVksQ0FBQyxHQUFiLENBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQVksVUFBQSxJQUFBO0FBQUEsTUFBVixPQUFELEtBQUMsSUFBVSxDQUFBO2FBQUEsS0FBWjtJQUFBLENBQWpCLENBRGYsQ0FBQTtXQUVBLGFBQWEsQ0FBQyxNQUFkLENBQXFCLFNBQUMsQ0FBRCxHQUFBO0FBQU8sVUFBQSxJQUFBO2FBQUEsUUFBQSxDQUFDLENBQUMsSUFBRixFQUFBLGVBQVUsWUFBVixFQUFBLElBQUEsTUFBQSxDQUFBLEtBQTBCLE1BQWpDO0lBQUEsQ0FBckIsRUFIVTtFQUFBLENBM0NaLENBQUE7O0FBQUEsRUFnREEsS0FBQSxHQUFRLFNBQUMsVUFBRCxHQUFBO0FBQ04sUUFBQSxnQ0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLENBQXNCLENBQUMsTUFBdkIsQ0FBOEIsU0FBQyxJQUFELEdBQUE7YUFBVSxJQUFBLEtBQVUsR0FBcEI7SUFBQSxDQUE5QixDQUFSLENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBVSxFQURWLENBQUE7QUFBQSxJQUVBLGdCQUFBLEdBQW1CLEVBRm5CLENBQUE7QUFBQSxJQUdBLEtBQUssQ0FBQyxPQUFOLENBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixNQUFBLElBQUEsQ0FBQSx1QkFBOEIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QixDQUFQO2VBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLEVBREY7T0FBQSxNQUFBO2VBR0UsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxzQkFBYixFQUFxQyxJQUFLLENBQUEsQ0FBQSxDQUExQyxDQUF0QixFQUhGO09BRFk7SUFBQSxDQUFkLENBSEEsQ0FBQTtXQVFBLENBQUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQUQsRUFBcUIsZ0JBQXJCLEVBVE07RUFBQSxDQWhEUixDQUFBOztBQUFBLEVBMkRBLG1CQUFBLEdBQXNCLFNBQUMsTUFBRCxHQUFBO0FBQ3BCLFFBQUEsbUJBQUE7QUFBQSxJQUFBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnQ0FBZixDQUFoQixDQUFBO0FBQ0EsSUFBQSxJQUFHLGFBQUEsSUFBaUIsQ0FBcEI7QUFDRSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsU0FBUCxDQUFpQixhQUFqQixDQUFQLENBQUE7YUFDQSxNQUFBLEdBQVMsRUFBQSxHQUFFLENBQUMsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsQ0FBakIsRUFBb0IsYUFBQSxHQUFnQixDQUFwQyxDQUFELENBQUYsR0FBMEMsSUFBMUMsR0FBNkMsQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFhLGNBQWIsRUFBNkIsRUFBN0IsQ0FBRCxFQUZ4RDtLQUFBLE1BQUE7YUFJRSxPQUpGO0tBRm9CO0VBQUEsQ0EzRHRCLENBQUE7O0FBQUEsRUFtRUEsUUFBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsUUFBQSwyQ0FBQTtBQUFBLElBRFcsZUFBQSxTQUFTLHdCQUFBLGtCQUFrQixjQUFBLFFBQVEsZ0JBQUEsUUFDOUMsQ0FBQTtXQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsa0JBQWQsRUFBa0MsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQWxDLENBQXlELENBQUMsSUFBMUQsQ0FBK0QsU0FBQyxXQUFELEdBQUE7QUFDN0QsTUFBQSxXQUFBLEdBQWlCLFdBQVcsQ0FBQyxNQUFaLEdBQXFCLENBQXhCLEdBQStCLFdBQVcsQ0FBQyxJQUFaLENBQUEsQ0FBL0IsR0FBdUQsR0FBckUsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLG1CQUFBLENBQW9CLE1BQXBCLENBRFQsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQWUsY0FBZixFQUErQixJQUEvQixDQUNULENBQUMsT0FEUSxDQUNBLEtBREEsRUFDUSxJQUFBLEdBQUksV0FBSixHQUFnQixHQUR4QixDQUVULENBQUMsT0FGUSxDQUVDLGNBQUEsR0FBYyxXQUZmLEVBRWlDLGNBQUEsR0FDN0MsQ0FDQyxnQkFBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLENBQUQsR0FBQTtlQUFPLEVBQUEsR0FBRyxXQUFILEdBQWUsS0FBZixHQUFvQixFQUEzQjtNQUFBLENBQXJCLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsSUFBMUQsQ0FERCxDQUhZLENBRlQsQ0FBQTthQVFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQ0UsRUFBQSxHQUFLLE9BQUwsR0FBYSxJQUFiLEdBQ0osV0FESSxHQUNRLHFFQURSLEdBQzRFLFdBRDVFLEdBRUUsU0FGRixHQUVXLFdBRlgsR0FFdUIsOERBRnZCLEdBRW9GLFdBRnBGLEdBR0osSUFISSxHQUdELFdBSEMsR0FHVyxHQUhYLEdBR2MsTUFKaEIsRUFUNkQ7SUFBQSxDQUEvRCxFQURTO0VBQUEsQ0FuRVgsQ0FBQTs7QUFBQSxFQW9GQSxRQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7V0FDVCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFBOEI7QUFBQSxNQUFBLGNBQUEsRUFBZ0IsSUFBaEI7S0FBOUIsQ0FBbUQsQ0FBQyxJQUFwRCxDQUF5RCxTQUFDLFVBQUQsR0FBQTtBQUN2RCxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFIO2VBQ0UsU0FBQSxDQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FBVixFQUFpRCxVQUFqRCxFQURGO09BQUEsTUFBQTtlQUdFLFdBSEY7T0FEdUQ7SUFBQSxDQUF6RCxFQURTO0VBQUEsQ0FwRlgsQ0FBQTs7QUFBQSxFQTJGQSxtQkFBQSxHQUFzQixTQUFBLEdBQUE7QUFDcEIsUUFBQSxJQUFBO2lEQUFjLENBQUUsUUFBaEIsQ0FBQSxDQUEwQixDQUFDLElBQTNCLENBQWdDLFNBQUMsSUFBRCxHQUFBO2FBQzlCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLElBQWhCLENBQXFCLFNBQUMsUUFBRCxHQUFBO0FBQ25CLFlBQUEsS0FBQTtBQUFBLFFBQUEsMEdBQXNCLENBQUUsUUFBckIsQ0FBOEIsZ0JBQTlCLDRCQUFIO0FBQ0UsVUFBQSxJQUFHLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQWhCLEtBQTBCLENBQTdCO0FBQ0UsWUFBQSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQUEsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLFFBQVEsQ0FBQyxPQUFULENBQUEsQ0FBQSxDQUhGO1dBQUE7QUFJQSxpQkFBTyxJQUFQLENBTEY7U0FEbUI7TUFBQSxDQUFyQixFQUQ4QjtJQUFBLENBQWhDLFdBRG9CO0VBQUEsQ0EzRnRCLENBQUE7O0FBQUEsRUFxR0EsR0FBQSxHQUFNLFNBQUMsSUFBRCxHQUFBO1dBQVUsQ0FBQyxHQUFHLENBQUMsWUFBSixDQUFBLENBQUEsSUFBc0IsSUFBdkIsQ0FBNEIsQ0FBQyxtQkFBN0IsQ0FBQSxFQUFWO0VBQUEsQ0FyR04sQ0FBQTs7QUFBQSxFQXVHQSxNQUFBLEdBQVMsU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO0FBQ1AsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixpQkFBdEIsRUFBMEMsU0FBQSxHQUFTLFFBQW5ELENBQVAsQ0FBQTtXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO0FBQUEsTUFBQSxHQUFBLEVBQUssU0FBTDtLQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7QUFDSixNQUFBLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsbUJBQUEsQ0FBQSxDQURBLENBQUE7YUFFQSxHQUFHLENBQUMsT0FBSixDQUFBLEVBSEk7SUFBQSxDQUROLEVBRk87RUFBQSxDQXZHVCxDQUFBOztBQUFBLEVBK0dBLE9BQUEsR0FBVSxTQUFDLFdBQUQsRUFBYyxRQUFkLEdBQUE7QUFDUixJQUFBLElBQTBCLFdBQVcsQ0FBQyxLQUF0QztBQUFBLE1BQUEsV0FBVyxDQUFDLFFBQVosQ0FBQSxDQUFBLENBQUE7S0FBQTtBQUFBLElBQ0EsV0FBVyxDQUFDLE9BQVosQ0FBQSxDQURBLENBQUE7QUFFQTthQUFJLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxFQUFKO0tBQUEsa0JBSFE7RUFBQSxDQS9HVixDQUFBOztBQUFBLEVBb0hBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsUUFBQSwwQkFBQTtBQUFBLElBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQWQsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFWLEVBQTBCLGdCQUExQixDQURYLENBQUE7QUFBQSxJQUVBLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUZOLENBQUE7V0FHQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsYUFBRCxFQUFnQixJQUFoQixFQUFzQixlQUF0QixFQUF1QyxhQUF2QyxDQUFSLEVBQStEO0FBQUEsTUFBQyxLQUFBLEdBQUQ7S0FBL0QsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLEtBQUQsR0FBQTthQUFXLEtBQUEsQ0FBTSxLQUFOLEVBQVg7SUFBQSxDQUROLENBRUEsQ0FBQyxJQUZELENBRU0sU0FBQyxJQUFELEdBQUE7QUFDSixVQUFBLHlCQUFBO0FBQUEsTUFETSxtQkFBUywwQkFDZixDQUFBO2FBQUEsY0FBQSxDQUFlLElBQWYsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLEtBQUQsR0FBQTtlQUNKLENBQUMsT0FBRCxFQUFVLG9CQUFBLENBQXFCLFNBQUEsQ0FBVSxnQkFBVixFQUE0QixLQUE1QixDQUFyQixDQUFWLEVBREk7TUFBQSxDQUROLEVBREk7SUFBQSxDQUZOLENBTUEsQ0FBQyxJQU5ELENBTU0sU0FBQyxJQUFELEdBQUE7QUFDSixVQUFBLHlCQUFBO0FBQUEsTUFETSxtQkFBUywwQkFDZixDQUFBO2FBQUEsWUFBQSxDQUFhLElBQWIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQsR0FBQTtlQUFZLFFBQUEsQ0FBUztBQUFBLFVBQUMsU0FBQSxPQUFEO0FBQUEsVUFBVSxrQkFBQSxnQkFBVjtBQUFBLFVBQTRCLFFBQUEsTUFBNUI7QUFBQSxVQUFvQyxVQUFBLFFBQXBDO1NBQVQsRUFBWjtNQUFBLENBRE4sQ0FFQSxDQUFDLElBRkQsQ0FFTSxTQUFBLEdBQUE7ZUFBRyxRQUFBLENBQVMsUUFBVCxFQUFIO01BQUEsQ0FGTixFQURJO0lBQUEsQ0FOTixDQVVBLENBQUMsSUFWRCxDQVVNLFNBQUMsVUFBRCxHQUFBO0FBQ0osTUFBQSxXQUFXLENBQUMsR0FBWixDQUFnQixVQUFVLENBQUMsU0FBWCxDQUFxQixTQUFBLEdBQUE7ZUFBRyxNQUFBLENBQU8sR0FBQSxDQUFJLElBQUosQ0FBUCxFQUFrQixRQUFsQixFQUFIO01BQUEsQ0FBckIsQ0FBaEIsQ0FBQSxDQUFBO2FBQ0EsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsVUFBVSxDQUFDLFlBQVgsQ0FBd0IsU0FBQSxHQUFBO2VBQUcsT0FBQSxDQUFRLFdBQVIsRUFBcUIsUUFBckIsRUFBSDtNQUFBLENBQXhCLENBQWhCLEVBRkk7SUFBQSxDQVZOLENBYUEsQ0FBQyxPQUFELENBYkEsQ0FhTyxTQUFDLEdBQUQsR0FBQTthQUFTLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQVQ7SUFBQSxDQWJQLEVBSmU7RUFBQSxDQXBIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ssun/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
