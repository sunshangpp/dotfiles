Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _gocodeprovider = require('./gocodeprovider');

'use babel';

exports['default'] = {
  goconfig: null,
  goget: null,
  provider: null,
  subscriptions: null,
  dependenciesInstalled: null,
  toolCheckComplete: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('autocomplete-go').then(function () {
      _this.dependenciesInstalled = true;
    })['catch'](function (e) {
      console.log(e);
    });
  },

  deactivate: function deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.goconfig = null;
    this.goget = null;
    this.provider = null;
    this.dependenciesInstalled = null;
    this.toolCheckComplete = null;
  },

  provide: function provide() {
    return this.getProvider();
  },

  getProvider: function getProvider() {
    var _this2 = this;

    if (this.provider) {
      return this.provider;
    }
    this.provider = new _gocodeprovider.GocodeProvider(function () {
      return _this2.getGoconfig();
    }, function () {
      return _this2.getGoget();
    });
    this.subscriptions.add(this.provider);
    return this.provider;
  },

  getGoconfig: function getGoconfig() {
    if (this.goconfig) {
      return this.goconfig;
    }
    return false;
  },

  consumeGoconfig: function consumeGoconfig(service) {
    this.goconfig = service;
    this.checkForGocode();
  },

  getGoget: function getGoget() {
    if (this.goget) {
      return this.goget;
    }
    return false;
  },

  consumeGoget: function consumeGoget(service) {
    this.goget = service;
    this.checkForGocode();
  },

  checkForGocode: function checkForGocode() {
    var _this3 = this;

    if (!this.toolCheckComplete && this.goconfig && this.goget) {
      this.goconfig.locator.findTool('gocode').then(function (cmd) {
        if (!cmd) {
          _this3.toolCheckComplete = true;
          _this3.goget.get({
            name: 'autocomplete-go',
            packageName: 'gocode',
            packagePath: 'github.com/nsf/gocode',
            type: 'missing'
          }).then(function (r) {
            if (!r.success) {
              console.log('gocode is not available and could not be installed via "go get -u github.com/nsf/gocode"; please manually install it to enable autocomplete behavior.');
            }
          })['catch'](function (e) {
            console.log(e);
          });
        }
      });
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1nby9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVrQyxNQUFNOzs4QkFDWCxrQkFBa0I7O0FBSC9DLFdBQVcsQ0FBQTs7cUJBS0k7QUFDYixVQUFRLEVBQUUsSUFBSTtBQUNkLE9BQUssRUFBRSxJQUFJO0FBQ1gsVUFBUSxFQUFFLElBQUk7QUFDZCxlQUFhLEVBQUUsSUFBSTtBQUNuQix1QkFBcUIsRUFBRSxJQUFJO0FBQzNCLG1CQUFpQixFQUFFLElBQUk7O0FBRXZCLFVBQVEsRUFBQyxvQkFBRzs7O0FBQ1YsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNqRSxZQUFLLHFCQUFxQixHQUFHLElBQUksQ0FBQTtLQUNsQyxDQUFDLFNBQU0sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNkLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDZixDQUFDLENBQUE7R0FDSDs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3QjtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7QUFDakMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQTtHQUM5Qjs7QUFFRCxTQUFPLEVBQUMsbUJBQUc7QUFDVCxXQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtHQUMxQjs7QUFFRCxhQUFXLEVBQUMsdUJBQUc7OztBQUNiLFFBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7QUFDRCxRQUFJLENBQUMsUUFBUSxHQUFHLG1DQUNkLFlBQU07QUFBRSxhQUFPLE9BQUssV0FBVyxFQUFFLENBQUE7S0FBRSxFQUNuQyxZQUFNO0FBQUUsYUFBTyxPQUFLLFFBQVEsRUFBRSxDQUFBO0tBQUUsQ0FDakMsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7R0FDckI7O0FBRUQsYUFBVyxFQUFDLHVCQUFHO0FBQ2IsUUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtLQUNyQjtBQUNELFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQsaUJBQWUsRUFBQyx5QkFBQyxPQUFPLEVBQUU7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUE7QUFDdkIsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO0dBQ3RCOztBQUVELFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtLQUNsQjtBQUNELFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQsY0FBWSxFQUFDLHNCQUFDLE9BQU8sRUFBRTtBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQTtBQUNwQixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7R0FDdEI7O0FBRUQsZ0JBQWMsRUFBQywwQkFBRzs7O0FBQ2hCLFFBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzFELFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDckQsWUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLGlCQUFLLGlCQUFpQixHQUFHLElBQUksQ0FBQTtBQUM3QixpQkFBSyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ2IsZ0JBQUksRUFBRSxpQkFBaUI7QUFDdkIsdUJBQVcsRUFBRSxRQUFRO0FBQ3JCLHVCQUFXLEVBQUUsdUJBQXVCO0FBQ3BDLGdCQUFJLEVBQUUsU0FBUztXQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2IsZ0JBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0FBQ2QscUJBQU8sQ0FBQyxHQUFHLENBQUMsdUpBQXVKLENBQUMsQ0FBQTthQUNySztXQUNGLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsbUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7V0FDZixDQUFDLENBQUE7U0FDSDtPQUNGLENBQUMsQ0FBQTtLQUNIO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZ28vbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge0dvY29kZVByb3ZpZGVyfSBmcm9tICcuL2dvY29kZXByb3ZpZGVyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdvY29uZmlnOiBudWxsLFxuICBnb2dldDogbnVsbCxcbiAgcHJvdmlkZXI6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIGRlcGVuZGVuY2llc0luc3RhbGxlZDogbnVsbCxcbiAgdG9vbENoZWNrQ29tcGxldGU6IG51bGwsXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2F1dG9jb21wbGV0ZS1nbycpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvY29uZmlnID0gbnVsbFxuICAgIHRoaXMuZ29nZXQgPSBudWxsXG4gICAgdGhpcy5wcm92aWRlciA9IG51bGxcbiAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IG51bGxcbiAgICB0aGlzLnRvb2xDaGVja0NvbXBsZXRlID0gbnVsbFxuICB9LFxuXG4gIHByb3ZpZGUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFByb3ZpZGVyKClcbiAgfSxcblxuICBnZXRQcm92aWRlciAoKSB7XG4gICAgaWYgKHRoaXMucHJvdmlkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXG4gICAgfVxuICAgIHRoaXMucHJvdmlkZXIgPSBuZXcgR29jb2RlUHJvdmlkZXIoXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldEdvY29uZmlnKCkgfSxcbiAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0R29nZXQoKSB9XG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5wcm92aWRlcilcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxuICB9LFxuXG4gIGdldEdvY29uZmlnICgpIHtcbiAgICBpZiAodGhpcy5nb2NvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ29jb25maWdcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgY29uc3VtZUdvY29uZmlnIChzZXJ2aWNlKSB7XG4gICAgdGhpcy5nb2NvbmZpZyA9IHNlcnZpY2VcbiAgICB0aGlzLmNoZWNrRm9yR29jb2RlKClcbiAgfSxcblxuICBnZXRHb2dldCAoKSB7XG4gICAgaWYgKHRoaXMuZ29nZXQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvZ2V0XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGNvbnN1bWVHb2dldCAoc2VydmljZSkge1xuICAgIHRoaXMuZ29nZXQgPSBzZXJ2aWNlXG4gICAgdGhpcy5jaGVja0ZvckdvY29kZSgpXG4gIH0sXG5cbiAgY2hlY2tGb3JHb2NvZGUgKCkge1xuICAgIGlmICghdGhpcy50b29sQ2hlY2tDb21wbGV0ZSAmJiB0aGlzLmdvY29uZmlnICYmIHRoaXMuZ29nZXQpIHtcbiAgICAgIHRoaXMuZ29jb25maWcubG9jYXRvci5maW5kVG9vbCgnZ29jb2RlJykudGhlbigoY21kKSA9PiB7XG4gICAgICAgIGlmICghY21kKSB7XG4gICAgICAgICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IHRydWVcbiAgICAgICAgICB0aGlzLmdvZ2V0LmdldCh7XG4gICAgICAgICAgICBuYW1lOiAnYXV0b2NvbXBsZXRlLWdvJyxcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lOiAnZ29jb2RlJyxcbiAgICAgICAgICAgIHBhY2thZ2VQYXRoOiAnZ2l0aHViLmNvbS9uc2YvZ29jb2RlJyxcbiAgICAgICAgICAgIHR5cGU6ICdtaXNzaW5nJ1xuICAgICAgICAgIH0pLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICAgIGlmICghci5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnb2NvZGUgaXMgbm90IGF2YWlsYWJsZSBhbmQgY291bGQgbm90IGJlIGluc3RhbGxlZCB2aWEgXCJnbyBnZXQgLXUgZ2l0aHViLmNvbS9uc2YvZ29jb2RlXCI7IHBsZWFzZSBtYW51YWxseSBpbnN0YWxsIGl0IHRvIGVuYWJsZSBhdXRvY29tcGxldGUgYmVoYXZpb3IuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/autocomplete-go/lib/main.js
