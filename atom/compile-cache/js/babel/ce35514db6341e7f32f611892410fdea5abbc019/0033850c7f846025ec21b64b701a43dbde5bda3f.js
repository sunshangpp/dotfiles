'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  dependenciesInstalled: null,

  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('go-plus').then(function () {
      _this.dependenciesInstalled = true;
      return _this.dependenciesInstalled;
    })['catch'](function (e) {
      console.log(e);
    });
  },

  deactivate: function deactivate() {
    this.dependenciesInstalled = null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7OztxQkFFSTtBQUNiLHVCQUFxQixFQUFFLElBQUk7O0FBRTNCLFVBQVEsRUFBQyxvQkFBRzs7O0FBQ1YsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3pELFlBQUsscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0FBQ2pDLGFBQU8sTUFBSyxxQkFBcUIsQ0FBQTtLQUNsQyxDQUFDLFNBQU0sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNkLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDZixDQUFDLENBQUE7R0FDSDs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO0dBQ2xDO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGVwZW5kZW5jaWVzSW5zdGFsbGVkOiBudWxsLFxuXG4gIGFjdGl2YXRlICgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2dvLXBsdXMnKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXMuZGVwZW5kZW5jaWVzSW5zdGFsbGVkXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmRlcGVuZGVuY2llc0luc3RhbGxlZCA9IG51bGxcbiAgfVxufVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/main.js
