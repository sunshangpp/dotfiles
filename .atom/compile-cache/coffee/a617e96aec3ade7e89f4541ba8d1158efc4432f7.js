(function() {
  var $, StatusView, Subscriber, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Subscriber = require('emissary').Subscriber;

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = StatusView = (function(_super) {
    __extends(StatusView, _super);

    function StatusView() {
      return StatusView.__super__.constructor.apply(this, arguments);
    }

    Subscriber.includeInto(StatusView);

    StatusView.content = function(params) {
      return this.div({
        "class": 'git-plus'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "" + params.type + " message"
          }, params.message);
        };
      })(this));
    };

    StatusView.prototype.initialize = function() {
      this.subscribe($(window), 'core:cancel', (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      if (this.panel == null) {
        this.panel = atom.workspace.addBottomPanel({
          item: this
        });
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this), atom.config.get('git-plus.messageTimeout') * 1000);
    };

    StatusView.prototype.destroy = function() {
      this.panel.destroy();
      return this.unsubscribe();
    };

    return StatusView;

  })(View);

}).call(this);
