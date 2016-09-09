Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

// Gets a dump of the user's configured shell environment.
//
// Returns the output of the `env` command or `undefined` if there was an error.
'use babel';

function getRawShellEnv() {
  var shell = getUserShell();

  // The `-ilc` set of options was tested to work with the OS X v10.11
  // default-installed versions of bash, zsh, sh, and ksh. It *does not*
  // work with csh or tcsh.
  var results = (0, _child_process.spawnSync)(shell, ['-ilc', 'env'], { encoding: 'utf8' });
  if (results.error || !results.stdout || results.stdout.length <= 0) {
    return;
  }

  return results.stdout;
}

function getUserShell() {
  if (process.env.SHELL) {
    return process.env.SHELL;
  }

  return '/bin/bash';
}

// Gets the user's configured shell environment.
//
// Returns a copy of the user's shell enviroment.
function getFromShell() {
  var shellEnvText = getRawShellEnv();
  if (!shellEnvText) {
    return;
  }

  var env = {};

  for (var line of shellEnvText.split(_os2['default'].EOL)) {
    if (line.includes('=')) {
      var components = line.split('=');
      if (components.length === 2) {
        env[components[0]] = components[1];
      } else {
        var k = components.shift();
        var v = components.join('=');
        env[k] = v;
      }
    }
  }

  return env;
}

function needsPatching() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? { platform: process.platform, env: process.env } : arguments[0];

  if (options.platform === 'darwin' && !options.env.PWD) {
    var shell = getUserShell();
    if (shell.endsWith('csh') || shell.endsWith('tcsh')) {
      return false;
    }
    return true;
  }

  return false;
}

function normalize() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options && options.env) {
    process.env = options.env;
  }

  if (!options.env) {
    options.env = process.env;
  }

  if (!options.platform) {
    options.platform = process.platform;
  }

  if (needsPatching(options)) {
    // Patch the `process.env` on startup to fix the problem first documented
    // in #4126. Retain the original in case someone needs it.
    var shellEnv = getFromShell();
    if (shellEnv && shellEnv.PATH) {
      process._originalEnv = process.env;
      process.env = shellEnv;
    }
  }
}

