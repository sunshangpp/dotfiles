function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-env jasmine */

var _libCheck = require('./../lib/check');

var _libExecutor = require('./../lib/executor');

var _libPathhelper = require('./../lib/pathhelper');

var _libPathhelper2 = _interopRequireDefault(_libPathhelper);

var _libLocator = require('./../lib/locator');

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

describe('Locator', function () {
  var env = null;
  var environmentFn = null;
  var executor = null;
  var platform = null;
  var arch = null;
  var executableSuffix = null;
  var pathkey = null;
  var readyFn = null;
  var locator = null;

  beforeEach(function () {
    _temp2['default'].track();
    env = Object.assign({}, process.env);
    if ((0, _libCheck.isTruthy)(env.GOROOT)) {
      delete env.GOROOT;
    }
    environmentFn = function () {
      return env;
    };
    readyFn = function () {
      return true;
    };
    platform = process.platform;
    if (process.arch === 'arm') {
      arch = 'arm';
    } else if (process.arch === 'ia32') {
      // Ugh, Atom is 32-bit on Windows... for now.
      if (platform === 'win32') {
        arch = 'amd64';
      } else {
        arch = '386';
      }
    } else {
      arch = 'amd64';
    }
    executor = new _libExecutor.Executor({ environmentFn: environmentFn });
    executableSuffix = '';
    pathkey = 'PATH';
    if (process.platform === 'win32') {
      platform = 'windows';
      executableSuffix = '.exe';
      pathkey = 'Path';
    }

    locator = new _libLocator.Locator({
      environment: environmentFn,
      executor: executor,
      ready: readyFn
    });
  });

  afterEach(function () {
    if (executor !== null) {
      executor.dispose();
      executor = null;
    }

    if (locator !== null) {
      locator.dispose();
      locator = null;
    }

    arch = null;
    platform = null;
    environmentFn = null;
    executableSuffix = null;
    pathkey = null;
    readyFn = null;
  });

  describe('when the environment is process.env', function () {
    it('findExecutablesInPath returns an empty array if its arguments are invalid', function () {
      expect(locator.findExecutablesInPath).toBeDefined();
      expect(locator.findExecutablesInPath(false, false).length).toBe(0);
      expect(locator.findExecutablesInPath('', false).length).toBe(0);
      expect(locator.findExecutablesInPath('abcd', false).length).toBe(0);
      expect(locator.findExecutablesInPath('abcd', { bleh: 'abcd' }).length).toBe(0);
      expect(locator.findExecutablesInPath('abcd', 'abcd').length).toBe(0);
      expect(locator.findExecutablesInPath('abcd', []).length).toBe(0);
      expect(locator.findExecutablesInPath([], []).length).toBe(0);
    });

    it('findExecutablesInPath returns an array with elements if its arguments are valid', function () {
      expect(locator.findExecutablesInPath).toBeDefined();
      if (_os2['default'].platform() === 'win32') {
        expect(locator.findExecutablesInPath('c:\\windows\\system32', ['cmd.exe']).length).toBe(1);
        expect(locator.findExecutablesInPath('c:\\windows\\system32', ['cmd.exe'])[0]).toBe('c:\\windows\\system32\\cmd.exe');
      } else {
        expect(locator.findExecutablesInPath('/bin', ['sh']).length).toBe(1);
        expect(locator.findExecutablesInPath('/bin', ['sh'])[0]).toBe('/bin/sh');
      }
    });
  });

  describe('when the environment has a GOPATH that includes a tilde', function () {
    beforeEach(function () {
      env.GOPATH = _path2['default'].join('~', 'go');
    });

    it('is defined', function () {
      expect(locator).toBeDefined();
      expect(locator).toBeTruthy();
    });

    it('gopath() returns a path with the home directory expanded', function () {
      expect(locator.gopath).toBeDefined();
      expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
    });

    describe('when there is atom config for go-config.gopath', function () {
      beforeEach(function () {
        atom.config.set('go-config.gopath', '~/go2');
      });

      it('gopath() prioritizes the environment over the config', function () {
        expect(locator.gopath).toBeDefined();
        expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
      });
    });

    describe('when there is atom config for go-plus.gopath', function () {
      beforeEach(function () {
        atom.config.set('go-plus.gopath', '~/go2');
      });

      it('gopath() prioritizes the environment over the config', function () {
        expect(locator.gopath).toBeDefined();
        expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
      });
    });
  });

  describe('when the environment has an empty GOPATH', function () {
    beforeEach(function () {
      if ((0, _libCheck.isTruthy)(env.GOPATH)) {
        delete env.GOPATH;
      }
    });

    it('gopath() returns false', function () {
      expect(locator.gopath).toBeDefined();
      expect(locator.gopath()).toBe(false);
    });

    describe('when there is atom config for go-config.gopath', function () {
      beforeEach(function () {
        atom.config.set('go-config.gopath', '~/go');
      });

      it('gopath() returns the expanded value for ~/go', function () {
        expect(locator.gopath).toBeDefined();
        expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
      });
    });

    describe('when there is atom config for go-plus.gopath', function () {
      beforeEach(function () {
        atom.config.set('go-plus.gopath', '~/go');
      });

      it('gopath() returns the expanded value for ~/go', function () {
        expect(locator.gopath).toBeDefined();
        expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
      });
    });
  });

  describe('when the environment has a GOPATH that is whitespace', function () {
    beforeEach(function () {
      env.GOPATH = '        ';
    });

    it('gopath() returns false', function () {
      expect(locator.gopath).toBeDefined();
      expect(locator.gopath()).toBe(false);
    });

    describe('when there is atom config for go-config.gopath', function () {
      beforeEach(function () {
        atom.config.set('go-config.gopath', '~/go');
      });

      it('gopath() returns the expanded value for ~/go', function () {
        expect(locator.gopath).toBeDefined();
        expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
      });
    });

    describe('when there is atom config for go-plus.gopath', function () {
      beforeEach(function () {
        atom.config.set('go-plus.gopath', '~/go');
      });

      it('gopath() returns the expanded value for ~/go', function () {
        expect(locator.gopath).toBeDefined();
        expect(locator.gopath()).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go'));
      });
    });
  });

  describe('when the PATH has a single directory with a go runtime in it', function () {
    var godir = null;
    var go = null;
    beforeEach(function () {
      godir = _temp2['default'].mkdirSync('go-');
      go = _path2['default'].join(godir, 'go' + executableSuffix);
      _fsExtra2['default'].writeFileSync(go, '.', { encoding: 'utf8', mode: 511 });
      env[pathkey] = godir;
      env.GOPATH = _path2['default'].join('~', 'go');
    });

    it('runtimeCandidates() finds the runtime', function () {
      expect(locator.runtimeCandidates).toBeDefined();
      var candidates = locator.runtimeCandidates();
      expect(candidates).toBeTruthy();
      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0]).toBe(go);
    });
  });

  describe('when GOROOT is set and the go tool is available within $GOROOT/bin', function () {
    var godir = null;
    var go = null;
    var gorootgo = null;
    var gorootdir = null;
    var gorootbindir = null;

    beforeEach(function () {
      gorootdir = _temp2['default'].mkdirSync('goroot-');
      gorootbindir = _path2['default'].join(gorootdir, 'bin');
      _fsExtra2['default'].mkdirSync(gorootbindir);
      gorootgo = _path2['default'].join(gorootbindir, 'go' + executableSuffix);
      godir = _temp2['default'].mkdirSync('go-');
      go = _path2['default'].join(godir, 'go' + executableSuffix);
      _fsExtra2['default'].writeFileSync(gorootgo, '.', { encoding: 'utf8', mode: 511 });
      _fsExtra2['default'].writeFileSync(go, '.', { encoding: 'utf8', mode: 511 });
      env[pathkey] = godir;
      env.GOROOT = gorootdir;
      env.GOPATH = _path2['default'].join('~', 'go');
    });

    afterEach(function () {
      env.GOROOT = '';
    });

    it('runtimeCandidates() finds the runtime and orders the go in $GOROOT/bin before the go in PATH', function () {
      expect(locator.runtimeCandidates).toBeDefined();
      var candidates = locator.runtimeCandidates();
      expect(candidates).toBeTruthy();
      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0]).toBe(gorootgo);
      expect(candidates[1]).toBe(go);
    });
  });

  describe('when the PATH has multiple directories with a go runtime in it', function () {
    var godir = null;
    var go1dir = null;
    var go = null;
    var go1 = null;
    beforeEach(function () {
      godir = _temp2['default'].mkdirSync('go-');
      go1dir = _temp2['default'].mkdirSync('go1-');
      go = _path2['default'].join(godir, 'go' + executableSuffix);
      go1 = _path2['default'].join(go1dir, 'go' + executableSuffix);
      _fsExtra2['default'].writeFileSync(go, '.', { encoding: 'utf8', mode: 511 });
      _fsExtra2['default'].writeFileSync(go1, '.', { encoding: 'utf8', mode: 511 });
      env[pathkey] = godir + _path2['default'].delimiter + go1dir;
    });

    it('runtimeCandidates() returns the candidates in the correct order', function () {
      expect(locator.runtimeCandidates).toBeDefined();
      var candidates = locator.runtimeCandidates();
      expect(candidates).toBeTruthy();
      expect(candidates.length).toBeGreaterThan(1);
      expect(candidates[0]).toBe(go);
      expect(candidates[1]).toBe(go1);
    });

    it('runtimeCandidates() returns candidates in the correct order when a candidate occurs multiple times in the path', function () {
      env[pathkey] = godir + _path2['default'].delimiter + go1dir + _path2['default'].delimiter + godir;
      expect(locator.runtimeCandidates).toBeDefined();
      var candidates = locator.runtimeCandidates();
      expect(candidates).toBeTruthy();
      expect(candidates.length).toBeGreaterThan(1);
      expect(candidates[0]).toBe(go);
      expect(candidates[1]).toBe(go1);
      if (candidates.length > 2) {
        expect(candidates[2]).not.toBe(go);
      }
    });
  });

  describe('when the path includes a directory with go 1.5.1 in it', function () {
    var godir = null;
    var gopathdir = null;
    var gorootdir = null;
    var gorootbindir = null;
    var gotooldir = null;
    var go = null;
    var gorootbintools = null;
    var gotooldirtools = null;
    beforeEach(function () {
      gorootbintools = ['go', 'godoc', 'gofmt'];
      gotooldirtools = ['addr2line', 'cgo', 'dist', 'link', 'pack', 'trace', 'api', 'compile', 'doc', 'nm', 'pprof', 'vet', 'asm', 'cover', 'fix', 'objdump', 'yacc'];
      godir = _temp2['default'].mkdirSync('go-');
      gopathdir = _temp2['default'].mkdirSync('gopath-');
      gorootdir = _temp2['default'].mkdirSync('goroot-');
      gorootbindir = _path2['default'].join(gorootdir, 'bin');
      _fsExtra2['default'].mkdirSync(gorootbindir);
      gotooldir = _path2['default'].join(gorootdir, 'pkg', 'tool', platform + '_' + arch);
      _fsExtra2['default'].mkdirsSync(gotooldir);
      var fakeexecutable = 'go_' + platform + '_' + arch + executableSuffix;
      var go151json = _path2['default'].join(__dirname, 'fixtures', 'go-151-' + platform + '.json');
      var fakego = _path2['default'].join(__dirname, 'tools', 'go', fakeexecutable);
      go = _path2['default'].join(gorootbindir, 'go' + executableSuffix);
      _fsExtra2['default'].copySync(fakego, go);
      _fsExtra2['default'].copySync(go151json, _path2['default'].join(gorootbindir, 'go.json'));
      env[pathkey] = godir;
      env['GOPATH'] = gopathdir;
      env['GOROOT'] = gorootdir;
      for (var tool of gorootbintools) {
        if (tool !== 'go') {
          _fsExtra2['default'].writeFileSync(_path2['default'].join(gorootbindir, tool + executableSuffix), '.', { encoding: 'utf8', mode: 511 });
        }
      }
      for (var tool of gotooldirtools) {
        var toolpath = _path2['default'].join(gotooldir, tool + executableSuffix);
        _fsExtra2['default'].writeFileSync(toolpath, '.', { encoding: 'utf8', mode: 511 });
      }
    });

    it('runtimeCandidates() finds the runtime', function () {
      expect(locator.runtimeCandidates).toBeDefined();
      var candidates = locator.runtimeCandidates();
      expect(candidates).toBeTruthy();
      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates[0]).toBe(go);
    });

    it('runtimes() returns the runtime', function () {
      expect(locator.runtimes).toBeDefined();
      var runtimes = null;
      var done = locator.runtimes().then(function (r) {
        runtimes = r;
      });

      waitsForPromise(function () {
        return done;
      });

      runs(function () {
        expect(runtimes).toBeTruthy();
        expect(runtimes.length).toBeGreaterThan(0);
        expect(runtimes[0].name).toBe('go1.5.1');
        expect(runtimes[0].semver).toBe('1.5.1');
        expect(runtimes[0].version).toBe('go version go1.5.1 ' + platform + '/' + arch);
        expect(runtimes[0].path).toBe(go);
        expect(runtimes[0].GOARCH).toBe(arch);
        expect(runtimes[0].GOBIN).toBe('');
        if (platform === 'windows') {
          expect(runtimes[0].GOEXE).toBe('.exe');
        } else {
          expect(runtimes[0].GOEXE).toBe('');
        }
        expect(runtimes[0].GOHOSTARCH).toBe(arch);
        expect(runtimes[0].GOHOSTOS).toBe(platform);
        expect(runtimes[0].GOOS).toBe(platform);
        expect(runtimes[0].GOPATH).toBe(gopathdir);
        expect(runtimes[0].GORACE).toBe('');
        expect(runtimes[0].GOROOT).toBe(gorootdir);
        expect(runtimes[0].GOTOOLDIR).toBe(gotooldir);
        if (platform === 'windows') {
          expect(runtimes[0].CC).toBe('gcc');
          expect(runtimes[0].GOGCCFLAGS).toBe('-m64 -mthreads -fmessage-length=0');
          expect(runtimes[0].CXX).toBe('g++');
        } else if (platform === 'darwin') {
          expect(runtimes[0].CC).toBe('clang');
          expect(runtimes[0].GOGCCFLAGS).toBe('-fPIC -m64 -pthread -fno-caret-diagnostics -Qunused-arguments -fmessage-length=0 -fno-common');
          expect(runtimes[0].CXX).toBe('clang++');
        } else if (_os2['default'].platform() === 'linux') {
          expect(runtimes[0].CC).toBe('gcc');
          expect(runtimes[0].GOGCCFLAGS).toBe('-fPIC -m64 -pthread -fmessage-length=0');
          expect(runtimes[0].CXX).toBe('g++');
        }
        expect(runtimes[0].GO15VENDOREXPERIMENT).toBe('');
        expect(runtimes[0].CGO_ENABLED).toBe('1');
      });
    });

    it('findTool() finds the go tool', function () {
      expect(locator.findTool).toBeDefined();
      var tool = null;
      var err = null;
      var done = locator.findTool('go').then(function (t) {
        tool = t;
      })['catch'](function (e) {
        err = e;
      });

      waitsForPromise(function () {
        return done;
      });

      runs(function () {
        expect(err).toBe(null);
        expect(tool).toBeTruthy();
        expect(tool).toBe(_path2['default'].join(gorootbindir, 'go' + executableSuffix));
      });
    });

    it('findTool() finds tools in GOROOT', function () {
      var tools = ['go', 'godoc', 'gofmt'];
      var runtime = false;
      var tool = null;
      var toolPath = false;
      var done = locator.runtime().then(function (r) {
        runtime = r;
      });

      waitsForPromise(function () {
        return done;
      });

      runs(function () {
        for (var toolItem of tools) {
          tool = null;
          done = null;
          toolPath = _path2['default'].join(runtime.GOROOT, 'bin', toolItem + runtime.GOEXE);
          done = locator.findTool(toolItem).then(function (t) {
            tool = t;
          });
          waitsForPromise(function () {
            return done;
          });

          runs(function () {
            expect(tool).toBeTruthy();
            expect(tool).toBe(toolPath);
          });
        }
      });
    });

    it('stat() returns false for nonexistent files', function () {
      var stat = null;
      var done = locator.stat('nonexistentthing').then(function (s) {
        stat = s;
      });
      waitsForPromise(function () {
        return done;
      });

      runs(function () {
        expect(stat).toBe(false);
      });
    });

    it('findTool() finds tools in GOTOOLDIR', function () {
      var tools = ['addr2line', 'cgo', 'dist', 'link', 'pack', 'trace', 'api', 'compile', 'doc', 'nm', 'pprof', 'vet', 'asm', 'cover', 'fix', 'objdump', 'yacc'];
      var runtime = false;
      var done = locator.runtime().then(function (r) {
        runtime = r;
      });

      waitsForPromise(function () {
        return done;
      });

      runs(function () {
        var _loop = function (toolItem) {
          var tool = null;
          var toolPath = _path2['default'].join(runtime.GOTOOLDIR, toolItem + runtime.GOEXE);
          var done = locator.findTool(toolItem).then(function (t) {
            tool = t;
          });
          waitsForPromise(function () {
            return done;
          });

          runs(function () {
            expect(tool).toBeTruthy();
            expect(tool).toBe(toolPath);
          });
        };

        for (var toolItem of tools) {
          _loop(toolItem);
        }
      });
    });
  });

  describe('when the path includes a directory with the gometalinter tool in it', function () {
    var gopathdir = null;
    var gopathbindir = null;
    var pathdir = null;
    var pathtools = null;
    var gopathbintools = null;
    beforeEach(function () {
      pathtools = ['gometalinter', 'gb'];
      gopathbintools = ['somerandomtool', 'gb'];
      pathdir = _temp2['default'].mkdirSync('path-');
      gopathdir = _temp2['default'].mkdirSync('gopath-');
      gopathbindir = _path2['default'].join(gopathdir, 'bin');
      _fsExtra2['default'].mkdirSync(gopathbindir);
      env['GOPATH'] = gopathdir;
      env[pathkey] = pathdir + _path2['default'].delimiter + env['PATH'];
      for (var tool of pathtools) {
        _fsExtra2['default'].writeFileSync(_path2['default'].join(pathdir, tool + executableSuffix), '.', { encoding: 'utf8', mode: 511 });
      }
      for (var tool of gopathbintools) {
        _fsExtra2['default'].writeFileSync(_path2['default'].join(gopathbindir, tool + executableSuffix), '.', { encoding: 'utf8', mode: 511 });
      }
    });

    it('findTool() finds tools in PATH', function () {
      runs(function () {
        var _loop2 = function (toolItem) {
          var toolPath = false;
          var tool = null;
          var done = null;

          if (gopathbintools.indexOf(toolItem) !== -1) {
            toolPath = _path2['default'].join(gopathbindir, toolItem + executableSuffix);
          } else {
            toolPath = _path2['default'].join(pathdir, toolItem + executableSuffix);
          }

          done = locator.findTool(toolItem).then(function (t) {
            tool = t;
          });
          waitsForPromise(function () {
            return done;
          });
          runs(function () {
            done = null;
            expect(tool).toBeTruthy();
            expect(tool).toBe(toolPath);
          });
        };

        for (var toolItem of pathtools) {
          _loop2(toolItem);
        }
      });
    });

    it('findTool() finds tools in GOPATH\'s bin directory', function () {
      runs(function () {
        var _loop3 = function (toolItem) {
          var tool = null;
          var toolPath = false;
          var done = null;
          toolPath = _path2['default'].join(gopathbindir, toolItem + executableSuffix);
          done = locator.findTool(toolItem).then(function (t) {
            tool = t;
          });
          waitsForPromise(function () {
            return done;
          });
          runs(function () {
            expect(tool).toBeTruthy();
            expect(tool).toBe(toolPath);
          });
        };

        for (var toolItem of gopathbintools) {
          _loop3(toolItem);
        }
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9zcGVjL2xvY2F0b3Itc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3dCQUd1QixnQkFBZ0I7OzJCQUNoQixtQkFBbUI7OzZCQUNuQixxQkFBcUI7Ozs7MEJBQ3RCLGtCQUFrQjs7b0JBQ3ZCLE1BQU07Ozs7dUJBQ1IsVUFBVTs7OztrQkFDVixJQUFJOzs7O29CQUNGLE1BQU07Ozs7QUFWdkIsV0FBVyxDQUFBOztBQVlYLFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBTTtBQUN4QixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUE7QUFDZCxNQUFJLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDeEIsTUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ25CLE1BQUksUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNuQixNQUFJLElBQUksR0FBRyxJQUFJLENBQUE7QUFDZixNQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQTtBQUMzQixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbEIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLE1BQUksT0FBTyxHQUFHLElBQUksQ0FBQTs7QUFFbEIsWUFBVSxDQUFDLFlBQU07QUFDZixzQkFBSyxLQUFLLEVBQUUsQ0FBQTtBQUNaLE9BQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDcEMsUUFBSSx3QkFBUyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDeEIsYUFBTyxHQUFHLENBQUMsTUFBTSxDQUFBO0tBQ2xCO0FBQ0QsaUJBQWEsR0FBRyxZQUFNO0FBQ3BCLGFBQU8sR0FBRyxDQUFBO0tBQ1gsQ0FBQTtBQUNELFdBQU8sR0FBRyxZQUFNO0FBQUUsYUFBTyxJQUFJLENBQUE7S0FBRSxDQUFBO0FBQy9CLFlBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFBO0FBQzNCLFFB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QUFDLFVBQUMsQ0FBQyxFQUFLO0FBQUUsZ0JBQUksR0FBRyxDQUFDLENBQUE7V0FBRSxDQUFDLENBQUE7QUFDM0QseUJBQWUsQ0FBQyxZQUFNO0FBQUUsbUJBQU8sSUFBSSxDQUFBO1dBQUUsQ0FBQyxDQUFBO0FBQ3RDLGNBQUksQ0FBQyxZQUFNO0FBQ1Qsa0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUN6QixrQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUM1QixDQUFDLENBQUE7OztBQVZKLGFBQUssSUFBSSxRQUFRLElBQUksY0FBYyxFQUFFO2lCQUE1QixRQUFRO1NBV2hCO09BQ0YsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9zcGVjL2xvY2F0b3Itc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHtpc1RydXRoeX0gZnJvbSAnLi8uLi9saWIvY2hlY2snXG5pbXBvcnQge0V4ZWN1dG9yfSBmcm9tICcuLy4uL2xpYi9leGVjdXRvcidcbmltcG9ydCBwYXRoaGVscGVyIGZyb20gJy4vLi4vbGliL3BhdGhoZWxwZXInXG5pbXBvcnQge0xvY2F0b3J9IGZyb20gJy4vLi4vbGliL2xvY2F0b3InXG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZGVzY3JpYmUoJ0xvY2F0b3InLCAoKSA9PiB7XG4gIGxldCBlbnYgPSBudWxsXG4gIGxldCBlbnZpcm9ubWVudEZuID0gbnVsbFxuICBsZXQgZXhlY3V0b3IgPSBudWxsXG4gIGxldCBwbGF0Zm9ybSA9IG51bGxcbiAgbGV0IGFyY2ggPSBudWxsXG4gIGxldCBleGVjdXRhYmxlU3VmZml4ID0gbnVsbFxuICBsZXQgcGF0aGtleSA9IG51bGxcbiAgbGV0IHJlYWR5Rm4gPSBudWxsXG4gIGxldCBsb2NhdG9yID0gbnVsbFxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHRlbXAudHJhY2soKVxuICAgIGVudiA9IE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52KVxuICAgIGlmIChpc1RydXRoeShlbnYuR09ST09UKSkge1xuICAgICAgZGVsZXRlIGVudi5HT1JPT1RcbiAgICB9XG4gICAgZW52aXJvbm1lbnRGbiA9ICgpID0+IHtcbiAgICAgIHJldHVybiBlbnZcbiAgICB9XG4gICAgcmVhZHlGbiA9ICgpID0+IHsgcmV0dXJuIHRydWUgfVxuICAgIHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybVxuICAgIGlmIChwcm9jZXNzLmFyY2ggPT09ICdhcm0nKSB7XG4gICAgICBhcmNoID0gJ2FybSdcbiAgICB9IGVsc2UgaWYgKHByb2Nlc3MuYXJjaCA9PT0gJ2lhMzInKSB7XG4gICAgICAvLyBVZ2gsIEF0b20gaXMgMzItYml0IG9uIFdpbmRvd3MuLi4gZm9yIG5vdy5cbiAgICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgICBhcmNoID0gJ2FtZDY0J1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJjaCA9ICczODYnXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyY2ggPSAnYW1kNjQnXG4gICAgfVxuICAgIGV4ZWN1dG9yID0gbmV3IEV4ZWN1dG9yKHtlbnZpcm9ubWVudEZuOiBlbnZpcm9ubWVudEZufSlcbiAgICBleGVjdXRhYmxlU3VmZml4ID0gJydcbiAgICBwYXRoa2V5ID0gJ1BBVEgnXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIHBsYXRmb3JtID0gJ3dpbmRvd3MnXG4gICAgICBleGVjdXRhYmxlU3VmZml4ID0gJy5leGUnXG4gICAgICBwYXRoa2V5ID0gJ1BhdGgnXG4gICAgfVxuXG4gICAgbG9jYXRvciA9IG5ldyBMb2NhdG9yKHtcbiAgICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudEZuLFxuICAgICAgZXhlY3V0b3I6IGV4ZWN1dG9yLFxuICAgICAgcmVhZHk6IHJlYWR5Rm5cbiAgICB9KVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgaWYgKGV4ZWN1dG9yICE9PSBudWxsKSB7XG4gICAgICBleGVjdXRvci5kaXNwb3NlKClcbiAgICAgIGV4ZWN1dG9yID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChsb2NhdG9yICE9PSBudWxsKSB7XG4gICAgICBsb2NhdG9yLmRpc3Bvc2UoKVxuICAgICAgbG9jYXRvciA9IG51bGxcbiAgICB9XG5cbiAgICBhcmNoID0gbnVsbFxuICAgIHBsYXRmb3JtID0gbnVsbFxuICAgIGVudmlyb25tZW50Rm4gPSBudWxsXG4gICAgZXhlY3V0YWJsZVN1ZmZpeCA9IG51bGxcbiAgICBwYXRoa2V5ID0gbnVsbFxuICAgIHJlYWR5Rm4gPSBudWxsXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gdGhlIGVudmlyb25tZW50IGlzIHByb2Nlc3MuZW52JywgKCkgPT4ge1xuICAgIGl0KCdmaW5kRXhlY3V0YWJsZXNJblBhdGggcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBpdHMgYXJndW1lbnRzIGFyZSBpbnZhbGlkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxvY2F0b3IuZmluZEV4ZWN1dGFibGVzSW5QYXRoKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobG9jYXRvci5maW5kRXhlY3V0YWJsZXNJblBhdGgoZmFsc2UsIGZhbHNlKS5sZW5ndGgpLnRvQmUoMClcbiAgICAgIGV4cGVjdChsb2NhdG9yLmZpbmRFeGVjdXRhYmxlc0luUGF0aCgnJywgZmFsc2UpLmxlbmd0aCkudG9CZSgwKVxuICAgICAgZXhwZWN0KGxvY2F0b3IuZmluZEV4ZWN1dGFibGVzSW5QYXRoKCdhYmNkJywgZmFsc2UpLmxlbmd0aCkudG9CZSgwKVxuICAgICAgZXhwZWN0KGxvY2F0b3IuZmluZEV4ZWN1dGFibGVzSW5QYXRoKCdhYmNkJywge2JsZWg6ICdhYmNkJ30pLmxlbmd0aCkudG9CZSgwKVxuICAgICAgZXhwZWN0KGxvY2F0b3IuZmluZEV4ZWN1dGFibGVzSW5QYXRoKCdhYmNkJywgJ2FiY2QnKS5sZW5ndGgpLnRvQmUoMClcbiAgICAgIGV4cGVjdChsb2NhdG9yLmZpbmRFeGVjdXRhYmxlc0luUGF0aCgnYWJjZCcsIFtdKS5sZW5ndGgpLnRvQmUoMClcbiAgICAgIGV4cGVjdChsb2NhdG9yLmZpbmRFeGVjdXRhYmxlc0luUGF0aChbXSwgW10pLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZEV4ZWN1dGFibGVzSW5QYXRoIHJldHVybnMgYW4gYXJyYXkgd2l0aCBlbGVtZW50cyBpZiBpdHMgYXJndW1lbnRzIGFyZSB2YWxpZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChsb2NhdG9yLmZpbmRFeGVjdXRhYmxlc0luUGF0aCkudG9CZURlZmluZWQoKVxuICAgICAgaWYgKG9zLnBsYXRmb3JtKCkgPT09ICd3aW4zMicpIHtcbiAgICAgICAgZXhwZWN0KGxvY2F0b3IuZmluZEV4ZWN1dGFibGVzSW5QYXRoKCdjOlxcXFx3aW5kb3dzXFxcXHN5c3RlbTMyJywgWydjbWQuZXhlJ10pLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICBleHBlY3QobG9jYXRvci5maW5kRXhlY3V0YWJsZXNJblBhdGgoJ2M6XFxcXHdpbmRvd3NcXFxcc3lzdGVtMzInLCBbJ2NtZC5leGUnXSlbMF0pLnRvQmUoJ2M6XFxcXHdpbmRvd3NcXFxcc3lzdGVtMzJcXFxcY21kLmV4ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlY3QobG9jYXRvci5maW5kRXhlY3V0YWJsZXNJblBhdGgoJy9iaW4nLCBbJ3NoJ10pLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICBleHBlY3QobG9jYXRvci5maW5kRXhlY3V0YWJsZXNJblBhdGgoJy9iaW4nLCBbJ3NoJ10pWzBdKS50b0JlKCcvYmluL3NoJylcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBlbnZpcm9ubWVudCBoYXMgYSBHT1BBVEggdGhhdCBpbmNsdWRlcyBhIHRpbGRlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZW52LkdPUEFUSCA9IHBhdGguam9pbignficsICdnbycpXG4gICAgfSlcblxuICAgIGl0KCdpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxvY2F0b3IpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChsb2NhdG9yKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuXG4gICAgaXQoJ2dvcGF0aCgpIHJldHVybnMgYSBwYXRoIHdpdGggdGhlIGhvbWUgZGlyZWN0b3J5IGV4cGFuZGVkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgoKSkudG9CZShwYXRoLmpvaW4ocGF0aGhlbHBlci5ob21lKCksICdnbycpKVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiB0aGVyZSBpcyBhdG9tIGNvbmZpZyBmb3IgZ28tY29uZmlnLmdvcGF0aCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLWNvbmZpZy5nb3BhdGgnLCAnfi9nbzInKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2dvcGF0aCgpIHByaW9yaXRpemVzIHRoZSBlbnZpcm9ubWVudCBvdmVyIHRoZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChsb2NhdG9yLmdvcGF0aCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgoKSkudG9CZShwYXRoLmpvaW4ocGF0aGhlbHBlci5ob21lKCksICdnbycpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlcmUgaXMgYXRvbSBjb25maWcgZm9yIGdvLXBsdXMuZ29wYXRoJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnZ28tcGx1cy5nb3BhdGgnLCAnfi9nbzInKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2dvcGF0aCgpIHByaW9yaXRpemVzIHRoZSBlbnZpcm9ubWVudCBvdmVyIHRoZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChsb2NhdG9yLmdvcGF0aCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgoKSkudG9CZShwYXRoLmpvaW4ocGF0aGhlbHBlci5ob21lKCksICdnbycpKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBlbnZpcm9ubWVudCBoYXMgYW4gZW1wdHkgR09QQVRIJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgaWYgKGlzVHJ1dGh5KGVudi5HT1BBVEgpKSB7XG4gICAgICAgIGRlbGV0ZSBlbnYuR09QQVRIXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdnb3BhdGgoKSByZXR1cm5zIGZhbHNlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgoKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlcmUgaXMgYXRvbSBjb25maWcgZm9yIGdvLWNvbmZpZy5nb3BhdGgnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1jb25maWcuZ29wYXRoJywgJ34vZ28nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2dvcGF0aCgpIHJldHVybnMgdGhlIGV4cGFuZGVkIHZhbHVlIGZvciB+L2dvJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKCkpLnRvQmUocGF0aC5qb2luKHBhdGhoZWxwZXIuaG9tZSgpLCAnZ28nKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZXJlIGlzIGF0b20gY29uZmlnIGZvciBnby1wbHVzLmdvcGF0aCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMuZ29wYXRoJywgJ34vZ28nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2dvcGF0aCgpIHJldHVybnMgdGhlIGV4cGFuZGVkIHZhbHVlIGZvciB+L2dvJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKCkpLnRvQmUocGF0aC5qb2luKHBhdGhoZWxwZXIuaG9tZSgpLCAnZ28nKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgZW52aXJvbm1lbnQgaGFzIGEgR09QQVRIIHRoYXQgaXMgd2hpdGVzcGFjZScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGVudi5HT1BBVEggPSAnICAgICAgICAnXG4gICAgfSlcblxuICAgIGl0KCdnb3BhdGgoKSByZXR1cm5zIGZhbHNlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgoKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlcmUgaXMgYXRvbSBjb25maWcgZm9yIGdvLWNvbmZpZy5nb3BhdGgnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdnby1jb25maWcuZ29wYXRoJywgJ34vZ28nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2dvcGF0aCgpIHJldHVybnMgdGhlIGV4cGFuZGVkIHZhbHVlIGZvciB+L2dvJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKCkpLnRvQmUocGF0aC5qb2luKHBhdGhoZWxwZXIuaG9tZSgpLCAnZ28nKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZXJlIGlzIGF0b20gY29uZmlnIGZvciBnby1wbHVzLmdvcGF0aCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dvLXBsdXMuZ29wYXRoJywgJ34vZ28nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2dvcGF0aCgpIHJldHVybnMgdGhlIGV4cGFuZGVkIHZhbHVlIGZvciB+L2dvJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobG9jYXRvci5nb3BhdGgpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGxvY2F0b3IuZ29wYXRoKCkpLnRvQmUocGF0aC5qb2luKHBhdGhoZWxwZXIuaG9tZSgpLCAnZ28nKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgUEFUSCBoYXMgYSBzaW5nbGUgZGlyZWN0b3J5IHdpdGggYSBnbyBydW50aW1lIGluIGl0JywgKCkgPT4ge1xuICAgIGxldCBnb2RpciA9IG51bGxcbiAgICBsZXQgZ28gPSBudWxsXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBnb2RpciA9IHRlbXAubWtkaXJTeW5jKCdnby0nKVxuICAgICAgZ28gPSBwYXRoLmpvaW4oZ29kaXIsICdnbycgKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhnbywgJy4nLCB7ZW5jb2Rpbmc6ICd1dGY4JywgbW9kZTogNTExfSlcbiAgICAgIGVudltwYXRoa2V5XSA9IGdvZGlyXG4gICAgICBlbnYuR09QQVRIID0gcGF0aC5qb2luKCd+JywgJ2dvJylcbiAgICB9KVxuXG4gICAgaXQoJ3J1bnRpbWVDYW5kaWRhdGVzKCkgZmluZHMgdGhlIHJ1bnRpbWUnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobG9jYXRvci5ydW50aW1lQ2FuZGlkYXRlcykudG9CZURlZmluZWQoKVxuICAgICAgbGV0IGNhbmRpZGF0ZXMgPSBsb2NhdG9yLnJ1bnRpbWVDYW5kaWRhdGVzKClcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICBleHBlY3QoY2FuZGlkYXRlc1swXSkudG9CZShnbylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIEdPUk9PVCBpcyBzZXQgYW5kIHRoZSBnbyB0b29sIGlzIGF2YWlsYWJsZSB3aXRoaW4gJEdPUk9PVC9iaW4nLCAoKSA9PiB7XG4gICAgbGV0IGdvZGlyID0gbnVsbFxuICAgIGxldCBnbyA9IG51bGxcbiAgICBsZXQgZ29yb290Z28gPSBudWxsXG4gICAgbGV0IGdvcm9vdGRpciA9IG51bGxcbiAgICBsZXQgZ29yb290YmluZGlyID0gbnVsbFxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBnb3Jvb3RkaXIgPSB0ZW1wLm1rZGlyU3luYygnZ29yb290LScpXG4gICAgICBnb3Jvb3RiaW5kaXIgPSBwYXRoLmpvaW4oZ29yb290ZGlyLCAnYmluJylcbiAgICAgIGZzLm1rZGlyU3luYyhnb3Jvb3RiaW5kaXIpXG4gICAgICBnb3Jvb3RnbyA9IHBhdGguam9pbihnb3Jvb3RiaW5kaXIsICdnbycgKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgZ29kaXIgPSB0ZW1wLm1rZGlyU3luYygnZ28tJylcbiAgICAgIGdvID0gcGF0aC5qb2luKGdvZGlyLCAnZ28nICsgZXhlY3V0YWJsZVN1ZmZpeClcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZ29yb290Z28sICcuJywge2VuY29kaW5nOiAndXRmOCcsIG1vZGU6IDUxMX0pXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGdvLCAnLicsIHtlbmNvZGluZzogJ3V0ZjgnLCBtb2RlOiA1MTF9KVxuICAgICAgZW52W3BhdGhrZXldID0gZ29kaXJcbiAgICAgIGVudi5HT1JPT1QgPSBnb3Jvb3RkaXJcbiAgICAgIGVudi5HT1BBVEggPSBwYXRoLmpvaW4oJ34nLCAnZ28nKVxuICAgIH0pXG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgZW52LkdPUk9PVCA9ICcnXG4gICAgfSlcblxuICAgIGl0KCdydW50aW1lQ2FuZGlkYXRlcygpIGZpbmRzIHRoZSBydW50aW1lIGFuZCBvcmRlcnMgdGhlIGdvIGluICRHT1JPT1QvYmluIGJlZm9yZSB0aGUgZ28gaW4gUEFUSCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChsb2NhdG9yLnJ1bnRpbWVDYW5kaWRhdGVzKS50b0JlRGVmaW5lZCgpXG4gICAgICBsZXQgY2FuZGlkYXRlcyA9IGxvY2F0b3IucnVudGltZUNhbmRpZGF0ZXMoKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXMpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzWzBdKS50b0JlKGdvcm9vdGdvKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXNbMV0pLnRvQmUoZ28pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgUEFUSCBoYXMgbXVsdGlwbGUgZGlyZWN0b3JpZXMgd2l0aCBhIGdvIHJ1bnRpbWUgaW4gaXQnLCAoKSA9PiB7XG4gICAgbGV0IGdvZGlyID0gbnVsbFxuICAgIGxldCBnbzFkaXIgPSBudWxsXG4gICAgbGV0IGdvID0gbnVsbFxuICAgIGxldCBnbzEgPSBudWxsXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBnb2RpciA9IHRlbXAubWtkaXJTeW5jKCdnby0nKVxuICAgICAgZ28xZGlyID0gdGVtcC5ta2RpclN5bmMoJ2dvMS0nKVxuICAgICAgZ28gPSBwYXRoLmpvaW4oZ29kaXIsICdnbycgKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgZ28xID0gcGF0aC5qb2luKGdvMWRpciwgJ2dvJyArIGV4ZWN1dGFibGVTdWZmaXgpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGdvLCAnLicsIHtlbmNvZGluZzogJ3V0ZjgnLCBtb2RlOiA1MTF9KVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhnbzEsICcuJywge2VuY29kaW5nOiAndXRmOCcsIG1vZGU6IDUxMX0pXG4gICAgICBlbnZbcGF0aGtleV0gPSBnb2RpciArIHBhdGguZGVsaW1pdGVyICsgZ28xZGlyXG4gICAgfSlcblxuICAgIGl0KCdydW50aW1lQ2FuZGlkYXRlcygpIHJldHVybnMgdGhlIGNhbmRpZGF0ZXMgaW4gdGhlIGNvcnJlY3Qgb3JkZXInLCAoKSA9PiB7XG4gICAgICBleHBlY3QobG9jYXRvci5ydW50aW1lQ2FuZGlkYXRlcykudG9CZURlZmluZWQoKVxuICAgICAgbGV0IGNhbmRpZGF0ZXMgPSBsb2NhdG9yLnJ1bnRpbWVDYW5kaWRhdGVzKClcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDEpXG4gICAgICBleHBlY3QoY2FuZGlkYXRlc1swXSkudG9CZShnbylcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzWzFdKS50b0JlKGdvMSlcbiAgICB9KVxuXG4gICAgaXQoJ3J1bnRpbWVDYW5kaWRhdGVzKCkgcmV0dXJucyBjYW5kaWRhdGVzIGluIHRoZSBjb3JyZWN0IG9yZGVyIHdoZW4gYSBjYW5kaWRhdGUgb2NjdXJzIG11bHRpcGxlIHRpbWVzIGluIHRoZSBwYXRoJywgKCkgPT4ge1xuICAgICAgZW52W3BhdGhrZXldID0gZ29kaXIgKyBwYXRoLmRlbGltaXRlciArIGdvMWRpciArIHBhdGguZGVsaW1pdGVyICsgZ29kaXJcbiAgICAgIGV4cGVjdChsb2NhdG9yLnJ1bnRpbWVDYW5kaWRhdGVzKS50b0JlRGVmaW5lZCgpXG4gICAgICBsZXQgY2FuZGlkYXRlcyA9IGxvY2F0b3IucnVudGltZUNhbmRpZGF0ZXMoKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXMpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMSlcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzWzBdKS50b0JlKGdvKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXNbMV0pLnRvQmUoZ28xKVxuICAgICAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID4gMikge1xuICAgICAgICBleHBlY3QoY2FuZGlkYXRlc1syXSkubm90LnRvQmUoZ28pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgcGF0aCBpbmNsdWRlcyBhIGRpcmVjdG9yeSB3aXRoIGdvIDEuNS4xIGluIGl0JywgKCkgPT4ge1xuICAgIGxldCBnb2RpciA9IG51bGxcbiAgICBsZXQgZ29wYXRoZGlyID0gbnVsbFxuICAgIGxldCBnb3Jvb3RkaXIgPSBudWxsXG4gICAgbGV0IGdvcm9vdGJpbmRpciA9IG51bGxcbiAgICBsZXQgZ290b29sZGlyID0gbnVsbFxuICAgIGxldCBnbyA9IG51bGxcbiAgICBsZXQgZ29yb290YmludG9vbHMgPSBudWxsXG4gICAgbGV0IGdvdG9vbGRpcnRvb2xzID0gbnVsbFxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZ29yb290YmludG9vbHMgPSBbJ2dvJywgJ2dvZG9jJywgJ2dvZm10J11cbiAgICAgIGdvdG9vbGRpcnRvb2xzID0gWydhZGRyMmxpbmUnLCAnY2dvJywgJ2Rpc3QnLCAnbGluaycsICdwYWNrJywgJ3RyYWNlJywgJ2FwaScsICdjb21waWxlJywgJ2RvYycsICdubScsICdwcHJvZicsICd2ZXQnLCAnYXNtJywgJ2NvdmVyJywgJ2ZpeCcsICdvYmpkdW1wJywgJ3lhY2MnXVxuICAgICAgZ29kaXIgPSB0ZW1wLm1rZGlyU3luYygnZ28tJylcbiAgICAgIGdvcGF0aGRpciA9IHRlbXAubWtkaXJTeW5jKCdnb3BhdGgtJylcbiAgICAgIGdvcm9vdGRpciA9IHRlbXAubWtkaXJTeW5jKCdnb3Jvb3QtJylcbiAgICAgIGdvcm9vdGJpbmRpciA9IHBhdGguam9pbihnb3Jvb3RkaXIsICdiaW4nKVxuICAgICAgZnMubWtkaXJTeW5jKGdvcm9vdGJpbmRpcilcbiAgICAgIGdvdG9vbGRpciA9IHBhdGguam9pbihnb3Jvb3RkaXIsICdwa2cnLCAndG9vbCcsIHBsYXRmb3JtICsgJ18nICsgYXJjaClcbiAgICAgIGZzLm1rZGlyc1N5bmMoZ290b29sZGlyKVxuICAgICAgbGV0IGZha2VleGVjdXRhYmxlID0gJ2dvXycgKyBwbGF0Zm9ybSArICdfJyArIGFyY2ggKyBleGVjdXRhYmxlU3VmZml4XG4gICAgICBsZXQgZ28xNTFqc29uID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2dvLTE1MS0nICsgcGxhdGZvcm0gKyAnLmpzb24nKVxuICAgICAgbGV0IGZha2VnbyA9IHBhdGguam9pbihfX2Rpcm5hbWUsICd0b29scycsICdnbycsIGZha2VleGVjdXRhYmxlKVxuICAgICAgZ28gPSBwYXRoLmpvaW4oZ29yb290YmluZGlyLCAnZ28nICsgZXhlY3V0YWJsZVN1ZmZpeClcbiAgICAgIGZzLmNvcHlTeW5jKGZha2VnbywgZ28pXG4gICAgICBmcy5jb3B5U3luYyhnbzE1MWpzb24sIHBhdGguam9pbihnb3Jvb3RiaW5kaXIsICdnby5qc29uJykpXG4gICAgICBlbnZbcGF0aGtleV0gPSBnb2RpclxuICAgICAgZW52WydHT1BBVEgnXSA9IGdvcGF0aGRpclxuICAgICAgZW52WydHT1JPT1QnXSA9IGdvcm9vdGRpclxuICAgICAgZm9yIChsZXQgdG9vbCBvZiBnb3Jvb3RiaW50b29scykge1xuICAgICAgICBpZiAodG9vbCAhPT0gJ2dvJykge1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGdvcm9vdGJpbmRpciwgdG9vbCArIGV4ZWN1dGFibGVTdWZmaXgpLCAnLicsIHtlbmNvZGluZzogJ3V0ZjgnLCBtb2RlOiA1MTF9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCB0b29sIG9mIGdvdG9vbGRpcnRvb2xzKSB7XG4gICAgICAgIGxldCB0b29scGF0aCA9IHBhdGguam9pbihnb3Rvb2xkaXIsIHRvb2wgKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHRvb2xwYXRoLCAnLicsIHtlbmNvZGluZzogJ3V0ZjgnLCBtb2RlOiA1MTF9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgncnVudGltZUNhbmRpZGF0ZXMoKSBmaW5kcyB0aGUgcnVudGltZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChsb2NhdG9yLnJ1bnRpbWVDYW5kaWRhdGVzKS50b0JlRGVmaW5lZCgpXG4gICAgICBsZXQgY2FuZGlkYXRlcyA9IGxvY2F0b3IucnVudGltZUNhbmRpZGF0ZXMoKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXMpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KGNhbmRpZGF0ZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICAgIGV4cGVjdChjYW5kaWRhdGVzWzBdKS50b0JlKGdvKVxuICAgIH0pXG5cbiAgICBpdCgncnVudGltZXMoKSByZXR1cm5zIHRoZSBydW50aW1lJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGxvY2F0b3IucnVudGltZXMpLnRvQmVEZWZpbmVkKClcbiAgICAgIGxldCBydW50aW1lcyA9IG51bGxcbiAgICAgIGxldCBkb25lID0gbG9jYXRvci5ydW50aW1lcygpLnRoZW4oKHIpID0+IHsgcnVudGltZXMgPSByIH0pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7IHJldHVybiBkb25lIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QocnVudGltZXMpLnRvQmVUcnV0aHkoKVxuICAgICAgICBleHBlY3QocnVudGltZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLm5hbWUpLnRvQmUoJ2dvMS41LjEnKVxuICAgICAgICBleHBlY3QocnVudGltZXNbMF0uc2VtdmVyKS50b0JlKCcxLjUuMScpXG4gICAgICAgIGV4cGVjdChydW50aW1lc1swXS52ZXJzaW9uKS50b0JlKCdnbyB2ZXJzaW9uIGdvMS41LjEgJyArIHBsYXRmb3JtICsgJy8nICsgYXJjaClcbiAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLnBhdGgpLnRvQmUoZ28pXG4gICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT0FSQ0gpLnRvQmUoYXJjaClcbiAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkdPQklOKS50b0JlKCcnKVxuICAgICAgICBpZiAocGxhdGZvcm0gPT09ICd3aW5kb3dzJykge1xuICAgICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT0VYRSkudG9CZSgnLmV4ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkdPRVhFKS50b0JlKCcnKVxuICAgICAgICB9XG4gICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT0hPU1RBUkNIKS50b0JlKGFyY2gpXG4gICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT0hPU1RPUykudG9CZShwbGF0Zm9ybSlcbiAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkdPT1MpLnRvQmUocGxhdGZvcm0pXG4gICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT1BBVEgpLnRvQmUoZ29wYXRoZGlyKVxuICAgICAgICBleHBlY3QocnVudGltZXNbMF0uR09SQUNFKS50b0JlKCcnKVxuICAgICAgICBleHBlY3QocnVudGltZXNbMF0uR09ST09UKS50b0JlKGdvcm9vdGRpcilcbiAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkdPVE9PTERJUikudG9CZShnb3Rvb2xkaXIpXG4gICAgICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3dpbmRvd3MnKSB7XG4gICAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkNDKS50b0JlKCdnY2MnKVxuICAgICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT0dDQ0ZMQUdTKS50b0JlKCctbTY0IC1tdGhyZWFkcyAtZm1lc3NhZ2UtbGVuZ3RoPTAnKVxuICAgICAgICAgIGV4cGVjdChydW50aW1lc1swXS5DWFgpLnRvQmUoJ2crKycpXG4gICAgICAgIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkNDKS50b0JlKCdjbGFuZycpXG4gICAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkdPR0NDRkxBR1MpLnRvQmUoJy1mUElDIC1tNjQgLXB0aHJlYWQgLWZuby1jYXJldC1kaWFnbm9zdGljcyAtUXVudXNlZC1hcmd1bWVudHMgLWZtZXNzYWdlLWxlbmd0aD0wIC1mbm8tY29tbW9uJylcbiAgICAgICAgICBleHBlY3QocnVudGltZXNbMF0uQ1hYKS50b0JlKCdjbGFuZysrJylcbiAgICAgICAgfSBlbHNlIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnbGludXgnKSB7XG4gICAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkNDKS50b0JlKCdnY2MnKVxuICAgICAgICAgIGV4cGVjdChydW50aW1lc1swXS5HT0dDQ0ZMQUdTKS50b0JlKCctZlBJQyAtbTY0IC1wdGhyZWFkIC1mbWVzc2FnZS1sZW5ndGg9MCcpXG4gICAgICAgICAgZXhwZWN0KHJ1bnRpbWVzWzBdLkNYWCkudG9CZSgnZysrJylcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QocnVudGltZXNbMF0uR08xNVZFTkRPUkVYUEVSSU1FTlQpLnRvQmUoJycpXG4gICAgICAgIGV4cGVjdChydW50aW1lc1swXS5DR09fRU5BQkxFRCkudG9CZSgnMScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmluZFRvb2woKSBmaW5kcyB0aGUgZ28gdG9vbCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChsb2NhdG9yLmZpbmRUb29sKS50b0JlRGVmaW5lZCgpXG4gICAgICBsZXQgdG9vbCA9IG51bGxcbiAgICAgIGxldCBlcnIgPSBudWxsXG4gICAgICBsZXQgZG9uZSA9IGxvY2F0b3IuZmluZFRvb2woJ2dvJykudGhlbigodCkgPT4geyB0b29sID0gdCB9KS5jYXRjaCgoZSkgPT4geyBlcnIgPSBlIH0pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7IHJldHVybiBkb25lIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXJyKS50b0JlKG51bGwpXG4gICAgICAgIGV4cGVjdCh0b29sKS50b0JlVHJ1dGh5KClcbiAgICAgICAgZXhwZWN0KHRvb2wpLnRvQmUocGF0aC5qb2luKGdvcm9vdGJpbmRpciwgJ2dvJyArIGV4ZWN1dGFibGVTdWZmaXgpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRUb29sKCkgZmluZHMgdG9vbHMgaW4gR09ST09UJywgKCkgPT4ge1xuICAgICAgbGV0IHRvb2xzID0gWydnbycsICdnb2RvYycsICdnb2ZtdCddXG4gICAgICBsZXQgcnVudGltZSA9IGZhbHNlXG4gICAgICBsZXQgdG9vbCA9IG51bGxcbiAgICAgIGxldCB0b29sUGF0aCA9IGZhbHNlXG4gICAgICBsZXQgZG9uZSA9IGxvY2F0b3IucnVudGltZSgpLnRoZW4oKHIpID0+IHsgcnVudGltZSA9IHIgfSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGRvbmUgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IHRvb2xJdGVtIG9mIHRvb2xzKSB7XG4gICAgICAgICAgdG9vbCA9IG51bGxcbiAgICAgICAgICBkb25lID0gbnVsbFxuICAgICAgICAgIHRvb2xQYXRoID0gcGF0aC5qb2luKHJ1bnRpbWUuR09ST09ULCAnYmluJywgdG9vbEl0ZW0gKyBydW50aW1lLkdPRVhFKVxuICAgICAgICAgIGRvbmUgPSBsb2NhdG9yLmZpbmRUb29sKHRvb2xJdGVtKS50aGVuKCh0KSA9PiB7IHRvb2wgPSB0IH0pXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGRvbmUgfSlcblxuICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHRvb2wpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KHRvb2wpLnRvQmUodG9vbFBhdGgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N0YXQoKSByZXR1cm5zIGZhbHNlIGZvciBub25leGlzdGVudCBmaWxlcycsICgpID0+IHtcbiAgICAgIGxldCBzdGF0ID0gbnVsbFxuICAgICAgbGV0IGRvbmUgPSBsb2NhdG9yLnN0YXQoJ25vbmV4aXN0ZW50dGhpbmcnKS50aGVuKChzKSA9PiB7IHN0YXQgPSBzIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4geyByZXR1cm4gZG9uZSB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHN0YXQpLnRvQmUoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmluZFRvb2woKSBmaW5kcyB0b29scyBpbiBHT1RPT0xESVInLCAoKSA9PiB7XG4gICAgICBsZXQgdG9vbHMgPSBbJ2FkZHIybGluZScsICdjZ28nLCAnZGlzdCcsICdsaW5rJywgJ3BhY2snLCAndHJhY2UnLCAnYXBpJywgJ2NvbXBpbGUnLCAnZG9jJywgJ25tJywgJ3Bwcm9mJywgJ3ZldCcsICdhc20nLCAnY292ZXInLCAnZml4JywgJ29iamR1bXAnLCAneWFjYyddXG4gICAgICBsZXQgcnVudGltZSA9IGZhbHNlXG4gICAgICBsZXQgZG9uZSA9IGxvY2F0b3IucnVudGltZSgpLnRoZW4oKHIpID0+IHsgcnVudGltZSA9IHIgfSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGRvbmUgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IHRvb2xJdGVtIG9mIHRvb2xzKSB7XG4gICAgICAgICAgbGV0IHRvb2wgPSBudWxsXG4gICAgICAgICAgbGV0IHRvb2xQYXRoID0gcGF0aC5qb2luKHJ1bnRpbWUuR09UT09MRElSLCB0b29sSXRlbSArIHJ1bnRpbWUuR09FWEUpXG4gICAgICAgICAgbGV0IGRvbmUgPSBsb2NhdG9yLmZpbmRUb29sKHRvb2xJdGVtKS50aGVuKCh0KSA9PiB7IHRvb2wgPSB0IH0pXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGRvbmUgfSlcblxuICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHRvb2wpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KHRvb2wpLnRvQmUodG9vbFBhdGgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBwYXRoIGluY2x1ZGVzIGEgZGlyZWN0b3J5IHdpdGggdGhlIGdvbWV0YWxpbnRlciB0b29sIGluIGl0JywgKCkgPT4ge1xuICAgIGxldCBnb3BhdGhkaXIgPSBudWxsXG4gICAgbGV0IGdvcGF0aGJpbmRpciA9IG51bGxcbiAgICBsZXQgcGF0aGRpciA9IG51bGxcbiAgICBsZXQgcGF0aHRvb2xzID0gbnVsbFxuICAgIGxldCBnb3BhdGhiaW50b29scyA9IG51bGxcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHBhdGh0b29scyA9IFsnZ29tZXRhbGludGVyJywgJ2diJ11cbiAgICAgIGdvcGF0aGJpbnRvb2xzID0gWydzb21lcmFuZG9tdG9vbCcsICdnYiddXG4gICAgICBwYXRoZGlyID0gdGVtcC5ta2RpclN5bmMoJ3BhdGgtJylcbiAgICAgIGdvcGF0aGRpciA9IHRlbXAubWtkaXJTeW5jKCdnb3BhdGgtJylcbiAgICAgIGdvcGF0aGJpbmRpciA9IHBhdGguam9pbihnb3BhdGhkaXIsICdiaW4nKVxuICAgICAgZnMubWtkaXJTeW5jKGdvcGF0aGJpbmRpcilcbiAgICAgIGVudlsnR09QQVRIJ10gPSBnb3BhdGhkaXJcbiAgICAgIGVudltwYXRoa2V5XSA9IHBhdGhkaXIgKyBwYXRoLmRlbGltaXRlciArIGVudlsnUEFUSCddXG4gICAgICBmb3IgKGxldCB0b29sIG9mIHBhdGh0b29scykge1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihwYXRoZGlyLCB0b29sICsgZXhlY3V0YWJsZVN1ZmZpeCksICcuJywge2VuY29kaW5nOiAndXRmOCcsIG1vZGU6IDUxMX0pXG4gICAgICB9XG4gICAgICBmb3IgKGxldCB0b29sIG9mIGdvcGF0aGJpbnRvb2xzKSB7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGdvcGF0aGJpbmRpciwgdG9vbCArIGV4ZWN1dGFibGVTdWZmaXgpLCAnLicsIHtlbmNvZGluZzogJ3V0ZjgnLCBtb2RlOiA1MTF9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnZmluZFRvb2woKSBmaW5kcyB0b29scyBpbiBQQVRIJywgKCkgPT4ge1xuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IHRvb2xJdGVtIG9mIHBhdGh0b29scykge1xuICAgICAgICAgIGxldCB0b29sUGF0aCA9IGZhbHNlXG4gICAgICAgICAgbGV0IHRvb2wgPSBudWxsXG4gICAgICAgICAgbGV0IGRvbmUgPSBudWxsXG5cbiAgICAgICAgICBpZiAoZ29wYXRoYmludG9vbHMuaW5kZXhPZih0b29sSXRlbSkgIT09IC0xKSB7XG4gICAgICAgICAgICB0b29sUGF0aCA9IHBhdGguam9pbihnb3BhdGhiaW5kaXIsIHRvb2xJdGVtICsgZXhlY3V0YWJsZVN1ZmZpeClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9vbFBhdGggPSBwYXRoLmpvaW4ocGF0aGRpciwgdG9vbEl0ZW0gKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvbmUgPSBsb2NhdG9yLmZpbmRUb29sKHRvb2xJdGVtKS50aGVuKCh0KSA9PiB7XG4gICAgICAgICAgICB0b29sID0gdFxuICAgICAgICAgIH0pXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGRvbmUgfSlcbiAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgIGRvbmUgPSBudWxsXG4gICAgICAgICAgICBleHBlY3QodG9vbCkudG9CZVRydXRoeSgpXG4gICAgICAgICAgICBleHBlY3QodG9vbCkudG9CZSh0b29sUGF0aClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmluZFRvb2woKSBmaW5kcyB0b29scyBpbiBHT1BBVEhcXCdzIGJpbiBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgdG9vbEl0ZW0gb2YgZ29wYXRoYmludG9vbHMpIHtcbiAgICAgICAgICBsZXQgdG9vbCA9IG51bGxcbiAgICAgICAgICBsZXQgdG9vbFBhdGggPSBmYWxzZVxuICAgICAgICAgIGxldCBkb25lID0gbnVsbFxuICAgICAgICAgIHRvb2xQYXRoID0gcGF0aC5qb2luKGdvcGF0aGJpbmRpciwgdG9vbEl0ZW0gKyBleGVjdXRhYmxlU3VmZml4KVxuICAgICAgICAgIGRvbmUgPSBsb2NhdG9yLmZpbmRUb29sKHRvb2xJdGVtKS50aGVuKCh0KSA9PiB7IHRvb2wgPSB0IH0pXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGRvbmUgfSlcbiAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCh0b29sKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIGV4cGVjdCh0b29sKS50b0JlKHRvb2xQYXRoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-config/spec/locator-spec.js
