'use babel';
/* eslint-env jasmine */

describe('go-config', function () {
  var goconfigMain = null;

  beforeEach(function () {
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
      goconfigMain.getLocator();
      expect(goconfigMain.locator).toBeDefined();
      expect(goconfigMain.locator).toBeTruthy();

      goconfigMain.dispose();
      expect(goconfigMain.subscriptions).toBeFalsy();
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
      expect(provider.environment()).toBeTruthy();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9zcGVjL21haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7OztBQUdYLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLFlBQVksR0FBRyxJQUFJLENBQUE7O0FBRXZCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQy9ELG9CQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQTtPQUMvQixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7QUFDRixZQUFRLENBQUMsWUFBTTtBQUFFLGFBQU8sWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQUUsQ0FBQyxDQUFBO0dBQ2hELENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMseUNBQXlDLEVBQUUsWUFBTTtBQUN4RCxNQUFFLENBQUMsdUJBQXVCLEVBQUUsWUFBTTtBQUNoQyxZQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEMsWUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNoRCxZQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ2hELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsb0JBQW9CLEVBQUUsWUFBTTtBQUM3QixZQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEMsWUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNoRCxZQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQy9DLGtC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dXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuZGVzY3JpYmUoJ2dvLWNvbmZpZycsICgpID0+IHtcbiAgbGV0IGdvY29uZmlnTWFpbiA9IG51bGxcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdnby1jb25maWcnKS50aGVuKChwYWNrKSA9PiB7XG4gICAgICAgIGdvY29uZmlnTWFpbiA9IHBhY2subWFpbk1vZHVsZVxuICAgICAgfSlcbiAgICB9KVxuICAgIHdhaXRzRm9yKCgpID0+IHsgcmV0dXJuIGdvY29uZmlnTWFpbi5yZWFkeSgpIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gdGhlIGdvLWNvbmZpZyBwYWNrYWdlIGlzIGFjdGl2YXRlZCcsICgpID0+IHtcbiAgICBpdCgnbWFuYWdlcyBzdWJzY3JpcHRpb25zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5zdWJzY3JpcHRpb25zKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLnN1YnNjcmlwdGlvbnMpLnRvQmVUcnV0aHkoKVxuICAgIH0pXG5cbiAgICBpdCgnZGlzcG9zZXMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5zdWJzY3JpcHRpb25zKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLnN1YnNjcmlwdGlvbnMpLnRvQmVUcnV0aHkoKVxuICAgICAgZ29jb25maWdNYWluLmdldExvY2F0b3IoKVxuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5sb2NhdG9yKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmxvY2F0b3IpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBnb2NvbmZpZ01haW4uZGlzcG9zZSgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLnN1YnNjcmlwdGlvbnMpLnRvQmVGYWxzeSgpXG4gICAgICBleHBlY3QoZ29jb25maWdNYWluLmxvY2F0b3IpLnRvQmVGYWxzeSgpXG5cbiAgICAgIGdvY29uZmlnTWFpbi5hY3RpdmF0ZSgpXG4gICAgfSlcblxuICAgIGl0KCdnZXRzIGEgTG9jYXRvcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZ2V0TG9jYXRvcikudG9CZURlZmluZWQoKVxuICAgICAgbGV0IGxvY2F0b3IgPSBnb2NvbmZpZ01haW4uZ2V0TG9jYXRvcigpXG4gICAgICBleHBlY3QobG9jYXRvcikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGxvY2F0b3IpLnRvQmVUcnV0aHkoKVxuICAgIH0pXG5cbiAgICBpdCgnZ2V0cyBhbiBleGVjdXRvcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4uZ2V0RXhlY3V0b3IpLnRvQmVEZWZpbmVkKClcbiAgICAgIGxldCBleGVjdXRvciA9IGdvY29uZmlnTWFpbi5nZXRFeGVjdXRvcigpXG4gICAgICBleHBlY3QoZXhlY3V0b3IpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChleGVjdXRvcikudG9CZVRydXRoeSgpXG4gICAgfSlcblxuICAgIGl0KCdpcyByZWFkeScsICgpID0+IHtcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4ucmVhZHkpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChnb2NvbmZpZ01haW4ucmVhZHkoKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgncHJvdmlkZXMgYSBzZXJ2aWNlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdvY29uZmlnTWFpbi5wcm92aWRlKS50b0JlRGVmaW5lZCgpXG4gICAgICBsZXQgcHJvdmlkZXIgPSBnb2NvbmZpZ01haW4ucHJvdmlkZSgpXG4gICAgICBleHBlY3QocHJvdmlkZXIpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHByb3ZpZGVyLmV4ZWN1dG9yKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChwcm92aWRlci5sb2NhdG9yKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChwcm92aWRlci5sb2NhdG9yLnJ1bnRpbWVzKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvdmlkZXIubG9jYXRvci5ydW50aW1lKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvdmlkZXIubG9jYXRvci5nb3BhdGgpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChwcm92aWRlci5sb2NhdG9yLmZpbmRUb29sKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvdmlkZXIubG9jYXRvci5ydW50aW1lQ2FuZGlkYXRlcykubm90LnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChwcm92aWRlci5lbnZpcm9ubWVudCgpKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-config/spec/main-spec.js
