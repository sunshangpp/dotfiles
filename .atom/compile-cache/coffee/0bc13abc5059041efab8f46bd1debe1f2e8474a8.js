(function() {
  var LinterView, fs, log, path, temp, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  log = require('./utils').log;

  temp.track();

  LinterView = (function() {
    LinterView.prototype.linters = [];

    LinterView.prototype.totalProcessed = 0;

    LinterView.prototype.tempFile = '';

    LinterView.prototype.messages = [];

    LinterView.prototype.subscriptions = [];

    function LinterView(editorView, statusBarView, linters) {
      this.processMessage = __bind(this.processMessage, this);
      this.handleBufferEvents = __bind(this.handleBufferEvents, this);
      this.editor = editorView.editor;
      this.editorView = editorView;
      this.statusBarView = statusBarView;
      this.markers = null;
      this.initLinters(linters);
      this.subscriptions.push(atom.workspaceView.on('pane:item-removed', (function(_this) {
        return function() {
          return _this.statusBarView.hide();
        };
      })(this)));
      this.subscriptions.push(atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          var _ref;
          _this.statusBarView.hide();
          if (_this.editor.id === ((_ref = atom.workspace.getActiveEditor()) != null ? _ref.id : void 0)) {
            return _this.displayStatusBar();
          }
        };
      })(this)));
      this.handleBufferEvents();
      this.handleConfigChanges();
      this.subscriptions.push(this.editorView.on('cursor:moved', (function(_this) {
        return function() {
          return _this.displayStatusBar();
        };
      })(this)));
    }

    LinterView.prototype.initLinters = function(linters) {
      var grammarName, linter, _i, _len, _results;
      this.linters = [];
      grammarName = this.editor.getGrammar().scopeName;
      _results = [];
      for (_i = 0, _len = linters.length; _i < _len; _i++) {
        linter = linters[_i];
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax) {
          _results.push(this.linters.push(new linter(this.editor)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LinterView.prototype.handleConfigChanges = function() {
      this.subscriptions.push(atom.config.observe('linter.lintOnSave', (function(_this) {
        return function(lintOnSave) {
          return _this.lintOnSave = lintOnSave;
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.lintOnChangeInterval', (function(_this) {
        return function(lintOnModifiedDelayMS) {
          var throttleInterval;
          throttleInterval = parseInt(lintOnModifiedDelayMS);
          if (isNaN(throttleInterval)) {
            throttleInterval = 1000;
          }
          return _this.throttledLint = (_.throttle(_this.lint, throttleInterval)).bind(_this);
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.lintOnChange', (function(_this) {
        return function(lintOnModified) {
          return _this.lintOnModified = lintOnModified;
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.lintOnEditorFocus', (function(_this) {
        return function(lintOnEditorFocus) {
          return _this.lintOnEditorFocus = lintOnEditorFocus;
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.showGutters', (function(_this) {
        return function(showGutters) {
          _this.showGutters = showGutters;
          return _this.display();
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.showErrorInStatusBar', (function(_this) {
        return function(showMessagesAroundCursor) {
          _this.showMessagesAroundCursor = showMessagesAroundCursor;
          return _this.displayStatusBar();
        };
      })(this)));
      return this.subscriptions.push(atom.config.observe('linter.showHighlighting', (function(_this) {
        return function(showHighlighting) {
          _this.showHighlighting = showHighlighting;
          return _this.display();
        };
      })(this)));
    };

    LinterView.prototype.handleBufferEvents = function() {
      var buffer;
      buffer = this.editor.getBuffer();
      this.subscriptions.push(buffer.on('reloaded saved', (function(_this) {
        return function(buffer) {
          if (_this.lintOnSave) {
            return _this.throttledLint();
          }
        };
      })(this)));
      this.subscriptions.push(buffer.on('destroyed', function() {
        buffer.off('reloaded saved');
        return buffer.off('destroyed');
      }));
      this.subscriptions.push(this.editor.on('contents-modified', (function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.throttledLint();
          }
        };
      })(this)));
      this.subscriptions.push(atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          var _ref;
          if (_this.editor.id === ((_ref = atom.workspace.getActiveEditor()) != null ? _ref.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              return _this.throttledLint();
            }
          }
        };
      })(this)));
      return atom.workspaceView.command("linter:lint", (function(_this) {
        return function() {
          return _this.lint();
        };
      })(this));
    };

    LinterView.prototype.lint = function() {
      if (this.linters.length === 0) {
        return;
      }
      this.totalProcessed = 0;
      this.messages = [];
      this.destroyMarkers();
      return temp.mkdir({
        prefix: 'AtomLinter',
        suffix: this.editor.getGrammar().scopeName
      }, (function(_this) {
        return function(err, tmpDir) {
          var fileName, tempFileInfo;
          if (err != null) {
            throw err;
          }
          fileName = path.basename(_this.editor.getPath());
          tempFileInfo = {
            completedLinters: 0,
            path: path.join(tmpDir, fileName)
          };
          return fs.writeFile(tempFileInfo.path, _this.editor.getText(), function(err) {
            var linter, _i, _len, _ref;
            if (err != null) {
              throw err;
            }
            _ref = _this.linters;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              linter = _ref[_i];
              linter.lintFile(tempFileInfo.path, function(messages) {
                return _this.processMessage(messages, tempFileInfo, linter);
              });
            }
          });
        };
      })(this));
    };

    LinterView.prototype.processMessage = function(messages, tempFileInfo, linter) {
      log("linter returned", linter, messages);
      tempFileInfo.completedLinters++;
      if (tempFileInfo.completedLinters === this.linters.length) {
        fs.unlink(tempFileInfo.path);
      }
      this.messages = this.messages.concat(messages);
      return this.display();
    };

    LinterView.prototype.destroyMarkers = function() {
      var m, _i, _len, _ref;
      if (this.markers == null) {
        return;
      }
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        m.destroy();
      }
      return this.markers = null;
    };

    LinterView.prototype.display = function() {
      var klass, marker, message, _i, _len, _ref;
      this.destroyMarkers();
      if (this.showGutters || this.showHighlighting) {
        if (this.markers == null) {
          this.markers = [];
        }
        _ref = this.messages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          message = _ref[_i];
          klass = message.level === 'error' ? 'linter-error' : message.level === 'warning' ? 'linter-warning' : void 0;
          if (klass == null) {
            continue;
          }
          marker = this.editor.markBufferRange(message.range, {
            invalidate: 'never'
          });
          this.markers.push(marker);
          if (this.showGutters) {
            this.editor.decorateMarker(marker, {
              type: 'gutter',
              "class": klass
            });
          }
          if (this.showHighlighting) {
            this.editor.decorateMarker(marker, {
              type: 'highlight',
              "class": klass
            });
          }
        }
      }
      return this.displayStatusBar();
    };

    LinterView.prototype.displayStatusBar = function() {
      if (this.showMessagesAroundCursor) {
        return this.statusBarView.render(this.messages, this.editor);
      } else {
        return this.statusBarView.render([], this.editor);
      }
    };

    LinterView.prototype.remove = function() {
      var subscription, _i, _len, _ref, _results;
      _ref = this.subscriptions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subscription = _ref[_i];
        _results.push(subscription.off());
      }
      return _results;
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUMsTUFBTyxPQUFBLENBQVEsU0FBUixFQUFQLEdBSkQsQ0FBQTs7QUFBQSxFQU9BLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FQQSxDQUFBOztBQUFBLEVBVU07QUFFSix5QkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLHlCQUNBLGNBQUEsR0FBZ0IsQ0FEaEIsQ0FBQTs7QUFBQSx5QkFFQSxRQUFBLEdBQVUsRUFGVixDQUFBOztBQUFBLHlCQUdBLFFBQUEsR0FBVSxFQUhWLENBQUE7O0FBQUEseUJBSUEsYUFBQSxHQUFlLEVBSmYsQ0FBQTs7QUFZYSxJQUFBLG9CQUFDLFVBQUQsRUFBYSxhQUFiLEVBQTRCLE9BQTVCLEdBQUE7QUFFWCw2REFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxVQUFVLENBQUMsTUFBckIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxVQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLGFBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFIWCxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENB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
//# sourceURL=/Users/ssun/.atom/packages/linter/lib/linter-view.coffee