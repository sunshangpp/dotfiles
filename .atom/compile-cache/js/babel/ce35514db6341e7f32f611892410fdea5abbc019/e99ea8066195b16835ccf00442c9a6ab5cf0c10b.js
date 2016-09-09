Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _formatter = require('./formatter');

'use babel';

exports['default'] = {
  dependenciesInstalled: null,
  goget: null,
  goconfig: null,
  formatter: null,
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('gofmt').then(function () {
      _this.dependenciesInstalled = true;
      return _this.dependenciesInstalled;
    })['catch'](function (e) {
      console.log(e);
    });
    this.getFormatter();
  },

  deactivate: function deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.goget = null;
    this.goconfig = null;
    this.formatter = null;
    this.dependenciesInstalled = null;
  },

  provide: function provide() {
    return this.getFormatter();
  },

  getFormatter: function getFormatter() {
    var _this2 = this;

    if (this.formatter) {
      return this.formatter;
    }
    this.formatter = new _formatter.Formatter(function () {
      return _this2.getGoconfig();
    }, function () {
      return _this2.getGoget();
    });
    this.subscriptions.add(this.formatter);
    return this.formatter;
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
    this.getFormatter().updateFormatterCache();
  },

  consumeGoget: function consumeGoget(service) {
    this.goget = service;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZm10L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRWtDLE1BQU07O3lCQUNoQixhQUFhOztBQUhyQyxXQUFXLENBQUE7O3FCQUtJO0FBQ2IsdUJBQXFCLEVBQUUsSUFBSTtBQUMzQixPQUFLLEVBQUUsSUFBSTtBQUNYLFVBQVEsRUFBRSxJQUFJO0FBQ2QsV0FBUyxFQUFFLElBQUk7QUFDZixlQUFhLEVBQUUsSUFBSTs7QUFFbkIsVUFBUSxFQUFDLG9CQUFHOzs7QUFDVixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUN2RCxZQUFLLHFCQUFxQixHQUFHLElBQUksQ0FBQTtBQUNqQyxhQUFPLE1BQUsscUJBQXFCLENBQUE7S0FDbEMsQ0FBQyxTQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2YsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0dBQ3BCOztBQUVELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtHQUNsQzs7QUFFRCxTQUFPLEVBQUMsbUJBQUc7QUFDVCxXQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtHQUMzQjs7QUFFRCxjQUFZLEVBQUMsd0JBQUc7OztBQUNkLFFBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7S0FDdEI7QUFDRCxRQUFJLENBQUMsU0FBUyxHQUFHLHlCQUFjLFlBQU07QUFDbkMsYUFBTyxPQUFLLFdBQVcsRUFBRSxDQUFBO0tBQzFCLEVBQUUsWUFBTTtBQUNQLGFBQU8sT0FBSyxRQUFRLEVBQUUsQ0FBQTtLQUN2QixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDdEMsV0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO0dBQ3RCOztBQUVELGFBQVcsRUFBQyx1QkFBRztBQUNiLFFBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtLQUNsQjtBQUNELFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQsaUJBQWUsRUFBQyx5QkFBQyxPQUFPLEVBQUU7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUE7QUFDdkIsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUE7R0FDM0M7O0FBRUQsY0FBWSxFQUFDLHNCQUFDLE9BQU8sRUFBRTtBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQTtHQUNyQjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZm10L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtGb3JtYXR0ZXJ9IGZyb20gJy4vZm9ybWF0dGVyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRlcGVuZGVuY2llc0luc3RhbGxlZDogbnVsbCxcbiAgZ29nZXQ6IG51bGwsXG4gIGdvY29uZmlnOiBudWxsLFxuICBmb3JtYXR0ZXI6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2dvZm10JykudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IHRydWVcbiAgICAgIHJldHVybiB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZFxuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH0pXG4gICAgdGhpcy5nZXRGb3JtYXR0ZXIoKVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29nZXQgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgICB0aGlzLmZvcm1hdHRlciA9IG51bGxcbiAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IG51bGxcbiAgfSxcblxuICBwcm92aWRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGb3JtYXR0ZXIoKVxuICB9LFxuXG4gIGdldEZvcm1hdHRlciAoKSB7XG4gICAgaWYgKHRoaXMuZm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXR0ZXJcbiAgICB9XG4gICAgdGhpcy5mb3JtYXR0ZXIgPSBuZXcgRm9ybWF0dGVyKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldEdvY29uZmlnKClcbiAgICB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRHb2dldCgpXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZm9ybWF0dGVyKVxuICAgIHJldHVybiB0aGlzLmZvcm1hdHRlclxuICB9LFxuXG4gIGdldEdvY29uZmlnICgpIHtcbiAgICBpZiAodGhpcy5nb2NvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ29jb25maWdcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgZ2V0R29nZXQgKCkge1xuICAgIGlmICh0aGlzLmdvZ2V0KSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2dldFxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBjb25zdW1lR29jb25maWcgKHNlcnZpY2UpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gc2VydmljZVxuICAgIHRoaXMuZ2V0Rm9ybWF0dGVyKCkudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKVxuICB9LFxuXG4gIGNvbnN1bWVHb2dldCAoc2VydmljZSkge1xuICAgIHRoaXMuZ29nZXQgPSBzZXJ2aWNlXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/gofmt/lib/main.js
