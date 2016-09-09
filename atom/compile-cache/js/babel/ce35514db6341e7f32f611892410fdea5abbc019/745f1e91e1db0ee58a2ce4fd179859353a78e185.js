'use babel';

describe('go-get', function () {
  var mainModule = null;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('go-config').then(function () {
        return atom.packages.activatePackage('go-get');
      }).then(function (pack) {
        mainModule = pack.mainModule;
      });
    });

    waitsFor(function () {
      return mainModule.getGoconfig();
    });
  });

  describe('when the go-get package is activated', function () {
    it('activates successfully', function () {
      expect(mainModule).toBeDefined();
      expect(mainModule).toBeTruthy();
      expect(mainModule.getProvider).toBeDefined();
      expect(mainModule.getGoconfig).toBeDefined();
      expect(mainModule.consumeGoconfig).toBeDefined();
      expect(mainModule.getGoconfig()).toBeTruthy();
      expect(mainModule.getProvider()).toBeTruthy();
      expect(mainModule.getProvider().get).toBeDefined();
      expect(mainModule.getProvider().check).toBeDefined();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWdldC9zcGVjL21haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7O0FBRVgsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFNO0FBQ3ZCLE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQTs7QUFFckIsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMzRCxlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQy9DLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDaEIsa0JBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFBO09BQzdCLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTs7QUFFRixZQUFRLENBQUMsWUFBTTtBQUNiLGFBQU8sVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQ2hDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsc0NBQXNDLEVBQUUsWUFBTTtBQUNyRCxNQUFFLENBQUMsd0JBQXdCLEVBQUUsWUFBTTtBQUNqQyxZQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDaEMsWUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQy9CLFlBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDNUMsWUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUM1QyxZQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2hELFlBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUM3QyxZQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDN0MsWUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsRCxZQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQ3JELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1nZXQvc3BlYy9tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5kZXNjcmliZSgnZ28tZ2V0JywgKCkgPT4ge1xuICBsZXQgbWFpbk1vZHVsZSA9IG51bGxcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdnby1jb25maWcnKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdnby1nZXQnKVxuICAgICAgfSkudGhlbigocGFjaykgPT4ge1xuICAgICAgICBtYWluTW9kdWxlID0gcGFjay5tYWluTW9kdWxlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gbWFpbk1vZHVsZS5nZXRHb2NvbmZpZygpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgZ28tZ2V0IHBhY2thZ2UgaXMgYWN0aXZhdGVkJywgKCkgPT4ge1xuICAgIGl0KCdhY3RpdmF0ZXMgc3VjY2Vzc2Z1bGx5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmdldFByb3ZpZGVyKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobWFpbk1vZHVsZS5nZXRHb2NvbmZpZykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUuY29uc3VtZUdvY29uZmlnKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobWFpbk1vZHVsZS5nZXRHb2NvbmZpZygpKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmdldFByb3ZpZGVyKCkpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUuZ2V0UHJvdmlkZXIoKS5nZXQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmdldFByb3ZpZGVyKCkuY2hlY2spLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-get/spec/main-spec.js