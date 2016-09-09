(function() {
  var GitCommit, Path, commentchar_config, commitFileContent, commitFilePath, commitPane, commitResolution, commitTemplate, currentPane, fs, git, notifier, pathToRepoFile, repo, setupMocks, status, templateFile, textEditor, workspace, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  _ref = require('../fixtures'), repo = _ref.repo, workspace = _ref.workspace, pathToRepoFile = _ref.pathToRepoFile, currentPane = _ref.currentPane, textEditor = _ref.textEditor, commitPane = _ref.commitPane;

  git = require('../../lib/git');

  GitCommit = require('../../lib/models/git-commit');

  notifier = require('../../lib/notifier');

  commitFilePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');

  status = {
    replace: function() {
      return status;
    },
    trim: function() {
      return status;
    }
  };

  commentchar_config = '';

  templateFile = '';

  commitTemplate = 'foobar';

  commitFileContent = {
    toString: function() {
      return commitFileContent;
    },
    indexOf: function() {
      return 5;
    },
    substring: function() {
      return 'commit message';
    },
    split: function(splitPoint) {
      if (splitPoint === '\n') {
        return ['commit message', '# comments to be deleted'];
      }
    }
  };

  commitResolution = Promise.resolve('commit success');

  setupMocks = function() {
    atom.config.set('git-plus.openInPane', false);
    spyOn(currentPane, 'activate');
    spyOn(commitPane, 'destroy').andCallThrough();
    spyOn(commitPane, 'splitRight');
    spyOn(atom.workspace, 'getActivePane').andReturn(currentPane);
    spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
    spyOn(atom.workspace, 'getPanes').andReturn([currentPane, commitPane]);
    spyOn(atom.workspace, 'paneForURI').andReturn(commitPane);
    spyOn(status, 'replace').andCallFake(function() {
      return status;
    });
    spyOn(status, 'trim').andCallThrough();
    spyOn(commitFileContent, 'substring').andCallThrough();
    spyOn(fs, 'readFileSync').andCallFake(function() {
      if (fs.readFileSync.mostRecentCall.args[0] === 'template') {
        return commitTemplate;
      } else {
        return commitFileContent;
      }
    });
    spyOn(fs, 'writeFileSync');
    spyOn(fs, 'writeFile');
    spyOn(fs, 'unlink');
    spyOn(git, 'refresh');
    spyOn(git, 'getConfig').andCallFake(function() {
      var arg;
      arg = git.getConfig.mostRecentCall.args[0];
      if (arg === 'commit.template') {
        return Promise.resolve(templateFile);
      } else if (arg === 'core.commentchar') {
        return Promise.resolve(commentchar_config);
      }
    });
    spyOn(git, 'cmd').andCallFake(function() {
      var args;
      args = git.cmd.mostRecentCall.args[0];
      if (args[0] === 'status') {
        return Promise.resolve(status);
      } else if (args[0] === 'commit') {
        return commitResolution;
      } else if (args[0] === 'diff') {
        return Promise.resolve('diff');
      }
    });
    spyOn(git, 'stagedFiles').andCallFake(function() {
      var args;
      args = git.stagedFiles.mostRecentCall.args;
      if (args[0].getWorkingDirectory() === repo.getWorkingDirectory()) {
        return Promise.resolve([pathToRepoFile]);
      }
    });
    spyOn(git, 'add').andCallFake(function() {
      var args;
      args = git.add.mostRecentCall.args;
      if (args[0].getWorkingDirectory() === repo.getWorkingDirectory() && args[1].update) {
        return Promise.resolve(true);
      }
    });
    spyOn(notifier, 'addError');
    spyOn(notifier, 'addInfo');
    return spyOn(notifier, 'addSuccess');
  };

  describe("GitCommit", function() {
    describe("a regular commit", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        commitResolution = Promise.resolve('commit success');
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      it("gets the current pane", function() {
        return expect(atom.workspace.getActivePane).toHaveBeenCalled();
      });
      it("gets the commentchar from configs", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('core.commentchar', Path.dirname(commitFilePath));
      });
      it("gets staged files", function() {
        return expect(git.cmd).toHaveBeenCalledWith(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      });
      it("removes lines with '(...)' from status", function() {
        return expect(status.replace).toHaveBeenCalled();
      });
      it("gets the commit template from git configs", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('commit.template', Path.dirname(commitFilePath));
      });
      it("writes to a file", function() {
        var argsTo_fsWriteFile;
        argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
        return expect(argsTo_fsWriteFile[0]).toEqual(commitFilePath);
      });
      it("shows the file", function() {
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      it("calls git.cmd with ['commit'...] on textEditor save", function() {
        textEditor.save();
        waitsFor(function() {
          return git.cmd.callCount > 1;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['commit', "--cleanup=strip", "--file=" + commitFilePath], {
            cwd: repo.getWorkingDirectory()
          });
        });
      });
      it("closes the commit pane when commit is successful", function() {
        textEditor.save();
        waitsFor(function() {
          return commitPane.destroy.callCount > 0;
        });
        return runs(function() {
          return expect(commitPane.destroy).toHaveBeenCalled();
        });
      });
      it("notifies of success when commit is successful", function() {
        textEditor.save();
        waitsFor(function() {
          return notifier.addSuccess.callCount > 0;
        });
        return runs(function() {
          return expect(notifier.addSuccess).toHaveBeenCalledWith('commit success');
        });
      });
      return it("cancels the commit on textEditor destroy", function() {
        textEditor.destroy();
        expect(currentPane.activate).toHaveBeenCalled();
        return expect(fs.unlink).toHaveBeenCalledWith(commitFilePath);
      });
    });
    describe("when core.commentchar config is not set", function() {
      return it("uses '#' in commit file", function() {
        setupMocks();
        return GitCommit(repo).then(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].trim().charAt(0)).toBe('#');
        });
      });
    });
    describe("when core.commentchar config is set to '$'", function() {
      return it("uses '$' as the commentchar", function() {
        commentchar_config = '$';
        setupMocks();
        return GitCommit(repo).then(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].trim().charAt(0)).toBe(commentchar_config);
        });
      });
    });
    describe("when commit.template config is not set", function() {
      return it("commit file starts with a blank line", function() {
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo).then(function() {
            var argsTo_fsWriteFile;
            argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
            return expect(argsTo_fsWriteFile[1].charAt(0)).toEqual("\n");
          });
        });
      });
    });
    describe("when commit.template config is set", function() {
      return it("commit file starts with content of that file", function() {
        templateFile = 'template';
        setupMocks();
        GitCommit(repo);
        waitsFor(function() {
          return fs.writeFileSync.callCount > 0;
        });
        return runs(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].indexOf(commitTemplate)).toBe(0);
        });
      });
    });
    describe("when 'stageChanges' option is true", function() {
      return it("calls git.add with update option set to true", function() {
        setupMocks();
        return GitCommit(repo, {
          stageChanges: true
        }).then(function() {
          return expect(git.add).toHaveBeenCalledWith(repo, {
            update: true
          });
        });
      });
    });
    describe("a failing commit", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        commitResolution = Promise.reject('commit error');
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      return it("notifies of error and doesn't close commit pane", function() {
        textEditor.save();
        waitsFor(function() {
          return notifier.addError.callCount > 0;
        });
        return runs(function() {
          expect(notifier.addError).toHaveBeenCalledWith('commit error');
          return expect(commitPane.destroy).not.toHaveBeenCalled();
        });
      });
    });
    return describe("when the verbose commit setting is true", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        atom.config.set("git-plus.experimental", true);
        atom.config.set("git-plus.verboseCommits", true);
        return setupMocks();
      });
      it("calls git.cmd with the --verbose flag", function() {
        waitsForPromise(function() {
          return GitCommit(repo);
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['diff', '--color=never', '--staged'], {
            cwd: repo.getWorkingDirectory()
          });
        });
      });
      return it("trims the commit file", function() {
        textEditor.save();
        waitsFor(function() {
          return commitFileContent.substring.callCount > 0;
        });
        return runs(function() {
          return expect(commitFileContent.substring).toHaveBeenCalledWith(0, commitFileContent.indexOf());
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWNvbW1pdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5T0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsT0FPSSxPQUFBLENBQVEsYUFBUixDQVBKLEVBQ0UsWUFBQSxJQURGLEVBRUUsaUJBQUEsU0FGRixFQUdFLHNCQUFBLGNBSEYsRUFJRSxtQkFBQSxXQUpGLEVBS0Usa0JBQUEsVUFMRixFQU1FLGtCQUFBLFVBVEYsQ0FBQTs7QUFBQSxFQVdBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQVhOLENBQUE7O0FBQUEsRUFZQSxTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSLENBWlosQ0FBQTs7QUFBQSxFQWFBLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVIsQ0FiWCxDQUFBOztBQUFBLEVBZUEsY0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBVixFQUEwQixnQkFBMUIsQ0FmakIsQ0FBQTs7QUFBQSxFQWdCQSxNQUFBLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FBVDtBQUFBLElBQ0EsSUFBQSxFQUFNLFNBQUEsR0FBQTthQUFHLE9BQUg7SUFBQSxDQUROO0dBakJGLENBQUE7O0FBQUEsRUFtQkEsa0JBQUEsR0FBcUIsRUFuQnJCLENBQUE7O0FBQUEsRUFvQkEsWUFBQSxHQUFlLEVBcEJmLENBQUE7O0FBQUEsRUFxQkEsY0FBQSxHQUFpQixRQXJCakIsQ0FBQTs7QUFBQSxFQXNCQSxpQkFBQSxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQUcsa0JBQUg7SUFBQSxDQUFWO0FBQUEsSUFDQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2FBQUcsRUFBSDtJQUFBLENBRFQ7QUFBQSxJQUVBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFBRyxpQkFBSDtJQUFBLENBRlg7QUFBQSxJQUdBLEtBQUEsRUFBTyxTQUFDLFVBQUQsR0FBQTtBQUFnQixNQUFBLElBQUcsVUFBQSxLQUFjLElBQWpCO2VBQTJCLENBQUMsZ0JBQUQsRUFBbUIsMEJBQW5CLEVBQTNCO09BQWhCO0lBQUEsQ0FIUDtHQXZCRixDQUFBOztBQUFBLEVBMkJBLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGdCQUFoQixDQTNCbkIsQ0FBQTs7QUFBQSxFQTZCQSxVQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLEVBQXVDLEtBQXZDLENBQUEsQ0FBQTtBQUFBLElBQ0EsS0FBQSxDQUFNLFdBQU4sRUFBbUIsVUFBbkIsQ0FEQSxDQUFBO0FBQUEsSUFFQSxLQUFBLENBQU0sVUFBTixFQUFrQixTQUFsQixDQUE0QixDQUFDLGNBQTdCLENBQUEsQ0FGQSxDQUFBO0FBQUEsSUFHQSxLQUFBLENBQU0sVUFBTixFQUFrQixZQUFsQixDQUhBLENBQUE7QUFBQSxJQUlBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixlQUF0QixDQUFzQyxDQUFDLFNBQXZDLENBQWlELFdBQWpELENBSkEsQ0FBQTtBQUFBLElBS0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLE1BQXRCLENBQTZCLENBQUMsU0FBOUIsQ0FBd0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsVUFBaEIsQ0FBeEMsQ0FMQSxDQUFBO0FBQUEsSUFNQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsVUFBdEIsQ0FBaUMsQ0FBQyxTQUFsQyxDQUE0QyxDQUFDLFdBQUQsRUFBYyxVQUFkLENBQTVDLENBTkEsQ0FBQTtBQUFBLElBT0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLFlBQXRCLENBQW1DLENBQUMsU0FBcEMsQ0FBOEMsVUFBOUMsQ0FQQSxDQUFBO0FBQUEsSUFRQSxLQUFBLENBQU0sTUFBTixFQUFjLFNBQWQsQ0FBd0IsQ0FBQyxXQUF6QixDQUFxQyxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FBckMsQ0FSQSxDQUFBO0FBQUEsSUFTQSxLQUFBLENBQU0sTUFBTixFQUFjLE1BQWQsQ0FBcUIsQ0FBQyxjQUF0QixDQUFBLENBVEEsQ0FBQTtBQUFBLElBVUEsS0FBQSxDQUFNLGlCQUFOLEVBQXlCLFdBQXpCLENBQXFDLENBQUMsY0FBdEMsQ0FBQSxDQVZBLENBQUE7QUFBQSxJQVdBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsY0FBVixDQUF5QixDQUFDLFdBQTFCLENBQXNDLFNBQUEsR0FBQTtBQUNwQyxNQUFBLElBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBcEMsS0FBMEMsVUFBN0M7ZUFDRSxlQURGO09BQUEsTUFBQTtlQUdFLGtCQUhGO09BRG9DO0lBQUEsQ0FBdEMsQ0FYQSxDQUFBO0FBQUEsSUFnQkEsS0FBQSxDQUFNLEVBQU4sRUFBVSxlQUFWLENBaEJBLENBQUE7QUFBQSxJQWlCQSxLQUFBLENBQU0sRUFBTixFQUFVLFdBQVYsQ0FqQkEsQ0FBQTtBQUFBLElBa0JBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsUUFBVixDQWxCQSxDQUFBO0FBQUEsSUFtQkEsS0FBQSxDQUFNLEdBQU4sRUFBVyxTQUFYLENBbkJBLENBQUE7QUFBQSxJQW9CQSxLQUFBLENBQU0sR0FBTixFQUFXLFdBQVgsQ0FBdUIsQ0FBQyxXQUF4QixDQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBeEMsQ0FBQTtBQUNBLE1BQUEsSUFBRyxHQUFBLEtBQU8saUJBQVY7ZUFDRSxPQUFPLENBQUMsT0FBUixDQUFnQixZQUFoQixFQURGO09BQUEsTUFFSyxJQUFHLEdBQUEsS0FBTyxrQkFBVjtlQUNILE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixFQURHO09BSjZCO0lBQUEsQ0FBcEMsQ0FwQkEsQ0FBQTtBQUFBLElBMEJBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtBQUM1QixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFuQyxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUssQ0FBQSxDQUFBLENBQUwsS0FBVyxRQUFkO2VBQ0UsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsRUFERjtPQUFBLE1BRUssSUFBRyxJQUFLLENBQUEsQ0FBQSxDQUFMLEtBQVcsUUFBZDtlQUNILGlCQURHO09BQUEsTUFFQSxJQUFHLElBQUssQ0FBQSxDQUFBLENBQUwsS0FBVyxNQUFkO2VBQ0gsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsRUFERztPQU51QjtJQUFBLENBQTlCLENBMUJBLENBQUE7QUFBQSxJQWtDQSxLQUFBLENBQU0sR0FBTixFQUFXLGFBQVgsQ0FBeUIsQ0FBQyxXQUExQixDQUFzQyxTQUFBLEdBQUE7QUFDcEMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBdEMsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsbUJBQVIsQ0FBQSxDQUFBLEtBQWlDLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQXBDO2VBQ0UsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxjQUFELENBQWhCLEVBREY7T0FGb0M7SUFBQSxDQUF0QyxDQWxDQSxDQUFBO0FBQUEsSUFzQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQSxHQUFBO0FBQzVCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQTlCLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLG1CQUFSLENBQUEsQ0FBQSxLQUFpQyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFqQyxJQUFnRSxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBM0U7ZUFDRSxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixFQURGO09BRjRCO0lBQUEsQ0FBOUIsQ0F0Q0EsQ0FBQTtBQUFBLElBMkNBLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLFVBQWhCLENBM0NBLENBQUE7QUFBQSxJQTRDQSxLQUFBLENBQU0sUUFBTixFQUFnQixTQUFoQixDQTVDQSxDQUFBO1dBNkNBLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLFlBQWhCLEVBOUNXO0VBQUEsQ0E3QmIsQ0FBQTs7QUFBQSxFQTZFQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsSUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixFQUF1QyxLQUF2QyxDQUFBLENBQUE7QUFBQSxRQUNBLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGdCQUFoQixDQURuQixDQUFBO0FBQUEsUUFFQSxVQUFBLENBQUEsQ0FGQSxDQUFBO2VBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsU0FBQSxDQUFVLElBQVYsRUFEYztRQUFBLENBQWhCLEVBSlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BT0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtlQUMxQixNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUF0QixDQUFvQyxDQUFDLGdCQUFyQyxDQUFBLEVBRDBCO01BQUEsQ0FBNUIsQ0FQQSxDQUFBO0FBQUEsTUFVQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO2VBQ3RDLE1BQUEsQ0FBTyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFDLG9CQUF0QixDQUEyQyxrQkFBM0MsRUFBK0QsSUFBSSxDQUFDLE9BQUwsQ0FBYSxjQUFiLENBQS9ELEVBRHNDO01BQUEsQ0FBeEMsQ0FWQSxDQUFBO0FBQUEsTUFhQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO2VBQ3RCLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxDQUFyQyxFQUFpRDtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBakQsRUFEc0I7TUFBQSxDQUF4QixDQWJBLENBQUE7QUFBQSxNQWdCQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO2VBQzNDLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBZCxDQUFzQixDQUFDLGdCQUF2QixDQUFBLEVBRDJDO01BQUEsQ0FBN0MsQ0FoQkEsQ0FBQTtBQUFBLE1BbUJBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7ZUFDOUMsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQUMsb0JBQXRCLENBQTJDLGlCQUEzQyxFQUE4RCxJQUFJLENBQUMsT0FBTCxDQUFhLGNBQWIsQ0FBOUQsRUFEOEM7TUFBQSxDQUFoRCxDQW5CQSxDQUFBO0FBQUEsTUFzQkEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLGtCQUFBO0FBQUEsUUFBQSxrQkFBQSxHQUFxQixFQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFyRCxDQUFBO2VBQ0EsTUFBQSxDQUFPLGtCQUFtQixDQUFBLENBQUEsQ0FBMUIsQ0FBNkIsQ0FBQyxPQUE5QixDQUFzQyxjQUF0QyxFQUZxQjtNQUFBLENBQXZCLENBdEJBLENBQUE7QUFBQSxNQTBCQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO2VBQ25CLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsZ0JBQTVCLENBQUEsRUFEbUI7TUFBQSxDQUFyQixDQTFCQSxDQUFBO0FBQUEsTUE2QkEsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUEsR0FBQTtBQUN4RCxRQUFBLFVBQVUsQ0FBQyxJQUFYLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxRQUFBLENBQVMsU0FBQSxHQUFBO2lCQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUixHQUFvQixFQUF2QjtRQUFBLENBQVQsQ0FEQSxDQUFBO2VBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsRUFBVyxpQkFBWCxFQUErQixTQUFBLEdBQVMsY0FBeEMsQ0FBckMsRUFBZ0c7QUFBQSxZQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1dBQWhHLEVBREc7UUFBQSxDQUFMLEVBSHdEO01BQUEsQ0FBMUQsQ0E3QkEsQ0FBQTtBQUFBLE1BbUNBLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBLEdBQUE7QUFDckQsUUFBQSxVQUFVLENBQUMsSUFBWCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQW5CLEdBQStCLEVBQWxDO1FBQUEsQ0FBVCxDQURBLENBQUE7ZUFFQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUFHLE1BQUEsQ0FBTyxVQUFVLENBQUMsT0FBbEIsQ0FBMEIsQ0FBQyxnQkFBM0IsQ0FBQSxFQUFIO1FBQUEsQ0FBTCxFQUhxRDtNQUFBLENBQXZELENBbkNBLENBQUE7QUFBQSxNQXdDQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFFBQUEsVUFBVSxDQUFDLElBQVgsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFwQixHQUFnQyxFQUFuQztRQUFBLENBQVQsQ0FEQSxDQUFBO2VBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFBRyxNQUFBLENBQU8sUUFBUSxDQUFDLFVBQWhCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELGdCQUFqRCxFQUFIO1FBQUEsQ0FBTCxFQUhrRDtNQUFBLENBQXBELENBeENBLENBQUE7YUE2Q0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxRQUFBLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sV0FBVyxDQUFDLFFBQW5CLENBQTRCLENBQUMsZ0JBQTdCLENBQUEsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxNQUFWLENBQWlCLENBQUMsb0JBQWxCLENBQXVDLGNBQXZDLEVBSDZDO01BQUEsQ0FBL0MsRUE5QzJCO0lBQUEsQ0FBN0IsQ0FBQSxDQUFBO0FBQUEsSUFtREEsUUFBQSxDQUFTLHlDQUFULEVBQW9ELFNBQUEsR0FBQTthQUNsRCxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsVUFBQSxDQUFBLENBQUEsQ0FBQTtlQUNBLFNBQUEsQ0FBVSxJQUFWLENBQWUsQ0FBQyxJQUFoQixDQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxrQkFBQTtBQUFBLFVBQUEsa0JBQUEsR0FBcUIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBckQsQ0FBQTtpQkFDQSxNQUFBLENBQU8sa0JBQW1CLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBdEIsQ0FBQSxDQUE0QixDQUFDLE1BQTdCLENBQW9DLENBQXBDLENBQVAsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxHQUFwRCxFQUZtQjtRQUFBLENBQXJCLEVBRjRCO01BQUEsQ0FBOUIsRUFEa0Q7SUFBQSxDQUFwRCxDQW5EQSxDQUFBO0FBQUEsSUEwREEsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUEsR0FBQTthQUNyRCxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsa0JBQUEsR0FBcUIsR0FBckIsQ0FBQTtBQUFBLFFBQ0EsVUFBQSxDQUFBLENBREEsQ0FBQTtlQUVBLFNBQUEsQ0FBVSxJQUFWLENBQWUsQ0FBQyxJQUFoQixDQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxrQkFBQTtBQUFBLFVBQUEsa0JBQUEsR0FBcUIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBckQsQ0FBQTtpQkFDQSxNQUFBLENBQU8sa0JBQW1CLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBdEIsQ0FBQSxDQUE0QixDQUFDLE1BQTdCLENBQW9DLENBQXBDLENBQVAsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxrQkFBcEQsRUFGbUI7UUFBQSxDQUFyQixFQUhnQztNQUFBLENBQWxDLEVBRHFEO0lBQUEsQ0FBdkQsQ0ExREEsQ0FBQTtBQUFBLElBa0VBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBLEdBQUE7YUFDakQsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLFVBQUEsQ0FBQSxDQUFBLENBQUE7ZUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxTQUFBLENBQVUsSUFBVixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsU0FBQSxHQUFBO0FBQ25CLGdCQUFBLGtCQUFBO0FBQUEsWUFBQSxrQkFBQSxHQUFxQixFQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFyRCxDQUFBO21CQUNBLE1BQUEsQ0FBTyxrQkFBbUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUF0QixDQUE2QixDQUE3QixDQUFQLENBQXVDLENBQUMsT0FBeEMsQ0FBZ0QsSUFBaEQsRUFGbUI7VUFBQSxDQUFyQixFQURjO1FBQUEsQ0FBaEIsRUFGeUM7TUFBQSxDQUEzQyxFQURpRDtJQUFBLENBQW5ELENBbEVBLENBQUE7QUFBQSxJQTBFQSxRQUFBLENBQVMsb0NBQVQsRUFBK0MsU0FBQSxHQUFBO2FBQzdDLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsUUFBQSxZQUFBLEdBQWUsVUFBZixDQUFBO0FBQUEsUUFDQSxVQUFBLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxTQUFBLENBQVUsSUFBVixDQUZBLENBQUE7QUFBQSxRQUdBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQ1AsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFqQixHQUE2QixFQUR0QjtRQUFBLENBQVQsQ0FIQSxDQUFBO2VBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsa0JBQUE7QUFBQSxVQUFBLGtCQUFBLEdBQXFCLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQXJELENBQUE7aUJBQ0EsTUFBQSxDQUFPLGtCQUFtQixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQXRCLENBQThCLGNBQTlCLENBQVAsQ0FBcUQsQ0FBQyxJQUF0RCxDQUEyRCxDQUEzRCxFQUZHO1FBQUEsQ0FBTCxFQU5pRDtNQUFBLENBQW5ELEVBRDZDO0lBQUEsQ0FBL0MsQ0ExRUEsQ0FBQTtBQUFBLElBcUZBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBLEdBQUE7YUFDN0MsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxRQUFBLFVBQUEsQ0FBQSxDQUFBLENBQUE7ZUFDQSxTQUFBLENBQVUsSUFBVixFQUFnQjtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FBaEIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxTQUFBLEdBQUE7aUJBQ3ZDLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLElBQXJDLEVBQTJDO0FBQUEsWUFBQSxNQUFBLEVBQVEsSUFBUjtXQUEzQyxFQUR1QztRQUFBLENBQXpDLEVBRmlEO01BQUEsQ0FBbkQsRUFENkM7SUFBQSxDQUEvQyxDQXJGQSxDQUFBO0FBQUEsSUEyRkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsRUFBdUMsS0FBdkMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxnQkFBQSxHQUFtQixPQUFPLENBQUMsTUFBUixDQUFlLGNBQWYsQ0FEbkIsQ0FBQTtBQUFBLFFBRUEsVUFBQSxDQUFBLENBRkEsQ0FBQTtlQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLFNBQUEsQ0FBVSxJQUFWLEVBRGM7UUFBQSxDQUFoQixFQUpTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFPQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFFBQUEsVUFBVSxDQUFDLElBQVgsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFsQixHQUE4QixFQUFqQztRQUFBLENBQVQsQ0FEQSxDQUFBO2VBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxRQUFoQixDQUF5QixDQUFDLG9CQUExQixDQUErQyxjQUEvQyxDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLFVBQVUsQ0FBQyxPQUFsQixDQUEwQixDQUFDLEdBQUcsQ0FBQyxnQkFBL0IsQ0FBQSxFQUZHO1FBQUEsQ0FBTCxFQUhvRDtNQUFBLENBQXRELEVBUjJCO0lBQUEsQ0FBN0IsQ0EzRkEsQ0FBQTtXQTBHQSxRQUFBLENBQVMseUNBQVQsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixFQUF1QyxLQUF2QyxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsSUFBekMsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLEVBQTJDLElBQTNDLENBRkEsQ0FBQTtlQUdBLFVBQUEsQ0FBQSxFQUpTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQU1BLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxTQUFBLENBQVUsSUFBVixFQUFIO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO2VBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLE1BQUQsRUFBUyxlQUFULEVBQTBCLFVBQTFCLENBQXJDLEVBQTRFO0FBQUEsWUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtXQUE1RSxFQURHO1FBQUEsQ0FBTCxFQUYwQztNQUFBLENBQTVDLENBTkEsQ0FBQTthQVdBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSxVQUFVLENBQUMsSUFBWCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsU0FBNUIsR0FBd0MsRUFBM0M7UUFBQSxDQUFULENBREEsQ0FBQTtlQUVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQ0gsTUFBQSxDQUFPLGlCQUFpQixDQUFDLFNBQXpCLENBQW1DLENBQUMsb0JBQXBDLENBQXlELENBQXpELEVBQTRELGlCQUFpQixDQUFDLE9BQWxCLENBQUEsQ0FBNUQsRUFERztRQUFBLENBQUwsRUFIMEI7TUFBQSxDQUE1QixFQVprRDtJQUFBLENBQXBELEVBM0dvQjtFQUFBLENBQXRCLENBN0VBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ssun/.atom/packages/git-plus/spec/models/git-commit-spec.coffee
