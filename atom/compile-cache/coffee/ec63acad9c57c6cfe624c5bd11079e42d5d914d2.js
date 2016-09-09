(function() {
  var Emitter, Gofmt, Subscriber, path, spawn, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Gofmt = (function() {
    Subscriber.includeInto(Gofmt);

    Emitter.includeInto(Gofmt);

    function Gofmt(dispatch) {
      this.mapMessages = __bind(this.mapMessages, this);
      atom.commands.add('atom-workspace', {
        'golang:gofmt': (function(_this) {
          return function() {
            return _this.formatCurrentBuffer();
          };
        })(this)
      });
      this.dispatch = dispatch;
      this.name = 'fmt';
    }

    Gofmt.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Gofmt.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gofmt.prototype.formatCurrentBuffer = function() {
      var done, editor, _ref1;
      editor = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspace) != null ? _ref1.getActiveTextEditor() : void 0 : void 0;
      if (!this.dispatch.isValidEditor(editor)) {
        return;
      }
      this.reset(editor);
      done = (function(_this) {
        return function(err, messages) {
          return _this.dispatch.resetAndDisplayMessages(editor, messages);
        };
      })(this);
      return this.formatBuffer(editor, false, done);
    };

    Gofmt.prototype.formatBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, configArgs, cwd, env, go, gopath, message, messages, stderr, stdout, _ref1;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.formatOnSave')) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (buffer == null) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      cwd = path.dirname(buffer.getPath());
      args = ['-w'];
      configArgs = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.formatArgs'));
      if ((configArgs != null) && _.size(configArgs) > 0) {
        args = _.union(args, configArgs);
      }
      args = _.union(args, [buffer.getPath()]);
      go = this.dispatch.goexecutable.current();
      if (go == null) {
        callback(null);
        this.dispatch.displayGoInfo(false);
        return;
      }
      gopath = go.buildgopath();
      if ((gopath == null) || gopath === '') {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      env = this.dispatch.env();
      env['GOPATH'] = gopath;
      cmd = go.format();
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Format Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      _ref1 = this.dispatch.executor.execSync(cmd, cwd, env, args), stdout = _ref1.stdout, stderr = _ref1.stderr, messages = _ref1.messages;
      if ((stdout != null) && stdout.trim() !== '') {
        console.log(this.name + ' - stdout: ' + stdout);
      }
      if ((stderr != null) && stderr.trim() !== '') {
        messages = this.mapMessages(stderr, cwd);
      }
      this.emit(this.name + '-complete', editor, saving);
      return callback(null, messages);
    };

    Gofmt.prototype.mapMessages = function(data, cwd) {
      var extract, match, messages, pattern;
      pattern = /^(.*?):(\d*?):((\d*?):)?\s(.*)$/img;
      messages = [];
      if (!((data != null) && data !== '')) {
        return messages;
      }
      extract = (function(_this) {
        return function(matchLine) {
          var file, message;
          if (matchLine == null) {
            return;
          }
          file = (matchLine[1] != null) && matchLine[1] !== '' ? matchLine[1] : null;
          message = (function() {
            switch (false) {
              case matchLine[4] == null:
                return {
                  file: file,
                  line: matchLine[2],
                  column: matchLine[4],
                  msg: matchLine[5],
                  type: 'error',
                  source: this.name
                };
              default:
                return {
                  file: file,
                  line: matchLine[2],
                  column: false,
                  msg: matchLine[5],
                  type: 'error',
                  source: this.name
                };
            }
          }).call(_this);
          return messages.push(message);
        };
      })(this);
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return messages;
    };

    return Gofmt;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29mbXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQURiLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixLQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixLQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxlQUFDLFFBQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsbUJBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7T0FERixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFGWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBSFIsQ0FEVztJQUFBLENBSGI7O0FBQUEsb0JBU0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1B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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/gofmt.coffee
