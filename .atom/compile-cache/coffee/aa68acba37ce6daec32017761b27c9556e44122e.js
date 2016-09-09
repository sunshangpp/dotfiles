(function() {
  var $, SublimeTabBarView, SublimeTabView, TabBarView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = require('atom').$;

  TabBarView = require('./tabs/tab-bar-view');

  SublimeTabView = require('./sublime-tab-view');

  module.exports = SublimeTabBarView = (function(_super) {
    __extends(SublimeTabBarView, _super);

    function SublimeTabBarView() {
      return SublimeTabBarView.__super__.constructor.apply(this, arguments);
    }

    SublimeTabBarView.prototype.initialize = function(pane) {
      this.pane = pane;
      this.considerTemp = false;
      SublimeTabBarView.__super__.initialize.call(this, this.pane);
      if (this.openPermanent == null) {
        this.openPermanent = [];
      }
      this.subscribe($(window), 'window:open-path', (function(_this) {
        return function(event, _arg) {
          var path, pathToOpen, _ref, _ref1;
          pathToOpen = _arg.pathToOpen;
          path = (_ref = (_ref1 = atom.project) != null ? _ref1.relativize(pathToOpen) : void 0) != null ? _ref : pathToOpen;
          if (__indexOf.call(_this.openPermanent, pathToOpen) < 0) {
            return _this.openPermanent.push(pathToOpen);
          }
        };
      })(this));
      this.subscribe(atom.workspaceView, 'core:save', function() {
        var tab;
        tab = atom.workspaceView.find('.tab.active');
        if (tab.is('.temp')) {
          return tab.removeClass('temp');
        }
      });
      this.considerTemp = true;
      return this.on('dblclick', '.tab', function(_arg) {
        var tab, target;
        target = _arg.target;
        tab = $(target).closest('.tab').view();
        if (tab.is('.temp')) {
          tab.removeClass('temp');
        }
        return false;
      });
    };

    SublimeTabBarView.prototype.addTabForItem = function(item, index) {
      var tab, tabView, _i, _len, _ref;
      _ref = this.getTabs();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tab = _ref[_i];
        if (tab.is('.temp')) {
          this.closeTab(tab);
        }
      }
      tabView = new SublimeTabView(item, this.pane, this.openPermanent, this.considerTemp);
      this.insertTabAtIndex(tabView, index);
      return this.updateActiveTab();
    };

    return SublimeTabBarView;

  })(TabBarView);

}).call(this);
