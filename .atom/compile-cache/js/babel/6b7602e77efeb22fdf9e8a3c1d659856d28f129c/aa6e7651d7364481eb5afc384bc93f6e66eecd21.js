function MessageObserver() {}

var createMessage = function createMessage(message, classes) {
    var atomModule = require('atom');
    var $ = atomModule.$;

    var workspace = $('.workspace');
    var sftpMessages = workspace.find('.sftp-messages ul');
    if (sftpMessages.length === 0) {
        $('.workspace').append('<div class=\'sftp-messages\'><ul></ul></div>');
        sftpMessages = workspace.find('.sftp-messages ul');
    }

    var id = 'sftp-message-' + sftpMessages.length;
    sftpMessages.append('<li id="' + id + '" class=\'message ' + classes + '\'>' + message + '</li>');

    setTimeout(function () {
        var message = $('#' + id);
        var messages = $('.sftp-messages ul').children('.message');
        message.remove();
        if (sftpMessages.find('.message').length === 0) {
            sftpMessages.parent().remove();
        }
    }, 3000);
};

var createErrorMessage = function createErrorMessage(message) {
    hideLoader();
    createMessage(message, 'error');
};

var createWarningMessage = function createWarningMessage(message) {
    hideLoader();
    createMessage(message, 'warning');
};

var createSuccessMessage = function createSuccessMessage(message) {
    hideLoader();
    createMessage(message, 'success');
};

var showLoader = function showLoader() {
    var atomModule = require('atom');
    var $ = atomModule.$;

    var workspace = $('.workspace');
    var sftpLoader = workspace.find('.sftp-loader');
    if (sftpLoader.length === 0) {
        workspace.append('<div class="sftp-loader"><div class="message">' + '<span class="loading loading-spinner-tiny inline-block"></span>' + '<span>Loading...</span>' + '</div></div>');
        sftpLoader = workspace.find('.sftp-loader');
    }
    sftpLoader.show();
};

var hideLoader = function hideLoader() {
    var atomModule = require('atom');
    var $ = atomModule.$;

    var sftpLoader = $('.workspace').find('.sftp-loader');
    if (sftpLoader.length !== 0) {
        sftpLoader.hide();
    }
};

MessageObserver.prototype.notify = function (value, data) {
    switch (value) {
        case 'begin_transfert':
            showLoader();
            break;
        case 'project_not_found':
            createErrorMessage('Create a project before trying to create a configuration file', 'project_not_found');
            break;
        case 'configuration_file_creation_success':
            createSuccessMessage('The configuration file was created with success');
            break;
        case 'configuration_file_creation_error':
            createErrorMessage('A error occured during configuration file creation');
            break;
        case 'no_configuration_file_found':
            createErrorMessage('The configuration file doesn\'t exist');
            break;
        case 'configuration_file_not_readable':
            createErrorMessage('The configuration file is not readable');
            break;
        case 'configuration_file_not_readable':
            createErrorMessage('The configuration file is not readable');
            break;
        case 'configuration_file_syntax_error':
            createErrorMessage(data.message);
            break;
        case 'connection_error':
            createErrorMessage(data.message);
            break;
        case 'remote_directory_creation_error':
            createErrorMessage(data.message);
            break;
        case 'remote_directory_not_readable':
            createErrorMessage(data.message);
            break;
        case 'directory_creation_error':
            createErrorMessage(data.message);
            break;
        case 'upload_file_error':
            createErrorMessage(data.message);
            break;
        case 'transfert_file_error':
            createErrorMessage(data.message);
            break;
        case 'upload_file_success':
            createSuccessMessage('Upload success');
            break;
        case 'download_file_error':
            createErrorMessage(data.message);
            break;
        case 'download_file_success':
            createSuccessMessage('Download success');
            break;
        default:
            break;
    }
};

