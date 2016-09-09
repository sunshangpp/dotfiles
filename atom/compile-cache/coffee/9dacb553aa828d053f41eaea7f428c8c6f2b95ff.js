(function() {
  var BufferedProcess, Linter, Point, Range, XRegExp, fs, log, path, warn, _, _ref, _ref1;

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  _ = require('lodash');

  XRegExp = require('xregexp').XRegExp;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

  Linter = (function() {
    Linter.syntax = '';

    Linter.prototype.cmd = '';

    Linter.prototype.regex = '';

    Linter.prototype.regexFlags = '';

    Linter.prototype.cwd = null;

    Linter.prototype.defaultLevel = 'error';

    Linter.prototype.linterName = null;

    Linter.prototype.executablePath = null;

    Linter.prototype.isNodeExecutable = false;

    Linter.prototype.errorStream = 'stdout';

    function Linter(editor) {
      this.editor = editor;
      this.cwd = path.dirname(editor.getUri());
    }

    Linter.prototype._cachedStatSync = _.memoize(function(path) {
      return fs.statSync(path);
    });

    Linter.prototype.getCmdAndArgs = function(filePath) {
      var cmd, cmd_list, stats;
      cmd = this.cmd;
      cmd_list = Array.isArray(cmd) ? cmd.slice() : cmd.split(' ');
      cmd_list.push(filePath);
      if (this.executablePath) {
        stats = this._cachedStatSync(this.executablePath);
        if (stats.isDirectory()) {
          cmd_list[0] = path.join(this.executablePath, cmd_list[0]);
        } else {
          cmd_list[0] = this.executablePath;
        }
      }
      if (this.isNodeExecutable) {
        cmd_list.unshift(this.getNodeExecutablePath());
      }
      cmd_list = cmd_list.map(function(cmd_item) {
        if (/@filename/i.test(cmd_item)) {
          return cmd_item.replace(/@filename/gi, filePath);
        } else {
          return cmd_item;
        }
      });
      log('command and arguments', cmd_list);
      return {
        command: cmd_list[0],
        args: cmd_list.slice(1)
      };
    };

    Linter.prototype.getNodeExecutablePath = function() {
      return path.join(atom.packages.apmPath, '..', 'node');
    };

    Linter.prototype.lintFile = function(filePath, callback) {
      var args, command, dataStderr, dataStdout, exit, options, process, stderr, stdout, timeout_s, _ref2;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      stdout = function(output) {
        log('stdout', output);
        return dataStdout += output;
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr += output;
      };
      exit = (function(_this) {
        return function() {
          var data;
          data = _this.errorStream === 'stdout' ? dataStdout : dataStderr;
          return _this.processMessage(data, callback);
        };
      })(this);
      process = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      timeout_s = 5;
      return setTimeout(function() {
        process.kill();
        return warn("command `" + command + "` timed out after " + timeout_s + "s");
      }, timeout_s * 1000);
    };

    Linter.prototype.processMessage = function(message, callback) {
      var messages, regex;
      messages = [];
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(message, regex, (function(_this) {
        return function(match, i) {
          var m;
          if (m = _this.createMessage(match)) {
            return messages.push(m);
          }
        };
      })(this), this);
      return callback(messages);
    };

    Linter.prototype.createMessage = function(match) {
      var level;
      if (match.error) {
        level = 'error';
      } else if (match.warning) {
        level = 'warning';
      } else {
        level = this.defaultLevel;
      }
      return {
        line: match.line,
        col: match.col,
        level: level,
        message: this.formatMessage(match),
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    Linter.prototype.formatMessage = function(match) {
      return match.message;
    };

    Linter.prototype.lineLengthForRow = function(row) {
      return this.editor.lineLengthForBufferRow(row);
    };

    Linter.prototype.getEditorScopesForPosition = function(position) {
      try {
        return _.clone(this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position));
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, maxRow, position, range, rowEnd, rowStart, scopes, _ref2, _ref3;
      if (match.line == null) {
        match.line = 0;
      }
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref2 = match.lineStart) != null ? _ref2 : match.line);
      rowEnd = decrementParse((_ref3 = match.lineEnd) != null ? _ref3 : match.line);
      maxRow = rowEnd != null ? rowEnd : rowStart;
      if (maxRow > this.editor.getLineCount()) {
        log("ignoring " + match + " - it's longer than the buffer");
        return null;
      }
      if (match.col == null) {
        match.col = 0;
      }
      if (!match.colStart) {
        position = new Point(rowStart, match.col);
        scopes = this.getEditorScopesForPosition(position);
        while (innerMostScope = scopes.pop()) {
          range = this.getGetRangeForScopeAtPosition(innerMostScope, position);
          if (range != null) {
            return range;
          }
        }
      }
      if (match.colStart == null) {
        match.colStart = match.col;
      }
      colStart = decrementParse(match.colStart);
      colEnd = match.colEnd != null ? decrementParse(match.colEnd) : parseInt(this.lineLengthForRow(rowEnd));
      if (colStart === colEnd) {
        colStart = decrementParse(colStart);
      }
      return new Range([rowStart, colStart], [rowEnd, colEnd]);
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxPQUFrQyxPQUFBLENBQVEsTUFBUixDQUFsQyxFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixFQUFlLHVCQUFBLGVBRmYsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUhKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxTQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBS0EsUUFBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQUxOLENBQUE7O0FBQUEsRUFTTTtBQUlKLElBQUEsTUFBQyxDQUFBLE1BQUQsR0FBUyxFQUFULENBQUE7O0FBQUEscUJBSUEsR0FBQSxHQUFLLEVBSkwsQ0FBQTs7QUFBQSxxQkFpQkEsS0FBQSxHQUFPLEVBakJQLENBQUE7O0FBQUEscUJBbUJBLFVBQUEsR0FBWSxFQW5CWixDQUFBOztBQUFBLHFCQXNCQSxHQUFBLEdBQUssSUF0QkwsQ0FBQTs7QUFBQSxxQkF3QkEsWUFBQSxHQUFjLE9BeEJkLENBQUE7O0FBQUEscUJBMEJBLFVBQUEsR0FBWSxJQTFCWixDQUFBOztBQUFBLHFCQTRCQSxjQUFBLEdBQWdCLElBNUJoQixDQUFBOztBQUFBLHFCQThCQSxnQkFBQSxHQUFrQixLQTlCbEIsQ0FBQTs7QUFBQSxxQkFpQ0EsV0FBQSxHQUFhLFFBakNiLENBQUE7O0FBb0NhLElBQUEsZ0JBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFB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
//# sourceURL=/Users/ssun/.atom/packages/linter/lib/linter.coffee