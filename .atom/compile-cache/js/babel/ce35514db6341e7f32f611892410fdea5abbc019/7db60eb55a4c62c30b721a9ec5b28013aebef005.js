Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _reactForAtom = require('react-for-atom');

var _reactRedux = require('react-redux');

var _store = require('./store');

var _outputMessage = require('./output-message');

var _outputMessage2 = _interopRequireDefault(_outputMessage);

'use babel';

var filterText = function filterText(t) {
  return t[0].toUpperCase() + t.substr(1);
};

var Output = (function (_React$Component) {
  _inherits(Output, _React$Component);

  function Output() {
    _classCallCheck(this, Output);

    _get(Object.getPrototypeOf(Output.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Output, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.refs.list.scrollTop = this.refs.list.scrollHeight;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var filters = this.props.filters;

      var items = this.props.messages.filter(function (msg) {
        return filters[msg.type];
      }).map(function (msg, i) {
        return _reactForAtom.React.createElement(_outputMessage2['default'], { key: i, message: msg.message });
      });
      var filterKeys = Object.keys(filters).sort();
      return _reactForAtom.React.createElement(
        'div',
        { className: 'go-debug-output' },
        _reactForAtom.React.createElement(
          'div',
          { className: 'go-debug-output-header' },
          _reactForAtom.React.createElement(
            'h5',
            { className: 'text' },
            'Output messages'
          ),
          _reactForAtom.React.createElement(
            'div',
            { className: 'btn-group' },
            filterKeys.map(function (filter) {
              return _reactForAtom.React.createElement(
                'button',
                { key: filter, className: 'btn' + (filters[filter] ? ' selected' : ''),
                  onClick: _this.props.onFilterClick, 'data-filter': filter },
                filterText(filter)
              );
            })
          ),
          _reactForAtom.React.createElement(
            'button',
            { type: 'button', className: 'btn go-debug-btn-flat', onClick: this.props.onCleanClick },
            _reactForAtom.React.createElement('span', { className: 'icon-circle-slash', title: 'Clean' })
          ),
          _reactForAtom.React.createElement(
            'button',
            { type: 'button', className: 'btn go-debug-btn-flat', onClick: this.props.onCloseClick },
            _reactForAtom.React.createElement('span', { className: 'icon-x', title: 'Close' })
          )
        ),
        _reactForAtom.React.createElement(
          'div',
          { className: 'go-debug-output-list native-key-bindings', ref: 'list', tabIndex: -1 },
          items
        )
      );
    }
  }]);

  return Output;
})(_reactForAtom.React.Component);

var OutputListener = (0, _reactRedux.connect)(function (state) {
  return state.output;
}, function (dispatch) {
  return {
    onCleanClick: function onCleanClick() {
      dispatch({ type: 'CLEAN_OUTPUT' });
    },
    onCloseClick: function onCloseClick() {
      dispatch({ type: 'TOGGLE_OUTPUT', visible: false });
    },
    onFilterClick: function onFilterClick(ev) {
      var filter = ev.target.dataset.filter;

      if (filter) {
        dispatch({ type: 'TOGGLE_OUTPUT_FILTER', filter: filter });
      }
    }
  };
})(Output);

var atomPanel = undefined;

function onStoreChange() {
  var outputState = _store.store.getState().output;
  if (outputState.visible !== atomPanel.isVisible()) {
    atomPanel[outputState.visible ? 'show' : 'hide']();
  }
}

