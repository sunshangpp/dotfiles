'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewTemplate = '\n<div class="godoc-container">\n  <div class="godoc-scroller">\n    <div class="godoc-tooltip">\n      <div id="godoc-message"></div>\n      <div id="godoc-progress">\n        <span class=\'loading loading-spinner-large inline-block\'></span>\n        </div>\n      <div id="close-button" class="close icon icon-x"></div>\n    </div>\n  </div>\n</div>\n';

var GodocView = (function (_HTMLElement) {
  _inherits(GodocView, _HTMLElement);

  function GodocView() {
    _classCallCheck(this, GodocView);

    _get(Object.getPrototypeOf(GodocView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GodocView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.innerHTML = ViewTemplate;
      this.message = this.querySelector('#godoc-message');
      this.progress = this.querySelector('#godoc-progress');
      this.closebutton = this.querySelector('#close-button');
      this.closebutton.addEventListener('click', function () {
        if (_this.onclose) {
          _this.onclose();
        }
      });
      this.setInProgress();
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.classList.add('godoc');
      this.addActiveClassToEditor();
    }
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.removeActiveClassFromEditor();
    }
  }, {
    key: 'updateText',
    value: function updateText(text) {
      this.message.innerText = text;
      this.message.classList.remove('godoc-in-progress');
      this.progress.classList.remove('godoc-in-progress');
      this.addActiveClassToEditor();
    }
  }, {
    key: 'setInProgress',
    value: function setInProgress() {
      this.message.classList.add('godoc-in-progress');
      this.progress.classList.add('godoc-in-progress');
    }
  }, {
    key: 'setCloseCallback',
    value: function setCloseCallback(onclose) {
      this.onclose = onclose;
    }
  }, {
    key: 'addActiveClassToEditor',
    value: function addActiveClassToEditor() {
      var editor = atom.views.getView(atom.workspace.getActiveTextEditor());
      if (editor && editor.classList) {
        editor.classList.add('godoc-display-active');
      }
    }
  }, {
    key: 'removeActiveClassFromEditor',
    value: function removeActiveClassFromEditor() {
      var editor = atom.views.getView(atom.workspace.getActiveTextEditor());
      if (editor && editor.classList) {
        editor.classList.remove('godoc-display-active');
      }
    }
  }], [{
    key: 'create',
    value: function create() {
      return document.createElement('godoc-view');
    }
  }]);

  return GodocView;
})(HTMLElement);

exports['default'] = GodocView;

