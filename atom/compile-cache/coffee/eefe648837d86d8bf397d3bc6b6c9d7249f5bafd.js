(function() {
  var Emitter, Gocover, GocoverParser, Subscriber, areas, fs, path, spawn, temp, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawn = require('child_process').spawn;

  temp = require('temp');

  path = require('path');

  fs = require('fs-plus');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  GocoverParser = require('./gocover/gocover-parser');

  _ = require('underscore-plus');

  areas = [];

  module.exports = Gocover = (function() {
    Subscriber.includeInto(Gocover);

    Emitter.includeInto(Gocover);

    function Gocover(dispatch) {
      this.runCoverage = __bind(this.runCoverage, this);
      this.runCoverageForCurrentEditor = __bind(this.runCoverageForCurrentEditor, this);
      this.createCoverageFile = __bind(this.createCoverageFile, this);
      this.removeCoverageFile = __bind(this.removeCoverageFile, this);
      this.addMarkersToEditor = __bind(this.addMarkersToEditor, this);
      this.clearMarkersFromEditors = __bind(this.clearMarkersFromEditors, this);
      this.addMarkersToEditors = __bind(this.addMarkersToEditors, this);
      this.dispatch = dispatch;
      this.name = 'gocover';
      this.covering = false;
      this.parser = new GocoverParser();
      this.coverageFile = false;
      this.ranges = false;
      atom.commands.add('atom-workspace', {
        'golang:gocover': (function(_this) {
          return function() {
            return _this.runCoverageForCurrentEditor();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'golang:cleargocover': (function(_this) {
          return function() {
            return _this.clearMarkersFromEditors();
          };
        })(this)
      });
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.addMarkersToEditor(editor);
        };
      })(this));
    }

    Gocover.prototype.destroy = function() {
      this.unsubscribe();
      this.dispatch = null;
      this.parser = null;
      return this.removeCoverageFile();
    };

    Gocover.prototype.addMarkersToEditors = function() {
      var editor, editors, _i, _len, _results;
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        _results.push(this.addMarkersToEditor(editor));
      }
      return _results;
    };

    Gocover.prototype.clearMarkersFromEditors = function() {
      var editor, editors, _i, _len, _results;
      this.removeCoverageFile();
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        _results.push(this.clearMarkers(editor));
      }
      return _results;
    };

    Gocover.prototype.addMarkersToEditor = function(editor) {
      var buffer, clazz, editorRanges, error, file, marker, range, _i, _len, _ref1, _results;
      if ((editor != null ? (_ref1 = editor.getGrammar()) != null ? _ref1.scopeName : void 0 : void 0) !== 'source.go') {
        return;
      }
      file = editor != null ? editor.getPath() : void 0;
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (!((file != null) && (buffer != null))) {
        return;
      }
      this.clearMarkers(editor);
      if (!((this.ranges != null) && this.ranges && _.size(this.ranges) > 0)) {
        return;
      }
      editorRanges = _.filter(this.ranges, function(r) {
        return _.endsWith(file, r.file);
      });
      try {
        _results = [];
        for (_i = 0, _len = editorRanges.length; _i < _len; _i++) {
          range = editorRanges[_i];
          marker = buffer.markRange(range.range, {
            "class": 'gocover',
            gocovercount: range.count,
            invalidate: 'touch'
          });
          clazz = range.count > 0 ? 'covered' : 'uncovered';
          _results.push(editor.decorateMarker(marker, {
            type: 'highlight',
            "class": clazz,
            onlyNonEmpty: true
          }));
        }
        return _results;
      } catch (_error) {
        error = _error;
        return console.log(error);
      }
    };

    Gocover.prototype.clearMarkers = function(editor) {
      var error, marker, markers, _i, _len, _ref1, _ref2, _results;
      if ((editor != null ? (_ref1 = editor.getGrammar()) != null ? _ref1.scopeName : void 0 : void 0) !== 'source.go') {
        return;
      }
      try {
        markers = editor != null ? (_ref2 = editor.getBuffer()) != null ? _ref2.findMarkers({
          "class": 'gocover'
        }) : void 0 : void 0;
        if (!((markers != null) && _.size(markers) > 0)) {
          return;
        }
        _results = [];
        for (_i = 0, _len = markers.length; _i < _len; _i++) {
          marker = markers[_i];
          _results.push(marker.destroy());
        }
        return _results;
      } catch (_error) {
        error = _error;
        return console.log(error);
      }
    };

    Gocover.prototype.reset = function(editor) {
      return this.emit('reset', editor);
    };

    Gocover.prototype.removeCoverageFile = function() {
      this.ranges = [];
      if (this.coverageFile) {
        try {
          return fs.unlinkSync(this.coverageFile);
        } catch (_error) {

        }
      }
    };

    Gocover.prototype.createCoverageFile = function() {
      var tempDir;
      this.removeCoverageFile();
      tempDir = temp.mkdirSync();
      return this.coverageFile = path.join(tempDir, 'coverage.out');
    };

    Gocover.prototype.runCoverageForCurrentEditor = function() {
      var editor, _ref1;
      editor = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspace) != null ? _ref1.getActiveTextEditor() : void 0 : void 0;
      if (editor == null) {
        return;
      }
      this.reset(editor);
      return this.runCoverage(editor, false);
    };

    Gocover.prototype.runCoverage = function(editor, saving, callback) {
      var args, buffer, cmd, cover, cwd, done, env, go, gopath, message, re, tempFile;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditor(editor)) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('go-plus.runCoverageOnSave')) {
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
      if (this.covering) {
        this.emit(this.name + '-complete', editor, saving);
        callback(null);
        return;
      }
      this.covering = true;
      this.clearMarkersFromEditors();
      tempFile = this.createCoverageFile();
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
      re = new RegExp(buffer.getBaseName() + '$');
      go = this.dispatch.goexecutable.current();
      cover = go.cover();
      if (cover === false) {
        message = {
          line: false,
          column: false,
          msg: 'Cover Tool Missing',
          type: 'error',
          source: this.name
        };
        this.covering = false;
        callback(null, [message]);
        return;
      }
      cwd = buffer.getPath().replace(re, '');
      cmd = this.dispatch.goexecutable.current().executable;
      args = ['test', "-coverprofile=" + tempFile];
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if (exitcode === 0) {
            _this.ranges = _this.parser.ranges(tempFile);
            _this.addMarkersToEditors();
          }
          _this.covering = false;
          _this.emit(_this.name + '-complete', editor, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, env, done, args);
    };

    return Gocover;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29jb3Zlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BSmIsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSLENBTGhCLENBQUE7O0FBQUEsRUFNQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTkosQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxFQVJSLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixPQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixPQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxpQkFBQyxRQUFELEdBQUE7QUFDWCx1REFBQSxDQUFBO0FBQUEsdUZBQUEsQ0FBQTtBQUFBLHFFQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxD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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/gocover.coffee
