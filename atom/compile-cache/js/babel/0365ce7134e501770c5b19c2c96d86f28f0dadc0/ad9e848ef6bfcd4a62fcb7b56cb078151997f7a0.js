'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Message = require('./message');

var BottomPanel = (function (_HTMLElement) {
  function BottomPanel() {
    _classCallCheck(this, BottomPanel);

    _get(Object.getPrototypeOf(BottomPanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomPanel, _HTMLElement);

  _createClass(BottomPanel, [{
    key: 'prepare',
    value: function prepare() {
      // priority because of https://github.com/AtomLinter/Linter/issues/668
      this.panel = atom.workspace.addBottomPanel({ item: this, visible: false, priority: 500 });
      this.panelVisibility = true;
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.panel.destroy();
    }
  }, {
    key: 'updateMessages',
    value: function updateMessages(messages, isProject) {
      this.clear();
      if (!messages.length) {
        return this.visibility = false;
      }
      this.visibility = true;
      messages.forEach((function (message) {
        this.appendChild(Message.fromMessage(message, { addPath: isProject, cloneNode: true }));
      }).bind(this));
    }
  }, {
    key: 'clear',
    value: function clear() {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    }
  }, {
    key: 'panelVisibility',
    get: function get() {
      return this._panelVisibility;
    },
    set: function set(value) {
      this._panelVisibility = value;
      if (value) this.panel.show();else this.panel.hide();
    }
  }, {
    key: 'visibility',
    get: function get() {
      return this._visibility;
    },
    set: function set(value) {
      this._visibility = value;
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }]);

  return BottomPanel;
})(HTMLElement);

module.exports = document.registerElement('linter-panel', { prototype: BottomPanel.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7OztBQUVaLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7SUFFNUIsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7O1lBQVgsV0FBVzs7ZUFBWCxXQUFXOztXQUNSLG1CQUFFOztBQUVQLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUE7QUFDdkYsVUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7QUFDM0IsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ00sbUJBQUU7QUFDUCxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3JCOzs7V0FvQmEsd0JBQUMsUUFBUSxFQUFFLFNBQVMsRUFBQztBQUNqQyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDWixVQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQztBQUNsQixlQUFPLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO09BQy9CO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDdEIsY0FBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBLFVBQVMsT0FBTyxFQUFDO0FBQ2hDLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdEYsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0tBQ2Q7OztXQUNJLGlCQUFFO0FBQ0wsYUFBTSxJQUFJLENBQUMsVUFBVSxFQUFDO0FBQ3BCLFlBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ2xDO0tBQ0Y7OztTQWpDa0IsZUFBRTtBQUNuQixhQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtLQUM3QjtTQUNrQixhQUFDLEtBQUssRUFBQztBQUN4QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0FBQzdCLFVBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUEsS0FDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBQ2EsZUFBRTtBQUNkLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtLQUN4QjtTQUNhLGFBQUMsS0FBSyxFQUFDO0FBQ25CLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQ3hCLFVBQUcsS0FBSyxFQUFDO0FBQ1AsWUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMvQixNQUFNO0FBQ0wsWUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDbEM7S0FDRjs7O1NBNUJHLFdBQVc7R0FBUyxXQUFXOztBQThDckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxFQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5sZXQgTWVzc2FnZSA9IHJlcXVpcmUoJy4vbWVzc2FnZScpXG5cbmNsYXNzIEJvdHRvbVBhbmVsIGV4dGVuZHMgSFRNTEVsZW1lbnR7XG4gIHByZXBhcmUoKXtcbiAgICAvLyBwcmlvcml0eSBiZWNhdXNlIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL0xpbnRlci9pc3N1ZXMvNjY4XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiB0aGlzLCB2aXNpYmxlOiBmYWxzZSwgcHJpb3JpdHk6IDUwMH0pXG4gICAgdGhpcy5wYW5lbFZpc2liaWxpdHkgPSB0cnVlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkZXN0cm95KCl7XG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxuICBnZXQgcGFuZWxWaXNpYmlsaXR5KCl7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsVmlzaWJpbGl0eVxuICB9XG4gIHNldCBwYW5lbFZpc2liaWxpdHkodmFsdWUpe1xuICAgIHRoaXMuX3BhbmVsVmlzaWJpbGl0eSA9IHZhbHVlXG4gICAgaWYodmFsdWUpIHRoaXMucGFuZWwuc2hvdygpXG4gICAgZWxzZSB0aGlzLnBhbmVsLmhpZGUoKVxuICB9XG4gIGdldCB2aXNpYmlsaXR5KCl7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2liaWxpdHlcbiAgfVxuICBzZXQgdmlzaWJpbGl0eSh2YWx1ZSl7XG4gICAgdGhpcy5fdmlzaWJpbGl0eSA9IHZhbHVlXG4gICAgaWYodmFsdWUpe1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgIH1cbiAgfVxuICB1cGRhdGVNZXNzYWdlcyhtZXNzYWdlcywgaXNQcm9qZWN0KXtcbiAgICB0aGlzLmNsZWFyKClcbiAgICBpZighbWVzc2FnZXMubGVuZ3RoKXtcbiAgICAgIHJldHVybiB0aGlzLnZpc2liaWxpdHkgPSBmYWxzZVxuICAgIH1cbiAgICB0aGlzLnZpc2liaWxpdHkgPSB0cnVlXG4gICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5mcm9tTWVzc2FnZShtZXNzYWdlLCB7YWRkUGF0aDogaXNQcm9qZWN0LCBjbG9uZU5vZGU6IHRydWV9KSlcbiAgICB9LmJpbmQodGhpcykpXG4gIH1cbiAgY2xlYXIoKXtcbiAgICB3aGlsZSh0aGlzLmZpcnN0Q2hpbGQpe1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmZpcnN0Q2hpbGQpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItcGFuZWwnLCB7cHJvdG90eXBlOiBCb3R0b21QYW5lbC5wcm90b3R5cGV9KVxuIl19