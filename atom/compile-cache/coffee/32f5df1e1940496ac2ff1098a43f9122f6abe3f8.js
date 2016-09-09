(function() {
  var SublimeTabBarView, path, _;

  _ = require('underscore-plus');

  path = require('path');

  SublimeTabBarView = require('./sublime-tab-bar-view');

  module.exports = {
    configDefaults: {
      showIcons: true,
      hideVcsIgnoredFiles: false,
      hideIgnoredNames: false,
      showOnRightSide: false,
      sortFoldersBeforeFiles: true
    },
    treeView: null,
    activate: function(state) {
      var _base;
      this.state = state;
      this.forceSettings();
      this.disableStockPackages();
      this.paneSubscription = atom.workspaceView.eachPaneView((function(_this) {
        return function(paneView) {
          var onPaneViewRemoved, tabBarView;
          tabBarView = new SublimeTabBarView(paneView);
          if (_this.tabBarViews == null) {
            _this.tabBarViews = [];
          }
          _this.tabBarViews.push(tabBarView);
          onPaneViewRemoved = function(event, removedPaneView) {
            if (paneView !== removedPaneView) {
              return;
            }
            _.remove(_this.tabBarViews, tabBarView);
            return atom.workspaceView.off('pane:removed', onPaneViewRemoved);
          };
          atom.workspaceView.on('pane:removed', onPaneViewRemoved);
          return tabBarView;
        };
      })(this));
      if (this.shouldAttach()) {
        if ((_base = this.state).attached == null) {
          _base.attached = true;
        }
      }
      if (this.state.attached) {
        this.createView();
      }
      atom.workspaceView.command('tree-view:show', (function(_this) {
        return function() {
          return _this.createView().show();
        };
      })(this));
      atom.workspaceView.command('tree-view:toggle', (function(_this) {
        return function() {
          return _this.createView().toggle();
        };
      })(this));
      atom.workspaceView.command('tree-view:toggle-focus', (function(_this) {
        return function() {
          return _this.createView().toggleFocus();
        };
      })(this));
      atom.workspaceView.command('tree-view:reveal-active-file', (function(_this) {
        return function() {
          return _this.createView().revealActiveFile();
        };
      })(this));
      atom.workspaceView.command('tree-view:toggle-side', (function(_this) {
        return function() {
          return _this.createView().toggleSide();
        };
      })(this));
      atom.workspaceView.command('tree-view:add-file', (function(_this) {
        return function() {
          return _this.createView().add(true);
        };
      })(this));
      atom.workspaceView.command('tree-view:add-folder', (function(_this) {
        return function() {
          return _this.createView().add(false);
        };
      })(this));
      atom.workspaceView.command('tree-view:duplicate', (function(_this) {
        return function() {
          return _this.createView().copySelectedEntry();
        };
      })(this));
      return atom.workspaceView.command('tree-view:remove', (function(_this) {
        return function() {
          return _this.createView().removeSelectedEntries();
        };
      })(this));
    },
    serialize: function() {
      if (this.treeView != null) {
        return this.treeView.serialize();
      } else {
        return this.state;
      }
    },
    deactivate: function() {
      var tabBarView, _i, _len, _ref, _ref1, _ref2, _ref3, _results;
      if ((_ref = this.treeView) != null) {
        _ref.deactivate();
      }
      this.treeView = null;
      if ((_ref1 = this.paneSubscription) != null) {
        _ref1.off();
      }
      _ref3 = (_ref2 = this.tabBarViews) != null ? _ref2 : [];
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        tabBarView = _ref3[_i];
        _results.push(tabBarView.remove());
      }
      return _results;
    },
    createView: function() {
      var SublimeTreeView;
      if (this.treeView == null) {
        SublimeTreeView = require('./sublime-tree-view');
        this.treeView = new SublimeTreeView(this.state);
      }
      return this.treeView;
    },
    shouldAttach: function() {
      if (atom.workspace.getActivePaneItem()) {
        return false;
      } else if (path.basename(atom.project.getPath()) === '.git') {
        return atom.project.getPath() === atom.getLoadSettings().pathToOpen;
      } else {
        return true;
      }
    },
    forceSettings: function() {
      this.forceSettingKey('tabs', 'showIcons');
      atom.config.observe('sublime-tabs.' + 'showIcons', (function(_this) {
        return function() {
          return _this.forceSettingKey('tabs', 'showIcons');
        };
      })(this));
      this.forceSettingKey('tree-view', 'hideVcsIgnoredFiles');
      atom.config.observe('sublime-tabs.' + 'hideVcsIgnoredFiles', (function(_this) {
        return function() {
          return _this.forceSettingKey('tree-view', 'hideVcsIgnoredFiles');
        };
      })(this));
      this.forceSettingKey('tree-view', 'hideIgnoredNames');
      atom.config.observe('sublime-tabs.' + 'hideIgnoredNames', (function(_this) {
        return function() {
          return _this.forceSettingKey('tree-view', 'hideIgnoredNames');
        };
      })(this));
      this.forceSettingKey('tree-view', 'showOnRightSide');
      atom.config.observe('sublime-tabs.' + 'showOnRightSide', (function(_this) {
        return function() {
          return _this.forceSettingKey('tree-view', 'showOnRightSide');
        };
      })(this));
      this.forceSettingKey('tree-view', 'sortFoldersBeforeFiles');
      return atom.config.observe('sublime-tabs.' + 'sortFoldersBeforeFiles', (function(_this) {
        return function() {
          return _this.forceSettingKey('tree-view', 'sortFoldersBeforeFiles');
        };
      })(this));
    },
    forceSettingKey: function(masterKey, key) {
      var value;
      value = atom.config.get('sublime-tabs.' + ("" + key));
      if (value == null) {
        value = atom.config.getDefault('sublime-tabs.' + ("" + key));
      }
      return atom.config.set(masterKey + '.' + key, atom.config.get('sublime-tabs.' + ("" + key)));
    },
    disableStockPackages: function() {
      if (atom.packages.isPackageLoaded('tabs')) {
        atom.packages.disablePackage('tabs');
        atom.packages.deactivatePackage('tabs');
        setTimeout(function() {
          return atom.packages.deactivatePackage('tabs');
        }, 2000);
      }
      if (atom.packages.isPackageLoaded('tree-view')) {
        atom.packages.disablePackage('tree-view');
        atom.packages.deactivatePackage('tree-view');
        return setTimeout(function() {
          return atom.packages.deactivatePackage('tree-view');
        }, 2000);
      }
    }
  };

}).call(this);
