Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _manager = require('./manager');

'use babel';

exports['default'] = {
  dependenciesInstalled: null,
  goconfig: null,
  manager: null,
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('go-get').then(function () {
      _this.dependenciesInstalled = true;
    })['catch'](function (e) {
      console.log(e);
    });
    this.getManager();
  },

  deactivate: function deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.goconfig = null;
    this.manager = null;
    this.dependenciesInstalled = null;
  },

  provide: function provide() {
    return this.getProvider();
  },

  getManager: function getManager() {
    var _this2 = this;

    if (this.manager) {
      return this.manager;
    }
    this.manager = new _manager.Manager(function () {
      return _this2.getGoconfig();
    });
    this.subscriptions.add(this.manager);
    return this.manager;
  },

  getProvider: function getProvider() {
    var _this3 = this;

    return {
      get: function get(options) {
        return _this3.getManager().get(options);
      },
      check: function check(options) {
        return _this3.getManager().check(options);
      }
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWdldC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVrQyxNQUFNOzt1QkFDbEIsV0FBVzs7QUFIakMsV0FBVyxDQUFBOztxQkFLSTtBQUNiLHVCQUFxQixFQUFFLElBQUk7QUFDM0IsVUFBUSxFQUFFLElBQUk7QUFDZCxTQUFPLEVBQUUsSUFBSTtBQUNiLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUMsb0JBQUc7OztBQUNWLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3hELFlBQUsscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0tBQ2xDLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNmLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtHQUNsQjs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3QjtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7R0FDbEM7O0FBRUQsU0FBTyxFQUFDLG1CQUFHO0FBQ1QsV0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7R0FDMUI7O0FBRUQsWUFBVSxFQUFDLHNCQUFHOzs7QUFDWixRQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0tBQ3BCO0FBQ0QsUUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBWSxZQUFNO0FBQUUsYUFBTyxPQUFLLFdBQVcsRUFBRSxDQUFBO0tBQUUsQ0FBQyxDQUFBO0FBQy9ELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxXQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7R0FDcEI7O0FBRUQsYUFBVyxFQUFDLHVCQUFHOzs7QUFDYixXQUFPO0FBQ0wsU0FBRyxFQUFFLGFBQUMsT0FBTyxFQUFLO0FBQ2hCLGVBQU8sT0FBSyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDdEM7QUFDRCxXQUFLLEVBQUUsZUFBQyxPQUFPLEVBQUs7QUFDbEIsZUFBTyxPQUFLLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUN4QztLQUNGLENBQUE7R0FDRjs7QUFFRCxhQUFXLEVBQUMsdUJBQUc7QUFDYixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7QUFFRCxpQkFBZSxFQUFDLHlCQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQTtHQUN4QjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWdldC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7TWFuYWdlcn0gZnJvbSAnLi9tYW5hZ2VyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRlcGVuZGVuY2llc0luc3RhbGxlZDogbnVsbCxcbiAgZ29jb25maWc6IG51bGwsXG4gIG1hbmFnZXI6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2dvLWdldCcpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSlcbiAgICB0aGlzLmdldE1hbmFnZXIoKVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gICAgdGhpcy5tYW5hZ2VyID0gbnVsbFxuICAgIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkID0gbnVsbFxuICB9LFxuXG4gIHByb3ZpZGUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFByb3ZpZGVyKClcbiAgfSxcblxuICBnZXRNYW5hZ2VyICgpIHtcbiAgICBpZiAodGhpcy5tYW5hZ2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyXG4gICAgfVxuICAgIHRoaXMubWFuYWdlciA9IG5ldyBNYW5hZ2VyKCgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0R29jb25maWcoKSB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5tYW5hZ2VyKVxuICAgIHJldHVybiB0aGlzLm1hbmFnZXJcbiAgfSxcblxuICBnZXRQcm92aWRlciAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldDogKG9wdGlvbnMpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFuYWdlcigpLmdldChvcHRpb25zKVxuICAgICAgfSxcbiAgICAgIGNoZWNrOiAob3B0aW9ucykgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYW5hZ2VyKCkuY2hlY2sob3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZ2V0R29jb25maWcgKCkge1xuICAgIGlmICh0aGlzLmdvY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2NvbmZpZ1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBjb25zdW1lR29jb25maWcgKHNlcnZpY2UpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gc2VydmljZVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-get/lib/main.js
