(function() {
  var GitOpenChangedFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitOpenChangedFiles = require('../../lib/models/git-open-changed-files');

  describe("GitOpenChangedFiles", function() {
    beforeEach(function() {
      return spyOn(atom.workspace, 'open');
    });
    describe("when file is modified", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve([' M file1.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens changed file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file1.txt");
      });
    });
    describe("when file is added", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve(['?? file2.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens added file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file2.txt");
      });
    });
    return describe("when file is renamed", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve(['R  file3.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens renamed file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file3.txt");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LW9wZW4tY2hhbmdlZC1maWxlcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlDQUFSLENBRnRCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixNQUF0QixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsQ0FBQyxTQUFyQixDQUErQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFDLGNBQUQsQ0FBaEIsQ0FBL0IsQ0FBQSxDQUFBO2VBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBSDtRQUFBLENBQWhCLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7ZUFDdkIsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsV0FBakQsRUFEdUI7TUFBQSxDQUF6QixFQUxnQztJQUFBLENBQWxDLENBSEEsQ0FBQTtBQUFBLElBV0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsUUFBWCxDQUFvQixDQUFDLFNBQXJCLENBQStCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLENBQUMsY0FBRCxDQUFoQixDQUEvQixDQUFBLENBQUE7ZUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxtQkFBQSxDQUFvQixJQUFwQixFQUFIO1FBQUEsQ0FBaEIsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtlQUNyQixNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUF0QixDQUEyQixDQUFDLG9CQUE1QixDQUFpRCxXQUFqRCxFQURxQjtNQUFBLENBQXZCLEVBTDZCO0lBQUEsQ0FBL0IsQ0FYQSxDQUFBO1dBbUJBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsQ0FBQyxTQUFyQixDQUErQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFDLGNBQUQsQ0FBaEIsQ0FBL0IsQ0FBQSxDQUFBO2VBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBSDtRQUFBLENBQWhCLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7ZUFDdkIsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsV0FBakQsRUFEdUI7TUFBQSxDQUF6QixFQUwrQjtJQUFBLENBQWpDLEVBcEI4QjtFQUFBLENBQWhDLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ssun/.atom/packages/git-plus/spec/models/git-open-changed-files-spec.coffee
