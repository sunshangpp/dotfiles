(function() {
  var Base, CompositeDisposable,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Base = (function() {
    function Base(config) {
      this.disposables = new CompositeDisposable;
      this.curPairs = [];
      this.registerPairs(config.pairs);
    }

    Base.prototype.registerPairs = function(pairs) {
      var pair, x, _i, _len, _results;
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
        if (__indexOf.call(this.curPairs, pair) < 0) {
          this.registerPair(pair);
          _results.push(this.curPairs.push(pair));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Base.prototype.registerPair = function(pair) {
      var left, right, _ref;
      _ref = this.splitPair(pair), left = _ref[0], right = _ref[1];
      if (left !== right) {
        this.createPairBindings(left, "" + left + " ", " " + right);
      }
      return this.createPairBindings(right, left, right);
    };

    Base.prototype.createPairBindings = function(key, left, right) {
      var contextArg, fullCommand, i, keymapArg, keys, name, _i, _ref;
      name = "vim-surround:" + (this.getName(key));
      this.disposables.add(atom.commands.add(this.context, name, this.getRunner(left, right)));
      keys = "";
      for (i = _i = 0, _ref = key.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (i === 0) {
          keys = key[i];
        } else {
          keys = "" + keys + " " + key[i];
        }
      }
      keymapArg = {};
      fullCommand = "" + this.command + " " + keys;
      keymapArg[fullCommand] = name;
      contextArg = {};
      contextArg[this.context] = keymapArg;
      return this.disposables.add(atom.keymaps.add(name, contextArg));
    };

    Base.prototype.splitPair = function(pair) {
      return [pair.slice(0, +((pair.length / 2) - 1) + 1 || 9e9), pair.slice(pair.length / 2)];
    };

    return Base;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL2xpYi9jb21tYW5kL2Jhc2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRVIsSUFBQSxjQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsbUJBQWYsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELENBQWUsTUFBTSxDQUFDLEtBQXRCLENBSEEsQ0FEVztJQUFBLENBQWI7O0FBQUEsbUJBTUEsYUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsVUFBQSwyQkFBQTtBQUFBLE1BQUEsS0FBQTs7QUFBUzthQUFBLDRDQUFBO3dCQUFBO2NBQXNCLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBWCxJQUFpQixDQUFDLENBQUMsTUFBRixHQUFVLENBQVYsS0FBZTtBQUF0RCwwQkFBQSxFQUFBO1dBQUE7QUFBQTs7VUFBVCxDQUFBO0FBRUE7V0FBQSw0Q0FBQTt5QkFBQTtBQUNFLFFBQUEsSUFBRyxlQUFZLElBQUMsQ0FBQSxRQUFiLEVBQUEsSUFBQSxLQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQWQsQ0FBQSxDQUFBO0FBQUEsd0JBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBZixFQURBLENBREY7U0FBQSxNQUFBO2dDQUFBO1NBREY7QUFBQTtzQkFIYTtJQUFBLENBTmYsQ0FBQTs7QUFBQSxtQkFjQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLGlCQUFBO0FBQUEsTUFBQSxPQUFnQixJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsQ0FBaEIsRUFBQyxjQUFELEVBQU8sZUFBUCxDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUEsS0FBUSxLQUFYO0FBQ0UsUUFBQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBcEIsRUFBMEIsRUFBQSxHQUFHLElBQUgsR0FBUSxHQUFsQyxFQUF1QyxHQUFBLEdBQUcsS0FBMUMsQ0FBQSxDQURGO09BRkE7YUFJQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsS0FBcEIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakMsRUFMWTtJQUFBLENBZGQsQ0FBQTs7QUFBQSxtQkFxQkEsa0JBQUEsR0FBb0IsU0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLEtBQVosR0FBQTtBQUNsQixVQUFBLDJEQUFBO0FBQUEsTUFBQSxJQUFBLEdBQVEsZUFBQSxHQUFjLENBQUMsSUFBQyxDQUFBLE9BQUQsQ0FBUyxHQUFULENBQUQsQ0FBdEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYLEVBQWlCLEtBQWpCLENBQWxDLENBQWpCLENBSkEsQ0FBQTtBQUFBLE1BU0EsSUFBQSxHQUFPLEVBVFAsQ0FBQTtBQVVBLFdBQVMsbUdBQVQsR0FBQTtBQUNFLFFBQUEsSUFBRyxDQUFBLEtBQUssQ0FBUjtBQUNFLFVBQUEsSUFBQSxHQUFPLEdBQUksQ0FBQSxDQUFBLENBQVgsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLElBQUEsR0FBTyxFQUFBLEdBQUcsSUFBSCxHQUFRLEdBQVIsR0FBVyxHQUFJLENBQUEsQ0FBQSxDQUF0QixDQUhGO1NBREY7QUFBQSxPQVZBO0FBQUEsTUFxQkEsU0FBQSxHQUFZLEVBckJaLENBQUE7QUFBQSxNQXNCQSxXQUFBLEdBQWMsRUFBQSxHQUFHLElBQUMsQ0FBQSxPQUFKLEdBQVksR0FBWixHQUFlLElBdEI3QixDQUFBO0FBQUEsTUF1QkEsU0FBVSxDQUFBLFdBQUEsQ0FBVixHQUF5QixJQXZCekIsQ0FBQTtBQUFBLE1BeUJBLFVBQUEsR0FBYSxFQXpCYixDQUFBO0FBQUEsTUEwQkEsVUFBVyxDQUFBLElBQUMsQ0FBQSxPQUFELENBQVgsR0FBdUIsU0ExQnZCLENBQUE7YUE2QkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBYixDQUFpQixJQUFqQixFQUF1QixVQUF2QixDQUFqQixFQTlCa0I7SUFBQSxDQXJCcEIsQ0FBQTs7QUFBQSxtQkFxREEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsYUFBTyxDQUFDLElBQUssOENBQU4sRUFBNEIsSUFBSyx1QkFBakMsQ0FBUCxDQURTO0lBQUEsQ0FyRFgsQ0FBQTs7Z0JBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ssun/.atom/packages/vim-surround/lib/command/base.coffee
