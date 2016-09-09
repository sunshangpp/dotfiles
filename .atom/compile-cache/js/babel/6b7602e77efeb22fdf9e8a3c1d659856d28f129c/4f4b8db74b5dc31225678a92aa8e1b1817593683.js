//////////////////
// Requires
//////////////////

var path = require("path");

//////////////////
// Ctor
//////////////////

function Node(_path, relative) {
    if (atom.project.rootDirectories.length < 1) {
        throw "project_not_found";
    }

    if (relative) {
        this.path = path.join(atom.project.rootDirectories[0].path, _path);
        this.relativePath = _path;
    } else {
        this.path = _path;
        this.relativePath = path.relative(atom.project.rootDirectories[0].path, _path);
    }
}

//////////////////
// Methods
//////////////////

/**
 * Path getter
 * @return {String}
 */
Node.prototype.getPath = function () {
    return this.path;
};

/**
 * Relative path getter
 * @return {String}
 */
Node.prototype.getRelativePath = function () {
    return this.relativePath;
};

module.exports = Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZmlsZXN5c3RlbS9Ob2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7OztBQU0zQixTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzNCLFFBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6QyxjQUFNLG1CQUFtQixDQUFDO0tBQzdCOztBQUVELFFBQUksUUFBUSxFQUFFO0FBQ1YsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQ3BDLEtBQUssQ0FDUixDQUFDO0FBQ0YsWUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDN0IsTUFBTTtBQUNILFlBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUNwQyxLQUFLLENBQ1IsQ0FBQztLQUNMO0NBQ0o7Ozs7Ozs7Ozs7QUFVQSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQ2xDLFdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztDQUNwQixDQUFDOzs7Ozs7QUFNRCxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxZQUFZO0FBQzFDLFdBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztDQUM1QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZmlsZXN5c3RlbS9Ob2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBSZXF1aXJlc1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEN0b3Jcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBOb2RlKF9wYXRoLCByZWxhdGl2ZSkge1xuICAgIGlmIChhdG9tLnByb2plY3Qucm9vdERpcmVjdG9yaWVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgdGhyb3cgXCJwcm9qZWN0X25vdF9mb3VuZFwiO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgICB0aGlzLnBhdGggPSBwYXRoLmpvaW4oXG4gICAgICAgICAgICBhdG9tLnByb2plY3Qucm9vdERpcmVjdG9yaWVzWzBdLnBhdGgsXG4gICAgICAgICAgICBfcGF0aFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlbGF0aXZlUGF0aCA9IF9wYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGF0aCA9IF9wYXRoO1xuICAgICAgICB0aGlzLnJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUoXG4gICAgICAgICAgICBhdG9tLnByb2plY3Qucm9vdERpcmVjdG9yaWVzWzBdLnBhdGgsXG4gICAgICAgICAgICBfcGF0aFxuICAgICAgICApO1xuICAgIH1cbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBNZXRob2RzXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBQYXRoIGdldHRlclxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG4gTm9kZS5wcm90b3R5cGUuZ2V0UGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoO1xufTtcblxuLyoqXG4gKiBSZWxhdGl2ZSBwYXRoIGdldHRlclxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG4gTm9kZS5wcm90b3R5cGUuZ2V0UmVsYXRpdmVQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlbGF0aXZlUGF0aDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZTtcbiJdfQ==