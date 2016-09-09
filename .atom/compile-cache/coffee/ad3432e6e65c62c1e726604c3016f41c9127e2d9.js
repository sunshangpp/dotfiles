(function() {
  var git;

  git = require('../lib/git');

  describe("Git-Plus git module", function() {
    describe("git.getRepo", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.getRepo().then(function(repo) {
            return expect(repo.getWorkingDirectory()).toContain('git-plus');
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.dir().then(function(dir) {
            return expect(dir).toContain('akonwi');
          });
        });
      });
    });
    return describe("git.getSubmodule", function() {
      return it("returns null when there is no submodule", function() {
        return expect(git.getSubmodule("~/.atom/packages/git-plus/lib/git.coffee")).toBeFalsy();
      });
    });
  });

}).call(this);
