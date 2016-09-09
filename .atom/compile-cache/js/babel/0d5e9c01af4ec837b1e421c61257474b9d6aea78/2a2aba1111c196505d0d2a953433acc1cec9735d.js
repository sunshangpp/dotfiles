var _ = require("underscore");
var GitCommander = require("./gitCommander");

/**
 * @module Blamer
 *
 * Blamer is a Class that should be instantiated with an atom 'Git' object
 * for the root repository in the project.
 *
 * @param {Git} repo - an instance of 'Git' class from atom workspace. See
 *   https://atom.io/docs/api/v0.92.0/api/ for more info.
 */
var Blamer = function Blamer(repo) {
  if (!repo) {
    throw new Error("Cannot create a Blamer without a repository.");
  }

  this.repo = repo;
  this.initialize();
};

// ================
// Instance Methods
// ================

_.extend(Blamer.prototype, {

  /**
   * Initializes this Blamer instance, by creating git-tools repos for the root
   * repository and submodules.
   */
  initialize: function initialize() {
    this.tools = {};
    this.tools.root = new GitCommander(this.repo.getWorkingDirectory());

    var submodules = this.repo.submodules;
    if (submodules) {
      for (var submodulePath in submodules) {
        this.tools[submodulePath] = new GitCommander(this.repo.getWorkingDirectory() + "/" + submodulePath);
      }
    }
  },

  /**
   * Blames the given filePath and calls callback with blame lines or error.
   *
   * @param {string} filePath - filePath to blame
   * @param {function} callback - callback to call back with blame data
   */
  blame: function blame(filePath, callback) {
    // Ensure file path is relative to root repo
    filePath = this.repo.relativize(filePath);
    var repoUtil = this.repoUtilForPath(filePath);

    // Ensure that if this file is in a submodule, we remove the submodule dir
    // from the path
    filePath = this.removeSubmodulePrefix(filePath);

    if (!_.isFunction(callback)) {
      throw new Error("Must be called with a callback function");
    }

    // Make the async blame call on the git repo
    repoUtil.blame(filePath, function (err, blame) {
      callback(err, blame);
    });
  },

  /**
   * Utility to get the GitCommander repository for the given filePath. Takes into
   * account whether the file is part of a submodule and returns that repository
   * if necessary.
   *
   * @param {string} filePath - the path to the file in question.
   */
  repoUtilForPath: function repoUtilForPath(filePath) {
    var submodules = this.repo.submodules;

    // By default, we return the root GitCommander repository.
    var repoUtil = this.tools.root;

    // if we have submodules, loop through them and see if the given file path
    // belongs inside one of the repositories. If so, we return the GitCommander repo
    // for that submodule.
    if (submodules) {
      for (var submodulePath in submodules) {
        var submoduleRegex = new RegExp("^" + submodulePath);
        if (submoduleRegex.test(filePath)) {
          repoUtil = this.tools[submodulePath];
        }
      }
    }

    return repoUtil;
  },

  /**
   * If the file path given is inside a submodule, removes the submodule
   * directory prefix.
   *
   * @param {string} filePath - path to file to relativize
   * @param {Repo} toolsRepo - git-tools Repo
   */
  removeSubmodulePrefix: function removeSubmodulePrefix(filePath) {
    var submodules = this.repo.submodules;
    if (submodules) {
      for (var submodulePath in submodules) {
        var submoduleRegex = new RegExp("^" + submodulePath);
        if (submoduleRegex.test(filePath)) {
          filePath = filePath.replace(submoduleRegex, "");
        }
      }
    }

    // remove leading '/' if there is one before returning
    filePath = filePath.replace(/^\//, "");
    return filePath;
  }

});

// ================
// Exports
// ================

module.exports = Blamer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9ibGFtZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2hDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQVcvQyxJQUFJLE1BQU0sR0FBRyxnQkFBUyxJQUFJLEVBQUU7QUFDMUIsTUFBSSxDQUFDLElBQUksRUFBRTtBQUNULFVBQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztHQUNqRTs7QUFFRCxNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Q0FDbkIsQ0FBQzs7Ozs7O0FBTUYsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFOzs7Ozs7QUFNekIsWUFBVSxFQUFFLHNCQUFXO0FBQ3JCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDOztBQUVwRSxRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxRQUFJLFVBQVUsRUFBRTtBQUNkLFdBQUssSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFO0FBQ3BDLFlBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQztPQUNyRztLQUNGO0dBQ0Y7Ozs7Ozs7O0FBUUQsT0FBSyxFQUFFLGVBQVMsUUFBUSxFQUFFLFFBQVEsRUFBRTs7QUFFbEMsWUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFFBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7QUFJOUMsWUFBUSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFaEQsUUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0IsWUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0tBQzVEOzs7QUFHRCxZQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDNUMsY0FBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN0QixDQUFDLENBQUM7R0FDSjs7Ozs7Ozs7O0FBU0QsaUJBQWUsRUFBRSx5QkFBUyxRQUFRLEVBQUU7QUFDbEMsUUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7OztBQUd0QyxRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7Ozs7QUFLL0IsUUFBSSxVQUFVLEVBQUU7QUFDZCxXQUFLLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxZQUFJLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFDckQsWUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLGtCQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN0QztPQUNGO0tBQ0Y7O0FBRUQsV0FBTyxRQUFRLENBQUM7R0FDakI7Ozs7Ozs7OztBQVNELHVCQUFxQixFQUFFLCtCQUFTLFFBQVEsRUFBRTtBQUN4QyxRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxRQUFJLFVBQVUsRUFBRTtBQUNkLFdBQUssSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFO0FBQ3BDLFlBQUksY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQztBQUNyRCxZQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsa0JBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqRDtPQUNGO0tBQ0Y7OztBQUdELFlBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QyxXQUFPLFFBQVEsQ0FBQztHQUNqQjs7Q0FFRixDQUFDLENBQUM7Ozs7OztBQU1ILE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9ibGFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuY29uc3QgR2l0Q29tbWFuZGVyID0gcmVxdWlyZSgnLi9naXRDb21tYW5kZXInKTtcblxuLyoqXG4gKiBAbW9kdWxlIEJsYW1lclxuICpcbiAqIEJsYW1lciBpcyBhIENsYXNzIHRoYXQgc2hvdWxkIGJlIGluc3RhbnRpYXRlZCB3aXRoIGFuIGF0b20gJ0dpdCcgb2JqZWN0XG4gKiBmb3IgdGhlIHJvb3QgcmVwb3NpdG9yeSBpbiB0aGUgcHJvamVjdC5cbiAqXG4gKiBAcGFyYW0ge0dpdH0gcmVwbyAtIGFuIGluc3RhbmNlIG9mICdHaXQnIGNsYXNzIGZyb20gYXRvbSB3b3Jrc3BhY2UuIFNlZVxuICogICBodHRwczovL2F0b20uaW8vZG9jcy9hcGkvdjAuOTIuMC9hcGkvIGZvciBtb3JlIGluZm8uXG4gKi9cbnZhciBCbGFtZXIgPSBmdW5jdGlvbihyZXBvKSB7XG4gIGlmICghcmVwbykge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIEJsYW1lciB3aXRob3V0IGEgcmVwb3NpdG9yeS4nKTtcbiAgfVxuXG4gIHRoaXMucmVwbyA9IHJlcG87XG4gIHRoaXMuaW5pdGlhbGl6ZSgpO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PVxuLy8gSW5zdGFuY2UgTWV0aG9kc1xuLy8gPT09PT09PT09PT09PT09PVxuXG5fLmV4dGVuZChCbGFtZXIucHJvdG90eXBlLCB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoaXMgQmxhbWVyIGluc3RhbmNlLCBieSBjcmVhdGluZyBnaXQtdG9vbHMgcmVwb3MgZm9yIHRoZSByb290XG4gICAqIHJlcG9zaXRvcnkgYW5kIHN1Ym1vZHVsZXMuXG4gICAqL1xuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRvb2xzID0ge307XG4gICAgdGhpcy50b29scy5yb290ID0gbmV3IEdpdENvbW1hbmRlcih0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKTtcblxuICAgIHZhciBzdWJtb2R1bGVzID0gdGhpcy5yZXBvLnN1Ym1vZHVsZXM7XG4gICAgaWYgKHN1Ym1vZHVsZXMpIHtcbiAgICAgIGZvciAodmFyIHN1Ym1vZHVsZVBhdGggaW4gc3VibW9kdWxlcykge1xuICAgICAgICB0aGlzLnRvb2xzW3N1Ym1vZHVsZVBhdGhdID0gbmV3IEdpdENvbW1hbmRlcih0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpICsgJy8nICsgc3VibW9kdWxlUGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBCbGFtZXMgdGhlIGdpdmVuIGZpbGVQYXRoIGFuZCBjYWxscyBjYWxsYmFjayB3aXRoIGJsYW1lIGxpbmVzIG9yIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBmaWxlUGF0aCB0byBibGFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIHRvIGNhbGwgYmFjayB3aXRoIGJsYW1lIGRhdGFcbiAgICovXG4gIGJsYW1lOiBmdW5jdGlvbihmaWxlUGF0aCwgY2FsbGJhY2spIHtcbiAgICAvLyBFbnN1cmUgZmlsZSBwYXRoIGlzIHJlbGF0aXZlIHRvIHJvb3QgcmVwb1xuICAgIGZpbGVQYXRoID0gdGhpcy5yZXBvLnJlbGF0aXZpemUoZmlsZVBhdGgpO1xuICAgIHZhciByZXBvVXRpbCA9IHRoaXMucmVwb1V0aWxGb3JQYXRoKGZpbGVQYXRoKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IGlmIHRoaXMgZmlsZSBpcyBpbiBhIHN1Ym1vZHVsZSwgd2UgcmVtb3ZlIHRoZSBzdWJtb2R1bGUgZGlyXG4gICAgLy8gZnJvbSB0aGUgcGF0aFxuICAgIGZpbGVQYXRoID0gdGhpcy5yZW1vdmVTdWJtb2R1bGVQcmVmaXgoZmlsZVBhdGgpO1xuXG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgYmUgY2FsbGVkIHdpdGggYSBjYWxsYmFjayBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIC8vIE1ha2UgdGhlIGFzeW5jIGJsYW1lIGNhbGwgb24gdGhlIGdpdCByZXBvXG4gICAgcmVwb1V0aWwuYmxhbWUoZmlsZVBhdGgsIGZ1bmN0aW9uKGVyciwgYmxhbWUpIHtcbiAgICAgIGNhbGxiYWNrKGVyciwgYmxhbWUpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGdldCB0aGUgR2l0Q29tbWFuZGVyIHJlcG9zaXRvcnkgZm9yIHRoZSBnaXZlbiBmaWxlUGF0aC4gVGFrZXMgaW50b1xuICAgKiBhY2NvdW50IHdoZXRoZXIgdGhlIGZpbGUgaXMgcGFydCBvZiBhIHN1Ym1vZHVsZSBhbmQgcmV0dXJucyB0aGF0IHJlcG9zaXRvcnlcbiAgICogaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSB0aGUgcGF0aCB0byB0aGUgZmlsZSBpbiBxdWVzdGlvbi5cbiAgICovXG4gIHJlcG9VdGlsRm9yUGF0aDogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICB2YXIgc3VibW9kdWxlcyA9IHRoaXMucmVwby5zdWJtb2R1bGVzO1xuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2UgcmV0dXJuIHRoZSByb290IEdpdENvbW1hbmRlciByZXBvc2l0b3J5LlxuICAgIHZhciByZXBvVXRpbCA9IHRoaXMudG9vbHMucm9vdDtcblxuICAgIC8vIGlmIHdlIGhhdmUgc3VibW9kdWxlcywgbG9vcCB0aHJvdWdoIHRoZW0gYW5kIHNlZSBpZiB0aGUgZ2l2ZW4gZmlsZSBwYXRoXG4gICAgLy8gYmVsb25ncyBpbnNpZGUgb25lIG9mIHRoZSByZXBvc2l0b3JpZXMuIElmIHNvLCB3ZSByZXR1cm4gdGhlIEdpdENvbW1hbmRlciByZXBvXG4gICAgLy8gZm9yIHRoYXQgc3VibW9kdWxlLlxuICAgIGlmIChzdWJtb2R1bGVzKSB7XG4gICAgICBmb3IgKHZhciBzdWJtb2R1bGVQYXRoIGluIHN1Ym1vZHVsZXMpIHtcbiAgICAgICAgdmFyIHN1Ym1vZHVsZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyBzdWJtb2R1bGVQYXRoKTtcbiAgICAgICAgaWYgKHN1Ym1vZHVsZVJlZ2V4LnRlc3QoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgcmVwb1V0aWwgPSB0aGlzLnRvb2xzW3N1Ym1vZHVsZVBhdGhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcG9VdGlsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJZiB0aGUgZmlsZSBwYXRoIGdpdmVuIGlzIGluc2lkZSBhIHN1Ym1vZHVsZSwgcmVtb3ZlcyB0aGUgc3VibW9kdWxlXG4gICAqIGRpcmVjdG9yeSBwcmVmaXguXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIHBhdGggdG8gZmlsZSB0byByZWxhdGl2aXplXG4gICAqIEBwYXJhbSB7UmVwb30gdG9vbHNSZXBvIC0gZ2l0LXRvb2xzIFJlcG9cbiAgICovXG4gIHJlbW92ZVN1Ym1vZHVsZVByZWZpeDogZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICB2YXIgc3VibW9kdWxlcyA9IHRoaXMucmVwby5zdWJtb2R1bGVzO1xuICAgIGlmIChzdWJtb2R1bGVzKSB7XG4gICAgICBmb3IgKHZhciBzdWJtb2R1bGVQYXRoIGluIHN1Ym1vZHVsZXMpIHtcbiAgICAgICAgdmFyIHN1Ym1vZHVsZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyBzdWJtb2R1bGVQYXRoKTtcbiAgICAgICAgaWYgKHN1Ym1vZHVsZVJlZ2V4LnRlc3QoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5yZXBsYWNlKHN1Ym1vZHVsZVJlZ2V4LCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgbGVhZGluZyAnLycgaWYgdGhlcmUgaXMgb25lIGJlZm9yZSByZXR1cm5pbmdcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnJlcGxhY2UoL15cXC8vLCAnJyk7XG4gICAgcmV0dXJuIGZpbGVQYXRoO1xuICB9XG5cbn0pO1xuXG4vLyA9PT09PT09PT09PT09PT09XG4vLyBFeHBvcnRzXG4vLyA9PT09PT09PT09PT09PT09XG5cbm1vZHVsZS5leHBvcnRzID0gQmxhbWVyO1xuIl19