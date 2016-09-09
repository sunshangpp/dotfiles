//////////////////
// Requires
//////////////////

var Config = require('./Config');
var util = require('util');

//////////////////
// Ctor
//////////////////

function FtpConfig() {
  Config.apply(this, Array.prototype.slice.call(arguments));

  /**
   * @type {Number}
   */
  this.port = 21;

  /**
   * @type {String}
   */
  this.type = 'ftp';
}

util.inherits(FtpConfig, Config);

module.exports = FtpConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvY29uZmlncy9GdHBDb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7OztBQU0zQixTQUFTLFNBQVMsR0FBRztBQUNuQixRQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7QUFLMUQsTUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Ozs7O0FBS2YsTUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Q0FDbkI7O0FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvY29uZmlncy9GdHBDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFJlcXVpcmVzXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIENvbmZpZyA9IHJlcXVpcmUoJy4vQ29uZmlnJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDdG9yXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gRnRwQ29uZmlnKCkge1xuICBDb25maWcuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLnBvcnQgPSAyMTtcblxuICAvKipcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHRoaXMudHlwZSA9IFwiZnRwXCI7XG59XG5cbnV0aWwuaW5oZXJpdHMoRnRwQ29uZmlnLCBDb25maWcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ0cENvbmZpZztcbiJdfQ==