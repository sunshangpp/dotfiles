var thisIsAReallyReallyReallyLongCompletion = function thisIsAReallyReallyReallyLongCompletion() {};

var quicksort = function quicksort() {
  var sort = (function (_sort) {
    var _sortWrapper = function sort(_x) {
      return _sort.apply(this, arguments);
    };

    _sortWrapper.toString = function () {
      return _sort.toString();
    };

    return _sortWrapper;
  })(function (items) {
    if (items.length <= 1) return items;
    var pivot = items.shift(),
        current,
        left = [],
        right = [];
    while (items.length > 0) {
      current = items.shift();
      current < pivot ? left.push(current) : right.push(current);
    }
    return sort(left).concat(pivot).concat(sort(right));
  });

  return sort(Array.apply(this, arguments));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wbHVzL3NwZWMvZml4dHVyZXMvc2FtcGxlbG9uZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLHVDQUF1QyxHQUFHLG1EQUFZLEVBQUcsQ0FBQzs7QUFFOUQsSUFBSSxTQUFTLEdBQUcscUJBQVk7QUFDMUIsTUFBSSxJQUFJOzs7Ozs7Ozs7O0tBQUcsVUFBUyxLQUFLLEVBQUU7QUFDekIsUUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNwQyxRQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQUUsT0FBTztRQUFFLElBQUksR0FBRyxFQUFFO1FBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUMxRCxXQUFNLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLGFBQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEIsYUFBTyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUQ7QUFDRCxXQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0dBQ3JELENBQUEsQ0FBQzs7QUFFRixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzNDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9maXh0dXJlcy9zYW1wbGVsb25nLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRoaXNJc0FSZWFsbHlSZWFsbHlSZWFsbHlMb25nQ29tcGxldGlvbiA9IGZ1bmN0aW9uICgpIHsgfTtcblxudmFyIHF1aWNrc29ydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNvcnQgPSBmdW5jdGlvbihpdGVtcykge1xuICAgIGlmIChpdGVtcy5sZW5ndGggPD0gMSkgcmV0dXJuIGl0ZW1zO1xuICAgIHZhciBwaXZvdCA9IGl0ZW1zLnNoaWZ0KCksIGN1cnJlbnQsIGxlZnQgPSBbXSwgcmlnaHQgPSBbXTtcbiAgICB3aGlsZShpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50ID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgIGN1cnJlbnQgPCBwaXZvdCA/IGxlZnQucHVzaChjdXJyZW50KSA6IHJpZ2h0LnB1c2goY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBzb3J0KGxlZnQpLmNvbmNhdChwaXZvdCkuY29uY2F0KHNvcnQocmlnaHQpKTtcbiAgfTtcblxuICByZXR1cm4gc29ydChBcnJheS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbn07XG4iXX0=