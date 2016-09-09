Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _godoc = require('./godoc');

'use babel';

exports['default'] = {
  subscriptions: null,
  dependenciesInstalled: null,
  goconfig: null,
  goget: null,
  godoc: null,

  activate: function activate() {
    var _this = this;

    this.godoc = new _godoc.Godoc(function () {
      return _this.getGoconfig();
    }, function () {
      return _this.getGoget();
    });
    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('godoc').then(function () {
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
    this.godoc = null;
    this.goconfig = null;
    this.goget = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZG9jL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRWtDLE1BQU07O3FCQUNwQixTQUFTOztBQUg3QixXQUFXLENBQUE7O3FCQUtJO0FBQ2IsZUFBYSxFQUFFLElBQUk7QUFDbkIsdUJBQXFCLEVBQUUsSUFBSTtBQUMzQixVQUFRLEVBQUUsSUFBSTtBQUNkLE9BQUssRUFBRSxJQUFJO0FBQ1gsT0FBSyxFQUFFLElBQUk7O0FBRVgsVUFBUSxFQUFDLG9CQUFHOzs7QUFDVixRQUFJLENBQUMsS0FBSyxHQUFHLGlCQUNYLFlBQU07QUFBRSxhQUFPLE1BQUssV0FBVyxFQUFFLENBQUE7S0FBRSxFQUNuQyxZQUFNO0FBQUUsYUFBTyxNQUFLLFFBQVEsRUFBRSxDQUFBO0tBQUUsQ0FDakMsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3ZELFlBQUsscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0tBQ2xDLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNmLENBQUMsQ0FBQTtHQUNIOztBQUVELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtHQUNsQzs7QUFFRCxhQUFXLEVBQUMsdUJBQUc7QUFDYixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7QUFFRCxpQkFBZSxFQUFDLHlCQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQTtHQUN4Qjs7QUFFRCxVQUFRLEVBQUMsb0JBQUc7QUFDVixRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7S0FDbEI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELGNBQVksRUFBQyxzQkFBQyxPQUFPLEVBQUU7QUFDckIsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUE7R0FDckI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nb2RvYy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7R29kb2N9IGZyb20gJy4vZ29kb2MnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcbiAgZGVwZW5kZW5jaWVzSW5zdGFsbGVkOiBudWxsLFxuICBnb2NvbmZpZzogbnVsbCxcbiAgZ29nZXQ6IG51bGwsXG4gIGdvZG9jOiBudWxsLFxuXG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmdvZG9jID0gbmV3IEdvZG9jKFxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRHb2NvbmZpZygpIH0sXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldEdvZ2V0KCkgfVxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdnb2RvYycpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvZG9jID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gICAgdGhpcy5nb2dldCA9IG51bGxcbiAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IG51bGxcbiAgfSxcblxuICBnZXRHb2NvbmZpZyAoKSB7XG4gICAgaWYgKHRoaXMuZ29jb25maWcpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvY29uZmlnXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGNvbnN1bWVHb2NvbmZpZyAoc2VydmljZSkge1xuICAgIHRoaXMuZ29jb25maWcgPSBzZXJ2aWNlXG4gIH0sXG5cbiAgZ2V0R29nZXQgKCkge1xuICAgIGlmICh0aGlzLmdvZ2V0KSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2dldFxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBjb25zdW1lR29nZXQgKHNlcnZpY2UpIHtcbiAgICB0aGlzLmdvZ2V0ID0gc2VydmljZVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/godoc/lib/main.js
