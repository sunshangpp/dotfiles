var _ = require("underscore");
var child_process = require("child_process");

// formatters
var blameFormatter = require("./blameFormatter");

/**
 * @module GitCommander
 *
 * Utility for executing git commands on a repo in a given working directory.
 */
function GitCommander(path) {
  this.workingDirectory = path;
}

// ================
// Instance Methods
// ================

_.extend(GitCommander.prototype, {

  /**
   * Spawns a process to execute a git command in the GitCommander instances
   * working directory.
   *
   * @param {array|string} args - arguments to call `git` with on the command line
   * @param {function} callback - node callback for error and command output
   */
  exec: function exec(args, callback) {
    if (!_.isArray(args) || !_.isFunction(callback)) {
      return;
    }

    var stdout = "";
    var stderr = "";
    var child = child_process.spawn("git", args, { cwd: this.workingDirectory });
    var processError;

    child.stdout.on("data", function (data) {
      stdout += data;
    });

    child.stderr.on("data", function (data) {
      stderr += data;
    });

    child.on("error", function (error) {
      processError = error;
    });

    child.on("close", function (errorCode) {
      if (processError) {
        return callback(processError);
      }

      if (errorCode) {
        var error = new Error(stderr);
        error.code = errorCode;
        return callback(error);
      }

      return callback(null, stdout.trimRight());
    });
  },

  /**
   * Executes git blame on the input file in the instances working directory
   *
   * @param {string} fileName - name of file to blame, relative to the repos
   *   working directory
   * @param {function} callback - callback funtion to call with results or error
   */
  blame: function blame(fileName, callback) {
    var args = ["blame", "--line-porcelain"];

    // ignore white space based on config
    if (atom.config.get("git-blame.ignoreWhiteSpaceDiffs")) {
      args.push("-w");
    }

    args.push(fileName);

    // Execute blame command and parse
    this.exec(args, function (err, blame) {
      if (err) {
        return callback(err, blame);
      }

      return callback(null, blameFormatter.parseBlame(blame));
    });
  }
});

// ================
// Exports
// ================

