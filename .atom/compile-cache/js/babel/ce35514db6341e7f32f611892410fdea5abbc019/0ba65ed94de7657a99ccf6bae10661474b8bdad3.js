'use babel';
/* eslint-env jasmine */

describe('builder-go', function () {
  var mainModule = null;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('go-config').then(function () {
        return atom.packages.activatePackage('builder-go');
      }).then(function (pack) {
        mainModule = pack.mainModule;
      });
    });

    waitsFor(function () {
      return mainModule.getGoconfig() !== false;
    });
  });

  describe('when the builder-go package is activated', function () {
    it('activates successfully', function () {
      expect(mainModule).toBeDefined();
      expect(mainModule).toBeTruthy();
      expect(mainModule.getBuilder).toBeDefined();
      expect(mainModule.getGoconfig).toBeDefined();
      expect(mainModule.consumeGoconfig).toBeDefined();
      expect(mainModule.getGoconfig()).toBeTruthy();
      expect(mainModule.getBuilder()).toBeTruthy();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2J1aWxkZXItZ28vc3BlYy9tYWluLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7QUFHWCxRQUFRLENBQUMsWUFBWSxFQUFFLFlBQU07QUFDM0IsTUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFBOztBQUVyQixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzNELGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUE7T0FDbkQsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNoQixrQkFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7T0FDN0IsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBOztBQUVGLFlBQVEsQ0FBQyxZQUFNO0FBQ2IsYUFBTyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxDQUFBO0tBQzFDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsMENBQTBDLEVBQUUsWUFBTTtBQUN6RCxNQUFFLENBQUMsd0JBQXdCLEVBQUUsWUFBTTtBQUNqQyxZQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDaEMsWUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQy9CLFlBQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDM0MsWUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUM1QyxZQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2hELFlBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUM3QyxZQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDN0MsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2J1aWxkZXItZ28vc3BlYy9tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmRlc2NyaWJlKCdidWlsZGVyLWdvJywgKCkgPT4ge1xuICBsZXQgbWFpbk1vZHVsZSA9IG51bGxcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdnby1jb25maWcnKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdidWlsZGVyLWdvJylcbiAgICAgIH0pLnRoZW4oKHBhY2spID0+IHtcbiAgICAgICAgbWFpbk1vZHVsZSA9IHBhY2subWFpbk1vZHVsZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuIG1haW5Nb2R1bGUuZ2V0R29jb25maWcoKSAhPT0gZmFsc2VcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBidWlsZGVyLWdvIHBhY2thZ2UgaXMgYWN0aXZhdGVkJywgKCkgPT4ge1xuICAgIGl0KCdhY3RpdmF0ZXMgc3VjY2Vzc2Z1bGx5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmdldEJ1aWxkZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmdldEdvY29uZmlnKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobWFpbk1vZHVsZS5jb25zdW1lR29jb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtYWluTW9kdWxlLmdldEdvY29uZmlnKCkpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KG1haW5Nb2R1bGUuZ2V0QnVpbGRlcigpKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/builder-go/spec/main-spec.js
