Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var RenameDialog = (function () {
  function RenameDialog(identifier, callback) {
    var _this = this;

    _classCallCheck(this, RenameDialog);

    this.identifier = identifier;
    this.callback = callback;
    this.element = document.createElement('div');
    this.element.classList.add('gorename');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add(this.element, 'core:cancel', function () {
      _this.cancel();
    }));
    this.subscriptions.add(atom.commands.add(this.element, 'core:confirm', function () {
      _this.confirm();
    }));

    this.oncancel = null;

    var message = document.createElement('div');
    message.textContent = 'Rename ' + identifier + ' to:';
    message.style.padding = '1em';
    this.element.appendChild(message);

    this.input = document.createElement('atom-text-editor');
    this.input.setAttribute('mini', true);
    this.element.appendChild(this.input);
  }

  _createClass(RenameDialog, [{
    key: 'attach',
    value: function attach() {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.input.model.setText(this.identifier);
      this.input.model.selectAll();
      this.input.focus();
    }
  }, {
    key: 'onCancelled',
    value: function onCancelled(callback) {
      this.oncancel = callback;
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.close();
      if (this.oncancel) {
        this.oncancel();
        this.oncancel = null;
      }
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var newName = this.input.getModel().getText();
      this.close();
      this.callback(newName);
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

  return RenameDialog;
})();

exports.RenameDialog = RenameDialog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvcmVuYW1lL2xpYi9yZW5hbWUtZGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVrQyxNQUFNOztBQUZ4QyxXQUFXLENBQUE7O0lBSUwsWUFBWTtBQUNKLFdBRFIsWUFBWSxDQUNILFVBQVUsRUFBRSxRQUFRLEVBQUU7OzswQkFEL0IsWUFBWTs7QUFFZCxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUV0QyxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQU07QUFBRSxZQUFLLE1BQU0sRUFBRSxDQUFBO0tBQUUsQ0FBQyxDQUFDLENBQUE7QUFDL0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsWUFBTTtBQUFFLFlBQUssT0FBTyxFQUFFLENBQUE7S0FBRSxDQUFDLENBQUMsQ0FBQTs7QUFFakcsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7O0FBRXBCLFFBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDM0MsV0FBTyxDQUFDLFdBQVcsZUFBYSxVQUFVLFNBQU0sQ0FBQTtBQUNoRCxXQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDN0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQ3ZELFFBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDckM7O2VBckJHLFlBQVk7O1dBdUJULGtCQUFHO0FBQ1IsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN4QyxZQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87T0FDbkIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN6QyxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ25COzs7V0FFVyxxQkFBQyxRQUFRLEVBQUU7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7S0FDekI7OztXQUVNLGtCQUFHO0FBQ1IsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ1osVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUNmLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO09BQ3JCO0tBQ0Y7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM3QyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDWixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0tBQ3JCOzs7V0FFSyxpQkFBRztBQUNQLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDdEI7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTs7QUFFbkIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO0tBQ2xCOzs7U0E5REcsWUFBWTs7O1FBaUVWLFlBQVksR0FBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvcmVuYW1lL2xpYi9yZW5hbWUtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5jbGFzcyBSZW5hbWVEaWFsb2cge1xuICBjb25zdHJ1Y3RvciAoaWRlbnRpZmllciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmlkZW50aWZpZXIgPSBpZGVudGlmaWVyXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZ29yZW5hbWUnKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCAnY29yZTpjYW5jZWwnLCAoKSA9PiB7IHRoaXMuY2FuY2VsKCkgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsICdjb3JlOmNvbmZpcm0nLCAoKSA9PiB7IHRoaXMuY29uZmlybSgpIH0pKVxuXG4gICAgdGhpcy5vbmNhbmNlbCA9IG51bGxcblxuICAgIGxldCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gYFJlbmFtZSAke2lkZW50aWZpZXJ9IHRvOmBcbiAgICBtZXNzYWdlLnN0eWxlLnBhZGRpbmcgPSAnMWVtJ1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlKVxuXG4gICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F0b20tdGV4dC1lZGl0b3InKVxuICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdtaW5pJywgdHJ1ZSlcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dClcbiAgfVxuXG4gIGF0dGFjaCAoKSB7XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50XG4gICAgfSlcbiAgICB0aGlzLmlucHV0Lm1vZGVsLnNldFRleHQodGhpcy5pZGVudGlmaWVyKVxuICAgIHRoaXMuaW5wdXQubW9kZWwuc2VsZWN0QWxsKClcbiAgICB0aGlzLmlucHV0LmZvY3VzKClcbiAgfVxuXG4gIG9uQ2FuY2VsbGVkIChjYWxsYmFjaykge1xuICAgIHRoaXMub25jYW5jZWwgPSBjYWxsYmFja1xuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICB0aGlzLmNsb3NlKClcbiAgICBpZiAodGhpcy5vbmNhbmNlbCkge1xuICAgICAgdGhpcy5vbmNhbmNlbCgpXG4gICAgICB0aGlzLm9uY2FuY2VsID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGNvbmZpcm0gKCkge1xuICAgIGxldCBuZXdOYW1lID0gdGhpcy5pbnB1dC5nZXRNb2RlbCgpLmdldFRleHQoKVxuICAgIHRoaXMuY2xvc2UoKVxuICAgIHRoaXMuY2FsbGJhY2sobmV3TmFtZSlcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbFxuICB9XG5cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxuXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBudWxsXG4gIH1cbn1cblxuZXhwb3J0IHtSZW5hbWVEaWFsb2d9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/gorename/lib/rename-dialog.js
