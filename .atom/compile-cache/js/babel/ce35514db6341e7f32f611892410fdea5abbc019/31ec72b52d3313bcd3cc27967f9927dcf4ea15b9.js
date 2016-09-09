function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-env jasmine */

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

'use babel';

describe('go-config', function () {
  var goconfigMain = null;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('environment');
    });
    waitsForPromise(function () {
      return atom.packages.activatePackage('go-config').then(function (pack) {
        goconfigMain = pack.mainModule;
      });
    });
    waitsFor(function () {
      return goconfigMain.ready();
    });
  });

  describe('when the go-config package is activated', function () {
    it('manages subscriptions', function () {
      expect(goconfigMain).toBeDefined();
      expect(goconfigMain.subscriptions).toBeDefined();
      expect(goconfigMain.subscriptions).toBeTruthy();
    });

    it('disposes correctly', function () {
      expect(goconfigMain).toBeDefined();
      expect(goconfigMain.subscriptions).toBeDefined();
      expect(goconfigMain.subscriptions).toBeTruthy();
      expect(goconfigMain.environment).toBeDefined();
      expect(goconfigMain.environment).toBeTruthy();
      goconfigMain.getLocator();
      expect(goconfigMain.locator).toBeDefined();
      expect(goconfigMain.locator).toBeTruthy();

      goconfigMain.dispose();
      expect(goconfigMain.subscriptions).toBeFalsy();
      expect(goconfigMain.environment).toBeFalsy();
      expect(goconfigMain.locator).toBeFalsy();

      goconfigMain.activate();
    });

    it('gets a Locator', function () {
      expect(goconfigMain.getLocator).toBeDefined();
      var locator = goconfigMain.getLocator();
      expect(locator).toBeDefined();
      expect(locator).toBeTruthy();
    });

    it('gets an executor', function () {
      expect(goconfigMain.getExecutor).toBeDefined();
      var executor = goconfigMain.getExecutor();
      expect(executor).toBeDefined();
      expect(executor).toBeTruthy();
    });

    it('is ready', function () {
      expect(goconfigMain.ready).toBeDefined();
      expect(goconfigMain.ready()).toBe(true);
    });

    it('provides a service', function () {
      expect(goconfigMain.provide).toBeDefined();
      var provider = goconfigMain.provide();
      expect(provider).toBeTruthy();
      expect(provider.executor).toBeTruthy();
      expect(provider.locator).toBeTruthy();
      expect(provider.locator.runtimes).toBeDefined();
      expect(provider.locator.runtime).toBeDefined();
      expect(provider.locator.gopath).toBeDefined();
      expect(provider.locator.findTool).toBeDefined();
      expect(provider.locator.runtimeCandidates).not.toBeDefined();
      expect(provider.environment).toBeDefined();
      expect(provider.environment()).toBeTruthy();
    });
  });

  describe('when the environment is not available', function () {
    var e = null;
    beforeEach(function () {
      e = goconfigMain.environment;
      goconfigMain.environment = null;
    });
    afterEach(function () {
      goconfigMain.environment = e;
    });

    it('is not ready for Atom < 1.7.0', function () {
      expect(goconfigMain.ready).toBeDefined();
      if (_semver2['default'].satisfies(_semver2['default'].major(atom.appVersion) + '.' + _semver2['default'].minor(atom.appVersion) + '.' + _semver2['default'].patch(atom.appVersion), '<1.7.0')) {
        expect(goconfigMain.ready()).toBe(false);
      }
    });

    it('returns the process environment', function () {
      expect(goconfigMain.environment).toBeFalsy();
      expect(goconfigMain.getEnvironment).toBeDefined();
      expect(goconfigMain.getEnvironment()).toBeTruthy();
      expect(goconfigMain.getEnvironment()).toBe(process.env);
    });

    it('consumes an environment', function () {
      expect(goconfigMain.environment).toBeFalsy();
      goconfigMain.consumeEnvironment({ PING: 'PONG' });
      expect(goconfigMain.environment).toBeTruthy();
      expect(goconfigMain.environment.PING).toBe('PONG');
      expect(goconfigMain.environment.PONG).not.toBeDefined();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9zcGVjL21haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3NCQUdtQixRQUFROzs7O0FBSDNCLFdBQVcsQ0FBQTs7QUFLWCxRQUFRLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDMUIsTUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFBOztBQUV2QixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ3BELENBQUMsQ0FBQTtBQUNGLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUMvRCxvQkFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7T0FDL0IsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0FBQ0YsWUFBUSxDQUFDLFlBQU07QUFBRSxhQUFPLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUFFLENBQUMsQ0FBQTtHQUNoRCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHlDQUF5QyxFQUFFLFlBQU07QUFDeEQsTUFBRSxDQUFDLHVCQUF1QixFQUFFLFlBQU07QUFDaEMsWUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDaEQsWUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtLQUNoRCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLG9CQUFvQixFQUFFLFlBQU07QUFDN0IsWUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2xDLFlB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QyxZQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQzVDLFlBQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsWUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ2xELFlBQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3hELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUNsQyxZQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQzVDLGtCQUFZLENBQUMsa0JBQWtCLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQTtBQUMvQyxZQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQzdDLFlBQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsRCxZQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUE7S0FDeEQsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9zcGVjL21haW4tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInXG5cbmRlc2NyaWJlKCdnby1jb25maWcnLCAoKSA9PiB7XG4gIGxldCBnb2NvbmZpZ01haW4gPSBudWxsXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZW52aXJvbm1lbnQnKVxuICAgIH0pXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZ28tY29uZmlnJykudGhlbigocGFjaykgPT4ge1xuICAgICAgICBnb2NvbmZpZ01haW4gPSBwYWNrLm1haW5Nb2R1bGVcbiAgICAgIH0pXG4gICAgfSlcbiAgICB3YWl0c0ZvcigoKSA9PiB7IHJldHVybiBnb2NvbmZpZ01haW4ucmVhZHkoKSB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBnby1jb25maWcgcGFja2FnZSBpcyBhY3RpdmF0ZWQnLCAoKSA9PiB7XG4gICAgaXQoJ21hbmFnZXMgc3Vic2NyaXB0aW9ucycsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4pLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uc3Vic2NyaXB0aW9ucykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5zdWJzY3JpcHRpb25zKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuXG4gICAgaXQoJ2Rpc3Bvc2VzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4pLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uc3Vic2NyaXB0aW9ucykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5zdWJzY3JpcHRpb25zKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZW52aXJvbm1lbnQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZW52aXJvbm1lbnQpLnRvQmVUcnV0aHkoKVxuICAgICAgZ29jb25maWdNYWluLmdldExvY2F0b3IoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5sb2NhdG9yKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmxvY2F0b3IpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBnb2NvbmZpZ01haW4uZGlzcG9zZSgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLnN1YnNjcmlwdGlvbnMpLnRvQmVGYWxzeSgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmVudmlyb25tZW50KS50b0JlRmFsc3koKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5sb2NhdG9yKS50b0JlRmFsc3koKVxuXG4gICAgICBnb2NvbmZpZ01haW4uYWN0aXZhdGUoKVxuICAgIH0pXG5cbiAgICBpdCgnZ2V0cyBhIExvY2F0b3InLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmdldExvY2F0b3IpLnRvQmVEZWZpbmVkKClcbiAgICAgIGxldCBsb2NhdG9yID0gZ29jb25maWdNYWluLmdldExvY2F0b3IoKVxuICAgICAgZXhwZWN0KGxvY2F0b3IpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChsb2NhdG9yKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuXG4gICAgaXQoJ2dldHMgYW4gZXhlY3V0b3InLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmdldEV4ZWN1dG9yKS50b0JlRGVmaW5lZCgpXG4gICAgICBsZXQgZXhlY3V0b3IgPSBnb2NvbmZpZ01haW4uZ2V0RXhlY3V0b3IoKVxuICAgICAgZXhwZWN0KGV4ZWN1dG9yKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZXhlY3V0b3IpLnRvQmVUcnV0aHkoKVxuICAgIH0pXG5cbiAgICBpdCgnaXMgcmVhZHknLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLnJlYWR5KS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLnJlYWR5KCkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Byb3ZpZGVzIGEgc2VydmljZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4ucHJvdmlkZSkudG9CZURlZmluZWQoKVxuICAgICAgbGV0IHByb3ZpZGVyID0gZ29jb25maWdNYWluLnByb3ZpZGUoKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChwcm92aWRlci5leGVjdXRvcikudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QocHJvdmlkZXIubG9jYXRvcikudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QocHJvdmlkZXIubG9jYXRvci5ydW50aW1lcykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyLmxvY2F0b3IucnVudGltZSkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyLmxvY2F0b3IuZ29wYXRoKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvdmlkZXIubG9jYXRvci5maW5kVG9vbCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyLmxvY2F0b3IucnVudGltZUNhbmRpZGF0ZXMpLm5vdC50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvdmlkZXIuZW52aXJvbm1lbnQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChwcm92aWRlci5lbnZpcm9ubWVudCgpKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBlbnZpcm9ubWVudCBpcyBub3QgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgIGxldCBlID0gbnVsbFxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZSA9IGdvY29uZmlnTWFpbi5lbnZpcm9ubWVudFxuICAgICAgZ29jb25maWdNYWluLmVudmlyb25tZW50ID0gbnVsbFxuICAgIH0pXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIGdvY29uZmlnTWFpbi5lbnZpcm9ubWVudCA9IGVcbiAgICB9KVxuXG4gICAgaXQoJ2lzIG5vdCByZWFkeSBmb3IgQXRvbSA8IDEuNy4wJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5yZWFkeSkudG9CZURlZmluZWQoKVxuICAgICAgaWYgKHNlbXZlci5zYXRpc2ZpZXMoc2VtdmVyLm1ham9yKGF0b20uYXBwVmVyc2lvbikgKyAnLicgKyBzZW12ZXIubWlub3IoYXRvbS5hcHBWZXJzaW9uKSArICcuJyArIHNlbXZlci5wYXRjaChhdG9tLmFwcFZlcnNpb24pLCAnPDEuNy4wJykpIHtcbiAgICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5yZWFkeSgpKS50b0JlKGZhbHNlKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0aGUgcHJvY2VzcyBlbnZpcm9ubWVudCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZW52aXJvbm1lbnQpLnRvQmVGYWxzeSgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmdldEVudmlyb25tZW50KS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmdldEVudmlyb25tZW50KCkpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5nZXRFbnZpcm9ubWVudCgpKS50b0JlKHByb2Nlc3MuZW52KVxuICAgIH0pXG5cbiAgICBpdCgnY29uc3VtZXMgYW4gZW52aXJvbm1lbnQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmVudmlyb25tZW50KS50b0JlRmFsc3koKVxuICAgICAgZ29jb25maWdNYWluLmNvbnN1bWVFbnZpcm9ubWVudCh7UElORzogJ1BPTkcnfSlcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZW52aXJvbm1lbnQpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5lbnZpcm9ubWVudC5QSU5HKS50b0JlKCdQT05HJylcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZW52aXJvbm1lbnQuUE9ORykubm90LnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-config/spec/main-spec.js
