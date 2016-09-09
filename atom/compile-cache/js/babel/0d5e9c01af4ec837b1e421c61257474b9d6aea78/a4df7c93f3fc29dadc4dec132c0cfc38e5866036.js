var shell = require("shell");
var _ = require("underscore");
var loophole = require("loophole");
var errorController = require("../controllers/errorController");

function RemoteRevision(remote) {
  this.remote = remote;
  this.initialize();
}

// ================
// Class Methods
// ================

RemoteRevision.create = function (remoteUrl) {
  var rr = new RemoteRevision(remoteUrl);
  if (!rr.getTemplate()) {
    throw "Cannot create RemoteRevision with invalid template";
  }
  return rr;
};

// ================
// Instance Methods
// ================

_.extend(RemoteRevision.prototype, {

  /**
   * Default url template for a github.com commit.
   */
  githubTemplate: "https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>",

  /**
   * Default url template for a bitbucket.org commit.
   */
  bitbucketTemplate: "https://bitbucket.org/<%- project %>/<%- repo %>/commits/<%- revision %>",

  /**
   * Should be called after the remote property is set. Parses the remote url
   * for project and repo and stores them as their own properties.
   */
  initialize: function initialize() {
    var data = this.parseProjectAndRepo();
    if (data.project && data.repo) {
      this.project = data.project;
      this.repo = data.repo;
    } else {
      // we were unable to parse data from the remote...
      errorController.showError("error-problem-parsing-data-from-remote");
    }
  },

  /**
   * Generates a URL for the given revision/commit identifier based on the parsed
   * remote data and the template.
   */
  url: function url(revision) {
    var template = this.getTemplate();
    if (!template) {
      // this should be impossible, so throw
      throw "No template present in RemoteRevision";
    }

    // we were unable to parse upon initialization...so return empty url
    if (!this.project || !this.repo || !revision) {
      return "";
    }

    // create data object used to render template string
    var data = {
      revision: revision,
      project: this.project,
      repo: this.repo
    };

    // return a rendered url
    return template(data);
  },

  /**
   * Parses project and repo from this.remote.
   *
   * @returns Object containing the project and repo.
   */
  parseProjectAndRepo: function parseProjectAndRepo() {
    // strip off .git if its there
    var strippedRemoteUrl = this.remote.replace(/(\.git)$/, "");

    var pattern = /[\:\/]([.\w-]*)?\/?([.\w-]*)$/;
    var matches = strippedRemoteUrl.match(pattern);

    // if we have no matches just return empty object. caller should validate
    // data before using it.
    if (!matches) {
      return {};
    }

    // if no project is matched, project and repo are the same.
    return {
      project: matches[1],
      repo: matches[2] || matches[1]
    };
  },

  safeTemplate: function safeTemplate(templateString) {
    return loophole.allowUnsafeNewFunction(function () {
      return _.template(templateString);
    });
  },

  /**
   * Creates a template function using either default github / bitbucket
   * url templates or a custom url template strings specified in the configs.
   */
  getTemplate: function getTemplate() {
    if (this.isGithub()) {
      return this.safeTemplate(this.githubTemplate);
    }

    if (this.isBitbucket()) {
      return this.safeTemplate(this.bitbucketTemplate);
    }

    if (atom.config.get("git-blame.useCustomUrlTemplateIfStandardRemotesFail")) {
      var customUrlTemplate = atom.config.get("git-blame.customCommitUrlTemplateString");

      // if the user hasnt entered a template string, return nothing
      if (/^Example/.test(customUrlTemplate)) {
        return;
      }

      return this.safeTemplate(customUrlTemplate);
    }
  },

  /**
   * Returns true if this RemoteRevision represents a github repository.
   */
  isGithub: function isGithub() {
    return /github.com/.test(this.remote);
  },

  /**
   * Returns true if this RemoteRevision represents a bitbucket repository.
   */
  isBitbucket: function isBitbucket() {
    return /bitbucket.org/.test(this.remote);
  }

});

