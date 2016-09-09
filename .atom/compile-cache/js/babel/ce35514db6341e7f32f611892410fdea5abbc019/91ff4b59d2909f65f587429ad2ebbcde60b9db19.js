Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _check = require('./check');

var _executor = require('./executor');

var _pathhelper = require('./pathhelper');

var _pathhelper2 = _interopRequireDefault(_pathhelper);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Locator = (function () {
  function Locator(options) {
    var _this = this;

    _classCallCheck(this, Locator);

    this.subscriptions = new _atom.CompositeDisposable();
    this.environmentFn = null;
    this.executor = null;
    this.executableSuffix = '';
    this.pathKey = 'PATH';
    if (_os2['default'].platform() === 'win32') {
      this.executableSuffix = '.exe';
      this.pathKey = 'Path';
    }
    this.goExecutables = ['go' + this.executableSuffix, 'goapp' + this.executableSuffix];
    this.readyFn = null;
    if ((0, _check.isTruthy)(options)) {
      if ((0, _check.isTruthy)(options.environment)) {
        this.environmentFn = options.environment;
      }
      if ((0, _check.isTruthy)(options.ready)) {
        this.readyFn = options.ready;
      }
      if ((0, _check.isTruthy)(options.executor)) {
        this.executor = options.executor;
      }
    }

    if (this.executor === null) {
      this.executor = new _executor.Executor({ environmentFn: this.environment.bind(this) });
    }

    this.subscriptions.add(this.executor);
    this.goLocators = [
    // Avoid using gorootLocator / GOROOT unless you know what you're doing
    // (and assume you don't know what you're unless you have significant
    // go experience)
    function () {
      return _this.gorootLocator();
    }, function () {
      return _this.editorconfigLocator();
    }, function () {
      return _this.configLocator();
    }, function () {
      return _this.pathLocator();
    }, function () {
      return _this.defaultLocator();
    }];

    this.setKnownToolStrategies();
  }

  _createClass(Locator, [{
    key: 'dispose',
    value: function dispose() {
      this.resetRuntimes();
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.goLocators = null;
      this.executableSuffix = null;
      this.pathKey = null;
      this.goExecutables = null;
      this.subscriptions = null;
      this.environmentFn = null;
      this.executor = null;
      this.readyFn = null;
      this.toolLocations = null;
      this.toolStrategies = null;
    }

    // Public: Get the go runtime(s).
    // Returns an array of {Object} where each item contains the output from "go
    // env", or false if no runtimes are found.
  }, {
    key: 'runtimes',
    value: function runtimes() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if ((0, _check.isTruthy)(this.runtimesCache)) {
        return Promise.resolve(this.runtimesCache);
      }

      return new Promise(function (resolve, reject) {
        var candidates = _this2.runtimeCandidates(options);
        if ((0, _check.isEmpty)(candidates)) {
          return resolve([]);
        }

        var viableCandidates = [];
        for (var candidate of candidates) {
          var goversion = _this2.executor.execSync(candidate, ['version'], { cwd: _path2['default'].dirname(candidate) });
          if ((0, _check.isTruthy)(goversion) && goversion.exitcode === 0 && goversion.stdout.startsWith('go ')) {
            var v = { path: candidate, version: goversion.stdout.replace(/\r?\n|\r/g, '') };
            var versionComponents = v.version.split(' ');
            v.name = versionComponents[2];
            v.semver = versionComponents[2];
            if (v.semver.startsWith('go')) {
              v.semver = v.semver.substring(2, v.semver.length);
            }
            viableCandidates.push(v);
          }
        }

        var finalCandidates = [];
        for (var viableCandidate of viableCandidates) {
          var goenv = _this2.executor.execSync(viableCandidate.path, ['env'], { cwd: _path2['default'].dirname(viableCandidate.path) });
          if ((0, _check.isTruthy)(goenv) && goenv.exitcode === 0 && goenv.stdout.trim() !== '') {
            var items = goenv.stdout.split('\n');
            for (var item of items) {
              item = item.replace(/[\n\r]/g, '');
              if (item.includes('=')) {
                var tuple = item.split('=');
                var key = tuple[0];
                var value = tuple[1];
                if (tuple.length > 2) {
                  value = tuple.slice(1, tuple.length + 1).join('=');
                }
                if (_os2['default'].platform() === 'win32') {
                  if (key.startsWith('set ')) {
                    key = key.substring(4, key.length);
                  }
                } else {
                  if (value.length > 2) {
                    value = value.substring(1, value.length - 1);
                  } else {
                    value = '';
                  }
                }
                viableCandidate[key] = value;
              }
            }
            finalCandidates.push(viableCandidate);
          }
        }

        _this2.runtimesCache = finalCandidates;
        resolve(_this2.runtimesCache);
      });
    }

    // Deprecated: Use runtime(options) instead.
  }, {
    key: 'runtimeForProject',
    value: function runtimeForProject(project) {
      return this.runtime();
    }

    // Public: Get the go runtime.
    // Returns an {Object} which contains the output from "go env", or false if
    // no runtime is found.
  }, {
    key: 'runtime',
    value: function runtime() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.runtimes(options).then(function (r) {
        if ((0, _check.isFalsy)(r) || r.length < 1) {
          return false;
        } else {
          return r[0];
        }
      });
    }

    // Public: Get the gopath.
    // Returns the GOPATH if it exists, or false if it is not defined.
  }, {
    key: 'gopath',
    value: function gopath() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var e = this.rawEnvironment(options);
      if ((0, _check.isFalsy)(e.GOPATH) || e.GOPATH.trim() === '') {
        return false;
      }

      return _pathhelper2['default'].expand(e, e.GOPATH);
    }

    // Public: Find the specified tool.
    // Returns the path to the tool if found, or false if it cannot be found.
  }, {
    key: 'findTool',
    value: function findTool(name) {
      var _this3 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if ((0, _check.isFalsy)(name) || name.constructor !== String || name.trim() === '') {
        return Promise.resolve(false);
      }

      if (!this.toolStrategies) {
        return Promise.resolve(false);
      }

      var strategy = false;
      return Promise.resolve(null).then(function () {
        if (_this3.toolStrategies.has(name)) {
          strategy = _this3.toolStrategies.get(name);
        }
        if ((0, _check.isFalsy)(strategy)) {
          strategy = 'DEFAULT';
        }
      }).then(function () {
        if (strategy !== 'GOROOTBIN' && strategy !== 'GOTOOLDIR') {
          return false;
        }

        return _this3.runtime(options).then(function (runtime) {
          if ((0, _check.isFalsy)(runtime)) {
            return false;
          }

          if (strategy === 'GOROOTBIN') {
            if (name === 'go' && runtime.path.endsWith('goapp' + runtime.GOEXE)) {
              return _path2['default'].join(runtime.GOROOT, 'bin', 'goapp' + runtime.GOEXE);
            }

            return _path2['default'].join(runtime.GOROOT, 'bin', name + runtime.GOEXE);
          } else if (strategy === 'GOTOOLDIR') {
            return _path2['default'].join(runtime.GOTOOLDIR, name + runtime.GOEXE);
          }
          return false;
        });
      }).then(function (specificTool) {
        if ((0, _check.isTruthy)(specificTool)) {
          return _this3.stat(specificTool).then(function (s) {
            if ((0, _check.isTruthy)(s) && s.isFile()) {
              return specificTool;
            }
          })['catch'](function (err) {
            _this3.handleError(err);
            return false;
          });
        }

        if (strategy === 'GOPATHBIN') {
          return _this3.findToolInDelimitedEnvironmentVariable(name, 'GOPATH', options);
        }

        if (strategy === 'PATH') {
          return _this3.findToolInDelimitedEnvironmentVariable(name, _this3.pathKey, options);
        }

        return _this3.findToolWithDefaultStrategy(name, options);
      });
    }
  }, {
    key: 'resetRuntimes',
    value: function resetRuntimes() {
      this.runtimesCache = null;
    }
  }, {
    key: 'statishSync',
    value: function statishSync(pathValue) {
      var stat = false;
      if ((0, _check.isTruthy)(pathValue) && !(pathValue.trim() === '')) {
        try {
          stat = _fs2['default'].statSync(pathValue);
        } catch (e) {}
      }
      return stat;
    }
  }, {
    key: 'stat',
    value: function stat(p) {
      var _this4 = this;

      if ((0, _check.isFalsy)(p) || p.constructor !== String || p.trim() === '') {
        return Promise.resolve(false);
      }

      return new Promise(function (resolve, reject) {
        _fs2['default'].stat(p, function (err, stat) {
          if ((0, _check.isTruthy)(err)) {
            _this4.handleError(err);
            resolve(false);
            return;
          }
          resolve(stat);
        });
      });
    }
  }, {
    key: 'pathExists',
    value: function pathExists(p) {
      return this.exists(p).then(function (e) {
        if ((0, _check.isFalsy)(e)) {
          return false;
        }
        return p;
      });
    }
  }, {
    key: 'fileExists',
    value: function fileExists(p) {
      return this.stat(p).then(function (s) {
        if ((0, _check.isFalsy)(s)) {
          return false;
        }

        if (s.isFile()) {
          return p;
        }

        return false;
      });
    }
  }, {
    key: 'directoryExists',
    value: function directoryExists(p) {
      return this.stat(p).then(function (s) {
        if ((0, _check.isFalsy)(s)) {
          return false;
        }

        if (s.isDirectory()) {
          return p;
        }

        return false;
      });
    }
  }, {
    key: 'exists',
    value: function exists(p) {
      return this.stat(p).then(function (s) {
        if ((0, _check.isFalsy)(s)) {
          return false;
        }

        return true;
      });
    }
  }, {
    key: 'runtimeCandidates',
    value: function runtimeCandidates() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var candidates = [];
      for (var locator of this.goLocators) {
        var c = locator(options);
        if ((0, _check.isTruthy)(c) && c.constructor === Array && c.length > 0) {
          candidates = _lodash2['default'].union(candidates, c);
        }
      }
      return candidates;
    }
  }, {
    key: 'editorconfigLocator',
    value: function editorconfigLocator() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // TODO: .editorconfig
      return false;
    }

    // Internal: Find a go installation using your Atom config. Deliberately
    // undocumented, as this method is discouraged.
  }, {
    key: 'configLocator',
    value: function configLocator() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var goinstallation = atom.config.get('go-config.goinstallation');
      var stat = this.statishSync(goinstallation);
      if ((0, _check.isTruthy)(stat)) {
        var d = goinstallation;
        if (stat.isFile()) {
          d = _path2['default'].dirname(goinstallation);
        }
        return this.findExecutablesInPath(d, this.executables, options);
      }

      return [];
    }
  }, {
    key: 'gorootLocator',
    value: function gorootLocator() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var g = this.environment(options).GOROOT;
      if ((0, _check.isFalsy)(g) || g.trim() === '') {
        return [];
      }
      return this.findExecutablesInPath(_path2['default'].join(g, 'bin'), this.goExecutables, options);
    }
  }, {
    key: 'pathLocator',
    value: function pathLocator() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.findExecutablesInPath(this.environment(options)[this.pathKey], this.goExecutables, options);
    }
  }, {
    key: 'defaultLocator',
    value: function defaultLocator() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var installPaths = [];
      if (_os2['default'].platform() === 'win32') {
        /*
        c:\go\bin = Binary Distribution
        c:\tools\go\bin = Chocolatey
        */
        installPaths.push(_path2['default'].join('c:', 'go', 'bin'));
        installPaths.push(_path2['default'].join('c:', 'tools', 'go', 'bin'));
      } else {
        /*
        /usr/local/go/bin = Binary Distribution
        /usr/local/bin = Homebrew
        */
        installPaths.push(_path2['default'].join('/', 'usr', 'local', 'go', 'bin'));
        installPaths.push(_path2['default'].join('/', 'usr', 'local', 'bin'));
      }
      return this.findExecutablesInPath(installPaths.join(_path2['default'].delimiter), this.goExecutables, options);
    }
  }, {
    key: 'findExecutablesInPath',
    value: function findExecutablesInPath(pathValue, executables) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var candidates = [];
      if ((0, _check.isFalsy)(pathValue) || pathValue.constructor !== String || pathValue.trim() === '') {
        return candidates;
      }

      if ((0, _check.isFalsy)(executables) || executables.constructor !== Array || executables.length < 1) {
        return candidates;
      }

      var elements = _pathhelper2['default'].expand(this.environment(options), pathValue).split(_path2['default'].delimiter);
      for (var element of elements) {
        for (var executable of executables) {
          var candidate = _path2['default'].join(element, executable);
          var stat = this.statishSync(candidate);
          if ((0, _check.isTruthy)(stat) && stat.isFile() && stat.size > 0) {
            candidates.push(candidate);
          }
        }
      }
      return candidates;
    }

    // Internal: Get a copy of the environment, with the GOPATH correctly set.
    // Returns an {Object} where the key is the environment variable name and the value is the environment variable value.
  }, {
    key: 'environment',
    value: function environment() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var env = this.rawEnvironment(options);
      var g = this.gopath(options);
      if (g && g !== '') {
        env.GOPATH = g;
      }
      return env;
    }
  }, {
    key: 'rawEnvironment',
    value: function rawEnvironment() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var env = process.env;
      if ((0, _check.isTruthy)(this.environmentFn)) {
        env = this.environmentFn();
      }
      env = Object.assign({}, env);
      return env;
    }

    // Internal: Indicates that the locator is ready, or not.
    // Returns true if ready, else false.
  }, {
    key: 'ready',
    value: function ready() {
      if ((0, _check.isFalsy)(this.readyFn)) {
        return true;
      }
      return this.readyFn();
    }

    // Internal: Set the strategy for finding known or built-in tools.
    // Returns a map where the key is the tool name and the value is the strategy.
  }, {
    key: 'setKnownToolStrategies',
    value: function setKnownToolStrategies() {
      this.toolStrategies = new Map();

      // Built-In Tools
      this.toolStrategies.set('go', 'GOROOTBIN');
      this.toolStrategies.set('gofmt', 'GOROOTBIN');
      this.toolStrategies.set('godoc', 'GOROOTBIN');
      this.toolStrategies.set('addr2line', 'GOTOOLDIR');
      this.toolStrategies.set('api', 'GOTOOLDIR');
      this.toolStrategies.set('asm', 'GOTOOLDIR');
      this.toolStrategies.set('cgo', 'GOTOOLDIR');
      this.toolStrategies.set('compile', 'GOTOOLDIR');
      this.toolStrategies.set('cover', 'GOTOOLDIR');
      this.toolStrategies.set('dist', 'GOTOOLDIR');
      this.toolStrategies.set('doc', 'GOTOOLDIR');
      this.toolStrategies.set('fix', 'GOTOOLDIR');
      this.toolStrategies.set('link', 'GOTOOLDIR');
      this.toolStrategies.set('nm', 'GOTOOLDIR');
      this.toolStrategies.set('objdump', 'GOTOOLDIR');
      this.toolStrategies.set('pack', 'GOTOOLDIR');
      this.toolStrategies.set('pprof', 'GOTOOLDIR');
      this.toolStrategies.set('tour', 'GOTOOLDIR');
      this.toolStrategies.set('trace', 'GOTOOLDIR');
      this.toolStrategies.set('vet', 'GOTOOLDIR');
      this.toolStrategies.set('yacc', 'GOTOOLDIR');

      // External Tools
      this.toolStrategies.set('git', 'PATH');

      // Other Tools Are Assumed To Be In PATH or GOBIN or GOPATH/bin
      // GOPATHBIN Can Be Used In The Future As A Strategy, If Required
      // GOPATHBIN Will Understand GO15VENDOREXPERIMENT
    }

    // Internal: Handle the specified error, if needed.
  }, {
    key: 'handleError',
    value: function handleError(err) {
      if ((0, _check.isTruthy)(err.handle)) {
        err.handle();
      }
      // console.log(err)
    }

    // Internal: Try to find a tool with the default strategy (GOPATH/bin, then
    // PATH).
    // Returns the path to the tool, or false if it cannot be found.
  }, {
    key: 'findToolWithDefaultStrategy',
    value: function findToolWithDefaultStrategy(name) {
      var _this5 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if ((0, _check.isFalsy)(name) || name.constructor !== String || name.trim() === '') {
        return Promise.resolve(false);
      }

      // Default Strategy Is: Look For The Tool In GOPATH, Then Look In PATH
      return Promise.resolve().then(function () {
        return _this5.findToolInDelimitedEnvironmentVariable(name, 'GOPATH', options);
      }).then(function (tool) {
        if ((0, _check.isTruthy)(tool)) {
          return tool;
        }
        return _this5.findToolInDelimitedEnvironmentVariable(name, _this5.pathKey, options);
      });
    }

    // Internal: Try to find a tool in a delimited environment variable (e.g.
    // PATH).
    // Returns the path to the tool, or false if it cannot be found.
  }, {
    key: 'findToolInDelimitedEnvironmentVariable',
    value: function findToolInDelimitedEnvironmentVariable(toolName, key) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if ((0, _check.isFalsy)(toolName) || toolName.constructor !== String || toolName.trim() === '') {
        return false;
      }

      var p = this.environment(options)[key];
      if ((0, _check.isFalsy)(p)) {
        return false;
      }

      var elements = p.split(_path2['default'].delimiter);
      if (key === 'GOPATH' && (0, _check.isTruthy)(this.environment(options)['GO15VENDOREXPERIMENT'])) {
        // TODO: Understand Vendor Experiment Paths Better
        // elements.unshift('vendor')
      }
      for (var element of elements) {
        var item = '';
        if (key === 'GOPATH') {
          item = _path2['default'].join(element, 'bin', toolName + this.executableSuffix);
        } else {
          item = _path2['default'].join(element, toolName + this.executableSuffix);
        }

        if (_fs2['default'].existsSync(item)) {
          var stat = _fs2['default'].statSync(item);
          if (stat && stat.isFile() && stat.size > 0) {
            return item;
          }
        }
      }

      return false;
    }
  }]);

  return Locator;
})();

