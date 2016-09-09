Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactForAtom = require('react-for-atom');

'use babel';

function convert(text) {
  var root = { tag: 'span', style: null, children: [] };
  var el = root;

  var colors = ['black', 'darkred', 'darkgreen', 'yellow', 'darkblue', 'purple', 'darkcyan', 'lightgray', 'gray', 'red', 'green', 'rgb(255, 255, 224)', 'blue', 'magenta', 'cyan', 'white'];

  function add(tag, style) {
    var newEl = { tag: tag, style: style, children: [], parent: el };
    el.children.push(newEl);
    el = newEl;
  }

  function close(tag) {
    if (tag !== el.tag) {
      throw new Error('tried to close ' + tag + ' but was ' + el.tag);
    }
    el = el.parent;
  }

  function addFGColor(code) {
    add('span', { color: colors[code] });
  }

  function addBGColor(code) {
    add('span', { backgroundColor: colors[code] });
  }

  function processCode(code) {
    if (code === 0) {
      // reset
      el = root;
    }
    if (code === 1) {
      add('b');
    }
    if (code === 2) {
      // TODO?
    }
    if (code === 4) {
      add('u');
    }
    if (code > 4 && code < 7) {
      add('blink');
    }
    if (code === 7) {
      // TODO: fg = bg and bg = fg
    }
    if (code === 8) {
      // conceal - hide...
      add('span', 'display: none');
    }
    if (code === 9) {
      add('strike');
    }
    if (code === 10) {
      // TODO: default?
    }
    if (code > 10 && code < 20) {
      // TODO: different fonts?
    }
    if (code === 20) {
      // TODO: fraktur ???
    }
    if (code === 21) {
      if (el.tag === 'b') {
        // bold off
        close('b');
      } else {
        // double underline TODO: use border-bottom?
      }
    }
    if (code === 24) {
      close('u');
    }
    if (code === 25) {
      close('blink');
    }
    if (code === 26) {
      // 'reserved'
    }
    if (code === 27) {
      // image positive = opposite of code 7 -> fg = fg and bg = bg
    }
    if (code === 28) {
      close('span');
    }
    if (code === 29) {
      close('strike');
    }
    if (code > 29 && code < 38) {
      addFGColor(code - 30);
    }
    if (code === 38) {
      // extended FG color (rgb)
    }
    if (code === 39) {
      // TODO: reset FG
      el = root;
    }
    if (code > 39 && code < 48) {
      addBGColor(code - 40);
    }
    if (code === 48) {
      // extended BG color (rgb)
    }
    if (code === 49) {
      // TODO: reset BG
      el = root;
    }
    if (code > 89 && code < 98) {
      addFGColor(code - 90 + 8);
    }
    if (code > 99 && code < 108) {
      addBGColor(code - 100 + 8);
    }
  }

  var tokens = [{
    // characters to remove completely
    pattern: /^\x08+/, // eslint-disable-line no-control-regex
    replacer: function replacer() {
      return '';
    }
  }, {
    // replaces the new lines
    pattern: /^\n+/,
    replacer: function newline() {
      el.children.push({ tag: 'br' });
      return '';
    }
  }, {
    // ansi codes
    pattern: /^\x1b\[((?:\d{1,3}?)+|)m/, // eslint-disable-line no-control-regex
    replacer: function replacer(m, group) {
      if (group.trim().length === 0) {
        group = '0';
      }
      group.trimRight('').split('').forEach(function (code) {
        processCode(+code);
      });
      return '';
    }
  }, {
    // malformed sequences
    pattern: /^\x1b\[?[\d]{0,3}/, // eslint-disable-line no-control-regex
    replacer: function replacer() {
      return '';
    }
  }, {
    // catch everything except escape codes and new lines
    pattern: /^([^\x1b\x08\n]+)/, // eslint-disable-line no-control-regex
    replacer: function replacer(text) {
      el.children.push(text);
      return '';
    }
  }];

  // replace '&nbsp' which sometimes gets encoded using codes 194 and 160...
  text = text.replace(/\u00C2([\u00A0-\u00BF])/g, '$1');

  var length = text.length;
  while (length > 0) {
    for (var i = 0; i < tokens.length; i++) {
      var handler = tokens[i];
      var matches = text.match(handler.pattern);
      if (matches) {
        text = text.replace(handler.pattern, handler.replacer);
        break;
      }
    }
    if (text.length === length) {
      break;
    }
    length = text.length;
  }
  return root;
}

var Message = (function (_React$Component) {
  _inherits(Message, _React$Component);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.message !== this.props.message;
    }
  }, {
    key: 'render',
    value: function render() {
      var result = convert(this.props.message);

      function create(el, i) {
        if (typeof el === 'string') {
          return _reactForAtom.React.createElement('span', { key: i }, el);
        }
        var children = el.children ? el.children.map(create) : null;
        return _reactForAtom.React.createElement(el.tag, { key: i, style: el.style }, children);
      }
      return _reactForAtom.React.createElement('div', null, create(result, 0));
    }
  }]);

  return Message;
})(_reactForAtom.React.Component);

