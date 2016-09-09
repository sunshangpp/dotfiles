(function() {
  var Emitter, Gopath, Subscriber, fs, path, _, _ref;

  path = require('path');

  fs = require('fs-plus');

  _ = require('underscore-plus');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  module.exports = Gopath = (function() {
    Subscriber.includeInto(Gopath);

    Emitter.includeInto(Gopath);

    function Gopath(dispatch) {
      this.dispatch = dispatch;
      this.name = 'gopath';
    }

    Gopath.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    Gopath.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gopath.prototype.check = function(editor, saving, callback) {
      var filepath, found, gopath, gopaths, message, messages, _i, _j, _k, _len, _len1, _len2;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (!atom.config.get('go-plus.syntaxCheckOnSave')) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      gopaths = this.dispatch.goexecutable.current().splitgopath();
      messages = [];
      if (!((gopaths != null) && _.size(gopaths) > 0)) {
        message = {
          line: false,
          column: false,
          msg: 'Warning: GOPATH is not set – either set the GOPATH environment variable or define the Go Path in go-plus package preferences',
          type: 'warning',
          source: 'gopath'
        };
        messages.push(message);
      }
      if ((messages != null) && _.size(messages) === 0) {
        for (_i = 0, _len = gopaths.length; _i < _len; _i++) {
          gopath = gopaths[_i];
          if (!fs.existsSync(gopath)) {
            message = {
              line: false,
              column: false,
              msg: 'Warning: GOPATH [' + gopath + '] does not exist',
              type: 'warning',
              source: 'gopath'
            };
            messages.push(message);
          }
        }
      }
      if ((messages != null) && _.size(messages) === 0) {
        for (_j = 0, _len1 = gopaths.length; _j < _len1; _j++) {
          gopath = gopaths[_j];
          if (!fs.existsSync(path.join(gopath, 'src'))) {
            message = {
              line: false,
              column: false,
              msg: 'Warning: GOPATH [' + gopath + '] does not contain a "src" directory - please review http://golang.org/doc/code.html#Workspaces',
              type: 'warning',
              source: 'gopath'
            };
            messages.push(message);
          }
        }
      }
      if ((messages != null) && _.size(messages) === 0) {
        filepath = editor != null ? editor.getPath() : void 0;
        if ((filepath != null) && filepath !== '' && fs.existsSync(filepath)) {
          filepath = fs.realpathSync(filepath);
          found = false;
          for (_k = 0, _len2 = gopaths.length; _k < _len2; _k++) {
            gopath = gopaths[_k];
            if (fs.existsSync(gopath)) {
              gopath = fs.realpathSync(gopath);
              if (filepath.toLowerCase().startsWith(path.join(gopath, 'src').toLowerCase())) {
                found = true;
              }
            }
          }
          if (!found) {
            message = {
              line: false,
              column: false,
              msg: 'Warning: File [' + filepath + '] does not reside within a "src" directory in your GOPATH [' + gopaths + '] - please review http://golang.org/doc/code.html#Workspaces',
              type: 'warning',
              source: 'gopath'
            };
            messages.push(message);
          }
        }
      }
      if ((messages != null) && _.size(messages) > 0) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null, messages);
        return;
      }
      this.emit(this.name + '-complete', editor, saving);
      callback(null);
    };

    return Gopath;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29wYXRoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLE1BQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQXBCLENBREEsQ0FBQTs7QUFHYSxJQUFBLGdCQUFDLFFBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFEUixDQURXO0lBQUEsQ0FIYjs7QUFBQSxxQkFPQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FGTDtJQUFBLENBUFQsQ0FBQTs7QUFBQSxxQkFXQSxLQUFBLEdBQU8sU0FBQyxNQUFELEdBQUE7YUFDTCxJQUFDLENBQUEsSUFBRCxDQUFNLE9BQU4sRUFBZSxNQUFmLEVBREs7SUFBQSxDQVhQLENBQUE7O0FBQUEscUJBY0EsS0FBQSxHQUFPLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsUUFBakIsR0FBQTtBQUNMLFVBQUEsbUZBQUE7O1FBRHNCLFdBQVcsU0FBQSxHQUFBO09BQ2pDO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLFFBQVEsQ0FBQyxhQUFWLENBQXdCLE1BQXhCLENBQVA7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBQyxDQUFBLElBQUQsR0FBUSxXQUFkLEVBQTJCLE1BQTNCLEVBQW1DLE1BQW5DLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLElBQVQsQ0FEQSxDQUFBO0FBRUEsY0FBQSxDQUhGO09BQUE7QUFNQSxNQUFBLElBQUEsQ0FBQSxJQUFXLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLENBQVA7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBQyxDQUFBLElBQUQsR0FBUSxXQUFkLEVBQTJCLE1BQTNCLEVBQW1DLE1BQW5DLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLElBQVQsQ0FEQSxDQUFBO0FBRUEsY0FBQSxDQUhGO09BTkE7QUFBQSxNQVdBLE9BQUEsR0FBVSxJQUFDLENBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUF2QixDQUFBLENBQWdDLENBQUMsV0FBakMsQ0FBQSxDQVhWLENBQUE7QUFBQSxNQVlBLFFBQUEsR0FBVyxFQVpYLENBQUE7QUFhQSxNQUFBLElBQUEsQ0FBQSxDQUFPLGlCQUFBLElBQWEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxPQUFQLENBQUEsR0FBa0IsQ0FBdEMsQ0FBQTtBQUNFLFFBQUEsT0FBQSxHQUNJO0FBQUEsVUFBQSxJQUFBLEVBQU0sS0FBTjtBQUFBLFVBQ0EsTUFBQSxFQUFRLEtBRFI7QUFBQSxVQUVBLEdBQUEsRUFBSyw4SEFGTDtBQUFBLFVBR0EsSUFBQSxFQUFNLFNBSE47QUFBQSxVQUlBLE1BQUEsRUFBUSxRQUpSO1NBREosQ0FBQTtBQUFBLFFBTUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLENBTkEsQ0FERjtPQWJBO0FBc0JBLE1BQUEsSUFBRyxrQkFBQSxJQUFjLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUCxDQUFBLEtBQW9CLENBQXJDO0FBQ0UsYUFBQSw4Q0FBQTsrQkFBQTtBQUNFLFVBQUEsSUFBQSxDQUFBLEVBQVMsQ0FBQyxVQUFILENBQWMsTUFBZCxDQUFQO0FBQ0UsWUFBQSxPQUFBLEdBQ0k7QUFBQSxjQUFBLElBQUEsRUFBTSxLQUFOO0FBQUEsY0FDQSxNQUFBLEVBQVEsS0FEUjtBQUFBLGNBRUEsR0FBQSxFQUFLLG1CQUFBLEdBQXNCLE1BQXRCLEdBQStCLGtCQUZwQztBQUFBLGNBR0EsSUFBQSxFQUFNLFNBSE47QUFBQSxjQUlBLE1BQUEsRUFBUSxRQUpSO2FBREosQ0FBQTtBQUFBLFlBTUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLENBTkEsQ0FERjtXQURGO0FBQUEsU0FERjtPQXRCQTtBQWlDQSxNQUFBLElBQUcsa0JBQUEsSUFBYyxDQUFDLENBQUMsSUFBRixDQUFPLFFBQVAsQ0FBQSxLQUFvQixDQUFyQztBQUNFLGFBQUEsZ0RBQUE7K0JBQUE7QUFDRSxVQUFBLElBQUEsQ0FBQSxFQUFTLENBQUMsVUFBSCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFrQixLQUFsQixDQUFkLENBQVA7QUFDRSxZQUFBLE9BQUEsR0FDSTtBQUFBLGNBQUEsSUFBQSxFQUFNLEtBQU47QUFBQSxjQUNBLE1BQUEsRUFBUSxLQURSO0FBQUEsY0FFQSxHQUFBLEVBQUssbUJBQUEsR0FBc0IsTUFBdEIsR0FBK0IsaUdBRnBDO0FBQUEsY0FHQSxJQUFBLEVBQU0sU0FITjtBQUFBLGNBSUEsTUFBQSxFQUFRLFFBSlI7YUFESixDQUFBO0FBQUEsWUFNQSxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsQ0FOQSxDQURGO1dBREY7QUFBQSxTQURGO09BakNBO0FBNENBLE1BQUEsSUFBRyxrQkFBQSxJQUFjLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUCxDQUFBLEtBQW9CLENBQXJDO0FBQ0UsUUFBQSxRQUFBLG9CQUFXLE1BQU0sQ0FBRSxPQUFSLENBQUEsVUFBWCxDQUFBO0FBQ0EsUUFBQSxJQUFHLGtCQUFBLElBQWMsUUFBQSxLQUFjLEVBQTVCLElBQW1DLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUF0QztBQUNFLFVBQUEsUUFBQSxHQUFXLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLENBQVgsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLEtBRFIsQ0FBQTtBQUVBLGVBQUEsZ0RBQUE7aUNBQUE7QUFDRSxZQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxNQUFkLENBQUg7QUFDRSxjQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsWUFBSCxDQUFnQixNQUFoQixDQUFULENBQUE7QUFDQSxjQUFBLElBQUcsUUFBUSxDQUFDLFdBQVQsQ0FBQSxDQUFzQixDQUFDLFVBQXZCLENBQWtDLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFrQixLQUFsQixDQUF3QixDQUFDLFdBQXpCLENBQUEsQ0FBbEMsQ0FBSDtBQUNFLGdCQUFBLEtBQUEsR0FBUSxJQUFSLENBREY7ZUFGRjthQURGO0FBQUEsV0FGQTtBQVFBLFVBQUEsSUFBQSxDQUFBLEtBQUE7QUFDRSxZQUFBLE9BQUEsR0FDSTtBQUFBLGNBQUEsSUFBQSxFQUFNLEtBQU47QUFBQSxjQUNBLE1BQUEsRUFBUSxLQURSO0FBQUEsY0FFQSxHQUFBLEVBQUssaUJBQUEsR0FBb0IsUUFBcEIsR0FBK0IsNkRBQS9CLEdBQStGLE9BQS9GLEdBQXlHLDhEQUY5RztBQUFBLGNBR0EsSUFBQSxFQUFNLFNBSE47QUFBQSxjQUlBLE1BQUEsRUFBUSxRQUpSO2FBREosQ0FBQTtBQUFBLFlBTUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLENBTkEsQ0FERjtXQVRGO1NBRkY7T0E1Q0E7QUFnRUEsTUFBQSxJQUFHLGtCQUFBLElBQWMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxRQUFQLENBQUEsR0FBbUIsQ0FBcEM7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBQyxDQUFBLElBQUQsR0FBUSxXQUFkLEVBQTJCLE1BQTNCLEVBQW1DLE1BQW5DLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLElBQVQsRUFBZSxRQUFmLENBREEsQ0FBQTtBQUVBLGNBQUEsQ0FIRjtPQWhFQTtBQUFBLE1BcUVBLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBQyxDQUFBLElBQUQsR0FBUSxXQUFkLEVBQTJCLE1BQTNCLEVBQW1DLE1BQW5DLENBckVBLENBQUE7QUFBQSxNQXNFQSxRQUFBLENBQVMsSUFBVCxDQXRFQSxDQURLO0lBQUEsQ0FkUCxDQUFBOztrQkFBQTs7TUFQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/gopath.coffee
