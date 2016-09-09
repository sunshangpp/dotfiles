Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _getDialog = require('./get-dialog');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Manager = (function () {
  function Manager(goconfigFunc) {
    var _this = this;

    _classCallCheck(this, Manager);

    this.goconfig = goconfigFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add(atom.views.getView(atom.workspace), 'go-get:get-package', function () {
      _this.getPackage();
    }));
  }

  _createClass(Manager, [{
    key: 'getLocatorOptions',
    value: function getLocatorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      var options = {};
      if (editor) {
        options.file = editor.getPath();
        options.directory = _path2['default'].dirname(editor.getPath());
      }
      if (!options.directory && atom.project.paths.length) {
        options.directory = atom.project.paths[0];
      }

      return options;
    }
  }, {
    key: 'getExecutorOptions',
    value: function getExecutorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      var o = this.getLocatorOptions(editor);
      var options = {};
      if (o.directory) {
        options.cwd = o.directory;
      }
      var config = this.goconfig();
      if (config) {
        options.env = config.environment(o);
      }
      if (!options.env) {
        options.env = process.env;
      }
      return options;
    }
  }, {
    key: 'getSelectedText',
    value: function getSelectedText() {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return '';
      }
      var selections = editor.getSelections();
      if (!selections || selections.length < 1) {
        return '';
      }

      return selections[0].getText();
    }

    // Shows a dialog which can be used to perform `go get -u {pack}`. Optionally
    // populates the dialog with the selected text from the active editor.
  }, {
    key: 'getPackage',
    value: function getPackage() {
      var _this2 = this;

      var selectedText = this.getSelectedText();
      var dialog = new _getDialog.GetDialog(selectedText, function (pack) {
        _this2.performGet(pack);
      });
      dialog.attach();
    }

    // Runs `go get -u {pack}`.
    // * `options` (optional) {Object} to pass to the go-config executor.
  }, {
    key: 'performGet',
    value: function performGet(pack) {
      var _this3 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!pack || pack.trim() === '') {
        return Promise.resolve(false);
      }
      var config = this.goconfig();
      return config.locator.findTool('go', this.getLocatorOptions()).then(function (cmd) {
        if (!cmd) {
          atom.notifications.addError('Missing Go Tool', {
            detail: 'The go tool is required to perform a get. Please ensure you have a go runtime installed: http://golang.org.',
            dismissable: true
          });
          return { success: false };
        }
        var args = ['get', '-u', pack];
        return config.executor.exec(cmd, args, _this3.getExecutorOptions()).then(function (r) {
          if (r.error) {
            if (r.error.code === 'ENOENT') {
              atom.notifications.addError('Missing Go Tool', {
                detail: 'The go tool is required to perform a get. Please ensure you have a go runtime installed: http://golang.org.',
                dismissable: true
              });
            } else {
              console.log(r.error);
              atom.notifications.addError('Error Getting Package', {
                detail: r.error.message,
                dismissable: true
              });
            }
            return { success: false, result: r };
          }

          if (r.exitcode !== 0 || r.stderr && r.stderr.trim() !== '') {
            var message = r.stderr.trim() + '\r\n' + r.stdout.trim();
            atom.notifications.addWarning('Error Getting Package', {
              detail: message.trim(),
              dismissable: true
            });
            return { success: false, result: r };
          }

          atom.notifications.addSuccess(cmd + ' ' + args.join(' '));
          return { success: true, result: r };
        });
      });
    }

    // Creates a notification that can be used to run `go get -u {options.packagePath}`.
    // * `options` (required) {Object}
    //   * `name` (required) {String} e.g. go-plus
    //   * `packageName` (required) {String} e.g. goimports
    //   * `packagePath` (required) {String} e.g. golang.org/x/tools/cmd/goimports
    //   * `type` (required) {String} one of 'missing' or 'outdated' (used to customize the prompt)
  }, {
    key: 'get',
    value: function get(options) {
      var _this4 = this;

      if (!options || !options.name || !options.packageName || !options.packagePath || !options.type) {
        return Promise.resolve(false);
      }
      if (['missing', 'outdated'].indexOf(options.type) === -1) {
        return Promise.resolve(false);
      }

      var detail = 'The ' + options.name + ' package uses the ' + options.packageName + ' tool, but it cannot be found.';
      if (options.type === 'outdated') {
        detail = 'An update is available for the ' + options.packageName + ' tool. This is used by the ' + options.name + ' package.';
      }
      return new Promise(function (resolve) {
        var wasClicked = false;
        var notification = atom.notifications.addInfo('Go Get', {
          dismissable: true,
          icon: 'cloud-download',
          detail: detail,
          description: 'Would you like to run `go get -u` [`' + options.packagePath + '`](http://' + options.packagePath + ')?',
          buttons: [{
            text: 'Run Go Get',
            onDidClick: function onDidClick() {
              wasClicked = true;
              notification.dismiss();
              resolve(_this4.performGet(options.packagePath));
            }
          }]
        });
        notification.onDidDismiss(function () {
          if (!wasClicked) {
            resolve(false);
          }
        });
      });
    }

    // Check returns true if a package is up to date, and false if a package is missing or outdated.
  }, {
    key: 'check',
    value: function check(options) {
      return Promise.resolve(true);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      this.goconfig = null;
    }
  }]);

  return Manager;
})();

