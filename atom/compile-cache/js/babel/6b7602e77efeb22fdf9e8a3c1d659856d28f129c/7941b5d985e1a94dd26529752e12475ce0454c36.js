var _ = require('underscore');
var child_process = require('child_process');
var blameFormatter = require('./blameFormatter');

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

    var stdout = '';
    var stderr = '';
    var child = child_process.spawn('git', args, { cwd: this.workingDirectory });
    var processError;

    child.stdout.on('data', function (data) {
      stdout += data;
    });

    child.stderr.on('data', function (data) {
      stderr += data;
    });

    child.on('error', function (error) {
      processError = error;
    });

    child.on('close', function (errorCode) {
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
    var args = ['blame', '--line-porcelain'];

    // ignore white space based on config
    if (atom.config.get('git-blame.ignoreWhiteSpaceDiffs')) {
      args.push('-w');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9naXRDb21tYW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2hDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMvQyxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7Ozs7OztBQU9uRCxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDMUIsTUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztDQUM5Qjs7Ozs7O0FBTUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFOzs7Ozs7Ozs7QUFTL0IsTUFBSSxFQUFFLGNBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM3QixRQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDL0MsYUFBTztLQUNSOztBQUVELFFBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixRQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7QUFDM0UsUUFBSSxZQUFZLENBQUM7O0FBRWpCLFNBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRTtBQUNyQyxZQUFNLElBQUksSUFBSSxDQUFDO0tBQ2hCLENBQUMsQ0FBQzs7QUFFSCxTQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxJQUFJLEVBQUU7QUFDckMsWUFBTSxJQUFJLElBQUksQ0FBQztLQUNoQixDQUFDLENBQUM7O0FBRUgsU0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUU7QUFDaEMsa0JBQVksR0FBRyxLQUFLLENBQUM7S0FDdEIsQ0FBQyxDQUFDOztBQUVILFNBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsU0FBUyxFQUFFO0FBQ3BDLFVBQUksWUFBWSxFQUFFO0FBQ2hCLGVBQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQy9COztBQUVELFVBQUksU0FBUyxFQUFFO0FBQ2IsWUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsYUFBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdkIsZUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDeEI7O0FBRUQsYUFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0tBQzNDLENBQUMsQ0FBQztHQUNKOzs7Ozs7Ozs7QUFTRCxPQUFLLEVBQUUsZUFBUyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQ2xDLFFBQUksSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUM7OztBQUd6QyxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLEVBQUU7QUFDdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqQjs7QUFFRCxRQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHcEIsUUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ25DLFVBQUksR0FBRyxFQUFFO0FBQ1AsZUFBTyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzdCOztBQUVELGFBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDekQsQ0FBQyxDQUFDO0dBQ0o7Q0FDRixDQUFDLENBQUM7Ozs7OztBQU1ILE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9naXRDb21tYW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuY29uc3QgY2hpbGRfcHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IGJsYW1lRm9ybWF0dGVyID0gcmVxdWlyZSgnLi9ibGFtZUZvcm1hdHRlcicpO1xuXG4vKipcbiAqIEBtb2R1bGUgR2l0Q29tbWFuZGVyXG4gKlxuICogVXRpbGl0eSBmb3IgZXhlY3V0aW5nIGdpdCBjb21tYW5kcyBvbiBhIHJlcG8gaW4gYSBnaXZlbiB3b3JraW5nIGRpcmVjdG9yeS5cbiAqL1xuZnVuY3Rpb24gR2l0Q29tbWFuZGVyKHBhdGgpIHtcbiAgdGhpcy53b3JraW5nRGlyZWN0b3J5ID0gcGF0aDtcbn1cblxuLy8gPT09PT09PT09PT09PT09PVxuLy8gSW5zdGFuY2UgTWV0aG9kc1xuLy8gPT09PT09PT09PT09PT09PVxuXG5fLmV4dGVuZChHaXRDb21tYW5kZXIucHJvdG90eXBlLCB7XG5cbiAgLyoqXG4gICAqIFNwYXducyBhIHByb2Nlc3MgdG8gZXhlY3V0ZSBhIGdpdCBjb21tYW5kIGluIHRoZSBHaXRDb21tYW5kZXIgaW5zdGFuY2VzXG4gICAqIHdvcmtpbmcgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5fHN0cmluZ30gYXJncyAtIGFyZ3VtZW50cyB0byBjYWxsIGBnaXRgIHdpdGggb24gdGhlIGNvbW1hbmQgbGluZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIG5vZGUgY2FsbGJhY2sgZm9yIGVycm9yIGFuZCBjb21tYW5kIG91dHB1dFxuICAgKi9cbiAgZXhlYzogZnVuY3Rpb24oYXJncywgY2FsbGJhY2spIHtcbiAgICBpZiAoIV8uaXNBcnJheShhcmdzKSB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzdGRvdXQgPSAnJztcbiAgICB2YXIgc3RkZXJyID0gJyc7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRfcHJvY2Vzcy5zcGF3bignZ2l0JywgYXJncywge2N3ZDogdGhpcy53b3JraW5nRGlyZWN0b3J5fSk7XG4gICAgdmFyIHByb2Nlc3NFcnJvcjtcblxuICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHN0ZG91dCArPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc3RkZXJyICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgcHJvY2Vzc0Vycm9yID0gZXJyb3I7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbignY2xvc2UnLCBmdW5jdGlvbihlcnJvckNvZGUpIHtcbiAgICAgIGlmIChwcm9jZXNzRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHByb2Nlc3NFcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvckNvZGUpIHtcbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKHN0ZGVycik7XG4gICAgICAgIGVycm9yLmNvZGUgPSBlcnJvckNvZGU7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBzdGRvdXQudHJpbVJpZ2h0KCkpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBnaXQgYmxhbWUgb24gdGhlIGlucHV0IGZpbGUgaW4gdGhlIGluc3RhbmNlcyB3b3JraW5nIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWUgLSBuYW1lIG9mIGZpbGUgdG8gYmxhbWUsIHJlbGF0aXZlIHRvIHRoZSByZXBvc1xuICAgKiAgIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVudGlvbiB0byBjYWxsIHdpdGggcmVzdWx0cyBvciBlcnJvclxuICAgKi9cbiAgYmxhbWU6IGZ1bmN0aW9uKGZpbGVOYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBhcmdzID0gWydibGFtZScsICctLWxpbmUtcG9yY2VsYWluJ107XG5cbiAgICAvLyBpZ25vcmUgd2hpdGUgc3BhY2UgYmFzZWQgb24gY29uZmlnXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmlnbm9yZVdoaXRlU3BhY2VEaWZmcycpKSB7XG4gICAgICBhcmdzLnB1c2goJy13Jyk7XG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGZpbGVOYW1lKTtcblxuICAgIC8vIEV4ZWN1dGUgYmxhbWUgY29tbWFuZCBhbmQgcGFyc2VcbiAgICB0aGlzLmV4ZWMoYXJncywgZnVuY3Rpb24oZXJyLCBibGFtZSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBibGFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBibGFtZUZvcm1hdHRlci5wYXJzZUJsYW1lKGJsYW1lKSk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4vLyA9PT09PT09PT09PT09PT09XG4vLyBFeHBvcnRzXG4vLyA9PT09PT09PT09PT09PT09XG5cbm1vZHVsZS5leHBvcnRzID0gR2l0Q29tbWFuZGVyO1xuIl19