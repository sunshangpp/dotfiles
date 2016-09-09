Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _atom = require('atom');

var _delve = require('./delve');

var Delve = _interopRequireWildcard(_delve);

'use babel';

var subscriptions = undefined,
    goconfig = undefined,
    goget = undefined;
var editors = undefined,
    output = undefined,
    panel = undefined,
    store = undefined,
    commands = undefined;
var initialState = undefined,
    dependenciesInstalled = undefined,
    path = undefined;
var cmds = undefined;

exports['default'] = {
  activate: function activate(state) {
    var _this = this;

    initialState = state;

    require('atom-package-deps').install('go-debug').then(function () {
      dependenciesInstalled = true;
      _this.start();
      return true;
    })['catch'](function (e) {
      console.warn('go-debug', e);
    });
  },
  deactivate: function deactivate() {
    if (subscriptions) {
      subscriptions.dispose();
      subscriptions = null;
    }
    dependenciesInstalled = false;
    path = null;
    goget = goconfig = null;
  },
  serialize: function serialize() {
    return store ? store.serialize() : initialState;
  },

  consumeGoget: function consumeGoget(service) {
    goget = service;
    this.getDlv();
  },
  consumeGoconfig: function consumeGoconfig(service) {
    goconfig = service;
    this.getDlv();
  },
  getDlv: function getDlv() {
    var _this2 = this;

    if (!goget || !goconfig) {
      return;
    }

    Delve.get(goget, goconfig).then(function (p) {
      if (!p) {
        return;
      }
      path = p;
      _this2.start();
    })['catch'](function (e) {
      console.warn('go-debug', e);
    });
  },

  start: function start() {
    if (!dependenciesInstalled || !path) {
      return;
    }

    // load all dependencies once after everything is ready
    // this reduces the initial load time of this package
    commands = require('./commands');

    store = require('./store');
    store.init(initialState);
    store.store.dispatch({ type: 'SET_DLV_PATH', path: path });

    editors = require('./editors');
    panel = require('./panel.jsx');
    output = require('./output.jsx');

    panel.init();
    editors.init();
    output.init();

    subscriptions = new _atom.CompositeDisposable(atom.commands.add('atom-workspace', {
      'go-debug:toggle-panel': commands.get('toggle-panel').action
    }), output, editors, panel, Delve, store);

    // start observing config values
    subscriptions.add(atom.config.observe('go-debug.limitCommandsToGo', this.observeCommandsLimit.bind(this)));
  },
  observeCommandsLimit: function observeCommandsLimit(limitCommandsToGo) {
    if (cmds) {
      subscriptions.remove(cmds);
      cmds.dispose();
    }

    var selector = 'atom-text-editor';
    if (limitCommandsToGo === true) {
      selector = 'atom-text-editor[data-grammar~=\'go\']';
    }
    cmds = atom.commands.add(selector, commands.getKeyboardCommands());
    subscriptions.add(cmds);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ25CLFNBQVM7O0lBQXBCLEtBQUs7O0FBSGpCLFdBQVcsQ0FBQTs7QUFLWCxJQUFJLGFBQWEsWUFBQTtJQUFFLFFBQVEsWUFBQTtJQUFFLEtBQUssWUFBQSxDQUFBO0FBQ2xDLElBQUksT0FBTyxZQUFBO0lBQUUsTUFBTSxZQUFBO0lBQUUsS0FBSyxZQUFBO0lBQUUsS0FBSyxZQUFBO0lBQUUsUUFBUSxZQUFBLENBQUE7QUFDM0MsSUFBSSxZQUFZLFlBQUE7SUFBRSxxQkFBcUIsWUFBQTtJQUFFLElBQUksWUFBQSxDQUFBO0FBQzdDLElBQUksSUFBSSxZQUFBLENBQUE7O3FCQUVPO0FBQ2IsVUFBUSxFQUFDLGtCQUFDLEtBQUssRUFBRTs7O0FBQ2YsZ0JBQVksR0FBRyxLQUFLLENBQUE7O0FBRXBCLFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMxRCwyQkFBcUIsR0FBRyxJQUFJLENBQUE7QUFDNUIsWUFBSyxLQUFLLEVBQUUsQ0FBQTtBQUNaLGFBQU8sSUFBSSxDQUFBO0tBQ1osQ0FBQyxTQUFNLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDZCxhQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQTtLQUM1QixDQUFDLENBQUE7R0FDSDtBQUNELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksYUFBYSxFQUFFO0FBQ2pCLG1CQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkIsbUJBQWEsR0FBRyxJQUFJLENBQUE7S0FDckI7QUFDRCx5QkFBcUIsR0FBRyxLQUFLLENBQUE7QUFDN0IsUUFBSSxHQUFHLElBQUksQ0FBQTtBQUNYLFNBQUssR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFBO0dBQ3hCO0FBQ0QsV0FBUyxFQUFDLHFCQUFHO0FBQ1gsV0FBTyxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLFlBQVksQ0FBQTtHQUNoRDs7QUFFRCxjQUFZLEVBQUMsc0JBQUMsT0FBTyxFQUFFO0FBQ3JCLFNBQUssR0FBRyxPQUFPLENBQUE7QUFDZixRQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7R0FDZDtBQUNELGlCQUFlLEVBQUMseUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFlBQVEsR0FBRyxPQUFPLENBQUE7QUFDbEIsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0dBQ2Q7QUFDRCxRQUFNLEVBQUMsa0JBQUc7OztBQUNSLFFBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDdkIsYUFBTTtLQUNQOztBQUVELFNBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNyQyxVQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ04sZUFBTTtPQUNQO0FBQ0QsVUFBSSxHQUFHLENBQUMsQ0FBQTtBQUNSLGFBQUssS0FBSyxFQUFFLENBQUE7S0FDYixDQUFDLFNBQU0sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNkLGFBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQzVCLENBQUMsQ0FBQTtHQUNIOztBQUVELE9BQUssRUFBQyxpQkFBRztBQUNQLFFBQUksQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNuQyxhQUFNO0tBQ1A7Ozs7QUFJRCxZQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUVoQyxTQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzFCLFNBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDeEIsU0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBOztBQUUxRCxXQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzlCLFNBQUssR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDOUIsVUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTs7QUFFaEMsU0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ1osV0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2QsVUFBTSxDQUFDLElBQUksRUFBRSxDQUFBOztBQUViLGlCQUFhLEdBQUcsOEJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEMsNkJBQXVCLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNO0tBQzdELENBQUMsRUFDRixNQUFNLEVBQ04sT0FBTyxFQUNQLEtBQUssRUFDTCxLQUFLLEVBQ0wsS0FBSyxDQUNOLENBQUE7OztBQUdELGlCQUFhLENBQUMsR0FBRyxDQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDeEYsQ0FBQTtHQUNGO0FBQ0Qsc0JBQW9CLEVBQUMsOEJBQUMsaUJBQWlCLEVBQUU7QUFDdkMsUUFBSSxJQUFJLEVBQUU7QUFDUixtQkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMxQixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDZjs7QUFFRCxRQUFJLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQTtBQUNqQyxRQUFJLGlCQUFpQixLQUFLLElBQUksRUFBRTtBQUM5QixjQUFRLEdBQUcsd0NBQXdDLENBQUE7S0FDcEQ7QUFDRCxRQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7QUFDbEUsaUJBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDeEI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1kZWJ1Zy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgRGVsdmUgZnJvbSAnLi9kZWx2ZSdcblxubGV0IHN1YnNjcmlwdGlvbnMsIGdvY29uZmlnLCBnb2dldFxubGV0IGVkaXRvcnMsIG91dHB1dCwgcGFuZWwsIHN0b3JlLCBjb21tYW5kc1xubGV0IGluaXRpYWxTdGF0ZSwgZGVwZW5kZW5jaWVzSW5zdGFsbGVkLCBwYXRoXG5sZXQgY21kc1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlIChzdGF0ZSkge1xuICAgIGluaXRpYWxTdGF0ZSA9IHN0YXRlXG5cbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2dvLWRlYnVnJykudGhlbigoKSA9PiB7XG4gICAgICBkZXBlbmRlbmNpZXNJbnN0YWxsZWQgPSB0cnVlXG4gICAgICB0aGlzLnN0YXJ0KClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUud2FybignZ28tZGVidWcnLCBlKVxuICAgIH0pXG4gIH0sXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB9XG4gICAgZGVwZW5kZW5jaWVzSW5zdGFsbGVkID0gZmFsc2VcbiAgICBwYXRoID0gbnVsbFxuICAgIGdvZ2V0ID0gZ29jb25maWcgPSBudWxsXG4gIH0sXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHN0b3JlID8gc3RvcmUuc2VyaWFsaXplKCkgOiBpbml0aWFsU3RhdGVcbiAgfSxcblxuICBjb25zdW1lR29nZXQgKHNlcnZpY2UpIHtcbiAgICBnb2dldCA9IHNlcnZpY2VcbiAgICB0aGlzLmdldERsdigpXG4gIH0sXG4gIGNvbnN1bWVHb2NvbmZpZyAoc2VydmljZSkge1xuICAgIGdvY29uZmlnID0gc2VydmljZVxuICAgIHRoaXMuZ2V0RGx2KClcbiAgfSxcbiAgZ2V0RGx2ICgpIHtcbiAgICBpZiAoIWdvZ2V0IHx8ICFnb2NvbmZpZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgRGVsdmUuZ2V0KGdvZ2V0LCBnb2NvbmZpZykudGhlbigocCkgPT4ge1xuICAgICAgaWYgKCFwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgcGF0aCA9IHBcbiAgICAgIHRoaXMuc3RhcnQoKVxuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICBjb25zb2xlLndhcm4oJ2dvLWRlYnVnJywgZSlcbiAgICB9KVxuICB9LFxuXG4gIHN0YXJ0ICgpIHtcbiAgICBpZiAoIWRlcGVuZGVuY2llc0luc3RhbGxlZCB8fCAhcGF0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gbG9hZCBhbGwgZGVwZW5kZW5jaWVzIG9uY2UgYWZ0ZXIgZXZlcnl0aGluZyBpcyByZWFkeVxuICAgIC8vIHRoaXMgcmVkdWNlcyB0aGUgaW5pdGlhbCBsb2FkIHRpbWUgb2YgdGhpcyBwYWNrYWdlXG4gICAgY29tbWFuZHMgPSByZXF1aXJlKCcuL2NvbW1hbmRzJylcblxuICAgIHN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZScpXG4gICAgc3RvcmUuaW5pdChpbml0aWFsU3RhdGUpXG4gICAgc3RvcmUuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX0RMVl9QQVRIJywgcGF0aDogcGF0aCB9KVxuXG4gICAgZWRpdG9ycyA9IHJlcXVpcmUoJy4vZWRpdG9ycycpXG4gICAgcGFuZWwgPSByZXF1aXJlKCcuL3BhbmVsLmpzeCcpXG4gICAgb3V0cHV0ID0gcmVxdWlyZSgnLi9vdXRwdXQuanN4JylcblxuICAgIHBhbmVsLmluaXQoKVxuICAgIGVkaXRvcnMuaW5pdCgpXG4gICAgb3V0cHV0LmluaXQoKVxuXG4gICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAnZ28tZGVidWc6dG9nZ2xlLXBhbmVsJzogY29tbWFuZHMuZ2V0KCd0b2dnbGUtcGFuZWwnKS5hY3Rpb25cbiAgICAgIH0pLFxuICAgICAgb3V0cHV0LFxuICAgICAgZWRpdG9ycyxcbiAgICAgIHBhbmVsLFxuICAgICAgRGVsdmUsXG4gICAgICBzdG9yZVxuICAgIClcblxuICAgIC8vIHN0YXJ0IG9ic2VydmluZyBjb25maWcgdmFsdWVzXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdnby1kZWJ1Zy5saW1pdENvbW1hbmRzVG9HbycsIHRoaXMub2JzZXJ2ZUNvbW1hbmRzTGltaXQuYmluZCh0aGlzKSlcbiAgICApXG4gIH0sXG4gIG9ic2VydmVDb21tYW5kc0xpbWl0IChsaW1pdENvbW1hbmRzVG9Hbykge1xuICAgIGlmIChjbWRzKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLnJlbW92ZShjbWRzKVxuICAgICAgY21kcy5kaXNwb3NlKClcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0b3IgPSAnYXRvbS10ZXh0LWVkaXRvcidcbiAgICBpZiAobGltaXRDb21tYW5kc1RvR28gPT09IHRydWUpIHtcbiAgICAgIHNlbGVjdG9yID0gJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cXCdnb1xcJ10nXG4gICAgfVxuICAgIGNtZHMgPSBhdG9tLmNvbW1hbmRzLmFkZChzZWxlY3RvciwgY29tbWFuZHMuZ2V0S2V5Ym9hcmRDb21tYW5kcygpKVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkKGNtZHMpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/main.js
