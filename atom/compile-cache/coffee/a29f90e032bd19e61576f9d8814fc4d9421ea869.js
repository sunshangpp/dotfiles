(function() {
  var $, DirectoryView, FileView, SublimeTreeView, TreeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom').$;

  TreeView = require(atom.packages.resolvePackagePath('tree-view') + '/lib/tree-view');

  DirectoryView = require(atom.packages.resolvePackagePath('tree-view') + '/lib/directory-view');

  FileView = require(atom.packages.resolvePackagePath('tree-view') + '/lib/file-view');

  module.exports = SublimeTreeView = (function(_super) {
    __extends(SublimeTreeView, _super);

    function SublimeTreeView() {
      return SublimeTreeView.__super__.constructor.apply(this, arguments);
    }

    SublimeTreeView.prototype.initialize = function(state) {
      SublimeTreeView.__super__.initialize.call(this, state);
      atom.commands.add('.tree-view', 'tree-view:expand-directory-or-preview-file', (function(_this) {
        return function() {
          return _this.expandDirOrPreview();
        };
      })(this));
      return this.on('dblclick', '.entry', function(e) {
        if (e.shiftKey || e.metaKey || e.altKey) {
          return;
        }
        atom.workspaceView.find('.tab-bar .tab.active').removeClass('temp');
        return false;
      });
    };

    SublimeTreeView.prototype.entryDblClicked = function(e) {
      this.selectedEntry = $(e.currentTarget).view();
      return this.openSelectedEntry(false, true);
    };

    SublimeTreeView.prototype.expandDirOrPreview = function() {
      var selectedEntry;
      selectedEntry = this.selectedEntry();
      if (selectedEntry instanceof DirectoryView) {
        return selectedEntry.expand(false);
      } else if (selectedEntry instanceof FileView) {
        return atom.workspace.open(selectedEntry.getPath(), {
          activatePane: false
        });
      }
    };

    return SublimeTreeView;

  })(TreeView);

}).call(this);
