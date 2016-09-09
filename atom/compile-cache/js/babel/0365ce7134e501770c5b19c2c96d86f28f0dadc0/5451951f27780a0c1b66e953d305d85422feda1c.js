var util = require('util');

var Exception = require('./Exception');

//////////////////
// Ctor
//////////////////

function NoConfigurationFileFoundException() {
    Exception.apply(this, ['No configuration file found.']);
}

util.inherits(NoConfigurationFileFoundException, Exception);

module.exports = NoConfigurationFileFoundException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZXhjZXB0aW9ucy9Ob0NvbmZpZ3VyYXRpb25GaWxlRm91bmRFeGNlcHRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7OztBQU12QyxTQUFTLGlDQUFpQyxHQUFHO0FBQ3pDLGFBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDO0NBQzNEOztBQUVELElBQUksQ0FBQyxRQUFRLENBQUMsaUNBQWlDLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUNBQWlDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9leGNlcHRpb25zL05vQ29uZmlndXJhdGlvbkZpbGVGb3VuZEV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZSgnLi9FeGNlcHRpb24nKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDdG9yXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gTm9Db25maWd1cmF0aW9uRmlsZUZvdW5kRXhjZXB0aW9uKCkge1xuICAgIEV4Y2VwdGlvbi5hcHBseSh0aGlzLCBbJ05vIGNvbmZpZ3VyYXRpb24gZmlsZSBmb3VuZC4nXSk7XG59XG5cbnV0aWwuaW5oZXJpdHMoTm9Db25maWd1cmF0aW9uRmlsZUZvdW5kRXhjZXB0aW9uLCBFeGNlcHRpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vQ29uZmlndXJhdGlvbkZpbGVGb3VuZEV4Y2VwdGlvbjtcbiJdfQ==