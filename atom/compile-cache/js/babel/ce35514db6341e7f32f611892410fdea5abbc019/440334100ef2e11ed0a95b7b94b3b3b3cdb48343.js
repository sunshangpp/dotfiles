Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactForAtom = require('react-for-atom');

var _reactRedux = require('react-redux');

var _delve = require('./delve');

var Delve = _interopRequireWildcard(_delve);

'use babel';

var Variables = (function (_React$Component) {
  _inherits(Variables, _React$Component);

  function Variables() {
    _classCallCheck(this, Variables);

    _get(Object.getPrototypeOf(Variables.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Variables, [{
    key: 'render',
    value: function render() {
      return _reactForAtom.React.createElement(
        'div',
        { onClick: this.onToggleClick.bind(this) },
        _reactForAtom.React.createElement(Children, { variables: this.props.variables, path: '', expanded: this.props.expanded })
      );
    }
  }, {
    key: 'onToggleClick',
    value: function onToggleClick(ev) {
      var path = ev.target.dataset.path;
      if (!path) {
        return;
      }

      // update the store
      this.props.onToggle(path);

      // then load the variable if not done already
      var v = this.props.variables[path];
      if (v && !v.loaded) {
        Delve.loadVariable(path);
        return;
      }
    }
  }]);

  return Variables;
})(_reactForAtom.React.Component);

exports['default'] = (0, _reactRedux.connect)(function (state) {
  return {
    variables: (state.delve.stacktrace[state.delve.selectedStacktrace] || {}).variables,
    expanded: state.variables.expanded
  };
}, function (dispatch) {
  return {
    onToggle: function onToggle(path) {
      dispatch({ type: 'TOGGLE_VARIABLE', path: path });
    }
  };
})(Variables);

var Variable = function Variable(props) {
  var variables = props.variables;
  var path = props.path;
  var expanded = props.expanded;

  var variable = variables[path];

  var name = renderValue(variable.name);
  var isExpanded = variable.hasChildren && expanded[path];
  var toggleClassName = 'go-debug-toggle' + (!variable.hasChildren ? ' go-debug-toggle-hidden' : '');
  toggleClassName += ' icon icon-chevron-' + (isExpanded ? 'down' : 'right');
  return _reactForAtom.React.createElement(
    'li',
    null,
    _reactForAtom.React.createElement('span', { className: toggleClassName, 'data-path': path }),
    variable.value ? _reactForAtom.React.createElement(
      'span',
      { tabIndex: -1, className: 'native-key-bindings' },
      name,
      ': ',
      renderValue(variable.value)
    ) : _reactForAtom.React.createElement(
      'span',
      { tabIndex: -1, className: 'native-key-bindings' },
      name
    ),
    isExpanded ? _reactForAtom.React.createElement(Children, { variables: variables, path: path, expanded: expanded }) : null
  );
};

var Children = function Children(props) {
  var variables = props.variables;
  var path = props.path;
  var expanded = props.expanded;

  var children = Object.keys(variables || {}).filter(function (p) {
    return variables[p].parentPath === path;
  }).sort();
  if (!children.length) {
    return _reactForAtom.React.createElement('div', null);
  }
  var vars = children.map(function (p, i) {
    return _reactForAtom.React.createElement(Variable, { key: i, path: p, variables: variables, expanded: expanded });
  });
  return _reactForAtom.React.createElement(
    'ol',
    null,
    vars
  );
};

function renderValue(value) {
  if (Array.isArray(value)) {
    return value.map(function (v, i) {
      return _reactForAtom.React.createElement(
        'span',
        { key: i },
        renderValue(v)
      );
    });
  }
  if (typeof value === 'object' && 'value' in value) {
    var v = renderValue(value.value);
    return value.className ? _reactForAtom.React.createElement(
      'span',
      { className: value.className },
      v
    ) : v;
  }
  return value === undefined || value === null ? '' : value;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi92YXJpYWJsZXMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzRCQUVzQixnQkFBZ0I7OzBCQUNkLGFBQWE7O3FCQUNkLFNBQVM7O0lBQXBCLEtBQUs7O0FBSmpCLFdBQVcsQ0FBQTs7SUFNTCxTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztlQUFULFNBQVM7O1dBQ04sa0JBQUc7QUFDUixhQUFPOztVQUFLLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQztRQUNqRCxrQ0FBQyxRQUFRLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDLEVBQUMsSUFBSSxFQUFFLEVBQUUsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQyxHQUFHO09BQ2xGLENBQUE7S0FDUDs7O1dBQ2EsdUJBQUMsRUFBRSxFQUFFO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQTtBQUNuQyxVQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsZUFBTTtPQUNQOzs7QUFHRCxVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTs7O0FBR3pCLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BDLFVBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNsQixhQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hCLGVBQU07T0FDUDtLQUNGOzs7U0FyQkcsU0FBUztHQUFTLG9CQUFNLFNBQVM7O3FCQXdCeEIseUJBQ2IsVUFBQyxLQUFLLEVBQUs7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QUMsQ0FBQTtBQUNGLFNBQU87OztJQUFLLElBQUk7R0FBTSxDQUFBO0NBQ3ZCLENBQUE7O0FBRUQsU0FBUyxXQUFXLENBQUUsS0FBSyxFQUFFO0FBQzNCLE1BQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN4QixXQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQzthQUFLOztVQUFNLEdBQUcsRUFBRSxDQUFDLEFBQUM7UUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQVE7S0FBQSxDQUFDLENBQUE7R0FDbEU7QUFDRCxNQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksS0FBSyxFQUFFO0FBQ2pELFFBQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbEMsV0FBTyxLQUFLLENBQUMsU0FBUyxHQUFHOztRQUFNLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxBQUFDO01BQUUsQ0FBQztLQUFRLEdBQUcsQ0FBQyxDQUFBO0dBQzFFO0FBQ0QsU0FBTyxBQUFDLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksR0FBSSxFQUFFLEdBQUcsS0FBSyxDQUFBO0NBQzVEIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi92YXJpYWJsZXMuanN4Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgUmVhY3QgfSBmcm9tICdyZWFjdC1mb3ItYXRvbSdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCAqIGFzIERlbHZlIGZyb20gJy4vZGVsdmUnXG5cbmNsYXNzIFZhcmlhYmxlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIDxkaXYgb25DbGljaz17dGhpcy5vblRvZ2dsZUNsaWNrLmJpbmQodGhpcyl9PlxuICAgICAgPENoaWxkcmVuIHZhcmlhYmxlcz17dGhpcy5wcm9wcy52YXJpYWJsZXN9IHBhdGg9eycnfSBleHBhbmRlZD17dGhpcy5wcm9wcy5leHBhbmRlZH0gLz5cbiAgICA8L2Rpdj5cbiAgfVxuICBvblRvZ2dsZUNsaWNrIChldikge1xuICAgIGNvbnN0IHBhdGggPSBldi50YXJnZXQuZGF0YXNldC5wYXRoXG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdGhlIHN0b3JlXG4gICAgdGhpcy5wcm9wcy5vblRvZ2dsZShwYXRoKVxuXG4gICAgLy8gdGhlbiBsb2FkIHRoZSB2YXJpYWJsZSBpZiBub3QgZG9uZSBhbHJlYWR5XG4gICAgY29uc3QgdiA9IHRoaXMucHJvcHMudmFyaWFibGVzW3BhdGhdXG4gICAgaWYgKHYgJiYgIXYubG9hZGVkKSB7XG4gICAgICBEZWx2ZS5sb2FkVmFyaWFibGUocGF0aClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICAoc3RhdGUpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFyaWFibGVzOiAoc3RhdGUuZGVsdmUuc3RhY2t0cmFjZVtzdGF0ZS5kZWx2ZS5zZWxlY3RlZFN0YWNrdHJhY2VdIHx8IHt9KS52YXJpYWJsZXMsXG4gICAgICBleHBhbmRlZDogc3RhdGUudmFyaWFibGVzLmV4cGFuZGVkXG4gICAgfVxuICB9LFxuICAoZGlzcGF0Y2gpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgb25Ub2dnbGU6IChwYXRoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogJ1RPR0dMRV9WQVJJQUJMRScsIHBhdGggfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbikoVmFyaWFibGVzKVxuXG5jb25zdCBWYXJpYWJsZSA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHZhcmlhYmxlcywgcGF0aCwgZXhwYW5kZWQgfSA9IHByb3BzXG4gIGNvbnN0IHZhcmlhYmxlID0gdmFyaWFibGVzW3BhdGhdXG5cbiAgY29uc3QgbmFtZSA9IHJlbmRlclZhbHVlKHZhcmlhYmxlLm5hbWUpXG4gIGNvbnN0IGlzRXhwYW5kZWQgPSB2YXJpYWJsZS5oYXNDaGlsZHJlbiAmJiBleHBhbmRlZFtwYXRoXVxuICBsZXQgdG9nZ2xlQ2xhc3NOYW1lID0gJ2dvLWRlYnVnLXRvZ2dsZScgKyAoIXZhcmlhYmxlLmhhc0NoaWxkcmVuID8gJyBnby1kZWJ1Zy10b2dnbGUtaGlkZGVuJyA6ICcnKVxuICB0b2dnbGVDbGFzc05hbWUgKz0gJyBpY29uIGljb24tY2hldnJvbi0nICsgKGlzRXhwYW5kZWQgPyAnZG93bicgOiAncmlnaHQnKVxuICByZXR1cm4gPGxpPlxuICAgIDxzcGFuIGNsYXNzTmFtZT17dG9nZ2xlQ2xhc3NOYW1lfSBkYXRhLXBhdGg9e3BhdGh9IC8+XG4gICAge3ZhcmlhYmxlLnZhbHVlID8gPHNwYW4gdGFiSW5kZXg9ey0xfSBjbGFzc05hbWU9XCJuYXRpdmUta2V5LWJpbmRpbmdzXCI+e25hbWV9OiB7cmVuZGVyVmFsdWUodmFyaWFibGUudmFsdWUpfTwvc3Bhbj4gOiA8c3BhbiB0YWJJbmRleD17LTF9IGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3NcIj57bmFtZX08L3NwYW4+fVxuICAgIHtpc0V4cGFuZGVkID8gPENoaWxkcmVuIHZhcmlhYmxlcz17dmFyaWFibGVzfSBwYXRoPXtwYXRofSBleHBhbmRlZD17ZXhwYW5kZWR9IC8+IDogbnVsbH1cbiAgPC9saT5cbn1cblxuY29uc3QgQ2hpbGRyZW4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyB2YXJpYWJsZXMsIHBhdGgsIGV4cGFuZGVkIH0gPSBwcm9wc1xuICBjb25zdCBjaGlsZHJlbiA9IE9iamVjdC5rZXlzKHZhcmlhYmxlcyB8fCB7fSkuZmlsdGVyKChwKSA9PiB2YXJpYWJsZXNbcF0ucGFyZW50UGF0aCA9PT0gcGF0aCkuc29ydCgpXG4gIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIDxkaXYgLz5cbiAgfVxuICBjb25zdCB2YXJzID0gY2hpbGRyZW4ubWFwKChwLCBpKSA9PiB7XG4gICAgcmV0dXJuIDxWYXJpYWJsZSBrZXk9e2l9IHBhdGg9e3B9IHZhcmlhYmxlcz17dmFyaWFibGVzfSBleHBhbmRlZD17ZXhwYW5kZWR9IC8+XG4gIH0pXG4gIHJldHVybiA8b2w+e3ZhcnN9PC9vbD5cbn1cblxuZnVuY3Rpb24gcmVuZGVyVmFsdWUgKHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXAoKHYsIGkpID0+IDxzcGFuIGtleT17aX0+e3JlbmRlclZhbHVlKHYpfTwvc3Bhbj4pXG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ3ZhbHVlJyBpbiB2YWx1ZSkge1xuICAgIGNvbnN0IHYgPSByZW5kZXJWYWx1ZSh2YWx1ZS52YWx1ZSlcbiAgICByZXR1cm4gdmFsdWUuY2xhc3NOYW1lID8gPHNwYW4gY2xhc3NOYW1lPXt2YWx1ZS5jbGFzc05hbWV9Pnt2fTwvc3Bhbj4gOiB2XG4gIH1cbiAgcmV0dXJuICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSA/ICcnIDogdmFsdWVcbn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/variables.jsx
