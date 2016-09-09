(function() {
  var GocoverParser, Range, fs, _;

  Range = require('atom').Range;

  _ = require('underscore-plus');

  fs = require('fs-plus');

  module.exports = GocoverParser = (function() {
    function GocoverParser() {}

    GocoverParser.prototype.setDataFile = function(file) {
      return this.dataFile = file;
    };

    GocoverParser.prototype.rangesForFile = function(file) {
      var ranges;
      ranges = this.ranges(this.dataFile);
      return _.filter(ranges, function(r) {
        return _.endsWith(file, r.file);
      });
    };

    GocoverParser.prototype.ranges = function(dataFile) {
      var data, error, extract, match, pattern, ranges;
      try {
        data = fs.readFileSync(dataFile, {
          encoding: 'utf8'
        });
      } catch (_error) {
        error = _error;
        return [];
      }
      ranges = [];
      pattern = /^(.+):(\d+).(\d+),(\d+).(\d+) (\d+) (\d+)$/img;
      extract = function(match) {
        var count, filePath, range, statements;
        if (match == null) {
          return;
        }
        filePath = match[1];
        statements = match[6];
        count = match[7];
        range = new Range([parseInt(match[2]) - 1, parseInt(match[3]) - 1], [parseInt(match[4]) - 1, parseInt(match[5]) - 1]);
        return ranges.push({
          range: range,
          count: parseInt(count),
          file: filePath
        });
      };
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return ranges;
    };

    return GocoverParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ29jb3Zlci9nb2NvdmVyLXBhcnNlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTsrQkFDSjs7QUFBQSw0QkFBQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZLEtBREQ7SUFBQSxDQUFiLENBQUE7O0FBQUEsNEJBR0EsYUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO0FBQ2IsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsUUFBVCxDQUFULENBQUE7YUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLE1BQVQsRUFBaUIsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFDLENBQUMsUUFBRixDQUFXLElBQVgsRUFBaUIsQ0FBQyxDQUFDLElBQW5CLEVBQVA7TUFBQSxDQUFqQixFQUZhO0lBQUEsQ0FIZixDQUFBOztBQUFBLDRCQU9BLE1BQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTtBQUNOLFVBQUEsNENBQUE7QUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLEVBQTBCO0FBQUEsVUFBQyxRQUFBLEVBQVUsTUFBWDtTQUExQixDQUFQLENBREY7T0FBQSxjQUFBO0FBR0UsUUFESSxjQUNKLENBQUE7QUFBQSxlQUFPLEVBQVAsQ0FIRjtPQUFBO0FBQUEsTUFLQSxNQUFBLEdBQVMsRUFMVCxDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsK0NBUlYsQ0FBQTtBQUFBLE1BVUEsT0FBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsWUFBQSxrQ0FBQTtBQUFBLFFBQUEsSUFBYyxhQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQUFBO0FBQUEsUUFDQSxRQUFBLEdBQVcsS0FBTSxDQUFBLENBQUEsQ0FEakIsQ0FBQTtBQUFBLFFBRUEsVUFBQSxHQUFhLEtBQU0sQ0FBQSxDQUFBLENBRm5CLENBQUE7QUFBQSxRQUdBLEtBQUEsR0FBUSxLQUFNLENBQUEsQ0FBQSxDQUhkLENBQUE7QUFBQSxRQUlBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxDQUFDLFFBQUEsQ0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLENBQUEsR0FBcUIsQ0FBdEIsRUFBeUIsUUFBQSxDQUFTLEtBQU0sQ0FBQSxDQUFBLENBQWYsQ0FBQSxHQUFxQixDQUE5QyxDQUFOLEVBQXdELENBQUMsUUFBQSxDQUFTLEtBQU0sQ0FBQSxDQUFBLENBQWYsQ0FBQSxHQUFxQixDQUF0QixFQUF5QixRQUFBLENBQVMsS0FBTSxDQUFBLENBQUEsQ0FBZixDQUFBLEdBQXFCLENBQTlDLENBQXhELENBSlosQ0FBQTtlQUtBLE1BQU0sQ0FBQyxJQUFQLENBQVk7QUFBQSxVQUFDLEtBQUEsRUFBTyxLQUFSO0FBQUEsVUFBZSxLQUFBLEVBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBdEI7QUFBQSxVQUF1QyxJQUFBLEVBQU0sUUFBN0M7U0FBWixFQU5RO01BQUEsQ0FWVixDQUFBO0FBaUJBLGFBQUEsSUFBQSxHQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQVIsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEtBQVIsQ0FEQSxDQUFBO0FBRUEsUUFBQSxJQUFhLGFBQWI7QUFBQSxnQkFBQTtTQUhGO01BQUEsQ0FqQkE7YUFzQkEsT0F2Qk07SUFBQSxDQVBSLENBQUE7O3lCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/gocover/gocover-parser.coffee
