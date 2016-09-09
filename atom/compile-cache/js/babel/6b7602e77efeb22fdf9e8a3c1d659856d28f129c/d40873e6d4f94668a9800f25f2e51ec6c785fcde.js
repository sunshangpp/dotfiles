//////////////////
// Requires
//////////////////

var path = require('path');
var util = require('util');

var Node = require('./Node');

//////////////////
// Ctor
//////////////////

function Directory(_path, relative) {
    Node.apply(this, [_path, relative]);
}
util.inherits(Directory, Node);

module.exports = Directory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZmlsZXN5c3RlbS9EaXJlY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozs7O0FBTTdCLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDaEMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztDQUN2QztBQUNELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUUvQixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9zZnRwLWRlcGxveW1lbnQvbGliL2ZpbGVzeXN0ZW0vRGlyZWN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBSZXF1aXJlc1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbnZhciBOb2RlID0gcmVxdWlyZSgnLi9Ob2RlJyk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ3RvclxuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIERpcmVjdG9yeShfcGF0aCwgcmVsYXRpdmUpIHtcbiAgICBOb2RlLmFwcGx5KHRoaXMsIFtfcGF0aCwgcmVsYXRpdmVdKTtcbn1cbnV0aWwuaW5oZXJpdHMoRGlyZWN0b3J5LCBOb2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rvcnk7XG4iXX0=