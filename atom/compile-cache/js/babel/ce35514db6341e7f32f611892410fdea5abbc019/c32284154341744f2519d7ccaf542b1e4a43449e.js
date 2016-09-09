Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.runTests = runTests;
exports.runPackage = runPackage;
exports.stop = stop;
exports.addBreakpoint = addBreakpoint;
exports.removeBreakpoint = removeBreakpoint;
exports.toggleBreakpoint = toggleBreakpoint;
exports.updateBreakpointLine = updateBreakpointLine;
exports.command = command;
exports.restart = restart;
exports.selectStacktrace = selectStacktrace;
exports.selectGoroutine = selectGoroutine;
exports.isStarted = isStarted;
exports.dispose = dispose;
exports.get = get;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _jsonRpc2 = require('json-rpc2');

var _jsonRpc22 = _interopRequireDefault(_jsonRpc2);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _store = require('./store');

var _delveVariables = require('./delve-variables');

var DelveVariables = _interopRequireWildcard(_delveVariables);

'use babel';

var SERVER_URL = 'localhost';
var SERVER_PORT = 2345;
var RPC_ENDPOINT = 'RPCServer.';

var dlvProcess = undefined;
var dlvConnection = undefined;

function runTests(file) {
  return run(file, 'test');
}

function runPackage(file) {
  return run(file, 'debug');
}

function addOutputMessage(messageType, message) {
  _store.store && _store.store.dispatch({ type: 'ADD_OUTPUT_MESSAGE', messageType: messageType, message: message });
}

function run(file, method) {
  var _store$getState$delve = _store.store.getState().delve;

  var dlvPath = _store$getState$delve.path;
  var args = _store$getState$delve.args;
  var fileOverride = _store$getState$delve.fileOverride;

  // debug / test another file instead of the current one
  if (fileOverride) {
    var trimmedFile = fileOverride.trim();
    if (path.isAbsolute(trimmedFile)) {
      file = trimmedFile;
    } else {
      file = atom.project.resolvePath(trimmedFile);
    }
  }

  if (!dlvPath || dlvProcess || !file) {
    return;
  }

  var panelState = _store.store.getState().panel;
  if (!panelState.visible) {
    _store.store.dispatch({ type: 'TOGGLE_PANEL' });
  }

  _store.store.dispatch({ type: 'SET_STATE', state: 'starting' });

  var dlvArgs = [method, '--headless=true', '--listen=' + SERVER_URL + ':' + SERVER_PORT, '--log'];
  if (args && method !== 'test') {
    dlvArgs = dlvArgs.concat('--', splitArgs(args));
  }

  addOutputMessage('delve', 'Starting delve with "' + file + '" with "' + method + '"');
  dlvProcess = (0, _child_process.spawn)(dlvPath, dlvArgs, {
    cwd: path.dirname(file)
  });

  var rpcClient = undefined;
  dlvProcess.stderr.on('data', function (chunk) {
    addOutputMessage('delve', 'Delve output: ' + chunk.toString());
    if (!rpcClient) {
      rpcClient = _jsonRpc22['default'].Client.$create(SERVER_PORT, SERVER_URL);
      rpcClient.connectSocket(function (err, conn) {
        if (err) {
          addOutputMessage('delve', 'Failed to start delve\n\terror: ' + err);
          stop();
          return;
        }
        dlvConnection = conn;
        addOutputMessage('delve', 'Started delve with "' + file + '" with "' + method + '"');
        _store.store.dispatch({ type: 'SET_STATE', state: 'started' });
        Promise.all((0, _store.getBreakpoints)().map(function (bp) {
          return addBreakpoint(bp.file, bp.line);
        })).then(function () {
          command('continue');
        });
      });
    }
  });

  dlvProcess.stdout.on('data', function (chunk) {
    addOutputMessage('output', chunk.toString());
  });

  dlvProcess.on('close', function (code) {
    addOutputMessage('delve', 'delve closed with code ' + code);
    stop();
  });
  dlvProcess.on('error', function (err) {
    addOutputMessage('delve', 'error: ' + err);
    stop();
  });
}

function stop() {
  if (dlvConnection) {
    dlvConnection.end();
  }
  dlvConnection = null;

  if (dlvProcess) {
    dlvProcess.kill();
  }
  dlvProcess = null;

  _store.store && _store.store.dispatch({ type: 'STOP' });
}

function addBreakpoint(file, line) {
  if (!isStarted()) {
    _store.store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file: file, line: line, state: 'notStarted' } });
    return Promise.resolve();
  }

  var bp = (0, _store.getBreakpoint)(file, line);
  if (bp && bp.state === 'busy') {
    return Promise.resolve();
  }

  // note: delve requires 1 indexed line numbers whereas atom has 0 indexed
  var fileAndLine = file + ':' + (line + 1);
  addOutputMessage('delve', 'Adding breakpoint: ' + fileAndLine);
  _store.store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file: file, line: line } });
  return _addBreakpoint(file, line + 1).then(function (response) {
    addOutputMessage('delve', 'Added breakpoint: ' + fileAndLine);
    _store.store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file: file, line: line, id: response.id, state: 'valid' } });
  })['catch'](function (err) {
    addOutputMessage('delve', 'Adding breakpoint failed: ' + fileAndLine + '\n\terror: ' + err);
    _store.store.dispatch({ type: 'ADD_BREAKPOINT', bp: { file: file, line: line, state: 'invalid', message: err } });
  });
}

function _addBreakpoint(file, line) {
  return call('CreateBreakpoint', { file: file, line: line });
}

function removeBreakpoint(file, line) {
  var bp = (0, _store.getBreakpoint)(file, line);
  if (!bp) {
    return Promise.resolve();
  }

  function done() {
    _store.store.dispatch({ type: 'REMOVE_BREAKPOINT', bp: { file: file, line: line, state: 'removed' } });
  }

  if (bp.state === 'invalid' || !isStarted()) {
    return Promise.resolve().then(done);
  }

  var fileAndLine = file + ':' + (line + 1);
  addOutputMessage('delve', 'Removing breakpoint: ' + fileAndLine);
  _store.store.dispatch({ type: 'REMOVE_BREAKPOINT', bp: { file: file, line: line, state: 'busy' } });
  return _removeBreakpoint(bp.id).then(function () {
    return addOutputMessage('delve', 'Removed breakpoint: ' + fileAndLine);
  }).then(done);
}

