(function() {
  var Dispatch, Emitter, Environment, Executor, GoExecutable, Gobuild, Gocover, Godef, Gofmt, Golint, Gopath, Govet, LineMessageView, MessagePanelView, PlainMessageView, SplicerSplitter, Subscriber, async, os, path, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  Gofmt = require('./gofmt');

  Govet = require('./govet');

  Golint = require('./golint');

  Gopath = require('./gopath');

  Gobuild = require('./gobuild');

  Gocover = require('./gocover');

  Executor = require('./executor');

  Environment = require('./environment');

  GoExecutable = require('./goexecutable');

  Godef = require('./godef');

  SplicerSplitter = require('./util/splicersplitter');

  _ = require('underscore-plus');

  _ref1 = require('atom-message-panel'), MessagePanelView = _ref1.MessagePanelView, LineMessageView = _ref1.LineMessageView, PlainMessageView = _ref1.PlainMessageView;

  path = require('path');

  os = require('os');

  async = require('async');

  module.exports = Dispatch = (function() {
    Subscriber.includeInto(Dispatch);

    Emitter.includeInto(Dispatch);

    function Dispatch() {
      this.gettools = __bind(this.gettools, this);
      this.displayGoInfo = __bind(this.displayGoInfo, this);
      this.emitReady = __bind(this.emitReady, this);
      this.displayMessages = __bind(this.displayMessages, this);
      this.resetAndDisplayMessages = __bind(this.resetAndDisplayMessages, this);
      this.detect = __bind(this.detect, this);
      this.handleEvents = __bind(this.handleEvents, this);
      this.subscribeToAtomEvents = __bind(this.subscribeToAtomEvents, this);
      this.destroy = __bind(this.destroy, this);
      var gobuildsubscription, gocoversubscription, gofmtsubscription, golintsubscription, gopathsubscription, govetsubscription;
      this.activated = false;
      this.dispatching = false;
      this.ready = false;
      this.messages = [];
      this.items = [];
      this.environment = new Environment(process.env);
      this.executor = new Executor(this.environment.Clone());
      this.splicersplitter = new SplicerSplitter();
      this.goexecutable = new GoExecutable(this.env());
      this.gofmt = new Gofmt(this);
      this.govet = new Govet(this);
      this.golint = new Golint(this);
      this.gopath = new Gopath(this);
      this.gobuild = new Gobuild(this);
      this.gocover = new Gocover(this);
      this.godef = new Godef(this);
      if (this.messagepanel == null) {
        this.messagepanel = new MessagePanelView({
          title: '<span class="icon-diff-added"></span> go-plus',
          rawTitle: true
        });
      }
      gofmtsubscription = this.gofmt.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      golintsubscription = this.golint.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      govetsubscription = this.govet.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      gopathsubscription = this.gopath.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      gobuildsubscription = this.gobuild.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      gocoversubscription = this.gocover.on('reset', (function(_this) {
        return function(editor) {
          return _this.resetState(editor);
        };
      })(this));
      this.subscribe(gofmtsubscription);
      this.subscribe(golintsubscription);
      this.subscribe(govetsubscription);
      this.subscribe(gopathsubscription);
      this.subscribe(gobuildsubscription);
      this.subscribe(gocoversubscription);
      this.on('dispatch-complete', (function(_this) {
        return function(editor) {
          return _this.displayMessages(editor);
        };
      })(this));
      this.subscribeToAtomEvents();
      this.detect();
    }

    Dispatch.prototype.destroy = function() {
      var _ref2;
      this.destroyItems();
      this.unsubscribe();
      this.resetPanel();
      if ((_ref2 = this.messagepanel) != null) {
        _ref2.remove();
      }
      this.messagepanel = null;
      this.gocover.destroy();
      this.gobuild.destroy();
      this.golint.destroy();
      this.govet.destroy();
      this.gopath.destroy();
      this.gofmt.destroy();
      this.godef.destroy();
      this.gocover = null;
      this.gobuild = null;
      this.golint = null;
      this.govet = null;
      this.gopath = null;
      this.gofmt = null;
      this.godef = null;
      this.ready = false;
      this.activated = false;
      return this.emit('destroyed');
    };

    Dispatch.prototype.addItem = function(item) {
      if (__indexOf.call(this.items, item) >= 0) {
        return;
      }
      if (typeof item.on === 'function') {
        this.subscribe(item, 'destroyed', (function(_this) {
          return function() {
            return _this.removeItem(item);
          };
        })(this));
      }
      return this.items.splice(0, 0, item);
    };

    Dispatch.prototype.removeItem = function(item) {
      var index;
      index = this.items.indexOf(item);
      if (index === -1) {
        return;
      }
      if (typeof item.on === 'function') {
        this.unsubscribe(item);
      }
      return this.items.splice(index, 1);
    };

    Dispatch.prototype.destroyItems = function() {
      var item, _i, _len, _ref2, _results;
      if (!(this.items && _.size(this.items) > 0)) {
        return;
      }
      _ref2 = this.items;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        item = _ref2[_i];
        _results.push(item.dispose());
      }
      return _results;
    };

    Dispatch.prototype.subscribeToAtomEvents = function() {
      this.addItem(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.handleEvents(editor);
        };
      })(this)));
      this.addItem(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(event) {
          return _this.resetPanel();
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.getMissingTools', (function(_this) {
        return function() {
          if ((atom.config.get('go-plus.getMissingTools') != null) && atom.config.get('go-plus.getMissingTools') && _this.ready) {
            return _this.gettools(false);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.formatTool', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.displayGoInfo(true);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.goPath', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.displayGoInfo(true);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.environmentOverridesConfiguration', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.displayGoInfo(true);
          }
        };
      })(this)));
      this.addItem(atom.config.observe('go-plus.goInstallation', (function(_this) {
        return function() {
          if (_this.ready) {
            return _this.detect();
          }
        };
      })(this)));
      atom.commands.add('atom-workspace', {
        'golang:goinfo': (function(_this) {
          return function() {
            if (_this.ready && _this.activated) {
              return _this.displayGoInfo(true);
            }
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'golang:getmissingtools': (function(_this) {
          return function() {
            if (_this.activated) {
              return _this.gettools(false);
            }
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'golang:updatetools': (function(_this) {
          return function() {
            if (_this.activated) {
              return _this.gettools(true);
            }
          };
        })(this)
      });
      return this.activated = true;
    };

    Dispatch.prototype.handleEvents = function(editor) {
      var buffer, destroyedsubscription, modifiedsubscription, savedsubscription;
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (buffer == null) {
        return;
      }
      this.updateGutter(editor, this.messages);
      modifiedsubscription = buffer.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.activated) {
            return;
          }
          return _this.handleBufferChanged(editor);
        };
      })(this));
      savedsubscription = buffer.onDidSave((function(_this) {
        return function() {
          if (!_this.activated) {
            return;
          }
          if (!!_this.dispatching) {
            return;
          }
          return _this.handleBufferSave(editor, true);
        };
      })(this));
      destroyedsubscription = buffer.onDidDestroy((function(_this) {
        return function() {
          if (savedsubscription != null) {
            savedsubscription.dispose();
          }
          if (savedsubscription != null) {
            _this.removeItem(savedsubscription);
          }
          if (modifiedsubscription != null) {
            modifiedsubscription.dispose();
          }
          if (modifiedsubscription != null) {
            return _this.removeItem(modifiedsubscription);
          }
        };
      })(this));
      this.addItem(modifiedsubscription);
      this.addItem(savedsubscription);
      return this.addItem(destroyedsubscription);
    };

    Dispatch.prototype.detect = function() {
      this.ready = false;
      return this.goexecutable.detect().then((function(_this) {
        return function(gos) {
          if ((atom.config.get('go-plus.getMissingTools') != null) && atom.config.get('go-plus.getMissingTools')) {
            _this.gettools(false);
          }
          _this.displayGoInfo(false);
          return _this.emitReady();
        };
      })(this));
    };

    Dispatch.prototype.resetAndDisplayMessages = function(editor, msgs) {
      if (!this.isValidEditor(editor)) {
        return;
      }
      this.resetState(editor);
      this.collectMessages(msgs);
      return this.displayMessages(editor);
    };

    Dispatch.prototype.displayMessages = function(editor) {
      this.updatePane(editor, this.messages);
      this.updateGutter(editor, this.messages);
      this.dispatching = false;
      return this.emit('display-complete');
    };

    Dispatch.prototype.emitReady = function() {
      this.ready = true;
      return this.emit('ready');
    };

    Dispatch.prototype.displayGoInfo = function(force) {
      var editor, go, gopath, thepath, _ref2, _ref3, _ref4;
      editor = (_ref2 = atom.workspace) != null ? _ref2.getActiveTextEditor() : void 0;
      if (!force) {
        if (!this.isValidEditor(editor)) {
          return;
        }
      }
      this.resetPanel();
      go = this.goexecutable.current();
      if ((go != null) && (go.executable != null) && go.executable.trim() !== '') {
        this.messagepanel.add(new PlainMessageView({
          raw: true,
          message: '<b>Go:</b> ' + go.name + ' (@' + go.executable + ')',
          className: 'text-info'
        }));
        gopath = go.buildgopath();
        if ((gopath != null) && gopath.trim() !== '') {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>GOPATH:</b> ' + gopath,
            className: 'text-highlight'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>GOPATH:</b> Not Set (You Should Try Launching Atom Using The Shell Commands...)',
            className: 'text-error'
          }));
        }
        if ((go.cover() != null) && go.cover() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Cover Tool:</b> ' + go.cover(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Cover Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.vet() != null) && go.vet() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Vet Tool:</b> ' + go.vet(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Vet Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.format() != null) && go.format() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Format Tool:</b> ' + go.format(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Format Tool (' + atom.config.get('go-plus.formatTool') + '):</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.golint() != null) && go.golint() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Lint Tool:</b> ' + go.golint(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Lint Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.gocode() != null) && go.gocode() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Tool:</b> ' + go.gocode(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if ((go.godef() != null) && go.godef() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Godef Tool:</b> ' + go.godef(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Godef Tool:</b> Not Found',
            className: 'text-error'
          }));
        }
        if (_.contains(atom.packages.getAvailablePackageNames(), 'autocomplete-plus')) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Status:</b> Enabled',
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Gocode Status:</b> Not Enabled (autocomplete-plus needs to be installed and active; install it and restart)',
            className: 'text-warning'
          }));
        }
        if ((go.oracle() != null) && go.oracle() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Oracle Tool: ' + go.oracle(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Oracle Tool: Not Found',
            className: 'text-error'
          }));
        }
        if ((go.git() != null) && go.git() !== false) {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Git:</b> ' + go.git(),
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>Git:</b> Not Found',
            className: 'text-warning'
          }));
        }
        thepath = os.platform() === 'win32' ? (_ref3 = this.env()) != null ? _ref3.Path : void 0 : (_ref4 = this.env()) != null ? _ref4.PATH : void 0;
        if ((thepath != null) && thepath.trim() !== '') {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>PATH:</b> ' + thepath,
            className: 'text-subtle'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            raw: true,
            message: '<b>PATH:</b> Not Set',
            className: 'text-error'
          }));
        }
      } else {
        this.messagepanel.add(new PlainMessageView({
          raw: true,
          message: 'No Go Installations Were Found',
          className: 'text-error'
        }));
      }
      this.messagepanel.add(new PlainMessageView({
        raw: true,
        message: '<b>Atom:</b> ' + atom.appVersion + ' (' + os.platform() + ' ' + os.arch() + ' ' + os.release() + ')',
        className: 'text-info'
      }));
      return this.messagepanel.attach();
    };

    Dispatch.prototype.collectMessages = function(messages) {
      if ((messages != null) && _.size(messages) > 0) {
        messages = _.flatten(messages);
      }
      messages = _.filter(messages, function(element, index, list) {
        return element != null;
      });
      if (messages == null) {
        return;
      }
      messages = _.filter(messages, function(message) {
        return message != null;
      });
      this.messages = _.union(this.messages, messages);
      this.messages = _.uniq(this.messages, function(element, index, list) {
        return (element != null ? element.line : void 0) + ':' + (element != null ? element.column : void 0) + ':' + (element != null ? element.msg : void 0);
      });
      return this.emit('messages-collected', _.size(this.messages));
    };

    Dispatch.prototype.triggerPipeline = function(editor, saving) {
      var go;
      this.dispatching = true;
      go = this.goexecutable.current();
      if (!((go != null) && (go.executable != null) && go.executable.trim() !== '')) {
        this.displayGoInfo(false);
        this.dispatching = false;
        return;
      }
      async.series([
        (function(_this) {
          return function(callback) {
            return _this.gofmt.formatBuffer(editor, saving, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, modifymessages) {
          _this.collectMessages(modifymessages);
          return async.parallel([
            function(callback) {
              return _this.govet.checkBuffer(editor, saving, callback);
            }, function(callback) {
              return _this.golint.checkBuffer(editor, saving, callback);
            }, function(callback) {
              return _this.gopath.check(editor, saving, callback);
            }, function(callback) {
              return _this.gobuild.checkBuffer(editor, saving, callback);
            }
          ], function(err, checkmessages) {
            _this.collectMessages(checkmessages);
            return _this.emit('dispatch-complete', editor);
          });
        };
      })(this));
      return async.series([
        (function(_this) {
          return function(callback) {
            return _this.gocover.runCoverage(editor, saving, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, modifymessages) {
          return _this.emit('coverage-complete');
        };
      })(this));
    };

    Dispatch.prototype.handleBufferSave = function(editor, saving) {
      if (!(this.ready && this.activated)) {
        return;
      }
      if (!this.isValidEditor(editor)) {
        return;
      }
      this.resetState(editor);
      return this.triggerPipeline(editor, saving);
    };

    Dispatch.prototype.handleBufferChanged = function(editor) {
      if (!(this.ready && this.activated)) {
        return;
      }
      if (!this.isValidEditor(editor)) {

      }
    };

    Dispatch.prototype.resetState = function(editor) {
      this.messages = [];
      this.resetGutter(editor);
      return this.resetPanel();
    };

    Dispatch.prototype.resetGutter = function(editor) {
      var marker, markers, _i, _len, _ref2, _results;
      if (!this.isValidEditor(editor)) {
        return;
      }
      markers = editor != null ? (_ref2 = editor.getBuffer()) != null ? _ref2.findMarkers({
        "class": 'go-plus'
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
    };

    Dispatch.prototype.updateGutter = function(editor, messages) {
      var buffer, error, marker, message, skip, _i, _len, _results;
      this.resetGutter(editor);
      if (!this.isValidEditor(editor)) {
        return;
      }
      if (!((messages != null) && messages.length > 0)) {
        return;
      }
      buffer = editor != null ? editor.getBuffer() : void 0;
      if (buffer == null) {
        return;
      }
      _results = [];
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        skip = false;
        if (((message != null ? message.file : void 0) != null) && message.file !== '') {
          skip = message.file !== (buffer != null ? buffer.getPath() : void 0);
        }
        if (!skip) {
          if (((message != null ? message.line : void 0) != null) && message.line !== false && message.line >= 0) {
            try {
              marker = buffer != null ? buffer.markPosition([message.line - 1, 0], {
                "class": 'go-plus',
                invalidate: 'touch'
              }) : void 0;
              _results.push(editor != null ? editor.decorateMarker(marker, {
                type: 'line-number',
                "class": 'goplus-' + message.type
              }) : void 0);
            } catch (_error) {
              error = _error;
              _results.push(console.log(error));
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dispatch.prototype.resetPanel = function() {
      var _ref2, _ref3;
      if ((_ref2 = this.messagepanel) != null) {
        _ref2.close();
      }
      return (_ref3 = this.messagepanel) != null ? _ref3.clear() : void 0;
    };

    Dispatch.prototype.updatePane = function(editor, messages) {
      var className, column, file, line, message, sortedMessages, _i, _len;
      this.resetPanel;
      if (messages == null) {
        return;
      }
      if (messages.length <= 0 && atom.config.get('go-plus.showPanelWhenNoIssuesExist')) {
        this.messagepanel.add(new PlainMessageView({
          message: 'No Issues',
          className: 'text-success'
        }));
        this.messagepanel.attach();
        return;
      }
      if (!(messages.length > 0)) {
        return;
      }
      if (!atom.config.get('go-plus.showPanel')) {
        return;
      }
      sortedMessages = _.sortBy(this.messages, function(element, index, list) {
        return parseInt(element.line, 10);
      });
      for (_i = 0, _len = sortedMessages.length; _i < _len; _i++) {
        message = sortedMessages[_i];
        className = (function() {
          switch (message.type) {
            case 'error':
              return 'text-error';
            case 'warning':
              return 'text-warning';
            default:
              return 'text-info';
          }
        })();
        file = (message.file != null) && message.file.trim() !== '' ? message.file : null;
        if ((file != null) && file !== '' && ((typeof atom !== "undefined" && atom !== null ? atom.project : void 0) != null)) {
          file = atom.project.relativize(file);
        }
        column = (message.column != null) && message.column !== '' && message.column !== false ? message.column : null;
        line = (message.line != null) && message.line !== '' && message.line !== false ? message.line : null;
        if (file === null && column === null && line === null) {
          this.messagepanel.add(new PlainMessageView({
            message: message.msg,
            className: className
          }));
        } else {
          this.messagepanel.add(new LineMessageView({
            file: file,
            line: line,
            character: column,
            message: message.msg,
            className: className
          }));
        }
      }
      if ((typeof atom !== "undefined" && atom !== null ? atom.workspace : void 0) != null) {
        return this.messagepanel.attach();
      }
    };

    Dispatch.prototype.isValidEditor = function(editor) {
      var _ref2;
      return (editor != null ? (_ref2 = editor.getGrammar()) != null ? _ref2.scopeName : void 0 : void 0) === 'source.go';
    };

    Dispatch.prototype.env = function() {
      return this.environment.Clone();
    };

    Dispatch.prototype.gettools = function(updateExistingTools) {
      var thego;
      updateExistingTools = (updateExistingTools != null) && updateExistingTools;
      this.ready = false;
      thego = this.goexecutable.current();
      if (!((thego != null) && (thego.executable != null) && thego.executable.trim() !== '')) {
        this.displayGoInfo(false);
        return;
      }
      if (!(thego.toolsAreMissing() || updateExistingTools)) {
        this.emitReady();
        return;
      }
      this.resetPanel();
      this.messagepanel.add(new PlainMessageView({
        message: 'Running `go get -u` to get required tools...',
        className: 'text-success'
      }));
      this.messagepanel.attach();
      this.goexecutable.on('gettools-complete', (function(_this) {
        return function() {
          _this.displayGoInfo(true);
          return _this.emitReady();
        };
      })(this));
      return this.goexecutable.gettools(thego, updateExistingTools);
    };

    return Dispatch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZGlzcGF0Y2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdPQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BQWIsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FGUixDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUpULENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FMVixDQUFBOztBQUFBLEVBTUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBTlYsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQVBYLENBQUE7O0FBQUEsRUFRQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVIsQ0FSZCxDQUFBOztBQUFBLEVBU0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQVRmLENBQUE7O0FBQUEsRUFVQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FWUixDQUFBOztBQUFBLEVBV0EsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVIsQ0FYbEIsQ0FBQTs7QUFBQSxFQVlBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FaSixDQUFBOztBQUFBLEVBYUEsUUFBd0QsT0FBQSxDQUFRLG9CQUFSLENBQXhELEVBQUMseUJBQUEsZ0JBQUQsRUFBbUIsd0JBQUEsZUFBbkIs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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/dispatch.coffee
