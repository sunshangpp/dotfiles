'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var NavigationStack = (function () {
  function NavigationStack() {
    var maxSize = arguments.length <= 0 || arguments[0] === undefined ? 500 : arguments[0];

    _classCallCheck(this, NavigationStack);

    if (maxSize >= 1) {
      this.maxSize = maxSize;
    } else {
      this.maxSize = 1;
    }
    this.stack = [];
  }

  _createClass(NavigationStack, [{
    key: 'dispose',
    value: function dispose() {
      this.maxSize = null;
      this.stack = null;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return !this.stack || !this.stack.length || this.stack.length <= 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.stack = [];
    }
  }, {
    key: 'pushCurrentLocation',
    value: function pushCurrentLocation() {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      var loc = {
        position: editor.getCursorBufferPosition(),
        file: editor.getURI()
      };

      if (!loc.file || !loc.position || !loc.position.row || !loc.position.column) {
        return;
      }

      this.push(loc);
      return;
    }

    // Returns a promise that is complete when navigation is done.
  }, {
    key: 'restorePreviousLocation',
    value: function restorePreviousLocation() {
      var _this = this;

      if (this.isEmpty()) {
        return Promise.resolve();
      }

      if (!this.stack || this.stack.length < 1) {
        return Promise.resolve();
      }

      var lastLocation = this.stack.shift();
      return atom.workspace.open(lastLocation.file).then(function (editor) {
        _this.moveEditorCursorTo(editor, lastLocation.position);
        return;
      });
    }
  }, {
    key: 'moveEditorCursorTo',
    value: function moveEditorCursorTo(editor, pos) {
      if (!editor) {
        return;
      }
      editor.scrollToBufferPosition(pos);
      editor.setCursorBufferPosition(pos);
      return;
    }
  }, {
    key: 'push',
    value: function push(loc) {
      if (!this.stack || !loc) {
        return;
      }

      if (this.stack.length > 0 && this.compareLoc(this.stack[0], loc)) {
        return;
      }
      this.stack.unshift(loc);
      if (this.stack.length > this.maxSize) {
        this.stack.splice(-1, this.stack.length - this.maxSize);
      }
      return;
    }
  }, {
    key: 'compareLoc',
    value: function compareLoc(loc1, loc2) {
      if (!loc1 && !loc2) {
        return true;
      }

      if (!loc1 || !loc2) {
        return false;
      }

      return loc1.filepath === loc2.filepath && this.comparePosition(loc1.position, loc2.position);
    }
  }, {
    key: 'comparePosition',
    value: function comparePosition(pos1, pos2) {
      if (!pos1 && !pos2) {
        return true;
      }

      if (!pos1 || !pos2) {
        return false;
      }

      return pos1.column === pos2.column && pos1.row === pos2.row;
    }
  }]);

  return NavigationStack;
})();

