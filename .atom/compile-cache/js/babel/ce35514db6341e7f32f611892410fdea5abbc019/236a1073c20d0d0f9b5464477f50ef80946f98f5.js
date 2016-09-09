Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _environmentHelpers = require('./environment-helpers');

var _environmentHelpers2 = _interopRequireDefault(_environmentHelpers);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

'use babel';

exports['default'] = {
  activate: function activate() {
    if (_semver2['default'].satisfies(this.version(), '<1.7.0')) {
      _environmentHelpers2['default'].normalize();
    }
  },

  deactivate: function deactivate() {},

  provide: function provide() {
    return Object.assign({}, process.env);
  },

  version: function version() {
    return _semver2['default'].major(atom.appVersion) + '.' + _semver2['default'].minor(atom.appVersion) + '.' + _semver2['default'].patch(atom.appVersion);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2Vudmlyb25tZW50L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQ0FFK0IsdUJBQXVCOzs7O3NCQUNuQyxRQUFROzs7O0FBSDNCLFdBQVcsQ0FBQTs7cUJBS0k7QUFDYixVQUFRLEVBQUMsb0JBQUc7QUFDVixRQUFJLG9CQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDOUMsc0NBQW1CLFNBQVMsRUFBRSxDQUFBO0tBQy9CO0dBQ0Y7O0FBRUQsWUFBVSxFQUFDLHNCQUFHLEVBQ2I7O0FBRUQsU0FBTyxFQUFDLG1CQUFHO0FBQ1QsV0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7R0FDdEM7O0FBRUQsU0FBTyxFQUFDLG1CQUFHO0FBQ1QsV0FBTyxvQkFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxvQkFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxvQkFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQ2pIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZW52aXJvbm1lbnQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZW52aXJvbm1lbnRIZWxwZXJzIGZyb20gJy4vZW52aXJvbm1lbnQtaGVscGVycydcbmltcG9ydCBzZW12ZXIgZnJvbSAnc2VtdmVyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlICgpIHtcbiAgICBpZiAoc2VtdmVyLnNhdGlzZmllcyh0aGlzLnZlcnNpb24oKSwgJzwxLjcuMCcpKSB7XG4gICAgICBlbnZpcm9ubWVudEhlbHBlcnMubm9ybWFsaXplKClcbiAgICB9XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gIH0sXG5cbiAgcHJvdmlkZSAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52KVxuICB9LFxuXG4gIHZlcnNpb24gKCkge1xuICAgIHJldHVybiBzZW12ZXIubWFqb3IoYXRvbS5hcHBWZXJzaW9uKSArICcuJyArIHNlbXZlci5taW5vcihhdG9tLmFwcFZlcnNpb24pICsgJy4nICsgc2VtdmVyLnBhdGNoKGF0b20uYXBwVmVyc2lvbilcbiAgfVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/environment/lib/main.js
