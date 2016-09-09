function Queue(maxActive) {
    this.queue = [];
    this.actives = [];
    this.maxActive = maxActive;
    this.endCallback = function () {};
    this.errorCallback = function () {};

    for (var i = 0; i < this.maxActive; i++) {
        this.actives[i] = null;
    }
}

Queue.prototype.init = function (endCallback, errorCallback) {
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;
};

Queue.prototype.end = function () {
    this.endCallback();
};

Queue.prototype.addAction = function (action) {
    this.queue.push(action);
};

Queue.prototype.isFinished = function () {
    for (var i = 0; i < this.maxActive; i++) {
        if (this.actives[i] !== null) {
            return false;
        }
    }

    return this.queue.length === 0;
};

Queue.prototype.nextSlotAvailable = function () {
    for (var i = 0; i < this.maxActive; i++) {
        if (this.actives[i] === null) {
            return i;
        }
    }

    return false;
};

Queue.prototype.next = function () {
    var self = this;
    var index = this.nextSlotAvailable();

    if (index !== false) {
        var action = this.queue.shift(action);

        if (action) {
            self.actives[index] = action;
            action.execute().then(function (v) {
                self.actives[index] = null;
                self.next();
            })["catch"](function (e) {
                self.errorCallback(e);
                self.next();
                self.actives[index] = null;
            });

            return;
        }
    }

    if (this.isFinished()) {
        this.end();
    }
};

Queue.prototype.execute = function (endCallback, errorCallback) {
    this.init(endCallback, errorCallback);

    while (this.nextSlotAvailable() !== false && this.queue.length > 0) {
        this.next();
    }
};

module.exports = Queue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvcXVldWUvUXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxLQUFLLENBQUMsU0FBUyxFQUFFO0FBQ3RCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxXQUFXLEdBQUcsWUFBVyxFQUFFLENBQUM7QUFDakMsUUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFXLEVBQUUsQ0FBQzs7QUFFbkMsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDMUI7Q0FDSjs7QUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFTLFdBQVcsRUFBRSxhQUFhLEVBQUU7QUFDeEQsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Q0FDdEMsQ0FBQzs7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxZQUFXO0FBQzdCLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztDQUN0QixDQUFDOztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVMsTUFBTSxFQUFFO0FBQ3pDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzNCLENBQUM7O0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsWUFBVztBQUNwQyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxZQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQzFCLG1CQUFPLEtBQUssQ0FBQztTQUNoQjtLQUNKOztBQUVELFdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFFO0NBQ3BDLENBQUE7O0FBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxZQUFXO0FBQzNDLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLFlBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDMUIsbUJBQU8sQ0FBQyxDQUFDO1NBQ1o7S0FDSjs7QUFFRCxXQUFPLEtBQUssQ0FBQztDQUNoQixDQUFBOztBQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVc7QUFDOUIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUVyQyxRQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFDakIsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXRDLFlBQUksTUFBTSxFQUFFO0FBQ1IsZ0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzdCLGtCQUFNLENBQUMsT0FBTyxFQUFFLENBQ1gsSUFBSSxDQUFDLFVBQVMsQ0FBQyxFQUFFO0FBQ2Qsb0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLG9CQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDZixDQUFDLFNBQ0ksQ0FBQyxVQUFTLENBQUMsRUFBRTtBQUNmLG9CQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLG9CQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDOUIsQ0FBQyxDQUFDOztBQUVQLG1CQUFPO1NBQ1Y7S0FDSjs7QUFFRCxRQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUNuQixZQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDZDtDQUNKLENBQUM7O0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxXQUFXLEVBQUUsYUFBYSxFQUFFO0FBQzNELFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUV0QyxXQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDaEUsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2Y7Q0FDSixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvcXVldWUvUXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBRdWV1ZShtYXhBY3RpdmUpIHtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5hY3RpdmVzID0gW107XG4gICAgdGhpcy5tYXhBY3RpdmUgPSBtYXhBY3RpdmU7XG4gICAgdGhpcy5lbmRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG4gICAgdGhpcy5lcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tYXhBY3RpdmU7IGkrKykge1xuICAgICAgICB0aGlzLmFjdGl2ZXNbaV0gPSBudWxsO1xuICAgIH1cbn1cblxuUXVldWUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihlbmRDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgIHRoaXMuZW5kQ2FsbGJhY2sgPSBlbmRDYWxsYmFjaztcbiAgICB0aGlzLmVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrO1xufTtcblxuUXVldWUucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW5kQ2FsbGJhY2soKTtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5hZGRBY3Rpb24gPSBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICB0aGlzLnF1ZXVlLnB1c2goYWN0aW9uKTtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5pc0ZpbmlzaGVkID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1heEFjdGl2ZTsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZXNbaV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDApO1xufVxuXG5RdWV1ZS5wcm90b3R5cGUubmV4dFNsb3RBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWF4QWN0aXZlOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlc1tpXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cblF1ZXVlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBpbmRleCA9IHRoaXMubmV4dFNsb3RBdmFpbGFibGUoKTtcblxuICAgIGlmIChpbmRleCAhPT0gZmFsc2UpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IHRoaXMucXVldWUuc2hpZnQoYWN0aW9uKTtcblxuICAgICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgICAgICBzZWxmLmFjdGl2ZXNbaW5kZXhdID0gYWN0aW9uO1xuICAgICAgICAgICAgYWN0aW9uLmV4ZWN1dGUoKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVzW2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV4dCgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lcnJvckNhbGxiYWNrKGUpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVzW2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRmluaXNoZWQoKSkge1xuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH1cbn07XG5cblF1ZXVlLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oZW5kQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICB0aGlzLmluaXQoZW5kQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spO1xuXG4gICAgd2hpbGUgKHRoaXMubmV4dFNsb3RBdmFpbGFibGUoKSAhPT0gZmFsc2UgJiYgdGhpcy5xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG4iXX0=