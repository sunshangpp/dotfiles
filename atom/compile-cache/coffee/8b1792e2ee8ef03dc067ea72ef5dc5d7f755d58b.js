(function() {
  var CompositeDisposable, GocodeProvider, Range, path, _, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = GocodeProvider = (function() {
    GocodeProvider.prototype.selector = '.source.go';

    GocodeProvider.prototype.inclusionPriority = 1;

    GocodeProvider.prototype.excludeLowerPriority = true;

    GocodeProvider.prototype.suppressForCharacters = [];

    function GocodeProvider() {
      this.subscriptions = new CompositeDisposable;
      this.disableForSelector = atom.config.get('go-plus.autocompleteBlacklist');
      this.subscriptions.add(atom.config.observe('go-plus.suppressAutocompleteActivationForCharacters', (function(_this) {
        return function(value) {
          _this.suppressForCharacters = _.map(value, function(c) {
            var char;
            char = (c != null ? c.trim() : void 0) || '';
            char = (function() {
              switch (false) {
                case char.toLowerCase() !== 'comma':
                  return ',';
                case char.toLowerCase() !== 'newline':
                  return '\n';
                case char.toLowerCase() !== 'space':
                  return ' ';
                case char.toLowerCase() !== 'tab':
                  return '\t';
                default:
                  return char;
              }
            })();
            return char;
          });
          return _this.suppressForCharacters = _.compact(_this.suppressForCharacters);
        };
      })(this)));
    }

    GocodeProvider.prototype.setDispatch = function(dispatch) {
      this.dispatch = dispatch;
      return this.funcRegex = /^(?:func[(]{1})([^\)]*)(?:[)]{1})(?:$|(?:\s)([^\(]*$)|(?: [(]{1})([^\)]*)(?:[)]{1}))/i;
    };

    GocodeProvider.prototype.getSuggestions = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var args, buffer, cmd, configArgs, cwd, done, env, go, gopath, index, message, offset, quotedRange, text, _ref1, _ref2;
          if (options == null) {
            return resolve();
          }
          if (!((_ref1 = _this.dispatch) != null ? _ref1.isValidEditor(options.editor) : void 0)) {
            return resolve();
          }
          buffer = options.editor.getBuffer();
          if (buffer == null) {
            return resolve();
          }
          go = _this.dispatch.goexecutable.current();
          if (go == null) {
            return resolve();
          }
          gopath = go.buildgopath();
          if ((gopath == null) || gopath === '') {
            return resolve();
          }
          if (!options.bufferPosition) {
            return resolve();
          }
          index = buffer.characterIndexForPosition(options.bufferPosition);
          text = options.editor.getText();
          if (index > 0 && (_ref2 = text[index - 1], __indexOf.call(_this.suppressForCharacters, _ref2) >= 0)) {
            return resolve();
          }
          quotedRange = options.editor.displayBuffer.bufferRangeForScopeAtPosition('.string.quoted', options.bufferPosition);
          if (quotedRange) {
            return resolve();
          }
          offset = Buffer.byteLength(text.substring(0, index), "utf8");
          env = _this.dispatch.env();
          env['GOPATH'] = gopath;
          cwd = path.dirname(buffer.getPath());
          args = ['-f=json', 'autocomplete', buffer.getPath(), offset];
          configArgs = _this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('go-plus.gocodeArgs'));
          if ((configArgs != null) && _.size(configArgs) > 0) {
            args = _.union(configArgs, args);
          }
          cmd = go.gocode();
          if (cmd === false) {
            message = {
              line: false,
              column: false,
              msg: 'gocode Tool Missing',
              type: 'error',
              source: _this.name
            };
            resolve();
            return;
          }
          done = function(exitcode, stdout, stderr, messages) {
            if ((stderr != null) && stderr.trim() !== '') {
              console.log(_this.name + ' - stderr: ' + stderr);
            }
            if ((stdout != null) && stdout.trim() !== '') {
              messages = _this.mapMessages(stdout, options.editor, options.bufferPosition);
            }
            if ((messages != null ? messages.length : void 0) < 1) {
              return resolve();
            }
            return resolve(messages);
          };
          return _this.dispatch.executor.exec(cmd, cwd, env, done, args, text);
        };
      })(this));
    };

    GocodeProvider.prototype.mapMessages = function(data, editor, position) {
      var c, candidates, numPrefix, prefix, res, suggestion, suggestions, _i, _len;
      if (data == null) {
        return [];
      }
      res = JSON.parse(data);
      numPrefix = res[0];
      candidates = res[1];
      if (!candidates) {
        return [];
      }
      prefix = editor.getTextInBufferRange([[position.row, position.column - numPrefix], position]);
      suggestions = [];
      for (_i = 0, _len = candidates.length; _i < _len; _i++) {
        c = candidates[_i];
        suggestion = {
          replacementPrefix: prefix,
          leftLabel: c.type || c["class"],
          type: this.translateType(c["class"])
        };
        if (c["class"] === 'func') {
          suggestion = this.upgradeSuggestion(suggestion, c);
        } else {
          suggestion.text = c.name;
        }
        if (suggestion.type === 'package') {
          suggestion.iconHTML = '<i class="icon-package"></i>';
        }
        suggestions.push(suggestion);
      }
      return suggestions;
    };

    GocodeProvider.prototype.translateType = function(type) {
      switch (type) {
        case 'func':
          return 'function';
        case 'var':
          return 'variable';
        case 'const':
          return 'constant';
        case 'PANIC':
          return 'panic';
        default:
          return type;
      }
    };

    GocodeProvider.prototype.upgradeSuggestion = function(suggestion, c) {
      var match;
      if (!((c.type != null) && c.type !== '')) {
        return suggestion;
      }
      match = this.funcRegex.exec(c.type);
      if (!((match != null) && (match[0] != null))) {
        suggestion.snippet = c.name + '()';
        suggestion.leftLabel = '';
        return suggestion;
      }
      suggestion.leftLabel = match[2] || match[3] || '';
      suggestion.snippet = this.generateSnippet(c.name, match);
      return suggestion;
    };

    GocodeProvider.prototype.generateSnippet = function(name, match) {
      var arg, args, i, signature, _i, _len;
      signature = name;
      if (!((match[1] != null) && match[1] !== '')) {
        return signature + '()';
      }
      args = match[1].split(/, /);
      args = _.map(args, function(a) {
        if (!((a != null ? a.length : void 0) > 2)) {
          return a;
        }
        if (a.substring(a.length - 2, a.length) === '{}') {
          return a.substring(0, a.length - 1) + '\\}';
        }
        return a;
      });
      if (args.length === 1) {
        return signature + '(${1:' + args[0] + '})';
      }
      i = 1;
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (i === 1) {
          signature = signature + '(${' + i + ':' + arg + '}';
        } else {
          signature = signature + ', ${' + i + ':' + arg + '}';
        }
        i = i + 1;
      }
      signature = signature + ')';
      return signature;
    };

    GocodeProvider.prototype.dispose = function() {
      var _ref1;
      if ((_ref1 = this.subscriptions) != null) {
        _ref1.dispose();
      }
      this.subscriptions = null;
      this.disableForSelector = null;
      this.suppressForCharacters = null;
      return this.dispatch = null;
    };

    return GocodeProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29jb2RlcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxPQUFnQyxPQUFBLENBQVEsTUFBUixDQUFoQyxFQUFDLGFBQUEsS0FBRCxFQUFRLDJCQUFBLG1CQUFSLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsUUFBQSxHQUFVLFlBQVYsQ0FBQTs7QUFBQSw2QkFDQSxpQkFBQSxHQUFtQixDQURuQixDQUFBOztBQUFBLDZCQUVBLG9CQUFBLEdBQXNCLElBRnRCLENBQUE7O0FBQUEsNkJBR0EscUJBQUEsR0FBdUIsRUFIdkIsQ0FBQTs7QUFLYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FEdEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixxREFBcEIsRUFBMkUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQzVGLFVBQUEsS0FBQyxDQUFBLHFCQUFELEdBQXlCLENBQUMsQ0FBQyxHQUFGLENBQU0sS0FBTixFQUFhLFNBQUMsQ0FBRCxHQUFBO0FBQ3BD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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/gocodeprovider.coffee
