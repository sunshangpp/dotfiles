(function() {
  var Change, CompositeDisposable, Delete, Surround;

  CompositeDisposable = require('atom').CompositeDisposable;

  Surround = require('./command/surround');

  Delete = require('./command/delete');

  Change = require('./command/change');

  module.exports = {
    config: {
      pairs: {
        type: 'array',
        "default": ['()', '{}', '[]', '""', "''", "``"],
        items: {
          type: 'string'
        }
      },
      changeSurroundCommand: {
        type: 'string',
        "default": 'c s'
      },
      deleteSurroundCommand: {
        type: 'string',
        "default": 'd s'
      },
      surroundCommand: {
        type: 'string',
        "default": 's'
      },
      deleteCommand: {
        type: 'string',
        "default": 'd s'
      }
    },
    activate: function(state) {
      this.commandClasses = [Surround, Delete, Change];
      return this.configLoop = atom.config.observe('vim-surround', (function(_this) {
        return function(config) {
          var cls, command, _i, _len, _ref, _results;
          if (_this.disposables != null) {
            _this.disposables.dispose();
          }
          _this.disposables = new CompositeDisposable;
          _this.commands = [];
          _ref = _this.commandClasses;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cls = _ref[_i];
            command = new cls(config);
            _this.commands.push(command);
            _results.push(_this.disposables.add(command.disposables));
          }
          return _results;
        };
      })(this));
    },
    consumeVimMode: function(vimMode) {
      return this.vimMode = vimMode;
    },
    deactivate: function() {
      return this.disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvdmltLXN1cnJvdW5kL2xpYi92aW0tc3Vycm91bmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxPQUFBLENBQVEsa0JBQVIsQ0FIVCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxrQkFBUixDQUpULENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixDQURUO0FBQUEsUUFFQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7T0FERjtBQUFBLE1BS0EscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BTkY7QUFBQSxNQVFBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVRGO0FBQUEsTUFXQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsR0FEVDtPQVpGO0FBQUEsTUFjQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQWZGO0tBREY7QUFBQSxJQW1CQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLENBQ2hCLFFBRGdCLEVBQ04sTUFETSxFQUNFLE1BREYsQ0FBbEIsQ0FBQTthQUlBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGNBQXBCLEVBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUNoRCxjQUFBLHNDQUFBO0FBQUEsVUFBQSxJQUEwQix5QkFBMUI7QUFBQSxZQUFBLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtXQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFEZixDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsUUFBRCxHQUFZLEVBSFosQ0FBQTtBQUtBO0FBQUE7ZUFBQSwyQ0FBQTsyQkFBQTtBQUNFLFlBQUEsT0FBQSxHQUFjLElBQUEsR0FBQSxDQUFJLE1BQUosQ0FBZCxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxPQUFmLENBREEsQ0FBQTtBQUFBLDBCQUVBLEtBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixPQUFPLENBQUMsV0FBekIsRUFGQSxDQURGO0FBQUE7MEJBTmdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEMsRUFMTjtJQUFBLENBbkJWO0FBQUEsSUFtQ0EsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTthQUFhLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBeEI7SUFBQSxDQW5DaEI7QUFBQSxJQXFDQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQU0sSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFBTjtJQUFBLENBckNaO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ssun/.atom/packages/vim-surround/lib/vim-surround.coffee
