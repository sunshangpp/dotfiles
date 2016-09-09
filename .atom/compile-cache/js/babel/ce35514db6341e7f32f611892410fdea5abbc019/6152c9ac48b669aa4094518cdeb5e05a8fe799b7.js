Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _check = require('./check');

var _executor = require('./executor');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

'use babel';

exports['default'] = {
  environment: null,
  locator: null,
  subscriptions: null,
  dependenciesInstalled: null,

  activate: function activate() {
    var _this = this;

    this.dependenciesInstalled = false;
    this.subscriptions = new _atom.CompositeDisposable();
    if (_semver2['default'].satisfies(this.version(), '<1.7.0')) {
      require('atom-package-deps').install('go-config').then(function () {
        _this.dependenciesInstalled = true;
      })['catch'](function (e) {
        console.log(e);
      });
    } else {
      this.dependenciesInstalled = true;
    }
  },

  deactivate: function deactivate() {
    this.dispose();
  },

  dispose: function dispose() {
    if ((0, _check.isTruthy)(this.subscriptions)) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.environment = null;
    this.locator = null;
    this.dependenciesInstalled = null;
  },

  getExecutor: function getExecutor(options) {
    var e = new _executor.Executor({ environmentFn: this.getEnvironment.bind(this) });
    return e;
  },

  getLocator: function getLocator() {
    if ((0, _check.isTruthy)(this.locator)) {
      return this.locator;
    }
    var Locator = require('./locator').Locator;
    this.locator = new Locator({
      environment: this.getEnvironment.bind(this),
      executor: this.getExecutor(),
      ready: this.ready.bind(this)
    });
    this.subscriptions.add(this.locator);
    return this.locator;
  },

  ready: function ready() {
    if ((0, _check.isFalsy)(this.dependenciesInstalled)) {
      return false;
    }
    if (_semver2['default'].satisfies(this.version(), '>=1.7.0')) {
      return true;
    } else {
      if ((0, _check.isTruthy)(this.environment)) {
        return true;
      } else {
        return false;
      }
    }
  },

  getEnvironment: function getEnvironment() {
    if (_semver2['default'].satisfies(this.version(), '>=1.7.0')) {
      return process.env;
    }

    if (this.ready()) {
      return this.environment;
    }

    return process.env;
  },

  version: function version() {
    return _semver2['default'].major(atom.appVersion) + '.' + _semver2['default'].minor(atom.appVersion) + '.' + _semver2['default'].patch(atom.appVersion);
  },

  provide: function provide() {
    return this.get100Implementation();
  },

  provide010: function provide010() {
    return this.get010Implementation();
  },

  get100Implementation: function get100Implementation() {
    var executor = this.getExecutor();
    var locator = this.getLocator();
    return {
      executor: {
        exec: executor.exec.bind(executor),
        execSync: executor.execSync.bind(executor)
      },
      locator: {
        runtimes: locator.runtimes.bind(locator),
        runtime: locator.runtime.bind(locator),
        gopath: locator.gopath.bind(locator),
        findTool: locator.findTool.bind(locator)
      },
      environment: locator.environment.bind(locator)
    };
  },

  get010Implementation: function get010Implementation() {
    var executor = this.getExecutor();
    var locator = this.getLocator();
    return {
      executor: executor,
      locator: locator,
      environment: this.getEnvironment.bind(this)
    };
  },

  consumeEnvironment: function consumeEnvironment(environment) {
    this.environment = environment;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWtDLE1BQU07O3FCQUNSLFNBQVM7O3dCQUNsQixZQUFZOztzQkFDaEIsUUFBUTs7OztBQUwzQixXQUFXLENBQUE7O3FCQU9JO0FBQ2IsYUFBVyxFQUFFLElBQUk7QUFDakIsU0FBTyxFQUFFLElBQUk7QUFDYixlQUFhLEVBQUUsSUFBSTtBQUNuQix1QkFBcUIsRUFBRSxJQUFJOztBQUUzQixVQUFRLEVBQUMsb0JBQUc7OztBQUNWLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7QUFDbEMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLG9CQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDOUMsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzNELGNBQUsscUJBQXFCLEdBQUcsSUFBSSxDQUFBO09BQ2xDLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNmLENBQUMsQ0FBQTtLQUNILE1BQU07QUFDTCxVQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0tBQ2xDO0dBQ0Y7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ2Y7O0FBRUQsU0FBTyxFQUFDLG1CQUFHO0FBQ1QsUUFBSSxxQkFBUyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3QjtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUks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Q0FBQyxRQUFRLENBQUM7T0FDM0M7QUFDRCxhQUFPLEVBQUU7QUFDUCxnQkFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN4QyxlQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3RDLGNBQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDcEMsZ0JBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDekM7QUFDRCxpQkFBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUMvQyxDQUFBO0dBQ0Y7O0FBRUQsc0JBQW9CLEVBQUMsZ0NBQUc7QUFDdEIsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pDLFFBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMvQixXQUFPO0FBQ0wsY0FBUSxFQUFFLFFBQVE7QUFDbEIsYUFBTyxFQUFFLE9BQU87QUFDaEIsaUJBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDNUMsQ0FBQTtHQUNGOztBQUVELG9CQUFrQixFQUFDLDRCQUFDLFdBQVcsRUFBRTtBQUMvQixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtHQUMvQjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7aXNUcnV0aHksIGlzRmFsc3l9IGZyb20gJy4vY2hlY2snXG5pbXBvcnQge0V4ZWN1dG9yfSBmcm9tICcuL2V4ZWN1dG9yJ1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZW52aXJvbm1lbnQ6IG51bGwsXG4gIGxvY2F0b3I6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIGRlcGVuZGVuY2llc0luc3RhbGxlZDogbnVsbCxcblxuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBpZiAoc2VtdmVyLnNhdGlzZmllcyh0aGlzLnZlcnNpb24oKSwgJzwxLjcuMCcpKSB7XG4gICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2dvLWNvbmZpZycpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IHRydWVcbiAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IHRydWVcbiAgICB9XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5kaXNwb3NlKClcbiAgfSxcblxuICBkaXNwb3NlICgpIHtcbiAgICBpZiAoaXNUcnV0aHkodGhpcy5zdWJzY3JpcHRpb25zKSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5lbnZpcm9ubWVudCA9IG51bGxcbiAgICB0aGlzLmxvY2F0b3IgPSBudWxsXG4gICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSBudWxsXG4gIH0sXG5cbiAgZ2V0RXhlY3V0b3IgKG9wdGlvbnMpIHtcbiAgICBsZXQgZSA9IG5ldyBFeGVjdXRvcih7ZW52aXJvbm1lbnRGbjogdGhpcy5nZXRFbnZpcm9ubWVudC5iaW5kKHRoaXMpfSlcbiAgICByZXR1cm4gZVxuICB9LFxuXG4gIGdldExvY2F0b3IgKCkge1xuICAgIGlmIChpc1RydXRoeSh0aGlzLmxvY2F0b3IpKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2NhdG9yXG4gICAgfVxuICAgIGxldCBMb2NhdG9yID0gcmVxdWlyZSgnLi9sb2NhdG9yJykuTG9jYXRvclxuICAgIHRoaXMubG9jYXRvciA9IG5ldyBMb2NhdG9yKHtcbiAgICAgIGVudmlyb25tZW50OiB0aGlzLmdldEVudmlyb25tZW50LmJpbmQodGhpcyksXG4gICAgICBleGVjdXRvcjogdGhpcy5nZXRFeGVjdXRvcigpLFxuICAgICAgcmVhZHk6IHRoaXMucmVhZHkuYmluZCh0aGlzKVxuICAgIH0pXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmxvY2F0b3IpXG4gICAgcmV0dXJuIHRoaXMubG9jYXRvclxuICB9LFxuXG4gIHJlYWR5ICgpIHtcbiAgICBpZiAoaXNGYWxzeSh0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAoc2VtdmVyLnNhdGlzZmllcyh0aGlzLnZlcnNpb24oKSwgJz49MS43LjAnKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzVHJ1dGh5KHRoaXMuZW52aXJvbm1lbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZ2V0RW52aXJvbm1lbnQgKCkge1xuICAgIGlmIChzZW12ZXIuc2F0aXNmaWVzKHRoaXMudmVyc2lvbigpLCAnPj0xLjcuMCcpKSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5lbnZcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWFkeSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudFxuICAgIH1cblxuICAgIHJldHVybiBwcm9jZXNzLmVudlxuICB9LFxuXG4gIHZlcnNpb24gKCkge1xuICAgIHJldHVybiBzZW12ZXIubWFqb3IoYXRvbS5hcHBWZXJzaW9uKSArICcuJyArIHNlbXZlci5taW5vcihhdG9tLmFwcFZlcnNpb24pICsgJy4nICsgc2VtdmVyLnBhdGNoKGF0b20uYXBwVmVyc2lvbilcbiAgfSxcblxuICBwcm92aWRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQxMDBJbXBsZW1lbnRhdGlvbigpXG4gIH0sXG5cbiAgcHJvdmlkZTAxMCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0MDEwSW1wbGVtZW50YXRpb24oKVxuICB9LFxuXG4gIGdldDEwMEltcGxlbWVudGF0aW9uICgpIHtcbiAgICBsZXQgZXhlY3V0b3IgPSB0aGlzLmdldEV4ZWN1dG9yKClcbiAgICBsZXQgbG9jYXRvciA9IHRoaXMuZ2V0TG9jYXRvcigpXG4gICAgcmV0dXJuIHtcbiAgICAgIGV4ZWN1dG9yOiB7XG4gICAgICAgIGV4ZWM6IGV4ZWN1dG9yLmV4ZWMuYmluZChleGVjdXRvciksXG4gICAgICAgIGV4ZWNTeW5jOiBleGVjdXRvci5leGVjU3luYy5iaW5kKGV4ZWN1dG9yKVxuICAgICAgfSxcbiAgICAgIGxvY2F0b3I6IHtcbiAgICAgICAgcnVudGltZXM6IGxvY2F0b3IucnVudGltZXMuYmluZChsb2NhdG9yKSxcbiAgICAgICAgcnVudGltZTogbG9jYXRvci5ydW50aW1lLmJpbmQobG9jYXRvciksXG4gICAgICAgIGdvcGF0aDogbG9jYXRvci5nb3BhdGguYmluZChsb2NhdG9yKSxcbiAgICAgICAgZmluZFRvb2w6IGxvY2F0b3IuZmluZFRvb2wuYmluZChsb2NhdG9yKVxuICAgICAgfSxcbiAgICAgIGVudmlyb25tZW50OiBsb2NhdG9yLmVudmlyb25tZW50LmJpbmQobG9jYXRvcilcbiAgICB9XG4gIH0sXG5cbiAgZ2V0MDEwSW1wbGVtZW50YXRpb24gKCkge1xuICAgIGxldCBleGVjdXRvciA9IHRoaXMuZ2V0RXhlY3V0b3IoKVxuICAgIGxldCBsb2NhdG9yID0gdGhpcy5nZXRMb2NhdG9yKClcbiAgICByZXR1cm4ge1xuICAgICAgZXhlY3V0b3I6IGV4ZWN1dG9yLFxuICAgICAgbG9jYXRvcjogbG9jYXRvcixcbiAgICAgIGVudmlyb25tZW50OiB0aGlzLmdldEVudmlyb25tZW50LmJpbmQodGhpcylcbiAgICB9XG4gIH0sXG5cbiAgY29uc3VtZUVudmlyb25tZW50IChlbnZpcm9ubWVudCkge1xuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudFxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/main.js
