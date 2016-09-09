(function() {
  var $, SublimeTabBarView, SublimeTabView, View, WorkspaceView, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, WorkspaceView = _ref.WorkspaceView, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  SublimeTabBarView = require('../lib/sublime-tab-bar-view');

  SublimeTabView = require('../lib/sublime-tab-view');

  describe('SublimeTabs Initialization', function() {
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('tabs');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('tree-view');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('sublime-tabs');
      });
    });
    return it('should deactivate and disable the tabs and tree-view package', function() {
      expect(atom.packages.isPackageActive('tabs')).toBe(false);
      expect(atom.packages.isPackageActive('tree-view')).toBe(false);
      expect(atom.packages.isPackageDisabled('tabs')).toBe(true);
      return expect(atom.packages.isPackageDisabled('tree-view')).toBe(true);
    });
  });

  describe('Sublime Tabs Package', function() {
    return beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('sublime-tabs');
      });
    });
  });

  describe('SublimeTabBarView', function() {
    var TestView, editor1, item1, item2, pane, tabBar, _ref1;
    _ref1 = [], item1 = _ref1[0], item2 = _ref1[1], editor1 = _ref1[2], pane = _ref1[3], tabBar = _ref1[4];
    TestView = (function(_super) {
      __extends(TestView, _super);

      function TestView() {
        return TestView.__super__.constructor.apply(this, arguments);
      }

      TestView.deserialize = function(_arg) {
        var iconName, longTitle, title;
        title = _arg.title, longTitle = _arg.longTitle, iconName = _arg.iconName;
        return new TestView(title, longTitle, iconName);
      };

      TestView.content = function(title) {
        return this.div(title);
      };

      TestView.prototype.initialize = function(title, longTitle, iconName) {
        this.title = title;
        this.longTitle = longTitle;
        this.iconName = iconName;
      };

      TestView.prototype.getTitle = function() {
        return this.title;
      };

      TestView.prototype.getLongTitle = function() {
        return this.longTitle;
      };

      TestView.prototype.getIconName = function() {
        return this.iconName;
      };

      TestView.prototype.serialize = function() {
        return {
          deserializer: 'TestView',
          title: this.title,
          longTitle: this.longTitle,
          iconName: this.iconName
        };
      };

      return TestView;

    })(View);
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      atom.workspace = atom.workspaceView.model;
      atom.deserializers.add(TestView);
      item1 = new TestView('Item 1', void 0, 'squirrel');
      item2 = new TestView('Item 2');
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return runs(function() {
        editor1 = atom.workspace.getActiveEditor();
        pane = atom.workspaceView.getActivePaneView();
        pane.addItem(item1, 0);
        pane.addItem(item2, 2);
        pane.activateItem(item2);
        return tabBar = new SublimeTabBarView(pane);
      });
    });
    afterEach(function() {
      return atom.deserializers.remove(TestView);
    });
    return describe('Temporary Tabs', function() {
      describe('Opening a new tab', function() {
        it('adds a temp class when opening a file', function() {
          var editor2;
          editor2 = null;
          waitsForPromise(function() {
            return atom.project.open('sample.txt').then(function(o) {
              return editor2 = o;
            });
          });
          return runs(function() {
            pane.activateItem(editor2);
            return expect(tabBar.tabForItem(editor2)).toHaveClass('temp');
          });
        });
        describe('when there is an temp tab already', function() {
          it('will replace an existing temporary tab', function() {
            var editor2, editor3;
            editor2 = null;
            editor3 = null;
            waitsForPromise(function() {
              return atom.project.open('sample.txt').then(function(o) {
                editor2 = o;
                pane.activateItem(editor2);
                return atom.project.open('sample2.txt').then(function(o) {
                  editor3 = o;
                  return pane.activateItem(editor3);
                });
              });
            });
            return runs(function() {
              expect(editor2.isDestroyed()).toBe(true);
              expect(editor3.isDestroyed()).toBe(false);
              expect(tabBar.tabForItem(editor2)).not.toExist();
              return expect(tabBar.tabForItem(editor3)).toHaveClass('temp');
            });
          });
          return it('makes the tab permanent when dbl clicking the tab', function() {
            var editor2;
            editor2 = null;
            waitsForPromise(function() {
              return atom.project.open('sample.txt').then(function(o) {
                return editor2 = o;
              });
            });
            return runs(function() {
              pane.activateItem(editor2);
              tabBar.tabForItem(editor2).trigger('dblclick');
              return expect(tabBar.tabForItem(editor2)).not.toHaveClass('temp');
            });
          });
        });
        describe('when opening views that do not contain an editor', function() {
          var editor2, settingsView;
          editor2 = null;
          settingsView = null;
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.project.open('sample.txt').then(function(o) {
                editor2 = o;
                return pane.activateItem(editor2);
              });
            });
            return waitsForPromise(function() {
              return atom.packages.activatePackage('settings-view').then(function() {
                return atom.workspaceView.open('atom://config').then(function(o) {
                  settingsView = o;
                  return pane.activateItem(settingsView);
                });
              });
            });
          });
          it('creates a permanent tab', function() {
            expect(tabBar.tabForItem(settingsView)).toExist();
            return expect(tabBar.tabForItem(settingsView)).not.toHaveClass('temp');
          });
          return it('replaces an existing temp tab', function() {
            return expect(tabBar.tabForItem(editor2)).not.toExist();
          });
        });
        return describe('when opening an image', function() {
          return it('should be temporary', function() {
            var imageView;
            imageView = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.png').then(function(o) {
                imageView = o;
                return pane.activateItem(imageView);
              });
            });
            return runs(function() {
              return expect(tabBar.tabForItem(imageView)).toHaveClass('temp');
            });
          });
        });
      });
      return describe('when saving a file', function() {
        return it('makes the tab permanent', function() {
          var editor2;
          editor2 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              editor2 = o;
              return pane.activateItem(editor2);
            });
          });
          return runs(function() {
            atom.workspaceView.trigger('core:save');
            return expect(tabBar.tabForItem(editor2)).not.toHaveClass('temp');
          });
        });
      });
    });
  });

}).call(this);
