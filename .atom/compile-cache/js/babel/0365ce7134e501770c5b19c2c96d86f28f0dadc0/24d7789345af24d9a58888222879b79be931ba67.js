//////////////////
// Requires
//////////////////

var Promise = require('bluebird');
var util = require('util');
var fs = require('fs');
var path = require('path');

var File = require('./File');
var Directory = require('./Directory');

//////////////////
// Ctor
//////////////////

function FileManager() {}

//////////////////
// Methods
//////////////////

/**
 * Get the file of current open tab
 */
FileManager.prototype.getCurrentFile = function () {
    var deferred = Promise.pending();

    try {
        deferred.fulfill(new File(atom.workspace.paneContainer.activePane.activeItem.buffer.file.path));
    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

/**
 * Get the files of open tabs
 * @return {File[]}
 */
FileManager.prototype.getOpenFiles = function () {
    var deferred = Promise.pending();

    try {
        var files = [];
        var items = atom.workspace.getActivePane().getItems();
        for (var i in items) {
            files.push(new File(items[i].buffer.file.path));
        }
        deferred.fulfill(files);
    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

var treatPath = function treatPath(_path, results, deep) {
    var stats = fs.statSync(_path);

    if (stats.isDirectory()) {
        if (deep) {
            var files = fs.readdirSync(_path);
            for (var i in files) {
                treatPath(path.join(_path, files[i]), results, deep);
            }
        } else {
            results.push(new Directory(_path));
        }
    } else {
        if (results.indexOf(_path) < 0) {
            results.push(new File(_path));
        }
    }
};

/**
 * Get the files of open tabs
 * @return {File[]}
 */
FileManager.prototype.getSelection = function (deep) {
    var deferred = Promise.pending();

    try {
        var selectedPaths = atom.workspace.getLeftPanels()[0].getItem().selectedPaths();
        var files = [];
        for (var i in selectedPaths) {
            treatPath(selectedPaths[i], files, deep);
        }
        deferred.resolve(files);
    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

module.exports = new FileManager();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZmlsZXN5c3RlbS9GaWxlTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7Ozs7QUFNdkMsU0FBUyxXQUFXLEdBQUcsRUFDdEI7Ozs7Ozs7OztBQVNELFdBQVcsQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFlBQVc7QUFDOUMsUUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVqQyxRQUFJO0FBQ0EsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDbkcsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUNQLGdCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCOztBQUVELFdBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztDQUMzQixDQUFDOzs7Ozs7QUFNRixXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxZQUFXO0FBQzVDLFFBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFakMsUUFBSTtBQUNBLFlBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDdEQsYUFBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDbkIsaUJBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNqRDtBQUNELGdCQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCLENBQUMsT0FBTSxDQUFDLEVBQUU7QUFDUCxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0Qjs7QUFFRCxXQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUM7Q0FDM0IsQ0FBQzs7QUFFRixJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBWSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxRQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixRQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUNyQixZQUFJLElBQUksRUFBRTtBQUNOLGdCQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLGlCQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTtBQUNqQix5QkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN4RDtTQUNKLE1BQU07QUFDSCxtQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO0tBQ0osTUFBTTtBQUNILFlBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDNUIsbUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNqQztLQUNKO0NBQ0osQ0FBQTs7Ozs7O0FBTUQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBUyxJQUFJLEVBQUU7QUFDaEQsUUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVqQyxRQUFJO0FBQ0EsWUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNoRixZQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixhQUFLLElBQUksQ0FBQyxJQUFJLGFBQWEsRUFBRTtBQUN6QixxQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUM7QUFDRCxnQkFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQixDQUFDLE9BQU0sQ0FBQyxFQUFFO0FBQ1AsZ0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7O0FBRUQsV0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDO0NBQzNCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvZmlsZXN5c3RlbS9GaWxlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUmVxdWlyZXNcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxudmFyIEZpbGUgPSByZXF1aXJlKCcuL0ZpbGUnKTtcbnZhciBEaXJlY3RvcnkgPSByZXF1aXJlKCcuL0RpcmVjdG9yeScpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEN0b3Jcbi8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBGaWxlTWFuYWdlcigpIHtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBNZXRob2RzXG4vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBHZXQgdGhlIGZpbGUgb2YgY3VycmVudCBvcGVuIHRhYlxuICovXG5GaWxlTWFuYWdlci5wcm90b3R5cGUuZ2V0Q3VycmVudEZpbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBQcm9taXNlLnBlbmRpbmcoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGRlZmVycmVkLmZ1bGZpbGwobmV3IEZpbGUoYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lci5hY3RpdmVQYW5lLmFjdGl2ZUl0ZW0uYnVmZmVyLmZpbGUucGF0aCkpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgZmlsZXMgb2Ygb3BlbiB0YWJzXG4gKiBAcmV0dXJuIHtGaWxlW119XG4gKi9cbkZpbGVNYW5hZ2VyLnByb3RvdHlwZS5nZXRPcGVuRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBQcm9taXNlLnBlbmRpbmcoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHZhciBmaWxlcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXMgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0SXRlbXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBpdGVtcykge1xuICAgICAgICAgIGZpbGVzLnB1c2gobmV3IEZpbGUoaXRlbXNbaV0uYnVmZmVyLmZpbGUucGF0aCkpO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLmZ1bGZpbGwoZmlsZXMpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG52YXIgdHJlYXRQYXRoID0gZnVuY3Rpb24oX3BhdGgsIHJlc3VsdHMsIGRlZXApIHtcbiAgICB2YXIgc3RhdHMgPSBmcy5zdGF0U3luYyhfcGF0aCk7XG5cbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBpZiAoZGVlcCkge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZnMucmVhZGRpclN5bmMoX3BhdGgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBmaWxlcykge1xuICAgICAgICAgICAgICAgIHRyZWF0UGF0aChwYXRoLmpvaW4oX3BhdGgsIGZpbGVzW2ldKSwgcmVzdWx0cywgZGVlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IERpcmVjdG9yeShfcGF0aCkpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlc3VsdHMuaW5kZXhPZihfcGF0aCkgPCAwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IEZpbGUoX3BhdGgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIGZpbGVzIG9mIG9wZW4gdGFic1xuICogQHJldHVybiB7RmlsZVtdfVxuICovXG5GaWxlTWFuYWdlci5wcm90b3R5cGUuZ2V0U2VsZWN0aW9uID0gZnVuY3Rpb24oZGVlcCkge1xuICAgIHZhciBkZWZlcnJlZCA9IFByb21pc2UucGVuZGluZygpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHNlbGVjdGVkUGF0aHMgPSBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0UGFuZWxzKClbMF0uZ2V0SXRlbSgpLnNlbGVjdGVkUGF0aHMoKTtcbiAgICAgICAgdmFyIGZpbGVzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgaW4gc2VsZWN0ZWRQYXRocykge1xuICAgICAgICAgICAgdHJlYXRQYXRoKHNlbGVjdGVkUGF0aHNbaV0sIGZpbGVzLCBkZWVwKTtcbiAgICAgICAgfVxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZpbGVzKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRmlsZU1hbmFnZXIoKTtcbiJdfQ==