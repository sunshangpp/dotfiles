Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactForAtom = require('react-for-atom');

var _reactRedux = require('react-redux');

var _variablesJsx = require('./variables.jsx');

var _variablesJsx2 = _interopRequireDefault(_variablesJsx);

var _utils = require('./utils');

var _store = require('./store');

var _delve = require('./delve');

var Delve = _interopRequireWildcard(_delve);

var _commands = require('./commands');

var Commands = _interopRequireWildcard(_commands);

'use babel';

var Panel = (function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel(props) {
    var _this = this;

    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, props);

    ['onResizeStart', 'onResize', 'onResizeEnd', 'onCommandClick', 'onStacktraceClick', 'onGoroutineClick', 'onBreakpointClick', 'onRemoveBreakpointClick'].forEach(function (fn) {
      _this[fn] = _this[fn].bind(_this);
    });

    this.state = {
      expanded: {
        stacktrace: true,
        goroutines: true,
        variables: true,
        breakpoints: true
      }
    };
  }

  _createClass(Panel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(np) {
      this.setState({ width: np.width });
    }
  }, {
    key: 'render',
    value: function render() {
      // TODO: add the busy overlay if state == 'busy' || 'starting'
      return _reactForAtom.React.createElement(
        'div',
        { className: 'go-debug-panel-root', style: { width: this.props.width } },
        _reactForAtom.React.createElement('div', { className: 'go-debug-panel-resizer', onMouseDown: this.onResizeStart }),
        this.renderCommands(),
        this.renderArgs(),
        _reactForAtom.React.createElement(
          'div',
          { className: 'go-debug-panel-content' },
          this.renderStacktrace(),
          this.renderGoroutines(),
          this.renderVariables(),
          this.renderBreakpoints()
        ),
        _reactForAtom.React.createElement(
          'button',
          { type: 'button', onClick: this.props.onToggleOutput,
            className: 'btn go-debug-btn-flat go-debug-panel-showoutput' },
          'Toggle output panel'
        )
      );
    }
  }, {
    key: 'renderCommands',
    value: function renderCommands() {
      var layout = Commands.getPanelCommands();
      return _reactForAtom.React.createElement(
        'div',
        { className: 'go-debug-panel-commands' },
        layout.map(this.renderCommand, this)
      );
    }
  }, {
    key: 'renderCommand',
    value: function renderCommand(cmd) {
      return _reactForAtom.React.createElement(
        'button',
        { key: cmd.cmd, type: 'button', className: 'btn go-debug-btn-flat', title: cmd.title,
          'data-cmd': cmd.cmd, onClick: this.onCommandClick },
        cmd.icon ? _reactForAtom.React.createElement('span', { className: 'icon-' + cmd.icon }) : null,
        cmd.text
      );
    }
  }, {
    key: 'renderArgs',
    value: function renderArgs() {
      return _reactForAtom.React.createElement(
        'div',
        null,
        _reactForAtom.React.createElement('input', { className: 'go-debug-panel-args native-key-bindings', value: this.props.args,
          placeholder: 'arguments passed to delve after --', onChange: this.props.onArgsChange }),
        _reactForAtom.React.createElement('input', { className: 'go-debug-panel-args native-key-bindings', value: this.props.fileOverride,
          placeholder: 'Insert a file to run instead of the current file (relative to project root)', onChange: this.props.onFileOverrideChange })
      );
    }
  }, {
    key: 'renderStacktrace',
    value: function renderStacktrace() {
      var _this2 = this;

      var selectedStacktrace = this.props.selectedStacktrace;

      var items = (this.props.stacktrace || []).map(function (st, index) {
        var className = selectedStacktrace === index ? 'selected' : null;
        var file = shortenPath(st.file);
        var fn = st['function'].name.split('/').pop();
        return _reactForAtom.React.createElement(
          'div',
          { key: index, className: className, 'data-index': index, onClick: _this2.onStacktraceClick },
          _reactForAtom.React.createElement(
            'div',
            null,
            fn
          ),
          _reactForAtom.React.createElement(
            'div',
            null,
            '@ ',
            file,
            ':',
            st.line
          )
        );
      });
      return this.renderExpandable('stacktrace', 'Stacktrace', items);
    }
  }, {
    key: 'renderGoroutines',
    value: function renderGoroutines() {
      var _this3 = this;

      var selectedGoroutine = this.props.selectedGoroutine;

      var items = (this.props.goroutines || []).map(function (_ref) {
        var id = _ref.id;
        var userCurrentLoc = _ref.userCurrentLoc;

        var className = selectedGoroutine === id ? 'selected' : null;
        var file = shortenPath(userCurrentLoc.file);
        var fn = userCurrentLoc['function'].name.split('/').pop();
        return _reactForAtom.React.createElement(
          'div',
          { key: id, className: className, 'data-id': id, onClick: _this3.onGoroutineClick },
          _reactForAtom.React.createElement(
            'div',
            null,
            fn
          ),
          _reactForAtom.React.createElement(
            'div',
            null,
            '@ ',
            file,
            ':',
            userCurrentLoc.line
          )
        );
      });
      return this.renderExpandable('goroutines', 'Goroutines', items);
    }
  }, {
    key: 'renderVariables',
    value: function renderVariables() {
      return this.renderExpandable('variables', 'Variables', _reactForAtom.React.createElement(_variablesJsx2['default'], null));
    }
  }, {
    key: 'renderBreakpoints',
    value: function renderBreakpoints() {
      var _this4 = this;

      var items = this.props.breakpoints.map(function (_ref2) {
        var file = _ref2.file;
        var line = _ref2.line;
        var state = _ref2.state;
        var message = _ref2.message;

        return _reactForAtom.React.createElement(
          'div',
          { key: file + '|' + line, 'data-file': file, 'data-line': line,
            title: message || '', onClick: _this4.onBreakpointClick },
          _reactForAtom.React.createElement('span', { className: 'icon-x', onClick: _this4.onRemoveBreakpointClick }),
          _reactForAtom.React.createElement('span', { className: 'go-debug-breakpoint go-debug-breakpoint-state-' + state }),
          shortenPath(file),
          ' : ',
          line + 1
        );
      });
      return this.renderExpandable('breakpoints', 'Breakpoints', items);
    }
  }, {
    key: 'renderExpandable',
    value: function renderExpandable(name, text, content) {
      var expanded = this.state.expanded[name];
      return _reactForAtom.React.createElement(
        'div',
        { className: 'go-debug-expandable', 'data-expanded': expanded },
        _reactForAtom.React.createElement(
          'div',
          { className: 'go-debug-expandable-header', onClick: this.onExpandChange.bind(this, name) },
          _reactForAtom.React.createElement('span', { className: 'go-debug-toggle icon icon-chevron-' + (expanded ? 'down' : 'right') }),
          text
        ),
        _reactForAtom.React.createElement(
          'div',
          { className: 'go-debug-expandable-body go-debug-panel-' + name },
          content
        )
      );
    }
  }, {
    key: 'onResizeStart',
    value: function onResizeStart() {
      document.addEventListener('mousemove', this.onResize, false);
      document.addEventListener('mouseup', this.onResizeEnd, false);
      this.setState({ resizing: true });
    }
  }, {
    key: 'onResize',
    value: function onResize(_ref3) {
      var pageX = _ref3.pageX;

      if (!this.state.resizing) {
        return;
      }
      var node = _reactForAtom.ReactDOM.findDOMNode(this).offsetParent;
      this.props.onUpdateWidth(node.getBoundingClientRect().width + node.offsetLeft - pageX);
    }
  }, {
    key: 'onResizeEnd',
    value: function onResizeEnd() {
      if (!this.state.resizing) {
        return;
      }
      document.removeEventListener('mousemove', this.onResize, false);
      document.removeEventListener('mouseup', this.onResizeEnd, false);
      this.setState({ resizing: false });
    }
  }, {
    key: 'onExpandChange',
    value: function onExpandChange(name) {
      this.state.expanded[name] = !this.state.expanded[name];
      this.setState(this.state);
    }
  }, {
    key: 'onCommandClick',
    value: function onCommandClick(ev) {
      var command = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.cmd');
      if (!command) {
        return;
      }
      Commands.get(command).action();
    }
  }, {
    key: 'onStacktraceClick',
    value: function onStacktraceClick(ev) {
      var index = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.index');
      if (index) {
        Delve.selectStacktrace(+index);
      }
    }
  }, {
    key: 'onGoroutineClick',
    value: function onGoroutineClick(ev) {
      var id = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.id');
      if (id) {
        Delve.selectGoroutine(+id);
      }
    }
  }, {
    key: 'onBreakpointClick',
    value: function onBreakpointClick(ev) {
      var _this5 = this;

      var file = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.file');
      if (file) {
        (function () {
          var line = +(0, _utils.elementPropInHierarcy)(ev.target, 'dataset.line');

          // check if the file even exists
          _this5.fileExists(file).then(function () {
            atom.workspace.open(file, { initialLine: line, searchAllPanes: true }).then(function () {
              var editor = atom.workspace.getActiveTextEditor();
              editor.scrollToBufferPosition([line, 0], { center: true });
            });
          })['catch'](function () {
            return _this5.removeBreakpoints(file);
          });
        })();
      }
    }
  }, {
    key: 'fileExists',
    value: function fileExists(file) {
      return Promise.all(atom.project.getDirectories().map(function (dir) {
        return dir.getFile(dir.relativize(file)).exists();
      })).then(function (results) {
        if (results.indexOf(true) === -1) {
          return Promise.reject();
        }
        return Promise.resolve();
      });
    }
  }, {
    key: 'removeBreakpoints',
    value: function removeBreakpoints(file) {
      var noti = atom.notifications.addWarning('The file ' + file + ' does not exist anymore.', {
        dismissable: true,
        detail: 'Remove all breakpoints for this file?',
        buttons: [{
          text: 'Yes',
          onDidClick: function onDidClick() {
            noti.dismiss();
            (0, _store.getBreakpoints)(file).forEach(function (bp) {
              return Delve.removeBreakpoint(file, bp.line);
            });
          }
        }, {
          text: 'No',
          onDidClick: function onDidClick() {
            return noti.dismiss();
          }
        }]
      });
    }
  }, {
    key: 'onRemoveBreakpointClick',
    value: function onRemoveBreakpointClick(ev) {
      var file = (0, _utils.elementPropInHierarcy)(ev.target, 'dataset.file');
      if (file) {
        var line = +(0, _utils.elementPropInHierarcy)(ev.target, 'dataset.line');
        Delve.removeBreakpoint(file, line);
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  }]);

  return Panel;
})(_reactForAtom.React.Component);

