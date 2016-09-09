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

      // Preferred: The Environment
      var e = this.rawEnvironment(options);
      var g = e.GOPATH;
      if ((0, _check.isTruthy)(g) && g.trim() !== '') {
        return _pathhelper2['default'].expand(e, g);
      }

      // Fallback: Atom Config
      g = atom.config.get('go-config.gopath');
      if ((0, _check.isTruthy)(g) && g.trim() !== '') {
        return _pathhelper2['default'].expand(e, g);
      }

      // Fallback: Legacy go-plus Config
      g = atom.config.get('go-plus.gopath');
      if ((0, _check.isTruthy)(g) && g.trim() !== '') {
        return _pathhelper2['default'].expand(e, g);
      }

      return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvbG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrQyxNQUFNOztxQkFDQyxTQUFTOzt3QkFDM0IsWUFBWTs7MEJBQ1osY0FBYzs7OztzQkFDdkIsUUFBUTs7OztrQkFDUCxJQUFJOzs7O2tCQUNKLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQVR2QixXQUFXLENBQUE7O0lBV0wsT0FBTztBQUNDLFdBRFIsT0FBTyxDQUNFLE9BQU8sRUFBRTs7OzBCQURsQixPQUFPOztBQUVULFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQTtBQUNyQixRQUFJLGdCQUFHLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtBQUM3QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBO0tBQ3RCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3BGLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFFBQUkscUJBQVMsT0FBTyxDQUFDLEVBQUU7QUFDckIsVUFBSSxxQkFBUyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDakMsWUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFBO09BQ3pDO0FBQ0QsVUFBSSxxQkFBUyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7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QUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMxQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzdDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMzQyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzdDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDMUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQzVDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM3QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBOzs7QUFHNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBOzs7OztLQUt2Qzs7Ozs7V0FHVyxxQkFBQyxHQUFHLEVBQUU7QUFDaEIsVUFBSSxxQkFBUyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDeEIsV0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFBO09BQ2I7O0tBRUY7Ozs7Ozs7V0FLMkIscUNBQUMsSUFBSSxFQUFnQjs7O1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUM3QyxVQUFJLG9CQUFRLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDdEUsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzlCOzs7QUFHRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNsQyxlQUFPLE9BQUssc0NBQXNDLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtPQUM1RSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hCLFlBQUkscUJBQVMsSUFBSSxDQUFDLEVBQUU7QUFDbEIsaUJBQU8sSUFBSSxDQUFBO1NBQ1o7QUFDRCxlQUFPLE9BQUssc0NBQXNDLENBQUMsSUFBSSxFQUFFLE9BQUssT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO09BQ2hGLENBQUMsQ0FBQTtLQUNIOzs7Ozs7O1dBS3NDLGdEQUFDLFFBQVEsRUFBRSxHQUFHLEVBQWdCO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNqRSxVQUFJLG9CQUFRLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDbEYsZUFBTyxLQUFLLENBQUE7T0FDYjs7QUFFRCxVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3RDLFVBQUksb0JBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDZCxlQUFPLEtBQUssQ0FBQTtPQUNiOztBQUVELFVBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQUssU0FBUyxDQUFDLENBQUE7QUFDdEMsVUFBSSxHQUFHLEtBQUssUUFBUSxJQUFJLHFCQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxFQUFFOzs7T0FHcEY7QUFDRCxXQUFLLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM1QixZQUFJLElBQUksR0FBRyxFQUFFLENBQUE7QUFDYixZQUFJLEdBQUcsS0FBSyxRQUFRLEVBQUU7QUFDcEIsY0FBSSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtTQUNuRSxNQUFNO0FBQ0wsY0FBSSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1NBQzVEOztBQUVELFlBQUksZ0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGNBQUksSUFBSSxHQUFHLGdCQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM1QixjQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7QUFDMUMsbUJBQU8sSUFBSSxDQUFBO1dBQ1o7U0FDRjtPQUNGOztBQUVELGFBQU8sS0FBSyxDQUFBO0tBQ2I7OztTQTVnQkcsT0FBTzs7O1FBK2dCTCxPQUFPLEdBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1jb25maWcvbGliL2xvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge2lzVHJ1dGh5LCBpc0ZhbHN5LCBpc0VtcHR5fSBmcm9tICcuL2NoZWNrJ1xuaW1wb3J0IHtFeGVjdXRvcn0gZnJvbSAnLi9leGVjdXRvcidcbmltcG9ydCBwYXRoaGVscGVyIGZyb20gJy4vcGF0aGhlbHBlcidcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNsYXNzIExvY2F0b3Ige1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVudmlyb25tZW50Rm4gPSBudWxsXG4gICAgdGhpcy5leGVjdXRvciA9IG51bGxcbiAgICB0aGlzLmV4ZWN1dGFibGVTdWZmaXggPSAnJ1xuICAgIHRoaXMucGF0aEtleSA9ICdQQVRIJ1xuICAgIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInKSB7XG4gICAgICB0aGlzLmV4ZWN1dGFibGVTdWZmaXggPSAnLmV4ZSdcbiAgICAgIHRoaXMucGF0aEtleSA9ICdQYXRoJ1xuICAgIH1cbiAgICB0aGlzLmdvRXhlY3V0YWJsZXMgPSBbJ2dvJyArIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeCwgJ2dvYXBwJyArIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeF1cbiAgICB0aGlzLnJlYWR5Rm4gPSBudWxsXG4gICAgaWYgKGlzVHJ1dGh5KG9wdGlvbnMpKSB7XG4gICAgICBpZiAoaXNUcnV0aHkob3B0aW9ucy5lbnZpcm9ubWVudCkpIHtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudEZuID0gb3B0aW9ucy5lbnZpcm9ubWVudFxuICAgICAgfVxuICAgICAgaWYgKGlzVHJ1dGh5KG9wdGlvbnMucmVhZHkpKSB7XG4gICAgICAgIHRoaXMucmVhZHlGbiA9IG9wdGlvbnMucmVhZHlcbiAgICAgIH1cbiAgICAgIGlmIChpc1RydXRoeShvcHRpb25zLmV4ZWN1dG9yKSkge1xuICAgICAgICB0aGlzLmV4ZWN1dG9yID0gb3B0aW9ucy5leGVjdXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmV4ZWN1dG9yID09PSBudWxsKSB7XG4gICAgICB0aGlzLmV4ZWN1dG9yID0gbmV3IEV4ZWN1dG9yKHtlbnZpcm9ubWVudEZuOiB0aGlzLmVudmlyb25tZW50LmJpbmQodGhpcyl9KVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5leGVjdXRvcilcbiAgICB0aGlzLmdvTG9jYXRvcnMgPSBbXG4gICAgICAvLyBBdm9pZCB1c2luZyBnb3Jvb3RMb2NhdG9yIC8gR09ST09UIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSdyZSBkb2luZ1xuICAgICAgLy8gKGFuZCBhc3N1bWUgeW91IGRvbid0IGtub3cgd2hhdCB5b3UncmUgdW5sZXNzIHlvdSBoYXZlIHNpZ25pZmljYW50XG4gICAgICAvLyBnbyBleHBlcmllbmNlKVxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nb3Jvb3RMb2NhdG9yKCkgfSxcbiAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZWRpdG9yY29uZmlnTG9jYXRvcigpIH0sXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmNvbmZpZ0xvY2F0b3IoKSB9LFxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5wYXRoTG9jYXRvcigpIH0sXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmRlZmF1bHRMb2NhdG9yKCkgfVxuICAgIF1cblxuICAgIHRoaXMuc2V0S25vd25Ub29sU3RyYXRlZ2llcygpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLnJlc2V0UnVudGltZXMoKVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5nb0xvY2F0b3JzID0gbnVsbFxuICAgIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeCA9IG51bGxcbiAgICB0aGlzLnBhdGhLZXkgPSBudWxsXG4gICAgdGhpcy5nb0V4ZWN1dGFibGVzID0gbnVsbFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmVudmlyb25tZW50Rm4gPSBudWxsXG4gICAgdGhpcy5leGVjdXRvciA9IG51bGxcbiAgICB0aGlzLnJlYWR5Rm4gPSBudWxsXG4gICAgdGhpcy50b29sTG9jYXRpb25zID0gbnVsbFxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMgPSBudWxsXG4gIH1cblxuICAvLyBQdWJsaWM6IEdldCB0aGUgZ28gcnVudGltZShzKS5cbiAgLy8gUmV0dXJucyBhbiBhcnJheSBvZiB7T2JqZWN0fSB3aGVyZSBlYWNoIGl0ZW0gY29udGFpbnMgdGhlIG91dHB1dCBmcm9tIFwiZ29cbiAgLy8gZW52XCIsIG9yIGZhbHNlIGlmIG5vIHJ1bnRpbWVzIGFyZSBmb3VuZC5cbiAgcnVudGltZXMgKG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChpc1RydXRoeSh0aGlzLnJ1bnRpbWVzQ2FjaGUpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMucnVudGltZXNDYWNoZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGNhbmRpZGF0ZXMgPSB0aGlzLnJ1bnRpbWVDYW5kaWRhdGVzKG9wdGlvbnMpXG4gICAgICBpZiAoaXNFbXB0eShjYW5kaWRhdGVzKSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSlcbiAgICAgIH1cblxuICAgICAgbGV0IHZpYWJsZUNhbmRpZGF0ZXMgPSBbXVxuICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgbGV0IGdvdmVyc2lvbiA9IHRoaXMuZXhlY3V0b3IuZXhlY1N5bmMoY2FuZGlkYXRlLCBbJ3ZlcnNpb24nXSwge2N3ZDogcGF0aC5kaXJuYW1lKGNhbmRpZGF0ZSl9KVxuICAgICAgICBpZiAoaXNUcnV0aHkoZ292ZXJzaW9uKSAmJiBnb3ZlcnNpb24uZXhpdGNvZGUgPT09IDAgJiYgZ292ZXJzaW9uLnN0ZG91dC5zdGFydHNXaXRoKCdnbyAnKSkge1xuICAgICAgICAgIGxldCB2ID0ge3BhdGg6IGNhbmRpZGF0ZSwgdmVyc2lvbjogZ292ZXJzaW9uLnN0ZG91dC5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCAnJyl9XG4gICAgICAgICAgbGV0IHZlcnNpb25Db21wb25lbnRzID0gdi52ZXJzaW9uLnNwbGl0KCcgJylcbiAgICAgICAgICB2Lm5hbWUgPSB2ZXJzaW9uQ29tcG9uZW50c1syXVxuICAgICAgICAgIHYuc2VtdmVyID0gdmVyc2lvbkNvbXBvbmVudHNbMl1cbiAgICAgICAgICBpZiAodi5zZW12ZXIuc3RhcnRzV2l0aCgnZ28nKSkge1xuICAgICAgICAgICAgdi5zZW12ZXIgPSB2LnNlbXZlci5zdWJzdHJpbmcoMiwgdi5zZW12ZXIubGVuZ3RoKVxuICAgICAgICAgIH1cbiAgICAgICAgICB2aWFibGVDYW5kaWRhdGVzLnB1c2godilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZmluYWxDYW5kaWRhdGVzID0gW11cbiAgICAgIGZvciAobGV0IHZpYWJsZUNhbmRpZGF0ZSBvZiB2aWFibGVDYW5kaWRhdGVzKSB7XG4gICAgICAgIGxldCBnb2VudiA9IHRoaXMuZXhlY3V0b3IuZXhlY1N5bmModmlhYmxlQ2FuZGlkYXRlLnBhdGgsIFsnZW52J10sIHtjd2Q6IHBhdGguZGlybmFtZSh2aWFibGVDYW5kaWRhdGUucGF0aCl9KVxuICAgICAgICBpZiAoaXNUcnV0aHkoZ29lbnYpICYmIGdvZW52LmV4aXRjb2RlID09PSAwICYmIGdvZW52LnN0ZG91dC50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgbGV0IGl0ZW1zID0gZ29lbnYuc3Rkb3V0LnNwbGl0KCdcXG4nKVxuICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL1tcXG5cXHJdL2csICcnKVxuICAgICAgICAgICAgaWYgKGl0ZW0uaW5jbHVkZXMoJz0nKSkge1xuICAgICAgICAgICAgICBsZXQgdHVwbGUgPSBpdGVtLnNwbGl0KCc9JylcbiAgICAgICAgICAgICAgbGV0IGtleSA9IHR1cGxlWzBdXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHR1cGxlWzFdXG4gICAgICAgICAgICAgIGlmICh0dXBsZS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0dXBsZS5zbGljZSgxLCB0dXBsZS5sZW5ndGggKyAxKS5qb2luKCc9JylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAob3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJykge1xuICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnc2V0ICcpKSB7XG4gICAgICAgICAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDQsIGtleS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygxLCB2YWx1ZS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZpYWJsZUNhbmRpZGF0ZVtrZXldID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZmluYWxDYW5kaWRhdGVzLnB1c2godmlhYmxlQ2FuZGlkYXRlKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucnVudGltZXNDYWNoZSA9IGZpbmFsQ2FuZGlkYXRlc1xuICAgICAgcmVzb2x2ZSh0aGlzLnJ1bnRpbWVzQ2FjaGUpXG4gICAgfSlcbiAgfVxuXG4gIC8vIERlcHJlY2F0ZWQ6IFVzZSBydW50aW1lKG9wdGlvbnMpIGluc3RlYWQuXG4gIHJ1bnRpbWVGb3JQcm9qZWN0IChwcm9qZWN0KSB7XG4gICAgcmV0dXJuIHRoaXMucnVudGltZSgpXG4gIH1cblxuICAvLyBQdWJsaWM6IEdldCB0aGUgZ28gcnVudGltZS5cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBjb250YWlucyB0aGUgb3V0cHV0IGZyb20gXCJnbyBlbnZcIiwgb3IgZmFsc2UgaWZcbiAgLy8gbm8gcnVudGltZSBpcyBmb3VuZC5cbiAgcnVudGltZSAob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMucnVudGltZXMob3B0aW9ucykudGhlbigocikgPT4ge1xuICAgICAgaWYgKGlzRmFsc3kocikgfHwgci5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJbMF1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIGdvcGF0aC5cbiAgLy8gUmV0dXJucyB0aGUgR09QQVRIIGlmIGl0IGV4aXN0cywgb3IgZmFsc2UgaWYgaXQgaXMgbm90IGRlZmluZWQuXG4gIGdvcGF0aCAob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gUHJlZmVycmVkOiBUaGUgRW52aXJvbm1lbnRcbiAgICBsZXQgZSA9IHRoaXMucmF3RW52aXJvbm1lbnQob3B0aW9ucylcbiAgICBsZXQgZyA9IGUuR09QQVRIXG4gICAgaWYgKGlzVHJ1dGh5KGcpICYmIGcudHJpbSgpICE9PSAnJykge1xuICAgICAgcmV0dXJuIHBhdGhoZWxwZXIuZXhwYW5kKGUsIGcpXG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2s6IEF0b20gQ29uZmlnXG4gICAgZyA9IGF0b20uY29uZmlnLmdldCgnZ28tY29uZmlnLmdvcGF0aCcpXG4gICAgaWYgKGlzVHJ1dGh5KGcpICYmIGcudHJpbSgpICE9PSAnJykge1xuICAgICAgcmV0dXJuIHBhdGhoZWxwZXIuZXhwYW5kKGUsIGcpXG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2s6IExlZ2FjeSBnby1wbHVzIENvbmZpZ1xuICAgIGcgPSBhdG9tLmNvbmZpZy5nZXQoJ2dvLXBsdXMuZ29wYXRoJylcbiAgICBpZiAoaXNUcnV0aHkoZykgJiYgZy50cmltKCkgIT09ICcnKSB7XG4gICAgICByZXR1cm4gcGF0aGhlbHBlci5leHBhbmQoZSwgZylcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIFB1YmxpYzogRmluZCB0aGUgc3BlY2lmaWVkIHRvb2wuXG4gIC8vIFJldHVybnMgdGhlIHBhdGggdG8gdGhlIHRvb2wgaWYgZm91bmQsIG9yIGZhbHNlIGlmIGl0IGNhbm5vdCBiZSBmb3VuZC5cbiAgZmluZFRvb2wgKG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChpc0ZhbHN5KG5hbWUpIHx8IG5hbWUuY29uc3RydWN0b3IgIT09IFN0cmluZyB8fCBuYW1lLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnRvb2xTdHJhdGVnaWVzKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cblxuICAgIGxldCBzdHJhdGVneSA9IGZhbHNlXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnRvb2xTdHJhdGVnaWVzLmhhcyhuYW1lKSkge1xuICAgICAgICBzdHJhdGVneSA9IHRoaXMudG9vbFN0cmF0ZWdpZXMuZ2V0KG5hbWUpXG4gICAgICB9XG4gICAgICBpZiAoaXNGYWxzeShzdHJhdGVneSkpIHtcbiAgICAgICAgc3RyYXRlZ3kgPSAnREVGQVVMVCdcbiAgICAgIH1cbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChzdHJhdGVneSAhPT0gJ0dPUk9PVEJJTicgJiYgc3RyYXRlZ3kgIT09ICdHT1RPT0xESVInKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydW50aW1lKG9wdGlvbnMpLnRoZW4oKHJ1bnRpbWUpID0+IHtcbiAgICAgICAgaWYgKGlzRmFsc3kocnVudGltZSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHJhdGVneSA9PT0gJ0dPUk9PVEJJTicpIHtcbiAgICAgICAgICBpZiAobmFtZSA9PT0gJ2dvJyAmJiBydW50aW1lLnBhdGguZW5kc1dpdGgoJ2dvYXBwJyArIHJ1bnRpbWUuR09FWEUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5qb2luKHJ1bnRpbWUuR09ST09ULCAnYmluJywgJ2dvYXBwJyArIHJ1bnRpbWUuR09FWEUpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHBhdGguam9pbihydW50aW1lLkdPUk9PVCwgJ2JpbicsIG5hbWUgKyBydW50aW1lLkdPRVhFKVxuICAgICAgICB9IGVsc2UgaWYgKHN0cmF0ZWd5ID09PSAnR09UT09MRElSJykge1xuICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4ocnVudGltZS5HT1RPT0xESVIsIG5hbWUgKyBydW50aW1lLkdPRVhFKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSlcbiAgICB9KS50aGVuKChzcGVjaWZpY1Rvb2wpID0+IHtcbiAgICAgIGlmIChpc1RydXRoeShzcGVjaWZpY1Rvb2wpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXQoc3BlY2lmaWNUb29sKS50aGVuKChzKSA9PiB7XG4gICAgICAgICAgaWYgKGlzVHJ1dGh5KHMpICYmIHMuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzcGVjaWZpY1Rvb2xcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGVycilcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cmF0ZWd5ID09PSAnR09QQVRIQklOJykge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kVG9vbEluRGVsaW1pdGVkRW52aXJvbm1lbnRWYXJpYWJsZShuYW1lLCAnR09QQVRIJywgb3B0aW9ucylcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cmF0ZWd5ID09PSAnUEFUSCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUobmFtZSwgdGhpcy5wYXRoS2V5LCBvcHRpb25zKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5maW5kVG9vbFdpdGhEZWZhdWx0U3RyYXRlZ3kobmFtZSwgb3B0aW9ucylcbiAgICB9KVxuICB9XG5cbiAgcmVzZXRSdW50aW1lcyAoKSB7XG4gICAgdGhpcy5ydW50aW1lc0NhY2hlID0gbnVsbFxuICB9XG5cbiAgc3RhdGlzaFN5bmMgKHBhdGhWYWx1ZSkge1xuICAgIGxldCBzdGF0ID0gZmFsc2VcbiAgICBpZiAoaXNUcnV0aHkocGF0aFZhbHVlKSAmJiAhKHBhdGhWYWx1ZS50cmltKCkgPT09ICcnKSkge1xuICAgICAgdHJ5IHsgc3RhdCA9IGZzLnN0YXRTeW5jKHBhdGhWYWx1ZSkgfSBjYXRjaCAoZSkgeyB9XG4gICAgfVxuICAgIHJldHVybiBzdGF0XG4gIH1cblxuICBzdGF0IChwKSB7XG4gICAgaWYgKGlzRmFsc3kocCkgfHwgcC5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8IHAudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZnMuc3RhdChwLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICAgIGlmIChpc1RydXRoeShlcnIpKSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnIpXG4gICAgICAgICAgcmVzb2x2ZShmYWxzZSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHN0YXQpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBwYXRoRXhpc3RzIChwKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhpc3RzKHApLnRoZW4oKGUpID0+IHtcbiAgICAgIGlmIChpc0ZhbHN5KGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBcbiAgICB9KVxuICB9XG5cbiAgZmlsZUV4aXN0cyAocCkge1xuICAgIHJldHVybiB0aGlzLnN0YXQocCkudGhlbigocykgPT4ge1xuICAgICAgaWYgKGlzRmFsc3kocykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmIChzLmlzRmlsZSgpKSB7XG4gICAgICAgIHJldHVybiBwXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBkaXJlY3RvcnlFeGlzdHMgKHApIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0KHApLnRoZW4oKHMpID0+IHtcbiAgICAgIGlmIChpc0ZhbHN5KHMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAocy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHJldHVybiBwXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBleGlzdHMgKHApIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0KHApLnRoZW4oKHMpID0+IHtcbiAgICAgIGlmIChpc0ZhbHN5KHMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBydW50aW1lQ2FuZGlkYXRlcyAob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGNhbmRpZGF0ZXMgPSBbXVxuICAgIGZvciAobGV0IGxvY2F0b3Igb2YgdGhpcy5nb0xvY2F0b3JzKSB7XG4gICAgICBsZXQgYyA9IGxvY2F0b3Iob3B0aW9ucylcbiAgICAgIGlmIChpc1RydXRoeShjKSAmJiBjLmNvbnN0cnVjdG9yID09PSBBcnJheSAmJiBjLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2FuZGlkYXRlcyA9IF8udW5pb24oY2FuZGlkYXRlcywgYylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhbmRpZGF0ZXNcbiAgfVxuXG4gIGVkaXRvcmNvbmZpZ0xvY2F0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIFRPRE86IC5lZGl0b3Jjb25maWdcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIEludGVybmFsOiBGaW5kIGEgZ28gaW5zdGFsbGF0aW9uIHVzaW5nIHlvdXIgQXRvbSBjb25maWcuIERlbGliZXJhdGVseVxuICAvLyB1bmRvY3VtZW50ZWQsIGFzIHRoaXMgbWV0aG9kIGlzIGRpc2NvdXJhZ2VkLlxuICBjb25maWdMb2NhdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZ29pbnN0YWxsYXRpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dvLWNvbmZpZy5nb2luc3RhbGxhdGlvbicpXG4gICAgbGV0IHN0YXQgPSB0aGlzLnN0YXRpc2hTeW5jKGdvaW5zdGFsbGF0aW9uKVxuICAgIGlmIChpc1RydXRoeShzdGF0KSkge1xuICAgICAgbGV0IGQgPSBnb2luc3RhbGxhdGlvblxuICAgICAgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgICAgZCA9IHBhdGguZGlybmFtZShnb2luc3RhbGxhdGlvbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZpbmRFeGVjdXRhYmxlc0luUGF0aChkLCB0aGlzLmV4ZWN1dGFibGVzLCBvcHRpb25zKVxuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9XG5cbiAgZ29yb290TG9jYXRvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGcgPSB0aGlzLmVudmlyb25tZW50KG9wdGlvbnMpLkdPUk9PVFxuICAgIGlmIChpc0ZhbHN5KGcpIHx8IGcudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmRFeGVjdXRhYmxlc0luUGF0aChwYXRoLmpvaW4oZywgJ2JpbicpLCB0aGlzLmdvRXhlY3V0YWJsZXMsIG9wdGlvbnMpXG4gIH1cblxuICBwYXRoTG9jYXRvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEV4ZWN1dGFibGVzSW5QYXRoKHRoaXMuZW52aXJvbm1lbnQob3B0aW9ucylbdGhpcy5wYXRoS2V5XSwgdGhpcy5nb0V4ZWN1dGFibGVzLCBvcHRpb25zKVxuICB9XG5cbiAgZGVmYXVsdExvY2F0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBpbnN0YWxsUGF0aHMgPSBbXVxuICAgIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInKSB7XG4gICAgICAvKlxuICAgICAgYzpcXGdvXFxiaW4gPSBCaW5hcnkgRGlzdHJpYnV0aW9uXG4gICAgICBjOlxcdG9vbHNcXGdvXFxiaW4gPSBDaG9jb2xhdGV5XG4gICAgICAqL1xuICAgICAgaW5zdGFsbFBhdGhzLnB1c2gocGF0aC5qb2luKCdjOicsICdnbycsICdiaW4nKSlcbiAgICAgIGluc3RhbGxQYXRocy5wdXNoKHBhdGguam9pbignYzonLCAndG9vbHMnLCAnZ28nLCAnYmluJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8qXG4gICAgICAvdXNyL2xvY2FsL2dvL2JpbiA9IEJpbmFyeSBEaXN0cmlidXRpb25cbiAgICAgIC91c3IvbG9jYWwvYmluID0gSG9tZWJyZXdcbiAgICAgICovXG4gICAgICBpbnN0YWxsUGF0aHMucHVzaChwYXRoLmpvaW4oJy8nLCAndXNyJywgJ2xvY2FsJywgJ2dvJywgJ2JpbicpKVxuICAgICAgaW5zdGFsbFBhdGhzLnB1c2gocGF0aC5qb2luKCcvJywgJ3VzcicsICdsb2NhbCcsICdiaW4nKSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmluZEV4ZWN1dGFibGVzSW5QYXRoKGluc3RhbGxQYXRocy5qb2luKHBhdGguZGVsaW1pdGVyKSwgdGhpcy5nb0V4ZWN1dGFibGVzLCBvcHRpb25zKVxuICB9XG5cbiAgZmluZEV4ZWN1dGFibGVzSW5QYXRoIChwYXRoVmFsdWUsIGV4ZWN1dGFibGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgY2FuZGlkYXRlcyA9IFtdXG4gICAgaWYgKGlzRmFsc3kocGF0aFZhbHVlKSB8fCBwYXRoVmFsdWUuY29uc3RydWN0b3IgIT09IFN0cmluZyB8fCBwYXRoVmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIGNhbmRpZGF0ZXNcbiAgICB9XG5cbiAgICBpZiAoaXNGYWxzeShleGVjdXRhYmxlcykgfHwgZXhlY3V0YWJsZXMuY29uc3RydWN0b3IgIT09IEFycmF5IHx8IGV4ZWN1dGFibGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBjYW5kaWRhdGVzXG4gICAgfVxuXG4gICAgbGV0IGVsZW1lbnRzID0gcGF0aGhlbHBlci5leHBhbmQodGhpcy5lbnZpcm9ubWVudChvcHRpb25zKSwgcGF0aFZhbHVlKS5zcGxpdChwYXRoLmRlbGltaXRlcilcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBmb3IgKGxldCBleGVjdXRhYmxlIG9mIGV4ZWN1dGFibGVzKSB7XG4gICAgICAgIGxldCBjYW5kaWRhdGUgPSBwYXRoLmpvaW4oZWxlbWVudCwgZXhlY3V0YWJsZSlcbiAgICAgICAgbGV0IHN0YXQgPSB0aGlzLnN0YXRpc2hTeW5jKGNhbmRpZGF0ZSlcbiAgICAgICAgaWYgKGlzVHJ1dGh5KHN0YXQpICYmIHN0YXQuaXNGaWxlKCkgJiYgc3RhdC5zaXplID4gMCkge1xuICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChjYW5kaWRhdGUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhbmRpZGF0ZXNcbiAgfVxuXG4gIC8vIEludGVybmFsOiBHZXQgYSBjb3B5IG9mIHRoZSBlbnZpcm9ubWVudCwgd2l0aCB0aGUgR09QQVRIIGNvcnJlY3RseSBzZXQuXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hlcmUgdGhlIGtleSBpcyB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZSBhbmQgdGhlIHZhbHVlIGlzIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSB2YWx1ZS5cbiAgZW52aXJvbm1lbnQgKG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBlbnYgPSB0aGlzLnJhd0Vudmlyb25tZW50KG9wdGlvbnMpXG4gICAgbGV0IGcgPSB0aGlzLmdvcGF0aChvcHRpb25zKVxuICAgIGlmIChnICYmIGcgIT09ICcnKSB7XG4gICAgICBlbnYuR09QQVRIID0gZ1xuICAgIH1cbiAgICByZXR1cm4gZW52XG4gIH1cblxuICByYXdFbnZpcm9ubWVudCAob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGVudiA9IHByb2Nlc3MuZW52XG4gICAgaWYgKGlzVHJ1dGh5KHRoaXMuZW52aXJvbm1lbnRGbikpIHtcbiAgICAgIGVudiA9IHRoaXMuZW52aXJvbm1lbnRGbigpXG4gICAgfVxuICAgIGVudiA9IE9iamVjdC5hc3NpZ24oe30sIGVudilcbiAgICByZXR1cm4gZW52XG4gIH1cblxuICAvLyBJbnRlcm5hbDogSW5kaWNhdGVzIHRoYXQgdGhlIGxvY2F0b3IgaXMgcmVhZHksIG9yIG5vdC5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHJlYWR5LCBlbHNlIGZhbHNlLlxuICByZWFkeSAoKSB7XG4gICAgaWYgKGlzRmFsc3kodGhpcy5yZWFkeUZuKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVhZHlGbigpXG4gIH1cblxuICAvLyBJbnRlcm5hbDogU2V0IHRoZSBzdHJhdGVneSBmb3IgZmluZGluZyBrbm93biBvciBidWlsdC1pbiB0b29scy5cbiAgLy8gUmV0dXJucyBhIG1hcCB3aGVyZSB0aGUga2V5IGlzIHRoZSB0b29sIG5hbWUgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgc3RyYXRlZ3kuXG4gIHNldEtub3duVG9vbFN0cmF0ZWdpZXMgKCkge1xuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMgPSBuZXcgTWFwKClcblxuICAgIC8vIEJ1aWx0LUluIFRvb2xzXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2dvJywgJ0dPUk9PVEJJTicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2dvZm10JywgJ0dPUk9PVEJJTicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2dvZG9jJywgJ0dPUk9PVEJJTicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2FkZHIybGluZScsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdhcGknLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnYXNtJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2NnbycsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdjb21waWxlJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2NvdmVyJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2Rpc3QnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgnZG9jJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ2ZpeCcsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdsaW5rJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ25tJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ29iamR1bXAnLCAnR09UT09MRElSJylcbiAgICB0aGlzLnRvb2xTdHJhdGVnaWVzLnNldCgncGFjaycsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdwcHJvZicsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCd0b3VyJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ3RyYWNlJywgJ0dPVE9PTERJUicpXG4gICAgdGhpcy50b29sU3RyYXRlZ2llcy5zZXQoJ3ZldCcsICdHT1RPT0xESVInKVxuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCd5YWNjJywgJ0dPVE9PTERJUicpXG5cbiAgICAvLyBFeHRlcm5hbCBUb29sc1xuICAgIHRoaXMudG9vbFN0cmF0ZWdpZXMuc2V0KCdnaXQnLCAnUEFUSCcpXG5cbiAgICAvLyBPdGhlciBUb29scyBBcmUgQXNzdW1lZCBUbyBCZSBJbiBQQVRIIG9yIEdPQklOIG9yIEdPUEFUSC9iaW5cbiAgICAvLyBHT1BBVEhCSU4gQ2FuIEJlIFVzZWQgSW4gVGhlIEZ1dHVyZSBBcyBBIFN0cmF0ZWd5LCBJZiBSZXF1aXJlZFxuICAgIC8vIEdPUEFUSEJJTiBXaWxsIFVuZGVyc3RhbmQgR08xNVZFTkRPUkVYUEVSSU1FTlRcbiAgfVxuXG4gIC8vIEludGVybmFsOiBIYW5kbGUgdGhlIHNwZWNpZmllZCBlcnJvciwgaWYgbmVlZGVkLlxuICBoYW5kbGVFcnJvciAoZXJyKSB7XG4gICAgaWYgKGlzVHJ1dGh5KGVyci5oYW5kbGUpKSB7XG4gICAgICBlcnIuaGFuZGxlKClcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coZXJyKVxuICB9XG5cbiAgLy8gSW50ZXJuYWw6IFRyeSB0byBmaW5kIGEgdG9vbCB3aXRoIHRoZSBkZWZhdWx0IHN0cmF0ZWd5IChHT1BBVEgvYmluLCB0aGVuXG4gIC8vIFBBVEgpLlxuICAvLyBSZXR1cm5zIHRoZSBwYXRoIHRvIHRoZSB0b29sLCBvciBmYWxzZSBpZiBpdCBjYW5ub3QgYmUgZm91bmQuXG4gIGZpbmRUb29sV2l0aERlZmF1bHRTdHJhdGVneSAobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKGlzRmFsc3kobmFtZSkgfHwgbmFtZS5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8IG5hbWUudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IFN0cmF0ZWd5IElzOiBMb29rIEZvciBUaGUgVG9vbCBJbiBHT1BBVEgsIFRoZW4gTG9vayBJbiBQQVRIXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUobmFtZSwgJ0dPUEFUSCcsIG9wdGlvbnMpXG4gICAgfSkudGhlbigodG9vbCkgPT4ge1xuICAgICAgaWYgKGlzVHJ1dGh5KHRvb2wpKSB7XG4gICAgICAgIHJldHVybiB0b29sXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5maW5kVG9vbEluRGVsaW1pdGVkRW52aXJvbm1lbnRWYXJpYWJsZShuYW1lLCB0aGlzLnBhdGhLZXksIG9wdGlvbnMpXG4gICAgfSlcbiAgfVxuXG4gIC8vIEludGVybmFsOiBUcnkgdG8gZmluZCBhIHRvb2wgaW4gYSBkZWxpbWl0ZWQgZW52aXJvbm1lbnQgdmFyaWFibGUgKGUuZy5cbiAgLy8gUEFUSCkuXG4gIC8vIFJldHVybnMgdGhlIHBhdGggdG8gdGhlIHRvb2wsIG9yIGZhbHNlIGlmIGl0IGNhbm5vdCBiZSBmb3VuZC5cbiAgZmluZFRvb2xJbkRlbGltaXRlZEVudmlyb25tZW50VmFyaWFibGUgKHRvb2xOYW1lLCBrZXksIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChpc0ZhbHN5KHRvb2xOYW1lKSB8fCB0b29sTmFtZS5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nIHx8IHRvb2xOYW1lLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGxldCBwID0gdGhpcy5lbnZpcm9ubWVudChvcHRpb25zKVtrZXldXG4gICAgaWYgKGlzRmFsc3kocCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGxldCBlbGVtZW50cyA9IHAuc3BsaXQocGF0aC5kZWxpbWl0ZXIpXG4gICAgaWYgKGtleSA9PT0gJ0dPUEFUSCcgJiYgaXNUcnV0aHkodGhpcy5lbnZpcm9ubWVudChvcHRpb25zKVsnR08xNVZFTkRPUkVYUEVSSU1FTlQnXSkpIHtcbiAgICAgIC8vIFRPRE86IFVuZGVyc3RhbmQgVmVuZG9yIEV4cGVyaW1lbnQgUGF0aHMgQmV0dGVyXG4gICAgICAvLyBlbGVtZW50cy51bnNoaWZ0KCd2ZW5kb3InKVxuICAgIH1cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBsZXQgaXRlbSA9ICcnXG4gICAgICBpZiAoa2V5ID09PSAnR09QQVRIJykge1xuICAgICAgICBpdGVtID0gcGF0aC5qb2luKGVsZW1lbnQsICdiaW4nLCB0b29sTmFtZSArIHRoaXMuZXhlY3V0YWJsZVN1ZmZpeClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW0gPSBwYXRoLmpvaW4oZWxlbWVudCwgdG9vbE5hbWUgKyB0aGlzLmV4ZWN1dGFibGVTdWZmaXgpXG4gICAgICB9XG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGl0ZW0pKSB7XG4gICAgICAgIGxldCBzdGF0ID0gZnMuc3RhdFN5bmMoaXRlbSlcbiAgICAgICAgaWYgKHN0YXQgJiYgc3RhdC5pc0ZpbGUoKSAmJiBzdGF0LnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCB7TG9jYXRvcn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/locator.js
