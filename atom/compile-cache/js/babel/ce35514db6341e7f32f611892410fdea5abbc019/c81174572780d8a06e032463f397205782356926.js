function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-env jasmine */

var _libPathhelper = require('./../lib/pathhelper');

var _libPathhelper2 = _interopRequireDefault(_libPathhelper);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

describe('pathhelper', function () {
  var gopathToken = '';

  beforeEach(function () {
    runs(function () {
      gopathToken = '$GOPATH';
      if (_os2['default'].platform() === 'win32') {
        gopathToken = '%GOPATH%';
      }
    });
  });

  describe('when working with a single-item path', function () {
    it('expands the path', function () {
      var env = Object.assign({}, process.env);
      env.GOPATH = '~' + _path2['default'].sep + 'go';

      var result = _libPathhelper2['default'].expand(env, _path2['default'].join('~', 'go', 'go', '..', 'bin', 'goimports'));
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go', 'bin', 'goimports'));

      result = _libPathhelper2['default'].expand(env, _path2['default'].join(gopathToken, 'go', '..', 'bin', 'goimports'));
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go', 'bin', 'goimports'));

      var root = _path2['default'].sep;
      var nonexistentKey = '$NONEXISTENT';
      if (_os2['default'].platform() === 'win32') {
        root = 'c:' + _path2['default'].sep;
        nonexistentKey = '%NONEXISTENT%';
      }
      result = _libPathhelper2['default'].expand(env, _path2['default'].join(root, nonexistentKey, 'go', '..', 'bin', 'goimports'));
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result).toBe(_path2['default'].join(root, nonexistentKey, 'bin', 'goimports'));
    });
  });

  describe('when working with a multi-item path', function () {
    it('expands the path', function () {
      var env = Object.assign({}, process.env);
      env.GOPATH = '~' + _path2['default'].sep + 'go' + _path2['default'].delimiter + '~' + _path2['default'].sep + 'othergo';

      var result = _libPathhelper2['default'].expand(env, _path2['default'].join('~', 'go', 'go', '..', 'bin', 'goimports'));
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go', 'bin', 'goimports'));

      result = _libPathhelper2['default'].expand(env, _path2['default'].join(gopathToken, 'go', '..', 'bin', 'goimports'));
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result).toBe(_path2['default'].join(_libPathhelper2['default'].home(), 'go', 'bin', 'goimports'));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9zcGVjL3BhdGhoZWxwZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzZCQUd1QixxQkFBcUI7Ozs7a0JBQzdCLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQUx2QixXQUFXLENBQUE7O0FBT1gsUUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQzNCLE1BQUksV0FBVyxHQUFHLEVBQUUsQ0FBQTs7QUFFcEIsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsWUFBTTtBQUNULGlCQUFXLEdBQUcsU0FBUyxDQUFBO0FBQ3ZCLFVBQUksZ0JBQUcsUUFBUSxFQUFFLEtBQUssT0FBTyxFQUFFO0FBQzdCLG1CQUFXLEdBQUcsVUFBVSxDQUFBO09BQ3pCO0tBQ0YsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxzQ0FBc0MsRUFBRSxZQUFNO0FBQ3JELE1BQUUsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0FBQzNCLFVBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN4QyxTQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxrQkFBSyxHQUFHLEdBQUcsSUFBSSxDQUFBOztBQUVsQyxVQUFJLE1BQU0sR0FBRywyQkFBVyxNQUFNLENBQUMsR0FBRyxFQUFFLGtCQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7QUFDekYsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQzVCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMzQixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFLLElBQUksQ0FBQywy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MkJBQVcsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFBO0tBQzVFLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nby1jb25maWcvc3BlYy9wYXRoaGVscGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCBwYXRoaGVscGVyIGZyb20gJy4vLi4vbGliL3BhdGhoZWxwZXInXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5kZXNjcmliZSgncGF0aGhlbHBlcicsICgpID0+IHtcbiAgbGV0IGdvcGF0aFRva2VuID0gJydcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBydW5zKCgpID0+IHtcbiAgICAgIGdvcGF0aFRva2VuID0gJyRHT1BBVEgnXG4gICAgICBpZiAob3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJykge1xuICAgICAgICBnb3BhdGhUb2tlbiA9ICclR09QQVRIJSdcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHdvcmtpbmcgd2l0aCBhIHNpbmdsZS1pdGVtIHBhdGgnLCAoKSA9PiB7XG4gICAgaXQoJ2V4cGFuZHMgdGhlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBsZXQgZW52ID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpXG4gICAgICBlbnYuR09QQVRIID0gJ34nICsgcGF0aC5zZXAgKyAnZ28nXG5cbiAgICAgIGxldCByZXN1bHQgPSBwYXRoaGVscGVyLmV4cGFuZChlbnYsIHBhdGguam9pbignficsICdnbycsICdnbycsICcuLicsICdiaW4nLCAnZ29pbXBvcnRzJykpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUocGF0aC5qb2luKHBhdGhoZWxwZXIuaG9tZSgpLCAnZ28nLCAnYmluJywgJ2dvaW1wb3J0cycpKVxuXG4gICAgICByZXN1bHQgPSBwYXRoaGVscGVyLmV4cGFuZChlbnYsIHBhdGguam9pbihnb3BhdGhUb2tlbiwgJ2dvJywgJy4uJywgJ2JpbicsICdnb2ltcG9ydHMnKSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShwYXRoLmpvaW4ocGF0aGhlbHBlci5ob21lKCksICdnbycsICdiaW4nLCAnZ29pbXBvcnRzJykpXG5cbiAgICAgIGxldCByb290ID0gcGF0aC5zZXBcbiAgICAgIGxldCBub25leGlzdGVudEtleSA9ICckTk9ORVhJU1RFTlQnXG4gICAgICBpZiAob3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJykge1xuICAgICAgICByb290ID0gJ2M6JyArIHBhdGguc2VwXG4gICAgICAgIG5vbmV4aXN0ZW50S2V5ID0gJyVOT05FWElTVEVOVCUnXG4gICAgICB9XG4gICAgICByZXN1bHQgPSBwYXRoaGVscGVyLmV4cGFuZChlbnYsIHBhdGguam9pbihyb290LCBub25leGlzdGVudEtleSwgJ2dvJywgJy4uJywgJ2JpbicsICdnb2ltcG9ydHMnKSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShwYXRoLmpvaW4ocm9vdCwgbm9uZXhpc3RlbnRLZXksICdiaW4nLCAnZ29pbXBvcnRzJykpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB3b3JraW5nIHdpdGggYSBtdWx0aS1pdGVtIHBhdGgnLCAoKSA9PiB7XG4gICAgaXQoJ2V4cGFuZHMgdGhlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBsZXQgZW52ID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpXG4gICAgICBlbnYuR09QQVRIID0gJ34nICsgcGF0aC5zZXAgKyAnZ28nICsgcGF0aC5kZWxpbWl0ZXIgKyAnficgKyBwYXRoLnNlcCArICdvdGhlcmdvJ1xuXG4gICAgICBsZXQgcmVzdWx0ID0gcGF0aGhlbHBlci5leHBhbmQoZW52LCBwYXRoLmpvaW4oJ34nLCAnZ28nLCAnZ28nLCAnLi4nLCAnYmluJywgJ2dvaW1wb3J0cycpKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKHBhdGguam9pbihwYXRoaGVscGVyLmhvbWUoKSwgJ2dvJywgJ2JpbicsICdnb2ltcG9ydHMnKSlcblxuICAgICAgcmVzdWx0ID0gcGF0aGhlbHBlci5leHBhbmQoZW52LCBwYXRoLmpvaW4oZ29wYXRoVG9rZW4sICdnbycsICcuLicsICdiaW4nLCAnZ29pbXBvcnRzJykpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUocGF0aC5qb2luKHBhdGhoZWxwZXIuaG9tZSgpLCAnZ28nLCAnYmluJywgJ2dvaW1wb3J0cycpKVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/go-config/spec/pathhelper-spec.js
