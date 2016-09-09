'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function isFalsy(value) {
  if (typeof value === 'undefined') {
    return true;
  }
  if (value) {
    return false;
  }
  return true;
}

function isTruthy(value) {
  return !isFalsy(value);
}

function isArray(value) {
  if (isTruthy(value) && value.constructor === Array) {
    return true;
  }

  return false;
}

function isEmpty(value) {
  if (isTruthy(value) && value.constructor === Array && value.length < 1) {
    return true;
  }

  return isFalsy(value);
}

exports.isFalsy = isFalsy;
exports.isTruthy = isTruthy;
exports.isArray = isArray;
exports.isEmpty = isEmpty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvY2hlY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7OztBQUVYLFNBQVMsT0FBTyxDQUFFLEtBQUssRUFBRTtBQUN2QixNQUFJLE9BQU8sS0FBSyxLQUFLLFdBQVcsRUFBRTtBQUNoQyxXQUFPLElBQUksQ0FBQTtHQUNaO0FBQ0QsTUFBSSxLQUFLLEVBQUU7QUFDVCxXQUFPLEtBQUssQ0FBQTtHQUNiO0FBQ0QsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFRCxTQUFTLFFBQVEsQ0FBRSxLQUFLLEVBQUU7QUFDeEIsU0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUN2Qjs7QUFFRCxTQUFTLE9BQU8sQ0FBRSxLQUFLLEVBQUU7QUFDdkIsTUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7QUFDbEQsV0FBTyxJQUFJLENBQUE7R0FDWjs7QUFFRCxTQUFPLEtBQUssQ0FBQTtDQUNiOztBQUVELFNBQVMsT0FBTyxDQUFFLEtBQUssRUFBRTtBQUN2QixNQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN0RSxXQUFPLElBQUksQ0FBQTtHQUNaOztBQUVELFNBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQ3RCOztRQUVRLE9BQU8sR0FBUCxPQUFPO1FBQUUsUUFBUSxHQUFSLFFBQVE7UUFBRSxPQUFPLEdBQVAsT0FBTztRQUFFLE9BQU8sR0FBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvY2hlY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5mdW5jdGlvbiBpc0ZhbHN5ICh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgaWYgKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaXNUcnV0aHkgKHZhbHVlKSB7XG4gIHJldHVybiAhaXNGYWxzeSh2YWx1ZSlcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAodmFsdWUpIHtcbiAgaWYgKGlzVHJ1dGh5KHZhbHVlKSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkgKHZhbHVlKSB7XG4gIGlmIChpc1RydXRoeSh2YWx1ZSkgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IEFycmF5ICYmIHZhbHVlLmxlbmd0aCA8IDEpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGlzRmFsc3kodmFsdWUpXG59XG5cbmV4cG9ydCB7IGlzRmFsc3ksIGlzVHJ1dGh5LCBpc0FycmF5LCBpc0VtcHR5IH1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/check.js
