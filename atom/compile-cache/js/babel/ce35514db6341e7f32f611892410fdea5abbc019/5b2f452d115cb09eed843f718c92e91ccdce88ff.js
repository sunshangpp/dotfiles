Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _osHomedir = require('os-homedir');

var _osHomedir2 = _interopRequireDefault(_osHomedir);

var _check = require('./check');

'use babel';

function expand(env, thepath) {
  if ((0, _check.isFalsy)(thepath) || thepath.trim() === '') {
    return '';
  }

  if ((0, _check.isFalsy)(env)) {
    return thepath;
  }

  thepath = thepath.replace(/(~|\$[^\\/:]*|%[^\\;%]*%)+?/gim, function (text, match) {
    if (match === '~') {
      return home();
    } else {
      var m = match;
      if (_os2['default'].platform() === 'win32') {
        m = match.replace(/%/g, '');
      } else {
        m = match.replace(/\$/g, '');
      }

      if (typeof env[m] !== 'undefined') {
        if (m === 'GOPATH' && env[m].indexOf(_path2['default'].delimiter) !== -1) {
          return expand(env, env[m].split(_path2['default'].delimiter)[0].trim());
        } else {
          return expand(env, env[m]);
        }
      } else {
        return match;
      }
    }
  });

  if (thepath.indexOf(_path2['default'].delimiter) === -1) {
    return resolveAndNormalize(thepath);
  }

  var paths = thepath.split(_path2['default'].delimiter);
  var result = '';
  for (var pathItem of paths) {
    pathItem = resolveAndNormalize(pathItem);
    if (result === '') {
      result = pathItem;
    } else {
      result = result + _path2['default'].delimiter + pathItem;
    }
  }

  return result;
}

function resolveAndNormalize(pathitem) {
  if ((0, _check.isFalsy)(pathitem) || pathitem.trim() === '') {
    return '';
  }
  var result = _path2['default'].resolve(_path2['default'].normalize(pathitem));
  return result;
}

function home() {
  return (0, _osHomedir2['default'])();
}

