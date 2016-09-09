Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _tester = require('./tester');

'use babel';

exports['default'] = {
  dependenciesInstalled: null,
  goget: null,
  goconfig: null,
  tester: null,
  subscriptions: null,
  toolCheckComplete: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    require('atom-package-deps').install('tester-go').then(function () {
      _this.dependenciesInstalled = true;
      return _this.dependenciesInstalled;
    })['catch'](function (e) {
      console.log(e);
    });
    this.getTester();
  },

  deactivate: function deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.goget = null;
    this.goconfig = null;
    this.tester = null;
    this.dependenciesInstalled = null;
    this.toolCheckComplete = null;
  },

  provide: function provide() {
    return this.getTester();
  },

  getTester: function getTester() {
    var _this2 = this;

    if (this.tester) {
      return this.tester;
    }
    this.tester = new _tester.Tester(function () {
      return _this2.getGoconfig();
    }, function () {
      return _this2.getGoget();
    });
    this.subscriptions.add(this.tester);
    return this.tester;
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
    this.checkForTools();
  },

  consumeGoget: function consumeGoget(service) {
    this.goget = service;
    this.checkForTools();
  },

  checkForTools: function checkForTools() {
    var _this3 = this;

    if (!this.toolCheckComplete && this.goconfig && this.goget) {
      var options = { env: this.goconfig.environment() };
      this.goconfig.locator.findTool('cover', options).then(function (cmd) {
        if (!cmd) {
          _this3.toolCheckComplete = true;
          _this3.goget.get({
            name: 'tester-go',
            packageName: 'cover',
            packagePath: 'golang.org/x/tools/cmd/cover',
            type: 'missing'
          }).then(function (r) {
            if (!r.success) {
              console.log('cover is not available and could not be installed via "go get -u golang.org/x/tools/cmd/cover"; please manually install it to enable display of coverage.');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3Rlc3Rlci1nby9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVrQyxNQUFNOztzQkFDbkIsVUFBVTs7QUFIL0IsV0FBVyxDQUFBOztxQkFLSTtBQUNiLHVCQUFxQixFQUFFLElBQUk7QUFDM0IsT0FBSyxFQUFFLElBQUk7QUFDWCxVQUFRLEVBQUUsSUFBSTtBQUNkLFFBQU0sRUFBRSxJQUFJO0FBQ1osZUFBYSxFQUFFLElBQUk7QUFDbkIsbUJBQWlCLEVBQUUsSUFBSTs7QUFFdkIsVUFBUSxFQUFDLG9CQUFHOzs7QUFDVixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMzRCxZQUFLLHFCQUFxQixHQUFHLElBQUksQ0FBQTtBQUNqQyxhQUFPLE1BQUsscUJBQXFCLENBQUE7S0FDbEMsQ0FBQyxTQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2YsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0dBQ2pCOztBQUVELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCO0FBQ0QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtBQUNqQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0dBQzlCOztBQUVELFNBQU8sRUFBQyxtQkFBRztBQUNULFdBQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0dBQ3hCOztBQUVELFdBQVMsRUFBQyxxQkFBRzs7O0FBQ1gsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25CO0FBQ0QsUUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBVyxZQUFNO0FBQzdCLGFBQU8sT0FBSyxXQUFXLEVBQUUsQ0FBQTtLQUMxQixFQUFFLFlBQU07QUFDUCxhQUFPLE9BQUssUUFBUSxFQUFFLENBQUE7S0FDdkIsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25DLFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtHQUNuQjs7QUFFRCxhQUFXLEVBQUMsdUJBQUc7QUFDYixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7QUFFRCxVQUFRLEVBQUMsb0JBQUc7QUFDVixRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7S0FDbEI7QUFDRCxXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELGlCQUFlLEVBQUMseUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtHQUNyQjs7QUFFRCxjQUFZLEVBQUMsc0JBQUMsT0FBTyxFQUFFO0FBQ3JCLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtHQUNyQjs7QUFFRCxlQUFhLEVBQUMseUJBQUc7OztBQUNmLFFBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzFELFVBQUksT0FBTyxHQUFHLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEVBQUMsQ0FBQTtBQUNoRCxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUM3RCxZQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsaUJBQUssaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBQzdCLGlCQUFLLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDYixnQkFBSSxFQUFFLFdBQVc7QUFDakIsdUJBQVcsRUFBRSxPQUFPO0FBQ3BCLHVCQUFXLEVBQUUsOEJBQThCO0FBQzNDLGdCQUFJLEVBQUUsU0FBUztXQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2IsZ0JBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0FBQ2QscUJBQU8sQ0FBQyxHQUFHLENBQUMsMkpBQTJKLENBQUMsQ0FBQTthQUN6SztXQUNGLENBQUMsU0FBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2QsbUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7V0FDZixDQUFDLENBQUE7U0FDSDtPQUNGLENBQUMsQ0FBQTtLQUNIO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy90ZXN0ZXItZ28vbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge1Rlc3Rlcn0gZnJvbSAnLi90ZXN0ZXInXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGVwZW5kZW5jaWVzSW5zdGFsbGVkOiBudWxsLFxuICBnb2dldDogbnVsbCxcbiAgZ29jb25maWc6IG51bGwsXG4gIHRlc3RlcjogbnVsbCxcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcbiAgdG9vbENoZWNrQ29tcGxldGU6IG51bGwsXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ3Rlc3Rlci1nbycpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgICByZXR1cm4gdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWRcbiAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9KVxuICAgIHRoaXMuZ2V0VGVzdGVyKClcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvZ2V0ID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gICAgdGhpcy50ZXN0ZXIgPSBudWxsXG4gICAgdGhpcy5kZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSBudWxsXG4gICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IG51bGxcbiAgfSxcblxuICBwcm92aWRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUZXN0ZXIoKVxuICB9LFxuXG4gIGdldFRlc3RlciAoKSB7XG4gICAgaWYgKHRoaXMudGVzdGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXN0ZXJcbiAgICB9XG4gICAgdGhpcy50ZXN0ZXIgPSBuZXcgVGVzdGVyKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldEdvY29uZmlnKClcbiAgICB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRHb2dldCgpXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMudGVzdGVyKVxuICAgIHJldHVybiB0aGlzLnRlc3RlclxuICB9LFxuXG4gIGdldEdvY29uZmlnICgpIHtcbiAgICBpZiAodGhpcy5nb2NvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ29jb25maWdcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgZ2V0R29nZXQgKCkge1xuICAgIGlmICh0aGlzLmdvZ2V0KSB7XG4gICAgICByZXR1cm4gdGhpcy5nb2dldFxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBjb25zdW1lR29jb25maWcgKHNlcnZpY2UpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gc2VydmljZVxuICAgIHRoaXMuY2hlY2tGb3JUb29scygpXG4gIH0sXG5cbiAgY29uc3VtZUdvZ2V0IChzZXJ2aWNlKSB7XG4gICAgdGhpcy5nb2dldCA9IHNlcnZpY2VcbiAgICB0aGlzLmNoZWNrRm9yVG9vbHMoKVxuICB9LFxuXG4gIGNoZWNrRm9yVG9vbHMgKCkge1xuICAgIGlmICghdGhpcy50b29sQ2hlY2tDb21wbGV0ZSAmJiB0aGlzLmdvY29uZmlnICYmIHRoaXMuZ29nZXQpIHtcbiAgICAgIGxldCBvcHRpb25zID0ge2VudjogdGhpcy5nb2NvbmZpZy5lbnZpcm9ubWVudCgpfVxuICAgICAgdGhpcy5nb2NvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdjb3ZlcicsIG9wdGlvbnMpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgICBpZiAoIWNtZCkge1xuICAgICAgICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGUgPSB0cnVlXG4gICAgICAgICAgdGhpcy5nb2dldC5nZXQoe1xuICAgICAgICAgICAgbmFtZTogJ3Rlc3Rlci1nbycsXG4gICAgICAgICAgICBwYWNrYWdlTmFtZTogJ2NvdmVyJyxcbiAgICAgICAgICAgIHBhY2thZ2VQYXRoOiAnZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9jb3ZlcicsXG4gICAgICAgICAgICB0eXBlOiAnbWlzc2luZydcbiAgICAgICAgICB9KS50aGVuKChyKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXIuc3VjY2Vzcykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY292ZXIgaXMgbm90IGF2YWlsYWJsZSBhbmQgY291bGQgbm90IGJlIGluc3RhbGxlZCB2aWEgXCJnbyBnZXQgLXUgZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9jb3ZlclwiOyBwbGVhc2UgbWFudWFsbHkgaW5zdGFsbCBpdCB0byBlbmFibGUgZGlzcGxheSBvZiBjb3ZlcmFnZS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/tester-go/lib/main.js
