(function() {
  var Go, fs, os, path, _;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  _ = require('underscore-plus');

  module.exports = Go = (function() {
    Go.prototype.name = '';

    Go.prototype.os = '';

    Go.prototype.exe = '';

    Go.prototype.arch = '';

    Go.prototype.version = '';

    Go.prototype.gopath = '';

    Go.prototype.goroot = '';

    Go.prototype.gotooldir = '';

    Go.prototype.env = false;

    function Go(executable, pathexpander, options) {
      this.executable = executable;
      this.pathexpander = pathexpander;
      if ((options != null ? options.name : void 0) != null) {
        this.name = options.name;
      }
      if ((options != null ? options.os : void 0) != null) {
        this.os = options.os;
      }
      if ((options != null ? options.exe : void 0) != null) {
        this.exe = options.exe;
      }
      if ((options != null ? options.arch : void 0) != null) {
        this.arch = options.arch;
      }
      if ((options != null ? options.version : void 0) != null) {
        this.version = options.version;
      }
      if ((options != null ? options.gopath : void 0) != null) {
        this.gopath = options.gopath;
      }
      if ((options != null ? options.goroot : void 0) != null) {
        this.goroot = options.goroot;
      }
      if ((options != null ? options.gotooldir : void 0) != null) {
        this.gotooldir = options.gotooldir;
      }
    }

    Go.prototype.description = function() {
      return this.name + ' (@ ' + this.goroot + ')';
    };

    Go.prototype.go = function() {
      if (!((this.executable != null) && this.executable !== '')) {
        return false;
      }
      if (!fs.existsSync(this.executable)) {
        return false;
      }
      return fs.realpathSync(this.executable);
    };

    Go.prototype.buildgopath = function() {
      var environmentOverridesConfig, gopathConfig, result;
      result = '';
      gopathConfig = atom.config.get('go-plus.goPath');
      environmentOverridesConfig = (atom.config.get('go-plus.environmentOverridesConfiguration') != null) && atom.config.get('go-plus.environmentOverridesConfiguration');
      if ((this.env.GOPATH != null) && this.env.GOPATH !== '') {
        result = this.env.GOPATH;
      }
      if ((this.gopath != null) && this.gopath !== '') {
        result = this.gopath;
      }
      if (!environmentOverridesConfig && (gopathConfig != null) && gopathConfig.trim() !== '') {
        result = gopathConfig;
      }
      if (result === '' && (gopathConfig != null) && gopathConfig.trim() !== '') {
        result = gopathConfig;
      }
      result = result.replace('\n', '').replace('\r', '');
      return this.pathexpander.expand(result, '');
    };

    Go.prototype.splitgopath = function() {
      var result;
      result = this.buildgopath();
      if (!((result != null) && result !== '')) {
        return [];
      }
      return result.split(path.delimiter);
    };

    Go.prototype.gofmt = function() {
      return this.gorootBinOrPathItem('gofmt');
    };

    Go.prototype.format = function() {
      switch (atom.config.get('go-plus.formatTool')) {
        case 'goimports':
          return this.goimports();
        case 'goreturns':
          return this.goreturns();
        default:
          return this.gofmt();
      }
    };

    Go.prototype.vet = function() {
      return this.goTooldirOrGopathBinOrPathItem('vet');
    };

    Go.prototype.cover = function() {
      return this.goTooldirOrGopathBinOrPathItem('cover');
    };

    Go.prototype.goimports = function() {
      return this.gopathBinOrPathItem('goimports');
    };

    Go.prototype.goreturns = function() {
      return this.gopathBinOrPathItem('goreturns');
    };

    Go.prototype.golint = function() {
      return this.gopathBinOrPathItem('golint');
    };

    Go.prototype.gocode = function() {
      return this.gopathBinOrPathItem('gocode');
    };

    Go.prototype.godef = function() {
      return this.goTooldirOrGopathBinOrPathItem('godef');
    };

    Go.prototype.oracle = function() {
      return this.gopathBinOrPathItem('oracle');
    };

    Go.prototype.git = function() {
      return this.pathItem('git');
    };

    Go.prototype.goTooldirOrGopathBinOrPathItem = function(name) {
      var result;
      result = this.goTooldirItem(name);
      if (!((result != null) && result)) {
        result = this.gopathBinOrPathItem(name);
      }
      return result;
    };

    Go.prototype.gopathBinOrPathItem = function(name) {
      var result;
      result = this.gopathBinItem(name);
      if (!((result != null) && result)) {
        result = this.pathItem(name);
      }
      return result;
    };

    Go.prototype.gopathBinItem = function(name) {
      var gopaths, item, result, _i, _len;
      if (!((name != null) && name !== '')) {
        return false;
      }
      gopaths = this.splitgopath();
      for (_i = 0, _len = gopaths.length; _i < _len; _i++) {
        item = gopaths[_i];
        result = path.resolve(path.normalize(path.join(item, 'bin', name + this.exe)));
        if (fs.existsSync(result)) {
          return fs.realpathSync(result);
        }
      }
      return false;
    };

    Go.prototype.pathItem = function(name) {
      var element, elements, p, pathresult, target, _i, _len;
      if (!((name != null) && name !== '')) {
        return false;
      }
      pathresult = false;
      p = os.platform() === 'win32' ? this.env.Path : this.env.PATH;
      if (p != null) {
        elements = p.split(path.delimiter);
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          target = path.resolve(path.normalize(path.join(element, name + this.exe)));
          if (fs.existsSync(target)) {
            pathresult = fs.realpathSync(target);
          }
        }
      }
      return pathresult;
    };

    Go.prototype.gorootBinOrPathItem = function(name) {
      var result;
      if (!((name != null) && name !== '')) {
        return false;
      }
      result = this.gorootBinItem(name);
      if (!((result != null) && result)) {
        result = this.pathItem(name);
      }
      return result;
    };

    Go.prototype.gorootBinItem = function(name) {
      var result;
      if (!((name != null) && name !== '')) {
        return false;
      }
      if (!((this.goroot != null) && this.goroot !== '')) {
        return false;
      }
      result = path.join(this.goroot, 'bin', name + this.exe);
      if (!fs.existsSync(result)) {
        return false;
      }
      return fs.realpathSync(result);
    };

    Go.prototype.goTooldirItem = function(name) {
      var result;
      if (!((name != null) && name !== '')) {
        return false;
      }
      result = path.join(this.gotooldir, name + this.exe);
      if (fs.existsSync(result)) {
        return fs.realpathSync(result);
      }
      return false;
    };

    Go.prototype.toolsAreMissing = function() {
      if (this.format() === false) {
        return true;
      }
      if (this.golint() === false) {
        return true;
      }
      if (this.vet() === false) {
        return true;
      }
      if (this.cover() === false) {
        return true;
      }
      if (this.gocode() === false) {
        return true;
      }
      if (this.oracle() === false) {
        return true;
      }
      if (this.git() === false) {
        return true;
      }
      if (this.godef() === false) {
        return true;
      }
      return false;
    };

    return Go;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ28uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUJBQUEsSUFBQSxHQUFNLEVBQU4sQ0FBQTs7QUFBQSxpQkFDQSxFQUFBLEdBQUksRUFESixDQUFBOztBQUFBLGlCQUVBLEdBQUEsR0FBSyxFQUZMLENBQUE7O0FBQUEsaUJBR0EsSUFBQSxHQUFNLEVBSE4sQ0FBQTs7QUFBQSxpQkFJQSxPQUFBLEdBQVMsRUFKVCxDQUFBOztBQUFBLGlCQUtBLE1BQUEsR0FBUSxFQUxSLENBQUE7O0FBQUEsaUJBTUEsTUFBQSxHQUFRLEVBTlIsQ0FBQTs7QUFBQSxpQkFPQSxTQUFBLEdBQVcsRUFQWCxDQUFBOztBQUFBLGlCQVFBLEdBQUEsR0FBSyxLQVJMLENBQUE7O0FBVWEsSUFBQSxZQUFFLFVBQUYsRUFBZSxZQUFmLEVBQTZCLE9BQTdCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxlQUFBLFlBQzFCLENBQUE7QUFBQSxNQUFBLElBQXdCLGlEQUF4QjtBQUFBLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUMsSUFBaEIsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFvQiwrQ0FBcEI7QUFBQSxRQUFBLElBQUMsQ0FBQSxFQUFELEdBQU0sT0FBTyxDQUFDLEVBQWQsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFzQixnREFBdEI7QUFBQSxRQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sT0FBTyxDQUFDLEdBQWYsQ0FBQTtPQUZBO0FBR0EsTUFBQSxJQUF3QixpREFBeEI7QUFBQSxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBTyxDQUFDLElBQWhCLENBQUE7T0FIQTtBQUlBLE1BQUEsSUFBOEIsb0RBQTlCO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQU8sQ0FBQyxPQUFuQixDQUFBO09BSkE7QUFLQSxNQUFBLElBQTRCLG1EQUE1QjtBQUFBLFFBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQUFPLENBQUMsTUFBbEIsQ0FBQTtPQUxBO0FBTUEsTUFBQSxJQUE0QixtREFBNUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsT0FBTyxDQUFDLE1BQWxCLENBQUE7T0FOQTtBQU9BLE1BQUEsSUFBa0Msc0RBQWxDO0FBQUEsUUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLE9BQU8sQ0FBQyxTQUFyQixDQUFBO09BUlc7SUFBQSxDQVZiOztBQUFBLGlCQW9CQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsYUFBTyxJQUFDLENBQUEsSUFBRCxHQUFRLE1BQVIsR0FBaUIsSUFBQyxDQUFBLE1BQWxCLEdBQTJCLEdBQWxDLENBRFc7SUFBQSxDQXBCYixDQUFBOztBQUFBLGlCQXVCQSxFQUFBLEdBQUksU0FBQSxHQUFBO0FBQ0YsTUFBQSxJQUFBLENBQUEsQ0FBb0IseUJBQUEsSUFBaUIsSUFBQyxDQUFBLFVBQUQsS0FBaUIsRUFBdEQsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxFQUFzQixDQUFDLFVBQUgsQ0FBYyxJQUFDLENBQUEsVUFBZixDQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFFQSxhQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQUMsQ0FBQSxVQUFqQixDQUFQLENBSEU7SUFBQSxDQXZCSixDQUFBOztBQUFBLGlCQTRCQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSxnREFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FEZixDQUFBO0FBQUEsTUFFQSwwQkFBQSxHQUE2QixzRUFBQSxJQUFrRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkNBQWhCLENBRi9GLENBQUE7QUFHQSxNQUFBLElBQXdCLHlCQUFBLElBQWlCLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxLQUFpQixFQUExRDtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBZCxDQUFBO09BSEE7QUFJQSxNQUFBLElBQW9CLHFCQUFBLElBQWEsSUFBQyxDQUFBLE1BQUQsS0FBYSxFQUE5QztBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFWLENBQUE7T0FKQTtBQUtBLE1BQUEsSUFBeUIsQ0FBQSwwQkFBQSxJQUFtQyxzQkFBbkMsSUFBcUQsWUFBWSxDQUFDLElBQWIsQ0FBQSxDQUFBLEtBQXlCLEVBQXZHO0FBQUEsUUFBQSxNQUFBLEdBQVMsWUFBVCxDQUFBO09BTEE7QUFNQSxNQUFBLElBQXlCLE1BQUEsS0FBVSxFQUFWLElBQWlCLHNCQUFqQixJQUFtQyxZQUFZLENBQUMsSUFBYixDQUFBLENBQUEsS0FBeUIsRUFBckY7QUFBQSxRQUFBLE1BQUEsR0FBUyxZQUFULENBQUE7T0FOQTtBQUFBLE1BT0EsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUFxQixFQUFyQixDQUF3QixDQUFDLE9BQXpCLENBQWlDLElBQWpDLEVBQXVDLEVBQXZDLENBUFQsQ0FBQTtBQVFBLGFBQU8sSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLE1BQXJCLEVBQTZCLEVBQTdCLENBQVAsQ0FUVztJQUFBLENBNUJiLENBQUE7O0FBQUEsaUJBdUNBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLENBQWlCLGdCQUFBLElBQVksTUFBQSxLQUFZLEVBQXpDLENBQUE7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQURBO0FBRUEsYUFBTyxNQUFNLENBQUMsS0FBUCxDQUFhLElBQUksQ0FBQyxTQUFsQixDQUFQLENBSFc7SUFBQSxDQXZDYixDQUFBOztBQUFBLGlCQTRDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsYUFBTyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsT0FBckIsQ0FBUCxDQURLO0lBQUEsQ0E1Q1AsQ0FBQTs7QUFBQSxpQkErQ0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLGNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9CQUFoQixDQUFQO0FBQUEsYUFDTyxXQURQO0FBQ3dCLGlCQUFPLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBUCxDQUR4QjtBQUFBLGFBRU8sV0FGUDtBQUV3QixpQkFBTyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVAsQ0FGeEI7QUFBQTtBQUdPLGlCQUFPLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUCxDQUhQO0FBQUEsT0FETTtJQUFBLENBL0NSLENBQUE7O0FBQUEsaUJBMkRBLEdBQUEsR0FBSyxTQUFBLEdBQUE7QUFDSCxhQUFPLElBQUMsQ0FBQSw4QkFBRCxDQUFnQyxLQUFoQyxDQUFQLENBREc7SUFBQSxDQTNETCxDQUFBOztBQUFBLGlCQThEQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsYUFBTyxJQUFDLENBQUEsOEJBQUQsQ0FBZ0MsT0FBaEMsQ0FBUCxDQURLO0lBQUEsQ0E5RFAsQ0FBQTs7QUFBQSxpQkFpRUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULGFBQU8sSUFBQyxDQUFBLG1CQUFELENBQXFCLFdBQXJCLENBQVAsQ0FEUztJQUFBLENBakVYLENBQUE7O0FBQUEsaUJBb0VBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxhQUFPLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixXQUFyQixDQUFQLENBRFM7SUFBQSxDQXBFWCxDQUFBOztBQUFBLGlCQXVFQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sYUFBTyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsUUFBckIsQ0FBUCxDQURNO0lBQUEsQ0F2RVIsQ0FBQTs7QUFBQSxpQkEwRUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLGFBQU8sSUFBQyxDQUFBLG1CQUFELENBQXFCLFFBQXJCLENBQVAsQ0FETTtJQUFBLENBMUVSLENBQUE7O0FBQUEsaUJBNkVBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxhQUFPLElBQUMsQ0FBQSw4QkFBRCxDQUFnQyxPQUFoQyxDQUFQLENBREs7SUFBQSxDQTdFUCxDQUFBOztBQUFBLGlCQWdGQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sYUFBTyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsUUFBckIsQ0FBUCxDQURNO0lBQUEsQ0FoRlIsQ0FBQTs7QUFBQSxpQkFtRkEsR0FBQSxHQUFLLFNBQUEsR0FBQTtBQUNILGFBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLENBQVAsQ0FERztJQUFBLENBbkZMLENBQUE7O0FBQUEsaUJBc0ZBLDhCQUFBLEdBQWdDLFNBQUMsSUFBRCxHQUFBO0FBQzlCLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixDQUFULENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUEyQyxnQkFBQSxJQUFZLE1BQXZELENBQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBckIsQ0FBVCxDQUFBO09BREE7QUFFQSxhQUFPLE1BQVAsQ0FIOEI7SUFBQSxDQXRGaEMsQ0FBQTs7QUFBQSxpQkEyRkEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7QUFDbkIsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLENBQWdDLGdCQUFBLElBQVksTUFBNUMsQ0FBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixDQUFULENBQUE7T0FEQTtBQUVBLGFBQU8sTUFBUCxDQUhtQjtJQUFBLENBM0ZyQixDQUFBOztBQUFBLGlCQWdHQSxhQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDYixVQUFBLCtCQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBb0IsY0FBQSxJQUFVLElBQUEsS0FBVSxFQUF4QyxDQUFBO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FEVixDQUFBO0FBRUEsV0FBQSw4Q0FBQTsyQkFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsSUFBQSxHQUFPLElBQUMsQ0FBQSxHQUEvQixDQUFmLENBQWIsQ0FBVCxDQUFBO0FBQ0EsUUFBQSxJQUFrQyxFQUFFLENBQUMsVUFBSCxDQUFjLE1BQWQsQ0FBbEM7QUFBQSxpQkFBTyxFQUFFLENBQUMsWUFBSCxDQUFnQixNQUFoQixDQUFQLENBQUE7U0FGRjtBQUFBLE9BRkE7QUFLQSxhQUFPLEtBQVAsQ0FOYTtJQUFBLENBaEdmLENBQUE7O0FBQUEsaUJBd0dBLFFBQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFVBQUEsa0RBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFvQixjQUFBLElBQVUsSUFBQSxLQUFVLEVBQXhDLENBQUE7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWEsS0FEYixDQUFBO0FBQUEsTUFHQSxDQUFBLEdBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFBLEtBQWlCLE9BQXBCLEdBQWlDLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBdEMsR0FBZ0QsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUh6RCxDQUFBO0FBSUEsTUFBQSxJQUFHLFNBQUg7QUFDRSxRQUFBLFFBQUEsR0FBVyxDQUFDLENBQUMsS0FBRixDQUFRLElBQUksQ0FBQyxTQUFiLENBQVgsQ0FBQTtBQUNBLGFBQUEsK0NBQUE7aUNBQUE7QUFDRSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQUEsR0FBTyxJQUFDLENBQUEsR0FBM0IsQ0FBZixDQUFiLENBQVQsQ0FBQTtBQUNBLFVBQUEsSUFBd0MsRUFBRSxDQUFDLFVBQUgsQ0FBYyxNQUFkLENBQXhDO0FBQUEsWUFBQSxVQUFBLEdBQWEsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsTUFBaEIsQ0FBYixDQUFBO1dBRkY7QUFBQSxTQUZGO09BSkE7QUFVQSxhQUFPLFVBQVAsQ0FYUTtJQUFBLENBeEdWLENBQUE7O0FBQUEsaUJBcUhBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxHQUFBO0FBQ25CLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQW9CLGNBQUEsSUFBVSxJQUFBLEtBQVUsRUFBeEMsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsQ0FEVCxDQUFBO0FBRUEsTUFBQSxJQUFBLENBQUEsQ0FBZ0MsZ0JBQUEsSUFBWSxNQUE1QyxDQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLENBQVQsQ0FBQTtPQUZBO0FBR0EsYUFBTyxNQUFQLENBSm1CO0lBQUEsQ0FySHJCLENBQUE7O0FBQUEsaUJBMkhBLGFBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtBQUNiLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQW9CLGNBQUEsSUFBVSxJQUFBLEtBQVUsRUFBeEMsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFvQixxQkFBQSxJQUFhLElBQUMsQ0FBQSxNQUFELEtBQWEsRUFBOUMsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFBQSxNQUVBLE1BQUEsR0FBUyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxNQUFYLEVBQW1CLEtBQW5CLEVBQTBCLElBQUEsR0FBTyxJQUFDLENBQUEsR0FBbEMsQ0FGVCxDQUFBO0FBR0EsTUFBQSxJQUFBLENBQUEsRUFBc0IsQ0FBQyxVQUFILENBQWMsTUFBZCxDQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BSEE7QUFJQSxhQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLE1BQWhCLENBQVAsQ0FMYTtJQUFBLENBM0hmLENBQUE7O0FBQUEsaUJBa0lBLGFBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtBQUNiLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQW9CLGNBQUEsSUFBVSxJQUFBLEtBQVUsRUFBeEMsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxTQUFYLEVBQXNCLElBQUEsR0FBTyxJQUFDLENBQUEsR0FBOUIsQ0FEVCxDQUFBO0FBRUEsTUFBQSxJQUFrQyxFQUFFLENBQUMsVUFBSCxDQUFjLE1BQWQsQ0FBbEM7QUFBQSxlQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLE1BQWhCLENBQVAsQ0FBQTtPQUZBO0FBR0EsYUFBTyxLQUFQLENBSmE7SUFBQSxDQWxJZixDQUFBOztBQUFBLGlCQXdJQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsS0FBYSxLQUE1QjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEtBQWEsS0FBNUI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFlLElBQUMsQ0FBQSxHQUFELENBQUEsQ0FBQSxLQUFVLEtBQXpCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FGQTtBQUdBLE1BQUEsSUFBZSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUEsS0FBWSxLQUEzQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BSEE7QUFJQSxNQUFBLElBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEtBQWEsS0FBNUI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxLQUFhLEtBQTVCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FMQTtBQU1BLE1BQUEsSUFBZSxJQUFDLENBQUEsR0FBRCxDQUFBLENBQUEsS0FBVSxLQUF6QjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BTkE7QUFPQSxNQUFBLElBQWUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLEtBQVksS0FBM0I7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQVBBO0FBUUEsYUFBTyxLQUFQLENBVGU7SUFBQSxDQXhJakIsQ0FBQTs7Y0FBQTs7TUFQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/go.coffee
