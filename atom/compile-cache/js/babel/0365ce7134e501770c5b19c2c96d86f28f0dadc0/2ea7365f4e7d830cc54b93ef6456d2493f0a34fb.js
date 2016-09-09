//////////////////
// Ctor
//////////////////

function Exception(message) {
    this.code = null;
    this.message = message;
}

Exception.prototype = Object.create(Error.prototype);

//////////////////
// Methods
//////////////////

/**
 * Path getter
 * @return {String}
 */
Exception.prototype.getMessage = function () {
    return this.message;
};

/**
 * Relative path getter
 * @return {String}
 */
Exception.prototype.getCode = function () {
    return this.code;
};

module.exports = Exception;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZXhjZXB0aW9ucy9FeGNlcHRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUMxQjs7QUFFRCxTQUFTLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBVXJELFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFlBQVk7QUFDekMsV0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0NBQ3ZCLENBQUM7Ozs7OztBQU1GLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFlBQVk7QUFDdEMsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0NBQ3BCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9leGNlcHRpb25zL0V4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ3RvclxuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy5jb2RlID0gbnVsbDtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIE1ldGhvZHNcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIFBhdGggZ2V0dGVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbkV4Y2VwdGlvbi5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlO1xufTtcblxuLyoqXG4gKiBSZWxhdGl2ZSBwYXRoIGdldHRlclxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5FeGNlcHRpb24ucHJvdG90eXBlLmdldENvZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXhjZXB0aW9uO1xuIl19