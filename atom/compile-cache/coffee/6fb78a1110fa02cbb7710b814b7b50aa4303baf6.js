(function() {
  var $, SublimeTabView, TabView, path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  path = require('path');

  $ = require('atom').$;

  TabView = require('./tabs/tab-view');

  module.exports = SublimeTabView = (function(_super) {
    __extends(SublimeTabView, _super);

    function SublimeTabView() {
      return SublimeTabView.__super__.constructor.apply(this, arguments);
    }

    SublimeTabView.prototype.initialize = function(item, pane, openPermanent, considerTemporary) {
      var _ref, _ref1;
      this.item = item;
      this.pane = pane;
      if (openPermanent == null) {
        openPermanent = [];
      }
      SublimeTabView.__super__.initialize.call(this, this.item, this.pane);
      if (!considerTemporary) {
        return;
      }
      if ((_ref = this.item.constructor.name) === 'Editor' || _ref === 'ImageEditor' || _ref === 'TextEditor') {
        if (_ref1 = this.item.getPath(), __indexOf.call(openPermanent, _ref1) >= 0) {
          _.remove(openPermanent, this.item.getPath());
        } else {
          this.addClass('temp');
        }
      }
      return atom.workspaceView.command('sublime-tabs:keep-tab', (function(_this) {
        return function() {
          return _this.keepTab();
        };
      })(this));
    };

    SublimeTabView.prototype.updateModifiedStatus = function() {
      var _base;
      SublimeTabView.__super__.updateModifiedStatus.call(this);
      if (this.is('.temp') && (typeof (_base = this.item).isModified === "function" ? _base.isModified() : void 0)) {
        return this.removeClass('temp');
      }
    };

    SublimeTabView.prototype.keepTab = function() {
      if (this.is('.temp')) {
        return this.removeClass('temp');
      }
    };

    return SublimeTabView;

  })(TabView);

}).call(this);