module.exports = MessageObserver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvb2JzZXJ2ZXJzL01lc3NhZ2VPYnNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGVBQWUsR0FBRyxFQUMxQjs7QUFFRCxJQUFJLGFBQWEsR0FBRyx1QkFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQzNDLFFBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDOztBQUVyQixRQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEMsUUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3ZELFFBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDM0IsU0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3ZFLG9CQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3REOztBQUVELFFBQUksRUFBRSxHQUFHLGVBQWUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0FBQy9DLGdCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsb0JBQW9CLEdBQUcsT0FBTyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUM7O0FBRWxHLGNBQVUsQ0FBQyxZQUFXO0FBQ2xCLFlBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDMUIsWUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNELGVBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNqQixZQUFJLFlB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QUMsQ0FBQztBQUNqQyxrQkFBTTtBQUFBLEFBQ1YsYUFBSyxrQkFBa0I7QUFDbkIsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsQUFDVixhQUFLLGlDQUFpQztBQUNsQyw4QkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsa0JBQU07QUFBQSxBQUNWLGFBQUssK0JBQStCO0FBQ2hDLDhCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxrQkFBTTtBQUFBLEFBQ1YsYUFBSywwQkFBMEI7QUFDM0IsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsQUFDVixhQUFLLG1CQUFtQjtBQUNwQiw4QkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsa0JBQU07QUFBQSxBQUNWLGFBQUssc0JBQXNCO0FBQ3ZCLDhCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxrQkFBTTtBQUFBLEFBQ1YsYUFBSyxxQkFBcUI7QUFDdEIsZ0NBQW9CLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxrQkFBTTtBQUFBLEFBQ1YsYUFBSyxxQkFBcUI7QUFDdEIsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsQUFDVixhQUFLLHVCQUF1QjtBQUN4QixnQ0FBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLGtCQUFNO0FBQUEsQUFDVjtBQUNJLGtCQUFNO0FBQUEsS0FDYjtDQUNKLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9vYnNlcnZlcnMvTWVzc2FnZU9ic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gTWVzc2FnZU9ic2VydmVyKCkge1xufVxuXG52YXIgY3JlYXRlTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGNsYXNzZXMpIHtcbiAgICB2YXIgYXRvbU1vZHVsZSA9IHJlcXVpcmUoJ2F0b20nKTtcbiAgICB2YXIgJCA9IGF0b21Nb2R1bGUuJDtcblxuICAgIHZhciB3b3Jrc3BhY2UgPSAkKCcud29ya3NwYWNlJyk7XG4gICAgdmFyIHNmdHBNZXNzYWdlcyA9IHdvcmtzcGFjZS5maW5kKCcuc2Z0cC1tZXNzYWdlcyB1bCcpO1xuICAgIGlmIChzZnRwTWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQoJy53b3Jrc3BhY2UnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XFwnc2Z0cC1tZXNzYWdlc1xcJz48dWw+PC91bD48L2Rpdj4nKTtcbiAgICAgICAgc2Z0cE1lc3NhZ2VzID0gd29ya3NwYWNlLmZpbmQoJy5zZnRwLW1lc3NhZ2VzIHVsJyk7XG4gICAgfVxuXG4gICAgdmFyIGlkID0gJ3NmdHAtbWVzc2FnZS0nICsgc2Z0cE1lc3NhZ2VzLmxlbmd0aDtcbiAgICBzZnRwTWVzc2FnZXMuYXBwZW5kKCc8bGkgaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XFwnbWVzc2FnZSAnICsgY2xhc3NlcyArICdcXCc+JyArIG1lc3NhZ2UgKyAnPC9saT4nKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gJCgnIycgKyBpZCk7XG4gICAgICAgIHZhciBtZXNzYWdlcyA9ICQoJy5zZnRwLW1lc3NhZ2VzIHVsJykuY2hpbGRyZW4oJy5tZXNzYWdlJyk7XG4gICAgICAgIG1lc3NhZ2UucmVtb3ZlKCk7XG4gICAgICAgIGlmIChzZnRwTWVzc2FnZXMuZmluZCgnLm1lc3NhZ2UnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHNmdHBNZXNzYWdlcy5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH0sIDMwMDApO1xufTtcblxudmFyIGNyZWF0ZUVycm9yTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBoaWRlTG9hZGVyKCk7XG4gICAgY3JlYXRlTWVzc2FnZShtZXNzYWdlLCAnZXJyb3InKTtcbn07XG5cbnZhciBjcmVhdGVXYXJuaW5nTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBoaWRlTG9hZGVyKCk7XG4gICAgY3JlYXRlTWVzc2FnZShtZXNzYWdlLCAnd2FybmluZycpO1xufTtcblxudmFyIGNyZWF0ZVN1Y2Nlc3NNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIGhpZGVMb2FkZXIoKTtcbiAgICBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UsICdzdWNjZXNzJyk7XG59O1xuXG52YXIgc2hvd0xvYWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdG9tTW9kdWxlID0gcmVxdWlyZSgnYXRvbScpO1xuICAgIHZhciAkID0gYXRvbU1vZHVsZS4kO1xuXG4gICAgdmFyIHdvcmtzcGFjZSA9ICQoJy53b3Jrc3BhY2UnKTtcbiAgICB2YXIgc2Z0cExvYWRlciA9IHdvcmtzcGFjZS5maW5kKCcuc2Z0cC1sb2FkZXInKTtcbiAgICBpZiAoc2Z0cExvYWRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgd29ya3NwYWNlLmFwcGVuZChcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2Z0cC1sb2FkZXJcIj48ZGl2IGNsYXNzPVwibWVzc2FnZVwiPidcbiAgICAgICAgICAgICsgJzxzcGFuIGNsYXNzPVwibG9hZGluZyBsb2FkaW5nLXNwaW5uZXItdGlueSBpbmxpbmUtYmxvY2tcIj48L3NwYW4+J1xuICAgICAgICAgICAgKyAnPHNwYW4+TG9hZGluZy4uLjwvc3Bhbj4nXG4gICAgICAgICAgICArICc8L2Rpdj48L2Rpdj4nKTtcbiAgICAgICAgc2Z0cExvYWRlciA9IHdvcmtzcGFjZS5maW5kKCcuc2Z0cC1sb2FkZXInKTtcbiAgICB9XG4gICAgc2Z0cExvYWRlci5zaG93KCk7XG59XG5cbnZhciBoaWRlTG9hZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF0b21Nb2R1bGUgPSByZXF1aXJlKCdhdG9tJyk7XG4gICAgdmFyICQgPSBhdG9tTW9kdWxlLiQ7XG5cbiAgICB2YXIgc2Z0cExvYWRlciA9ICQoJy53b3Jrc3BhY2UnKS5maW5kKCcuc2Z0cC1sb2FkZXInKTtcbiAgICBpZiAoc2Z0cExvYWRlci5sZW5ndGggIT09IDApIHtcbiAgICAgICAgc2Z0cExvYWRlci5oaWRlKCk7XG4gICAgfVxufVxuXG5NZXNzYWdlT2JzZXJ2ZXIucHJvdG90eXBlLm5vdGlmeSA9IGZ1bmN0aW9uKHZhbHVlLCBkYXRhKSB7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlICdiZWdpbl90cmFuc2ZlcnQnOlxuICAgICAgICAgICAgc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Byb2plY3Rfbm90X2ZvdW5kJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnQ3JlYXRlIGEgcHJvamVjdCBiZWZvcmUgdHJ5aW5nIHRvIGNyZWF0ZSBhIGNvbmZpZ3VyYXRpb24gZmlsZScsICdwcm9qZWN0X25vdF9mb3VuZCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbmZpZ3VyYXRpb25fZmlsZV9jcmVhdGlvbl9zdWNjZXNzJzpcbiAgICAgICAgICAgIGNyZWF0ZVN1Y2Nlc3NNZXNzYWdlKCdUaGUgY29uZmlndXJhdGlvbiBmaWxlIHdhcyBjcmVhdGVkIHdpdGggc3VjY2VzcycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbmZpZ3VyYXRpb25fZmlsZV9jcmVhdGlvbl9lcnJvcic6XG4gICAgICAgICAgICBjcmVhdGVFcnJvck1lc3NhZ2UoJ0EgZXJyb3Igb2NjdXJlZCBkdXJpbmcgY29uZmlndXJhdGlvbiBmaWxlIGNyZWF0aW9uJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbm9fY29uZmlndXJhdGlvbl9maWxlX2ZvdW5kJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25maWd1cmF0aW9uX2ZpbGVfbm90X3JlYWRhYmxlJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBpcyBub3QgcmVhZGFibGUnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25maWd1cmF0aW9uX2ZpbGVfbm90X3JlYWRhYmxlJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBpcyBub3QgcmVhZGFibGUnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25maWd1cmF0aW9uX2ZpbGVfc3ludGF4X2Vycm9yJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZShkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nvbm5lY3Rpb25fZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVtb3RlX2RpcmVjdG9yeV9jcmVhdGlvbl9lcnJvcic6XG4gICAgICAgICAgICBjcmVhdGVFcnJvck1lc3NhZ2UoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZW1vdGVfZGlyZWN0b3J5X25vdF9yZWFkYWJsZSc6XG4gICAgICAgICAgICBjcmVhdGVFcnJvck1lc3NhZ2UoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkaXJlY3RvcnlfY3JlYXRpb25fZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBsb2FkX2ZpbGVfZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHJhbnNmZXJ0X2ZpbGVfZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBsb2FkX2ZpbGVfc3VjY2Vzcyc6XG4gICAgICAgICAgICBjcmVhdGVTdWNjZXNzTWVzc2FnZSgnVXBsb2FkIHN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkb3dubG9hZF9maWxlX2Vycm9yJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZShkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Rvd25sb2FkX2ZpbGVfc3VjY2Vzcyc6XG4gICAgICAgICAgICBjcmVhdGVTdWNjZXNzTWVzc2FnZSgnRG93bmxvYWQgc3VjY2VzcycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VPYnNlcnZlcjtcbiJdfQ==