var PanelListener = (0, _reactRedux.connect)(function (state) {
  return {
    width: state.panel.width,
    state: state.delve.state,
    args: state.delve.args,
    stacktrace: state.delve.stacktrace,
    goroutines: state.delve.goroutines,
    breakpoints: state.delve.breakpoints,
    selectedStacktrace: state.delve.selectedStacktrace,
    selectedGoroutine: state.delve.selectedGoroutine,
    fileOverride: state.delve.fileOverride
  };
}, function (dispatch) {
  return {
    onUpdateWidth: function onUpdateWidth(width) {
      dispatch({ type: 'SET_PANEL_WIDTH', width: width });
    },
    onToggleOutput: function onToggleOutput() {
      dispatch({ type: 'TOGGLE_OUTPUT' });
    },
    onArgsChange: function onArgsChange(ev) {
      dispatch({ type: 'UPDATE_ARGS', args: ev.target.value });
    },
    onFileOverrideChange: function onFileOverrideChange(ev) {
      dispatch({ type: 'UPDATE_FILE_OVERRIDE', fileOverride: ev.target.value });
    }
  };
})(Panel);

var atomPanel = undefined;

function onStoreChange() {
  var panelState = _store.store.getState().panel;
  if (panelState.visible !== atomPanel.isVisible()) {
    atomPanel[panelState.visible ? 'show' : 'hide']();
  }
}

