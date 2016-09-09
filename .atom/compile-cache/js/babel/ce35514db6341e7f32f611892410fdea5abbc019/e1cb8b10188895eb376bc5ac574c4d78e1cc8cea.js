Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _builder = require('./builder');

'use babel';

exports['default'] = {
  dependenciesInstalled: null,
  goconfig: null,
  builder: null,
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('builder-go').then(function () {
      _this.dependenciesInstalled = true;
      return _this.dependenciesInstalled;
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
    this.builder = null;
    this.dependenciesInstalled = null;
  },

  provide: function provide() {
    var builder = this.getBuilder();
    return builder;
  },

  getBuilder: function getBuilder() {
    var _this2 = this;

    if (this.builder) {
      return this.builder;
    }
    this.builder = new _builder.Builder(function () {
      return _this2.getGoconfig();
    });
    this.subscriptions.add(this.builder);
    return this.builder;
  },

  getGoconfig: function getGoconfig() {
    if (this.goconfig) {
      return this.goconfig;
    }
    return false;
  },

  consumeGoconfig: function consumeGoconfig(service) {
    this.goconfig = service;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2J1aWxkZXItZ28vbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFa0MsTUFBTTs7dUJBQ2xCLFdBQVc7O0FBSGpDLFdBQVcsQ0FBQTs7cUJBS0k7QUFDYix1QkFBcUIsRUFBRSxJQUFJO0FBQzNCLFVBQVEsRUFBRSxJQUFJO0FBQ2QsU0FBTyxFQUFFLElBQUk7QUFDYixlQUFhLEVBQUUsSUFBSTs7QUFFbkIsVUFBUSxFQUFDLG9CQUFHOzs7QUFDVixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUM1RCxZQUFLLHFCQUFxQixHQUFHLElBQUksQ0FBQTtBQUNqQyxhQUFPLE1BQUsscUJBQXFCLENBQUE7S0FDbEMsQ0FBQyxTQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2YsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7QUFDRCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0dBQ2xDOztBQUVELFNBQU8sRUFBQyxtQkFBRztBQUNULFFBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMvQixXQUFPLE9BQU8sQ0FBQTtHQUNmOztBQUVELFlBQVUsRUFBQyxzQkFBRzs7O0FBQ1osUUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjtBQUNELFFBQUksQ0FBQyxPQUFPLEdBQUcscUJBQ2IsWUFBTTtBQUFFLGFBQU8sT0FBSyxXQUFXLEVBQUUsQ0FBQTtLQUFFLENBQ3BDLENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsV0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0dBQ3BCOztBQUVELGFBQVcsRUFBQyx1QkFBRztBQUNiLFFBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELGlCQUFlLEVBQUMseUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO0dBQ3hCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvYnVpbGRlci1nby9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7QnVpbGRlcn0gZnJvbSAnLi9idWlsZGVyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRlcGVuZGVuY2llc0luc3RhbGxlZDogbnVsbCxcbiAgZ29jb25maWc6IG51bGwsXG4gIGJ1aWxkZXI6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2J1aWxkZXItZ28nKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvY29uZmlnID0gbnVsbFxuICAgIHRoaXMuYnVpbGRlciA9IG51bGxcbiAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IG51bGxcbiAgfSxcblxuICBwcm92aWRlICgpIHtcbiAgICBsZXQgYnVpbGRlciA9IHRoaXMuZ2V0QnVpbGRlcigpXG4gICAgcmV0dXJuIGJ1aWxkZXJcbiAgfSxcblxuICBnZXRCdWlsZGVyICgpIHtcbiAgICBpZiAodGhpcy5idWlsZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZGVyXG4gICAgfVxuICAgIHRoaXMuYnVpbGRlciA9IG5ldyBCdWlsZGVyKFxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRHb2NvbmZpZygpIH1cbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJ1aWxkZXIpXG4gICAgcmV0dXJuIHRoaXMuYnVpbGRlclxuICB9LFxuXG4gIGdldEdvY29uZmlnICgpIHtcbiAgICBpZiAodGhpcy5nb2NvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ29jb25maWdcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgY29uc3VtZUdvY29uZmlnIChzZXJ2aWNlKSB7XG4gICAgdGhpcy5nb2NvbmZpZyA9IHNlcnZpY2VcbiAgfVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/builder-go/lib/main.js