var subscriptions = undefined;
exports['default'] = {
  init: function init() {
    subscriptions = new _atom.CompositeDisposable({ dispose: _store.store.subscribe(onStoreChange) });

    var item = document.createElement('div');
    atomPanel = atom.workspace.addBottomPanel({ item: item, visible: false });

    _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(
      _reactRedux.Provider,
      { store: _store.store },
      _reactForAtom.React.createElement(OutputListener, null)
    ), item);
  },
  dispose: function dispose() {
    subscriptions.dispose();
    subscriptions = null;

    _reactForAtom.ReactDOM.unmountComponentAtNode(atomPanel.getItem());

    atomPanel.destroy();
    atomPanel = null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9vdXRwdXQuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVvQyxNQUFNOzs0QkFDVixnQkFBZ0I7OzBCQUNkLGFBQWE7O3FCQUV6QixTQUFTOzs2QkFDWCxrQkFBa0I7Ozs7QUFQdEMsV0FBVyxDQUFBOztBQVNYLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLENBQUM7U0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Q0FBQSxDQUFBOztJQUVwRCxNQUFNO1lBQU4sTUFBTTs7V0FBTixNQUFNOzBCQUFOLE1BQU07OytCQUFOLE1BQU07OztlQUFOLE1BQU07O1dBQ1MsOEJBQUc7QUFDcEIsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQTtLQUN2RDs7O1dBQ00sa0JBQUc7OztVQUNBLE9BQU8sR0FBSyxJQUFJLENBQUMsS0FBSyxDQUF0QixPQUFPOztBQUNmLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUM5QixNQUFNLENBQUMsVUFBQyxHQUFHO2VBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQ2xDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUs7QUFDZixlQUFPLGdFQUFTLEdBQUcsRUFBRSxDQUFDLEFBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQUFBQyxHQUFHLENBQUE7T0FDakQsQ0FBQyxDQUFBO0FBQ0osVUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUM5QyxhQUFPOztVQUFLLFNBQVMs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SixJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7O0FBRW5FLDJCQUFTLE1BQU0sQ0FDYjs7UUFBVSxLQUFLLGNBQVE7TUFDckIsa0NBQUMsY0FBYyxPQUFHO0tBQ1QsRUFDWCxJQUFJLENBQ0wsQ0FBQTtHQUNGO0FBQ0QsU0FBTyxFQUFDLG1CQUFHO0FBQ1QsaUJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN2QixpQkFBYSxHQUFHLElBQUksQ0FBQTs7QUFFcEIsMkJBQVMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7O0FBRXBELGFBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNuQixhQUFTLEdBQUcsSUFBSSxDQUFBO0dBQ2pCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL291dHB1dC5qc3giLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFJlYWN0LCBSZWFjdERPTSB9IGZyb20gJ3JlYWN0LWZvci1hdG9tJ1xuaW1wb3J0IHsgUHJvdmlkZXIsIGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcblxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9vdXRwdXQtbWVzc2FnZSdcblxuY29uc3QgZmlsdGVyVGV4dCA9ICh0KSA9PiB0WzBdLnRvVXBwZXJDYXNlKCkgKyB0LnN1YnN0cigxKVxuXG5jbGFzcyBPdXRwdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRVcGRhdGUgKCkge1xuICAgIHRoaXMucmVmcy5saXN0LnNjcm9sbFRvcCA9IHRoaXMucmVmcy5saXN0LnNjcm9sbEhlaWdodFxuICB9XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBmaWx0ZXJzIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLnByb3BzLm1lc3NhZ2VzXG4gICAgICAuZmlsdGVyKChtc2cpID0+IGZpbHRlcnNbbXNnLnR5cGVdKVxuICAgICAgLm1hcCgobXNnLCBpKSA9PiB7XG4gICAgICAgIHJldHVybiA8TWVzc2FnZSBrZXk9e2l9IG1lc3NhZ2U9e21zZy5tZXNzYWdlfSAvPlxuICAgICAgfSlcbiAgICBjb25zdCBmaWx0ZXJLZXlzID0gT2JqZWN0LmtleXMoZmlsdGVycykuc29ydCgpXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctb3V0cHV0XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdvLWRlYnVnLW91dHB1dC1oZWFkZXJcIj5cbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cInRleHRcIj5PdXRwdXQgbWVzc2FnZXM8L2g1PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgIHtmaWx0ZXJLZXlzLm1hcCgoZmlsdGVyKSA9PlxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2ZpbHRlcn0gY2xhc3NOYW1lPXsnYnRuJyArIChmaWx0ZXJzW2ZpbHRlcl0gPyAnIHNlbGVjdGVkJyA6ICcnKX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vbkZpbHRlckNsaWNrfSBkYXRhLWZpbHRlcj17ZmlsdGVyfT57ZmlsdGVyVGV4dChmaWx0ZXIpfTwvYnV0dG9uPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gZ28tZGVidWctYnRuLWZsYXRcIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xlYW5DbGlja30+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1jaXJjbGUtc2xhc2hcIiB0aXRsZT1cIkNsZWFuXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBnby1kZWJ1Zy1idG4tZmxhdFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbG9zZUNsaWNrfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLXhcIiB0aXRsZT1cIkNsb3NlXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctb3V0cHV0LWxpc3QgbmF0aXZlLWtleS1iaW5kaW5nc1wiIHJlZj1cImxpc3RcIiB0YWJJbmRleD17LTF9PntpdGVtc308L2Rpdj5cbiAgICA8L2Rpdj5cbiAgfVxufVxuXG5jb25zdCBPdXRwdXRMaXN0ZW5lciA9IGNvbm5lY3QoXG4gIChzdGF0ZSkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5vdXRwdXRcbiAgfSxcbiAgKGRpc3BhdGNoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9uQ2xlYW5DbGljayAoKSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogJ0NMRUFOX09VVFBVVCcgfSlcbiAgICAgIH0sXG4gICAgICBvbkNsb3NlQ2xpY2sgKCkge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6ICdUT0dHTEVfT1VUUFVUJywgdmlzaWJsZTogZmFsc2UgfSlcbiAgICAgIH0sXG4gICAgICBvbkZpbHRlckNsaWNrIChldikge1xuICAgICAgICBjb25zdCB7IGZpbHRlciB9ID0gZXYudGFyZ2V0LmRhdGFzZXRcbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogJ1RPR0dMRV9PVVRQVVRfRklMVEVSJywgZmlsdGVyIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbikoT3V0cHV0KVxuXG5sZXQgYXRvbVBhbmVsXG5cbmZ1bmN0aW9uIG9uU3RvcmVDaGFuZ2UgKCkge1xuICBjb25zdCBvdXRwdXRTdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCkub3V0cHV0XG4gIGlmIChvdXRwdXRTdGF0ZS52aXNpYmxlICE9PSBhdG9tUGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICBhdG9tUGFuZWxbb3V0cHV0U3RhdGUudmlzaWJsZSA/ICdzaG93JyA6ICdoaWRlJ10oKVxuICB9XG59XG5cbmxldCBzdWJzY3JpcHRpb25zXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQgKCkge1xuICAgIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHsgZGlzcG9zZTogc3RvcmUuc3Vic2NyaWJlKG9uU3RvcmVDaGFuZ2UpIH1cbiAgICApXG5cbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBhdG9tUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7IGl0ZW0sIHZpc2libGU6IGZhbHNlIH0pXG5cbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgPE91dHB1dExpc3RlbmVyIC8+XG4gICAgICA8L1Byb3ZpZGVyPixcbiAgICAgIGl0ZW1cbiAgICApXG4gIH0sXG4gIGRpc3Bvc2UgKCkge1xuICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgc3Vic2NyaXB0aW9ucyA9IG51bGxcblxuICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoYXRvbVBhbmVsLmdldEl0ZW0oKSlcblxuICAgIGF0b21QYW5lbC5kZXN0cm95KClcbiAgICBhdG9tUGFuZWwgPSBudWxsXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/output.jsx
