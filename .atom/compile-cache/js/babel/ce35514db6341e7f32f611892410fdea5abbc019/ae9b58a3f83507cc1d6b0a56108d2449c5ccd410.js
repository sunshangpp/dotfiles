Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _gorename = require('./gorename');

'use babel';

exports['default'] = {
  golangconfig: null,
  subscriptions: null,
  dependenciesInstalled: null,

  activate: function activate() {
    var _this = this;

    this.gorename = new _gorename.Gorename(function () {
      return _this.getGoconfig();
    }, function () {
      return _this.getGoget();
    });
    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('gorename').then(function () {
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
    this.dependenciesInstalled = null;
  },

  getGoconfig: function getGoconfig() {
    if (this.goconfig) {
      return this.goconfig;
    }
    return false;
  },

  consumeGoconfig: function consumeGoconfig(service) {
    this.goconfig = service;
  },

  getGoget: function getGoget() {
    if (this.goget) {
      return this.goget;
    }
    return false;
  },

  consumeGoget: function consumeGoget(service) {
    this.goget = service;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvcmVuYW1lL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRWtDLE1BQU07O3dCQUNqQixZQUFZOztBQUhuQyxXQUFXLENBQUE7O3FCQUtJO0FBQ2IsY0FBWSxFQUFFLElBQUk7QUFDbEIsZUFBYSxFQUFFLElBQUk7QUFDbkIsdUJBQXFCLEVBQUUsSUFBSTs7QUFFM0IsVUFBUSxFQUFDLG9CQUFHOzs7QUFDVixRQUFJLENBQUMsUUFBUSxHQUFHLHVCQUNkLFlBQU07QUFBRSxhQUFPLE1BQUssV0FBVyxFQUFFLENBQUE7S0FBRSxFQUNuQyxZQUFNO0FBQUUsYUFBTyxNQUFLLFFBQVEsRUFBRSxDQUFBO0tBQUUsQ0FDakMsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzFELFlBQUsscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0tBQ2xDLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNmLENBQUMsQ0FBQTtHQUNIOztBQUVELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtHQUNsQzs7QUFFRCxhQUFXLEVBQUMsdUJBQUc7QUFDYixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7QUFFRCxpQkFBZSxFQUFDLHlCQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQTtHQUN4Qjs7QUFFRCxVQUFRLEVBQUMsb0JBQUc7QUFDVixRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7S0FDbEI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELGNBQVksRUFBQyxzQkFBQyxPQUFPLEVBQUU7QUFDckIsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUE7R0FDckI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nb3JlbmFtZS9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7R29yZW5hbWV9IGZyb20gJy4vZ29yZW5hbWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ29sYW5nY29uZmlnOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICBkZXBlbmRlbmNpZXNJbnN0YWxsZWQ6IG51bGwsXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuZ29yZW5hbWUgPSBuZXcgR29yZW5hbWUoXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldEdvY29uZmlnKCkgfSxcbiAgICAgICgpID0+IHsgcmV0dXJuIHRoaXMuZ2V0R29nZXQoKSB9XG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2dvcmVuYW1lJykudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IHRydWVcbiAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSBudWxsXG4gIH0sXG5cbiAgZ2V0R29jb25maWcgKCkge1xuICAgIGlmICh0aGlzLmdvY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2NvbmZpZ1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBjb25zdW1lR29jb25maWcgKHNlcnZpY2UpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gc2VydmljZVxuICB9LFxuXG4gIGdldEdvZ2V0ICgpIHtcbiAgICBpZiAodGhpcy5nb2dldCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ29nZXRcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgY29uc3VtZUdvZ2V0IChzZXJ2aWNlKSB7XG4gICAgdGhpcy5nb2dldCA9IHNlcnZpY2VcbiAgfVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/gorename/lib/main.js