function _removeBreakpoint(id) {
  return call('ClearBreakpoint', id);
}

function toggleBreakpoint(file, line) {
  var bp = (0, _store.getBreakpoint)(file, line);
  if (!bp) {
    return addBreakpoint(file, line);
  }
  return removeBreakpoint(file, line);
}

function updateBreakpointLine(file, line, newLine) {
  var bp = (0, _store.getBreakpoint)(file, line);
  if (!isStarted()) {
    // just update the breakpoint in the store
    _store.store.dispatch({ type: 'UPDATE_BREAKPOINT_LINE', bp: bp, newLine: newLine });
    return;
  }

  // remove and add the breakpoint, this also updates the store correctly
  _removeBreakpoint(bp.id).then(function () {
    return _addBreakpoint(file, newLine);
  });
}

// command executes the given command (like continue, step, next, ...)

function command(name) {
  if (!isStarted()) {
    return;
  }
  addOutputMessage('delve', 'Executing command ' + name);
  _store.store.dispatch({ type: 'SET_STATE', state: 'busy' });
  call('Command', { name: name }).then(function (newState) {
    if (newState.exited) {
      stop();
      return;
    }

    _store.store.dispatch({ type: 'SET_STATE', state: 'waiting' });

    selectGoroutine(newState.currentGoroutine.id);
    selectStacktrace(0);

    getGoroutines();
  });
}

// restart the delve session

function restart() {
  if (!isStarted()) {
    return;
  }
  call('Restart', []).then(function () {
    _store.store.dispatch({ type: 'RESTART' });
  });
}

function getStacktrace() {
  if (!isStarted()) {
    return;
  }
  var args = {
    id: _store.store.getState().delve.selectedGoroutine,
    depth: 20,
    full: true
  };
  call('StacktraceGoroutine', args).then(function (stacktrace) {
    // prepare the variables
    prepareVariables(stacktrace);
    _store.store.dispatch({ type: 'UPDATE_STACKTRACE', stacktrace: stacktrace });
  });
}

function prepareVariables(stacktrace) {
  stacktrace.forEach(function (stack) {
    stack.variables = DelveVariables.create(stack.Locals.concat(stack.Arguments));
  });
}

function getGoroutines() {
  if (!isStarted()) {
    return;
  }
  call('ListGoroutines').then(function (goroutines) {
    _store.store.dispatch({ type: 'UPDATE_GOROUTINES', goroutines: goroutines });
  });
}

function selectStacktrace(index) {
  _store.store.dispatch({ type: 'SET_SELECTED_STACKTRACE', index: index });
}

function selectGoroutine(id) {
  if (!isStarted()) {
    return;
  }
  if (_store.store.getState().delve.selectedGoroutine === id) {
    getStacktrace();
    return; // no need to change
  }
  _store.store.dispatch({ type: 'SET_SELECTED_GOROUTINE', state: 'busy', id: id });
  call('Command', { name: 'switchGoroutine', goroutineID: id }).then(function () {
    _store.store.dispatch({ type: 'SET_SELECTED_GOROUTINE', state: 'waiting', id: id });
    getStacktrace();
  });
}

