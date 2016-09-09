(function() {
  var TermView, capitalize, path;

  path = require('path');

  TermView = require('./lib/TermView');

  capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  module.exports = {
    termViews: [],
    focusedTerminal: false,
    configDefaults: {
      autoRunCommand: null,
      titleTemplate: "Terminal ({{ bashName }})",
      colors: {
        normalBlack: '#2e3436',
        normalRed: '#cc0000',
        normalGreen: '#4e9a06',
        normalYellow: '#c4a000',
        normalBlue: '#3465a4',
        normalPurple: '#75507b',
        normalCyan: '#06989a',
        normalWhite: '#d3d7cf',
        brightBlack: '#555753',
        brightRed: '#ef2929',
        brightGreen: '#8ae234',
        brightYellow: '#fce94f',
        brightBlue: '#729fcf',
        brightPurple: '#ad7fa8',
        brightCyan: '#34e2e2',
        brightWhite: '#eeeeec'
      },
      scrollback: 1000,
      cursorBlink: true,
      shellArguments: (function(_arg) {
        var HOME, SHELL;
        SHELL = _arg.SHELL, HOME = _arg.HOME;
        switch (path.basename(SHELL.toLowerCase())) {
          case 'bash':
            return "--init-file " + (path.join(HOME, '.bash_profile'));
          case 'zsh':
            return "";
          default:
            return '';
        }
      })(process.env),
      openPanesInSameSplit: false
    },
    activate: function(state) {
      this.state = state;
      ['up', 'right', 'down', 'left'].forEach((function(_this) {
        return function(direction) {
          return atom.workspaceView.command("term2:open-split-" + direction, _this.splitTerm.bind(_this, direction));
        };
      })(this));
      atom.workspaceView.command("term2:open", this.newTerm.bind(this));
      atom.workspaceView.command("term2:pipe-path", this.pipeTerm.bind(this, 'path'));
      return atom.workspaceView.command("term2:pipe-selection", this.pipeTerm.bind(this, 'selection'));
    },
    getColors: function() {
      var brightBlack, brightBlue, brightCyan, brightGreen, brightPurple, brightRed, brightWhite, brightYellow, normalBlack, normalBlue, normalCyan, normalGreen, normalPurple, normalRed, normalWhite, normalYellow, _ref;
      _ref = atom.config.getSettings().term2.colors, normalBlack = _ref.normalBlack, normalRed = _ref.normalRed, normalGreen = _ref.normalGreen, normalYellow = _ref.normalYellow, normalBlue = _ref.normalBlue, normalPurple = _ref.normalPurple, normalCyan = _ref.normalCyan, normalWhite = _ref.normalWhite, brightBlack = _ref.brightBlack, brightRed = _ref.brightRed, brightGreen = _ref.brightGreen, brightYellow = _ref.brightYellow, brightBlue = _ref.brightBlue, brightPurple = _ref.brightPurple, brightCyan = _ref.brightCyan, brightWhite = _ref.brightWhite;
      return [normalBlack, normalRed, normalGreen, normalYellow, normalBlue, normalPurple, normalCyan, normalWhite, brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightPurple, brightCyan, brightWhite];
    },
    createTermView: function() {
      var opts, termView, _base;
      opts = {
        runCommand: atom.config.get('term2.autoRunCommand'),
        shellArguments: atom.config.get('term2.shellArguments'),
        titleTemplate: atom.config.get('term2.titleTemplate'),
        cursorBlink: atom.config.get('term2.cursorBlink'),
        colors: this.getColors()
      };
      termView = new TermView(opts);
      termView.on('remove', this.handleRemoveTerm.bind(this));
      if (typeof (_base = this.termViews).push === "function") {
        _base.push(termView);
      }
      return termView;
    },
    splitTerm: function(direction) {
      var activePane, item, openPanesInSameSplit, pane, splitter, termView;
      openPanesInSameSplit = atom.config.get('term2.openPanesInSameSplit');
      termView = this.createTermView();
      termView.on("click", (function(_this) {
        return function() {
          return _this.focusedTerminal = termView;
        };
      })(this));
      direction = capitalize(direction);
      splitter = (function(_this) {
        return function() {
          var pane;
          pane = activePane["split" + direction]({
            items: [termView]
          });
          activePane.termSplits[direction] = pane;
          return _this.focusedTerminal = [pane, pane.items[0]];
        };
      })(this);
      activePane = atom.workspace.getActivePane();
      activePane.termSplits || (activePane.termSplits = {});
      if (openPanesInSameSplit) {
        if (activePane.termSplits[direction] && activePane.termSplits[direction].items.length > 0) {
          pane = activePane.termSplits[direction];
          item = pane.addItem(termView);
          pane.activateItem(item);
          return this.focusedTerminal = [pane, item];
        } else {
          return splitter();
        }
      } else {
        return splitter();
      }
    },
    newTerm: function() {
      var item, pane, termView;
      termView = this.createTermView();
      pane = atom.workspace.getActivePane();
      item = pane.addItem(termView);
      return pane.activateItem(item);
    },
    pipeTerm: function(action) {
      var editor, item, pane, stream, _ref;
      editor = atom.workspace.getActiveEditor();
      stream = (function() {
        switch (action) {
          case 'path':
            return editor.getBuffer().file.path;
          case 'selection':
            return editor.getSelectedText();
        }
      })();
      if (stream && this.focusedTerminal) {
        if (Array.isArray(this.focusedTerminal)) {
          _ref = this.focusedTerminal, pane = _ref[0], item = _ref[1];
          pane.activateItem(item);
        } else {
          item = this.focusedTerminal;
        }
        item.pty.write(stream.trim());
        return item.term.focus();
      }
    },
    handleRemoveTerm: function(termView) {
      return this.termViews.splice(this.termViews.indexOf(termView), 1);
    },
    deactivate: function() {
      return this.termViews.forEach(function(view) {
        return view.deactivate();
      });
    },
    serialize: function() {
      var termViewsState;
      termViewsState = this.termViews.map(function(view) {
        return view.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLFNBQUMsR0FBRCxHQUFBO1dBQVEsR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQVAsQ0FBQSxDQUFBLEdBQXVCLEdBQUksU0FBSSxDQUFDLFdBQVQsQ0FBQSxFQUEvQjtFQUFBLENBSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBRUk7QUFBQSxJQUFBLFNBQUEsRUFBVyxFQUFYO0FBQUEsSUFDQSxlQUFBLEVBQWlCLEtBRGpCO0FBQUEsSUFHQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFBZ0IsSUFBaEI7QUFBQSxNQUNBLGFBQUEsRUFBZSwyQkFEZjtBQUFBLE1BRUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWMsU0FBZDtBQUFBLFFBQ0EsU0FBQSxFQUFjLFNBRGQ7QUFBQSxRQUVBLFdBQUEsRUFBYyxTQUZkO0FBQUEsUUFHQSxZQUFBLEVBQWMsU0FIZDtBQUFBLFFBSUEsVUFBQSxFQUFjLFNBSmQ7QUFBQSxRQUtBLFlBQUEsRUFBYyxTQUxkO0FBQUEsUUFNQSxVQUFBLEVBQWMsU0FOZDtBQUFBLFFBT0EsV0FBQSxFQUFjLFNBUGQ7QUFBQSxRQVFBLFdBQUEsRUFBYyxTQVJkO0FBQUEsUUFTQSxTQUFBLEVBQWMsU0FUZDtBQUFBLFFBVUEsV0FBQSxFQUFjLFNBVmQ7QUFBQSxRQVdBLFlBQUEsRUFBYyxTQVhkO0FBQUEsUUFZQSxVQUFBLEVBQWMsU0FaZDtBQUFBLFFBYUEsWUFBQSxFQUFjLFNBYmQ7QUFBQSxRQWNBLFVBQUEsRUFB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
//# sourceURL=/Users/ssun/.atom/packages/term2/index.coffee