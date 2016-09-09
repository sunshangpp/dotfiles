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
  locator: null,
  subscriptions: null,

  activate: function activate() {
    this.subscriptions = new _atom.CompositeDisposable();
    if (_semver2['default'].satisfies(this.version(), '<1.9.9')) {
      atom.notifications.addError('Please Update Atom', {
        detail: 'You are running an old version of Atom. Please update Atom to the latest version or a version >= v1.9.9.',
        dismissable: true
      });
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
    this.locator = null;
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
    return true;
  },

  getEnvironment: function getEnvironment() {
    return Object.assign({}, process.env);
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
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWtDLE1BQU07O3FCQUNqQixTQUFTOzt3QkFDVCxZQUFZOztzQkFDaEIsUUFBUTs7OztBQUwzQixXQUFXLENBQUE7O3FCQU9JO0FBQ2IsU0FBTyxFQUFFLElBQUk7QUFDYixlQUFhLEVBQUUsSUFBSTs7QUFFbkIsVUFBUSxFQUFDLG9CQUFHO0FBQ1YsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLG9CQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDOUMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUU7QUFDaEQsY0FBTSxFQUFFLDBHQUEwRztBQUNsSCxtQkFBVyxFQUFFLElBQUk7T0FDbEIsQ0FBQyxDQUFBO0tBQ0g7R0FDRjs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDZjs7QUFFRCxTQUFPLEVBQUMsbUJBQUc7QUFDVCxRQUFJLHFCQUFTLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7R0FDcEI7O0FBRUQsYUFBVyxFQUFDLHFCQUFDLE9BQU8sRUFBRTtBQUNwQixRQUFJLENBQUMsR0FBRyx1QkFBYSxFQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUE7QUFDckUsV0FBTyxDQUFDLENBQUE7R0FDVDs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLHFCQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7QUFDRCxRQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFBO0FBQzFDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUM7QUFDekIsaUJBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDM0MsY0FBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDNUIsV0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUM3QixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsV0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0dBQ3BCOztBQUVELE9BQUssRUFBQyxpQkFBRztBQUNQLFdBQU8sSUFBSSxDQUFBO0dBQ1o7O0FBRUQsZ0JBQWMsRUFBQywwQkFBRztBQUNoQixXQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtHQUN0Qzs7QUFFRCxTQUFPLEVBQUMsbUJBQUc7QUFDVCxXQUFPLG9CQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLG9CQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLG9CQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7R0FDakg7O0FBRUQsU0FBTyxFQUFDLG1CQUFHO0FBQ1QsV0FBTyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtHQUNuQzs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixXQUFPLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0dBQ25DOztBQUVELHNCQUFvQixFQUFDLGdDQUFHO0FBQ3RCLFFBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqQyxRQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDL0IsV0FBTztBQUNMLGNBQVEsRUFBRTtBQUNSLFlBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbEMsZ0JBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7T0FDM0M7QUFDRCxhQUFPLEVBQUU7QUFDUCxnQkFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN4QyxlQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3RDLGNBQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDcEMsZ0JBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDekM7QUFDRCxpQkFBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUMvQyxDQUFBO0dBQ0Y7O0FBRUQsc0JBQW9CLEVBQUMsZ0NBQUc7QUFDdEIsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pDLFFBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMvQixXQUFPO0FBQ0wsY0FBUSxFQUFFLFFBQVE7QUFDbEIsYUFBTyxFQUFFLE9BQU87QUFDaEIsaUJBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDNUMsQ0FBQTtHQUNGO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tY29uZmlnL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtpc1RydXRoeX0gZnJvbSAnLi9jaGVjaydcbmltcG9ydCB7RXhlY3V0b3J9IGZyb20gJy4vZXhlY3V0b3InXG5pbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcidcblxuZXhwb3J0IGRlZmF1bHQge1xuICBsb2NhdG9yOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgaWYgKHNlbXZlci5zYXRpc2ZpZXModGhpcy52ZXJzaW9uKCksICc8MS45LjknKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdQbGVhc2UgVXBkYXRlIEF0b20nLCB7XG4gICAgICAgIGRldGFpbDogJ1lvdSBhcmUgcnVubmluZyBhbiBvbGQgdmVyc2lvbiBvZiBBdG9tLiBQbGVhc2UgdXBkYXRlIEF0b20gdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9yIGEgdmVyc2lvbiA+PSB2MS45LjkuJyxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuZGlzcG9zZSgpXG4gIH0sXG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgaWYgKGlzVHJ1dGh5KHRoaXMuc3Vic2NyaXB0aW9ucykpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMubG9jYXRvciA9IG51bGxcbiAgfSxcblxuICBnZXRFeGVjdXRvciAob3B0aW9ucykge1xuICAgIGxldCBlID0gbmV3IEV4ZWN1dG9yKHtlbnZpcm9ubWVudEZuOiB0aGlzLmdldEVudmlyb25tZW50LmJpbmQodGhpcyl9KVxuICAgIHJldHVybiBlXG4gIH0sXG5cbiAgZ2V0TG9jYXRvciAoKSB7XG4gICAgaWYgKGlzVHJ1dGh5KHRoaXMubG9jYXRvcikpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvY2F0b3JcbiAgICB9XG4gICAgbGV0IExvY2F0b3IgPSByZXF1aXJlKCcuL2xvY2F0b3InKS5Mb2NhdG9yXG4gICAgdGhpcy5sb2NhdG9yID0gbmV3IExvY2F0b3Ioe1xuICAgICAgZW52aXJvbm1lbnQ6IHRoaXMuZ2V0RW52aXJvbm1lbnQuYmluZCh0aGlzKSxcbiAgICAgIGV4ZWN1dG9yOiB0aGlzLmdldEV4ZWN1dG9yKCksXG4gICAgICByZWFkeTogdGhpcy5yZWFkeS5iaW5kKHRoaXMpXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubG9jYXRvcilcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yXG4gIH0sXG5cbiAgcmVhZHkgKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgZ2V0RW52aXJvbm1lbnQgKCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwcm9jZXNzLmVudilcbiAgfSxcblxuICB2ZXJzaW9uICgpIHtcbiAgICByZXR1cm4gc2VtdmVyLm1ham9yKGF0b20uYXBwVmVyc2lvbikgKyAnLicgKyBzZW12ZXIubWlub3IoYXRvbS5hcHBWZXJzaW9uKSArICcuJyArIHNlbXZlci5wYXRjaChhdG9tLmFwcFZlcnNpb24pXG4gIH0sXG5cbiAgcHJvdmlkZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0MTAwSW1wbGVtZW50YXRpb24oKVxuICB9LFxuXG4gIHByb3ZpZGUwMTAgKCkge1xuICAgIHJldHVybiB0aGlzLmdldDAxMEltcGxlbWVudGF0aW9uKClcbiAgfSxcblxuICBnZXQxMDBJbXBsZW1lbnRhdGlvbiAoKSB7XG4gICAgbGV0IGV4ZWN1dG9yID0gdGhpcy5nZXRFeGVjdXRvcigpXG4gICAgbGV0IGxvY2F0b3IgPSB0aGlzLmdldExvY2F0b3IoKVxuICAgIHJldHVybiB7XG4gICAgICBleGVjdXRvcjoge1xuICAgICAgICBleGVjOiBleGVjdXRvci5leGVjLmJpbmQoZXhlY3V0b3IpLFxuICAgICAgICBleGVjU3luYzogZXhlY3V0b3IuZXhlY1N5bmMuYmluZChleGVjdXRvcilcbiAgICAgIH0sXG4gICAgICBsb2NhdG9yOiB7XG4gICAgICAgIHJ1bnRpbWVzOiBsb2NhdG9yLnJ1bnRpbWVzLmJpbmQobG9jYXRvciksXG4gICAgICAgIHJ1bnRpbWU6IGxvY2F0b3IucnVudGltZS5iaW5kKGxvY2F0b3IpLFxuICAgICAgICBnb3BhdGg6IGxvY2F0b3IuZ29wYXRoLmJpbmQobG9jYXRvciksXG4gICAgICAgIGZpbmRUb29sOiBsb2NhdG9yLmZpbmRUb29sLmJpbmQobG9jYXRvcilcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDogbG9jYXRvci5lbnZpcm9ubWVudC5iaW5kKGxvY2F0b3IpXG4gICAgfVxuICB9LFxuXG4gIGdldDAxMEltcGxlbWVudGF0aW9uICgpIHtcbiAgICBsZXQgZXhlY3V0b3IgPSB0aGlzLmdldEV4ZWN1dG9yKClcbiAgICBsZXQgbG9jYXRvciA9IHRoaXMuZ2V0TG9jYXRvcigpXG4gICAgcmV0dXJuIHtcbiAgICAgIGV4ZWN1dG9yOiBleGVjdXRvcixcbiAgICAgIGxvY2F0b3I6IGxvY2F0b3IsXG4gICAgICBlbnZpcm9ubWVudDogdGhpcy5nZXRFbnZpcm9ubWVudC5iaW5kKHRoaXMpXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/main.js
