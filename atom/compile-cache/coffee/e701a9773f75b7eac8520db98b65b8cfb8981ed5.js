(function() {
  var Emitter, Govet, Subscriber, path, spawn, _, _ref;

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Govet = (function() {
    Subscriber.includeInto(Govet);

    Emitter.includeInto(Govet);

    function Govet(dispatch) {
      this.dispatch = dispatch;
      atom.commands.add('atom-workspace', {
        'golang:govet': (function(_this) {
          return function() {
            return _this.checkCurrentBuffer();
          };
        })(this)
      });
      this.name = 'vet';
    }

    Govet.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Govet.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Govet.prototype.checkCurrentBuffer = function() {
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

    Govet.prototype.checkBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, cwd, done, env, go, gopath, message;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.vetOnSave')) {
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
      args = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.vetArgs'));
      args = _.union(args, [buffer.getPath()]);
      cmd = this.dispatch.goexecutable.current().vet();
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Vet Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if ((stdout != null) && stdout.trim() !== '') {
            console.log(_this.name + ' - stdout: ' + stdout);
          }
          if ((stderr != null) && stderr.trim() !== '') {
            messages = _this.mapMessages(stderr, cwd);
          }
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    Govet.prototype.mapMessages = function(data, cwd) {
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
                source: 'vet'
              };
            default:
              return {
                file: file,
                line: matchLine[2],
                column: false,
                msg: matchLine[5],
                type: 'warning',
                source: 'vet'
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

    return Govet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ292ZXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FEYixDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsS0FBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsS0FBcEIsQ0FEQSxDQUFBOztBQUdhLElBQUEsZUFBQyxRQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO09BREYsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBSFIsQ0FEVztJQUFBLENBSGI7O0FBQUEsb0JBU0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFB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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/govet.coffee
