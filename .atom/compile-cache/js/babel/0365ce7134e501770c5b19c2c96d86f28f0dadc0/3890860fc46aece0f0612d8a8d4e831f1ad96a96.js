//////////////////
// Requires
//////////////////

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

//////////////////
// Ctor
//////////////////

function Config() {
    /**
    * @type {String}
    */
    this.type = undefined;

    /**
    * @type {String}
    */
    this.host = '';

    /**
    * @type {String}
    */
    this.username = '';

    /**
    * @type {String}
    */
    this.password = '';

    /**
    * @type {Number}
    */
    this.port = -1;

    /**
    * @type {String}
    */
    this.remotePath = '';

    /**
    * @type {Bool}
    */
    this.uploadOnSave = false;
}

//////////////////
// Methods
//////////////////

/**
 * Type setter
 * @param {String} _type
 */
Config.prototype.setType = function (_type) {
    this.type = _type;
};

/**
 * Type getter
 */
Config.prototype.getType = function () {
    return this.type;
};

/**
 * Host setter
 * @param {String} _host
 */
Config.prototype.setHost = function (_host) {
    this.host = _host;
};

/**
 * Host getter
 */
Config.prototype.getHost = function () {
    return this.host;
};

/**
 * Username setter
 * @param {String} _username
 */
Config.prototype.setUsername = function (_username) {
    this.username = _username;
};

/**
 * Username getter
 */
Config.prototype.getUsername = function () {
    return this.username;
};

/**
 * Password setter
 * @param {String} _password
 */
Config.prototype.setPassword = function (_password) {
    this.password = _password;
};

/**
 * Password getter
 */
Config.prototype.getPassword = function () {
    return this.password;
};

/**
 * Port setter
 * @param {Number} _port
 */
Config.prototype.setPort = function (_port) {
    this.port = _port;
};

/**
 * Port getter
 */
Config.prototype.getPort = function () {
    return this.port;
};

/**
 * Remote path setter
 * @param {String} _remotePath
 */
Config.prototype.setRemotePath = function (_remotePath) {
    this.remotePath = _remotePath;
};

/**
 * Remote path getter
 */
Config.prototype.getRemotePath = function () {
    return this.remotePath;
};

/**
 * Upload Save setter
 * @param {Bool} _uploadOnSave
 */
Config.prototype.setUploadOnSave = function (_uploadOnSave) {
    this.uploadOnSave = _uploadOnSave;
};

/**
 * Upload Save getter
 */
Config.prototype.getUploadOnSave = function () {
    return this.uploadOnSave;
};

function replacer(key, value) {
    return value !== null ? value : undefined;
}

Config.prototype.save = function (path) {
    return fs.writeFileAsync(path, JSON.stringify(this, replacer, 4));
};

