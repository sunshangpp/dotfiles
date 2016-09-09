(function() {
  var Emitter, Gobuild, Subscriber, fs, glob, path, spawn, temp, _, _ref;

  spawn = require('child_process').spawn;

  fs = require('fs-plus');

  glob = require('glob');

  path = require('path');

  temp = require('temp');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  module.exports = Gobuild = (function() {
    Subscriber.includeInto(Gobuild);

    Emitter.includeInto(Gobuild);

    function Gobuild(dispatch) {
      this.dispatch = dispatch;
      atom.commands.add('atom-workspace', {
        'golang:gobuild': (function(_this) {
          return function() {
            return _this.checkCurrentBuffer();
          };
        })(this)
      });
      this.name = 'syntaxcheck';
    }

    Gobuild.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Gobuild.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gobuild.prototype.checkCurrentBuffer = function() {
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

    Gobuild.prototype.checkBuffer = function(editor, saving, callback) {
      var args, buffer, cmd, cwd, done, env, fileDir, files, go, gopath, match, output, outputPath, pre, splitgopath, testPackage;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.syntaxCheckOnSave')) {
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
      splitgopath = go.splitgopath();
      env = this.dispatch.env();
      env['GOPATH'] = gopath;
      cwd = path.dirname(buffer.getPath());
      output = '';
      outputPath = '';
      files = [];
      fileDir = path.dirname(buffer.getPath());
      args = [];
      this.tempDir = temp.mkdirSync();
      if (buffer.getPath().match(/_test.go$/i)) {
        pre = /^\w*package ([\d\w]+){1}\w*$/img;
        match = pre.exec(buffer.getText());
        testPackage = (match != null) && match.length > 0 ? match[1] : '';
        testPackage = testPackage.replace(/_test$/i, '');
        output = testPackage + '.test' + go.exe;
        outputPath = this.tempDir;
        args = ['test', '-copybinary', '-o', outputPath, '-c', '.'];
        files = fs.readdirSync(fileDir);
      } else {
        output = '.go-plus-syntax-check';
        outputPath = path.normalize(path.join(this.tempDir, output + go.exe));
        args = ['build', '-o', outputPath, '.'];
      }
      cmd = go.executable;
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          var file, pattern, updatedFiles, _i, _len;
          if ((stdout != null) && stdout.trim() !== '') {
            console.log(_this.name + ' - stdout: ' + stdout);
          }
          if ((stderr != null) && stderr !== '') {
            messages = _this.mapMessages(stderr, cwd, splitgopath);
          }
          if (fs.existsSync(outputPath)) {
            if (fs.lstatSync(outputPath).isDirectory()) {
              fs.rmdirSync(outputPath);
            } else {
              fs.unlinkSync(outputPath);
            }
          }
          updatedFiles = _.difference(fs.readdirSync(fileDir), files);
          if ((updatedFiles != null) && _.size(updatedFiles) > 0) {
            for (_i = 0, _len = updatedFiles.length; _i < _len; _i++) {
              file = updatedFiles[_i];
              if (_.endsWith(file, '.test' + go.exe)) {
                fs.unlinkSync(path.join(fileDir, file));
              }
            }
          }
          pattern = cwd + '/*' + output;
          glob(pattern, {
            mark: false
          }, function(er, files) {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              _results.push((function(file) {
                return fs.unlinkSync(file);
              })(file));
            }
            return _results;
          });
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    Gobuild.prototype.mapMessages = function(data, cwd, splitgopath) {
      var extract, match, messages, pattern, pkg;
      pattern = /^((#)\s(.*)?)|((.*?):(\d*?):((\d*?):)?\s((.*)?((\n\t.*)+)?))/img;
      messages = [];
      pkg = '';
      extract = function(matchLine) {
        var file, message;
        if (matchLine == null) {
          return;
        }
        if ((matchLine[2] != null) && matchLine[2] === '#') {

        } else {
          file = null;
          if ((matchLine[5] != null) && matchLine[5] !== '') {
            if (path.isAbsolute(matchLine[5])) {
              file = matchLine[5];
            } else {
              file = path.join(cwd, matchLine[5]);
            }
          }
          message = (function() {
            switch (false) {
              case matchLine[8] == null:
                return {
                  file: file,
                  line: matchLine[6],
                  column: matchLine[8],
                  msg: matchLine[9],
                  type: 'error',
                  source: 'syntaxcheck'
                };
              default:
                return {
                  file: file,
                  line: matchLine[6],
                  column: false,
                  msg: matchLine[9],
                  type: 'error',
                  source: 'syntaxcheck'
                };
            }
          })();
          return messages.push(message);
        }
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

    Gobuild.prototype.absolutePathForPackage = function(pkg, splitgopath) {
      var combinedpath, gopath, _i, _len;
      for (_i = 0, _len = splitgopath.length; _i < _len; _i++) {
        gopath = splitgopath[_i];
        combinedpath = path.join(gopath, 'src', pkg);
        if (fs.existsSync(combinedpath)) {
          return fs.realpathSync(combinedpath);
        }
      }
      return null;
    };

    return Gobuild;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29idWlsZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0VBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FMYixDQUFBOztBQUFBLEVBTUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQU5KLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixPQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixPQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxpQkFBQyxRQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEs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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/gobuild.coffee
