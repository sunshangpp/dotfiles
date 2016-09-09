(function() {
  var Base, Change, CompositeDisposable, Selector,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Base = require('./base');

  Selector = require('./selector');

  module.exports = Change = (function() {
    function Change(config) {
      this.command = config.changeSurroundCommand;
      this.context = "atom-text-editor.vim-mode.normal-mode";
      this.disposables = new CompositeDisposable;
      this.curPairs = [];
      this.curPairsWithTarget = [];
      this.registerPairs(config.pairs);
    }

    Change.prototype.getName = function(key, targetKey) {
      return "change-" + key + "-to-" + targetKey;
    };

    Change.prototype.registerPairs = function(pairs) {
      var pair, target, x, _i, _len, _results;
      pairs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pairs.length; _i < _len; _i++) {
          x = pairs[_i];
          if (x.length > 0 && x.length % 2 === 0) {
            _results.push(x);
          }
        }
        return _results;
      })();
      _results = [];
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        pair = pairs[_i];
        _results.push((function() {
          var _j, _len1, _ref, _results1;
          _results1 = [];
          for (_j = 0, _len1 = pairs.length; _j < _len1; _j++) {
            target = pairs[_j];
            if (_ref = "" + pair + target, __indexOf.call(this.curPairs, _ref) < 0) {
              this.registerPair(pair, target);
              _results1.push(this.curPairs.push("" + pair + target));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Change.prototype.registerPair = function(pair, target) {
      var contextArg, fullCommand, key, keymapArg, left, name, right, targetKey, target_left, target_right, _i, _len, _ref, _ref1, _ref2, _results;
      _ref = this.splitPair(pair), left = _ref[0], right = _ref[1];
      _ref1 = this.splitPair(target), target_left = _ref1[0], target_right = _ref1[1];
      _ref2 = [left, right];
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        key = _ref2[_i];
        _results.push((function() {
          var _j, _len1, _ref3, _ref4, _results1;
          _ref3 = [target_left, target_right];
          _results1 = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            targetKey = _ref3[_j];
            if (_ref4 = "" + key + targetKey, __indexOf.call(this.curPairsWithTarget, _ref4) < 0) {
              name = "vim-surround:" + (this.getName(key, targetKey));
              if (pair !== target) {
                this.disposables.add(atom.commands.add(this.context, name, this.getRunner(pair, target)));
              }
              keymapArg = {};
              fullCommand = "" + this.command + " " + key + " " + targetKey;
              keymapArg[fullCommand] = name;
              contextArg = {};
              contextArg[this.context] = keymapArg;
              if (pair !== target) {
                this.disposables.add(atom.keymaps.add(name, contextArg));
              }
              _results1.push(this.curPairsWithTarget.push("" + key + targetKey));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Change.prototype.splitPair = function(pair) {
      return [pair.slice(0, +((pair.length / 2) - 1) + 1 || 9e9), pair.slice(pair.length / 2)];
    };

    Change.prototype.getRunner = function(from, to) {
      return function() {
        var editor, left, right, selector, target_left, target_right, _ref, _ref1;
        _ref = [from[0], from[1]], left = _ref[0], right = _ref[1];
        _ref1 = [to[0], to[1]], target_left = _ref1[0], target_right = _ref1[1];
        editor = atom.workspace.getActiveTextEditor();
        selector = new Selector(editor, left, right);
        return editor.transact(function() {
          var cursorPos;
          cursorPos = editor.getCursorBufferPosition();
          selector.inside().select();
          editor.selections.forEach(function(selection) {
            var text;
            text = selection.getText();
            editor.setCursorBufferPosition(cursorPos);
            selector.outside().select();
            return editor.selections.forEach(function(selection) {
              return selection.insertText("" + target_left + text + target_right);
            });
          });
          return editor.setCursorBufferPosition(cursorPos);
        });
      };
    };

    return Change;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL2xpYi9jb21tYW5kL2NoYW5nZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNSLElBQUEsZ0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BQU0sQ0FBQyxxQkFBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyx1Q0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFGZixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBSFosQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGtCQUFELEdBQXNCLEVBSnRCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFELENBQWUsTUFBTSxDQUFDLEtBQXRCLENBTEEsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBUUEsT0FBQSxHQUFTLFNBQUMsR0FBRCxFQUFNLFNBQU4sR0FBQTthQUFxQixTQUFBLEdBQVMsR0FBVCxHQUFhLE1BQWIsR0FBbUIsVUFBeEM7SUFBQSxDQVJULENBQUE7O0FBQUEscUJBVUEsYUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsS0FBQTs7QUFBUzthQUFBLDRDQUFBO3dCQUFBO2NBQXNC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

//# sourceURL=/Users/ssun/.atom/packages/vim-surround/lib/command/change.coffee