exports.Locator = Locator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvbG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrQyxNQUFNOztxQkFDQyxTQUFTOzt3QkFDM0IsWUFBWTs7MEJBQ1osY0FBYzs7OztzQkFDdkIsUUFBUTs7OztrQkFDUCxJQUFJOzs7O2tCQUNKLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQVR2QixXQUFXLENBQUE7O0lBV0wsT0FBTztBQUNDLFdBRFIsT0FBTyxDQUNFLE9BQU8sRUFBRTs7OzBCQURsQixPQUFPOztBQUVULFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQTtBQUNyQixRQUFJLGdCQUFHLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtBQUM3QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO0tBQ3RCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3BGLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFFBQUkscUJBQVMsT0FBTyxDQUFDLEVBQUU7QUFDckIsVUFBSSxxQkFBUyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDakMsWUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFBO09BQ3pDO0FBQ0QsVUFBSSxxQkFBUyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDM0IsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFBO09BQzdCO0FBQ0QsVUFBSSxxQkFBUyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFBO09BQ2pDO0tBQ0Y7O0FBRUQsUUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtBQUMxQixVQUFJLENBQUMsUUFBUSxHQUFHLHVCQUFhLEVBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQTtLQUMzRTs7QUFFRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLFVBQVUsR0FBRzs7OztBQUloQixnQkFBTTtBQUFFLGFBQU8sTUFBSyxhQUFhLEVBQUUsQ0FBQTtLQUFFLEVBQ3JDLFlBQU07QUFBRSxhQUFPLE1BQUssbUJBQW1CLEVBQUUsQ0FBQTtLQUFFLEVBQzNDLFlBQU07QUFBRSxhQUFPLE1BQUssYUFBYSxFQUFFLENBQUE7S0FBRSxFQUNyQyxZQUFNO0FBQUUsYUFBTyxNQUFLLFdBQVcsRUFBRSxDQUFBO0tBQUUsRUFDbkMsWUFBTTtBQUFFLGFBQU8sTUFBSyxjQUFjLEVBQUUsQ0FBQTtLQUFFLENBQ3ZDLENBQUE7O0FBRUQsUUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUE7R0FDOUI7O2VBMUNHLE9BQU87O1dBNENILG1CQUFHO0FBQ1QsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQzdCO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDdEIsVUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTtBQUM1QixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQTtLQUMzQjs7Ozs7OztXQUtRLG9CQUFlOzs7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3BCLFVBQUkscUJBQVMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ2hDLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7T0FDM0M7O0FBRUQsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsWUFBSSxVQUFVLEdBQUcsT0FBSyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNoRCxZQUFJLG9CQUFRLFVBQVUsQ0FBQyxFQUFFO0FBQ3ZCLGlCQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUNuQjs7QUFFRCxZQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUN6QixhQUFLLElBQUksU0FBUyxJQUFJLFVBQVUsRUFBRTtBQUNoQyxjQUFJLFNBQVMsR0FBRyxPQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUUsa0JBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUMsQ0FBQTtBQUM5RixjQUFJLHFCQUFTLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pGLGdCQUFJLENBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFBO0FBQzdFLGdCQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzVDLGFBQUMsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0IsYUFBQyxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQixnQkFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM3QixlQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ2xEO0FBQ0QsNEJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1dBQ3pCO1NBQ0Y7O0FBRUQsWUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLGFBQUssSUFBSSxlQUFlLElBQUksZ0JBQWdCLEVBQUU7QUFDNUMsY0FBSSxLQUFLLEdBQUcsT0FBSyxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLEdBQUcsRUFBRSxrQkFBSyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQTtBQUM1RyxjQUFJLHFCQUFTLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3pFLGdCQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNwQyxpQkFBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDdEIsa0JBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNsQyxrQkFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLG9CQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzNCLG9CQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEIsb0JBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwQixvQkFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNwQix1QkFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUNuRDtBQUNELG9CQUFJLGdCQUFHLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtBQUM3QixzQkFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLHVCQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO21CQUNuQztpQkFDRixNQUFNO0FBQ0wsc0JBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDcEIseUJBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO21CQUM3QyxNQUFNO0FBQ0wseUJBQUssR0FBRyxFQUFFLENBQUE7bUJBQ1g7aUJBQ0Y7QUFDRCwrQkFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtlQUM3QjthQUNGO0FBQ0QsMkJBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7V0FDdEM7U0FDRjs7QUFFRCxlQUFLLGFBQWEsR0FBRyxlQUFlLENBQUE7QUFDcEMsZUFBTyxDQUFDLE9BQUssYUFBYSxDQUFDLENBQUE7T0FDNUIsQ0FBQyxDQUFBO0tBQ0g7Ozs7O1dBR2lCLDJCQUFDLE9BQU8sRUFBRTtBQUMxQixhQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN0Qjs7Ozs7OztXQUtPLG1CQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNuQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3hDLFlBQUksb0JBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDOUIsaUJBQU8sS0FBSyxDQUFBO1NBQ2IsTUFBTTtBQUNMLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNaO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7Ozs7OztXQUlNLGtCQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNsQixVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFVBQUksb0JBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQy9DLGVBQU8sS0FBSyxDQUFBO09BQ2I7O0FBRUQsYUFBTyx3QkFBVyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUN0Qzs7Ozs7O1dBSVEsa0JBQUMsSUFBSSxFQUFnQjs7O1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUMxQixVQUFJLG9CQUFRLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDdEUsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzlCOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3hCLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5Qjs7QUFFRCxVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDcEIsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3RDLFlBQUksT0FBSyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2pDLGtCQUFRLEdBQUcsT0FBSyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3pDO0FBQ0QsWUFBSSxvQkFBUSxRQUFRLENBQUMsRUFBRTtBQUNyQixrQkFBUSxHQUFHLFNBQVMsQ0FBQTtTQUNyQjtPQUNGLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNaLFlBQUksUUFBUSxLQUFLLFdBQVcsSUFBSSxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQ3hELGlCQUFPLEtBQUssQ0FBQTtTQUNiOztBQUVELGVBQU8sT0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzdDLGNBQUksb0JBQVEsT0FBTyxDQUFDLEVBQUU7QUFDcEIsbUJBQU8sS0FBSyxDQUFBO1dBQ2I7O0FBRUQsY0FBSSxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQzVCLGdCQUFJLElBQUksS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNuRSxxQkFBTyxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNqRTs7QUFFRCxtQkFBTyxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUM5RCxNQUFNLElBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUNuQyxtQkFBTyxrQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1dBQzFEO0FBQ0QsaUJBQU8sS0FBSyxDQUFBO1NBQ2IsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFlBQVksRUFBSztBQUN4QixZQUFJLHFCQUFTLFlBQVksQ0FBQyxFQUFFO0FBQzFCLGlCQUFPLE9BQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUN6QyxnQkFBSSxxQkFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDN0IscUJBQU8sWUFBWSxDQUFBO2FBQ3BCO1dBQ0YsQ0FBQyxTQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDaEIsbUJBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3JCLG1CQUFPLEtBQUssQ0FBQTtXQUNiLENBQUMsQ0FBQTtTQUNIOztBQUVELFlBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUM1QixpQkFBTyxPQUFLLHNDQUFzQyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7U0FDNUU7O0FBRUQsWUFBSSxRQUFRLEtBQUssTUFBTSxFQUFFO0FBQ3ZCLGlCQUFPLE9BQUssc0NBQXNDLENBQUMsSUFBSSxFQUFFLE9BQUssT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1NBQ2hGOztBQUVELGVBQU8sT0FBSywyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7T0FDdkQsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHlCQUFHO0FBQ2YsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7S0FDMUI7OztXQUVXLHFCQUFDLFNBQVMsRUFBRTtBQUN0QixVQUFJLElBQUksR0FBRyxLQUFLLENBQUE7QUFDaEIsVUFBSSxxQkFBUyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUEsQUFBQyxFQUFFO0FBQ3JELFlBQUk7QUFBRSxjQUFJLEdBQUcsZ0JBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFHO09BQ3BEO0FBQ0QsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBRUksY0FBQyxDQUFDLEVBQUU7OztBQUNQLFVBQUksb0JBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUM3RCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDOUI7O0FBRUQsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsd0JBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDeEIsY0FBSSxxQkFBUyxHQUFHLENBQUMsRUFBRTtBQUNqQixtQkFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDckIsbUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNkLG1CQUFNO1dBQ1A7QUFDRCxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2QsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVVLG9CQUFDLENBQUMsRUFBRTtBQUNiLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDaEMsWUFBSSxvQkFBUSxDQUFDLENBQUMsRUFBRTtBQUNkLGlCQUFPLEtBQUssQ0FBQTtTQUNiO0FBQ0QsZUFBTyxDQUFDLENBQUE7T0FDVCxDQUFDLENBQUE7S0FDSDs7O1dBRVUsb0JBQUMsQ0FBQyxFQUFFO0FBQ2IsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUM5QixZQUFJLG9CQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ2QsaUJBQU8sS0FBSyxDQUFBO1NBQ2I7O0FBRUQsWUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDZCxpQkFBTyxDQUFDLENBQUE7U0FDVDs7QUFFRCxlQUFPLEtBQUssQ0FBQTtPQUNiLENBQUMsQ0FBQTtLQUNIOzs7V0FFZSx5QkFBQyxDQUFDLEVBQUU7QUFDbEIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUM5QixZQUFJLG9CQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ2QsaUJBQU8sS0FBSyxDQUFBO1NBQ2I7O0FBRUQsWUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDbkIsaUJBQU8sQ0FBQyxDQUFBO1NBQ1Q7O0FBRUQsZUFBTyxLQUFLLENBQUE7T0FDYixDQUFDLENBQUE7S0FDSDs7O1dBRU0sZ0JBQUMsQ0FBQyxFQUFFO0FBQ1QsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUM5QixZQUFJLG9CQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ2QsaUJBQU8sS0FBSyxDQUFBO1NBQ2I7O0FBRUQsZUFBTyxJQUFJLENBQUE7T0FDWixDQUFDLENBQUE7S0FDSDs7O1dBRWlCLDZCQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUM3QixVQUFJLFVBQVUsR0FBRyxFQUFFLENBQUE7QUFDbkIsV0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25DLFlBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN4QixZQUFJLHFCQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzFELG9CQUFVLEdBQUcsb0JBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUNwQztPQUNGO0FBQ0QsYUFBTyxVQUFVLENBQUE7S0FDbEI7OztXQUVtQiwrQkFBZTtVQUFkLE9BQU8seURBQUcsRUFBRTs7O0FBRS9CLGFBQU8sS0FBSyxDQUFBO0tBQ2I7Ozs7OztXQUlhLHlCQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUN6QixVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQ2hFLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDM0MsVUFBSSxxQkFBUyxJQUFJLENBQUMsRUFBRTtBQUNsQixZQUFJLENBQUMsR0FBRyxjQUFjLENBQUE7QUFDdEIsWUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDakIsV0FBQyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtTQUNqQztBQUNELGVBQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFBO09BQ2hFOztBQUVELGFBQU8sRUFBRSxDQUFBO0tBQ1Y7OztXQUVhLHlCQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUN6QixVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUN4QyxVQUFJLG9CQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDakMsZUFBTyxFQUFFLENBQUE7T0FDVjtBQUNELGFBQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFLLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUNwRjs7O1dBRVcsdUJBQWU7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDeEc7OztXQUVjLDBCQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUMxQixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUE7QUFDckIsVUFBSSxnQkFBRyxRQUFRLEVBQUUsS0FBSyxPQUFPLEVBQUU7Ozs7O0FBSzdCLG9CQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDL0Msb0JBQVksQ0FBQyxJQUFJLENBQUMsa0JBQUssSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7T0FDekQsTUFBTTs7Ozs7QUFLTCxvQkFBWSxDQUFDLElBQUksQ0FBQyxrQkFBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDOUQsb0JBQVksQ0FBQyxJQUFJLENBQUMsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7T0FDekQ7QUFDRCxhQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDbEc7OztXQUVxQiwrQkFBQyxTQUFTLEVBQUUsV0FBVyxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDekQsVUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQUksb0JBQVEsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNyRixlQUFPLFVBQVUsQ0FBQTtPQUNsQjs7QUFFRCxVQUFJLG9CQUFRLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEtBQUssS0FBSyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZGLGVBQU8sVUFBVSxDQUFBO09BQ2xCOztBQUVELFVBQUksUUFBUSxHQUFHLHdCQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBSyxTQUFTLENBQUMsQ0FBQTtBQUM1RixXQUFLLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM1QixhQUFLLElBQUksVUFBVSxJQUFJLFdBQVcsRUFBRTtBQUNsQyxjQUFJLFNBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzlDLGNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDdEMsY0FBSSxxQkFBUyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7QUFDcEQsc0JBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7V0FDM0I7U0FDRjtPQUNGO0FBQ0QsYUFBTyxVQUFVLENBQUE7S0FDbEI7Ozs7OztXQUlXLHVCQUFlO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUN2QixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3RDLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRTtBQUNqQixXQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtPQUNmO0FBQ0QsYUFBTyxHQUFHLENBQUE7S0FDWDs7O1dBRWMsMEJBQWU7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQzFCLFVBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUE7QUFDckIsVUFBSSxxQkFBUyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDaEMsV0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtPQUMzQjtBQUNELFNBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUM1QixhQUFPLEdBQUcsQ0FBQTtLQUNYOzs7Ozs7V0FJSyxpQkFBRztBQUNQLFVBQUksb0JBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3pCLGVBQU8sSUFBSSxDQUFBO09BQ1o7QUFDRCxhQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN0Qjs7Ozs7O1dBSXNCLGtDQUFHO0FBQ3hCLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7O0FBRy9CLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMxQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzdDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMzQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzdDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDMUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzVDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM3QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBOzs7QUFHNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBOzs7OztLQUt2Qzs7Ozs7V0FHVyxxQkFBQyxHQUFHLEVBQUU7QUFDaEIsVUFBSSxxQkFBUyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDeEIsV0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFBO09BQ2I7O0tBRUY7Ozs7Ozs7V0FLMkIscUNBQUMsSUFBSSxFQUFnQjs7O1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUM3QyxVQUFJLG9CQUFRLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDdEUsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzlCOzs7QUFHRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNsQyxlQUFPLE9BQUssc0NBQXNDLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtPQUM1RSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hCLFlBQUkscUJBQVMsSUFBSSxDQUFDLEVBQUU7QUFDbEIsaUJBQU8sSUFBSSxDQUFBO1NBQ1o7QUFDRCxlQUFPLE9BQUssc0NBQXNDLENBQUMsSUFBSSxFQUFFLE9BQUssT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO09BQ2hGLENBQUMsQ0FBQTtLQUNIOzs7Ozs7O1dBS3NDLGdEQUFDLFFBQVEsRUFBRSxHQUFHLEVBQWdCO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNqRSxVQUFJLG9CQUFRLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDbEYsZUFBTyxLQUFLLENBQUE7T0FDYjs7QUFFRCxVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3RDLFVBQUksb0JBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDZCxlQUFPLEtBQUssQ0FBQTtPQUNiOztBQUVELFVBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQUssU0FBUyxDQUFDLENBQUE7QUFDdEMsVUFBSSxHQUFHLEtBQUssUUFBUSxJQUFJLHFCQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxFQUFFOzs7T0FHcEY7QUFDRCxXQUFLLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM1QixZQUFJLElBQUksR0FBRyxFQUFFLENBQUE7QUFDYixZQUFJLEdBQUcsS0FBSyxRQUFRLEVBQUU7QUFDcEIsY0FBSSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtTQUNuRSxNQUFNO0FBQ0wsY0FBSSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1NBQzVEOztBQUVELFlBQUksZ0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGNBQUksSUFBSSxHQUFHLGdCQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM1QixjQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7QUFDMUMsbUJBQU8sSUFBSSxDQUFBO1dBQ1o7U0FDRjtPQUNGOztBQUVELGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztTQTlmRyxPQUFPOzs7UUFpZ0JMLE9BQU8sR0FBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvbG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7aXNUcnV0aHksIGlzRmFsc3ksIGlzRW1wdHl9IGZyb20gJy4vY2hlY2snXG5pbXBvcnQge0V4ZWN1dG9yfSBmcm9tICcuL2V4ZWN1dG9yJ1xuaW1wb3J0IHBhdGhoZWxwZXIgZnJvbSAnLi9wYXRoaGVscGVyJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY2xhc3MgTG9jYXRvciB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW52aXJvbm1lbnRGbiA9IG51bGxcbiAgICB0aGlzLmV4ZWN1dG9yID0gbnVsbFxuICAgIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeCA9ICcnXG4gICAgdGhpcy5wYXRoS2V5ID0gJ1BBVEgnXG4gICAgaWYgKG9zLnBsYXRmb3JtKCkgPT09ICd3aW4zMicpIHtcbiAgICAgIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeCA9ICcuZXhlJ1xuICAgICAgdGhpcy5wYXRoS2V5ID0gJ1BhdGgnXG4gICAgfVxuICAgIHRoaXMuZ29FeGVjdXRhYmxlcyA9IFsnZ28nICsgdGhpcy5leGVjdXRhYmxlU3VmZml4LCAnZ29hcHAnICsgdGhpcy5leGVjdXRhYmxlU3VmZml4XVxuICAgIHRoaXMucmVhZHlGbiA9IG51bGxcbiAgICBpZiAoaXNUcnV0aHkob3B0aW9ucykpIHtcbiAgICAgIGlmIChpc1RydXRoeShvcHRpb25zLmVudmlyb25tZW50KSkge1xuICAgICAgICB0aGlzLmVudmlyb25tZW50Rm4gPSBvcHRpb25zLmVudmlyb25tZW50XG4gICAgICB9XG4gICAgICBpZiAoaXNUcnV0aHkob3B0aW9ucy5yZWFkeSkpIHtcbiAgICAgICAgdGhpcy5yZWFkeUZuID0gb3B0aW9ucy5yZWFkeVxuICAgICAgfVxuICAgICAgaWYgKGlzVHJ1dGh5KG9wdGlvbnMuZXhlY3V0b3IpKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0b3IgPSBvcHRpb25zLmV4ZWN1dG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZXhlY3V0b3IgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZXhlY3V0b3IgPSBuZXcgRXhlY3V0b3Ioe2Vudmlyb25tZW50Rm46IHRoaXMuZW52aXJvbm1lbnQuYmluZCh0aGlzKX0pXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmV4ZWN1dG9yKVxuICAgIHRoaXMuZ29Mb2NhdG9ycyA9IFtcbiAgICAgIC8vIEF2b2lkIHVzaW5nIGdvcm9vdExvY2F0b3IgLyBHT1JPT1QgdW5sZXNzIHlvdSBrbm93IHdoYXQgeW91J3JlIGRvaW5nXG4gICAgICAvLyAoYW5kIGFzc3VtZSB5b3UgZG9uJ3Qga25vdyB3aGF0IHlvdSdyZSB1bmxlc3MgeW91IGhhdmUgc2lnbmlmaWNhbnRcbiAgICAgIC8vIGdvIGV4cGVyaWVuY2UpXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdvcm9vdExvY2F0b3IoKSB9LFxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5lZGl0b3Jjb25maWdMb2NhdG9yKCkgfSxcbiAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuY29uZmlnTG9jYXRvcigpIH0sXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLnBhdGhMb2NhdG9yKCkgfSxcbiAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZGVmYXVsdExvY2F0b3IoKSB9XG4gICAgXVxuXG4gICAgdGhpcy5zZXRLbm93blRvb2xTdHJhdGVnaWVzKClcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMucmVzZXRSdW50aW1lcygpXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLmdvTG9jYXRvcnMgPSBudWxsXG4gICAgdGhpcy5leGVjdXRhYmxlU3VmZml4ID0gbnVsbFxuICAgIHRoaXMucGF0aEtleSA9IG51bGxcbiAgICB0aGlzLmdvRXhlY3V0YWJsZXMgPSBudWxsXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZW52aXJvbm1lbnRGbiA9IG51bGxcbiAgICB0aGlzLmV4ZWN1dG9yID0gbnVsbFxuICAgIHRoaXMucmVhZHlGbiA9IG51bGxcbiAgICB0aGlzLnRvb2xMb2NhdGlvbnMgPSBudWxsXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcyA9IG51bGxcbiAgfVxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBnbyBydW50aW1lKHMpLlxuICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIHtPYmplY3R9IHdoZXJlIGVhY2ggaXRlbSBjb250YWlucyB0aGUgb3V0cHV0IGZyb20gXCJnb1xuICAvLyBlbnZcIiwgb3IgZmFsc2UgaWYgbm8gcnVudGltZXMgYXJlIGZvdW5kLlxuICBydW50aW1lcyAob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKGlzVHJ1dGh5KHRoaXMucnVudGltZXNDYWNoZSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5ydW50aW1lc0NhY2hlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgY2FuZGlkYXRlcyA9IHRoaXMucnVudGltZUNhbmRpZGF0ZXMob3B0aW9ucylcbiAgICAgIGlmIChpc0VtcHR5KGNhbmRpZGF0ZXMpKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKFtdKVxuICAgICAgfVxuXG4gICAgICBsZXQgdmlhYmxlQ2FuZGlkYXRlcyA9IFtdXG4gICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlcykge1xuICAgICAgICBsZXQgZ292ZXJzaW9uID0gdGhpcy5leGVjdXRvci5leGVjU3luYyhjYW5kaWRhdGUsIFsndmVyc2lvbiddLCB7Y3dkOiBwYXRoLmRpcm5hbWUoY2FuZGlkYXRlKX0pXG4gICAgICAgIGlmIChpc1RydXRoeShnb3ZlcnNpb24pICYmIGdvdmVyc2lvbi5leGl0Y29kZSA9PT0gMCAmJiBnb3ZlcnNpb24uc3Rkb3V0LnN0YXJ0c1dpdGgoJ2dvICcpKSB7XG4gICAgICAgICAgbGV0IHYgPSB7cGF0aDogY2FuZGlkYXRlLCB2ZXJzaW9uOiBnb3ZlcnNpb24uc3Rkb3V0LnJlcGxhY2UoL1xccj9cXG58XFxyL2csICcnKX1cbiAgICAgICAgICBsZXQgdmVyc2lvbkNvbXBvbmVudHMgPSB2LnZlcnNpb24uc3BsaXQoJyAnKVxuICAgICAgICAgIHYubmFtZSA9IHZlcnNpb25Db21wb25lbnRzWzJdXG4gICAgICAgICAgdi5zZW12ZXIgPSB2ZXJzaW9uQ29tcG9uZW50c1syXVxuICAgICAgICAgIGlmICh2LnNlbXZlci5zdGFydHNXaXRoKCdnbycpKSB7XG4gICAgICAgICAgICB2LnNlbXZlciA9IHYuc2VtdmVyLnN1YnN0cmluZygyLCB2LnNlbXZlci5sZW5ndGgpXG4gICAgICAgICAgfVxuICAgICAgICAgIHZpYWJsZUNhbmRpZGF0ZXMucHVzaCh2KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBmaW5hbENhbmRpZGF0ZXMgPSBbXVxuICAgICAgZm9yIChsZXQgdmlhYmxlQ2FuZGlkYXRlIG9mIHZpYWJsZUNhbmRpZGF0ZXMpIHtcbiAgICAgICAgbGV0IGdvZW52ID0gdGhpcy5leGVjdXRvci5leGVjU3luYyh2aWFibGVDYW5kaWRhdGUucGF0aCwgWydlbnYnXSwge2N3ZDogcGF0aC5kaXJuYW1lKHZpYWJsZUNhbmRpZGF0ZS5wYXRoKX0pXG4gICAgICAgIGlmIChpc1RydXRoeShnb2VudikgJiYgZ29lbnYuZXhpdGNvZGUgPT09IDAgJiYgZ29lbnYuc3Rkb3V0LnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgICBsZXQgaXRlbXMgPSBnb2Vudi5zdGRvdXQuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvW1xcblxccl0vZywgJycpXG4gICAgICAgICAgICBpZiAoaXRlbS5pbmNsdWRlcygnPScpKSB7XG4gICAgICAgICAgICAgIGxldCB0dXBsZSA9IGl0ZW0uc3BsaXQoJz0nKVxuICAgICAgICAgICAgICBsZXQga2V5ID0gdHVwbGVbMF1cbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdHVwbGVbMV1cbiAgICAgICAgICAgICAgaWYgKHR1cGxlLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHR1cGxlLnNsaWNlKDEsIHR1cGxlLmxlbmd0aCArIDEpLmpvaW4oJz0nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCdzZXQgJykpIHtcbiAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoNCwga2V5Lmxlbmd0aClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gJydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmlhYmxlQ2FuZGlkYXRlW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbENhbmRpZGF0ZXMucHVzaCh2aWFibGVDYW5kaWRhdGUpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5ydW50aW1lc0NhY2hlID0gZmluYWxDYW5kaWRhdGVzXG4gICAgICByZXNvbHZlKHRoaXMucnVudGltZXNDYWNoZSlcbiAgICB9KVxuICB9XG5cbiAgLy8gRGVwcmVjYXRlZDogVXNlIHJ1bnRpbWUob3B0aW9ucykgaW5zdGVhZC5cbiAgcnVudGltZUZvclByb2plY3QgKHByb2plY3QpIHtcbiAgICByZXR1cm4gdGhpcy5ydW50aW1lKClcbiAgfVxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBnbyBydW50aW1lLlxuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGNvbnRhaW5zIHRoZSBvdXRwdXQgZnJvbSBcImdvIGVudlwiLCBvciBmYWxzZSBpZlxuICAvLyBubyBydW50aW1lIGlzIGZvdW5kLlxuICBydW50aW1lIChvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5ydW50aW1lcyhvcHRpb25zKS50aGVuKChyKSA9PiB7XG4gICAgICBpZiAoaXNGYWxzeShyKSB8fCByLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gclswXVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBQdWJsaWM6IEdldCB0aGUgZ29wYXRoLlxuICAvLyBSZXR1cm5zIHRoZSBHT1BBVEggaWYgaXQgZXhpc3RzLCBvciBmYWxzZSBpZiBpdCBpcyBub3QgZGVmaW5lZC5cbiAgZ29wYXRoIChvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZSA9IHRoaXMucmF3RW52aXJvbm1lbnQob3B0aW9ucylcbiAgICBpZiAoaXNGYWxzeShlLkdPUEFUSCkgfHwgZS5HT1BBVEgudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGhoZWxwZXIuZXhwYW5kKGUsIGUuR09QQVRIKVxuICB9XG5cbiAgLy8gUHVibGljOiBGaW5kIHRoZSBzcGVjaWZpZWQgdG9vbC5cbiAgLy8gUmV0dXJucyB0aGUgcGF0aCB0byB0aGUgdG9vbCBpZiBmb3VuZCwgb3IgZmFsc2UgaWYgaXQgY2Fubm90IGJlIGZvdW5kLlxuICBmaW5kVG9vbCAobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKGlzRmFsc3kobmFtZSkgfHwgbmFtZS5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8IG5hbWUudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudG9vbFN0cmF0ZWdpZXMpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgbGV0IHN0cmF0ZWd5ID0gZmFsc2VcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMudG9vbFN0cmF0ZWdpZXMuaGFzKG5hbWUpKSB7XG4gICAgICAgIHN0cmF0ZWd5ID0gdGhpcy50b29sU3RyYXRlZ2llcy5nZXQobmFtZSlcbiAgICAgIH1cbiAgICAgIGlmIChpc0ZhbHN5KHN0cmF0ZWd5KSkge1xuICAgICAgICBzdHJhdGVneSA9ICdERUZBVUxUJ1xuICAgICAgfVxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHN0cmF0ZWd5ICE9PSAnR09ST09UQklOJyAmJiBzdHJhdGVneSAhPT0gJ0dPVE9PTERJUicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ1bnRpbWUob3B0aW9ucykudGhlbigocnVudGltZSkgPT4ge1xuICAgICAgICBpZiAoaXNGYWxzeShydW50aW1lKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0cmF0ZWd5ID09PSAnR09ST09UQklOJykge1xuICAgICAgICAgIGlmIChuYW1lID09PSAnZ28nICYmIHJ1bnRpbWUucGF0aC5lbmRzV2l0aCgnZ29hcHAnICsgcnVudGltZS5HT0VYRSkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4ocnVudGltZS5HT1JPT1QsICdiaW4nLCAnZ29hcHAnICsgcnVudGltZS5HT0VYRSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcGF0aC5qb2luKHJ1bnRpbWUuR09ST09ULCAnYmluJywgbmFtZSArIHJ1bnRpbWUuR09FWEUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3RyYXRlZ3kgPT09ICdHT1RPT0xESVInKSB7XG4gICAgICAgICAgcmV0dXJuIHBhdGguam9pbihydW50aW1lLkdPVE9PTERJUiwgbmFtZSArIHJ1bnRpbWUuR09FWEUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuICAgIH0pLnRoZW4oKHNwZWNpZmljVG9vbCkgPT4ge1xuICAgICAgaWYgKGlzVHJ1dGh5KHNwZWNpZmljVG9vbCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdChzcGVjaWZpY1Rvb2wpLnRoZW4oKHMpID0+IHtcbiAgICAgICAgICBpZiAoaXNUcnV0aHkocykgJiYgcy5pc0ZpbGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWNpZmljVG9vbFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RyYXRlZ3kgPT09ICdHT1BBVEhCSU4nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRUb29sSW5EZWxpbWl0ZWRFbnZpcm9ubWVudFZhcmlhYmxlKG5hbWUsICdHT1BBVEgnLCBvcHRpb25zKVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RyYXRlZ3kgPT09ICdQQVRIJykge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kVG9vbEluRGVsaW1pdGVkRW52aXJvbm1lbnRWYXJpYWJsZShuYW1lLCB0aGlzLnBhdGhLZXksIG9wdGlvbnMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmRUb29sV2l0aERlZmF1bHRTdHJhdGVneShuYW1lLCBvcHRpb25zKVxuICAgIH0pXG4gIH1cblxuICByZXNldFJ1bnRpbWVzICgpIHtcbiAgICB0aGlzLnJ1bnRpbWVzQ2FjaGUgPSBudWxsXG4gIH1cblxuICBzdGF0aXNoU3luYyAocGF0aFZhbHVlKSB7XG4gICAgbGV0IHN0YXQgPSBmYWxzZVxuICAgIGlmIChpc1RydXRoeShwYXRoVmFsdWUpICYmICEocGF0aFZhbHVlLnRyaW0oKSA9PT0gJycpKSB7XG4gICAgICB0cnkgeyBzdGF0ID0gZnMuc3RhdFN5bmMocGF0aFZhbHVlKSB9IGNhdGNoIChlKSB7IH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRcbiAgfVxuXG4gIHN0YXQgKHApIHtcbiAgICBpZiAoaXNGYWxzeShwKSB8fCBwLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHwgcC50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmcy5zdGF0KHAsIChlcnIsIHN0YXQpID0+IHtcbiAgICAgICAgaWYgKGlzVHJ1dGh5KGVycikpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGVycilcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoc3RhdClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHBhdGhFeGlzdHMgKHApIHtcbiAgICByZXR1cm4gdGhpcy5leGlzdHMocCkudGhlbigoZSkgPT4ge1xuICAgICAgaWYgKGlzRmFsc3koZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gcFxuICAgIH0pXG4gIH1cblxuICBmaWxlRXhpc3RzIChwKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdChwKS50aGVuKChzKSA9PiB7XG4gICAgICBpZiAoaXNGYWxzeShzKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHMuaXNGaWxlKCkpIHtcbiAgICAgICAgcmV0dXJuIHBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIGRpcmVjdG9yeUV4aXN0cyAocCkge1xuICAgIHJldHVybiB0aGlzLnN0YXQocCkudGhlbigocykgPT4ge1xuICAgICAgaWYgKGlzRmFsc3kocykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmIChzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgcmV0dXJuIHBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIGV4aXN0cyAocCkge1xuICAgIHJldHVybiB0aGlzLnN0YXQocCkudGhlbigocykgPT4ge1xuICAgICAgaWYgKGlzRmFsc3kocykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIHJ1bnRpbWVDYW5kaWRhdGVzIChvcHRpb25zID0ge30pIHtcbiAgICBsZXQgY2FuZGlkYXRlcyA9IFtdXG4gICAgZm9yIChsZXQgbG9jYXRvciBvZiB0aGlzLmdvTG9jYXRvcnMpIHtcbiAgICAgIGxldCBjID0gbG9jYXRvcihvcHRpb25zKVxuICAgICAgaWYgKGlzVHJ1dGh5KGMpICYmIGMuY29uc3RydWN0b3IgPT09IEFycmF5ICYmIGMubGVuZ3RoID4gMCkge1xuICAgICAgICBjYW5kaWRhdGVzID0gXy51bmlvbihjYW5kaWRhdGVzLCBjKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FuZGlkYXRlc1xuICB9XG5cbiAgZWRpdG9yY29uZmlnTG9jYXRvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gVE9ETzogLmVkaXRvcmNvbmZpZ1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEZpbmQgYSBnbyBpbnN0YWxsYXRpb24gdXNpbmcgeW91ciBBdG9tIGNvbmZpZy4gRGVsaWJlcmF0ZWx5XG4gIC8vIHVuZG9jdW1lbnRlZCwgYXMgdGhpcyBtZXRob2QgaXMgZGlzY291cmFnZWQuXG4gIGNvbmZpZ0xvY2F0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBnb2luc3RhbGxhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ28tY29uZmlnLmdvaW5zdGFsbGF0aW9uJylcbiAgICBsZXQgc3RhdCA9IHRoaXMuc3RhdGlzaFN5bmMoZ29pbnN0YWxsYXRpb24pXG4gICAgaWYgKGlzVHJ1dGh5KHN0YXQpKSB7XG4gICAgICBsZXQgZCA9IGdvaW5zdGFsbGF0aW9uXG4gICAgICBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgICBkID0gcGF0aC5kaXJuYW1lKGdvaW5zdGFsbGF0aW9uKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZmluZEV4ZWN1dGFibGVzSW5QYXRoKGQsIHRoaXMuZXhlY3V0YWJsZXMsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBnb3Jvb3RMb2NhdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZyA9IHRoaXMuZW52aXJvbm1lbnQob3B0aW9ucykuR09ST09UXG4gICAgaWYgKGlzRmFsc3koZykgfHwgZy50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmluZEV4ZWN1dGFibGVzSW5QYXRoKHBhdGguam9pbihnLCAnYmluJyksIHRoaXMuZ29FeGVjdXRhYmxlcywgb3B0aW9ucylcbiAgfVxuXG4gIHBhdGhMb2NhdG9yIChvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maW5kRXhlY3V0YWJsZXNJblBhdGgodGhpcy5lbnZpcm9ubWVudChvcHRpb25zKVt0aGlzLnBhdGhLZXldLCB0aGlzLmdvRXhlY3V0YWJsZXMsIG9wdGlvbnMpXG4gIH1cblxuICBkZWZhdWx0TG9jYXRvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGluc3RhbGxQYXRocyA9IFtdXG4gICAgaWYgKG9zLnBsYXRmb3JtKCkgPT09ICd3aW4zMicpIHtcbiAgICAgIC8qXG4gICAgICBjOlxcZ29cXGJpbiA9IEJpbmFyeSBEaXN0cmlidXRpb25cbiAgICAgIGM6XFx0b29sc1xcZ29cXGJpbiA9IENob2NvbGF0ZXlcbiAgICAgICovXG4gICAgICBpbnN0YWxsUGF0aHMucHVzaChwYXRoLmpvaW4oJ2M6JywgJ2dvJywgJ2JpbicpKVxuICAgICAgaW5zdGFsbFBhdGhzLnB1c2gocGF0aC5qb2luKCdjOicsICd0b29scycsICdnbycsICdiaW4nKSlcbiAgICB9IGVsc2Uge1xuICAgICAgLypcbiAgICAgIC91c3IvbG9jYWwvZ28vYmluID0gQmluYXJ5IERpc3RyaWJ1dGlvblxuICAgICAgL3Vzci9sb2NhbC9iaW4gPSBIb21lYnJld1xuICAgICAgKi9cbiAgICAgIGluc3RhbGxQYXRocy5wdXNoKHBhdGguam9pbignLycsICd1c3InLCAnbG9jYWwnLCAnZ28nLCAnYmluJykpXG4gICAgICBpbnN0YWxsUGF0aHMucHVzaChwYXRoLmpvaW4oJy8nLCAndXNyJywgJ2xvY2FsJywgJ2JpbicpKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5maW5kRXhlY3V0YWJsZXNJblBhdGgoaW5zdGFsbFBhdGhzLmpvaW4ocGF0aC5kZWxpbWl0ZXIpLCB0aGlzLmdvRXhlY3V0YWJsZXMsIG9wdGlvbnMpXG4gIH1cblxuICBmaW5kRXhlY3V0YWJsZXNJblBhdGggKHBhdGhWYWx1ZSwgZXhlY3V0YWJsZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjYW5kaWRhdGVzID0gW11cbiAgICBpZiAoaXNGYWxzeShwYXRoVmFsdWUpIHx8IHBhdGhWYWx1ZS5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8IHBhdGhWYWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlc1xuICAgIH1cblxuICAgIGlmIChpc0ZhbHN5KGV4ZWN1dGFibGVzKSB8fCBleGVjdXRhYmxlcy5jb25zdHJ1Y3RvciAhPT0gQXJyYXkgfHwgZXhlY3V0YWJsZXMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIGNhbmRpZGF0ZXNcbiAgICB9XG5cbiAgICBsZXQgZWxlbWVudHMgPSBwYXRoaGVscGVyLmV4cGFuZCh0aGlzLmVudmlyb25tZW50KG9wdGlvbnMpLCBwYXRoVmFsdWUpLnNwbGl0KHBhdGguZGVsaW1pdGVyKVxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGZvciAobGV0IGV4ZWN1dGFibGUgb2YgZXhlY3V0YWJsZXMpIHtcbiAgICAgICAgbGV0IGNhbmRpZGF0ZSA9IHBhdGguam9pbihlbGVtZW50LCBleGVjdXRhYmxlKVxuICAgICAgICBsZXQgc3RhdCA9IHRoaXMuc3RhdGlzaFN5bmMoY2FuZGlkYXRlKVxuICAgICAgICBpZiAoaXNUcnV0aHkoc3RhdCkgJiYgc3RhdC5pc0ZpbGUoKSAmJiBzdGF0LnNpemUgPiAwKSB7XG4gICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FuZGlkYXRlc1xuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEdldCBhIGNvcHkgb2YgdGhlIGVudmlyb25tZW50LCB3aXRoIHRoZSBHT1BBVEggY29ycmVjdGx5IHNldC5cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGVyZSB0aGUga2V5IGlzIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBuYW1lIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGVudmlyb25tZW50IHZhcmlhYmxlIHZhbHVlLlxuICBlbnZpcm9ubWVudCAob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGVudiA9IHRoaXMucmF3RW52aXJvbm1lbnQob3B0aW9ucylcbiAgICBsZXQgZyA9IHRoaXMuZ29wYXRoKG9wdGlvbnMpXG4gICAgaWYgKGcgJiYgZyAhPT0gJycpIHtcbiAgICAgIGVudi5HT1BBVEggPSBnXG4gICAgfVxuICAgIHJldHVybiBlbnZcbiAgfVxuXG4gIHJhd0Vudmlyb25tZW50IChvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZW52ID0gcHJvY2Vzcy5lbnZcbiAgICBpZiAoaXNUcnV0aHkodGhpcy5lbnZpcm9ubWVudEZuKSkge1xuICAgICAgZW52ID0gdGhpcy5lbnZpcm9ubWVudEZuKClcbiAgICB9XG4gICAgZW52ID0gT2JqZWN0LmFzc2lnbih7fSwgZW52KVxuICAgIHJldHVybiBlbnZcbiAgfVxuXG4gIC8vIEludGVybmFsOiBJbmRpY2F0ZXMgdGhhdCB0aGUgbG9jYXRvciBpcyByZWFkeSwgb3Igbm90LlxuICAvLyBSZXR1cm5zIHRydWUgaWYgcmVhZHksIGVsc2UgZmFsc2UuXG4gIHJlYWR5ICgpIHtcbiAgICBpZiAoaXNGYWxzeSh0aGlzLnJlYWR5Rm4pKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZWFkeUZuKClcbiAgfVxuXG4gIC8vIEludGVybmFsOiBTZXQgdGhlIHN0cmF0ZWd5IGZvciBmaW5kaW5nIGtub3duIG9yIGJ1aWx0LWluIHRvb2xzLlxuICAvLyBSZXR1cm5zIGEgbWFwIHdoZXJlIHRoZSBrZXkgaXMgdGhlIHRvb2wgbmFtZSBhbmQgdGhlIHZhbHVlIGlzIHRoZSBzdHJhdGVneS5cbiAgc2V0S25vd25Ub29sU3RyYXRlZ2llcyAoKSB7XG4gICAgdGhpcy50b29sU3RyYXRlZ2llcyA9IG5ldyBNYXAoKVxuXG4gICAgLy8gQnVpbHQtSW4gVG9vbHNcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZ28nLCAnR09ST09UQklOJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZ29mbXQnLCAnR09ST09UQklOJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZ29kb2MnLCAnR09ST09UQklOJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnYWRkcjJsaW5lJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2FwaScsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdhc20nLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnY2dvJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2NvbXBpbGUnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnY292ZXInLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZGlzdCcsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdkb2MnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZml4JywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2xpbmsnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnbm0nLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnb2JqZHVtcCcsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdwYWNrJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ3Bwcm9mJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ3RvdXInLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgndHJhY2UnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgndmV0JywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ3lhY2MnLCAnR09UT09MRElSJylcblxuICAgIC8vIEV4dGVybmFsIFRvb2xzXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2dpdCcsICdQQVRIJylcblxuICAgIC8vIE90aGVyIFRvb2xzIEFyZSBBc3N1bWVkIFRvIEJlIEluIFBBVEggb3IgR09CSU4gb3IgR09QQVRIL2JpblxuICAgIC8vIEdPUEFUSEJJTiBDYW4gQmUgVXNlZCBJbiBUaGUgRnV0dXJlIEFzIEEgU3RyYXRlZ3ksIElmIFJlcXVpcmVkXG4gICAgLy8gR09QQVRIQklOIFdpbGwgVW5kZXJzdGFuZCBHTzE1VkVORE9SRVhQRVJJTUVOVFxuICB9XG5cbiAgLy8gSW50ZXJuYWw6IEhhbmRsZSB0aGUgc3BlY2lmaWVkIGVycm9yLCBpZiBuZWVkZWQuXG4gIGhhbmRsZUVycm9yIChlcnIpIHtcbiAgICBpZiAoaXNUcnV0aHkoZXJyLmhhbmRsZSkpIHtcbiAgICAgIGVyci5oYW5kbGUoKVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhlcnIpXG4gIH1cblxuICAvLyBJbnRlcm5hbDogVHJ5IHRvIGZpbmQgYSB0b29sIHdpdGggdGhlIGRlZmF1bHQgc3RyYXRlZ3kgKEdPUEFUSC9iaW4sIHRoZW5cbiAgLy8gUEFUSCkuXG4gIC8vIFJldHVybnMgdGhlIHBhdGggdG8gdGhlIHRvb2wsIG9yIGZhbHNlIGlmIGl0IGNhbm5vdCBiZSBmb3VuZC5cbiAgZmluZFRvb2xXaXRoRGVmYXVsdFN0cmF0ZWd5IChuYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoaXNGYWxzeShuYW1lKSB8fCBuYW1lLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHwgbmFtZS50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgU3RyYXRlZ3kgSXM6IExvb2sgRm9yIFRoZSBUb29sIEluIEdPUEFUSCwgVGhlbiBMb29rIEluIFBBVEhcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kVG9vbEluRGVsaW1pdGVkRW52aXJvbm1lbnRWYXJpYWJsZShuYW1lLCAnR09QQVRIJywgb3B0aW9ucylcbiAgICB9KS50aGVuKCh0b29sKSA9PiB7XG4gICAgICBpZiAoaXNUcnV0aHkodG9vbCkpIHtcbiAgICAgICAgcmV0dXJuIHRvb2xcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZpbmRUb29sSW5EZWxpbWl0ZWRFbnZpcm9ubWVudFZhcmlhYmxlKG5hbWUsIHRoaXMucGF0aEtleSwgb3B0aW9ucylcbiAgICB9KVxuICB9XG5cbiAgLy8gSW50ZXJuYWw6IFRyeSB0byBmaW5kIGEgdG9vbCBpbiBhIGRlbGltaXRlZCBlbnZpcm9ubWVudCB2YXJpYWJsZSAoZS5nLlxuICAvLyBQQVRIKS5cbiAgLy8gUmV0dXJucyB0aGUgcGF0aCB0byB0aGUgdG9vbCwgb3IgZmFsc2UgaWYgaXQgY2Fubm90IGJlIGZvdW5kLlxuICBmaW5kVG9vbEluRGVsaW1pdGVkRW52aXJvbm1lbnRWYXJpYWJsZSAodG9vbE5hbWUsIGtleSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKGlzRmFsc3kodG9vbE5hbWUpIHx8IHRvb2xOYW1lLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgfHwgdG9vbE5hbWUudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgbGV0IHAgPSB0aGlzLmVudmlyb25tZW50KG9wdGlvbnMpW2tleV1cbiAgICBpZiAoaXNGYWxzeShwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgbGV0IGVsZW1lbnRzID0gcC5zcGxpdChwYXRoLmRlbGltaXRlcilcbiAgICBpZiAoa2V5ID09PSAnR09QQVRIJyAmJiBpc1RydXRoeSh0aGlzLmVudmlyb25tZW50KG9wdGlvbnMpWydHTzE1VkVORE9SRVhQRVJJTUVOVCddKSkge1xuICAgICAgLy8gVE9ETzogVW5kZXJzdGFuZCBWZW5kb3IgRXhwZXJpbWVudCBQYXRocyBCZXR0ZXJcbiAgICAgIC8vIGVsZW1lbnRzLnVuc2hpZnQoJ3ZlbmRvcicpXG4gICAgfVxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGxldCBpdGVtID0gJydcbiAgICAgIGlmIChrZXkgPT09ICdHT1BBVEgnKSB7XG4gICAgICAgIGl0ZW0gPSBwYXRoLmpvaW4oZWxlbWVudCwgJ2JpbicsIHRvb2xOYW1lICsgdGhpcy5leGVjdXRhYmxlU3VmZml4KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbSA9IHBhdGguam9pbihlbGVtZW50LCB0b29sTmFtZSArIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeClcbiAgICAgIH1cblxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaXRlbSkpIHtcbiAgICAgICAgbGV0IHN0YXQgPSBmcy5zdGF0U3luYyhpdGVtKVxuICAgICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRmlsZSgpICYmIHN0YXQuc2l6ZSA+IDApIHtcbiAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IHtMb2NhdG9yfVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/locator.js
