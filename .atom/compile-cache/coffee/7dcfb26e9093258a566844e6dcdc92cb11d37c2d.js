(function() {
  var $, Task, TermView, Terminal, View, debounce, fs, keypather, last, os, path, renderTemplate, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = require('util');

  path = require('path');

  os = require('os');

  fs = require('fs-plus');

  debounce = require('debounce');

  Terminal = require('atom-term.js');

  keypather = require('keypather')();

  _ref = require('atom'), $ = _ref.$, View = _ref.View, Task = _ref.Task;

  last = function(str) {
    return str[str.length - 1];
  };

  renderTemplate = function(template, data) {
    var vars;
    vars = Object.keys(data);
    return vars.reduce(function(_template, key) {
      return _template.split(RegExp("\\{\\{\\s*" + key + "\\s*\\}\\}")).join(data[key]);
    }, template.toString());
  };

  TermView = (function(_super) {
    __extends(TermView, _super);

    TermView.content = function() {
      return this.div({
        "class": 'term2'
      });
    };

    function TermView(opts) {
      var editorPath;
      this.opts = opts != null ? opts : {};
      opts.shell = process.env.SHELL || 'bash';
      opts.shellArguments || (opts.shellArguments = '');
      editorPath = keypather.get(atom, 'workspace.getEditorViews[0].getEditor().getPath()');
      opts.cwd = opts.cwd || atom.project.getPath() || editorPath || process.env.HOME;
      TermView.__super__.constructor.apply(this, arguments);
    }

    TermView.prototype.forkPtyProcess = function(args) {
      var processPath, _ref1;
      if (args == null) {
        args = [];
      }
      processPath = require.resolve('./pty');
      path = (_ref1 = atom.project.getPath()) != null ? _ref1 : '~';
      return Task.once(processPath, fs.absolute(path), args);
    };

    TermView.prototype.initialize = function(state) {
      var args, colorCode, colorName, colors, colorsArray, cols, cursorBlink, cwd, rows, runCommand, scrollback, shell, shellArguments, term, _ref1, _ref2;
      this.state = state;
      _ref1 = this.getDimensions(), cols = _ref1.cols, rows = _ref1.rows;
      _ref2 = this.opts, cwd = _ref2.cwd, shell = _ref2.shell, shellArguments = _ref2.shellArguments, runCommand = _ref2.runCommand, colors = _ref2.colors, cursorBlink = _ref2.cursorBlink, scrollback = _ref2.scrollback;
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      this.ptyProcess = this.forkPtyProcess(args);
      this.ptyProcess.on('term2:data', (function(_this) {
        return function(data) {
          return _this.term.write(data);
        };
      })(this));
      this.ptyProcess.on('term2:exit', (function(_this) {
        return function(data) {
          return _this.destroy();
        };
      })(this));
      colorsArray = (function() {
        var _results;
        _results = [];
        for (colorName in colors) {
          colorCode = colors[colorName];
          _results.push(colorCode);
        }
        return _results;
      })();
      this.term = term = new Terminal({
        useStyle: false,
        screenKeys: false,
        colors: colorsArray,
        cursorBlink: cursorBlink,
        scrollback: scrollback,
        cols: cols,
        rows: rows
      });
      term.end = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      term.on("data", (function(_this) {
        return function(data) {
          return _this.input(data);
        };
      })(this));
      term.open(this.get(0));
      if (runCommand) {
        this.input("" + runCommand + os.EOL);
      }
      term.focus();
      this.attachEvents();
      return this.resizeToPane();
    };

    TermView.prototype.input = function(data) {
      return this.ptyProcess.send({
        event: 'input',
        text: data
      });
    };

    TermView.prototype.resize = function(cols, rows) {
      return this.ptyProcess.send({
        event: 'resize',
        rows: rows,
        cols: cols
      });
    };

    TermView.prototype.titleVars = function() {
      return {
        bashName: last(this.opts.shell.split('/')),
        hostName: os.hostname(),
        platform: process.platform,
        home: process.env.HOME
      };
    };

    TermView.prototype.getTitle = function() {
      var titleTemplate;
      this.vars = this.titleVars();
      titleTemplate = this.opts.titleTemplate || "({{ bashName }})";
      return renderTemplate(titleTemplate, this.vars);
    };

    TermView.prototype.attachEvents = function() {
      this.resizeToPane = this.resizeToPane.bind(this);
      this.attachResizeEvents();
      return this.command("term2:paste", (function(_this) {
        return function() {
          return _this.paste();
        };
      })(this));
    };

    TermView.prototype.paste = function() {
      return this.input(atom.clipboard.read());
    };

    TermView.prototype.attachResizeEvents = function() {
      setTimeout(((function(_this) {
        return function() {
          return _this.resizeToPane();
        };
      })(this)), 10);
      this.on('focus', this.focus);
      return $(window).on('resize', (function(_this) {
        return function() {
          return _this.resizeToPane();
        };
      })(this));
    };

    TermView.prototype.detachResizeEvents = function() {
      this.off('focus', this.focus);
      return $(window).off('resize');
    };

    TermView.prototype.focus = function() {
      this.resizeToPane();
      this.focusTerm();
      return TermView.__super__.focus.apply(this, arguments);
    };

    TermView.prototype.focusTerm = function() {
      this.term.element.focus();
      return this.term.focus();
    };

    TermView.prototype.resizeToPane = function() {
      var cols, rows, _ref1;
      _ref1 = this.getDimensions(), cols = _ref1.cols, rows = _ref1.rows;
      if (!(cols > 0 && rows > 0)) {
        return;
      }
      if (!this.term) {
        return;
      }
      if (this.term.rows === rows && this.term.cols === cols) {
        return;
      }
      this.resize(cols, rows);
      this.term.resize(cols, rows);
      return atom.workspaceView.getActivePaneView().css({
        overflow: 'visible'
      });
    };

    TermView.prototype.getDimensions = function() {
      var cols, fakeCol, rows;
      fakeCol = $("<span id='colSize'>&nbsp;</span>").css({
        visibility: 'hidden'
      });
      if (this.term) {
        this.find('.terminal').append(fakeCol);
        fakeCol = this.find(".terminal span#colSize");
        cols = Math.floor((this.width() / fakeCol.width()) || 9);
        rows = Math.floor((this.height() / fakeCol.height()) || 16);
        fakeCol.remove();
      } else {
        cols = Math.floor(this.width() / 7);
        rows = Math.floor(this.height() / 14);
      }
      return {
        cols: cols,
        rows: rows
      };
    };

    TermView.prototype.destroy = function() {
      var parentPane;
      this.detachResizeEvents();
      this.ptyProcess.terminate();
      this.term.destroy();
      parentPane = atom.workspace.getActivePane();
      if (parentPane.activeItem === this) {
        parentPane.removeItem(parentPane.activeItem);
      }
      return this.detach();
    };

    return TermView;

  })(View);

  module.exports = TermView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQWEsT0FBQSxDQUFRLE1BQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBYSxPQUFBLENBQVEsSUFBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQWEsT0FBQSxDQUFRLFNBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQU5iLENBQUE7O0FBQUEsRUFRQSxTQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBQUgsQ0FBQSxDQVJiLENBQUE7O0FBQUEsRUFVQSxPQUFrQixPQUFBLENBQVEsTUFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLFlBQUEsSUFWVixDQUFBOztBQUFBLEVBWUEsSUFBQSxHQUFPLFNBQUMsR0FBRCxHQUFBO1dBQVEsR0FBSSxDQUFBLEdBQUcsQ0FBQyxNQUFKLEdBQVcsQ0FBWCxFQUFaO0VBQUEsQ0FaUCxDQUFBOztBQUFBLEVBY0EsY0FBQSxHQUFpQixTQUFDLFFBQUQsRUFBVyxJQUFYLEdBQUE7QUFDZixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBUCxDQUFBO1dBQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFDLFNBQUQsRUFBWSxHQUFaLEdBQUE7YUFDVixTQUFTLENBQUMsS0FBVixDQUFnQixNQUFBLENBQUEsWUFBQSxHQUFRLEdBQVIsR0FBYSxZQUFiLENBQWhCLENBQ0UsQ0FB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
//# sourceURL=/Users/ssun/.atom/packages/term2/lib/TermView.coffee