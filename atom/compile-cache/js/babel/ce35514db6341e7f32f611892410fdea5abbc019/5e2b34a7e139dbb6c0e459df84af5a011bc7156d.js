Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _linter = require('./linter');

'use babel';

exports['default'] = {
  dependenciesInstalled: null,
  goget: null,
  goconfig: null,
  linter: null,
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('gometalinter-linter').then(function () {
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
    this.goget = null;
    this.goconfig = null;
    this.linter = null;
    this.dependenciesInstalled = null;
  },

  provide: function provide() {
    var linter = this.getLinter();
    return linter;
  },

  getLinter: function getLinter() {
    var _this2 = this;

    if (this.linter) {
      return this.linter;
    }
    this.linter = new _linter.GometalinterLinter(function () {
      return _this2.getGoconfig();
    }, function () {
      return _this2.getGoget();
    });
    this.subscriptions.add(this.linter);
    return this.linter;
  },

  getGoconfig: function getGoconfig() {
    if (this.goconfig) {
      return this.goconfig;
    }
    return false;
  },

  getGoget: function getGoget() {
    if (this.goget) {
      return this.goget;
    }
    return false;
  },

  consumeGoconfig: function consumeGoconfig(service) {
    this.goconfig = service;
  },

  consumeGoget: function consumeGoget(service) {
    this.goget = service;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvbWV0YWxpbnRlci1saW50ZXIvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFa0MsTUFBTTs7c0JBQ1AsVUFBVTs7QUFIM0MsV0FBVyxDQUFBOztxQkFLSTtBQUNiLHVCQUFxQixFQUFFLElBQUk7QUFDM0IsT0FBSyxFQUFFLElBQUk7QUFDWCxVQUFRLEVBQUUsSUFBSTtBQUNkLFFBQU0sRUFBRSxJQUFJO0FBQ1osZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBQyxvQkFBRzs7O0FBQ1YsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNyRSxZQUFLLHFCQUFxQixHQUFHLElBQUksQ0FBQTtBQUNqQyxhQUFPLE1BQUsscUJBQXFCLENBQUE7S0FDbEMsQ0FBQyxTQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2YsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7QUFDRCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0dBQ2xDOztBQUVELFNBQU8sRUFBQyxtQkFBRztBQUNULFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUM3QixXQUFPLE1BQU0sQ0FBQTtHQUNkOztBQUVELFdBQVMsRUFBQyxxQkFBRzs7O0FBQ1gsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25CO0FBQ0QsUUFBSSxDQUFDLE1BQU0sR0FBRywrQkFDWixZQUFNO0FBQUUsYUFBTyxPQUFLLFdBQVcsRUFBRSxDQUFBO0tBQUUsRUFDbkMsWUFBTTtBQUFFLGFBQU8sT0FBSyxRQUFRLEVBQUUsQ0FBQTtLQUFFLENBQ2pDLENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkMsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0dBQ25COztBQUVELGFBQVcsRUFBQyx1QkFBRztBQUNiLFFBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtLQUNsQjtBQUNELFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQsaUJBQWUsRUFBQyx5QkFBQyxPQUFPLEVBQUU7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUE7R0FDeEI7O0FBRUQsY0FBWSxFQUFDLHNCQUFDLE9BQU8sRUFBRTtBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQTtHQUNyQjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvbWV0YWxpbnRlci1saW50ZXIvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge0dvbWV0YWxpbnRlckxpbnRlcn0gZnJvbSAnLi9saW50ZXInXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGVwZW5kZW5jaWVzSW5zdGFsbGVkOiBudWxsLFxuICBnb2dldDogbnVsbCxcbiAgZ29jb25maWc6IG51bGwsXG4gIGxpbnRlcjogbnVsbCxcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnZ29tZXRhbGludGVyLWxpbnRlcicpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgICByZXR1cm4gdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWRcbiAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29nZXQgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgICB0aGlzLmxpbnRlciA9IG51bGxcbiAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IG51bGxcbiAgfSxcblxuICBwcm92aWRlICgpIHtcbiAgICBsZXQgbGludGVyID0gdGhpcy5nZXRMaW50ZXIoKVxuICAgIHJldHVybiBsaW50ZXJcbiAgfSxcblxuICBnZXRMaW50ZXIgKCkge1xuICAgIGlmICh0aGlzLmxpbnRlcikge1xuICAgICAgcmV0dXJuIHRoaXMubGludGVyXG4gICAgfVxuICAgIHRoaXMubGludGVyID0gbmV3IEdvbWV0YWxpbnRlckxpbnRlcihcbiAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0R29jb25maWcoKSB9LFxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRHb2dldCgpIH1cbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmxpbnRlcilcbiAgICByZXR1cm4gdGhpcy5saW50ZXJcbiAgfSxcblxuICBnZXRHb2NvbmZpZyAoKSB7XG4gICAgaWYgKHRoaXMuZ29jb25maWcpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvY29uZmlnXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGdldEdvZ2V0ICgpIHtcbiAgICBpZiAodGhpcy5nb2dldCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ29nZXRcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgY29uc3VtZUdvY29uZmlnIChzZXJ2aWNlKSB7XG4gICAgdGhpcy5nb2NvbmZpZyA9IHNlcnZpY2VcbiAgfSxcblxuICBjb25zdW1lR29nZXQgKHNlcnZpY2UpIHtcbiAgICB0aGlzLmdvZ2V0ID0gc2VydmljZVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/gometalinter-linter/lib/main.js