module.exports = GitCommander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9naXRDb21tYW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2hDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7O0FBRy9DLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7Ozs7O0FBT25ELFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUMxQixNQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0NBQzlCOzs7Ozs7QUFNRCxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7Ozs7Ozs7OztBQVMvQixNQUFJLEVBQUUsY0FBUyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFFBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvQyxhQUFPO0tBQ1I7O0FBRUQsUUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQztBQUMzRSxRQUFJLFlBQVksQ0FBQzs7QUFFakIsU0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQ3JDLFlBQU0sSUFBSSxJQUFJLENBQUM7S0FDaEIsQ0FBQyxDQUFDOztBQUVILFNBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRTtBQUNyQyxZQUFNLElBQUksSUFBSSxDQUFDO0tBQ2hCLENBQUMsQ0FBQzs7QUFFSCxTQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRTtBQUNoQyxrQkFBWSxHQUFHLEtBQUssQ0FBQztLQUN0QixDQUFDLENBQUM7O0FBRUgsU0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxTQUFTLEVBQUU7QUFDcEMsVUFBSSxZQUFZLEVBQUU7QUFDaEIsZUFBTyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDL0I7O0FBRUQsVUFBSSxTQUFTLEVBQUU7QUFDYixZQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixhQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN2QixlQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN4Qjs7QUFFRCxhQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDM0MsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7OztBQVNELE9BQUssRUFBRSxlQUFTLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDbEMsUUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7O0FBR3pDLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsRUFBRTtBQUN0RCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pCOztBQUVELFFBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUdwQixRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDbkMsVUFBSSxHQUFHLEVBQUU7QUFDUCxlQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDN0I7O0FBRUQsYUFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN6RCxDQUFDLENBQUM7R0FDSjtDQUNGLENBQUMsQ0FBQzs7Ozs7O0FBTUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL2dpdENvbW1hbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5jb25zdCBjaGlsZF9wcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuXG4vLyBmb3JtYXR0ZXJzXG5jb25zdCBibGFtZUZvcm1hdHRlciA9IHJlcXVpcmUoJy4vYmxhbWVGb3JtYXR0ZXInKTtcblxuLyoqXG4gKiBAbW9kdWxlIEdpdENvbW1hbmRlclxuICpcbiAqIFV0aWxpdHkgZm9yIGV4ZWN1dGluZyBnaXQgY29tbWFuZHMgb24gYSByZXBvIGluIGEgZ2l2ZW4gd29ya2luZyBkaXJlY3RvcnkuXG4gKi9cbmZ1bmN0aW9uIEdpdENvbW1hbmRlcihwYXRoKSB7XG4gIHRoaXMud29ya2luZ0RpcmVjdG9yeSA9IHBhdGg7XG59XG5cbi8vID09PT09PT09PT09PT09PT1cbi8vIEluc3RhbmNlIE1ldGhvZHNcbi8vID09PT09PT09PT09PT09PT1cblxuXy5leHRlbmQoR2l0Q29tbWFuZGVyLnByb3RvdHlwZSwge1xuXG4gIC8qKlxuICAgKiBTcGF3bnMgYSBwcm9jZXNzIHRvIGV4ZWN1dGUgYSBnaXQgY29tbWFuZCBpbiB0aGUgR2l0Q29tbWFuZGVyIGluc3RhbmNlc1xuICAgKiB3b3JraW5nIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheXxzdHJpbmd9IGFyZ3MgLSBhcmd1bWVudHMgdG8gY2FsbCBgZ2l0YCB3aXRoIG9uIHRoZSBjb21tYW5kIGxpbmVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBub2RlIGNhbGxiYWNrIGZvciBlcnJvciBhbmQgY29tbWFuZCBvdXRwdXRcbiAgICovXG4gIGV4ZWM6IGZ1bmN0aW9uKGFyZ3MsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoYXJncykgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc3Rkb3V0ID0gJyc7XG4gICAgdmFyIHN0ZGVyciA9ICcnO1xuICAgIHZhciBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2dpdCcsIGFyZ3MsIHtjd2Q6IHRoaXMud29ya2luZ0RpcmVjdG9yeX0pO1xuICAgIHZhciBwcm9jZXNzRXJyb3I7XG5cbiAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzdGRvdXQgKz0gZGF0YTtcbiAgICB9KTtcblxuICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHN0ZGVyciArPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgY2hpbGQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIHByb2Nlc3NFcnJvciA9IGVycm9yO1xuICAgIH0pO1xuXG4gICAgY2hpbGQub24oJ2Nsb3NlJywgZnVuY3Rpb24oZXJyb3JDb2RlKSB7XG4gICAgICBpZiAocHJvY2Vzc0Vycm9yKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhwcm9jZXNzRXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JDb2RlKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcihzdGRlcnIpO1xuICAgICAgICBlcnJvci5jb2RlID0gZXJyb3JDb2RlO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgc3Rkb3V0LnRyaW1SaWdodCgpKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogRXhlY3V0ZXMgZ2l0IGJsYW1lIG9uIHRoZSBpbnB1dCBmaWxlIGluIHRoZSBpbnN0YW5jZXMgd29ya2luZyBkaXJlY3RvcnlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lIC0gbmFtZSBvZiBmaWxlIHRvIGJsYW1lLCByZWxhdGl2ZSB0byB0aGUgcmVwb3NcbiAgICogICB3b3JraW5nIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bnRpb24gdG8gY2FsbCB3aXRoIHJlc3VsdHMgb3IgZXJyb3JcbiAgICovXG4gIGJsYW1lOiBmdW5jdGlvbihmaWxlTmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgYXJncyA9IFsnYmxhbWUnLCAnLS1saW5lLXBvcmNlbGFpbiddO1xuXG4gICAgLy8gaWdub3JlIHdoaXRlIHNwYWNlIGJhc2VkIG9uIGNvbmZpZ1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5pZ25vcmVXaGl0ZVNwYWNlRGlmZnMnKSkge1xuICAgICAgYXJncy5wdXNoKCctdycpO1xuICAgIH1cblxuICAgIGFyZ3MucHVzaChmaWxlTmFtZSk7XG5cbiAgICAvLyBFeGVjdXRlIGJsYW1lIGNvbW1hbmQgYW5kIHBhcnNlXG4gICAgdGhpcy5leGVjKGFyZ3MsIGZ1bmN0aW9uKGVyciwgYmxhbWUpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgYmxhbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgYmxhbWVGb3JtYXR0ZXIucGFyc2VCbGFtZShibGFtZSkpO1xuICAgIH0pO1xuICB9XG59KTtcblxuLy8gPT09PT09PT09PT09PT09PVxuLy8gRXhwb3J0c1xuLy8gPT09PT09PT09PT09PT09PVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpdENvbW1hbmRlcjtcbiJdfQ==