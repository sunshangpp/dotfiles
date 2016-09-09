//////////////////
// Requires
//////////////////

var path = require('path');
var util = require('util');

var Node = require('./Node');

//////////////////
// Ctor
//////////////////

function File(_path, relative) {
    Node.apply(this, [_path, relative]);
}
util.inherits(File, Node);

//////////////////
// Methods
//////////////////

/**
 * Filename getter
 * @return {String}
 */
File.prototype.getFilename = function () {
    return path.basename(this.path);
};

/**
 * Directory getter
 * @return {String}
 */
File.prototype.getDirectory = function () {
    return path.dirname(this.path);
};

module.exports = File;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZmlsZXN5c3RlbS9GaWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7OztBQU03QixTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzNCLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Q0FDdkM7QUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVUxQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxZQUFZO0FBQ3JDLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDbkMsQ0FBQzs7Ozs7O0FBTUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsWUFBWTtBQUN0QyxXQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ2xDLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9maWxlc3lzdGVtL0ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFJlcXVpcmVzXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxudmFyIE5vZGUgPSByZXF1aXJlKCcuL05vZGUnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDdG9yXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gRmlsZShfcGF0aCwgcmVsYXRpdmUpIHtcbiAgICBOb2RlLmFwcGx5KHRoaXMsIFtfcGF0aCwgcmVsYXRpdmVdKTtcbn1cbnV0aWwuaW5oZXJpdHMoRmlsZSwgTm9kZSk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gTWV0aG9kc1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qKlxuICogRmlsZW5hbWUgZ2V0dGVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbkZpbGUucHJvdG90eXBlLmdldEZpbGVuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKHRoaXMucGF0aCk7XG59O1xuXG4vKipcbiAqIERpcmVjdG9yeSBnZXR0ZXJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuRmlsZS5wcm90b3R5cGUuZ2V0RGlyZWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUodGhpcy5wYXRoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsZTtcbiJdfQ==