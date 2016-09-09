(function() {
  var GitDiff, GitDiffAll, diffPane, fs, git, openPromise, pathToRepoFile, repo, textEditor, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor;

  git = require('../../lib/git');

  GitDiff = require('../../lib/models/git-diff');

  GitDiffAll = require('../../lib/models/git-diff-all');

  diffPane = {
    splitRight: function() {
      return void 0;
    },
    getActiveEditor: function() {
      return textEditor;
    }
  };

  openPromise = {
    done: function(cb) {
      return cb(textEditor);
    }
  };

  describe("GitDiff", function() {
    beforeEach(function() {
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo, {
          file: pathToRepoFile
        });
      });
    });
    return describe("when git-plus.includeStagedDiff config is true", function() {
      return it("calls git.cmd and specifies 'HEAD'", function() {
        return expect(__indexOf.call(git.cmd.mostRecentCall.args[0], 'HEAD') >= 0).toBe(true);
      });
    });
  });

  describe("GitDiff when git-plus.wordDiff config is true", function() {
    beforeEach(function() {
      atom.config.set('git-plus.wordDiff', true);
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo, {
          file: pathToRepoFile
        });
      });
    });
    return it("calls git.cmd and uses '--word-diff' flag", function() {
      return expect(__indexOf.call(git.cmd.mostRecentCall.args[0], '--word-diff') >= 0).toBe(true);
    });
  });

  describe("GitDiff when a file is not specified", function() {
    beforeEach(function() {
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo);
      });
    });
    return it("checks for the current open file", function() {
      return expect(atom.workspace.getActiveTextEditor).toHaveBeenCalled();
    });
  });

  describe("when git-plus.openInPane config is true", function() {
    beforeEach(function() {
      atom.config.set('git-plus.openInPane', true);
      atom.config.set('git-plus.splitPane', 'right');
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(atom.workspace, 'paneForURI').andReturn(diffPane);
      spyOn(diffPane, 'splitRight').andReturn(diffPane);
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo);
      });
    });
    return describe("when git-plus.splitPane config is not set", function() {
      return it("defaults to splitRight", function() {
        return expect(diffPane.splitRight).toHaveBeenCalled();
      });
    });
  });

  describe("GitDiffAll", function() {
    beforeEach(function() {
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(fs, 'writeFile').andCallFake(function() {
        return fs.writeFile.mostRecentCall.args[3]();
      });
      spyOn(git, 'cmd').andCallFake(function() {
        var args;
        args = git.cmd.mostRecentCall.args[0];
        if (args[1] === '--stat') {
          return Promise.resolve('diff stats\n');
        } else {
          return Promise.resolve('diffs');
        }
      });
      return waitsForPromise(function() {
        return GitDiffAll(repo);
      });
    });
    return it("includes the diff stats in the diffs window", function() {
      return expect(fs.writeFile.mostRecentCall.args[1].includes('diff stats')).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWRpZmYtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkZBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxPQUFxQyxPQUFBLENBQVEsYUFBUixDQUFyQyxFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsRUFBdUIsa0JBQUEsVUFEdkIsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLDJCQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsK0JBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBQVo7QUFBQSxJQUNBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO2FBQUcsV0FBSDtJQUFBLENBRGpCO0dBUEYsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsRUFBRCxHQUFBO2FBQVEsRUFBQSxDQUFHLFVBQUgsRUFBUjtJQUFBLENBQU47R0FWRixDQUFBOztBQUFBLEVBWUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxJQUE5QyxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxF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

//# sourceURL=/Users/ssun/.atom/packages/git-plus/spec/models/git-diff-spec.coffee
