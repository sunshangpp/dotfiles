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

    function LinterView(editorView, statusBarView, inlineView, linters) {
      this.processMessage = __bind(this.processMessage, this);
      this.handleBufferEvents = __bind(this.handleBufferEvents, this);
      this.editor = editorView.editor;
      this.editorView = editorView;
      this.statusBarView = statusBarView;
      this.inlineView = inlineView;
      this.markers = null;
      this.initLinters(linters);
      this.subscriptions.push(atom.workspaceView.on('pane:item-removed', (function(_this) {
        return function() {
          _this.statusBarView.hide();
          return _this.inlineView.hide();
        };
      })(this)));
      this.subscriptions.push(atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          var _ref;
          if (_this.editor.id === ((_ref = atom.workspace.getActiveEditor()) != null ? _ref.id : void 0)) {
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            return _this.inlineView.hide();
          }
        };
      })(this)));
      this.handleBufferEvents();
      this.handleConfigChanges();
      this.subscriptions.push(this.editorView.on('cursor:moved', (function(_this) {
        return function() {
          return _this.updateViews();
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
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showErrorInline) {
          _this.showErrorInline = showErrorInline;
          return _this.updateViews();
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
        fs.unlink(tempFileInfo.path, function() {
          return fs.rmdir(path.dirname(tempFileInfo.path));
        });
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
      return this.updateViews();
    };

    LinterView.prototype.updateViews = function() {
      if (this.showMessagesAroundCursor) {
        this.statusBarView.render(this.messages, this.editor);
      } else {
        this.statusBarView.render([], this.editor);
      }
      if (this.showErrorInline) {
        return this.inlineView.render(this.messages, this.editorView);
      } else {
        return this.inlineView.render([], this.editorView);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUMsTUFBTyxPQUFBLENBQVEsU0FBUixFQUFQLEdBSkQsQ0FBQTs7QUFBQSxFQU9BLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FQQSxDQUFBOztBQUFBLEVBVU07QUFFSix5QkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLHlCQUNBLGNBQUEsR0FBZ0IsQ0FEaEIsQ0FBQTs7QUFBQSx5QkFFQSxRQUFBLEdBQVUsRUFGVixDQUFBOztBQUFBLHlCQUdBLFFBQUEsR0FBVSxFQUhWLENBQUE7O0FBQUEseUJBSUEsYUFBQSxHQUFlLEVBSmYsQ0FBQTs7QUFZYSxJQUFBLG9CQUFDLFVBQUQsRUFBYSxhQUFiLEVBQTRCLFVBQTVCLEVBQXdDLE9BQXhDLEdBQUE7QUFFWCw2REFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxVQUFVLENBQUMsTUFBckIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxVQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLGFBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFIZCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBSlgsQ0FBQTtBQUFBLE1BTUEs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
//# sourceURL=/Users/ssun/.atom/packages/linter/lib/linter-view.coffee