exports['default'] = { getFromShell: getFromShell, needsPatching: needsPatching, normalize: normalize };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2Vudmlyb25tZW50L2xpYi9lbnZpcm9ubWVudC1oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs2QkFFd0IsZUFBZTs7a0JBQ3hCLElBQUk7Ozs7Ozs7QUFIbkIsV0FBVyxDQUFBOztBQVFYLFNBQVMsY0FBYyxHQUFJO0FBQ3pCLE1BQUksS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFBOzs7OztBQUsxQixNQUFJLE9BQU8sR0FBRyw4QkFBVSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQTtBQUNuRSxNQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUNsRSxXQUFNO0dBQ1A7O0FBRUQsU0FBTyxPQUFPLENBQUMsTUFBTSxDQUFBO0NBQ3RCOztBQUVELFNBQVMsWUFBWSxHQUFJO0FBQ3ZCLE1BQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDckIsV0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQTtHQUN6Qjs7QUFFRCxTQUFPLFdBQVcsQ0FBQTtDQUNuQjs7Ozs7QUFLRCxTQUFTLFlBQVksR0FBSTtBQUN2QixNQUFJLFlBQVksR0FBRyxjQUFjLEVBQUUsQ0FBQTtBQUNuQyxNQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2pCLFdBQU07R0FDUDs7QUFFRCxNQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7O0FBRVosT0FBSyxJQUFJLElBQUksSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLGdCQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQzNDLFFBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0QixVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDM0IsV0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNuQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzFCLFlBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDNUIsV0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUNYO0tBQ0Y7R0FDRjs7QUFFRCxTQUFPLEdBQUcsQ0FBQTtDQUNYOztBQUVELFNBQVMsYUFBYSxHQUE4RDtNQUE1RCxPQUFPLHlEQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7O0FBQ2hGLE1BQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNyRCxRQUFJLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQTtBQUMxQixRQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNuRCxhQUFPLEtBQUssQ0FBQTtLQUNiO0FBQ0QsV0FBTyxJQUFJLENBQUE7R0FDWjs7QUFFRCxTQUFPLEtBQUssQ0FBQTtDQUNiOztBQUVELFNBQVMsU0FBUyxHQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDOUIsTUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMxQixXQUFPLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUE7R0FDMUI7O0FBRUQsTUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDaEIsV0FBTyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFBO0dBQzFCOztBQUVELE1BQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3JCLFdBQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQTtHQUNwQzs7QUFFRCxNQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTs7O0FBRzFCLFFBQUksUUFBUSxHQUFHLFlBQVksRUFBRSxDQUFBO0FBQzdCLFFBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsYUFBTyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFBO0FBQ2xDLGFBQU8sQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFBO0tBQ3ZCO0dBQ0Y7Q0FDRjs7cUJBRWMsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLGFBQWEsRUFBYixhQUFhLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9lbnZpcm9ubWVudC9saWIvZW52aXJvbm1lbnQtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7c3Bhd25TeW5jfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuXG4vLyBHZXRzIGEgZHVtcCBvZiB0aGUgdXNlcidzIGNvbmZpZ3VyZWQgc2hlbGwgZW52aXJvbm1lbnQuXG4vL1xuLy8gUmV0dXJucyB0aGUgb3V0cHV0IG9mIHRoZSBgZW52YCBjb21tYW5kIG9yIGB1bmRlZmluZWRgIGlmIHRoZXJlIHdhcyBhbiBlcnJvci5cbmZ1bmN0aW9uIGdldFJhd1NoZWxsRW52ICgpIHtcbiAgbGV0IHNoZWxsID0gZ2V0VXNlclNoZWxsKClcblxuICAvLyBUaGUgYC1pbGNgIHNldCBvZiBvcHRpb25zIHdhcyB0ZXN0ZWQgdG8gd29yayB3aXRoIHRoZSBPUyBYIHYxMC4xMVxuICAvLyBkZWZhdWx0LWluc3RhbGxlZCB2ZXJzaW9ucyBvZiBiYXNoLCB6c2gsIHNoLCBhbmQga3NoLiBJdCAqZG9lcyBub3QqXG4gIC8vIHdvcmsgd2l0aCBjc2ggb3IgdGNzaC5cbiAgbGV0IHJlc3VsdHMgPSBzcGF3blN5bmMoc2hlbGwsIFsnLWlsYycsICdlbnYnXSwge2VuY29kaW5nOiAndXRmOCd9KVxuICBpZiAocmVzdWx0cy5lcnJvciB8fCAhcmVzdWx0cy5zdGRvdXQgfHwgcmVzdWx0cy5zdGRvdXQubGVuZ3RoIDw9IDApIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiByZXN1bHRzLnN0ZG91dFxufVxuXG5mdW5jdGlvbiBnZXRVc2VyU2hlbGwgKCkge1xuICBpZiAocHJvY2Vzcy5lbnYuU0hFTEwpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuU0hFTExcbiAgfVxuXG4gIHJldHVybiAnL2Jpbi9iYXNoJ1xufVxuXG4vLyBHZXRzIHRoZSB1c2VyJ3MgY29uZmlndXJlZCBzaGVsbCBlbnZpcm9ubWVudC5cbi8vXG4vLyBSZXR1cm5zIGEgY29weSBvZiB0aGUgdXNlcidzIHNoZWxsIGVudmlyb21lbnQuXG5mdW5jdGlvbiBnZXRGcm9tU2hlbGwgKCkge1xuICBsZXQgc2hlbGxFbnZUZXh0ID0gZ2V0UmF3U2hlbGxFbnYoKVxuICBpZiAoIXNoZWxsRW52VGV4dCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgbGV0IGVudiA9IHt9XG5cbiAgZm9yIChsZXQgbGluZSBvZiBzaGVsbEVudlRleHQuc3BsaXQob3MuRU9MKSkge1xuICAgIGlmIChsaW5lLmluY2x1ZGVzKCc9JykpIHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gbGluZS5zcGxpdCgnPScpXG4gICAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgZW52W2NvbXBvbmVudHNbMF1dID0gY29tcG9uZW50c1sxXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGsgPSBjb21wb25lbnRzLnNoaWZ0KClcbiAgICAgICAgbGV0IHYgPSBjb21wb25lbnRzLmpvaW4oJz0nKVxuICAgICAgICBlbnZba10gPSB2XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVudlxufVxuXG5mdW5jdGlvbiBuZWVkc1BhdGNoaW5nIChvcHRpb25zID0geyBwbGF0Zm9ybTogcHJvY2Vzcy5wbGF0Zm9ybSwgZW52OiBwcm9jZXNzLmVudiB9KSB7XG4gIGlmIChvcHRpb25zLnBsYXRmb3JtID09PSAnZGFyd2luJyAmJiAhb3B0aW9ucy5lbnYuUFdEKSB7XG4gICAgbGV0IHNoZWxsID0gZ2V0VXNlclNoZWxsKClcbiAgICBpZiAoc2hlbGwuZW5kc1dpdGgoJ2NzaCcpIHx8IHNoZWxsLmVuZHNXaXRoKCd0Y3NoJykpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZW52KSB7XG4gICAgcHJvY2Vzcy5lbnYgPSBvcHRpb25zLmVudlxuICB9XG5cbiAgaWYgKCFvcHRpb25zLmVudikge1xuICAgIG9wdGlvbnMuZW52ID0gcHJvY2Vzcy5lbnZcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5wbGF0Zm9ybSkge1xuICAgIG9wdGlvbnMucGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtXG4gIH1cblxuICBpZiAobmVlZHNQYXRjaGluZyhvcHRpb25zKSkge1xuICAgIC8vIFBhdGNoIHRoZSBgcHJvY2Vzcy5lbnZgIG9uIHN0YXJ0dXAgdG8gZml4IHRoZSBwcm9ibGVtIGZpcnN0IGRvY3VtZW50ZWRcbiAgICAvLyBpbiAjNDEyNi4gUmV0YWluIHRoZSBvcmlnaW5hbCBpbiBjYXNlIHNvbWVvbmUgbmVlZHMgaXQuXG4gICAgbGV0IHNoZWxsRW52ID0gZ2V0RnJvbVNoZWxsKClcbiAgICBpZiAoc2hlbGxFbnYgJiYgc2hlbGxFbnYuUEFUSCkge1xuICAgICAgcHJvY2Vzcy5fb3JpZ2luYWxFbnYgPSBwcm9jZXNzLmVudlxuICAgICAgcHJvY2Vzcy5lbnYgPSBzaGVsbEVudlxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7IGdldEZyb21TaGVsbCwgbmVlZHNQYXRjaGluZywgbm9ybWFsaXplIH1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/environment/lib/environment-helpers.js
