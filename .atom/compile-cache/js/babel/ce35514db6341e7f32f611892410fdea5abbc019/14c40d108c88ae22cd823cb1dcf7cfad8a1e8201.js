Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _godef = require('./godef');

'use babel';

exports['default'] = {
  dependenciesInstalled: null,
  goconfig: null,
  goget: null,
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('navigator-godef').then(function () {
      _this.dependenciesInstalled = true;
      return _this.dependenciesInstalled;
    })['catch'](function (e) {
      console.log(e);
    });
    this.godef = new _godef.Godef(function () {
      return _this.getGoconfig();
    }, function () {
      return _this.getGoget();
    });
    this.subscriptions.add(this.godef);
  },

  deactivate: function deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.goget = null;
    this.goconfig = null;
    this.godef = null;
    this.dependenciesInstalled = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL25hdmlnYXRvci1nb2RlZi9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVrQyxNQUFNOztxQkFDcEIsU0FBUzs7QUFIN0IsV0FBVyxDQUFBOztxQkFLSTtBQUNiLHVCQUFxQixFQUFFLElBQUk7QUFDM0IsVUFBUSxFQUFFLElBQUk7QUFDZCxPQUFLLEVBQUUsSUFBSTtBQUNYLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUMsb0JBQUc7OztBQUNWLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDakUsWUFBSyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7QUFDakMsYUFBTyxNQUFLLHFCQUFxQixDQUFBO0tBQ2xDLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNmLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxLQUFLLEdBQUcsaUJBQ1gsWUFBTTtBQUFFLGFBQU8sTUFBSyxXQUFXLEVBQUUsQ0FBQTtLQUFFLEVBQ25DLFlBQU07QUFBRSxhQUFPLE1BQUssUUFBUSxFQUFFLENBQUE7S0FBRSxDQUNqQyxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ25DOztBQUVELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtHQUNsQzs7QUFFRCxhQUFXLEVBQUMsdUJBQUc7QUFDYixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7QUFFRCxVQUFRLEVBQUMsb0JBQUc7QUFDVixRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7S0FDbEI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELGlCQUFlLEVBQUMseUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO0dBQ3hCOztBQUVELGNBQVksRUFBQyxzQkFBQyxPQUFPLEVBQUU7QUFDckIsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUE7R0FDckI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9uYXZpZ2F0b3ItZ29kZWYvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge0dvZGVmfSBmcm9tICcuL2dvZGVmJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRlcGVuZGVuY2llc0luc3RhbGxlZDogbnVsbCxcbiAgZ29jb25maWc6IG51bGwsXG4gIGdvZ2V0OiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCduYXZpZ2F0b3ItZ29kZWYnKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSlcbiAgICB0aGlzLmdvZGVmID0gbmV3IEdvZGVmKFxuICAgICAgKCkgPT4geyByZXR1cm4gdGhpcy5nZXRHb2NvbmZpZygpIH0sXG4gICAgICAoKSA9PiB7IHJldHVybiB0aGlzLmdldEdvZ2V0KCkgfVxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZ29kZWYpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5nb2dldCA9IG51bGxcbiAgICB0aGlzLmdvY29uZmlnID0gbnVsbFxuICAgIHRoaXMuZ29kZWYgPSBudWxsXG4gICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSBudWxsXG4gIH0sXG5cbiAgZ2V0R29jb25maWcgKCkge1xuICAgIGlmICh0aGlzLmdvY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2NvbmZpZ1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBnZXRHb2dldCAoKSB7XG4gICAgaWYgKHRoaXMuZ29nZXQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdvZ2V0XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGNvbnN1bWVHb2NvbmZpZyAoc2VydmljZSkge1xuICAgIHRoaXMuZ29jb25maWcgPSBzZXJ2aWNlXG4gIH0sXG5cbiAgY29uc3VtZUdvZ2V0IChzZXJ2aWNlKSB7XG4gICAgdGhpcy5nb2dldCA9IHNlcnZpY2VcbiAgfVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/navigator-godef/lib/main.js