// Exports
module.exports = RemoteRevision;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9SZW1vdGVSZXZpc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2hDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFbEUsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQzlCLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztDQUNuQjs7Ozs7O0FBTUQsY0FBYyxDQUFDLE1BQU0sR0FBRyxVQUFTLFNBQVMsRUFBRTtBQUMxQyxNQUFJLEVBQUUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxNQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3JCLFVBQU0sb0RBQW9ELENBQUM7R0FDNUQ7QUFDRCxTQUFPLEVBQUUsQ0FBQztDQUNYLENBQUM7Ozs7OztBQU1GLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRTs7Ozs7QUFLakMsZ0JBQWMsRUFBRSxzRUFBc0U7Ozs7O0FBS3RGLG1CQUFpQixFQUFFLDBFQUEwRTs7Ozs7O0FBTTdGLFlBQVUsRUFBRSxzQkFBVztBQUNyQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUN0QyxRQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUM3QixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDNUIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ3ZCLE1BQU07O0FBRUwscUJBQWUsQ0FBQyxTQUFTLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUNyRTtHQUNGOzs7Ozs7QUFNRCxLQUFHLEVBQUUsYUFBUyxRQUFRLEVBQUU7QUFDdEIsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxRQUFRLEVBQUU7O0FBRWIsWUFBTSx1Q0FBdUMsQ0FBQztLQUMvQzs7O0FBR0QsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzVDLGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztBQUdELFFBQUksSUFBSSxHQUFHO0FBQ1QsY0FBUSxFQUFFLFFBQVE7QUFDbEIsYUFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQ3JCLFVBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtLQUNoQixDQUFDOzs7QUFHRixXQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN2Qjs7Ozs7OztBQU9ELHFCQUFtQixFQUFFLCtCQUFXOztBQUU5QixRQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFNUQsUUFBSSxPQUFPLEdBQUcsK0JBQStCLENBQUM7QUFDOUMsUUFBSSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7O0FBSS9DLFFBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixhQUFPLEVBQUUsQ0FBQztLQUNYOzs7QUFHRCxXQUFPO0FBQ0wsYUFBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDbkIsVUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQy9CLENBQUM7R0FDSDs7QUFFRCxjQUFZLEVBQUUsc0JBQVMsY0FBYyxFQUFFO0FBQ3JDLFdBQU8sUUFBUSxDQUFDLHNCQUFzQixDQUFDLFlBQVc7QUFDaEQsYUFBTyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ25DLENBQUMsQ0FBQztHQUNKOzs7Ozs7QUFNRCxhQUFXLEVBQUUsdUJBQVc7QUFDdEIsUUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDbkIsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUMvQzs7QUFFRCxRQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0QixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDbEQ7O0FBRUQsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxREFBcUQsQ0FBQyxFQUFFO0FBQzFFLFVBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQzs7O0FBR25GLFVBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0FBQ3RDLGVBQU87T0FDUjs7QUFFRCxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUM3QztHQUNGOzs7OztBQUtELFVBQVEsRUFBRSxvQkFBVztBQUNuQixXQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3ZDOzs7OztBQUtELGFBQVcsRUFBRSx1QkFBVztBQUN0QixXQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzFDOztDQUVGLENBQUMsQ0FBQzs7O0FBSUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL1JlbW90ZVJldmlzaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2hlbGwgPSByZXF1aXJlKCdzaGVsbCcpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbmNvbnN0IGxvb3Bob2xlID0gcmVxdWlyZSgnbG9vcGhvbGUnKTtcbmNvbnN0IGVycm9yQ29udHJvbGxlciA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL2Vycm9yQ29udHJvbGxlcicpO1xuXG5mdW5jdGlvbiBSZW1vdGVSZXZpc2lvbihyZW1vdGUpIHtcbiAgdGhpcy5yZW1vdGUgPSByZW1vdGU7XG4gIHRoaXMuaW5pdGlhbGl6ZSgpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09XG4vLyBDbGFzcyBNZXRob2RzXG4vLyA9PT09PT09PT09PT09PT09XG5cblJlbW90ZVJldmlzaW9uLmNyZWF0ZSA9IGZ1bmN0aW9uKHJlbW90ZVVybCkge1xuICB2YXIgcnIgPSBuZXcgUmVtb3RlUmV2aXNpb24ocmVtb3RlVXJsKTtcbiAgaWYgKCFyci5nZXRUZW1wbGF0ZSgpKSB7XG4gICAgdGhyb3cgXCJDYW5ub3QgY3JlYXRlIFJlbW90ZVJldmlzaW9uIHdpdGggaW52YWxpZCB0ZW1wbGF0ZVwiO1xuICB9XG4gIHJldHVybiBycjtcbn07XG5cbi8vID09PT09PT09PT09PT09PT1cbi8vIEluc3RhbmNlIE1ldGhvZHNcbi8vID09PT09PT09PT09PT09PT1cblxuXy5leHRlbmQoUmVtb3RlUmV2aXNpb24ucHJvdG90eXBlLCB7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdXJsIHRlbXBsYXRlIGZvciBhIGdpdGh1Yi5jb20gY29tbWl0LlxuICAgKi9cbiAgZ2l0aHViVGVtcGxhdGU6ICdodHRwczovL2dpdGh1Yi5jb20vPCUtIHByb2plY3QgJT4vPCUtIHJlcG8gJT4vY29tbWl0LzwlLSByZXZpc2lvbiAlPicsXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdXJsIHRlbXBsYXRlIGZvciBhIGJpdGJ1Y2tldC5vcmcgY29tbWl0LlxuICAgKi9cbiAgYml0YnVja2V0VGVtcGxhdGU6ICdodHRwczovL2JpdGJ1Y2tldC5vcmcvPCUtIHByb2plY3QgJT4vPCUtIHJlcG8gJT4vY29tbWl0cy88JS0gcmV2aXNpb24gJT4nLFxuXG4gIC8qKlxuICAgKiBTaG91bGQgYmUgY2FsbGVkIGFmdGVyIHRoZSByZW1vdGUgcHJvcGVydHkgaXMgc2V0LiBQYXJzZXMgdGhlIHJlbW90ZSB1cmxcbiAgICogZm9yIHByb2plY3QgYW5kIHJlcG8gYW5kIHN0b3JlcyB0aGVtIGFzIHRoZWlyIG93biBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLnBhcnNlUHJvamVjdEFuZFJlcG8oKTtcbiAgICBpZiAoZGF0YS5wcm9qZWN0ICYmIGRhdGEucmVwbykge1xuICAgICAgdGhpcy5wcm9qZWN0ID0gZGF0YS5wcm9qZWN0O1xuICAgICAgdGhpcy5yZXBvID0gZGF0YS5yZXBvO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3ZSB3ZXJlIHVuYWJsZSB0byBwYXJzZSBkYXRhIGZyb20gdGhlIHJlbW90ZS4uLlxuICAgICAgZXJyb3JDb250cm9sbGVyLnNob3dFcnJvcignZXJyb3ItcHJvYmxlbS1wYXJzaW5nLWRhdGEtZnJvbS1yZW1vdGUnKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIFVSTCBmb3IgdGhlIGdpdmVuIHJldmlzaW9uL2NvbW1pdCBpZGVudGlmaWVyIGJhc2VkIG9uIHRoZSBwYXJzZWRcbiAgICogcmVtb3RlIGRhdGEgYW5kIHRoZSB0ZW1wbGF0ZS5cbiAgICovXG4gIHVybDogZnVuY3Rpb24ocmV2aXNpb24pIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmdldFRlbXBsYXRlKCk7XG4gICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgLy8gdGhpcyBzaG91bGQgYmUgaW1wb3NzaWJsZSwgc28gdGhyb3dcbiAgICAgIHRocm93IFwiTm8gdGVtcGxhdGUgcHJlc2VudCBpbiBSZW1vdGVSZXZpc2lvblwiO1xuICAgIH1cblxuICAgIC8vIHdlIHdlcmUgdW5hYmxlIHRvIHBhcnNlIHVwb24gaW5pdGlhbGl6YXRpb24uLi5zbyByZXR1cm4gZW1wdHkgdXJsXG4gICAgaWYgKCF0aGlzLnByb2plY3QgfHwgIXRoaXMucmVwbyB8fCAhcmV2aXNpb24pIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgZGF0YSBvYmplY3QgdXNlZCB0byByZW5kZXIgdGVtcGxhdGUgc3RyaW5nXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICByZXZpc2lvbjogcmV2aXNpb24sXG4gICAgICBwcm9qZWN0OiB0aGlzLnByb2plY3QsXG4gICAgICByZXBvOiB0aGlzLnJlcG9cbiAgICB9O1xuXG4gICAgLy8gcmV0dXJuIGEgcmVuZGVyZWQgdXJsXG4gICAgcmV0dXJuIHRlbXBsYXRlKGRhdGEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBQYXJzZXMgcHJvamVjdCBhbmQgcmVwbyBmcm9tIHRoaXMucmVtb3RlLlxuICAgKlxuICAgKiBAcmV0dXJucyBPYmplY3QgY29udGFpbmluZyB0aGUgcHJvamVjdCBhbmQgcmVwby5cbiAgICovXG4gIHBhcnNlUHJvamVjdEFuZFJlcG86IGZ1bmN0aW9uKCkge1xuICAgIC8vIHN0cmlwIG9mZiAuZ2l0IGlmIGl0cyB0aGVyZVxuICAgIHZhciBzdHJpcHBlZFJlbW90ZVVybCA9IHRoaXMucmVtb3RlLnJlcGxhY2UoLyhcXC5naXQpJC8sIFwiXCIpO1xuXG4gICAgdmFyIHBhdHRlcm4gPSAvW1xcOlxcL10oWy5cXHctXSopP1xcLz8oWy5cXHctXSopJC87XG4gICAgdmFyIG1hdGNoZXMgPSBzdHJpcHBlZFJlbW90ZVVybC5tYXRjaChwYXR0ZXJuKTtcblxuICAgIC8vIGlmIHdlIGhhdmUgbm8gbWF0Y2hlcyBqdXN0IHJldHVybiBlbXB0eSBvYmplY3QuIGNhbGxlciBzaG91bGQgdmFsaWRhdGVcbiAgICAvLyBkYXRhIGJlZm9yZSB1c2luZyBpdC5cbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvLyBpZiBubyBwcm9qZWN0IGlzIG1hdGNoZWQsIHByb2plY3QgYW5kIHJlcG8gYXJlIHRoZSBzYW1lLlxuICAgIHJldHVybiB7XG4gICAgICBwcm9qZWN0OiBtYXRjaGVzWzFdLFxuICAgICAgcmVwbzogbWF0Y2hlc1syXSB8fCBtYXRjaGVzWzFdXG4gICAgfTtcbiAgfSxcblxuICBzYWZlVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlU3RyaW5nKSB7XG4gICAgcmV0dXJuIGxvb3Bob2xlLmFsbG93VW5zYWZlTmV3RnVuY3Rpb24oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXy50ZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiB1c2luZyBlaXRoZXIgZGVmYXVsdCBnaXRodWIgLyBiaXRidWNrZXRcbiAgICogdXJsIHRlbXBsYXRlcyBvciBhIGN1c3RvbSB1cmwgdGVtcGxhdGUgc3RyaW5ncyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZ3MuXG4gICAqL1xuICBnZXRUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaXNHaXRodWIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2FmZVRlbXBsYXRlKHRoaXMuZ2l0aHViVGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQml0YnVja2V0KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNhZmVUZW1wbGF0ZSh0aGlzLmJpdGJ1Y2tldFRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUudXNlQ3VzdG9tVXJsVGVtcGxhdGVJZlN0YW5kYXJkUmVtb3Rlc0ZhaWwnKSkge1xuICAgICAgdmFyIGN1c3RvbVVybFRlbXBsYXRlID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuY3VzdG9tQ29tbWl0VXJsVGVtcGxhdGVTdHJpbmcnKTtcblxuICAgICAgLy8gaWYgdGhlIHVzZXIgaGFzbnQgZW50ZXJlZCBhIHRlbXBsYXRlIHN0cmluZywgcmV0dXJuIG5vdGhpbmdcbiAgICAgIGlmICgvXkV4YW1wbGUvLnRlc3QoY3VzdG9tVXJsVGVtcGxhdGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2FmZVRlbXBsYXRlKGN1c3RvbVVybFRlbXBsYXRlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIFJlbW90ZVJldmlzaW9uIHJlcHJlc2VudHMgYSBnaXRodWIgcmVwb3NpdG9yeS5cbiAgICovXG4gIGlzR2l0aHViOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gL2dpdGh1Yi5jb20vLnRlc3QodGhpcy5yZW1vdGUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBSZW1vdGVSZXZpc2lvbiByZXByZXNlbnRzIGEgYml0YnVja2V0IHJlcG9zaXRvcnkuXG4gICAqL1xuICBpc0JpdGJ1Y2tldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIC9iaXRidWNrZXQub3JnLy50ZXN0KHRoaXMucmVtb3RlKTtcbiAgfVxuXG59KTtcblxuXG4vLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IFJlbW90ZVJldmlzaW9uO1xuIl19