//////////////////
// Requires
//////////////////

var Promise = require("bluebird");

var SftpConnection = require("./SftpConnection");
var FtpConnection = require("./FtpConnection");

//////////////////
// Ctor
//////////////////

function ConnectionFactory() {}

//////////////////
// Methods
//////////////////

ConnectionFactory.prototype.createConnection = function (config) {
    var deferred = Promise.pending();

    try {
        var type = config.type;
        type = type.charAt(0).toUpperCase() + type.substring(1);
        var getter = "create" + type + "Connection";
        var connection = this[getter](config);

        deferred.resolve(connection);
    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

/**
 * @return {SftpConnection}
 */
ConnectionFactory.prototype.openConnection = function (config) {
    return this.createConnection(config).then(function (connection) {
        return connection.connect();
    });
};

/**
 * @return {SftpConnection}
 */
ConnectionFactory.prototype.createSftpConnection = function (config) {
    return new SftpConnection(config);
};

/**
 * @return {FtpConnection}
 */
ConnectionFactory.prototype.createFtpConnection = function (config) {
    return new FtpConnection(config);
};

module.exports = ConnectionFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvY29ubmVjdGlvbnMvQ29ubmVjdGlvbkZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFbEMsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDakQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Ozs7OztBQU0vQyxTQUFTLGlCQUFpQixHQUFHLEVBQzVCOzs7Ozs7QUFNRCxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxNQUFNLEVBQUU7QUFDNUQsUUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVqQyxRQUFJO0FBQ0EsWUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixZQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFlBQUksTUFBTSxHQUFHLFFBQVEsR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDO0FBQzVDLFlBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdEMsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDaEMsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUNQLGdCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCOztBQUVELFdBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztDQUMzQixDQUFDOzs7OztBQUtGLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDM0QsV0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFTLFVBQVUsRUFBRTtBQUN2QixlQUFPLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMvQixDQUFDLENBQUM7Q0FDVixDQUFDOzs7OztBQUtGLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUNqRSxXQUFPLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQ3JDLENBQUM7Ozs7O0FBS0YsaUJBQWlCLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ2hFLFdBQU8sSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDcEMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvY29ubmVjdGlvbnMvQ29ubmVjdGlvbkZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFJlcXVpcmVzXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuXG52YXIgU2Z0cENvbm5lY3Rpb24gPSByZXF1aXJlKFwiLi9TZnRwQ29ubmVjdGlvblwiKTtcbnZhciBGdHBDb25uZWN0aW9uID0gcmVxdWlyZShcIi4vRnRwQ29ubmVjdGlvblwiKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDdG9yXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gQ29ubmVjdGlvbkZhY3RvcnkoKSB7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gTWV0aG9kc1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbkNvbm5lY3Rpb25GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGVDb25uZWN0aW9uID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nKCk7XG5cbiAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZSA9IGNvbmZpZy50eXBlO1xuICAgICAgICB0eXBlID0gdHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR5cGUuc3Vic3RyaW5nKDEpO1xuICAgICAgICB2YXIgZ2V0dGVyID0gJ2NyZWF0ZScgKyB0eXBlICsgJ0Nvbm5lY3Rpb24nO1xuICAgICAgICB2YXIgY29ubmVjdGlvbiA9IHRoaXNbZ2V0dGVyXShjb25maWcpO1xuXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoY29ubmVjdGlvbik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7U2Z0cENvbm5lY3Rpb259XG4gKi9cbkNvbm5lY3Rpb25GYWN0b3J5LnByb3RvdHlwZS5vcGVuQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDb25uZWN0aW9uKGNvbmZpZylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oY29ubmVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3Rpb24uY29ubmVjdCgpO1xuICAgICAgICB9KTtcbn07XG5cbi8qKlxuICogQHJldHVybiB7U2Z0cENvbm5lY3Rpb259XG4gKi9cbkNvbm5lY3Rpb25GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGVTZnRwQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICByZXR1cm4gbmV3IFNmdHBDb25uZWN0aW9uKGNvbmZpZyk7XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge0Z0cENvbm5lY3Rpb259XG4gKi9cbkNvbm5lY3Rpb25GYWN0b3J5LnByb3RvdHlwZS5jcmVhdGVGdHBDb25uZWN0aW9uID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgRnRwQ29ubmVjdGlvbihjb25maWcpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb25uZWN0aW9uRmFjdG9yeTtcbiJdfQ==