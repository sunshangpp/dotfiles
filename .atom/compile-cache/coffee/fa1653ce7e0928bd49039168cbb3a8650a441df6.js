(function() {
  var PathHelper, os;

  os = require('os');

  module.exports = PathHelper = (function() {
    function PathHelper() {}

    PathHelper.prototype.home = function() {
      switch (os.platform()) {
        case 'darwin':
        case 'freebsd':
        case 'linux':
        case 'sunos':
          return process.env.HOME;
        case 'win32':
          return process.env.USERPROFILE;
      }
    };

    return PathHelper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL3V0aWwvcGF0aGhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNOzRCQUVKOztBQUFBLHlCQUFBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixjQUFPLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBUDtBQUFBLGFBQ08sUUFEUDtBQUFBLGFBQ2lCLFNBRGpCO0FBQUEsYUFDNEIsT0FENUI7QUFBQSxhQUNxQyxPQURyQztBQUVJLGlCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBbkIsQ0FGSjtBQUFBLGFBR08sT0FIUDtBQUlJLGlCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FKSjtBQUFBLE9BREk7SUFBQSxDQUFOLENBQUE7O3NCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ssun/.atom/packages/go-plus/spec/util/pathhelper.coffee
