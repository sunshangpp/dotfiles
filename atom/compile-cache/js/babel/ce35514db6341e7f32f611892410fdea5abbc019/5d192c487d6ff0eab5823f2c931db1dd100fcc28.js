Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var GetDialog = (function () {
  function GetDialog(identifier, callback) {
    var _this = this;

    _classCallCheck(this, GetDialog);

    this.callback = callback;
    this.element = document.createElement('div');
    this.element.classList.add('goget');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add(this.element, 'core:cancel', function () {
      _this.cancel();
    }));
    this.subscriptions.add(atom.commands.add(this.element, 'core:confirm', function () {
      _this.confirm();
    }));

    var message = document.createElement('div');
    message.textContent = 'Which Go Package Would You Like To Get?';
    message.style.padding = '1em';
    this.element.appendChild(message);

    this.input = document.createElement('atom-text-editor');
    this.input.setAttribute('mini', true);
    this.input.getModel().setText(identifier);
    this.element.appendChild(this.input);
  }

  _createClass(GetDialog, [{
    key: 'attach',
    value: function attach() {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.input.focus();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.close();
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var pack = this.input.getModel().getText();
      this.close();
      if (this.callback) {
        this.callback(pack);
      }
      this.callback = null;
    }
  }, {
    key: 'close',
    value: function close() {
      this.subscriptions.dispose();
      if (this.element) {
        this.element.remove();
      }
      this.element = null;

      if (this.panel) {
        this.panel.destroy();
      }
      this.panel = null;
    }
  }]);

  return GetDialog;
})();

exports.GetDialog = GetDialog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWdldC9saWIvZ2V0LWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFa0MsTUFBTTs7QUFGeEMsV0FBVyxDQUFBOztJQUlMLFNBQVM7QUFDRCxXQURSLFNBQVMsQ0FDQSxVQUFVLEVBQUUsUUFBUSxFQUFFOzs7MEJBRC9CLFNBQVM7O0FBRVgsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFbkMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFNO0FBQUUsWUFBSyxNQUFNLEVBQUUsQ0FBQTtLQUFFLENBQUMsQ0FBQyxDQUFBO0FBQy9GLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFlBQU07QUFBRSxZQUFLLE9BQU8sRUFBRSxDQUFBO0tBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRWpHLFFBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDM0MsV0FBTyxDQUFDLFdBQVcsR0FBRyx5Q0FBeUMsQ0FBQTtBQUMvRCxXQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDN0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQ3ZELFFBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN6QyxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDckM7O2VBbkJHLFNBQVM7O1dBcUJOLGtCQUFHO0FBQ1IsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN4QyxZQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87T0FDbkIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNuQjs7O1dBRU0sa0JBQUc7QUFDUixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDYjs7O1dBRU8sbUJBQUc7QUFDVCxVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzFDLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNaLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3BCO0FBQ0QsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7S0FDckI7OztXQUVLLGlCQUFHO0FBQ1AsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUN0QjtBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVuQixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3JCO0FBQ0QsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7S0FDbEI7OztTQXBERyxTQUFTOzs7UUF1RFAsU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tZ2V0L2xpYi9nZXQtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5jbGFzcyBHZXREaWFsb2cge1xuICBjb25zdHJ1Y3RvciAoaWRlbnRpZmllciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdnb2dldCcpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsICdjb3JlOmNhbmNlbCcsICgpID0+IHsgdGhpcy5jYW5jZWwoKSB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwgJ2NvcmU6Y29uZmlybScsICgpID0+IHsgdGhpcy5jb25maXJtKCkgfSkpXG5cbiAgICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICdXaGljaCBHbyBQYWNrYWdlIFdvdWxkIFlvdSBMaWtlIFRvIEdldD8nXG4gICAgbWVzc2FnZS5zdHlsZS5wYWRkaW5nID0gJzFlbSdcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZSlcblxuICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXRleHQtZWRpdG9yJylcbiAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWluaScsIHRydWUpXG4gICAgdGhpcy5pbnB1dC5nZXRNb2RlbCgpLnNldFRleHQoaWRlbnRpZmllcilcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dClcbiAgfVxuXG4gIGF0dGFjaCAoKSB7XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50XG4gICAgfSlcbiAgICB0aGlzLmlucHV0LmZvY3VzKClcbiAgfVxuXG4gIGNhbmNlbCAoKSB7XG4gICAgdGhpcy5jbG9zZSgpXG4gIH1cblxuICBjb25maXJtICgpIHtcbiAgICBsZXQgcGFjayA9IHRoaXMuaW5wdXQuZ2V0TW9kZWwoKS5nZXRUZXh0KClcbiAgICB0aGlzLmNsb3NlKClcbiAgICBpZiAodGhpcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5jYWxsYmFjayhwYWNrKVxuICAgIH1cbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbFxuICB9XG5cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxuXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBudWxsXG4gIH1cbn1cblxuZXhwb3J0IHtHZXREaWFsb2d9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-get/lib/get-dialog.js
