(function() {
  var $, TabView, View, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = TabView = (function(_super) {
    __extends(TabView, _super);

    function TabView() {
      return TabView.__super__.constructor.apply(this, arguments);
    }

    TabView.content = function() {
      return this.li({
        "class": 'tab sortable'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'title',
            outlet: 'title'
          });
          return _this.div({
            "class": 'close-icon'
          });
        };
      })(this));
    };

    TabView.prototype.initialize = function(item, pane) {
      var _base, _base1, _base2;
      this.item = item;
      this.pane = pane;
      if (typeof (_base = this.item).on === "function") {
        _base.on('title-changed', (function(_this) {
          return function() {
            _this.updateTitle();
            _this.updateTooltip();
            return _this.updateDataAttributes();
          };
        })(this));
      }
      if (typeof (_base1 = this.item).on === "function") {
        _base1.on('icon-changed', (function(_this) {
          return function() {
            return _this.updateIcon();
          };
        })(this));
      }
      if (typeof (_base2 = this.item).on === "function") {
        _base2.on('modified-status-changed', (function(_this) {
          return function() {
            return _this.updateModifiedStatus();
          };
        })(this));
      }
      this.subscribe(atom.config.observe('tabs.showIcons', (function(_this) {
        return function() {
          return _this.updateIconVisibility();
        };
      })(this)));
      this.updateTitle();
      this.updateIcon();
      this.updateModifiedStatus();
      this.updateTooltip();
      return this.updateDataAttributes();
    };

    TabView.prototype.updateTooltip = function() {
      var itemPath, _base;
      this.destroyTooltip();
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        return this.setTooltip({
          title: _.escape(itemPath),
          delay: {
            show: 2000,
            hide: 100
          },
          placement: 'bottom'
        });
      }
    };

    TabView.prototype.beforeRemove = function() {
      return this.destroyTooltip();
    };

    TabView.prototype.updateTitle = function() {
      var tab, title, useLongTitle, _base, _i, _len, _ref1, _ref2;
      if (this.updatingTitle) {
        return;
      }
      this.updatingTitle = true;
      title = this.item.getTitle();
      useLongTitle = false;
      _ref1 = this.getSiblingTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (tab.item.getTitle() === title) {
          tab.updateTitle();
          useLongTitle = true;
        }
      }
      if (useLongTitle) {
        title = (_ref2 = typeof (_base = this.item).getLongTitle === "function" ? _base.getLongTitle() : void 0) != null ? _ref2 : title;
      }
      this.title.text(title);
      return this.updatingTitle = false;
    };

    TabView.prototype.updateDataAttributes = function() {
      var itemPath, name;
      if (this.updatingDataAttributes) {
        return;
      }
      this.updatingDataAttributes = true;
      if (this.item.getPath != null) {
        itemPath = this.item.getPath();
        name = path.basename(itemPath);
        this.title.attr('data-path', itemPath);
        this.title.attr('data-name', name);
      }
      return this.updatingDataAttributes = false;
    };

    TabView.prototype.updateIcon = function() {
      var _base;
      if (this.iconName) {
        this.title.removeClass("icon icon-" + this.iconName);
      }
      if (this.iconName = typeof (_base = this.item).getIconName === "function" ? _base.getIconName() : void 0) {
        return this.title.addClass("icon icon-" + this.iconName);
      }
    };

    TabView.prototype.getSiblingTabs = function() {
      return this.siblings('.tab').views();
    };

    TabView.prototype.updateIconVisibility = function() {
      if (atom.config.get("tabs.showIcons")) {
        return this.title.removeClass("hide-icon");
      } else {
        return this.title.addClass("hide-icon");
      }
    };

    TabView.prototype.updateModifiedStatus = function() {
      var _base;
      if (typeof (_base = this.item).isModified === "function" ? _base.isModified() : void 0) {
        if (!this.isModified) {
          this.addClass('modified');
        }
        return this.isModified = true;
      } else {
        if (this.isModified) {
          this.removeClass('modified');
        }
        return this.isModified = false;
      }
    };

    return TabView;

  })(View);

}).call(this);