exports.Manager = Manager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWdldC9saWIvbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrQyxNQUFNOzt5QkFDaEIsY0FBYzs7b0JBQ3JCLE1BQU07Ozs7QUFKdkIsV0FBVyxDQUFBOztJQU1MLE9BQU87QUFDQyxXQURSLE9BQU8sQ0FDRSxZQUFZLEVBQUU7OzswQkFEdkIsT0FBTzs7QUFFVCxRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxvQkFBb0IsRUFBRSxZQUFNO0FBQ3ZHLFlBQUssVUFBVSxFQUFFLENBQUE7S0FDbEIsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFQRyxPQUFPOztXQVNPLDZCQUFnRDtVQUEvQyxNQUFNLHlEQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUU7O0FBQzlELFVBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUNoQixVQUFJLE1BQU0sRUFBRTtBQUNWLGVBQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQy9CLGVBQU8sQ0FBQyxTQUFTLEdBQUcsa0JBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO09BQ25EO0FBQ0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ25ELGVBQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDMUM7O0FBRUQsYUFB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TyxFQUFFLENBQUM7QUFDUixnQkFBSSxFQUFFLFlBQVk7QUFDbEIsc0JBQVUsRUFBRSxzQkFBTTtBQUNoQix3QkFBVSxHQUFHLElBQUksQ0FBQTtBQUNqQiwwQkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RCLHFCQUFPLENBQUMsT0FBSyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7YUFDOUM7V0FDRixDQUFDO1NBQ0gsQ0FBQyxDQUFBO0FBQ0Ysb0JBQVksQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM5QixjQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsbUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUNmO1NBQ0YsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7Ozs7O1dBR0ssZUFBQyxPQUFPLEVBQUU7QUFDZCxhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDN0I7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDN0I7QUFDRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtLQUNyQjs7O1NBbEtHLE9BQU87OztRQW9LTCxPQUFPLEdBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1nZXQvbGliL21hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge0dldERpYWxvZ30gZnJvbSAnLi9nZXQtZGlhbG9nJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY2xhc3MgTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yIChnb2NvbmZpZ0Z1bmMpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdGdW5jXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ2dvLWdldDpnZXQtcGFja2FnZScsICgpID0+IHtcbiAgICAgIHRoaXMuZ2V0UGFja2FnZSgpXG4gICAgfSkpXG4gIH1cblxuICBnZXRMb2NhdG9yT3B0aW9ucyAoZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIG9wdGlvbnMuZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIG9wdGlvbnMuZGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5kaXJlY3RvcnkgJiYgYXRvbS5wcm9qZWN0LnBhdGhzLmxlbmd0aCkge1xuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBhdG9tLnByb2plY3QucGF0aHNbMF1cbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZ2V0RXhlY3V0b3JPcHRpb25zIChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpIHtcbiAgICBsZXQgbyA9IHRoaXMuZ2V0TG9jYXRvck9wdGlvbnMoZWRpdG9yKVxuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBpZiAoby5kaXJlY3RvcnkpIHtcbiAgICAgIG9wdGlvbnMuY3dkID0gby5kaXJlY3RvcnlcbiAgICB9XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIG9wdGlvbnMuZW52ID0gY29uZmlnLmVudmlyb25tZW50KG8pXG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5lbnYpIHtcbiAgICAgIG9wdGlvbnMuZW52ID0gcHJvY2Vzcy5lbnZcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIGdldFNlbGVjdGVkVGV4dCAoKSB7XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gICAgbGV0IHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgaWYgKCFzZWxlY3Rpb25zIHx8IHNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGlvbnNbMF0uZ2V0VGV4dCgpXG4gIH1cblxuICAvLyBTaG93cyBhIGRpYWxvZyB3aGljaCBjYW4gYmUgdXNlZCB0byBwZXJmb3JtIGBnbyBnZXQgLXUge3BhY2t9YC4gT3B0aW9uYWxseVxuICAvLyBwb3B1bGF0ZXMgdGhlIGRpYWxvZyB3aXRoIHRoZSBzZWxlY3RlZCB0ZXh0IGZyb20gdGhlIGFjdGl2ZSBlZGl0b3IuXG4gIGdldFBhY2thZ2UgKCkge1xuICAgIGxldCBzZWxlY3RlZFRleHQgPSB0aGlzLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgbGV0IGRpYWxvZyA9IG5ldyBHZXREaWFsb2coc2VsZWN0ZWRUZXh0LCAocGFjaykgPT4ge1xuICAgICAgdGhpcy5wZXJmb3JtR2V0KHBhY2spXG4gICAgfSlcbiAgICBkaWFsb2cuYXR0YWNoKClcbiAgfVxuXG4gIC8vIFJ1bnMgYGdvIGdldCAtdSB7cGFja31gLlxuICAvLyAqIGBvcHRpb25zYCAob3B0aW9uYWwpIHtPYmplY3R9IHRvIHBhc3MgdG8gdGhlIGdvLWNvbmZpZyBleGVjdXRvci5cbiAgcGVyZm9ybUdldCAocGFjaywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFwYWNrIHx8IHBhY2sudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIHJldHVybiBjb25maWcubG9jYXRvci5maW5kVG9vbCgnZ28nLCB0aGlzLmdldExvY2F0b3JPcHRpb25zKCkpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdNaXNzaW5nIEdvIFRvb2wnLCB7XG4gICAgICAgICAgZGV0YWlsOiAnVGhlIGdvIHRvb2wgaXMgcmVxdWlyZWQgdG8gcGVyZm9ybSBhIGdldC4gUGxlYXNlIGVuc3VyZSB5b3UgaGF2ZSBhIGdvIHJ1bnRpbWUgaW5zdGFsbGVkOiBodHRwOi8vZ29sYW5nLm9yZy4nLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2V9XG4gICAgICB9XG4gICAgICBsZXQgYXJncyA9IFsnZ2V0JywgJy11JywgcGFja11cbiAgICAgIHJldHVybiBjb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIHRoaXMuZ2V0RXhlY3V0b3JPcHRpb25zKCkpLnRoZW4oKHIpID0+IHtcbiAgICAgICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgICAgICBpZiAoci5lcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdNaXNzaW5nIEdvIFRvb2wnLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogJ1RoZSBnbyB0b29sIGlzIHJlcXVpcmVkIHRvIHBlcmZvcm0gYSBnZXQuIFBsZWFzZSBlbnN1cmUgeW91IGhhdmUgYSBnbyBydW50aW1lIGluc3RhbGxlZDogaHR0cDovL2dvbGFuZy5vcmcuJyxcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHIuZXJyb3IpXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIEdldHRpbmcgUGFja2FnZScsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiByLmVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge3N1Y2Nlc3M6IGZhbHNlLCByZXN1bHQ6IHJ9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoci5leGl0Y29kZSAhPT0gMCB8fCByLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgbGV0IG1lc3NhZ2UgPSByLnN0ZGVyci50cmltKCkgKyAnXFxyXFxuJyArIHIuc3Rkb3V0LnRyaW0oKVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdFcnJvciBHZXR0aW5nIFBhY2thZ2UnLCB7XG4gICAgICAgICAgICBkZXRhaWw6IG1lc3NhZ2UudHJpbSgpLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIHJlc3VsdDogcn1cbiAgICAgICAgfVxuXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKGNtZCArICcgJyArIGFyZ3Muam9pbignICcpKVxuICAgICAgICByZXR1cm4ge3N1Y2Nlc3M6IHRydWUsIHJlc3VsdDogcn1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBub3RpZmljYXRpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBydW4gYGdvIGdldCAtdSB7b3B0aW9ucy5wYWNrYWdlUGF0aH1gLlxuICAvLyAqIGBvcHRpb25zYCAocmVxdWlyZWQpIHtPYmplY3R9XG4gIC8vICAgKiBgbmFtZWAgKHJlcXVpcmVkKSB7U3RyaW5nfSBlLmcuIGdvLXBsdXNcbiAgLy8gICAqIGBwYWNrYWdlTmFtZWAgKHJlcXVpcmVkKSB7U3RyaW5nfSBlLmcuIGdvaW1wb3J0c1xuICAvLyAgICogYHBhY2thZ2VQYXRoYCAocmVxdWlyZWQpIHtTdHJpbmd9IGUuZy4gZ29sYW5nLm9yZy94L3Rvb2xzL2NtZC9nb2ltcG9ydHNcbiAgLy8gICAqIGB0eXBlYCAocmVxdWlyZWQpIHtTdHJpbmd9IG9uZSBvZiAnbWlzc2luZycgb3IgJ291dGRhdGVkJyAodXNlZCB0byBjdXN0b21pemUgdGhlIHByb21wdClcbiAgZ2V0IChvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLm5hbWUgfHwgIW9wdGlvbnMucGFja2FnZU5hbWUgfHwgIW9wdGlvbnMucGFja2FnZVBhdGggfHwgIW9wdGlvbnMudHlwZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG4gICAgaWYgKFsnbWlzc2luZycsICdvdXRkYXRlZCddLmluZGV4T2Yob3B0aW9ucy50eXBlKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgbGV0IGRldGFpbCA9ICdUaGUgJyArIG9wdGlvbnMubmFtZSArICcgcGFja2FnZSB1c2VzIHRoZSAnICsgb3B0aW9ucy5wYWNrYWdlTmFtZSArICcgdG9vbCwgYnV0IGl0IGNhbm5vdCBiZSBmb3VuZC4nXG4gICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ291dGRhdGVkJykge1xuICAgICAgZGV0YWlsID0gJ0FuIHVwZGF0ZSBpcyBhdmFpbGFibGUgZm9yIHRoZSAnICsgb3B0aW9ucy5wYWNrYWdlTmFtZSArICcgdG9vbC4gVGhpcyBpcyB1c2VkIGJ5IHRoZSAnICsgb3B0aW9ucy5uYW1lICsgJyBwYWNrYWdlLidcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBsZXQgd2FzQ2xpY2tlZCA9IGZhbHNlXG4gICAgICBsZXQgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0dvIEdldCcsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGljb246ICdjbG91ZC1kb3dubG9hZCcsXG4gICAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1dvdWxkIHlvdSBsaWtlIHRvIHJ1biBgZ28gZ2V0IC11YCBbYCcgKyBvcHRpb25zLnBhY2thZ2VQYXRoICsgJ2BdKGh0dHA6Ly8nICsgb3B0aW9ucy5wYWNrYWdlUGF0aCArICcpPycsXG4gICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgdGV4dDogJ1J1biBHbyBHZXQnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIHdhc0NsaWNrZWQgPSB0cnVlXG4gICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucGVyZm9ybUdldChvcHRpb25zLnBhY2thZ2VQYXRoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KVxuICAgICAgbm90aWZpY2F0aW9uLm9uRGlkRGlzbWlzcygoKSA9PiB7XG4gICAgICAgIGlmICghd2FzQ2xpY2tlZCkge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8vIENoZWNrIHJldHVybnMgdHJ1ZSBpZiBhIHBhY2thZ2UgaXMgdXAgdG8gZGF0ZSwgYW5kIGZhbHNlIGlmIGEgcGFja2FnZSBpcyBtaXNzaW5nIG9yIG91dGRhdGVkLlxuICBjaGVjayAob3B0aW9ucykge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gIH1cbn1cbmV4cG9ydCB7TWFuYWdlcn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-get/lib/manager.js
