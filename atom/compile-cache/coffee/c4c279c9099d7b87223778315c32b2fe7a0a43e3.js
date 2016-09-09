(function() {
  var $;

  $ = require('jquery');

  module.exports = {
    config: {
      fullscreen: {
        type: 'boolean',
        "default": true
      },
      hideTabs: {
        description: 'Disable to keep the current tab visible when Zen.',
        type: 'boolean',
        "default": true
      },
      showWordCount: {
        description: 'Show the word-count if you have the package installed.',
        type: 'boolean',
        "default": false
      },
      softWrap: {
        description: 'Enables / Disables soft wrapping when Zen is active.',
        type: 'boolean',
        "default": atom.config.get('editor.softWrap')
      },
      width: {
        type: 'integer',
        "default": atom.config.get('editor.preferredLineLength')
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', 'zen:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var body, editor, fullscreen, softWrap, width, _ref, _ref1;
      body = document.querySelector('body');
      editor = atom.workspace.getActiveTextEditor();
      fullscreen = atom.config.get('Zen.fullscreen');
      width = atom.config.get('Zen.width');
      softWrap = atom.config.get('Zen.softWrap');
      if (editor === void 0) {
        atom.notifications.addInfo('Zen cannot be achieved in this view.');
        return;
      }
      if (atom.config.get('Zen.hideTabs')) {
        body.setAttribute('data-zen-tabs', 'hidden');
      } else {
        body.setAttribute('data-zen-tabs', 'visible');
      }
      if (atom.config.get('Zen.showWordCount')) {
        body.setAttribute('data-zen-word-count', 'visible');
      } else {
        body.setAttribute('data-zen-word-count', 'hidden');
      }
      if (body.getAttribute('data-zen') !== 'true') {
        body.setAttribute('data-zen', 'true');
        if (atom.config.get('editor.softWrap') !== softWrap) {
          atom.config.set('editor.softWrap', softWrap);
          this.unSetSoftWrap = true;
        }
        if (editor.isSoftWrapped() !== softWrap) {
          editor.setSoftWrapped(softWrap);
          this.unSoftWrap = true;
        }
        requestAnimationFrame(function() {
          return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
        });
        this.fontChanged = atom.config.onDidChange('editor.fontSize', function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        this.paneChanged = atom.workspace.onDidChangeActivePaneItem(function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        if ($('.tree-view').length) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:toggle');
          this.restoreTree = true;
        }
        if ($('atom-text-editor /deep/ atom-text-editor-minimap').length) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = true;
        }
        if (fullscreen) {
          return atom.setFullScreen(true);
        }
      } else {
        body.setAttribute('data-zen', 'false');
        if (fullscreen) {
          atom.setFullScreen(false);
        }
        if (this.unSoftWrap) {
          editor.setSoftWrapped(!softWrap);
          this.unSoftWrap = null;
        }
        if (this.unSetSoftWrap) {
          atom.config.set('editor.softWrap', !softWrap);
        }
        $('atom-text-editor:not(.mini)').css('width', '');
        if (this.restoreTree) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');
          this.restoreTree = false;
        }
        if (this.restoreMinimap && $('atom-text-editor /deep/ atom-text-editor-minimap').length !== 1) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = false;
        }
        if ((_ref = this.fontChanged) != null) {
          _ref.dispose();
        }
        return (_ref1 = this.paneChanged) != null ? _ref1.dispose() : void 0;
      }
    }
  };

}).call(this);