// call is the base method for all calls to delve
function call(method) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var endpoint = RPC_ENDPOINT + method;
    dlvConnection.call(endpoint, args, function (err, result) {
      if (err) {
        addOutputMessage('delve', 'Failed to call ' + method + '\n\terror: ' + err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function isStarted() {
  var state = _store.store.getState().delve.state;
  return state !== 'notStarted' && state !== 'starting';
}

// thanks to 'yargs-parser' for this simple arguments parser!
function splitArgs(argString) {
  var i = 0;
  var c = null;
  var opening = null;
  var args = [];

  for (var j = 0; j < argString.length; j++) {
    c = argString.charAt(j);

    // split on spaces unless we're in quotes.
    if (c === ' ' && !opening) {
      i++;
      continue;
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.
    if (c === opening) {
      opening = null;
      continue;
    } else if ((c === '\'' || c === '"') && !opening) {
      opening = c;
      continue;
    }

    if (!args[i]) {
      args[i] = '';
    }
    args[i] += c;
  }

  return args;
}

function dispose() {
  stop();
}

function locate(goconfig) {
  return goconfig.locator.findTool('dlv');
}

function get(goget, goconfig) {
  // allow using a custom dlv executable
  var customDlvPath = atom.config.get('go-debug.dlvPath');
  if (customDlvPath) {
    return Promise.resolve(customDlvPath);
  }

  return locate(goconfig).then(function (p) {
    if (p) {
      return p;
    }

    // check if GOPATH is actually available in goconfig!
    if (!assertGOPATH(goconfig)) {
      return Promise.reject('Environment variable "GOPATH" is not available!');
    }

    if (process.platform === 'darwin') {
      return getOnOSX(goconfig);
    }

    return goget.get({
      name: 'go-debug',
      packageName: 'dlv',
      packagePath: 'github.com/derekparker/delve/cmd/dlv',
      type: 'missing'
    }).then(function (r) {
      if (!r.success) {
        return Promise.reject('Failed to install "dlv" via "go get -u github.com/derekparker/delve/cmd/dlv". Please install it manually.\n' + r.result.stderr);
      }
      return locate(goconfig);
    });
  });
}

function getOnOSX(goconfig) {
  // delve is not 'go get'-able on OSX yet as it needs to be signed to use it...
  // alternative: use an prebuilt dlv executable -> https://bintray.com/jetbrains/golang/delve

  return new Promise(function (resolve, reject) {
    var request = require('request');
    var AdmZip = require('adm-zip');
    var path = require('path');
    var fs = require('fs');

    function start() {
      Promise.all([getVersion().then(download), getGoPath()]).then(function (results) {
        return extract(results[0], results[1]);
      })['catch'](reject);
    }

    // get latest version
    function getVersion() {
      return new Promise(function (resolve, reject) {
        var url = 'https://api.bintray.com/packages/jetbrains/golang/delve/versions/_latest';
        request(url, function (error, response, body) {
          if (error || response.statusCode !== 200) {
            reject(error || 'Failed to determine the latest version from bintray!');
            return;
          }
          resolve(JSON.parse(body).name);
        });
      });
    }

    // download the latest version
    function download(version) {
      var o = {
        url: 'https://dl.bintray.com/jetbrains/golang/com/jetbrains/delve/' + version + '/delve-' + version + '.zip',
        encoding: null
      };
      return new Promise(function (resolve, reject) {
        request(o, function (error, response, body) {
          if (error || response.statusCode !== 200) {
            reject(error || 'Failed to download the latest dlv executable from bintray!');
            return;
          }
          resolve(body);
        });
      });
    }

    function getGoPath() {
      return new Promise(function (resolve) {
        var paths = goconfig.environment().GOPATH.split(path.delimiter);
        if (paths.length === 1) {
          resolve(paths[0]);
          return;
        }
        var options = paths.map(function (p, i) {
          return '<option value="' + i + '">' + p + '</option>';
        }).join('');

        // poor mans modal as the notification is not customizable ... I will not put
        // too much effort into this as it will (hopefully) not be needed in the future
        var item = document.createElement('div');
        item.innerHTML = '<p>Multiple GOPATHs detected, where do you want to put the "dlv" executable?</p>\n          <select class="go-debug-mutliple-gopath-selector btn">\n            <option value="">Select a path ...</option>\n            ' + options + '\n          </select>\n          <button type="button" class="go-debug-mutliple-gopath-btn btn">OK</button>';

        var panel = atom.workspace.addModalPanel({ item: item });

        item.querySelector('.go-debug-mutliple-gopath-btn').addEventListener('click', function () {
          var _item$querySelector = item.querySelector('.go-debug-mutliple-gopath-selector');

          var value = _item$querySelector.value;

          resolve(value ? paths[value] : null);
          panel.destroy();
        });
      });
    }

    // extract zip
    function extract(body, gopath) {
      if (!gopath) {
        resolve(null);
        return;
      }
      var zip = new AdmZip(body);

      // copy mac/dlv to $GOPATH/bin
      try {
        var binPath = path.join(gopath, 'bin');
        zip.extractEntryTo('dlv/mac/dlv', binPath, false, true);
      } catch (e) {
        reject(e);
        return;
      }

      locate(goconfig).then(updatePermission)['catch'](reject);
    }

    // update the file permissions to be able to execute dlv
    function updatePermission(path) {
      if (!path) {
        reject('Failed to find delve executable "dlv" in your GOPATH');
        return;
      }
      fs.chmod(path, 511, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(path);
      });
    }

    var noti = atom.notifications.addWarning('Could not find delve executable "dlv" in your GOPATH!', {
      dismissable: true,
      onDidDismiss: function onDidDismiss() {
        return resolve(null);
      },
      description: 'Do you want to install a prebuilt/signed dlv executable from https://bintray.com/jetbrains/golang/delve ?',
      buttons: [{
        text: 'Yes',
        onDidClick: function onDidClick() {
          noti.dismiss();
          start();
        }
      }, {
        text: 'No',
        onDidClick: function onDidClick() {
          noti.dismiss();
          resolve(null);
        }
      }]
    });
  });
}
function assertGOPATH(goconfig) {
  if (goconfig.environment().GOPATH) {
    return true;
  }

  atom.notifications.addWarning('The environment variable "GOPATH" is not set!', {
    dismissable: true,
    description: 'Starting atom via a desktop icon might not pass "GOPATH" to atom!\nTry starting atom from the command line instead.'
  });
  return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQUVzQixlQUFlOzt3QkFDckIsV0FBVzs7OztvQkFDTCxNQUFNOztJQUFoQixJQUFJOztxQkFDcUMsU0FBUzs7OEJBQzlCLG1CQUFtQjs7SUFBdkMsY0FBYzs7QUFOMUIsV0FBVyxDQUFBOztBQVFYLElBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQTtBQUM5QixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDeEIsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFBOztBQUVqQyxJQUFJLFVBQVUsWUFBQSxDQUFBO0FBQ2QsSUFBSSxhQUFhLFlBQUEsQ0FBQTs7QUFFVixTQUFTLFFBQVEsQ0FBRSxJQUFJLEVBQUU7QUFDOUIsU0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0NBQ3pCOztBQUVNLFNBQVMsVUFBVSxDQUFFLElBQUksRUFBRTtBQUNoQyxTQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7Q0FDMUI7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQy9DLGtCQUFTLGFBQU0sUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDLENBQUE7Q0FDOUU7O0FBRUQsU0FBUyxHQUFHLENBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTs4QkFDb0IsYUFBTSxRQUFRLEVBQUUsQ0FBQyxLQUFLOztNQUF0RCxPQUFPLHlCQUFiLElBQUk7TUFBVyxJQUFJLHlCQUFKLElBQUk7TUFBRSxZQUFZLHlCQUFaLFlBQVk7OztBQUd6QyxNQUFJLFlBQVksRUFBRTtBQUNoQixRQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUE7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O2VBQU0sT0FBTyxDQUFDLElBQUksQ0FBQztPQUFBO0FBQ2pDLGlCQUFXLEVBQUUsMkdBQTJHO0FBQ3hILGFBQU8sRUFBRSxDQUNQO0FBQ0UsWUFBSSxFQUFFLEtBQUs7QUFDWCxrQkFBVSxFQUFFLHNCQUFNO0FBQ2hCLGNBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNkLGVBQUssRUFBRSxDQUFBO1NBQ1I7T0FDRixFQUNEO0FBQ0UsWUFBSSxFQUFFLElBQUk7QUFDVixrQkFBVSxFQUFFLHNCQUFNO0FBQ2hCLGNBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNkLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDZDtPQUNGLENBQ0Y7S0FDRixDQUNGLENBQUE7R0FDRixDQUFDLENBQUE7Q0FDSDtBQUNELFNBQVMsWUFBWSxDQUFFLFFBQVEsRUFBRTtBQUMvQixNQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUU7QUFDakMsV0FBTyxJQUFJLENBQUE7R0FDWjs7QUFFRCxNQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsK0NBQStDLEVBQy9DO0FBQ0UsZUFBVyxFQUFFLElBQUk7QUFDakIsZUFBVyxFQUFFLHFIQUFxSDtHQUNuSSxDQUNGLENBQUE7QUFDRCxTQUFPLEtBQUssQ0FBQTtDQUNiIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBycGMgZnJvbSAnanNvbi1ycGMyJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgc3RvcmUsIGdldEJyZWFrcG9pbnQsIGdldEJyZWFrcG9pbnRzIH0gZnJvbSAnLi9zdG9yZSdcbmltcG9ydCAqIGFzIERlbHZlVmFyaWFibGVzIGZyb20gJy4vZGVsdmUtdmFyaWFibGVzJ1xuXG5jb25zdCBTRVJWRVJfVVJMID0gJ2xvY2FsaG9zdCdcbmNvbnN0IFNFUlZFUl9QT1JUID0gMjM0NVxuY29uc3QgUlBDX0VORFBPSU5UID0gJ1JQQ1NlcnZlci4nXG5cbmxldCBkbHZQcm9jZXNzXG5sZXQgZGx2Q29ubmVjdGlvblxuXG5leHBvcnQgZnVuY3Rpb24gcnVuVGVzdHMgKGZpbGUpIHtcbiAgcmV0dXJuIHJ1bihmaWxlLCAndGVzdCcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5QYWNrYWdlIChmaWxlKSB7XG4gIHJldHVybiBydW4oZmlsZSwgJ2RlYnVnJylcbn1cblxuZnVuY3Rpb24gYWRkT3V0cHV0TWVzc2FnZSAobWVzc2FnZVR5cGUsIG1lc3NhZ2UpIHtcbiAgc3RvcmUgJiYgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnQUREX09VVFBVVF9NRVNTQUdFJywgbWVzc2FnZVR5cGUsIG1lc3NhZ2UgfSlcbn1cblxuZnVuY3Rpb24gcnVuIChmaWxlLCBtZXRob2QpIHtcbiAgY29uc3QgeyBwYXRoOiBkbHZQYXRoLCBhcmdzLCBmaWxlT3ZlcnJpZGUgfSA9IHN0b3JlLmdldFN0YXRlKCkuZGVsdmVcblxuICAvLyBkZWJ1ZyAvIHRlc3QgYW5vdGhlciBmaWxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgb25lXG4gIGlmIChmaWxlT3ZlcnJpZGUpIHtcbiAgICBjb25zdCB0cmltbWVkRmlsZSA9IGZpbGVPdmVycmlkZS50cmltKClcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHRyaW1tZWRGaWxlKSkge1xuICAgICAgZmlsZSA9IHRyaW1tZWRGaWxlXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgodHJpbW1lZEZpbGUpXG4gICAgfVxuICB9XG5cbiAgaWYgKCFkbHZQYXRoIHx8IGRsdlByb2Nlc3MgfHwgIWZpbGUpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHBhbmVsU3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpLnBhbmVsXG4gIGlmICghcGFuZWxTdGF0ZS52aXNpYmxlKSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVE9HR0xFX1BBTkVMJyB9KVxuICB9XG5cbiAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX1NUQVRFJywgc3RhdGU6ICdzdGFydGluZycgfSlcblxuICBsZXQgZGx2QXJncyA9IFttZXRob2QsICctLWhlYWRsZXNzPXRydWUnLCBgLS1saXN0ZW49JHtTRVJWRVJfVVJMfToke1NFUlZFUl9QT1JUfWAsICctLWxvZyddXG4gIGlmIChhcmdzICYmIG1ldGhvZCAhPT0gJ3Rlc3QnKSB7XG4gICAgZGx2QXJncyA9IGRsdkFyZ3MuY29uY2F0KCctLScsIHNwbGl0QXJncyhhcmdzKSlcbiAgfVxuXG4gIGFkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlJywgYFN0YXJ0aW5nIGRlbHZlIHdpdGggXCIke2ZpbGV9XCIgd2l0aCBcIiR7bWV0aG9kfVwiYClcbiAgZGx2UHJvY2VzcyA9IHNwYXduKGRsdlBhdGgsIGRsdkFyZ3MsIHtcbiAgICBjd2Q6IHBhdGguZGlybmFtZShmaWxlKVxuICB9KVxuXG4gIGxldCBycGNDbGllbnRcbiAgZGx2UHJvY2Vzcy5zdGRlcnIub24oJ2RhdGEnLCAoY2h1bmspID0+IHtcbiAgICBhZGRPdXRwdXRNZXNzYWdlKCdkZWx2ZScsICdEZWx2ZSBvdXRwdXQ6ICcgKyBjaHVuay50b1N0cmluZygpKVxuICAgIGlmICghcnBjQ2xpZW50KSB7XG4gICAgICBycGNDbGllbnQgPSBycGMuQ2xpZW50LiRjcmVhdGUoU0VSVkVSX1BPUlQsIFNFUlZFUl9VUkwpXG4gICAgICBycGNDbGllbnQuY29ubmVjdFNvY2tldCgoZXJyLCBjb25uKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBhZGRPdXRwdXRNZXNzYWdlKCdkZWx2ZScsIGBGYWlsZWQgdG8gc3RhcnQgZGVsdmVcXG5cXHRlcnJvcjogJHtlcnJ9YClcbiAgICAgICAgICBzdG9wKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBkbHZDb25uZWN0aW9uID0gY29ublxuICAgICAgICBhZGRPdXRwdXRNZXNzYWdlKCdkZWx2ZScsIGBTdGFydGVkIGRlbHZlIHdpdGggXCIke2ZpbGV9XCIgd2l0aCBcIiR7bWV0aG9kfVwiYClcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX1NUQVRFJywgc3RhdGU6ICdzdGFydGVkJyB9KVxuICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICBnZXRCcmVha3BvaW50cygpLm1hcCgoYnApID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhZGRCcmVha3BvaW50KGJwLmZpbGUsIGJwLmxpbmUpXG4gICAgICAgICAgfSlcbiAgICAgICAgKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb21tYW5kKCdjb250aW51ZScpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICBkbHZQcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgIGFkZE91dHB1dE1lc3NhZ2UoJ291dHB1dCcsIGNodW5rLnRvU3RyaW5nKCkpXG4gIH0pXG5cbiAgZGx2UHJvY2Vzcy5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuICAgIGFkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlJywgJ2RlbHZlIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpXG4gICAgc3RvcCgpXG4gIH0pXG4gIGRsdlByb2Nlc3Mub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgIGFkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlJywgJ2Vycm9yOiAnICsgZXJyKVxuICAgIHN0b3AoKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcCAoKSB7XG4gIGlmIChkbHZDb25uZWN0aW9uKSB7XG4gICAgZGx2Q29ubmVjdGlvbi5lbmQoKVxuICB9XG4gIGRsdkNvbm5lY3Rpb24gPSBudWxsXG5cbiAgaWYgKGRsdlByb2Nlc3MpIHtcbiAgICBkbHZQcm9jZXNzLmtpbGwoKVxuICB9XG4gIGRsdlByb2Nlc3MgPSBudWxsXG5cbiAgc3RvcmUgJiYgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU1RPUCcgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEJyZWFrcG9pbnQgKGZpbGUsIGxpbmUpIHtcbiAgaWYgKCFpc1N0YXJ0ZWQoKSkge1xuICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0FERF9CUkVBS1BPSU5UJywgYnA6IHsgZmlsZSwgbGluZSwgc3RhdGU6ICdub3RTdGFydGVkJyB9IH0pXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gIH1cblxuICBjb25zdCBicCA9IGdldEJyZWFrcG9pbnQoZmlsZSwgbGluZSlcbiAgaWYgKGJwICYmIGJwLnN0YXRlID09PSAnYnVzeScpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgfVxuXG4gIC8vIG5vdGU6IGRlbHZlIHJlcXVpcmVzIDEgaW5kZXhlZCBsaW5lIG51bWJlcnMgd2hlcmVhcyBhdG9tIGhhcyAwIGluZGV4ZWRcbiAgY29uc3QgZmlsZUFuZExpbmUgPSBgJHtmaWxlfToke2xpbmUgKyAxfWBcbiAgYWRkT3V0cHV0TWVzc2FnZSgnZGVsdmUnLCBgQWRkaW5nIGJyZWFrcG9pbnQ6ICR7ZmlsZUFuZExpbmV9YClcbiAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnQUREX0JSRUFLUE9JTlQnLCBicDogeyBmaWxlLCBsaW5lIH0gfSlcbiAgcmV0dXJuIF9hZGRCcmVha3BvaW50KGZpbGUsIGxpbmUgKyAxKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgYWRkT3V0cHV0TWVzc2FnZSgnZGVsdmUnLCBgQWRkZWQgYnJlYWtwb2ludDogJHtmaWxlQW5kTGluZX1gKVxuICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnQUREX0JSRUFLUE9JTlQnLCBicDogeyBmaWxlLCBsaW5lLCBpZDogcmVzcG9uc2UuaWQsIHN0YXRlOiAndmFsaWQnIH0gfSlcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBhZGRPdXRwdXRNZXNzYWdlKCdkZWx2ZScsIGBBZGRpbmcgYnJlYWtwb2ludCBmYWlsZWQ6ICR7ZmlsZUFuZExpbmV9XFxuXFx0ZXJyb3I6ICR7ZXJyfWApXG4gICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdBRERfQlJFQUtQT0lOVCcsIGJwOiB7IGZpbGUsIGxpbmUsIHN0YXRlOiAnaW52YWxpZCcsIG1lc3NhZ2U6IGVyciB9IH0pXG4gICAgfSlcbn1cbmZ1bmN0aW9uIF9hZGRCcmVha3BvaW50IChmaWxlLCBsaW5lKSB7XG4gIHJldHVybiBjYWxsKCdDcmVhdGVCcmVha3BvaW50JywgeyBmaWxlLCBsaW5lIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVCcmVha3BvaW50IChmaWxlLCBsaW5lKSB7XG4gIGNvbnN0IGJwID0gZ2V0QnJlYWtwb2ludChmaWxlLCBsaW5lKVxuICBpZiAoIWJwKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gIH1cblxuICBmdW5jdGlvbiBkb25lICgpIHtcbiAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdSRU1PVkVfQlJFQUtQT0lOVCcsIGJwOiB7IGZpbGUsIGxpbmUsIHN0YXRlOiAncmVtb3ZlZCcgfSB9KVxuICB9XG5cbiAgaWYgKGJwLnN0YXRlID09PSAnaW52YWxpZCcgfHwgIWlzU3RhcnRlZCgpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZG9uZSlcbiAgfVxuXG4gIGNvbnN0IGZpbGVBbmRMaW5lID0gYCR7ZmlsZX06JHtsaW5lICsgMX1gXG4gIGFkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlJywgYFJlbW92aW5nIGJyZWFrcG9pbnQ6ICR7ZmlsZUFuZExpbmV9YClcbiAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnUkVNT1ZFX0JSRUFLUE9JTlQnLCBicDogeyBmaWxlLCBsaW5lLCBzdGF0ZTogJ2J1c3knIH0gfSlcbiAgcmV0dXJuIF9yZW1vdmVCcmVha3BvaW50KGJwLmlkKVxuICAgIC50aGVuKCgpID0+IGFkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlJywgYFJlbW92ZWQgYnJlYWtwb2ludDogJHtmaWxlQW5kTGluZX1gKSlcbiAgICAudGhlbihkb25lKVxufVxuZnVuY3Rpb24gX3JlbW92ZUJyZWFrcG9pbnQgKGlkKSB7XG4gIHJldHVybiBjYWxsKCdDbGVhckJyZWFrcG9pbnQnLCBpZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZUJyZWFrcG9pbnQgKGZpbGUsIGxpbmUpIHtcbiAgY29uc3QgYnAgPSBnZXRCcmVha3BvaW50KGZpbGUsIGxpbmUpXG4gIGlmICghYnApIHtcbiAgICByZXR1cm4gYWRkQnJlYWtwb2ludChmaWxlLCBsaW5lKVxuICB9XG4gIHJldHVybiByZW1vdmVCcmVha3BvaW50KGZpbGUsIGxpbmUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCcmVha3BvaW50TGluZSAoZmlsZSwgbGluZSwgbmV3TGluZSkge1xuICBjb25zdCBicCA9IGdldEJyZWFrcG9pbnQoZmlsZSwgbGluZSlcbiAgaWYgKCFpc1N0YXJ0ZWQoKSkge1xuICAgIC8vIGp1c3QgdXBkYXRlIHRoZSBicmVha3BvaW50IGluIHRoZSBzdG9yZVxuICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VQREFURV9CUkVBS1BPSU5UX0xJTkUnLCBicCwgbmV3TGluZSB9KVxuICAgIHJldHVyblxuICB9XG5cbiAgLy8gcmVtb3ZlIGFuZCBhZGQgdGhlIGJyZWFrcG9pbnQsIHRoaXMgYWxzbyB1cGRhdGVzIHRoZSBzdG9yZSBjb3JyZWN0bHlcbiAgX3JlbW92ZUJyZWFrcG9pbnQoYnAuaWQpLnRoZW4oKCkgPT4gX2FkZEJyZWFrcG9pbnQoZmlsZSwgbmV3TGluZSkpXG59XG5cbi8vIGNvbW1hbmQgZXhlY3V0ZXMgdGhlIGdpdmVuIGNvbW1hbmQgKGxpa2UgY29udGludWUsIHN0ZXAsIG5leHQsIC4uLilcbmV4cG9ydCBmdW5jdGlvbiBjb21tYW5kIChuYW1lKSB7XG4gIGlmICghaXNTdGFydGVkKCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBhZGRPdXRwdXRNZXNzYWdlKCdkZWx2ZScsIGBFeGVjdXRpbmcgY29tbWFuZCAke25hbWV9YClcbiAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX1NUQVRFJywgc3RhdGU6ICdidXN5JyB9KVxuICBjYWxsKCdDb21tYW5kJywgeyBuYW1lIH0pLnRoZW4oKG5ld1N0YXRlKSA9PiB7XG4gICAgaWYgKG5ld1N0YXRlLmV4aXRlZCkge1xuICAgICAgc3RvcCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdTRVRfU1RBVEUnLCBzdGF0ZTogJ3dhaXRpbmcnIH0pXG5cbiAgICBzZWxlY3RHb3JvdXRpbmUobmV3U3RhdGUuY3VycmVudEdvcm91dGluZS5pZClcbiAgICBzZWxlY3RTdGFja3RyYWNlKDApXG5cbiAgICBnZXRHb3JvdXRpbmVzKClcbiAgfSlcbn1cblxuLy8gcmVzdGFydCB0aGUgZGVsdmUgc2Vzc2lvblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3RhcnQgKCkge1xuICBpZiAoIWlzU3RhcnRlZCgpKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgY2FsbCgnUmVzdGFydCcsIFtdKS50aGVuKCgpID0+IHtcbiAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdSRVNUQVJUJyB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXRTdGFja3RyYWNlICgpIHtcbiAgaWYgKCFpc1N0YXJ0ZWQoKSkge1xuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IHN0b3JlLmdldFN0YXRlKCkuZGVsdmUuc2VsZWN0ZWRHb3JvdXRpbmUsXG4gICAgZGVwdGg6IDIwLFxuICAgIGZ1bGw6IHRydWVcbiAgfVxuICBjYWxsKCdTdGFja3RyYWNlR29yb3V0aW5lJywgYXJncykudGhlbigoc3RhY2t0cmFjZSkgPT4ge1xuICAgIC8vIHByZXBhcmUgdGhlIHZhcmlhYmxlc1xuICAgIHByZXBhcmVWYXJpYWJsZXMoc3RhY2t0cmFjZSlcbiAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdVUERBVEVfU1RBQ0tUUkFDRScsIHN0YWNrdHJhY2UgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVZhcmlhYmxlcyAoc3RhY2t0cmFjZSkge1xuICBzdGFja3RyYWNlLmZvckVhY2goKHN0YWNrKSA9PiB7XG4gICAgc3RhY2sudmFyaWFibGVzID0gRGVsdmVWYXJpYWJsZXMuY3JlYXRlKHN0YWNrLkxvY2Fscy5jb25jYXQoc3RhY2suQXJndW1lbnRzKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0R29yb3V0aW5lcyAoKSB7XG4gIGlmICghaXNTdGFydGVkKCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBjYWxsKCdMaXN0R29yb3V0aW5lcycpLnRoZW4oKGdvcm91dGluZXMpID0+IHtcbiAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdVUERBVEVfR09ST1VUSU5FUycsIGdvcm91dGluZXMgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFN0YWNrdHJhY2UgKGluZGV4KSB7XG4gIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9TRUxFQ1RFRF9TVEFDS1RSQUNFJywgaW5kZXggfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEdvcm91dGluZSAoaWQpIHtcbiAgaWYgKCFpc1N0YXJ0ZWQoKSkge1xuICAgIHJldHVyblxuICB9XG4gIGlmIChzdG9yZS5nZXRTdGF0ZSgpLmRlbHZlLnNlbGVjdGVkR29yb3V0aW5lID09PSBpZCkge1xuICAgIGdldFN0YWNrdHJhY2UoKVxuICAgIHJldHVybiAvLyBubyBuZWVkIHRvIGNoYW5nZVxuICB9XG4gIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9TRUxFQ1RFRF9HT1JPVVRJTkUnLCBzdGF0ZTogJ2J1c3knLCBpZCB9KVxuICBjYWxsKCdDb21tYW5kJywgeyBuYW1lOiAnc3dpdGNoR29yb3V0aW5lJywgZ29yb3V0aW5lSUQ6IGlkIH0pLnRoZW4oKCkgPT4ge1xuICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9TRUxFQ1RFRF9HT1JPVVRJTkUnLCBzdGF0ZTogJ3dhaXRpbmcnLCBpZCB9KVxuICAgIGdldFN0YWNrdHJhY2UoKVxuICB9KVxufVxuXG4vLyBjYWxsIGlzIHRoZSBiYXNlIG1ldGhvZCBmb3IgYWxsIGNhbGxzIHRvIGRlbHZlXG5mdW5jdGlvbiBjYWxsIChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBlbmRwb2ludCA9IFJQQ19FTkRQT0lOVCArIG1ldGhvZFxuICAgIGRsdkNvbm5lY3Rpb24uY2FsbChlbmRwb2ludCwgYXJncywgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGFkZE91dHB1dE1lc3NhZ2UoJ2RlbHZlJywgYEZhaWxlZCB0byBjYWxsICR7bWV0aG9kfVxcblxcdGVycm9yOiAke2Vycn1gKVxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHJlc29sdmUocmVzdWx0KVxuICAgIH0pXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXJ0ZWQgKCkge1xuICBjb25zdCBzdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCkuZGVsdmUuc3RhdGVcbiAgcmV0dXJuIHN0YXRlICE9PSAnbm90U3RhcnRlZCcgJiYgc3RhdGUgIT09ICdzdGFydGluZydcbn1cblxuLy8gdGhhbmtzIHRvICd5YXJncy1wYXJzZXInIGZvciB0aGlzIHNpbXBsZSBhcmd1bWVudHMgcGFyc2VyIVxuZnVuY3Rpb24gc3BsaXRBcmdzIChhcmdTdHJpbmcpIHtcbiAgbGV0IGkgPSAwXG4gIGxldCBjID0gbnVsbFxuICBsZXQgb3BlbmluZyA9IG51bGxcbiAgY29uc3QgYXJncyA9IFtdXG5cbiAgZm9yIChsZXQgaiA9IDA7IGogPCBhcmdTdHJpbmcubGVuZ3RoOyBqKyspIHtcbiAgICBjID0gYXJnU3RyaW5nLmNoYXJBdChqKVxuXG4gICAgLy8gc3BsaXQgb24gc3BhY2VzIHVubGVzcyB3ZSdyZSBpbiBxdW90ZXMuXG4gICAgaWYgKGMgPT09ICcgJyAmJiAhb3BlbmluZykge1xuICAgICAgaSsrXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIC8vIGRvbid0IHNwbGl0IHRoZSBzdHJpbmcgaWYgd2UncmUgaW4gbWF0Y2hpbmdcbiAgICAvLyBvcGVuaW5nIG9yIGNsb3Npbmcgc2luZ2xlIGFuZCBkb3VibGUgcXVvdGVzLlxuICAgIGlmIChjID09PSBvcGVuaW5nKSB7XG4gICAgICBvcGVuaW5nID0gbnVsbFxuICAgICAgY29udGludWVcbiAgICB9IGVsc2UgaWYgKChjID09PSAnXFwnJyB8fCBjID09PSAnXCInKSAmJiAhb3BlbmluZykge1xuICAgICAgb3BlbmluZyA9IGNcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKCFhcmdzW2ldKSB7XG4gICAgICBhcmdzW2ldID0gJydcbiAgICB9XG4gICAgYXJnc1tpXSArPSBjXG4gIH1cblxuICByZXR1cm4gYXJnc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcG9zZSAoKSB7XG4gIHN0b3AoKVxufVxuXG5mdW5jdGlvbiBsb2NhdGUgKGdvY29uZmlnKSB7XG4gIHJldHVybiBnb2NvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdkbHYnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0IChnb2dldCwgZ29jb25maWcpIHtcbiAgLy8gYWxsb3cgdXNpbmcgYSBjdXN0b20gZGx2IGV4ZWN1dGFibGVcbiAgY29uc3QgY3VzdG9tRGx2UGF0aCA9IGF0b20uY29uZmlnLmdldCgnZ28tZGVidWcuZGx2UGF0aCcpXG4gIGlmIChjdXN0b21EbHZQYXRoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjdXN0b21EbHZQYXRoKVxuICB9XG5cbiAgcmV0dXJuIGxvY2F0ZShnb2NvbmZpZykudGhlbigocCkgPT4ge1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gcFxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIEdPUEFUSCBpcyBhY3R1YWxseSBhdmFpbGFibGUgaW4gZ29jb25maWchXG4gICAgaWYgKCFhc3NlcnRHT1BBVEgoZ29jb25maWcpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ0Vudmlyb25tZW50IHZhcmlhYmxlIFwiR09QQVRIXCIgaXMgbm90IGF2YWlsYWJsZSEnKVxuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgICAgcmV0dXJuIGdldE9uT1NYKGdvY29uZmlnKVxuICAgIH1cblxuICAgIHJldHVybiBnb2dldC5nZXQoe1xuICAgICAgbmFtZTogJ2dvLWRlYnVnJyxcbiAgICAgIHBhY2thZ2VOYW1lOiAnZGx2JyxcbiAgICAgIHBhY2thZ2VQYXRoOiAnZ2l0aHViLmNvbS9kZXJla3Bhcmtlci9kZWx2ZS9jbWQvZGx2JyxcbiAgICAgIHR5cGU6ICdtaXNzaW5nJ1xuICAgIH0pLnRoZW4oKHIpID0+IHtcbiAgICAgIGlmICghci5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnRmFpbGVkIHRvIGluc3RhbGwgXCJkbHZcIiB2aWEgXCJnbyBnZXQgLXUgZ2l0aHViLmNvbS9kZXJla3Bhcmtlci9kZWx2ZS9jbWQvZGx2XCIuIFBsZWFzZSBpbnN0YWxsIGl0IG1hbnVhbGx5LlxcbicgKyByLnJlc3VsdC5zdGRlcnIpXG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYXRlKGdvY29uZmlnKVxuICAgIH0pXG4gIH0pXG59XG5mdW5jdGlvbiBnZXRPbk9TWCAoZ29jb25maWcpIHtcbiAgLy8gZGVsdmUgaXMgbm90ICdnbyBnZXQnLWFibGUgb24gT1NYIHlldCBhcyBpdCBuZWVkcyB0byBiZSBzaWduZWQgdG8gdXNlIGl0Li4uXG4gIC8vIGFsdGVybmF0aXZlOiB1c2UgYW4gcHJlYnVpbHQgZGx2IGV4ZWN1dGFibGUgLT4gaHR0cHM6Ly9iaW50cmF5LmNvbS9qZXRicmFpbnMvZ29sYW5nL2RlbHZlXG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpXG4gICAgY29uc3QgQWRtWmlwID0gcmVxdWlyZSgnYWRtLXppcCcpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuXG4gICAgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICBnZXRWZXJzaW9uKCkudGhlbihkb3dubG9hZCksXG4gICAgICAgIGdldEdvUGF0aCgpXG4gICAgICBdKVxuICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IGV4dHJhY3QocmVzdWx0c1swXSwgcmVzdWx0c1sxXSkpXG4gICAgICAuY2F0Y2gocmVqZWN0KVxuICAgIH1cblxuICAgIC8vIGdldCBsYXRlc3QgdmVyc2lvblxuICAgIGZ1bmN0aW9uIGdldFZlcnNpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmJpbnRyYXkuY29tL3BhY2thZ2VzL2pldGJyYWlucy9nb2xhbmcvZGVsdmUvdmVyc2lvbnMvX2xhdGVzdCdcbiAgICAgICAgcmVxdWVzdCh1cmwsIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IgfHwgcmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3IgfHwgJ0ZhaWxlZCB0byBkZXRlcm1pbmUgdGhlIGxhdGVzdCB2ZXJzaW9uIGZyb20gYmludHJheSEnKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShib2R5KS5uYW1lKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBkb3dubG9hZCB0aGUgbGF0ZXN0IHZlcnNpb25cbiAgICBmdW5jdGlvbiBkb3dubG9hZCAodmVyc2lvbikge1xuICAgICAgY29uc3QgbyA9IHtcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9kbC5iaW50cmF5LmNvbS9qZXRicmFpbnMvZ29sYW5nL2NvbS9qZXRicmFpbnMvZGVsdmUvJyArIHZlcnNpb24gKyAnL2RlbHZlLScgKyB2ZXJzaW9uICsgJy56aXAnLFxuICAgICAgICBlbmNvZGluZzogbnVsbFxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVxdWVzdChvLCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yIHx8IHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yIHx8ICdGYWlsZWQgdG8gZG93bmxvYWQgdGhlIGxhdGVzdCBkbHYgZXhlY3V0YWJsZSBmcm9tIGJpbnRyYXkhJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKGJvZHkpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdvUGF0aCAoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcGF0aHMgPSBnb2NvbmZpZy5lbnZpcm9ubWVudCgpLkdPUEFUSC5zcGxpdChwYXRoLmRlbGltaXRlcilcbiAgICAgICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJlc29sdmUocGF0aHNbMF0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHBhdGhzLm1hcCgocCwgaSkgPT4gYDxvcHRpb24gdmFsdWU9XCIke2l9XCI+JHtwfTwvb3B0aW9uPmApLmpvaW4oJycpXG5cbiAgICAgICAgLy8gcG9vciBtYW5zIG1vZGFsIGFzIHRoZSBub3RpZmljYXRpb24gaXMgbm90IGN1c3RvbWl6YWJsZSAuLi4gSSB3aWxsIG5vdCBwdXRcbiAgICAgICAgLy8gdG9vIG11Y2ggZWZmb3J0IGludG8gdGhpcyBhcyBpdCB3aWxsIChob3BlZnVsbHkpIG5vdCBiZSBuZWVkZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICB2YXIgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGl0ZW0uaW5uZXJIVE1MID0gYDxwPk11bHRpcGxlIEdPUEFUSHMgZGV0ZWN0ZWQsIHdoZXJlIGRvIHlvdSB3YW50IHRvIHB1dCB0aGUgXCJkbHZcIiBleGVjdXRhYmxlPzwvcD5cbiAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZ28tZGVidWctbXV0bGlwbGUtZ29wYXRoLXNlbGVjdG9yIGJ0blwiPlxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBhIHBhdGggLi4uPC9vcHRpb24+XG4gICAgICAgICAgICAke29wdGlvbnN9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJnby1kZWJ1Zy1tdXRsaXBsZS1nb3BhdGgtYnRuIGJ0blwiPk9LPC9idXR0b24+YFxuXG4gICAgICAgIGNvbnN0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW0gfSlcblxuICAgICAgICBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5nby1kZWJ1Zy1tdXRsaXBsZS1nb3BhdGgtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZ28tZGVidWctbXV0bGlwbGUtZ29wYXRoLXNlbGVjdG9yJylcbiAgICAgICAgICByZXNvbHZlKHZhbHVlID8gcGF0aHNbdmFsdWVdIDogbnVsbClcbiAgICAgICAgICBwYW5lbC5kZXN0cm95KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCB6aXBcbiAgICBmdW5jdGlvbiBleHRyYWN0IChib2R5LCBnb3BhdGgpIHtcbiAgICAgIGlmICghZ29wYXRoKSB7XG4gICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCB6aXAgPSBuZXcgQWRtWmlwKGJvZHkpXG5cbiAgICAgIC8vIGNvcHkgbWFjL2RsdiB0byAkR09QQVRIL2JpblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYmluUGF0aCA9IHBhdGguam9pbihnb3BhdGgsICdiaW4nKVxuICAgICAgICB6aXAuZXh0cmFjdEVudHJ5VG8oJ2Rsdi9tYWMvZGx2JywgYmluUGF0aCwgZmFsc2UsIHRydWUpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbG9jYXRlKGdvY29uZmlnKS50aGVuKHVwZGF0ZVBlcm1pc3Npb24pLmNhdGNoKHJlamVjdClcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIGZpbGUgcGVybWlzc2lvbnMgdG8gYmUgYWJsZSB0byBleGVjdXRlIGRsdlxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBlcm1pc3Npb24gKHBhdGgpIHtcbiAgICAgIGlmICghcGF0aCkge1xuICAgICAgICByZWplY3QoJ0ZhaWxlZCB0byBmaW5kIGRlbHZlIGV4ZWN1dGFibGUgXCJkbHZcIiBpbiB5b3VyIEdPUEFUSCcpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZnMuY2htb2QocGF0aCwgMG83NzcsIChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShwYXRoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBub3RpID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAnQ291bGQgbm90IGZpbmQgZGVsdmUgZXhlY3V0YWJsZSBcImRsdlwiIGluIHlvdXIgR09QQVRIIScsXG4gICAgICB7XG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICBvbkRpZERpc21pc3M6ICgpID0+IHJlc29sdmUobnVsbCksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRG8geW91IHdhbnQgdG8gaW5zdGFsbCBhIHByZWJ1aWx0L3NpZ25lZCBkbHYgZXhlY3V0YWJsZSBmcm9tIGh0dHBzOi8vYmludHJheS5jb20vamV0YnJhaW5zL2dvbGFuZy9kZWx2ZSA/JyxcbiAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdZZXMnLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBub3RpLmRpc21pc3MoKVxuICAgICAgICAgICAgICBzdGFydCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnTm8nLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBub3RpLmRpc21pc3MoKVxuICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgKVxuICB9KVxufVxuZnVuY3Rpb24gYXNzZXJ0R09QQVRIIChnb2NvbmZpZykge1xuICBpZiAoZ29jb25maWcuZW52aXJvbm1lbnQoKS5HT1BBVEgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgJ1RoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBcIkdPUEFUSFwiIGlzIG5vdCBzZXQhJyxcbiAgICB7XG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3RhcnRpbmcgYXRvbSB2aWEgYSBkZXNrdG9wIGljb24gbWlnaHQgbm90IHBhc3MgXCJHT1BBVEhcIiB0byBhdG9tIVxcblRyeSBzdGFydGluZyBhdG9tIGZyb20gdGhlIGNvbW1hbmQgbGluZSBpbnN0ZWFkLidcbiAgICB9XG4gIClcbiAgcmV0dXJuIGZhbHNlXG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/delve.js
