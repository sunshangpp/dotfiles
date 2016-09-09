Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

function ranges(coverageFile) {
  var data = undefined;
  var ranges = [];
  try {
    data = _fs2['default'].readFileSync(coverageFile, { encoding: 'utf8' });
  } catch (e) {
    return ranges;
  }

  // https://code.google.com/p/go/source/browse/cmd/cover/profile.go?repo=tools&name=a2a0f87c4b38&r=92b0a64343bc62160c1c10d335d375b0defa4c18#113
  var pattern = /^(.+):(\d+).(\d+),(\d+).(\d+) (\d+) (\d+)$/img;

  var extract = function extract(match) {
    if (!match) {
      return;
    }
    var filePath = match[1];
    // let statements = match[6]
    var count = match[7];
    var range = new _atom.Range([parseInt(match[2], 10) - 1, parseInt(match[3], 10) - 1], [parseInt(match[4], 10) - 1, parseInt(match[5], 10) - 1]);
    ranges.push({ range: range, count: parseInt(count, 10), file: filePath });
  };

  var match = undefined;
  while ((match = pattern.exec(data)) !== null) {
    extract(match);
  }

  return ranges;
}

exports['default'] = { ranges: ranges };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3Rlc3Rlci1nby9saWIvZ29jb3Zlci1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQixNQUFNOztrQkFDWCxJQUFJOzs7O0FBSG5CLFdBQVcsQ0FBQTs7QUFLWCxTQUFTLE1BQU0sQ0FBRSxZQUFZLEVBQUU7QUFDN0IsTUFBSSxJQUFJLFlBQUEsQ0FBQTtBQUNSLE1BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUNmLE1BQUk7QUFDRixRQUFJLEdBQUcsZ0JBQUcsWUFBWSxDQUFDLFlBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO0dBQ3pELENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixXQUFPLE1BQU0sQ0FBQTtHQUNkOzs7QUFHRCxNQUFJLE9BQU8sR0FBRywrQ0FBK0MsQ0FBQTs7QUFFN0QsTUFBSSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksS0FBSyxFQUFLO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLLEVBQUU7QUFDVixhQUFNO0tBQ1A7QUFDRCxRQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXZCLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwQixRQUFJLEtBQUssR0FBRyxnQkFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDekksVUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7R0FDeEUsQ0FBQTs7QUFFRCxNQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsU0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBLEtBQU0sSUFBSSxFQUFFO0FBQzVDLFdBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUNmOztBQUVELFNBQU8sTUFBTSxDQUFBO0NBQ2Q7O3FCQUVjLEVBQUMsTUFBTSxFQUFOLE1BQU0sRUFBQyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy90ZXN0ZXItZ28vbGliL2dvY292ZXItcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBmcyBmcm9tICdmcydcblxuZnVuY3Rpb24gcmFuZ2VzIChjb3ZlcmFnZUZpbGUpIHtcbiAgbGV0IGRhdGFcbiAgbGV0IHJhbmdlcyA9IFtdXG4gIHRyeSB7XG4gICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhjb3ZlcmFnZUZpbGUsIHtlbmNvZGluZzogJ3V0ZjgnfSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiByYW5nZXNcbiAgfVxuXG4gIC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvZ28vc291cmNlL2Jyb3dzZS9jbWQvY292ZXIvcHJvZmlsZS5nbz9yZXBvPXRvb2xzJm5hbWU9YTJhMGY4N2M0YjM4JnI9OTJiMGE2NDM0M2JjNjIxNjBjMWMxMGQzMzVkMzc1YjBkZWZhNGMxOCMxMTNcbiAgbGV0IHBhdHRlcm4gPSAvXiguKyk6KFxcZCspLihcXGQrKSwoXFxkKykuKFxcZCspIChcXGQrKSAoXFxkKykkL2ltZ1xuXG4gIGxldCBleHRyYWN0ID0gKG1hdGNoKSA9PiB7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBmaWxlUGF0aCA9IG1hdGNoWzFdXG4gICAgLy8gbGV0IHN0YXRlbWVudHMgPSBtYXRjaFs2XVxuICAgIGxldCBjb3VudCA9IG1hdGNoWzddXG4gICAgbGV0IHJhbmdlID0gbmV3IFJhbmdlKFtwYXJzZUludChtYXRjaFsyXSwgMTApIC0gMSwgcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAtIDFdLCBbcGFyc2VJbnQobWF0Y2hbNF0sIDEwKSAtIDEsIHBhcnNlSW50KG1hdGNoWzVdLCAxMCkgLSAxXSlcbiAgICByYW5nZXMucHVzaCh7cmFuZ2U6IHJhbmdlLCBjb3VudDogcGFyc2VJbnQoY291bnQsIDEwKSwgZmlsZTogZmlsZVBhdGh9KVxuICB9XG5cbiAgbGV0IG1hdGNoXG4gIHdoaWxlICgobWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoZGF0YSkpICE9PSBudWxsKSB7XG4gICAgZXh0cmFjdChtYXRjaClcbiAgfVxuXG4gIHJldHVybiByYW5nZXNcbn1cblxuZXhwb3J0IGRlZmF1bHQge3Jhbmdlc31cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/tester-go/lib/gocover-parser.js
