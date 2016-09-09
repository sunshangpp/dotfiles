(function() {
  var Emitter, Golint, Subscriber, path, spawn, _, _ref;

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Golint = (function() {
    Subscriber.includeInto(Golint);

    Emitter.includeInto(Golint);

    function Golint(dispatch) {
      atom.commands.add('atom-workspace', {
        'golang:golint': (function(_this) {
          return function() {
            return _this.checkCurrentBuffer();
          };
        })(this)
      });
      this.dispatch = dispatch;
      this.name = 'lint';
    }

    Golint.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Golint.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Golint.prototype.checkCurrentBuffer = function() {
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
      return this.checkBuffer(editor, false, done);
    };

    Golint.prototype.checkBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, configArgs, cwd, done, env, go, gopath, message;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.lintOnSave')) {
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
      cwd = path.dirname(buffer.getPath());
      args = [buffer.getPath()];
      configArgs = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.golintArgs'));
      if ((configArgs != null) && _.size(configArgs) > 0) {
        args = _.union(configArgs, args);
      }
      cmd = this.dispatch.goexecutable.current().golint();
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Lint Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if ((stderr != null) && stderr.trim() !== '') {
            console.log(_this.name + ' - stderr: ' + stderr);
          }
          if ((stdout != null) && stdout.trim() !== '') {
            messages = _this.mapMessages(stdout, cwd);
          }
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    Golint.prototype.mapMessages = function(data, cwd) {
      var extract, match, messages, pattern;
      pattern = /^(.*?):(\d*?):((\d*?):)?\s(.*)$/img;
      messages = [];
      extract = function(matchLine) {
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
                type: 'warning',
                source: 'lint'
              };
            default:
              return {
                file: file,
                line: matchLine[2],
                column: false,
                msg: matchLine[5],
                type: 'warning',
                source: 'lint'
              };
          }
        })();
        return messages.push(message);
      };
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return messages;
    };

    return Golint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29saW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BRGIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLE1BQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQXBCLENBREEsQ0FBQTs7QUFHYSxJQUFBLGdCQUFDLFFBQUQsR0FBQTtBQUNYLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtPQURGLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsTUFIUixDQURXO0lBQUEsQ0FIYjs7QUFBQSxxQkFTQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENB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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/golint.coffee
