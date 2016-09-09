(function() {
  var lastCursorPosition;

  lastCursorPosition = require('../lib/last-cursor-position');

  describe("lastCursorPosition", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('lastCursorPosition');
    });
    return describe("when the last-cursor-position:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.last-cursor-position')).not.toExist();
        atom.workspaceView.trigger('last-cursor-position:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.last-cursor-position')).toExist();
          atom.workspaceView.trigger('last-cursor-position:toggle');
          return expect(atom.workspaceView.find('.last-cursor-position')).not.toExist();
        });
      });
    });
  });

}).call(this);