module.exports = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvY29uZmlncy9Db25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7O0FBTTNCLFNBQVMsTUFBTSxHQUFHOzs7O0FBSWQsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Ozs7O0FBS3RCLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7OztBQUtmLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7OztBQUtuQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLbkIsUUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7QUFLZixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLckIsUUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Q0FDN0I7Ozs7Ozs7Ozs7QUFVRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLEtBQUssRUFBRTtBQUN4QyxRQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztDQUNyQixDQUFDOzs7OztBQUtGLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFlBQVk7QUFDbkMsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0NBQ3BCLENBQUM7Ozs7OztBQU1GLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ3hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0NBQ3JCLENBQUM7Ozs7O0FBS0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUNuQyxXQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7Q0FDcEIsQ0FBQzs7Ozs7O0FBTUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxTQUFTLEVBQUU7QUFDaEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7Q0FDN0IsQ0FBQzs7Ozs7QUFLRixNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxZQUFZO0FBQ3ZDLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztDQUN4QixDQUFDOzs7Ozs7QUFNRixNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFNBQVMsRUFBRTtBQUNoRCxRQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztDQUM3QixDQUFDOzs7OztBQUtGLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFlBQVk7QUFDdkMsV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0NBQ3hCLENBQUM7Ozs7OztBQU1GLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ3hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0NBQ3JCLENBQUM7Ozs7O0FBS0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUNuQyxXQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7Q0FDcEIsQ0FBQzs7Ozs7O0FBTUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBVSxXQUFXLEVBQUU7QUFDcEQsUUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7Q0FDakMsQ0FBQzs7Ozs7QUFLRixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxZQUFZO0FBQ3pDLFdBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztDQUMxQixDQUFDOzs7Ozs7QUFNRixNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxVQUFVLGFBQWEsRUFBRTtBQUN4RCxRQUFJLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQztDQUNyQyxDQUFDOzs7OztBQUtGLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxHQUFHLFlBQVk7QUFDM0MsV0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0NBQzVCLENBQUM7O0FBRUYsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUMxQixXQUFPLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQztDQUM3Qzs7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLElBQUksRUFBRTtBQUNwQyxXQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3JFLENBQUE7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9jb25maWdzL0NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUmVxdWlyZXNcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG52YXIgZnMgPSBQcm9taXNlLnByb21pc2lmeUFsbChyZXF1aXJlKCdmcycpKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEN0b3Jcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBDb25maWcoKSB7XG4gICAgLyoqXG4gICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy5ob3N0ID0gXCJcIjtcblxuICAgIC8qKlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMudXNlcm5hbWUgPSBcIlwiO1xuXG4gICAgLyoqXG4gICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy5wYXNzd29yZCA9IFwiXCI7XG5cbiAgICAvKipcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnBvcnQgPSAtMTtcblxuICAgIC8qKlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMucmVtb3RlUGF0aCA9IFwiXCI7XG5cbiAgICAvKipcbiAgICAqIEB0eXBlIHtCb29sfVxuICAgICovXG4gICAgdGhpcy51cGxvYWRPblNhdmUgPSBmYWxzZTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBNZXRob2RzXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBUeXBlIHNldHRlclxuICogQHBhcmFtIHtTdHJpbmd9IF90eXBlXG4gKi9cbkNvbmZpZy5wcm90b3R5cGUuc2V0VHlwZSA9IGZ1bmN0aW9uIChfdHlwZSkge1xuICAgIHRoaXMudHlwZSA9IF90eXBlO1xufTtcblxuLyoqXG4gKiBUeXBlIGdldHRlclxuICovXG5Db25maWcucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5cbi8qKlxuICogSG9zdCBzZXR0ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBfaG9zdFxuICovXG5Db25maWcucHJvdG90eXBlLnNldEhvc3QgPSBmdW5jdGlvbiAoX2hvc3QpIHtcbiAgICB0aGlzLmhvc3QgPSBfaG9zdDtcbn07XG5cbi8qKlxuICogSG9zdCBnZXR0ZXJcbiAqL1xuQ29uZmlnLnByb3RvdHlwZS5nZXRIb3N0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmhvc3Q7XG59O1xuXG4vKipcbiAqIFVzZXJuYW1lIHNldHRlclxuICogQHBhcmFtIHtTdHJpbmd9IF91c2VybmFtZVxuICovXG5Db25maWcucHJvdG90eXBlLnNldFVzZXJuYW1lID0gZnVuY3Rpb24gKF91c2VybmFtZSkge1xuICAgIHRoaXMudXNlcm5hbWUgPSBfdXNlcm5hbWU7XG59O1xuXG4vKipcbiAqIFVzZXJuYW1lIGdldHRlclxuICovXG5Db25maWcucHJvdG90eXBlLmdldFVzZXJuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnVzZXJuYW1lO1xufTtcblxuLyoqXG4gKiBQYXNzd29yZCBzZXR0ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBfcGFzc3dvcmRcbiAqL1xuQ29uZmlnLnByb3RvdHlwZS5zZXRQYXNzd29yZCA9IGZ1bmN0aW9uIChfcGFzc3dvcmQpIHtcbiAgICB0aGlzLnBhc3N3b3JkID0gX3Bhc3N3b3JkO1xufTtcblxuLyoqXG4gKiBQYXNzd29yZCBnZXR0ZXJcbiAqL1xuQ29uZmlnLnByb3RvdHlwZS5nZXRQYXNzd29yZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXNzd29yZDtcbn07XG5cbi8qKlxuICogUG9ydCBzZXR0ZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBfcG9ydFxuICovXG5Db25maWcucHJvdG90eXBlLnNldFBvcnQgPSBmdW5jdGlvbiAoX3BvcnQpIHtcbiAgICB0aGlzLnBvcnQgPSBfcG9ydDtcbn07XG5cbi8qKlxuICogUG9ydCBnZXR0ZXJcbiAqL1xuQ29uZmlnLnByb3RvdHlwZS5nZXRQb3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnBvcnQ7XG59O1xuXG4vKipcbiAqIFJlbW90ZSBwYXRoIHNldHRlclxuICogQHBhcmFtIHtTdHJpbmd9IF9yZW1vdGVQYXRoXG4gKi9cbkNvbmZpZy5wcm90b3R5cGUuc2V0UmVtb3RlUGF0aCA9IGZ1bmN0aW9uIChfcmVtb3RlUGF0aCkge1xuICAgIHRoaXMucmVtb3RlUGF0aCA9IF9yZW1vdGVQYXRoO1xufTtcblxuLyoqXG4gKiBSZW1vdGUgcGF0aCBnZXR0ZXJcbiAqL1xuQ29uZmlnLnByb3RvdHlwZS5nZXRSZW1vdGVQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlbW90ZVBhdGg7XG59O1xuXG4vKipcbiAqIFVwbG9hZCBTYXZlIHNldHRlclxuICogQHBhcmFtIHtCb29sfSBfdXBsb2FkT25TYXZlXG4gKi9cbkNvbmZpZy5wcm90b3R5cGUuc2V0VXBsb2FkT25TYXZlID0gZnVuY3Rpb24gKF91cGxvYWRPblNhdmUpIHtcbiAgICB0aGlzLnVwbG9hZE9uU2F2ZSA9IF91cGxvYWRPblNhdmU7XG59O1xuXG4vKipcbiAqIFVwbG9hZCBTYXZlIGdldHRlclxuICovXG5Db25maWcucHJvdG90eXBlLmdldFVwbG9hZE9uU2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy51cGxvYWRPblNhdmU7XG59O1xuXG5mdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBudWxsID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbkNvbmZpZy5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgcmV0dXJuIGZzLndyaXRlRmlsZUFzeW5jKHBhdGgsIEpTT04uc3RyaW5naWZ5KHRoaXMsIHJlcGxhY2VyLCA0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnO1xuIl19