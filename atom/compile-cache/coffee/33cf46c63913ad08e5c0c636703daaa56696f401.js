(function() {
  var Linter, LinterPuppet, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterPuppet = (function(_super) {
    __extends(LinterPuppet, _super);

    LinterPuppet.syntax = ['source.puppet'];

    LinterPuppet.prototype.cmd = 'puppet parser validate';

    LinterPuppet.prototype.executablePath = null;

    LinterPuppet.prototype.linterName = 'puppet';

    LinterPuppet.prototype.errorStream = 'stderr';

    LinterPuppet.prototype.regex = '.*: (?<message>(Syntax|Unclosed|Could) (.|\\n)*) at (.|\\n)*:(?<line>\\d+)';

    function LinterPuppet(editor) {
      LinterPuppet.__super__.constructor.call(this, editor);
      atom.config.observe('linter-puppet.puppetExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-puppet.puppetExecutablePath');
        };
      })(this));
    }

    LinterPuppet.prototype.destroy = function() {
      return atom.config.unobserve('linter-puppet.puppetExecutablePath');
    };

    LinterPuppet.prototype.createMessage = function(match) {
      var message;
      if (match && match.type === 'parse' && !match.message) {
        message = 'parse error';
      }
      return LinterPuppet.__super__.createMessage.call(this, match);
    };

    return LinterPuppet;

  })(Linter);

  module.exports = LinterPuppet;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRSxVQUFGLEdBQWMsYUFBdEIsQ0FEVCxDQUFBOztBQUFBLEVBR007QUFHSixtQ0FBQSxDQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE1BQUQsR0FBUyxDQUFDLGVBQUQsQ0FBVCxDQUFBOztBQUFBLDJCQUlBLEdBQUEsR0FBSyx3QkFKTCxDQUFBOztBQUFBLDJCQU1BLGNBQUEsR0FBZ0IsSUFOaEIsQ0FBQTs7QUFBQSwyQkFRQSxVQUFBLEdBQVksUUFSWixDQUFBOztBQUFBLDJCQVVBLFdBQUEsR0FBYSxRQVZiLENBQUE7O0FBQUEsMkJBY0EsS0FBQSxHQUFPLDRFQWRQLENBQUE7O0FBZ0JhLElBQUEsc0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSw4Q0FBTSxNQUFOLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG9DQUFwQixFQUEwRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN4RCxLQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLEVBRHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsQ0FGQSxDQURXO0lBQUEsQ0FoQmI7O0FBQUEsMkJBc0JBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0Isb0NBQXRCLEVBRE87SUFBQSxDQXRCVCxDQUFBOztBQUFBLDJCQXlCQSxhQUFBLEdBQWUsU0FBQyxLQUFELEdBQUE7QUFFYixVQUFBLE9BQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxJQUFVLEtBQUssQ0FBQyxJQUFOLEtBQWMsT0FBeEIsSUFBb0MsQ0FBQSxLQUFTLENBQUMsT0FBakQ7QUFDRSxRQUFBLE9BQUEsR0FBVSxhQUFWLENBREY7T0FBQTthQUVBLGdEQUFNLEtBQU4sRUFKYTtJQUFBLENBekJmLENBQUE7O3dCQUFBOztLQUh5QixPQUgzQixDQUFBOztBQUFBLEVBcUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBckNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ssun/.atom/packages/linter-puppet/lib/linter-puppet.coffee