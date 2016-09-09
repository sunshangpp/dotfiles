Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

'use babel';

var GocodeProvider = (function () {
  function GocodeProvider(goconfigFunc, gogetFunc) {
    var _this = this;

    _classCallCheck(this, GocodeProvider);

    this.goconfig = goconfigFunc;
    this.goget = gogetFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscribers = [];

    this.selector = '.source.go';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = atom.config.get('autocomplete-go.suppressBuiltinAutocompleteProvider');
    this.suppressForCharacters = [];
    this.disableForSelector = atom.config.get('autocomplete-go.scopeBlacklist');
    var suppressSubscription = atom.config.observe('autocomplete-go.suppressActivationForCharacters', function (value) {
      _this.suppressForCharacters = _lodash2['default'].map(value, function (c) {
        var char = c ? c.trim() : '';
        char = (function () {
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
      _this.suppressForCharacters = _lodash2['default'].compact(_this.suppressForCharacters);
    });
    this.subscriptions.add(suppressSubscription);
    var snippetModeSubscription = atom.config.observe('autocomplete-go.snippetMode', function (value) {
      _this.snippetMode = value;
    });
    this.subscriptions.add(snippetModeSubscription);
    this.funcRegex = /^(?:func[(]{1})([^\)]*)(?:[)]{1})(?:$|(?:\s)([^\(]*$)|(?: [(]{1})([^\)]*)(?:[)]{1}))/i;
  }

  _createClass(GocodeProvider, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      this.goconfig = null;
      this.subscribers = null;
      this.selector = null;
      this.inclusionPriority = null;
      this.excludeLowerPriority = null;
      this.suppressForCharacters = null;
      this.snippetMode = null;
      this.disableForSelector = null;
      this.funcRegex = null;
    }
  }, {
    key: 'ready',
    value: function ready() {
      if (!this.goconfig) {
        return false;
      }
      var config = this.goconfig();
      if (!config) {
        return false;
      }
      return true;
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {
      if (!editor || !editor.getGrammar) {
        return false;
      }
      var grammar = editor.getGrammar();
      if (!grammar) {
        return false;
      }
      if (grammar.scopeName === 'source.go') {
        return true;
      }
      return false;
    }
  }, {
    key: 'characterIsSuppressed',
    value: function characterIsSuppressed(char) {
      return this.suppressForCharacters.indexOf(char) !== -1;
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(options) {
      var _this2 = this;

      var p = new Promise(function (resolve) {
        if (!options || !_this2.ready() || !_this2.isValidEditor(options.editor)) {
          return resolve();
        }
        var config = _this2.goconfig();
        var buffer = options.editor.getBuffer();
        if (!buffer || !options.bufferPosition) {
          return resolve();
        }

        var index = buffer.characterIndexForPosition(options.bufferPosition);
        var text = options.editor.getText();
        if (index > 0 && _this2.characterIsSuppressed(text[index - 1])) {
          return resolve();
        }
        var offset = Buffer.byteLength(text.substring(0, index), 'utf8');

        var locatorOptions = {
          file: options.editor.getPath(),
          directory: _path2['default'].dirname(options.editor.getPath())
        };

        var args = ['-f=json', 'autocomplete', buffer.getPath(), offset];
        config.locator.findTool('gocode', locatorOptions).then(function (cmd) {
          if (!cmd) {
            resolve();
            return false;
          }
          var cwd = _path2['default'].dirname(buffer.getPath());
          var env = config.environment(locatorOptions);
          config.executor.exec(cmd, args, { cwd: cwd, env: env, input: text }).then(function (r) {
            if (r.stderr && r.stderr.trim() !== '') {
              console.log('autocomplete-go: (stderr) ' + r.stderr);
            }
            var messages = [];
            if (r.stdout && r.stdout.trim() !== '') {
              messages = _this2.mapMessages(r.stdout, options.editor, options.bufferPosition);
            }
            if (!messages || messages.length < 1) {
              return resolve();
            }
            resolve(messages);
          })['catch'](function (e) {
            console.log(e);
            resolve();
          });
        });
      });

      if (this.subscribers && this.subscribers.length > 0) {
        for (var subscriber of this.subscribers) {
          subscriber(p);
        }
      }
      return p;
    }
  }, {
    key: 'onDidGetSuggestions',
    value: function onDidGetSuggestions(s) {
      if (this.subscribers) {
        this.subscribers.push(s);
      }
    }
  }, {
    key: 'mapMessages',
    value: function mapMessages(data, editor, position) {
      if (!data) {
        return [];
      }
      var res = undefined;
      try {
        res = JSON.parse(data);
      } catch (e) {
        if (e && e.handle) {
          e.handle();
        }
        atom.notifications.addError('gocode error', {
          detail: data,
          dismissable: true
        });
        console.log(e);
        return [];
      }

      var numPrefix = res[0];
      var candidates = res[1];
      if (!candidates) {
        return [];
      }
      var prefix = editor.getTextInBufferRange([[position.row, position.column - numPrefix], position]);
      var suffix = false;
      try {
        suffix = editor.getTextInBufferRange([position, [position.row, position.column + 1]]);
      } catch (e) {
        console.log(e);
      }
      var suggestions = [];
      for (var c of candidates) {
        var suggestion = {
          replacementPrefix: prefix,
          leftLabel: c.type || c['class'],
          type: this.translateType(c['class'])
        };
        if (c['class'] === 'func' && (!suffix || suffix !== '(')) {
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
    }
  }, {
    key: 'translateType',
    value: function translateType(type) {
      if (type === 'func') {
        return 'function';
      }
      if (type === 'var') {
        return 'variable';
      }
      if (type === 'const') {
        return 'constant';
      }
      if (type === 'PANIC') {
        return 'panic';
      }
      return type;
    }
  }, {
    key: 'upgradeSuggestion',
    value: function upgradeSuggestion(suggestion, c) {
      if (!c || !c.type || c.type === '') {
        return suggestion;
      }
      var match = this.funcRegex.exec(c.type);
      if (!match || !match[0]) {
        // Not a function
        suggestion.snippet = c.name + '()';
        suggestion.leftLabel = '';
        return suggestion;
      }
      suggestion.leftLabel = match[2] || match[3] || '';

      var res = this.generateSnippet(c.name, match);
      suggestion.snippet = res.snippet;
      suggestion.displayText = res.displayText;
      return suggestion;
    }
  }, {
    key: 'generateSnippet',
    value: function generateSnippet(name, match) {
      var signature = {
        snippet: name,
        displayText: name
      };

      if (!match || !match[1] || match[1] === '') {
        // Has no arguments
        return {
          snippet: name + '()$0',
          displayText: name + '()'
        };
      }

      var args = match[1].split(/, /);
      args = _lodash2['default'].map(args, function (a) {
        if (!a || a.length <= 2) {
          return { display: a, snippet: a };
        }
        if (a.substring(a.length - 2, a.length) === '{}') {
          return { display: a, snippet: a.substring(0, a.length - 1) + '\\}' };
        }
        return { display: a, snippet: a };
      });

      var i = 1;
      for (var arg of args) {
        if (this.snippetMode === 'name') {
          var parts = arg.snippet.split(' ');
          arg.snippet = parts[0];
        }
        if (i === 1) {
          signature.snippet = name + '(${' + i + ':' + arg.snippet + '}';
          signature.displayText = name + '(' + arg.display;
        } else {
          signature.snippet = signature.snippet + ', ${' + i + ':' + arg.snippet + '}';
          signature.displayText = signature.displayText + ', ' + arg.display;
        }
        i = i + 1;
      }

      signature.snippet = signature.snippet + ')$0';
      signature.displayText = signature.displayText + ')';

      if (this.snippetMode === 'none') {
        // user doesn't care about arg names/types
        signature.snippet = name + '($0)';
      }

      return signature;
    }
  }]);

  return GocodeProvider;
})();

exports.GocodeProvider = GocodeProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1nby9saWIvZ29jb2RlcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7b0JBQ3ZCLE1BQU07Ozs7c0JBQ1QsUUFBUTs7OztBQUp0QixXQUFXLENBQUE7O0lBTUwsY0FBYztBQUNOLFdBRFIsY0FBYyxDQUNMLFlBQVksRUFBRSxTQUFTLEVBQUU7OzswQkFEbEMsY0FBYzs7QUFFaEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUE7QUFDNUIsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTs7QUFFckIsUUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUE7QUFDNUIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQTtBQUMxQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscURBQXFELENBQUMsQ0FBQTtBQUNsRyxRQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFBO0FBQy9CLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzNFLFFBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaURBQWlELEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0csWUFBSyxxQkFBcUIsR0FBRyxvQkFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQy9DLFlBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFBO0FBQzVCLFlBQUksR0FBRyxDQUFDLFlBQU07QUFDWixr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QTtPQUNWOztBQUVELGVBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDN0MsZUFBUyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQTs7QUFFbkQsVUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sRUFBRTs7QUFFL0IsaUJBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQTtPQUNsQzs7QUFFRCxhQUFPLFNBQVMsQ0FBQTtLQUNqQjs7O1NBN1JHLGNBQWM7OztRQStSWixjQUFjLEdBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZ28vbGliL2dvY29kZXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuY2xhc3MgR29jb2RlUHJvdmlkZXIge1xuICBjb25zdHJ1Y3RvciAoZ29jb25maWdGdW5jLCBnb2dldEZ1bmMpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdGdW5jXG4gICAgdGhpcy5nb2dldCA9IGdvZ2V0RnVuY1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cblxuICAgIHRoaXMuc2VsZWN0b3IgPSAnLnNvdXJjZS5nbydcbiAgICB0aGlzLmluY2x1c2lvblByaW9yaXR5ID0gMVxuICAgIHRoaXMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1nby5zdXBwcmVzc0J1aWx0aW5BdXRvY29tcGxldGVQcm92aWRlcicpXG4gICAgdGhpcy5zdXBwcmVzc0ZvckNoYXJhY3RlcnMgPSBbXVxuICAgIHRoaXMuZGlzYWJsZUZvclNlbGVjdG9yID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtZ28uc2NvcGVCbGFja2xpc3QnKVxuICAgIGxldCBzdXBwcmVzc1N1YnNjcmlwdGlvbiA9IGF0b20uY29uZmlnLm9ic2VydmUoJ2F1dG9jb21wbGV0ZS1nby5zdXBwcmVzc0FjdGl2YXRpb25Gb3JDaGFyYWN0ZXJzJywgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnN1cHByZXNzRm9yQ2hhcmFjdGVycyA9IF8ubWFwKHZhbHVlLCAoYykgPT4ge1xuICAgICAgICBsZXQgY2hhciA9IGMgPyBjLnRyaW0oKSA6ICcnXG4gICAgICAgIGNoYXIgPSAoKCkgPT4ge1xuICAgICAgICAgIHN3aXRjaCAoZmFsc2UpIHtcbiAgICAgICAgICAgIGNhc2UgY2hhci50b0xvd2VyQ2FzZSgpICE9PSAnY29tbWEnOlxuICAgICAgICAgICAgICByZXR1cm4gJywnXG4gICAgICAgICAgICBjYXNlIGNoYXIudG9Mb3dlckNhc2UoKSAhPT0gJ25ld2xpbmUnOlxuICAgICAgICAgICAgICByZXR1cm4gJ1xcbidcbiAgICAgICAgICAgIGNhc2UgY2hhci50b0xvd2VyQ2FzZSgpICE9PSAnc3BhY2UnOlxuICAgICAgICAgICAgICByZXR1cm4gJyAnXG4gICAgICAgICAgICBjYXNlIGNoYXIudG9Mb3dlckNhc2UoKSAhPT0gJ3RhYic6XG4gICAgICAgICAgICAgIHJldHVybiAnXFx0J1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuIGNoYXJcbiAgICAgICAgICB9XG4gICAgICAgIH0pKClcbiAgICAgICAgcmV0dXJuIGNoYXJcbiAgICAgIH0pXG4gICAgICB0aGlzLnN1cHByZXNzRm9yQ2hhcmFjdGVycyA9IF8uY29tcGFjdCh0aGlzLnN1cHByZXNzRm9yQ2hhcmFjdGVycylcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoc3VwcHJlc3NTdWJzY3JpcHRpb24pXG4gICAgbGV0IHNuaXBwZXRNb2RlU3Vic2NyaXB0aW9uID0gYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2NvbXBsZXRlLWdvLnNuaXBwZXRNb2RlJywgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnNuaXBwZXRNb2RlID0gdmFsdWVcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoc25pcHBldE1vZGVTdWJzY3JpcHRpb24pXG4gICAgdGhpcy5mdW5jUmVnZXggPSAvXig/OmZ1bmNbKF17MX0pKFteXFwpXSopKD86WyldezF9KSg/OiR8KD86XFxzKShbXlxcKF0qJCl8KD86IFsoXXsxfSkoW15cXCldKikoPzpbKV17MX0pKS9pXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvY29uZmlnID0gbnVsbFxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBudWxsXG4gICAgdGhpcy5zZWxlY3RvciA9IG51bGxcbiAgICB0aGlzLmluY2x1c2lvblByaW9yaXR5ID0gbnVsbFxuICAgIHRoaXMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSBudWxsXG4gICAgdGhpcy5zdXBwcmVzc0ZvckNoYXJhY3RlcnMgPSBudWxsXG4gICAgdGhpcy5zbmlwcGV0TW9kZSA9IG51bGxcbiAgICB0aGlzLmRpc2FibGVGb3JTZWxlY3RvciA9IG51bGxcbiAgICB0aGlzLmZ1bmNSZWdleCA9IG51bGxcbiAgfVxuXG4gIHJlYWR5ICgpIHtcbiAgICBpZiAoIXRoaXMuZ29jb25maWcpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaXNWYWxpZEVkaXRvciAoZWRpdG9yKSB7XG4gICAgaWYgKCFlZGl0b3IgfHwgIWVkaXRvci5nZXRHcmFtbWFyKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG4gICAgaWYgKCFncmFtbWFyKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKGdyYW1tYXIuc2NvcGVOYW1lID09PSAnc291cmNlLmdvJykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjaGFyYWN0ZXJJc1N1cHByZXNzZWQgKGNoYXIpIHtcbiAgICByZXR1cm4gdGhpcy5zdXBwcmVzc0ZvckNoYXJhY3RlcnMuaW5kZXhPZihjaGFyKSAhPT0gLTFcbiAgfVxuXG4gIGdldFN1Z2dlc3Rpb25zIChvcHRpb25zKSB7XG4gICAgbGV0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zIHx8ICF0aGlzLnJlYWR5KCkgfHwgIXRoaXMuaXNWYWxpZEVkaXRvcihvcHRpb25zLmVkaXRvcikpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgfVxuICAgICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgICAgbGV0IGJ1ZmZlciA9IG9wdGlvbnMuZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBpZiAoIWJ1ZmZlciB8fCAhb3B0aW9ucy5idWZmZXJQb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICB9XG5cbiAgICAgIGxldCBpbmRleCA9IGJ1ZmZlci5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKG9wdGlvbnMuYnVmZmVyUG9zaXRpb24pXG4gICAgICBsZXQgdGV4dCA9IG9wdGlvbnMuZWRpdG9yLmdldFRleHQoKVxuICAgICAgaWYgKGluZGV4ID4gMCAmJiB0aGlzLmNoYXJhY3RlcklzU3VwcHJlc3NlZCh0ZXh0W2luZGV4IC0gMV0pKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIGxldCBvZmZzZXQgPSBCdWZmZXIuYnl0ZUxlbmd0aCh0ZXh0LnN1YnN0cmluZygwLCBpbmRleCksICd1dGY4JylcblxuICAgICAgbGV0IGxvY2F0b3JPcHRpb25zID0ge1xuICAgICAgICBmaWxlOiBvcHRpb25zLmVkaXRvci5nZXRQYXRoKCksXG4gICAgICAgIGRpcmVjdG9yeTogcGF0aC5kaXJuYW1lKG9wdGlvbnMuZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIH1cblxuICAgICAgbGV0IGFyZ3MgPSBbJy1mPWpzb24nLCAnYXV0b2NvbXBsZXRlJywgYnVmZmVyLmdldFBhdGgoKSwgb2Zmc2V0XVxuICAgICAgY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvY29kZScsIGxvY2F0b3JPcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3dkID0gcGF0aC5kaXJuYW1lKGJ1ZmZlci5nZXRQYXRoKCkpXG4gICAgICAgIGxldCBlbnYgPSBjb25maWcuZW52aXJvbm1lbnQobG9jYXRvck9wdGlvbnMpXG4gICAgICAgIGNvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywge2N3ZDogY3dkLCBlbnY6IGVudiwgaW5wdXQ6IHRleHR9KS50aGVuKChyKSA9PiB7XG4gICAgICAgICAgaWYgKHIuc3RkZXJyICYmIHIuc3RkZXJyLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRvY29tcGxldGUtZ286IChzdGRlcnIpICcgKyByLnN0ZGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IG1lc3NhZ2VzID0gW11cbiAgICAgICAgICBpZiAoci5zdGRvdXQgJiYgci5zdGRvdXQudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgICAgbWVzc2FnZXMgPSB0aGlzLm1hcE1lc3NhZ2VzKHIuc3Rkb3V0LCBvcHRpb25zLmVkaXRvciwgb3B0aW9ucy5idWZmZXJQb3NpdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFtZXNzYWdlcyB8fCBtZXNzYWdlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUobWVzc2FnZXMpXG4gICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnN1YnNjcmliZXJzICYmIHRoaXMuc3Vic2NyaWJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgc3Vic2NyaWJlciBvZiB0aGlzLnN1YnNjcmliZXJzKSB7XG4gICAgICAgIHN1YnNjcmliZXIocClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBcbiAgfVxuXG4gIG9uRGlkR2V0U3VnZ2VzdGlvbnMgKHMpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpYmVycykge1xuICAgICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHMpXG4gICAgfVxuICB9XG5cbiAgbWFwTWVzc2FnZXMgKGRhdGEsIGVkaXRvciwgcG9zaXRpb24pIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBsZXQgcmVzXG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IEpTT04ucGFyc2UoZGF0YSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSAmJiBlLmhhbmRsZSkge1xuICAgICAgICBlLmhhbmRsZSgpXG4gICAgICB9XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2dvY29kZSBlcnJvcicsIHtcbiAgICAgICAgZGV0YWlsOiBkYXRhLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBsZXQgbnVtUHJlZml4ID0gcmVzWzBdXG4gICAgbGV0IGNhbmRpZGF0ZXMgPSByZXNbMV1cbiAgICBpZiAoIWNhbmRpZGF0ZXMpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBsZXQgcHJlZml4ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtbcG9zaXRpb24ucm93LCBwb3NpdGlvbi5jb2x1bW4gLSBudW1QcmVmaXhdLCBwb3NpdGlvbl0pXG4gICAgbGV0IHN1ZmZpeCA9IGZhbHNlXG4gICAgdHJ5IHtcbiAgICAgIHN1ZmZpeCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbcG9zaXRpb24sIFtwb3NpdGlvbi5yb3csIHBvc2l0aW9uLmNvbHVtbiArIDFdXSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgICBsZXQgc3VnZ2VzdGlvbnMgPSBbXVxuICAgIGZvciAobGV0IGMgb2YgY2FuZGlkYXRlcykge1xuICAgICAgbGV0IHN1Z2dlc3Rpb24gPSB7XG4gICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXgsXG4gICAgICAgIGxlZnRMYWJlbDogYy50eXBlIHx8IGMuY2xhc3MsXG4gICAgICAgIHR5cGU6IHRoaXMudHJhbnNsYXRlVHlwZShjLmNsYXNzKVxuICAgICAgfVxuICAgICAgaWYgKGMuY2xhc3MgPT09ICdmdW5jJyAmJiAoIXN1ZmZpeCB8fCBzdWZmaXggIT09ICcoJykpIHtcbiAgICAgICAgc3VnZ2VzdGlvbiA9IHRoaXMudXBncmFkZVN1Z2dlc3Rpb24oc3VnZ2VzdGlvbiwgYylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Z2dlc3Rpb24udGV4dCA9IGMubmFtZVxuICAgICAgfVxuICAgICAgaWYgKHN1Z2dlc3Rpb24udHlwZSA9PT0gJ3BhY2thZ2UnKSB7XG4gICAgICAgIHN1Z2dlc3Rpb24uaWNvbkhUTUwgPSAnPGkgY2xhc3M9XCJpY29uLXBhY2thZ2VcIj48L2k+J1xuICAgICAgfVxuICAgICAgc3VnZ2VzdGlvbnMucHVzaChzdWdnZXN0aW9uKVxuICAgIH1cbiAgICByZXR1cm4gc3VnZ2VzdGlvbnNcbiAgfVxuXG4gIHRyYW5zbGF0ZVR5cGUgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gJ2Z1bmMnKSB7XG4gICAgICByZXR1cm4gJ2Z1bmN0aW9uJ1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ3ZhcicpIHtcbiAgICAgIHJldHVybiAndmFyaWFibGUnXG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnY29uc3QnKSB7XG4gICAgICByZXR1cm4gJ2NvbnN0YW50J1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ1BBTklDJykge1xuICAgICAgcmV0dXJuICdwYW5pYydcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVcbiAgfVxuXG4gIHVwZ3JhZGVTdWdnZXN0aW9uIChzdWdnZXN0aW9uLCBjKSB7XG4gICAgaWYgKCFjIHx8ICFjLnR5cGUgfHwgYy50eXBlID09PSAnJykge1xuICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25cbiAgICB9XG4gICAgbGV0IG1hdGNoID0gdGhpcy5mdW5jUmVnZXguZXhlYyhjLnR5cGUpXG4gICAgaWYgKCFtYXRjaCB8fCAhbWF0Y2hbMF0pIHsgLy8gTm90IGEgZnVuY3Rpb25cbiAgICAgIHN1Z2dlc3Rpb24uc25pcHBldCA9IGMubmFtZSArICcoKSdcbiAgICAgIHN1Z2dlc3Rpb24ubGVmdExhYmVsID0gJydcbiAgICAgIHJldHVybiBzdWdnZXN0aW9uXG4gICAgfVxuICAgIHN1Z2dlc3Rpb24ubGVmdExhYmVsID0gbWF0Y2hbMl0gfHwgbWF0Y2hbM10gfHwgJydcblxuICAgIGxldCByZXMgPSB0aGlzLmdlbmVyYXRlU25pcHBldChjLm5hbWUsIG1hdGNoKVxuICAgIHN1Z2dlc3Rpb24uc25pcHBldCA9IHJlcy5zbmlwcGV0XG4gICAgc3VnZ2VzdGlvbi5kaXNwbGF5VGV4dCA9IHJlcy5kaXNwbGF5VGV4dFxuICAgIHJldHVybiBzdWdnZXN0aW9uXG4gIH1cblxuICBnZW5lcmF0ZVNuaXBwZXQgKG5hbWUsIG1hdGNoKSB7XG4gICAgbGV0IHNpZ25hdHVyZSA9IHtcbiAgICAgIHNuaXBwZXQ6IG5hbWUsXG4gICAgICBkaXNwbGF5VGV4dDogbmFtZVxuICAgIH1cblxuICAgIGlmICghbWF0Y2ggfHwgIW1hdGNoWzFdIHx8IG1hdGNoWzFdID09PSAnJykge1xuICAgICAgLy8gSGFzIG5vIGFyZ3VtZW50c1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc25pcHBldDogbmFtZSArICcoKSQwJyxcbiAgICAgICAgZGlzcGxheVRleHQ6IG5hbWUgKyAnKCknXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGFyZ3MgPSBtYXRjaFsxXS5zcGxpdCgvLCAvKVxuICAgIGFyZ3MgPSBfLm1hcChhcmdzLCAoYSkgPT4ge1xuICAgICAgaWYgKCFhIHx8IGEubGVuZ3RoIDw9IDIpIHtcbiAgICAgICAgcmV0dXJuIHtkaXNwbGF5OiBhLCBzbmlwcGV0OiBhfVxuICAgICAgfVxuICAgICAgaWYgKGEuc3Vic3RyaW5nKGEubGVuZ3RoIC0gMiwgYS5sZW5ndGgpID09PSAne30nKSB7XG4gICAgICAgIHJldHVybiB7ZGlzcGxheTogYSwgc25pcHBldDogYS5zdWJzdHJpbmcoMCwgYS5sZW5ndGggLSAxKSArICdcXFxcfSd9XG4gICAgICB9XG4gICAgICByZXR1cm4ge2Rpc3BsYXk6IGEsIHNuaXBwZXQ6IGF9XG4gICAgfSlcblxuICAgIGxldCBpID0gMVxuICAgIGZvciAobGV0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBpZiAodGhpcy5zbmlwcGV0TW9kZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGxldCBwYXJ0cyA9IGFyZy5zbmlwcGV0LnNwbGl0KCcgJylcbiAgICAgICAgYXJnLnNuaXBwZXQgPSBwYXJ0c1swXVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgc2lnbmF0dXJlLnNuaXBwZXQgPSBuYW1lICsgJygkeycgKyBpICsgJzonICsgYXJnLnNuaXBwZXQgKyAnfSdcbiAgICAgICAgc2lnbmF0dXJlLmRpc3BsYXlUZXh0ID0gbmFtZSArICcoJyArIGFyZy5kaXNwbGF5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaWduYXR1cmUuc25pcHBldCA9IHNpZ25hdHVyZS5zbmlwcGV0ICsgJywgJHsnICsgaSArICc6JyArIGFyZy5zbmlwcGV0ICsgJ30nXG4gICAgICAgIHNpZ25hdHVyZS5kaXNwbGF5VGV4dCA9IHNpZ25hdHVyZS5kaXNwbGF5VGV4dCArICcsICcgKyBhcmcuZGlzcGxheVxuICAgICAgfVxuICAgICAgaSA9IGkgKyAxXG4gICAgfVxuXG4gICAgc2lnbmF0dXJlLnNuaXBwZXQgPSBzaWduYXR1cmUuc25pcHBldCArICcpJDAnXG4gICAgc2lnbmF0dXJlLmRpc3BsYXlUZXh0ID0gc2lnbmF0dXJlLmRpc3BsYXlUZXh0ICsgJyknXG5cbiAgICBpZiAodGhpcy5zbmlwcGV0TW9kZSA9PT0gJ25vbmUnKSB7XG4gICAgICAvLyB1c2VyIGRvZXNuJ3QgY2FyZSBhYm91dCBhcmcgbmFtZXMvdHlwZXNcbiAgICAgIHNpZ25hdHVyZS5zbmlwcGV0ID0gbmFtZSArICcoJDApJ1xuICAgIH1cblxuICAgIHJldHVybiBzaWduYXR1cmVcbiAgfVxufVxuZXhwb3J0IHtHb2NvZGVQcm92aWRlcn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/autocomplete-go/lib/gocodeprovider.js
