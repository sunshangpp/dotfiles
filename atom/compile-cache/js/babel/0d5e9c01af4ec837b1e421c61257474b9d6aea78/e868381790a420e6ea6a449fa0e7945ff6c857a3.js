var Blamer = require("./util/blamer");
var BlameViewController = require("./controllers/blameViewController");
var errorController = require("./controllers/errorController");

// reference to the Blamer instance created in initializeContext if this
// project is backed by a git repository.
var projectBlamer = null;

function activate() {
  initializeContext();

  // git-blame:blame
  atom.commands.add("atom-workspace", "git-blame:toggle", toggleBlame);
}

function initializeContext() {
  var projectRepo = atom.project.getRepo();

  // Ensure this project is backed by a git repository
  if (!projectRepo) {
    errorController.showError("error-not-backed-by-git");
    return;
  }

  projectBlamer = new Blamer(projectRepo);
}

function toggleBlame() {
  // Nothing to do if projectBlamer isnt defined. Means this project is not
  // backed by git.
  if (!projectBlamer) {
    return;
  }
  BlameViewController.toggleBlame(projectBlamer);
}

// EXPORTS
module.exports = {
  configDefaults: {
    useCustomUrlTemplateIfStandardRemotesFail: false,
    customCommitUrlTemplateString: "Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>",
    dateFormatString: "YYYY-MM-DD",
    ignoreWhiteSpaceDiffs: false
  },
  toggleBlame: toggleBlame,
  activate: activate
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvZ2l0LWJsYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN4QyxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3pFLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOzs7O0FBSWpFLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFekIsU0FBUyxRQUFRLEdBQUc7QUFDbEIsbUJBQWlCLEVBQUUsQ0FBQzs7O0FBR3BCLE1BQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0NBQ3RFOztBQUVELFNBQVMsaUJBQWlCLEdBQUc7QUFDM0IsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7O0FBR3pDLE1BQUksQ0FBQyxXQUFXLEVBQUU7QUFDaEIsbUJBQWUsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNyRCxXQUFPO0dBQ1I7O0FBRUQsZUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0NBQ3pDOztBQUVELFNBQVMsV0FBVyxHQUFHOzs7QUFHckIsTUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNsQixXQUFPO0dBQ1I7QUFDRCxxQkFBbUIsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Q0FDaEQ7OztBQUdELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixnQkFBYyxFQUFFO0FBQ2QsNkNBQXlDLEVBQUUsS0FBSztBQUNoRCxpQ0FBNkIsRUFBRSxpRkFBaUY7QUFDaEgsb0JBQWdCLEVBQUUsWUFBWTtBQUM5Qix5QkFBcUIsRUFBRSxLQUFLO0dBQzdCO0FBQ0QsYUFBVyxFQUFFLFdBQVc7QUFDeEIsVUFBUSxFQUFFLFFBQVE7Q0FDbkIsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2dpdC1ibGFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJsYW1lciA9IHJlcXVpcmUoJy4vdXRpbC9ibGFtZXInKTtcbmNvbnN0IEJsYW1lVmlld0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2JsYW1lVmlld0NvbnRyb2xsZXInKTtcbmNvbnN0IGVycm9yQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvZXJyb3JDb250cm9sbGVyJyk7XG5cbi8vIHJlZmVyZW5jZSB0byB0aGUgQmxhbWVyIGluc3RhbmNlIGNyZWF0ZWQgaW4gaW5pdGlhbGl6ZUNvbnRleHQgaWYgdGhpc1xuLy8gcHJvamVjdCBpcyBiYWNrZWQgYnkgYSBnaXQgcmVwb3NpdG9yeS5cbnZhciBwcm9qZWN0QmxhbWVyID0gbnVsbDtcblxuZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIGluaXRpYWxpemVDb250ZXh0KCk7XG5cbiAgLy8gZ2l0LWJsYW1lOmJsYW1lXG4gIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdnaXQtYmxhbWU6dG9nZ2xlJywgdG9nZ2xlQmxhbWUpO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplQ29udGV4dCgpIHtcbiAgdmFyIHByb2plY3RSZXBvID0gYXRvbS5wcm9qZWN0LmdldFJlcG8oKTtcblxuICAvLyBFbnN1cmUgdGhpcyBwcm9qZWN0IGlzIGJhY2tlZCBieSBhIGdpdCByZXBvc2l0b3J5XG4gIGlmICghcHJvamVjdFJlcG8pIHtcbiAgICBlcnJvckNvbnRyb2xsZXIuc2hvd0Vycm9yKCdlcnJvci1ub3QtYmFja2VkLWJ5LWdpdCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb2plY3RCbGFtZXIgPSBuZXcgQmxhbWVyKHByb2plY3RSZXBvKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlQmxhbWUoKSB7XG4gIC8vIE5vdGhpbmcgdG8gZG8gaWYgcHJvamVjdEJsYW1lciBpc250IGRlZmluZWQuIE1lYW5zIHRoaXMgcHJvamVjdCBpcyBub3RcbiAgLy8gYmFja2VkIGJ5IGdpdC5cbiAgaWYgKCFwcm9qZWN0QmxhbWVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIEJsYW1lVmlld0NvbnRyb2xsZXIudG9nZ2xlQmxhbWUocHJvamVjdEJsYW1lcik7XG59XG5cbi8vIEVYUE9SVFNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb25maWdEZWZhdWx0czoge1xuICAgIHVzZUN1c3RvbVVybFRlbXBsYXRlSWZTdGFuZGFyZFJlbW90ZXNGYWlsOiBmYWxzZSxcbiAgICBjdXN0b21Db21taXRVcmxUZW1wbGF0ZVN0cmluZzogJ0V4YW1wbGUgLT4gaHR0cHM6Ly9naXRodWIuY29tLzwlLSBwcm9qZWN0ICU+LzwlLSByZXBvICU+L2NvbW1pdC88JS0gcmV2aXNpb24gJT4nLFxuICAgIGRhdGVGb3JtYXRTdHJpbmc6ICdZWVlZLU1NLUREJyxcbiAgICBpZ25vcmVXaGl0ZVNwYWNlRGlmZnM6IGZhbHNlXG4gIH0sXG4gIHRvZ2dsZUJsYW1lOiB0b2dnbGVCbGFtZSxcbiAgYWN0aXZhdGU6IGFjdGl2YXRlXG59O1xuIl19