exports['default'] = { expand: expand, resolveAndNormalize: resolveAndNormalize, home: home };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvcGF0aGhlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWlCLE1BQU07Ozs7a0JBQ1IsSUFBSTs7Ozt5QkFDRyxZQUFZOzs7O3FCQUNaLFNBQVM7O0FBTC9CLFdBQVcsQ0FBQTs7QUFPWCxTQUFTLE1BQU0sQ0FBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQzdCLE1BQUksb0JBQVEsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUM3QyxXQUFPLEVBQUUsQ0FBQTtHQUNWOztBQUVELE1BQUksb0JBQVEsR0FBRyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxPQUFPLENBQUE7R0FDZjs7QUFFRCxTQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDM0UsUUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO0FBQ2pCLGFBQU8sSUFBSSxFQUFFLENBQUE7S0FDZCxNQUFNO0FBQ0wsVUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFBO0FBQ2IsVUFBSSxnQkFBRyxRQUFRLEVBQUUsS0FBSyxPQUFPLEVBQUU7QUFDN0IsU0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO09BQzVCLE1BQU07QUFDTCxTQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUU7QUFDakMsWUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQUssU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDM0QsaUJBQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7U0FDM0QsTUFBTTtBQUNMLGlCQUFPLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDM0I7T0FDRixNQUFNO0FBQ0wsZUFBTyxLQUFLLENBQUE7T0FDYjtLQUNGO0dBQ0YsQ0FBQyxDQUFBOztBQUVGLE1BQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBSyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMxQyxXQUFPLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3BDOztBQUVELE1BQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQUssU0FBUyxDQUFDLENBQUE7QUFDekMsTUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2YsT0FBSyxJQUFJLFFBQVEsSUFBSSxLQUFLLEVBQUU7QUFDMUIsWUFBUSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFFBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtBQUNqQixZQUFNLEdBQUcsUUFBUSxDQUFBO0tBQ2xCLE1BQU07QUFDTCxZQUFNLEdBQUcsTUFBTSxHQUFHLGtCQUFLLFNBQVMsR0FBRyxRQUFRLENBQUE7S0FDNUM7R0FDRjs7QUFFRCxTQUFPLE1BQU0sQ0FBQTtDQUNkOztBQUVELFNBQVMsbUJBQW1CLENBQUUsUUFBUSxFQUFFO0FBQ3RDLE1BQUksb0JBQVEsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUMvQyxXQUFPLEVBQUUsQ0FBQTtHQUNWO0FBQ0QsTUFBSSxNQUFNLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQ25ELFNBQU8sTUFBTSxDQUFBO0NBQ2Q7O0FBRUQsU0FBUyxJQUFJLEdBQUk7QUFDZixTQUFPLDZCQUFXLENBQUE7Q0FDbkI7O3FCQUVjLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxtQkFBbUIsRUFBbkIsbUJBQW1CLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1jb25maWcvbGliL3BhdGhoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IG9zSG9tZWRpciBmcm9tICdvcy1ob21lZGlyJ1xuaW1wb3J0IHtpc0ZhbHN5fSBmcm9tICcuL2NoZWNrJ1xuXG5mdW5jdGlvbiBleHBhbmQgKGVudiwgdGhlcGF0aCkge1xuICBpZiAoaXNGYWxzeSh0aGVwYXRoKSB8fCB0aGVwYXRoLnRyaW0oKSA9PT0gJycpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChpc0ZhbHN5KGVudikpIHtcbiAgICByZXR1cm4gdGhlcGF0aFxuICB9XG5cbiAgdGhlcGF0aCA9IHRoZXBhdGgucmVwbGFjZSgvKH58XFwkW15cXFxcLzpdKnwlW15cXFxcOyVdKiUpKz8vZ2ltLCAodGV4dCwgbWF0Y2gpID0+IHtcbiAgICBpZiAobWF0Y2ggPT09ICd+Jykge1xuICAgICAgcmV0dXJuIGhvbWUoKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbSA9IG1hdGNoXG4gICAgICBpZiAob3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJykge1xuICAgICAgICBtID0gbWF0Y2gucmVwbGFjZSgvJS9nLCAnJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBtYXRjaC5yZXBsYWNlKC9cXCQvZywgJycpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZW52W21dICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAobSA9PT0gJ0dPUEFUSCcgJiYgZW52W21dLmluZGV4T2YocGF0aC5kZWxpbWl0ZXIpICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBleHBhbmQoZW52LCBlbnZbbV0uc3BsaXQocGF0aC5kZWxpbWl0ZXIpWzBdLnRyaW0oKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZXhwYW5kKGVudiwgZW52W21dKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWF0Y2hcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgaWYgKHRoZXBhdGguaW5kZXhPZihwYXRoLmRlbGltaXRlcikgPT09IC0xKSB7XG4gICAgcmV0dXJuIHJlc29sdmVBbmROb3JtYWxpemUodGhlcGF0aClcbiAgfVxuXG4gIGxldCBwYXRocyA9IHRoZXBhdGguc3BsaXQocGF0aC5kZWxpbWl0ZXIpXG4gIGxldCByZXN1bHQgPSAnJ1xuICBmb3IgKGxldCBwYXRoSXRlbSBvZiBwYXRocykge1xuICAgIHBhdGhJdGVtID0gcmVzb2x2ZUFuZE5vcm1hbGl6ZShwYXRoSXRlbSlcbiAgICBpZiAocmVzdWx0ID09PSAnJykge1xuICAgICAgcmVzdWx0ID0gcGF0aEl0ZW1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgcGF0aC5kZWxpbWl0ZXIgKyBwYXRoSXRlbVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUFuZE5vcm1hbGl6ZSAocGF0aGl0ZW0pIHtcbiAgaWYgKGlzRmFsc3kocGF0aGl0ZW0pIHx8IHBhdGhpdGVtLnRyaW0oKSA9PT0gJycpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuICBsZXQgcmVzdWx0ID0gcGF0aC5yZXNvbHZlKHBhdGgubm9ybWFsaXplKHBhdGhpdGVtKSlcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBob21lICgpIHtcbiAgcmV0dXJuIG9zSG9tZWRpcigpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgZXhwYW5kLCByZXNvbHZlQW5kTm9ybWFsaXplLCBob21lIH1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/pathhelper.js
