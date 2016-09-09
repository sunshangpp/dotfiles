(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    positionHistory: [],
    positionFuture: [],
    wasrewinding: false,
    rewinding: false,
    wasforwarding: false,
    forwarding: false,
    editorSubscription: null,
    activate: function() {
      var ed, pane, pos;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEd) {
          return activeEd.onDidChangeCursorPosition(function(event) {
            var activePane, lastEd, lastPane, lastPos, _ref;
            activePane = atom.workspace.getActivePane();
            if (_this.rewinding === false && _this.forwarding === false) {
              if (_this.positionHistory.length) {
                _ref = _this.positionHistory.slice(-1)[0], lastPane = _ref.pane, lastEd = _ref.editor, lastPos = _ref.position;
                if (activePane === lastPane && activeEd === lastEd && Math.abs(lastPos.serialize()[0] - event.newBufferPosition.serialize()[0]) < 3) {
                  return;
                }
              }
              _this.positionHistory.push({
                pane: activePane,
                editor: activeEd,
                position: event.newBufferPosition
              });
              _this.positionFuture = [];
              _this.wasrewinding = false;
              _this.wasforwarding = false;
            }
            _this.rewinding = false;
            return _this.forwarding = false;
          });
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPane((function(_this) {
        return function(event) {
          var pos;
          _this.positionHistory = (function() {
            var _i, _len, _ref, _results;
            _ref = this.positionHistory;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pos = _ref[_i];
              if (pos.pane !== event.pane) {
                _results.push(pos);
              }
            }
            return _results;
          }).call(_this);
          return _this.positionFuture = (function() {
            var _i, _len, _ref, _results;
            _ref = this.positionFuture;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pos = _ref[_i];
              if (pos.pane !== event.pane) {
                _results.push(pos);
              }
            }
            return _results;
          }).call(_this);
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(event) {
          var pos;
          _this.positionHistory = (function() {
            var _i, _len, _ref, _results;
            _ref = this.positionHistory;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pos = _ref[_i];
              if (pos.editor !== event.item) {
                _results.push(pos);
              }
            }
            return _results;
          }).call(_this);
          return _this.positionFuture = (function() {
            var _i, _len, _ref, _results;
            _ref = this.positionFuture;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pos = _ref[_i];
              if (pos.editor !== event.item) {
                _results.push(pos);
              }
            }
            return _results;
          }).call(_this);
        };
      })(this)));
      ed = atom.workspace.getActiveTextEditor();
      pane = atom.workspace.getActivePane();
      if ((pane != null) && (ed != null)) {
        pos = ed.getCursorBufferPosition();
        this.positionHistory.push({
          pane: pane,
          editor: ed,
          position: pos
        });
      }
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'last-cursor-position:previous': (function(_this) {
          return function() {
            return _this.previous();
          };
        })(this),
        'last-cursor-position:next': (function(_this) {
          return function() {
            return _this.next();
          };
        })(this)
      }));
    },
    previous: function() {
      var foundeditor, pos, temp;
      if (this.wasforwarding || this.wasrewinding === false) {
        temp = this.positionHistory.pop();
        if (temp != null) {
          this.positionFuture.push(temp);
        }
      }
      pos = this.positionHistory.pop();
      if (pos != null) {
        this.positionFuture.push(pos);
        this.rewinding = true;
        this.wasrewinding = true;
        this.wasforwarding = false;
        foundeditor = true;
        if (pos.pane !== atom.workspace.getActivePane()) {
          pos.pane.activate();
        }
        if (pos.editor !== atom.workspace.getActiveTextEditor()) {
          atom.workspace.activePane.activateItem(pos.editor);
        }
        atom.workspace.getActiveTextEditor().setCursorBufferPosition(pos.position, {
          autoscroll: false
        });
        return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
          center: true
        });
      }
    },
    next: function() {
      var foundeditor, pos, temp;
      if (this.wasrewinding || this.wasforwarding === false) {
        temp = this.positionFuture.pop();
        if (temp != null) {
          this.positionHistory.push(temp);
        }
      }
      pos = this.positionFuture.pop();
      if (pos != null) {
        this.positionHistory.push(pos);
        this.forwarding = true;
        this.wasforwarding = true;
        this.wasrewinding = false;
        foundeditor = true;
        if (pos.pane !== atom.workspace.getActivePane) {
          pos.pane.activate();
        }
        if (pos.editor !== atom.workspace.getActiveTextEditor()) {
          atom.workspace.activePane.activateItem(pos.editor);
        }
        atom.workspace.getActiveTextEditor().setCursorBufferPosition(pos.position, {
          autoscroll: false
        });
        return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
          center: true
        });
      }
    },
    deactivate: function() {
      return this.disposables.dispose();
    }
  };

}).call(this);
