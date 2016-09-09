(function() {
  var $, SublimeTreeView, TreeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom').$;

  TreeView = require(atom.packages.resolvePackagePath('tree-view') + '/lib/tree-view');

  module.exports = SublimeTreeView = (function(_super) {
    __extends(SublimeTreeView, _super);

    function SublimeTreeView() {
      return SublimeTreeView.__super__.constructor.apply(this, arguments);
    }

    SublimeTreeView.prototype.initialize = function(state) {
      SublimeTreeView.__super__.initialize.call(this, state);
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

    return SublimeTreeView;

  })(TreeView);

}).call(this);
