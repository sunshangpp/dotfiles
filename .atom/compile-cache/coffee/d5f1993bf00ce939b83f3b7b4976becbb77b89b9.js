(function() {
  var Linter, LinterPuppetLint, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterPuppetLint = (function(_super) {
    __extends(LinterPuppetLint, _super);

    LinterPuppetLint.syntax = ['source.puppet'];

    LinterPuppetLint.prototype.cmd = 'puppet-lint --no-autoloader_layout-check';

    LinterPuppetLint.prototype.executablePath = null;

    LinterPuppetLint.prototype.linterName = 'puppet-lint';

    LinterPuppetLint.prototype.regex = '((?<warning>WARNING)|(?<error>ERROR)): (?<message>.+) on line (?<line>\\d+)';

    function LinterPuppetLint(editor) {
      LinterPuppetLint.__super__.constructor.call(this, editor);
      atom.config.observe('linter-puppet-lint.puppetLintExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-puppet-lint.puppetLintExecutablePath');
        };
      })(this));
    }

    LinterPuppetLint.prototype.destroy = function() {
      return atom.config.unobserve('linter-puppet-lint.puppetLintExecutablePath');
    };

    return LinterPuppetLint;

  })(Linter);

  module.exports = LinterPuppetLint;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRSxVQUFGLEdBQWMsYUFBdEIsQ0FEVCxDQUFBOztBQUFBLEVBR007QUFHSix1Q0FBQSxDQUFBOztBQUFBLElBQUEsZ0JBQUMsQ0FBQSxNQUFELEdBQVMsQ0FBQyxlQUFELENBQVQsQ0FBQTs7QUFBQSwrQkFJQSxHQUFBLEdBQUssMENBSkwsQ0FBQTs7QUFBQSwrQkFNQSxjQUFBLEdBQWdCLElBTmhCLENBQUE7O0FBQUEsK0JBUUEsVUFBQSxHQUFZLGFBUlosQ0FBQTs7QUFBQSwrQkFXQSxLQUFBLEdBQU8sNkVBWFAsQ0FBQTs7QUFhYSxJQUFBLDBCQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsa0RBQU0sTUFBTixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw2Q0FBcEIsRUFBbUUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakUsS0FBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZDQUFoQixFQUQrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5FLENBRkEsQ0FEVztJQUFBLENBYmI7O0FBQUEsK0JBbUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsNkNBQXRCLEVBRE87SUFBQSxDQW5CVCxDQUFBOzs0QkFBQTs7S0FINkIsT0FIL0IsQ0FBQTs7QUFBQSxFQTRCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixnQkE1QmpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ssun/.atom/packages/linter-puppet-lint/lib/linter-puppet-lint.coffee