exports['default'] = Message;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9vdXRwdXQtbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7NEJBRXNCLGdCQUFnQjs7QUFGdEMsV0FBVyxDQUFBOztBQUlYLFNBQVMsT0FBTyxDQUFFLElBQUksRUFBRTtBQUN0QixNQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUE7QUFDdkQsTUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFBOztBQUViLE1BQU0sTUFBTSxHQUFHLENBQ2IsT0FBTyxFQUNQLFNBQVMsRUFDVCxXQUFXLEVBQ1gsUUFBUSxFQUNSLFVBQVUsRUFDVixRQUFRLEVBQ1IsVUFBVSxFQUNWLFdBQVcsRUFDWCxNQUFNLEVBQ04sS0FBSyxFQUNMLE9BQU8sRUFDUCxvQkFBb0IsRUFDcEIsTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEVBQ04sT0FBTyxDQUNSLENBQUE7O0FBRUQsV0FBUyxHQUFHLENBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN4QixRQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQTtBQUN0RCxNQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN2QixNQUFFLEdBQUcsS0FBSyxDQUFBO0dBQ1g7O0FBRUQsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFO0FBQ25CLFFBQUksR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUU7QUFDbEIsWUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNoRTtBQUNELE1B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QUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDdEIsWUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUU7QUFDMUIsaUJBQU8sb0JBQU0sYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtTQUNuRDtBQUNELFlBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFBO0FBQzdELGVBQU8sb0JBQU0sYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDMUU7QUFDRCxhQUFPLG9CQUFNLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUMzRDs7O1NBZmtCLE9BQU87R0FBUyxvQkFBTSxTQUFTOztxQkFBL0IsT0FBTyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1kZWJ1Zy9saWIvb3V0cHV0LW1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBSZWFjdCB9IGZyb20gJ3JlYWN0LWZvci1hdG9tJ1xuXG5mdW5jdGlvbiBjb252ZXJ0ICh0ZXh0KSB7XG4gIGNvbnN0IHJvb3QgPSB7IHRhZzogJ3NwYW4nLCBzdHlsZTogbnVsbCwgY2hpbGRyZW46IFtdIH1cbiAgbGV0IGVsID0gcm9vdFxuXG4gIGNvbnN0IGNvbG9ycyA9IFtcbiAgICAnYmxhY2snLFxuICAgICdkYXJrcmVkJyxcbiAgICAnZGFya2dyZWVuJyxcbiAgICAneWVsbG93JyxcbiAgICAnZGFya2JsdWUnLFxuICAgICdwdXJwbGUnLFxuICAgICdkYXJrY3lhbicsXG4gICAgJ2xpZ2h0Z3JheScsXG4gICAgJ2dyYXknLFxuICAgICdyZWQnLFxuICAgICdncmVlbicsXG4gICAgJ3JnYigyNTUsIDI1NSwgMjI0KScsXG4gICAgJ2JsdWUnLFxuICAgICdtYWdlbnRhJyxcbiAgICAnY3lhbicsXG4gICAgJ3doaXRlJ1xuICBdXG5cbiAgZnVuY3Rpb24gYWRkICh0YWcsIHN0eWxlKSB7XG4gICAgY29uc3QgbmV3RWwgPSB7IHRhZywgc3R5bGUsIGNoaWxkcmVuOiBbXSwgcGFyZW50OiBlbCB9XG4gICAgZWwuY2hpbGRyZW4ucHVzaChuZXdFbClcbiAgICBlbCA9IG5ld0VsXG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSAodGFnKSB7XG4gICAgaWYgKHRhZyAhPT0gZWwudGFnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RyaWVkIHRvIGNsb3NlICcgKyB0YWcgKyAnIGJ1dCB3YXMgJyArIGVsLnRhZylcbiAgICB9XG4gICAgZWwgPSBlbC5wYXJlbnRcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEZHQ29sb3IgKGNvZGUpIHtcbiAgICBhZGQoJ3NwYW4nLCB7IGNvbG9yOiBjb2xvcnNbY29kZV0gfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEJHQ29sb3IgKGNvZGUpIHtcbiAgICBhZGQoJ3NwYW4nLCB7IGJhY2tncm91bmRDb2xvcjogY29sb3JzW2NvZGVdIH0pXG4gIH1cblxuICBmdW5jdGlvbiBwcm9jZXNzQ29kZSAoY29kZSkge1xuICAgIGlmIChjb2RlID09PSAwKSB7XG4gICAgICAvLyByZXNldFxuICAgICAgZWwgPSByb290XG4gICAgfVxuICAgIGlmIChjb2RlID09PSAxKSB7XG4gICAgICBhZGQoJ2InKVxuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gMikge1xuICAgICAgLy8gVE9ETz9cbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDQpIHtcbiAgICAgIGFkZCgndScpXG4gICAgfVxuICAgIGlmICgoY29kZSA+IDQgJiYgY29kZSA8IDcpKSB7XG4gICAgICBhZGQoJ2JsaW5rJylcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDcpIHtcbiAgICAgIC8vIFRPRE86IGZnID0gYmcgYW5kIGJnID0gZmdcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDgpIHtcbiAgICAgIC8vIGNvbmNlYWwgLSBoaWRlLi4uXG4gICAgICBhZGQoJ3NwYW4nLCAnZGlzcGxheTogbm9uZScpXG4gICAgfVxuICAgIGlmIChjb2RlID09PSA5KSB7XG4gICAgICBhZGQoJ3N0cmlrZScpXG4gICAgfVxuICAgIGlmIChjb2RlID09PSAxMCkge1xuICAgICAgLy8gVE9ETzogZGVmYXVsdD9cbiAgICB9XG4gICAgaWYgKGNvZGUgPiAxMCAmJiBjb2RlIDwgMjApIHtcbiAgICAgIC8vIFRPRE86IGRpZmZlcmVudCBmb250cz9cbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDIwKSB7XG4gICAgICAvLyBUT0RPOiBmcmFrdHVyID8/P1xuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gMjEpIHtcbiAgICAgIGlmIChlbC50YWcgPT09ICdiJykge1xuICAgICAgICAvLyBib2xkIG9mZlxuICAgICAgICBjbG9zZSgnYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkb3VibGUgdW5kZXJsaW5lIFRPRE86IHVzZSBib3JkZXItYm90dG9tP1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gMjQpIHtcbiAgICAgIGNsb3NlKCd1JylcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDI1KSB7XG4gICAgICBjbG9zZSgnYmxpbmsnKVxuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gMjYpIHtcbiAgICAgIC8vICdyZXNlcnZlZCdcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDI3KSB7XG4gICAgICAvLyBpbWFnZSBwb3NpdGl2ZSA9IG9wcG9zaXRlIG9mIGNvZGUgNyAtPiBmZyA9IGZnIGFuZCBiZyA9IGJnXG4gICAgfVxuICAgIGlmIChjb2RlID09PSAyOCkge1xuICAgICAgY2xvc2UoJ3NwYW4nKVxuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gMjkpIHtcbiAgICAgIGNsb3NlKCdzdHJpa2UnKVxuICAgIH1cbiAgICBpZiAoY29kZSA+IDI5ICYmIGNvZGUgPCAzOCkge1xuICAgICAgYWRkRkdDb2xvcihjb2RlIC0gMzApXG4gICAgfVxuICAgIGlmIChjb2RlID09PSAzOCkge1xuICAgICAgLy8gZXh0ZW5kZWQgRkcgY29sb3IgKHJnYilcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDM5KSB7XG4gICAgICAvLyBUT0RPOiByZXNldCBGR1xuICAgICAgZWwgPSByb290XG4gICAgfVxuICAgIGlmIChjb2RlID4gMzkgJiYgY29kZSA8IDQ4KSB7XG4gICAgICBhZGRCR0NvbG9yKGNvZGUgLSA0MClcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDQ4KSB7XG4gICAgICAvLyBleHRlbmRlZCBCRyBjb2xvciAocmdiKVxuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gNDkpIHtcbiAgICAgIC8vIFRPRE86IHJlc2V0IEJHXG4gICAgICBlbCA9IHJvb3RcbiAgICB9XG4gICAgaWYgKGNvZGUgPiA4OSAmJiBjb2RlIDwgOTgpIHtcbiAgICAgIGFkZEZHQ29sb3IoY29kZSAtIDkwICsgOClcbiAgICB9XG4gICAgaWYgKGNvZGUgPiA5OSAmJiBjb2RlIDwgMTA4KSB7XG4gICAgICBhZGRCR0NvbG9yKGNvZGUgLSAxMDAgKyA4KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHRva2VucyA9IFtcbiAgICB7XG4gICAgICAvLyBjaGFyYWN0ZXJzIHRvIHJlbW92ZSBjb21wbGV0ZWx5XG4gICAgICBwYXR0ZXJuOiAvXlxceDA4Ky8sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29udHJvbC1yZWdleFxuICAgICAgcmVwbGFjZXI6ICgpID0+ICcnXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyByZXBsYWNlcyB0aGUgbmV3IGxpbmVzXG4gICAgICBwYXR0ZXJuOiAvXlxcbisvLFxuICAgICAgcmVwbGFjZXI6IGZ1bmN0aW9uIG5ld2xpbmUgKCkge1xuICAgICAgICBlbC5jaGlsZHJlbi5wdXNoKHsgdGFnOiAnYnInIH0pXG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gYW5zaSBjb2Rlc1xuICAgICAgcGF0dGVybjogL15cXHgxYlxcWygoPzpcXGR7MSwzfT8pK3wpbS8sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29udHJvbC1yZWdleFxuICAgICAgcmVwbGFjZXI6IChtLCBncm91cCkgPT4ge1xuICAgICAgICBpZiAoZ3JvdXAudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGdyb3VwID0gJzAnXG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXAudHJpbVJpZ2h0KCcnKS5zcGxpdCgnJykuZm9yRWFjaCgoY29kZSkgPT4ge1xuICAgICAgICAgIHByb2Nlc3NDb2RlKCtjb2RlKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gJydcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIG1hbGZvcm1lZCBzZXF1ZW5jZXNcbiAgICAgIHBhdHRlcm46IC9eXFx4MWJcXFs/W1xcZF17MCwzfS8sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29udHJvbC1yZWdleFxuICAgICAgcmVwbGFjZXI6ICgpID0+ICcnXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBjYXRjaCBldmVyeXRoaW5nIGV4Y2VwdCBlc2NhcGUgY29kZXMgYW5kIG5ldyBsaW5lc1xuICAgICAgcGF0dGVybjogL14oW15cXHgxYlxceDA4XFxuXSspLywgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb250cm9sLXJlZ2V4XG4gICAgICByZXBsYWNlcjogKHRleHQpID0+IHtcbiAgICAgICAgZWwuY2hpbGRyZW4ucHVzaCh0ZXh0KVxuICAgICAgICByZXR1cm4gJydcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICAvLyByZXBsYWNlICcmbmJzcCcgd2hpY2ggc29tZXRpbWVzIGdldHMgZW5jb2RlZCB1c2luZyBjb2RlcyAxOTQgYW5kIDE2MC4uLlxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHUwMEMyKFtcXHUwMEEwLVxcdTAwQkZdKS9nLCAnJDEnKVxuXG4gIGxldCBsZW5ndGggPSB0ZXh0Lmxlbmd0aFxuICB3aGlsZSAobGVuZ3RoID4gMCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gdG9rZW5zW2ldXG4gICAgICBjb25zdCBtYXRjaGVzID0gdGV4dC5tYXRjaChoYW5kbGVyLnBhdHRlcm4pXG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGhhbmRsZXIucGF0dGVybiwgaGFuZGxlci5yZXBsYWNlcilcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRleHQubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGxlbmd0aCA9IHRleHQubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIHJvb3Rcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSAobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIG5leHRQcm9wcy5tZXNzYWdlICE9PSB0aGlzLnByb3BzLm1lc3NhZ2VcbiAgfVxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnQodGhpcy5wcm9wcy5tZXNzYWdlKVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlIChlbCwgaSkge1xuICAgICAgaWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGtleTogaSB9LCBlbClcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gZWwuY2hpbGRyZW4gPyBlbC5jaGlsZHJlbi5tYXAoY3JlYXRlKSA6IG51bGxcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGVsLnRhZywgeyBrZXk6IGksIHN0eWxlOiBlbC5zdHlsZSB9LCBjaGlsZHJlbilcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIG51bGwsIGNyZWF0ZShyZXN1bHQsIDApKVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/output-message.js
