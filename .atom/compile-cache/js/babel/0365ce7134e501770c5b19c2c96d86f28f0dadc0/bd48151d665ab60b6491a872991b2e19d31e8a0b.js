function MessageObserver() {}

var createMessage = function createMessage(message, classes) {
    var atomModule = require('atom-space-pen-views');
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
    var atomModule = require('atom-space-pen-views');
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
    var atomModule = require('atom-space-pen-views');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvb2JzZXJ2ZXJzL01lc3NhZ2VPYnNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGVBQWUsR0FBRyxFQUMxQjs7QUFFRCxJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUMzQyxRQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNqRCxRQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDOztBQUVyQixRQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEMsUUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3ZELFFBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDM0IsU0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3ZFLG9CQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3REOztBQUVELFFBQUksRUFBRSxHQUFHLGVBQWUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0FBQy9DLGdCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsb0JBQW9CLEdBQUcsT0FBTyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUM7O0FBRWxHLGNBQVUsQ0FBQyxZQUFXO0FBQ2xCLFlBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDMUIsWUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNELGVBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztB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QUFDbEMsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCxrQkFBa0I7QUFDbkIsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCxpQ0FBaUM7QUFDbEMsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCwrQkFBK0I7QUFDaEMsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCwwQkFBMEI7QUFDM0IsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCxtQkFBbUI7QUFDcEIsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCxzQkFBc0I7QUFDdkIsOEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsYUFDTCxxQkFBcUI7QUFDdEIsZ0NBQW9CLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxrQkFBTTtBQUFBLGFBQ0wscUJBQXFCO0FBQ3RCLDhCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxrQkFBTTtBQUFBLGFBQ0wsdUJBQXVCO0FBQ3hCLGdDQUFvQixDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsa0JBQU07QUFBQTtBQUVOLGtCQUFNO0FBQUEsS0FDYjtDQUNKLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvc2Z0cC1kZXBsb3ltZW50L2xpYi9vYnNlcnZlcnMvTWVzc2FnZU9ic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gTWVzc2FnZU9ic2VydmVyKCkge1xufVxuXG52YXIgY3JlYXRlTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGNsYXNzZXMpIHtcbiAgICB2YXIgYXRvbU1vZHVsZSA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJyk7XG4gICAgdmFyICQgPSBhdG9tTW9kdWxlLiQ7XG5cbiAgICB2YXIgd29ya3NwYWNlID0gJCgnLndvcmtzcGFjZScpO1xuICAgIHZhciBzZnRwTWVzc2FnZXMgPSB3b3Jrc3BhY2UuZmluZCgnLnNmdHAtbWVzc2FnZXMgdWwnKTtcbiAgICBpZiAoc2Z0cE1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkKCcud29ya3NwYWNlJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVxcJ3NmdHAtbWVzc2FnZXNcXCc+PHVsPjwvdWw+PC9kaXY+Jyk7XG4gICAgICAgIHNmdHBNZXNzYWdlcyA9IHdvcmtzcGFjZS5maW5kKCcuc2Z0cC1tZXNzYWdlcyB1bCcpO1xuICAgIH1cblxuICAgIHZhciBpZCA9ICdzZnRwLW1lc3NhZ2UtJyArIHNmdHBNZXNzYWdlcy5sZW5ndGg7XG4gICAgc2Z0cE1lc3NhZ2VzLmFwcGVuZCgnPGxpIGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVxcJ21lc3NhZ2UgJyArIGNsYXNzZXMgKyAnXFwnPicgKyBtZXNzYWdlICsgJzwvbGk+Jyk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoJyMnICsgaWQpO1xuICAgICAgICB2YXIgbWVzc2FnZXMgPSAkKCcuc2Z0cC1tZXNzYWdlcyB1bCcpLmNoaWxkcmVuKCcubWVzc2FnZScpO1xuICAgICAgICBtZXNzYWdlLnJlbW92ZSgpO1xuICAgICAgICBpZiAoc2Z0cE1lc3NhZ2VzLmZpbmQoJy5tZXNzYWdlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBzZnRwTWVzc2FnZXMucGFyZW50KCkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9LCAzMDAwKTtcbn07XG5cbnZhciBjcmVhdGVFcnJvck1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaGlkZUxvYWRlcigpO1xuICAgIGNyZWF0ZU1lc3NhZ2UobWVzc2FnZSwgJ2Vycm9yJyk7XG59O1xuXG52YXIgY3JlYXRlV2FybmluZ01lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaGlkZUxvYWRlcigpO1xuICAgIGNyZWF0ZU1lc3NhZ2UobWVzc2FnZSwgJ3dhcm5pbmcnKTtcbn07XG5cbnZhciBjcmVhdGVTdWNjZXNzTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBoaWRlTG9hZGVyKCk7XG4gICAgY3JlYXRlTWVzc2FnZShtZXNzYWdlLCAnc3VjY2VzcycpO1xufTtcblxudmFyIHNob3dMb2FkZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXRvbU1vZHVsZSA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJyk7XG4gICAgdmFyICQgPSBhdG9tTW9kdWxlLiQ7XG5cbiAgICB2YXIgd29ya3NwYWNlID0gJCgnLndvcmtzcGFjZScpO1xuICAgIHZhciBzZnRwTG9hZGVyID0gd29ya3NwYWNlLmZpbmQoJy5zZnRwLWxvYWRlcicpO1xuICAgIGlmIChzZnRwTG9hZGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB3b3Jrc3BhY2UuYXBwZW5kKFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzZnRwLWxvYWRlclwiPjxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+J1xuICAgICAgICAgICAgKyAnPHNwYW4gY2xhc3M9XCJsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci10aW55IGlubGluZS1ibG9ja1wiPjwvc3Bhbj4nXG4gICAgICAgICAgICArICc8c3Bhbj5Mb2FkaW5nLi4uPC9zcGFuPidcbiAgICAgICAgICAgICsgJzwvZGl2PjwvZGl2PicpO1xuICAgICAgICBzZnRwTG9hZGVyID0gd29ya3NwYWNlLmZpbmQoJy5zZnRwLWxvYWRlcicpO1xuICAgIH1cbiAgICBzZnRwTG9hZGVyLnNob3coKTtcbn1cblxudmFyIGhpZGVMb2FkZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXRvbU1vZHVsZSA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJyk7XG4gICAgdmFyICQgPSBhdG9tTW9kdWxlLiQ7XG5cbiAgICB2YXIgc2Z0cExvYWRlciA9ICQoJy53b3Jrc3BhY2UnKS5maW5kKCcuc2Z0cC1sb2FkZXInKTtcbiAgICBpZiAoc2Z0cExvYWRlci5sZW5ndGggIT09IDApIHtcbiAgICAgICAgc2Z0cExvYWRlci5oaWRlKCk7XG4gICAgfVxufVxuXG5NZXNzYWdlT2JzZXJ2ZXIucHJvdG90eXBlLm5vdGlmeSA9IGZ1bmN0aW9uKHZhbHVlLCBkYXRhKSB7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlICdiZWdpbl90cmFuc2ZlcnQnOlxuICAgICAgICAgICAgc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Byb2plY3Rfbm90X2ZvdW5kJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnQ3JlYXRlIGEgcHJvamVjdCBiZWZvcmUgdHJ5aW5nIHRvIGNyZWF0ZSBhIGNvbmZpZ3VyYXRpb24gZmlsZScsICdwcm9qZWN0X25vdF9mb3VuZCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbmZpZ3VyYXRpb25fZmlsZV9jcmVhdGlvbl9zdWNjZXNzJzpcbiAgICAgICAgICAgIGNyZWF0ZVN1Y2Nlc3NNZXNzYWdlKCdUaGUgY29uZmlndXJhdGlvbiBmaWxlIHdhcyBjcmVhdGVkIHdpdGggc3VjY2VzcycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbmZpZ3VyYXRpb25fZmlsZV9jcmVhdGlvbl9lcnJvcic6XG4gICAgICAgICAgICBjcmVhdGVFcnJvck1lc3NhZ2UoJ0EgZXJyb3Igb2NjdXJlZCBkdXJpbmcgY29uZmlndXJhdGlvbiBmaWxlIGNyZWF0aW9uJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbm9fY29uZmlndXJhdGlvbl9maWxlX2ZvdW5kJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25maWd1cmF0aW9uX2ZpbGVfbm90X3JlYWRhYmxlJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBpcyBub3QgcmVhZGFibGUnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25maWd1cmF0aW9uX2ZpbGVfbm90X3JlYWRhYmxlJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZSgnVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBpcyBub3QgcmVhZGFibGUnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25maWd1cmF0aW9uX2ZpbGVfc3ludGF4X2Vycm9yJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZShkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nvbm5lY3Rpb25fZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVtb3RlX2RpcmVjdG9yeV9jcmVhdGlvbl9lcnJvcic6XG4gICAgICAgICAgICBjcmVhdGVFcnJvck1lc3NhZ2UoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZW1vdGVfZGlyZWN0b3J5X25vdF9yZWFkYWJsZSc6XG4gICAgICAgICAgICBjcmVhdGVFcnJvck1lc3NhZ2UoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkaXJlY3RvcnlfY3JlYXRpb25fZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBsb2FkX2ZpbGVfZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHJhbnNmZXJ0X2ZpbGVfZXJyb3InOlxuICAgICAgICAgICAgY3JlYXRlRXJyb3JNZXNzYWdlKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXBsb2FkX2ZpbGVfc3VjY2Vzcyc6XG4gICAgICAgICAgICBjcmVhdGVTdWNjZXNzTWVzc2FnZSgnVXBsb2FkIHN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkb3dubG9hZF9maWxlX2Vycm9yJzpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yTWVzc2FnZShkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Rvd25sb2FkX2ZpbGVfc3VjY2Vzcyc6XG4gICAgICAgICAgICBjcmVhdGVTdWNjZXNzTWVzc2FnZSgnRG93bmxvYWQgc3VjY2VzcycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VPYnNlcnZlcjtcbiJdfQ==