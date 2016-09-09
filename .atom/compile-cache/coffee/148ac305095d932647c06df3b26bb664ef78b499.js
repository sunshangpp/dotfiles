(function() {
  var Linter, LinterScalac, child, exec, fs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('child_process'), exec = _ref.exec, child = _ref.child;

  fs = require('fs');

  Linter = require(atom.packages.getLoadedPackage('linter').path + '/lib/linter');

  LinterScalac = (function(_super) {
    __extends(LinterScalac, _super);

    LinterScalac.syntax = ['source.scala'];

    LinterScalac.prototype.cmd = 'scalac';

    LinterScalac.prototype.executablePath = '';

    LinterScalac.prototype.linterName = 'scalac';

    LinterScalac.prototype.options = '';

    LinterScalac.prototype.regex = 'scala:(?<line>\\d+): ((?<error>error)|(?<warning>warning)): (?<message>(.+)\\n(.+))\\n';

    function LinterScalac(editor) {
      LinterScalac.__super__.constructor.call(this, editor);
      atom.config.observe('linter-scalac.scalacExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-scalac.scalacExecutablePath');
        };
      })(this));
      atom.config.observe('linter-scalac.scalacOptions', (function(_this) {
        return function() {
          var classpath, dotClasspath;
          dotClasspath = atom.project.path + '/.classpath';
          if (atom.config.get('linter-scalac.scalacOptions') != null) {
            _this.options = atom.config.get('linter-scalac.scalacOptions');
          }
          if (fs.existsSync(dotClasspath)) {
            classpath = fs.readFileSync(dotClasspath).toString().trim();
            _this.cwd = classpath.split(':')[0];
            return _this.options = _this.options + ' -classpath "' + classpath + '"';
          }
        };
      })(this));
    }

    LinterScalac.prototype.destroy = function() {
      atom.config.unobserve('linter-scalac.scalacExecutablePath');
      return atom.config.unobserve('linter-scalac.scalacOptions');
    };

    LinterScalac.prototype.lintFile = function(filePath, callback) {
      var command;
      command = this.executablePath + '/' + this.cmd + ' ' + filePath + ' ' + this.options;
      return exec(command, {
        cwd: this.cwd
      }, (function(_this) {
        return function(error, stdout, stderr) {
          if (stderr) {
            return _this.processMessage(stderr, callback);
          }
        };
      })(this));
    };

    return LinterScalac;

  })(Linter);

  module.exports = LinterScalac;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixFQUFDLFlBQUEsSUFBRCxFQUFPLGFBQUEsS0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXpDLEdBQWdELGFBQXhELENBRlQsQ0FBQTs7QUFBQSxFQUlNO0FBQ0wsbUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxNQUFELEdBQVMsQ0FBQyxjQUFELENBQVQsQ0FBQTs7QUFBQSwyQkFFQSxHQUFBLEdBQUssUUFGTCxDQUFBOztBQUFBLDJCQUlBLGNBQUEsR0FBZ0IsRUFKaEIsQ0FBQTs7QUFBQSwyQkFNQSxVQUFBLEdBQVksUUFOWixDQUFBOztBQUFBLDJCQVFBLE9BQUEsR0FBUyxFQVJULENBQUE7O0FBQUEsMkJBVUEsS0FBQSxHQUFPLHdGQVZQLENBQUE7O0FBWWEsSUFBQSxzQkFBQyxNQUFELEdBQUE7QUFDWixNQUFBLDhDQUFNLE1BQU4sQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isb0NBQXBCLEVBQTBELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3pELEtBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsRUFEdUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRCxDQUZBLENBQUE7QUFBQSxNQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw2QkFBcEIsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNsRCxjQUFBLHVCQUFBO0FBQUEsVUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLEdBQW9CLGFBQW5DLENBQUE7QUFFQSxVQUFBLElBQUcsc0RBQUg7QUFDQyxZQUFBLEtBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFYLENBREQ7V0FGQTtBQUtBLFVBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFlBQWQsQ0FBSDtBQUNDLFlBQUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxZQUFILENBQWdCLFlBQWhCLENBQTZCLENBQUMsUUFBOUIsQ0FBQSxDQUF3QyxDQUFDLElBQXpDLENBQUEsQ0FBWixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsR0FBRCxHQUFPLFNBQVMsQ0FBQyxLQUFWLENBQWdCLEdBQWhCLENBQXFCLENBQUEsQ0FBQSxDQUQ1QixDQUFBO21CQUVBLEtBQUMsQ0FBQSxPQUFELEdBQVcsS0FBQyxDQUFBLE9BQUQsR0FBVyxlQUFYLEdBQTZCLFNBQTdCLEdBQXlDLElBSHJEO1dBTmtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQsQ0FOQSxDQURZO0lBQUEsQ0FaYjs7QUFBQSwyQkErQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLG9DQUF0QixDQUFBLENBQUE7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsNkJBQXRCLEVBRlE7SUFBQSxDQS9CVCxDQUFBOztBQUFBLDJCQW1DQSxRQUFBLEdBQVUsU0FBQyxRQUFELEVBQVcsUUFBWCxHQUFBO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGNBQUQsR0FBa0IsR0FBbEIsR0FBd0IsSUFBQyxDQUFBLEdBQXpCLEdBQStCLEdBQS9CLEdBQXFDLFFBQXJDLEdBQWdELEdBQWhELEdBQXNELElBQUMsQ0FBQSxPQUFqRSxDQUFBO2FBRUEsSUFBQSxDQUFLLE9BQUwsRUFBYztBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFOO09BQWQsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsTUFBaEIsR0FBQTtBQUEyQixVQUFBLElBQUcsTUFBSDttQkFBZSxLQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFmO1dBQTNCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsRUFIUztJQUFBLENBbkNWLENBQUE7O3dCQUFBOztLQUQwQixPQUozQixDQUFBOztBQUFBLEVBNkNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBN0NqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ssun/.atom/packages/linter-scalac/lib/linter-scalac.coffee