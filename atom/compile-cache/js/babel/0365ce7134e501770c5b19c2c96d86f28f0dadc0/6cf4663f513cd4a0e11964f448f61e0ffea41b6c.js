//////////////////
// Requires
//////////////////

var util = require('util');
var fs = require('fs');
var path = require('path');
var expandHomeDir = require('expand-home-dir');

var Config = require('./Config');

//////////////////
// Ctor
//////////////////

function SftpConfig() {
    Config.apply(this, Array.prototype.slice.call(arguments));

    /**
    * @type {Number}
    */
    this.port = 22;

    /**
    * @type {String}
    */
    this.type = 'sftp';

    /**
    * @type {String}
    */
    this.sshKeyFile = null;

    /**
    * @type {String}
    */
    this.passphrase = null;
}

util.inherits(SftpConfig, Config);

//////////////////
// Methods
//////////////////

/**
 * Ssh key file setter
 * @param {String} _key
 */
SftpConfig.prototype.setSshKeyFile = function (_key) {
    this.sshKeyFile = _key;
};

/**
 * Ssh key file getter
 */
SftpConfig.prototype.getSshKeyFile = function () {
    return fs.readFileSync(expandHomeDir(this.sshKeyFile), 'utf8');
};

/**
 * Passphrase setter
 * @param {String} _passphrase
 */
SftpConfig.prototype.setPassphrase = function (_passphrase) {
    this.passphrase = _passphrase;
};

/**
 * Passphrase getter
 */
SftpConfig.prototype.getPassphrase = function () {
    return this.passphrase;
};

module.exports = SftpConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvY29uZmlncy9TZnRwQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTs7QUFFOUMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7Ozs7QUFNakMsU0FBUyxVQUFVLEdBQUc7QUFDbEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Ozs7O0FBSzFELFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7OztBQUtmLFFBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDOzs7OztBQUtuQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7Ozs7QUFLdkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Q0FDMUI7O0FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUFVbEMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDakQsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Q0FDMUIsQ0FBQzs7Ozs7QUFLRixVQUFVLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxZQUFZO0FBQzdDLFdBQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQ2xFLENBQUM7Ozs7OztBQU1GLFVBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVUsV0FBVyxFQUFFO0FBQ3hELFFBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0NBQ2pDLENBQUM7Ozs7O0FBS0YsVUFBVSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsWUFBWTtBQUM3QyxXQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7Q0FDMUIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9zZnRwLWRlcGxveW1lbnQvbGliL2NvbmZpZ3MvU2Z0cENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUmVxdWlyZXNcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBleHBhbmRIb21lRGlyID0gcmVxdWlyZSgnZXhwYW5kLWhvbWUtZGlyJylcblxudmFyIENvbmZpZyA9IHJlcXVpcmUoJy4vQ29uZmlnJyk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ3RvclxuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIFNmdHBDb25maWcoKSB7XG4gICAgQ29uZmlnLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXG4gICAgLyoqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5wb3J0ID0gMjI7XG5cbiAgICAvKipcbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnR5cGUgPSBcInNmdHBcIjtcblxuICAgIC8qKlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuc3NoS2V5RmlsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnBhc3NwaHJhc2UgPSBudWxsO1xufVxuXG51dGlsLmluaGVyaXRzKFNmdHBDb25maWcsIENvbmZpZyk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gTWV0aG9kc1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qKlxuICogU3NoIGtleSBmaWxlIHNldHRlclxuICogQHBhcmFtIHtTdHJpbmd9IF9rZXlcbiAqL1xuU2Z0cENvbmZpZy5wcm90b3R5cGUuc2V0U3NoS2V5RmlsZSA9IGZ1bmN0aW9uIChfa2V5KSB7XG4gICAgdGhpcy5zc2hLZXlGaWxlID0gX2tleTtcbn07XG5cbi8qKlxuICogU3NoIGtleSBmaWxlIGdldHRlclxuICovXG5TZnRwQ29uZmlnLnByb3RvdHlwZS5nZXRTc2hLZXlGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoZXhwYW5kSG9tZURpcih0aGlzLnNzaEtleUZpbGUpLCAndXRmOCcpO1xufTtcblxuLyoqXG4gKiBQYXNzcGhyYXNlIHNldHRlclxuICogQHBhcmFtIHtTdHJpbmd9IF9wYXNzcGhyYXNlXG4gKi9cblNmdHBDb25maWcucHJvdG90eXBlLnNldFBhc3NwaHJhc2UgPSBmdW5jdGlvbiAoX3Bhc3NwaHJhc2UpIHtcbiAgICB0aGlzLnBhc3NwaHJhc2UgPSBfcGFzc3BocmFzZTtcbn07XG5cbi8qKlxuICogUGFzc3BocmFzZSBnZXR0ZXJcbiAqL1xuU2Z0cENvbmZpZy5wcm90b3R5cGUuZ2V0UGFzc3BocmFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXNzcGhyYXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZnRwQ29uZmlnO1xuIl19