Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _delve = require('./delve');

var Delve = _interopRequireWildcard(_delve);

var _store = require('./store');

'use babel';

function currentFile() {
  var editor = atom.workspace.getActiveTextEditor();
  return editor && editor.getPath();
}

function currentLine() {
  var editor = atom.workspace.getActiveTextEditor();
  return editor && editor.getCursorBufferPosition().row;
}

var commands = {
  'run-tests': {
    cmd: 'run-tests',
    text: 'Test',
    title: 'Run package test',
    action: function action() {
      return Delve.runTests(currentFile());
    }
  },
  'run-package': {
    cmd: 'run-package',
    text: 'Debug',
    title: 'Debug package',
    action: function action() {
      return Delve.runPackage(currentFile());
    }
  },
  'continue': {
    cmd: 'continue',
    icon: 'triangle-right',
    title: 'Continue',
    action: function action() {
      return Delve.command('continue');
    }
  },
  'next': {
    cmd: 'next',
    icon: 'arrow-right',
    title: 'Next',
    action: function action() {
      return Delve.command('next');
    }
  },
  'step': {
    cmd: 'step',
    icon: 'arrow-down',
    title: 'Step',
    action: function action() {
      return Delve.command('step');
    }
  },
  'restart': {
    cmd: 'restart',
    icon: 'sync',
    title: 'Restart',
    action: function action() {
      return Delve.restart();
    }
  },
  'stop': {
    cmd: 'stop',
    icon: 'primitive-square',
    title: 'Stop',
    action: function action() {
      return Delve.stop();
    }
  },
  'toggle-breakpoint': {
    action: function action() {
      return Delve.toggleBreakpoint(currentFile(), currentLine());
    }
  },
  'toggle-panel': {
    action: function action() {
      return _store.store.dispatch({ type: 'TOGGLE_PANEL' });
    }
  }
};

var keyboardCommands = {};
['run-tests', 'run-package', 'continue', 'next', 'step', 'restart', 'stop', 'toggle-breakpoint'].forEach(function (cmd) {
  keyboardCommands['go-debug:' + cmd] = commands[cmd].action;
});

var panelCommandsNotReady = [commands['run-tests'], commands['run-package']];
var panelCommandsReady = [commands['continue'], commands.next, commands.step, commands.restart, commands.stop];

var getPanelCommands = function getPanelCommands() {
  return Delve.isStarted() ? panelCommandsReady : panelCommandsNotReady;
};

exports.getPanelCommands = getPanelCommands;
var get = function get(cmd) {
  return commands[cmd];
};