var subscriptions = undefined;
exports['default'] = {
  init: function init() {
    subscriptions = new _atom.CompositeDisposable({ dispose: _store.store.subscribe(onStoreChange) });

    var item = document.createElement('div');
    item.className = 'go-debug-panel';
    atomPanel = atom.workspace.addRightPanel({ item: item, visible: _store.store.getState().panel.visible });

    _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(
      _reactRedux.Provider,
      { store: _store.store },
      _reactForAtom.React.createElement(PanelListener, null)
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

function shortenPath(file) {
  return _path2['default'].normalize(file).split(_path2['default'].sep).slice(-2).join(_path2['default'].sep);
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9wYW5lbC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7b0JBQ3pCLE1BQU07Ozs7NEJBQ1MsZ0JBQWdCOzswQkFDZCxhQUFhOzs0QkFFekIsaUJBQWlCOzs7O3FCQUNELFNBQVM7O3FCQUNULFNBQVM7O3FCQUN4QixTQUFTOztJQUFwQixLQUFLOzt3QkFDUyxZQUFZOztJQUExQixRQUFROztBQVhwQixXQUFXLENBQUE7O0lBYUwsS0FBSztZQUFMLEtBQUs7O0FBQ0csV0FEUixLQUFLLENBQ0ksS0FBSyxFQUFFOzs7MEJBRGhCLEtBQUs7O0FBRVAsK0JBRkUsS0FBSyw2Q0FFRCxLQUFLLEVBQUU7O0FBRWIsS0FDRSxlQUFlLEVBQ2YsVUFBVSxFQUNWLGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsbUJBQW1CLEVBQ25CLGtCQUFrQixFQUNsQixtQkFBbUIsRUFDbkIseUJBQXlCLENBQzFCLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRSxFQUFLO0FBQ2hCLFlBQUssRUFBRSxDQUFDLEdBQUcsTUFBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLE9BQU0sQ0FBQTtLQUMvQixDQUFDLENBQUE7O0FBRUYsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGNBQVEsRUFBRTtBQUNSLGtCQUFVLEVBQUUsSUFBSTtBQUNoQixrQkFBVSxFQUFFLElBQUk7QUFDaEIsaUJBQVMsRUFBRSxJQUFJO0FBQ2YsbUJBQVcsRUFBRSxJQUFJO09BQ2xCO0tBQ0YsQ0FBQTtHQUNGOztlQXpCRyxLQUFLOztXQTJCaUIsbUNBQUMsRUFBRSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7S0FDbkM7OztXQUVNLGtCQUFHOztBQUVSLGFBQU87O1VBQUssU0FBUyxFQUFDLHFCQUFxQixFQUFD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SSxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBSyxHQUFHLENBQUMsQ0FBQTtDQUNyRSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1kZWJ1Zy9saWIvcGFuZWwuanN4Iiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgUmVhY3QsIFJlYWN0RE9NIH0gZnJvbSAncmVhY3QtZm9yLWF0b20nXG5pbXBvcnQgeyBQcm92aWRlciwgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xuXG5pbXBvcnQgVmFyaWFibGVzIGZyb20gJy4vdmFyaWFibGVzLmpzeCdcbmltcG9ydCB7IGVsZW1lbnRQcm9wSW5IaWVyYXJjeSB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBzdG9yZSwgZ2V0QnJlYWtwb2ludHMgfSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0ICogYXMgRGVsdmUgZnJvbSAnLi9kZWx2ZSdcbmltcG9ydCAqIGFzIENvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMnXG5cbmNsYXNzIFBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgW1xuICAgICAgJ29uUmVzaXplU3RhcnQnLFxuICAgICAgJ29uUmVzaXplJyxcbiAgICAgICdvblJlc2l6ZUVuZCcsXG4gICAgICAnb25Db21tYW5kQ2xpY2snLFxuICAgICAgJ29uU3RhY2t0cmFjZUNsaWNrJyxcbiAgICAgICdvbkdvcm91dGluZUNsaWNrJyxcbiAgICAgICdvbkJyZWFrcG9pbnRDbGljaycsXG4gICAgICAnb25SZW1vdmVCcmVha3BvaW50Q2xpY2snXG4gICAgXS5mb3JFYWNoKChmbikgPT4ge1xuICAgICAgdGhpc1tmbl0gPSB0aGlzW2ZuXS5iaW5kKHRoaXMpXG4gICAgfSlcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBleHBhbmRlZDoge1xuICAgICAgICBzdGFja3RyYWNlOiB0cnVlLFxuICAgICAgICBnb3JvdXRpbmVzOiB0cnVlLFxuICAgICAgICB2YXJpYWJsZXM6IHRydWUsXG4gICAgICAgIGJyZWFrcG9pbnRzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobnApIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgd2lkdGg6IG5wLndpZHRoIH0pXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIC8vIFRPRE86IGFkZCB0aGUgYnVzeSBvdmVybGF5IGlmIHN0YXRlID09ICdidXN5JyB8fCAnc3RhcnRpbmcnXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctcGFuZWwtcm9vdFwiIHN0eWxlPXt7d2lkdGg6IHRoaXMucHJvcHMud2lkdGh9fT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctcGFuZWwtcmVzaXplclwiIG9uTW91c2VEb3duPXt0aGlzLm9uUmVzaXplU3RhcnR9IC8+XG4gICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAge3RoaXMucmVuZGVyQXJncygpfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnby1kZWJ1Zy1wYW5lbC1jb250ZW50XCI+XG4gICAgICAgIHt0aGlzLnJlbmRlclN0YWNrdHJhY2UoKX1cbiAgICAgICAge3RoaXMucmVuZGVyR29yb3V0aW5lcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJWYXJpYWJsZXMoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQnJlYWtwb2ludHMoKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblRvZ2dsZU91dHB1dH1cbiAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGdvLWRlYnVnLWJ0bi1mbGF0IGdvLWRlYnVnLXBhbmVsLXNob3dvdXRwdXRcIj5cbiAgICAgICAgVG9nZ2xlIG91dHB1dCBwYW5lbFxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIH1cblxuICByZW5kZXJDb21tYW5kcyAoKSB7XG4gICAgY29uc3QgbGF5b3V0ID0gQ29tbWFuZHMuZ2V0UGFuZWxDb21tYW5kcygpXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctcGFuZWwtY29tbWFuZHNcIj57bGF5b3V0Lm1hcCh0aGlzLnJlbmRlckNvbW1hbmQsIHRoaXMpfTwvZGl2PlxuICB9XG4gIHJlbmRlckNvbW1hbmQgKGNtZCkge1xuICAgIHJldHVybiA8YnV0dG9uIGtleT17Y21kLmNtZH0gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBnby1kZWJ1Zy1idG4tZmxhdFwiIHRpdGxlPXtjbWQudGl0bGV9XG4gICAgICBkYXRhLWNtZD17Y21kLmNtZH0gb25DbGljaz17dGhpcy5vbkNvbW1hbmRDbGlja30+XG4gICAgICB7Y21kLmljb24gPyA8c3BhbiBjbGFzc05hbWU9eydpY29uLScgKyBjbWQuaWNvbn0gLz4gOiBudWxsfVxuICAgICAge2NtZC50ZXh0fVxuICAgIDwvYnV0dG9uPlxuICB9XG5cbiAgcmVuZGVyQXJncyAoKSB7XG4gICAgcmV0dXJuIDxkaXY+XG4gICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZ28tZGVidWctcGFuZWwtYXJncyBuYXRpdmUta2V5LWJpbmRpbmdzXCIgdmFsdWU9e3RoaXMucHJvcHMuYXJnc31cbiAgICAgICAgcGxhY2Vob2xkZXI9XCJhcmd1bWVudHMgcGFzc2VkIHRvIGRlbHZlIGFmdGVyIC0tXCIgb25DaGFuZ2U9e3RoaXMucHJvcHMub25BcmdzQ2hhbmdlfSAvPlxuXG4gICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZ28tZGVidWctcGFuZWwtYXJncyBuYXRpdmUta2V5LWJpbmRpbmdzXCIgdmFsdWU9e3RoaXMucHJvcHMuZmlsZU92ZXJyaWRlfVxuICAgICAgICBwbGFjZWhvbGRlcj1cIkluc2VydCBhIGZpbGUgdG8gcnVuIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgZmlsZSAocmVsYXRpdmUgdG8gcHJvamVjdCByb290KVwiIG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uRmlsZU92ZXJyaWRlQ2hhbmdlfSAvPlxuXG4gICAgPC9kaXY+XG4gIH1cblxuICByZW5kZXJTdGFja3RyYWNlICgpIHtcbiAgICBjb25zdCB7IHNlbGVjdGVkU3RhY2t0cmFjZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGl0ZW1zID0gKHRoaXMucHJvcHMuc3RhY2t0cmFjZSB8fCBbXSkubWFwKChzdCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHNlbGVjdGVkU3RhY2t0cmFjZSA9PT0gaW5kZXggPyAnc2VsZWN0ZWQnIDogbnVsbFxuICAgICAgY29uc3QgZmlsZSA9IHNob3J0ZW5QYXRoKHN0LmZpbGUpXG4gICAgICBjb25zdCBmbiA9IHN0LmZ1bmN0aW9uLm5hbWUuc3BsaXQoJy8nKS5wb3AoKVxuICAgICAgcmV0dXJuIDxkaXYga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IGRhdGEtaW5kZXg9e2luZGV4fSBvbkNsaWNrPXt0aGlzLm9uU3RhY2t0cmFjZUNsaWNrfT5cbiAgICAgICAgPGRpdj57Zm59PC9kaXY+XG4gICAgICAgIDxkaXY+QCB7ZmlsZX06e3N0LmxpbmV9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICB9KVxuICAgIHJldHVybiB0aGlzLnJlbmRlckV4cGFuZGFibGUoJ3N0YWNrdHJhY2UnLCAnU3RhY2t0cmFjZScsIGl0ZW1zKVxuICB9XG5cbiAgcmVuZGVyR29yb3V0aW5lcyAoKSB7XG4gICAgY29uc3QgeyBzZWxlY3RlZEdvcm91dGluZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGl0ZW1zID0gKHRoaXMucHJvcHMuZ29yb3V0aW5lcyB8fCBbXSkubWFwKCh7IGlkLCB1c2VyQ3VycmVudExvYyB9KSA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBzZWxlY3RlZEdvcm91dGluZSA9PT0gaWQgPyAnc2VsZWN0ZWQnIDogbnVsbFxuICAgICAgY29uc3QgZmlsZSA9IHNob3J0ZW5QYXRoKHVzZXJDdXJyZW50TG9jLmZpbGUpXG4gICAgICBjb25zdCBmbiA9IHVzZXJDdXJyZW50TG9jLmZ1bmN0aW9uLm5hbWUuc3BsaXQoJy8nKS5wb3AoKVxuICAgICAgcmV0dXJuIDxkaXYga2V5PXtpZH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IGRhdGEtaWQ9e2lkfSBvbkNsaWNrPXt0aGlzLm9uR29yb3V0aW5lQ2xpY2t9PlxuICAgICAgICA8ZGl2Pntmbn08L2Rpdj5cbiAgICAgICAgPGRpdj5AIHtmaWxlfTp7dXNlckN1cnJlbnRMb2MubGluZX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyRXhwYW5kYWJsZSgnZ29yb3V0aW5lcycsICdHb3JvdXRpbmVzJywgaXRlbXMpXG4gIH1cblxuICByZW5kZXJWYXJpYWJsZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlckV4cGFuZGFibGUoJ3ZhcmlhYmxlcycsICdWYXJpYWJsZXMnLCA8VmFyaWFibGVzIC8+KVxuICB9XG5cbiAgcmVuZGVyQnJlYWtwb2ludHMgKCkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wcm9wcy5icmVha3BvaW50cy5tYXAoKHsgZmlsZSwgbGluZSwgc3RhdGUsIG1lc3NhZ2UgfSkgPT4ge1xuICAgICAgcmV0dXJuIDxkaXYga2V5PXtmaWxlICsgJ3wnICsgbGluZX0gZGF0YS1maWxlPXtmaWxlfSBkYXRhLWxpbmU9e2xpbmV9XG4gICAgICAgIHRpdGxlPXttZXNzYWdlIHx8ICcnfSBvbkNsaWNrPXt0aGlzLm9uQnJlYWtwb2ludENsaWNrfT5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi14XCIgb25DbGljaz17dGhpcy5vblJlbW92ZUJyZWFrcG9pbnRDbGlja30gLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXsnZ28tZGVidWctYnJlYWtwb2ludCBnby1kZWJ1Zy1icmVha3BvaW50LXN0YXRlLScgKyBzdGF0ZX0gLz5cbiAgICAgICAgeyBzaG9ydGVuUGF0aChmaWxlKSB9IDogeyBsaW5lICsgMSB9XG4gICAgICA8L2Rpdj5cbiAgICB9KVxuICAgIHJldHVybiB0aGlzLnJlbmRlckV4cGFuZGFibGUoJ2JyZWFrcG9pbnRzJywgJ0JyZWFrcG9pbnRzJywgaXRlbXMpXG4gIH1cblxuICByZW5kZXJFeHBhbmRhYmxlIChuYW1lLCB0ZXh0LCBjb250ZW50KSB7XG4gICAgY29uc3QgZXhwYW5kZWQgPSB0aGlzLnN0YXRlLmV4cGFuZGVkW25hbWVdXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctZXhwYW5kYWJsZVwiIGRhdGEtZXhwYW5kZWQ9e2V4cGFuZGVkfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ28tZGVidWctZXhwYW5kYWJsZS1oZWFkZXJcIiBvbkNsaWNrPXt0aGlzLm9uRXhwYW5kQ2hhbmdlLmJpbmQodGhpcywgbmFtZSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnby1kZWJ1Zy10b2dnbGUgaWNvbiBpY29uLWNoZXZyb24tJyArIChleHBhbmRlZCA/ICdkb3duJyA6ICdyaWdodCcpfSAvPlxuICAgICAgICB7dGV4dH1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Bnby1kZWJ1Zy1leHBhbmRhYmxlLWJvZHkgZ28tZGVidWctcGFuZWwtJHtuYW1lfWB9Pntjb250ZW50fTwvZGl2PlxuICAgIDwvZGl2PlxuICB9XG5cbiAgb25SZXNpemVTdGFydCAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vblJlc2l6ZSwgZmFsc2UpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25SZXNpemVFbmQsIGZhbHNlKVxuICAgIHRoaXMuc2V0U3RhdGUoeyByZXNpemluZzogdHJ1ZSB9KVxuICB9XG4gIG9uUmVzaXplICh7IHBhZ2VYIH0pIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUucmVzaXppbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBub2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcykub2Zmc2V0UGFyZW50XG4gICAgdGhpcy5wcm9wcy5vblVwZGF0ZVdpZHRoKG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBub2RlLm9mZnNldExlZnQgLSBwYWdlWClcbiAgfVxuICBvblJlc2l6ZUVuZCAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnJlc2l6aW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vblJlc2l6ZSwgZmFsc2UpXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25SZXNpemVFbmQsIGZhbHNlKVxuICAgIHRoaXMuc2V0U3RhdGUoeyByZXNpemluZzogZmFsc2UgfSlcbiAgfVxuXG4gIG9uRXhwYW5kQ2hhbmdlIChuYW1lKSB7XG4gICAgdGhpcy5zdGF0ZS5leHBhbmRlZFtuYW1lXSA9ICF0aGlzLnN0YXRlLmV4cGFuZGVkW25hbWVdXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICB9XG5cbiAgb25Db21tYW5kQ2xpY2sgKGV2KSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGVsZW1lbnRQcm9wSW5IaWVyYXJjeShldi50YXJnZXQsICdkYXRhc2V0LmNtZCcpXG4gICAgaWYgKCFjb21tYW5kKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgQ29tbWFuZHMuZ2V0KGNvbW1hbmQpLmFjdGlvbigpXG4gIH1cblxuICBvblN0YWNrdHJhY2VDbGljayAoZXYpIHtcbiAgICBjb25zdCBpbmRleCA9IGVsZW1lbnRQcm9wSW5IaWVyYXJjeShldi50YXJnZXQsICdkYXRhc2V0LmluZGV4JylcbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIERlbHZlLnNlbGVjdFN0YWNrdHJhY2UoK2luZGV4KVxuICAgIH1cbiAgfVxuXG4gIG9uR29yb3V0aW5lQ2xpY2sgKGV2KSB7XG4gICAgY29uc3QgaWQgPSBlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5pZCcpXG4gICAgaWYgKGlkKSB7XG4gICAgICBEZWx2ZS5zZWxlY3RHb3JvdXRpbmUoK2lkKVxuICAgIH1cbiAgfVxuXG4gIG9uQnJlYWtwb2ludENsaWNrIChldikge1xuICAgIGNvbnN0IGZpbGUgPSBlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5maWxlJylcbiAgICBpZiAoZmlsZSkge1xuICAgICAgY29uc3QgbGluZSA9ICtlbGVtZW50UHJvcEluSGllcmFyY3koZXYudGFyZ2V0LCAnZGF0YXNldC5saW5lJylcblxuICAgICAgLy8gY2hlY2sgaWYgdGhlIGZpbGUgZXZlbiBleGlzdHNcbiAgICAgIHRoaXMuZmlsZUV4aXN0cyhmaWxlKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlLCB7IGluaXRpYWxMaW5lOiBsaW5lLCBzZWFyY2hBbGxQYW5lczogdHJ1ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24oW2xpbmUsIDBdLCB7IGNlbnRlcjogdHJ1ZSB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnJlbW92ZUJyZWFrcG9pbnRzKGZpbGUpKVxuICAgIH1cbiAgfVxuXG4gIGZpbGVFeGlzdHMgKGZpbGUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5tYXAoXG4gICAgICAgIChkaXIpID0+IGRpci5nZXRGaWxlKGRpci5yZWxhdGl2aXplKGZpbGUpKS5leGlzdHMoKVxuICAgICAgKVxuICAgICkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgaWYgKHJlc3VsdHMuaW5kZXhPZih0cnVlKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0pXG4gIH1cblxuICByZW1vdmVCcmVha3BvaW50cyAoZmlsZSkge1xuICAgIGNvbnN0IG5vdGkgPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgIGBUaGUgZmlsZSAke2ZpbGV9IGRvZXMgbm90IGV4aXN0IGFueW1vcmUuYCxcbiAgICAgIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGRldGFpbDogJ1JlbW92ZSBhbGwgYnJlYWtwb2ludHMgZm9yIHRoaXMgZmlsZT8nLFxuICAgICAgICBidXR0b25zOiBbe1xuICAgICAgICAgIHRleHQ6ICdZZXMnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIG5vdGkuZGlzbWlzcygpXG4gICAgICAgICAgICBnZXRCcmVha3BvaW50cyhmaWxlKS5mb3JFYWNoKChicCkgPT4gRGVsdmUucmVtb3ZlQnJlYWtwb2ludChmaWxlLCBicC5saW5lKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0ZXh0OiAnTm8nLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IG5vdGkuZGlzbWlzcygpXG4gICAgICAgIH1dXG4gICAgICB9KVxuICB9XG5cbiAgb25SZW1vdmVCcmVha3BvaW50Q2xpY2sgKGV2KSB7XG4gICAgY29uc3QgZmlsZSA9IGVsZW1lbnRQcm9wSW5IaWVyYXJjeShldi50YXJnZXQsICdkYXRhc2V0LmZpbGUnKVxuICAgIGlmIChmaWxlKSB7XG4gICAgICBjb25zdCBsaW5lID0gK2VsZW1lbnRQcm9wSW5IaWVyYXJjeShldi50YXJnZXQsICdkYXRhc2V0LmxpbmUnKVxuICAgICAgRGVsdmUucmVtb3ZlQnJlYWtwb2ludChmaWxlLCBsaW5lKVxuICAgICAgZXYucHJldmVudERlZmF1bHQoKVxuICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgUGFuZWxMaXN0ZW5lciA9IGNvbm5lY3QoXG4gIChzdGF0ZSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogc3RhdGUucGFuZWwud2lkdGgsXG4gICAgICBzdGF0ZTogc3RhdGUuZGVsdmUuc3RhdGUsXG4gICAgICBhcmdzOiBzdGF0ZS5kZWx2ZS5hcmdzLFxuICAgICAgc3RhY2t0cmFjZTogc3RhdGUuZGVsdmUuc3RhY2t0cmFjZSxcbiAgICAgIGdvcm91dGluZXM6IHN0YXRlLmRlbHZlLmdvcm91dGluZXMsXG4gICAgICBicmVha3BvaW50czogc3RhdGUuZGVsdmUuYnJlYWtwb2ludHMsXG4gICAgICBzZWxlY3RlZFN0YWNrdHJhY2U6IHN0YXRlLmRlbHZlLnNlbGVjdGVkU3RhY2t0cmFjZSxcbiAgICAgIHNlbGVjdGVkR29yb3V0aW5lOiBzdGF0ZS5kZWx2ZS5zZWxlY3RlZEdvcm91dGluZSxcbiAgICAgIGZpbGVPdmVycmlkZTogc3RhdGUuZGVsdmUuZmlsZU92ZXJyaWRlXG4gICAgfVxuICB9LFxuICAoZGlzcGF0Y2gpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgb25VcGRhdGVXaWR0aDogKHdpZHRoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogJ1NFVF9QQU5FTF9XSURUSCcsIHdpZHRoIH0pXG4gICAgICB9LFxuICAgICAgb25Ub2dnbGVPdXRwdXQ6ICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiAnVE9HR0xFX09VVFBVVCcgfSlcbiAgICAgIH0sXG4gICAgICBvbkFyZ3NDaGFuZ2U6IChldikgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6ICdVUERBVEVfQVJHUycsIGFyZ3M6IGV2LnRhcmdldC52YWx1ZSB9KVxuICAgICAgfSxcbiAgICAgIG9uRmlsZU92ZXJyaWRlQ2hhbmdlOiAoZXYpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiAnVVBEQVRFX0ZJTEVfT1ZFUlJJREUnLCBmaWxlT3ZlcnJpZGU6IGV2LnRhcmdldC52YWx1ZSB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuKShQYW5lbClcblxubGV0IGF0b21QYW5lbFxuXG5mdW5jdGlvbiBvblN0b3JlQ2hhbmdlICgpIHtcbiAgY29uc3QgcGFuZWxTdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCkucGFuZWxcbiAgaWYgKHBhbmVsU3RhdGUudmlzaWJsZSAhPT0gYXRvbVBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgYXRvbVBhbmVsW3BhbmVsU3RhdGUudmlzaWJsZSA/ICdzaG93JyA6ICdoaWRlJ10oKVxuICB9XG59XG5cbmxldCBzdWJzY3JpcHRpb25zXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQgKCkge1xuICAgIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHsgZGlzcG9zZTogc3RvcmUuc3Vic2NyaWJlKG9uU3RvcmVDaGFuZ2UpIH1cbiAgICApXG5cbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBpdGVtLmNsYXNzTmFtZSA9ICdnby1kZWJ1Zy1wYW5lbCdcbiAgICBhdG9tUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsKHsgaXRlbSwgdmlzaWJsZTogc3RvcmUuZ2V0U3RhdGUoKS5wYW5lbC52aXNpYmxlIH0pXG5cbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgPFBhbmVsTGlzdGVuZXIgLz5cbiAgICAgIDwvUHJvdmlkZXI+LFxuICAgICAgaXRlbVxuICAgIClcbiAgfSxcbiAgZGlzcG9zZSAoKSB7XG4gICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBzdWJzY3JpcHRpb25zID0gbnVsbFxuXG4gICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShhdG9tUGFuZWwuZ2V0SXRlbSgpKVxuXG4gICAgYXRvbVBhbmVsLmRlc3Ryb3koKVxuICAgIGF0b21QYW5lbCA9IG51bGxcbiAgfVxufVxuXG5mdW5jdGlvbiBzaG9ydGVuUGF0aCAoZmlsZSkge1xuICByZXR1cm4gcGF0aC5ub3JtYWxpemUoZmlsZSkuc3BsaXQocGF0aC5zZXApLnNsaWNlKC0yKS5qb2luKHBhdGguc2VwKVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/panel.jsx