document.registerElement('godoc-view', {
  prototype: GodocView.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZG9jL2xpYi9nb2RvYy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7QUFFWCxJQUFNLFlBQVksdVdBWWpCLENBQUE7O0lBRW9CLFNBQVM7WUFBVCxTQUFTOztXQUFULFNBQVM7MEJBQVQsU0FBUzs7K0JBQVQsU0FBUzs7O2VBQVQsU0FBUzs7V0FFWiwyQkFBRzs7O0FBQ2pCLFVBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFBO0FBQzdCLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ25ELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3JELFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUN0RCxVQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQy9DLFlBQUksTUFBSyxPQUFPLEVBQUU7QUFDaEIsZ0JBQUssT0FBTyxFQUFFLENBQUE7U0FDZjtPQUNGLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUNyQjs7O1dBRWdCLDRCQUFHO0FBQ2xCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzNCLFVBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO0tBQzlCOzs7V0FFZ0IsNEJBQUc7QUFDbEIsVUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUE7S0FDbkM7OztXQUVVLG9CQUFDLElBQUksRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDN0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDbEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDbkQsVUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUE7S0FDOUI7OztXQUVhLHlCQUFHO0FBQ2YsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7S0FDakQ7OztXQUVnQiwwQkFBQyxPQUFPLEVBQUU7QUFDekIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7S0FDdkI7OztXQUVzQixrQ0FBRztBQUN4QixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtBQUNyRSxVQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQzlCLGNBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7T0FDN0M7S0FDRjs7O1dBRTJCLHVDQUFHO0FBQzdCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0FBQ3JFLFVBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDOUIsY0FBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtPQUNoRDtLQUNGOzs7V0FFYSxrQkFBRztBQUNmLGFBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUM1Qzs7O1NBeERrQixTQUFTO0dBQVMsV0FBVzs7cUJBQTdCLFNBQVM7O0FBMkQ5QixRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRTtBQUNyQyxXQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVM7Q0FDL0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZG9jL2xpYi9nb2RvYy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgVmlld1RlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cImdvZG9jLWNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwiZ29kb2Mtc2Nyb2xsZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiZ29kb2MtdG9vbHRpcFwiPlxuICAgICAgPGRpdiBpZD1cImdvZG9jLW1lc3NhZ2VcIj48L2Rpdj5cbiAgICAgIDxkaXYgaWQ9XCJnb2RvYy1wcm9ncmVzc1wiPlxuICAgICAgICA8c3BhbiBjbGFzcz0nbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItbGFyZ2UgaW5saW5lLWJsb2NrJz48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBpZD1cImNsb3NlLWJ1dHRvblwiIGNsYXNzPVwiY2xvc2UgaWNvbiBpY29uLXhcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbmBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR29kb2NWaWV3IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gIGNyZWF0ZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSBWaWV3VGVtcGxhdGVcbiAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJyNnb2RvYy1tZXNzYWdlJylcbiAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcjZ29kb2MtcHJvZ3Jlc3MnKVxuICAgIHRoaXMuY2xvc2VidXR0b24gPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZS1idXR0b24nKVxuICAgIHRoaXMuY2xvc2VidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vbmNsb3NlKSB7XG4gICAgICAgIHRoaXMub25jbG9zZSgpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnNldEluUHJvZ3Jlc3MoKVxuICB9XG5cbiAgYXR0YWNoZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdnb2RvYycpXG4gICAgdGhpcy5hZGRBY3RpdmVDbGFzc1RvRWRpdG9yKClcbiAgfVxuXG4gIGRldGFjaGVkQ2FsbGJhY2sgKCkge1xuICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3NGcm9tRWRpdG9yKClcbiAgfVxuXG4gIHVwZGF0ZVRleHQgKHRleHQpIHtcbiAgICB0aGlzLm1lc3NhZ2UuaW5uZXJUZXh0ID0gdGV4dFxuICAgIHRoaXMubWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdnb2RvYy1pbi1wcm9ncmVzcycpXG4gICAgdGhpcy5wcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdnb2RvYy1pbi1wcm9ncmVzcycpXG4gICAgdGhpcy5hZGRBY3RpdmVDbGFzc1RvRWRpdG9yKClcbiAgfVxuXG4gIHNldEluUHJvZ3Jlc3MgKCkge1xuICAgIHRoaXMubWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdnb2RvYy1pbi1wcm9ncmVzcycpXG4gICAgdGhpcy5wcm9ncmVzcy5jbGFzc0xpc3QuYWRkKCdnb2RvYy1pbi1wcm9ncmVzcycpXG4gIH1cblxuICBzZXRDbG9zZUNhbGxiYWNrIChvbmNsb3NlKSB7XG4gICAgdGhpcy5vbmNsb3NlID0gb25jbG9zZVxuICB9XG5cbiAgYWRkQWN0aXZlQ2xhc3NUb0VkaXRvciAoKSB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgaWYgKGVkaXRvciAmJiBlZGl0b3IuY2xhc3NMaXN0KSB7XG4gICAgICBlZGl0b3IuY2xhc3NMaXN0LmFkZCgnZ29kb2MtZGlzcGxheS1hY3RpdmUnKVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFjdGl2ZUNsYXNzRnJvbUVkaXRvciAoKSB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgaWYgKGVkaXRvciAmJiBlZGl0b3IuY2xhc3NMaXN0KSB7XG4gICAgICBlZGl0b3IuY2xhc3NMaXN0LnJlbW92ZSgnZ29kb2MtZGlzcGxheS1hY3RpdmUnKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUgKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdnb2RvYy12aWV3JylcbiAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2dvZG9jLXZpZXcnLCB7XG4gIHByb3RvdHlwZTogR29kb2NWaWV3LnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/godoc/lib/godoc-view.js