exports.get = get;
var getKeyboardCommands = function getKeyboardCommands() {
  return keyboardCommands;
};
exports.getKeyboardCommands = getKeyboardCommands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRXVCLFNBQVM7O0lBQXBCLEtBQUs7O3FCQUNLLFNBQVM7O0FBSC9CLFdBQVcsQ0FBQTs7QUFLWCxTQUFTLFdBQVcsR0FBSTtBQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsU0FBTyxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0NBQ2xDOztBQUVELFNBQVMsV0FBVyxHQUFJO0FBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxTQUFPLE1BQU0sSUFBSSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxHQUFHLENBQUE7Q0FDdEQ7O0FBRUQsSUFBTSxRQUFRLEdBQUc7QUFDZixhQUFXLEVBQUU7QUFDWCxPQUFHLEVBQUUsV0FBVztBQUNoQixRQUFJLEVBQUUsTUFBTTtBQUNaLFNBQUssRUFBRSxrQkFBa0I7QUFDekIsVUFBTSxFQUFFO2FBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUFBO0dBQzVDO0FBQ0QsZUFBYSxFQUFFO0FBQ2IsT0FBRyxFQUFFLGFBQWE7QUFDbEIsUUFBSSxFQUFFLE9BQU87QUFDYixTQUFLLEVBQUUsZUFBZTtBQUN0QixVQUFNLEVBQUU7YUFBTSxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQUE7R0FDOUM7QUFDRCxZQUFVLEVBQUU7QUFDVixPQUFHLEVBQUUsVUFBVTtBQUNmLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsU0FBSyxFQUFFLFVBQVU7QUFDakIsVUFBTSxFQUFFO2FBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FBQTtHQUN4QztBQUNELFFBQU0sRUFBRTtBQUNOLE9BQUcsRUFBRSxNQUFNO0FBQ1gsUUFBSSxFQUFFLGFBQWE7QUFDbkIsU0FBSyxFQUFFLE1BQU07QUFDYixVQUFNLEVBQUU7YUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUFBO0dBQ3BDO0FBQ0QsUUFBTSxFQUFFO0FBQ04sT0FBRyxFQUFFLE1BQU07QUFDWCxRQUFJLEVBQUUsWUFBWTtBQUNsQixTQUFLLEVBQUUsTUFBTTtBQUNiLFVBQU0sRUFBRTthQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0tBQUE7R0FDcEM7QUFDRCxXQUFTLEVBQUU7QUFDVCxPQUFHLEVBQUUsU0FBUztBQUNkLFFBQUksRUFBRSxNQUFNO0FBQ1osU0FBSyxFQUFFLFNBQVM7QUFDaEIsVUFBTSxFQUFFO2FBQU0sS0FBSyxDQUFDLE9BQU8sRUFBRTtLQUFBO0dBQzlCO0FBQ0QsUUFBTSxFQUFFO0FBQ04sT0FBRyxFQUFFLE1BQU07QUFDWCxRQUFJLEVBQUUsa0JBQWtCO0FBQ3hCLFNBQUssRUFBRSxNQUFNO0FBQ2IsVUFBTSxFQUFFO2FBQU0sS0FBSyxDQUFDLElBQUksRUFBRTtLQUFBO0dBQzNCO0FBQ0QscUJBQW1CLEVBQUU7QUFDbkIsVUFBTSxFQUFFO2FBQU0sS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDO0tBQUE7R0FDbkU7QUFDRCxnQkFBYyxFQUFFO0FBQ2QsVUFBTSxFQUFFO2FBQU0sYUFBTSxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUM7S0FBQTtHQUN2RDtDQUNGLENBQUE7O0FBRUQsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDNUIsQ0FDRSxXQUFXLEVBQ1gsYUFBYSxFQUNiLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEVBQ04sbUJBQW1CLENBQ3BCLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2pCLGtCQUFnQixDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO0NBQzNELENBQUMsQ0FBQTs7QUFFRixJQUFNLHFCQUFxQixHQUFHLENBQzVCLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFDckIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUN4QixDQUFBO0FBQ0QsSUFBTSxrQkFBa0IsR0FBRyxDQUN6QixRQUFRLFlBQVMsRUFDakIsUUFBUSxDQUFDLElBQUksRUFDYixRQUFRLENBQUMsSUFBSSxFQUNiLFFBQVEsQ0FBQyxPQUFPLEVBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQ2QsQ0FBQTs7QUFFTSxJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQjtTQUFTLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxrQkFBa0IsR0FBRyxxQkFBcUI7Q0FBQSxDQUFBOzs7QUFFN0YsSUFBTSxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksR0FBRztTQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUM7Q0FBQSxDQUFBOzs7QUFFbEMsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUI7U0FBUyxnQkFBZ0I7Q0FBQSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIERlbHZlIGZyb20gJy4vZGVsdmUnXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4vc3RvcmUnXG5cbmZ1bmN0aW9uIGN1cnJlbnRGaWxlICgpIHtcbiAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIHJldHVybiBlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKVxufVxuXG5mdW5jdGlvbiBjdXJyZW50TGluZSAoKSB7XG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICByZXR1cm4gZWRpdG9yICYmIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvd1xufVxuXG5jb25zdCBjb21tYW5kcyA9IHtcbiAgJ3J1bi10ZXN0cyc6IHtcbiAgICBjbWQ6ICdydW4tdGVzdHMnLFxuICAgIHRleHQ6ICdUZXN0JyxcbiAgICB0aXRsZTogJ1J1biBwYWNrYWdlIHRlc3QnLFxuICAgIGFjdGlvbjogKCkgPT4gRGVsdmUucnVuVGVzdHMoY3VycmVudEZpbGUoKSlcbiAgfSxcbiAgJ3J1bi1wYWNrYWdlJzoge1xuICAgIGNtZDogJ3J1bi1wYWNrYWdlJyxcbiAgICB0ZXh0OiAnRGVidWcnLFxuICAgIHRpdGxlOiAnRGVidWcgcGFja2FnZScsXG4gICAgYWN0aW9uOiAoKSA9PiBEZWx2ZS5ydW5QYWNrYWdlKGN1cnJlbnRGaWxlKCkpXG4gIH0sXG4gICdjb250aW51ZSc6IHtcbiAgICBjbWQ6ICdjb250aW51ZScsXG4gICAgaWNvbjogJ3RyaWFuZ2xlLXJpZ2h0JyxcbiAgICB0aXRsZTogJ0NvbnRpbnVlJyxcbiAgICBhY3Rpb246ICgpID0+IERlbHZlLmNvbW1hbmQoJ2NvbnRpbnVlJylcbiAgfSxcbiAgJ25leHQnOiB7XG4gICAgY21kOiAnbmV4dCcsXG4gICAgaWNvbjogJ2Fycm93LXJpZ2h0JyxcbiAgICB0aXRsZTogJ05leHQnLFxuICAgIGFjdGlvbjogKCkgPT4gRGVsdmUuY29tbWFuZCgnbmV4dCcpXG4gIH0sXG4gICdzdGVwJzoge1xuICAgIGNtZDogJ3N0ZXAnLFxuICAgIGljb246ICdhcnJvdy1kb3duJyxcbiAgICB0aXRsZTogJ1N0ZXAnLFxuICAgIGFjdGlvbjogKCkgPT4gRGVsdmUuY29tbWFuZCgnc3RlcCcpXG4gIH0sXG4gICdyZXN0YXJ0Jzoge1xuICAgIGNtZDogJ3Jlc3RhcnQnLFxuICAgIGljb246ICdzeW5jJyxcbiAgICB0aXRsZTogJ1Jlc3RhcnQnLFxuICAgIGFjdGlvbjogKCkgPT4gRGVsdmUucmVzdGFydCgpXG4gIH0sXG4gICdzdG9wJzoge1xuICAgIGNtZDogJ3N0b3AnLFxuICAgIGljb246ICdwcmltaXRpdmUtc3F1YXJlJyxcbiAgICB0aXRsZTogJ1N0b3AnLFxuICAgIGFjdGlvbjogKCkgPT4gRGVsdmUuc3RvcCgpXG4gIH0sXG4gICd0b2dnbGUtYnJlYWtwb2ludCc6IHtcbiAgICBhY3Rpb246ICgpID0+IERlbHZlLnRvZ2dsZUJyZWFrcG9pbnQoY3VycmVudEZpbGUoKSwgY3VycmVudExpbmUoKSlcbiAgfSxcbiAgJ3RvZ2dsZS1wYW5lbCc6IHtcbiAgICBhY3Rpb246ICgpID0+IHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1RPR0dMRV9QQU5FTCcgfSlcbiAgfVxufVxuXG5jb25zdCBrZXlib2FyZENvbW1hbmRzID0ge307XG5bXG4gICdydW4tdGVzdHMnLFxuICAncnVuLXBhY2thZ2UnLFxuICAnY29udGludWUnLFxuICAnbmV4dCcsXG4gICdzdGVwJyxcbiAgJ3Jlc3RhcnQnLFxuICAnc3RvcCcsXG4gICd0b2dnbGUtYnJlYWtwb2ludCdcbl0uZm9yRWFjaCgoY21kKSA9PiB7XG4gIGtleWJvYXJkQ29tbWFuZHNbJ2dvLWRlYnVnOicgKyBjbWRdID0gY29tbWFuZHNbY21kXS5hY3Rpb25cbn0pXG5cbmNvbnN0IHBhbmVsQ29tbWFuZHNOb3RSZWFkeSA9IFtcbiAgY29tbWFuZHNbJ3J1bi10ZXN0cyddLFxuICBjb21tYW5kc1sncnVuLXBhY2thZ2UnXVxuXVxuY29uc3QgcGFuZWxDb21tYW5kc1JlYWR5ID0gW1xuICBjb21tYW5kcy5jb250aW51ZSxcbiAgY29tbWFuZHMubmV4dCxcbiAgY29tbWFuZHMuc3RlcCxcbiAgY29tbWFuZHMucmVzdGFydCxcbiAgY29tbWFuZHMuc3RvcFxuXVxuXG5leHBvcnQgY29uc3QgZ2V0UGFuZWxDb21tYW5kcyA9ICgpID0+IERlbHZlLmlzU3RhcnRlZCgpID8gcGFuZWxDb21tYW5kc1JlYWR5IDogcGFuZWxDb21tYW5kc05vdFJlYWR5XG5cbmV4cG9ydCBjb25zdCBnZXQgPSAoY21kKSA9PiBjb21tYW5kc1tjbWRdXG5cbmV4cG9ydCBjb25zdCBnZXRLZXlib2FyZENvbW1hbmRzID0gKCkgPT4ga2V5Ym9hcmRDb21tYW5kc1xuIl19
//# sourceURL=/Users/ssun/.atom/packages/go-debug/lib/commands.js
