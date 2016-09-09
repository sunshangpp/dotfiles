var util = require('util');

var Exception = require('./Exception');

//////////////////
// Ctor
//////////////////

function DownloadErrorException(file, message) {
    Exception.apply(this, ['Cannot download file "' + file + '" : ' + message]);
}

util.inherits(DownloadErrorException, Exception);

module.exports = DownloadErrorException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZXhjZXB0aW9ucy9Eb3dubG9hZEVycm9yRXhjZXB0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFM0IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7Ozs7QUFNdkMsU0FBUyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQzNDLGFBQVMsQ0FBQyxLQUFLLENBQ1gsSUFBSSxFQUNKLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FDdkQsQ0FBQztDQUNMOztBQUVELElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWpELE1BQU0sQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9leGNlcHRpb25zL0Rvd25sb2FkRXJyb3JFeGNlcHRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4vRXhjZXB0aW9uJyk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ3RvclxuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIERvd25sb2FkRXJyb3JFeGNlcHRpb24oZmlsZSwgbWVzc2FnZSkge1xuICAgIEV4Y2VwdGlvbi5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgWydDYW5ub3QgZG93bmxvYWQgZmlsZSBcIicgKyBmaWxlICsgJ1wiIDogJyArIG1lc3NhZ2VdXG4gICAgKTtcbn1cblxudXRpbC5pbmhlcml0cyhEb3dubG9hZEVycm9yRXhjZXB0aW9uLCBFeGNlcHRpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvd25sb2FkRXJyb3JFeGNlcHRpb247XG4iXX0=