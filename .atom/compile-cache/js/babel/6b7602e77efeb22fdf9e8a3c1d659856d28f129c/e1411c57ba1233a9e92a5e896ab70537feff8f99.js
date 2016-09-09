var util = require('util');

var Exception = require('./Exception');

//////////////////
// Ctor
//////////////////

function UploadErrorException(file, message) {
    Exception.apply(this, ['Cannot upload file "' + file + '" : ' + message]);
}

util.inherits(UploadErrorException, Exception);

module.exports = UploadErrorException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZXhjZXB0aW9ucy9VcGxvYWRFcnJvckV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Ozs7O0FBTXZDLFNBQVMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUN6QyxhQUFTLENBQUMsS0FBSyxDQUNYLElBQUksRUFDSixDQUFDLHNCQUFzQixHQUFHLElBQUksR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQ3JELENBQUM7Q0FDTDs7QUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUUvQyxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZXhjZXB0aW9ucy9VcGxvYWRFcnJvckV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZSgnLi9FeGNlcHRpb24nKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDdG9yXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gVXBsb2FkRXJyb3JFeGNlcHRpb24oZmlsZSwgbWVzc2FnZSkge1xuICAgIEV4Y2VwdGlvbi5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgWydDYW5ub3QgdXBsb2FkIGZpbGUgXCInICsgZmlsZSArICdcIiA6ICcgKyBtZXNzYWdlXVxuICAgICk7XG59XG5cbnV0aWwuaW5oZXJpdHMoVXBsb2FkRXJyb3JFeGNlcHRpb24sIEV4Y2VwdGlvbik7XG5cbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkRXJyb3JFeGNlcHRpb247XG4iXX0=