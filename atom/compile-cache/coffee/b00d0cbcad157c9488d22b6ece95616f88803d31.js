(function() {
  var Linter, LinterPhp, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterPhp = (function(_super) {
    __extends(LinterPhp, _super);

    LinterPhp.syntax = ['text.html.php', 'source.php'];

    LinterPhp.prototype.cmd = 'php -l -n -d display_errors=On -d log_errors=Off';

    LinterPhp.prototype.executablePath = null;

    LinterPhp.prototype.linterName = 'php';

    LinterPhp.prototype.regex = '(Parse|Fatal) (?<error>error):(\\s*(?<type>parse|syntax) error,?)?\\s*' + '(?<message>(unexpected \'(?<near>[^\']+)\')?.*) ' + 'in .*? on line (?<line>\\d+)';

    function LinterPhp(editor) {
      LinterPhp.__super__.constructor.call(this, editor);
      atom.config.observe('linter-php.phpExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-php.phpExecutablePath');
        };
      })(this));
    }

    LinterPhp.prototype.destroy = function() {
      return atom.config.unobserve('linter-php.phpExecutablePath');
    };

    LinterPhp.prototype.createMessage = function(match) {
      var message;
      if (match && match.type === 'parse' && !match.message) {
        message = 'parse error';
      }
      return LinterPhp.__super__.createMessage.call(this, match);
    };

    return LinterPhp;

  })(Linter);

  module.exports = LinterPhp;

}).call(this);