exports.NavigationStack = NavigationStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL25hdmlnYXRvci1nb2RlZi9saWIvbmF2aWdhdGlvbi1zdGFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7SUFFTCxlQUFlO0FBQ1AsV0FEUixlQUFlLEdBQ1M7UUFBZixPQUFPLHlEQUFHLEdBQUc7OzBCQUR0QixlQUFlOztBQUVqQixRQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7S0FDdkIsTUFBTTtBQUNMLFVBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO0tBQ2pCO0FBQ0QsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7R0FDaEI7O2VBUkcsZUFBZTs7V0FVWCxtQkFBRztBQUNULFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO0tBQ2xCOzs7V0FFTyxtQkFBRztBQUNULGFBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFBO0tBQ25FOzs7V0FFSyxpQkFBRztBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0tBQ2hCOzs7V0FFbUIsK0JBQUc7QUFDckIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ2pELFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxlQUFNO09BQ1A7QUFDRCxVQUFJLEdBQUcsR0FBRztBQUNSLGdCQUFRLEVBQUUsTUFBTSxDQUFDLHVCQUF1QixFQUFFO0FBQzFDLFlBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFO09BQ3RCLENBQUE7O0FBRUQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElB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LENBQUMsR0FBRyxBQUFDLENBQUM7S0FDbEU7OztTQXhHRyxlQUFlOzs7UUEyR2IsZUFBZSxHQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvbmF2aWdhdG9yLWdvZGVmL2xpYi9uYXZpZ2F0aW9uLXN0YWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY2xhc3MgTmF2aWdhdGlvblN0YWNrIHtcbiAgY29uc3RydWN0b3IgKG1heFNpemUgPSA1MDApIHtcbiAgICBpZiAobWF4U2l6ZSA+PSAxKSB7XG4gICAgICB0aGlzLm1heFNpemUgPSBtYXhTaXplXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWF4U2l6ZSA9IDFcbiAgICB9XG4gICAgdGhpcy5zdGFjayA9IFtdXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICB0aGlzLm1heFNpemUgPSBudWxsXG4gICAgdGhpcy5zdGFjayA9IG51bGxcbiAgfVxuXG4gIGlzRW1wdHkgKCkge1xuICAgIHJldHVybiAhdGhpcy5zdGFjayB8fCAhdGhpcy5zdGFjay5sZW5ndGggfHwgdGhpcy5zdGFjay5sZW5ndGggPD0gMFxuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIHRoaXMuc3RhY2sgPSBbXVxuICB9XG5cbiAgcHVzaEN1cnJlbnRMb2NhdGlvbiAoKSB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGV0IGxvYyA9IHtcbiAgICAgIHBvc2l0aW9uOiBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSxcbiAgICAgIGZpbGU6IGVkaXRvci5nZXRVUkkoKVxuICAgIH1cblxuICAgIGlmICghbG9jLmZpbGUgfHwgIWxvYy5wb3NpdGlvbiB8fCAhbG9jLnBvc2l0aW9uLnJvdyB8fCAhbG9jLnBvc2l0aW9uLmNvbHVtbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5wdXNoKGxvYylcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgY29tcGxldGUgd2hlbiBuYXZpZ2F0aW9uIGlzIGRvbmUuXG4gIHJlc3RvcmVQcmV2aW91c0xvY2F0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGFjayB8fCB0aGlzLnN0YWNrLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGxldCBsYXN0TG9jYXRpb24gPSB0aGlzLnN0YWNrLnNoaWZ0KClcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihsYXN0TG9jYXRpb24uZmlsZSkudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLm1vdmVFZGl0b3JDdXJzb3JUbyhlZGl0b3IsIGxhc3RMb2NhdGlvbi5wb3NpdGlvbilcbiAgICAgIHJldHVyblxuICAgIH0pXG4gIH1cblxuICBtb3ZlRWRpdG9yQ3Vyc29yVG8gKGVkaXRvciwgcG9zKSB7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihwb3MpXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvcylcbiAgICByZXR1cm5cbiAgfVxuXG4gIHB1c2ggKGxvYykge1xuICAgIGlmICghdGhpcy5zdGFjayB8fCAhbG9jKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPiAwICYmIHRoaXMuY29tcGFyZUxvYyh0aGlzLnN0YWNrWzBdLCBsb2MpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zdGFjay51bnNoaWZ0KGxvYylcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPiB0aGlzLm1heFNpemUpIHtcbiAgICAgIHRoaXMuc3RhY2suc3BsaWNlKC0xLCB0aGlzLnN0YWNrLmxlbmd0aCAtIHRoaXMubWF4U2l6ZSlcbiAgICB9XG4gICAgcmV0dXJuXG4gIH1cblxuICBjb21wYXJlTG9jIChsb2MxLCBsb2MyKSB7XG4gICAgaWYgKCFsb2MxICYmICFsb2MyKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmICghbG9jMSB8fCAhbG9jMikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIChsb2MxLmZpbGVwYXRoID09PSBsb2MyLmZpbGVwYXRoKSAmJiB0aGlzLmNvbXBhcmVQb3NpdGlvbihsb2MxLnBvc2l0aW9uLCBsb2MyLnBvc2l0aW9uKVxuICB9XG5cbiAgY29tcGFyZVBvc2l0aW9uIChwb3MxLCBwb3MyKSB7XG4gICAgaWYgKCFwb3MxICYmICFwb3MyKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmICghcG9zMSB8fCAhcG9zMikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuICgocG9zMS5jb2x1bW4gPT09IHBvczIuY29sdW1uKSAmJiAocG9zMS5yb3cgPT09IHBvczIucm93KSlcbiAgfVxufVxuXG5leHBvcnQge05hdmlnYXRpb25TdGFja31cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/navigator-godef/lib/navigation-stack.js
