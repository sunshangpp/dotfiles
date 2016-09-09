var DeploymentManager = require('./DeploymentManager');
var MessageObserver = require('./observers/MessageObserver');
// DEV MODE
//var ConsoleObserver = require('./observers/ConsoleObserver');
var manager = new DeploymentManager();
manager.registerObserver(new MessageObserver());
// DEV MODE
//manager.registerObserver(new ConsoleObserver());

/**
 * Declare command palette to Atom
 * @type {Object}
 */
module.exports = {
    'config': {
        'uploadOnSave': {
            'title': 'Upload on save',
            'description': 'When enabled, remote files will be automatically uploaded when saved',
            'type': 'boolean',
            'default': true
        },
        'messagePanel': {
            'title': 'Display message panel',
            'type': 'boolean',
            'default': true
        },
        'sshPrivateKeyPath': {
            'title': 'Path to private SSH key',
            'type': 'string',
            'default': '~/.ssh/id_rsa'
        },
        'messagePanelTimeout': {
            'title': 'Timeout for message panel',
            'type': 'integer',
            'default': 6000
        }
    },

    activate: function activate() {
        atom.commands.add('atom-workspace', 'sftp-deployment:mapToRemote', manager.generateConfigFile);
        atom.commands.add('atom-workspace', 'sftp-deployment:uploadCurrentFile', manager.uploadCurrentFile);
        atom.commands.add('atom-workspace', 'sftp-deployment:downloadCurrentFile', manager.downloadCurrentFile);
        atom.commands.add('atom-workspace', 'sftp-deployment:uploadOpenFiles', manager.uploadOpenFiles);
        atom.commands.add('atom-workspace', 'sftp-deployment:uploadSelection', manager.uploadSelection);
        atom.commands.add('atom-workspace', 'sftp-deployment:downloadSelection', manager.downloadSelection);
        atom.commands.add('atom-workspace', 'core:save', manager.uploadOnSave);
    }

};
//     handleEvent: function(textEditor) {
// console.log(textEditor);
//         textEditor.buffer.onDidSave(function() {
// console.log('test');
//             return manager.uploadOnSave();
//         });
//     }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvc2Z0cC1kZXBsb3ltZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDdkQsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7OztBQUc3RCxJQUFJLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7QUFDdEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksZUFBZSxFQUFFLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRaEQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNiLFlBQVEsRUFBRTtBQUNOLHNCQUFjLEVBQUU7QUFDWixtQkFBTyxFQUFFLGdCQUFnQjtBQUN6Qix5QkFBYSxFQUFFLHNFQUFzRTtBQUNyRixrQkFBTSxFQUFFLFNBQVM7QUFDakIscUJBQVMsRUFBRSxJQUFJO1NBQ2xCO0FBQ0Qsc0JBQWMsRUFBRTtBQUNaLG1CQUFPLEVBQUUsdUJBQXVCO0FBQ2hDLGtCQUFNLEVBQUUsU0FBUztBQUNqQixxQkFBUyxFQUFFLElBQUk7U0FDbEI7QUFDRCwyQkFBbUIsRUFBRTtBQUNqQixtQkFBTyxFQUFFLHlCQUF5QjtBQUNsQyxrQkFBTSxFQUFFLFFBQVE7QUFDaEIscUJBQVMsRUFBRSxlQUFlO1NBQzdCO0FBQ0QsNkJBQXFCLEVBQUU7QUFDbkIsbUJBQU8sRUFBRSwyQkFBMkI7QUFDcEMsa0JBQU0sRUFBRSxTQUFTO0FBQ2pCLHFCQUFTLEVBQUUsSUFBSTtTQUNsQjtLQUNKOztBQUVELFlBQVEsRUFBRSxvQkFBVztBQUNqQixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDYixnQkFBZ0IsRUFDaEIsNkJBQTZCLEVBQzdCLE9BQU8sQ0FBQyxrQkFBa0IsQ0FDN0IsQ0FBQztBQUNGLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNiLGdCQUFnQixFQUNoQixtQ0FBbUMsRUFDbkMsT0FBTyxDQUFDLGlCQUFpQixDQUM1QixDQUFDO0FBQ0YsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ2IsZ0JBQWdCLEVBQ2hCLHFDQUFxQyxFQUNyQyxPQUFPLENBQUMsbUJBQW1CLENBQzlCLENBQUM7QUFDRixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDYixnQkFBZ0IsRUFDaEIsaUNBQWlDLEVBQ2pDLE9BQU8sQ0FBQyxlQUFlLENBQzFCLENBQUM7QUFDRixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDYixnQkFBZ0IsRUFDaEIsaUNBQWlDLEVBQ2pDLE9BQU8sQ0FBQyxlQUFlLENBQzFCLENBQUM7QUFDRixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDYixnQkFBZ0IsRUFDaEIsbUNBQW1DLEVBQ25DLE9BQU8sQ0FBQyxpQkFBaUIsQ0FDNUIsQ0FBQztBQUNGLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNiLGdCQUFnQixFQUNoQixXQUFXLEVBQ1gsT0FBTyxDQUFDLFlBQVksQ0FDdkIsQ0FBQztLQUNMOztDQVNKLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9zZnRwLWRlcGxveW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRGVwbG95bWVudE1hbmFnZXIgPSByZXF1aXJlKCcuL0RlcGxveW1lbnRNYW5hZ2VyJyk7XG52YXIgTWVzc2FnZU9ic2VydmVyID0gcmVxdWlyZSgnLi9vYnNlcnZlcnMvTWVzc2FnZU9ic2VydmVyJyk7XG4vLyBERVYgTU9ERVxuLy92YXIgQ29uc29sZU9ic2VydmVyID0gcmVxdWlyZSgnLi9vYnNlcnZlcnMvQ29uc29sZU9ic2VydmVyJyk7XG52YXIgbWFuYWdlciA9IG5ldyBEZXBsb3ltZW50TWFuYWdlcigpO1xubWFuYWdlci5yZWdpc3Rlck9ic2VydmVyKG5ldyBNZXNzYWdlT2JzZXJ2ZXIoKSk7XG4vLyBERVYgTU9ERVxuLy9tYW5hZ2VyLnJlZ2lzdGVyT2JzZXJ2ZXIobmV3IENvbnNvbGVPYnNlcnZlcigpKTtcblxuLyoqXG4gKiBEZWNsYXJlIGNvbW1hbmQgcGFsZXR0ZSB0byBBdG9tXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAnY29uZmlnJzoge1xuICAgICAgICAndXBsb2FkT25TYXZlJzoge1xuICAgICAgICAgICAgJ3RpdGxlJzogJ1VwbG9hZCBvbiBzYXZlJyxcbiAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdXaGVuIGVuYWJsZWQsIHJlbW90ZSBmaWxlcyB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgdXBsb2FkZWQgd2hlbiBzYXZlZCcsXG4gICAgICAgICAgICAndHlwZSc6ICdib29sZWFuJyxcbiAgICAgICAgICAgICdkZWZhdWx0JzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnbWVzc2FnZVBhbmVsJzrCoHtcbiAgICAgICAgICAgICd0aXRsZSc6ICdEaXNwbGF5IG1lc3NhZ2UgcGFuZWwnLFxuICAgICAgICAgICAgJ3R5cGUnOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAnZGVmYXVsdCc6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3NzaFByaXZhdGVLZXlQYXRoJzoge1xuICAgICAgICAgICAgJ3RpdGxlJzogJ1BhdGggdG8gcHJpdmF0ZSBTU0gga2V5JyxcbiAgICAgICAgICAgICd0eXBlJzogJ3N0cmluZycsXG4gICAgICAgICAgICAnZGVmYXVsdCc6ICd+Ly5zc2gvaWRfcnNhJ1xuICAgICAgICB9LFxuICAgICAgICAnbWVzc2FnZVBhbmVsVGltZW91dCc6IHtcbiAgICAgICAgICAgICd0aXRsZSc6ICdUaW1lb3V0IGZvciBtZXNzYWdlIHBhbmVsJyxcbiAgICAgICAgICAgICd0eXBlJzogJ2ludGVnZXInLFxuICAgICAgICAgICAgJ2RlZmF1bHQnOiA2MDAwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICAgICAgICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAgICAgICAnc2Z0cC1kZXBsb3ltZW50Om1hcFRvUmVtb3RlJyxcbiAgICAgICAgICAgIG1hbmFnZXIuZ2VuZXJhdGVDb25maWdGaWxlXG4gICAgICAgICk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAgICAgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgICAgICdzZnRwLWRlcGxveW1lbnQ6dXBsb2FkQ3VycmVudEZpbGUnLFxuICAgICAgICAgICAgbWFuYWdlci51cGxvYWRDdXJyZW50RmlsZVxuICAgICAgICApO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICAgICAgICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAgICAgICAnc2Z0cC1kZXBsb3ltZW50OmRvd25sb2FkQ3VycmVudEZpbGUnLFxuICAgICAgICAgICAgbWFuYWdlci5kb3dubG9hZEN1cnJlbnRGaWxlXG4gICAgICAgICk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAgICAgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgICAgICdzZnRwLWRlcGxveW1lbnQ6dXBsb2FkT3BlbkZpbGVzJyxcbiAgICAgICAgICAgIG1hbmFnZXIudXBsb2FkT3BlbkZpbGVzXG4gICAgICAgICk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAgICAgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgICAgICdzZnRwLWRlcGxveW1lbnQ6dXBsb2FkU2VsZWN0aW9uJyxcbiAgICAgICAgICAgIG1hbmFnZXIudXBsb2FkU2VsZWN0aW9uXG4gICAgICAgICk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAgICAgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgICAgICdzZnRwLWRlcGxveW1lbnQ6ZG93bmxvYWRTZWxlY3Rpb24nLFxuICAgICAgICAgICAgbWFuYWdlci5kb3dubG9hZFNlbGVjdGlvblxuICAgICAgICApO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICAgICAgICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAgICAgICAnY29yZTpzYXZlJyxcbiAgICAgICAgICAgIG1hbmFnZXIudXBsb2FkT25TYXZlXG4gICAgICAgICk7XG4gICAgfSxcblxuLy8gICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbih0ZXh0RWRpdG9yKcKge1xuLy8gY29uc29sZS5sb2codGV4dEVkaXRvcik7XG4vLyAgICAgICAgIHRleHRFZGl0b3IuYnVmZmVyLm9uRGlkU2F2ZShmdW5jdGlvbigpIHtcbi8vIGNvbnNvbGUubG9nKCd0ZXN0Jyk7XG4vLyAgICAgICAgICAgICByZXR1cm4gbWFuYWdlci51cGxvYWRPblNhdmUoKTtcbi8vICAgICAgICAgfSk7XG4vLyAgICAgfVxufTtcbiJdfQ==