function MessageObserver() {}

MessageObserver.prototype.notify = function (value, data) {
    switch (value) {
        case "project_not_found":
            console.log("Create a project before trying to create a configuration file");
            break;
        case "configuration_file_creation_success":
            console.log("The configuration file was created with success");
            break;
        case "configuration_file_creation_error":
            console.log("A error occured during configuration file creation : " + data);
            break;
        case "configuration_file_doesnt_exist":
            console.log("The configuration file doesn't exist");
            break;
        case "configuration_file_exists":
            console.log("The configuration file exists");
            break;
        case "configuration_ready":
            console.log("The configuration is ready");
            console.log(data);
            break;
        case "connection_ready":
            console.log("The connection is ready");
            console.log(data);
            break;
        case "connection_error":
            console.log(data.message);
            break;
        case "connection_sftp_end":
        case "connection_ftp_end":
            console.log("The sftp connection ends");
            break;
        case "sftp_mkdir":
        case "ftp_mkdir":
            console.log("Creation of directory : " + data);
            break;
        case "sftp_mkdir_upload_file_error":
        case "ftp_mkdir_upload_file_error":
            console.log("Creation of directory " + data + " fail");
            break;
        case "upload_file":
        case "sftp_upload_file":
        case "ftp_upload_file":
            console.log("Upload of " + data);
            break;
        case "upload_file_error":
            console.log(data.message);
            break;
        case "upload_file_success":
        case "sftp_upload_file_success":
        case "ftp_upload_file_success":
            console.log("Upload success");
            break;
        case "download_file":
        case "sftp_download_file":
        case "ftp_download_file":
            console.log("Download of " + data);
            break;
        case "download_file_error":
        case "sftp_download_file_error":
        case "ftp_download_file_error":
            console.log(data.message);
            break;
        case "download_file_success":
        case "sftp_download_file_success":
        case "ftp_download_file_success":
            console.log("Download success");
            break;
        default:
            break;
    }
};

module.exports = MessageObserver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvb2JzZXJ2ZXJzL0NvbnNvbGVPYnNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGVBQWUsR0FBRyxFQUMxQjs7QUFFRCxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDckQsWUFBUSxLQUFLO0FBQ1QsYUFBSyxtQkFBbUI7QUFDcEIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUM3RSxrQkFBTTtBQUFBLEFBQ1YsYUFBSyxxQ0FBcUM7QUFDdEMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsaURBQWlELENBQUMsQ0FBQztBQUMvRCxrQkFBTTtBQUFBLEFBQ1YsYUFBSyxtQ0FBbUM7QUFDcEMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsdURBQXVELEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDNUUsa0JBQU07QUFBQSxBQUNWLGFBQUssaUNBQWlDO0FBQ2xDLG1CQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDcEQsa0JBQU07QUFBQSxBQUNWLGFBQUssMkJBQTJCO0FBQzVCLG1CQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDN0Msa0JBQU07QUFBQSxBQUNWLGFBQUsscUJBQXFCO0FBQ3RCLG1CQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxBQUNWLGFBQUssa0JBQWtCO0FBQ25CLG1CQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxBQUNWLGFBQUssa0JBQWtCO0FBQ25CLG1CQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxQixrQkFBTTtBQUFBLEFBQ1YsYUFBSyxxQkFBcUIsQ0FBQztBQUMzQixhQUFLLG9CQUFvQjtBQUNyQixtQkFBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3hDLGtCQUFNO0FBQUEsQUFDVixhQUFLLFlBQVksQ0FBQztBQUNsQixhQUFLLFdBQVc7QUFDWixtQkFBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMvQyxrQkFBTTtBQUFBLEFBQ1YsYUFBSyw4QkFBOEIsQ0FBQztBQUNwQyxhQUFLLDZCQUE2QjtBQUM5QixtQkFBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDdkQsa0JBQU07QUFBQSxBQUNWLGFBQUssYUFBYSxDQUFDO0FBQ25CLGFBQUssa0JBQWtCLENBQUM7QUFDeEIsYUFBSyxpQkFBaUI7QUFDbEIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ2pDLGtCQUFNO0FBQUEsQUFDVixhQUFLLG1CQUFtQjtBQUNwQixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUIsa0JBQU07QUFBQSxBQUNWLGFBQUsscUJBQXFCLENBQUM7QUFDM0IsYUFBSywwQkFBMEIsQ0FBQztBQUNoQyxhQUFLLHlCQUF5QjtBQUMxQixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlCLGtCQUFNO0FBQUEsQUFDVixhQUFLLGVBQWUsQ0FBQztBQUNyQixhQUFLLG9CQUFvQixDQUFDO0FBQzFCLGFBQUssbUJBQW1CO0FBQ3BCLG1CQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNuQyxrQkFBTTtBQUFBLEFBQ1YsYUFBSyxxQkFBcUIsQ0FBQztBQUMzQixhQUFLLDBCQUEwQixDQUFDO0FBQ2hDLGFBQUsseUJBQXlCO0FBQzFCLG1CQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxQixrQkFBTTtBQUFBLEFBQ1YsYUFBSyx1QkFBdUIsQ0FBQztBQUM3QixhQUFLLDRCQUE0QixDQUFDO0FBQ2xDLGFBQUssMkJBQTJCO0FBQzVCLG1CQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEMsa0JBQU07QUFBQSxBQUNWO0FBQ0ksa0JBQU07QUFBQSxLQUNiO0NBQ0osQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9zZnRwLWRlcGxveW1lbnQvbGliL29ic2VydmVycy9Db25zb2xlT2JzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBNZXNzYWdlT2JzZXJ2ZXIoKSB7XG59XG5cbk1lc3NhZ2VPYnNlcnZlci5wcm90b3R5cGUubm90aWZ5ID0gZnVuY3Rpb24odmFsdWUsIGRhdGEpIHtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgIGNhc2UgXCJwcm9qZWN0X25vdF9mb3VuZFwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGUgYSBwcm9qZWN0IGJlZm9yZSB0cnlpbmcgdG8gY3JlYXRlIGEgY29uZmlndXJhdGlvbiBmaWxlXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25maWd1cmF0aW9uX2ZpbGVfY3JlYXRpb25fc3VjY2Vzc1wiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY29uZmlndXJhdGlvbiBmaWxlIHdhcyBjcmVhdGVkIHdpdGggc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29uZmlndXJhdGlvbl9maWxlX2NyZWF0aW9uX2Vycm9yXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkEgZXJyb3Igb2NjdXJlZCBkdXJpbmcgY29uZmlndXJhdGlvbiBmaWxlIGNyZWF0aW9uIDogXCIgKyBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29uZmlndXJhdGlvbl9maWxlX2RvZXNudF9leGlzdFwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY29uZmlndXJhdGlvbiBmaWxlIGRvZXNuJ3QgZXhpc3RcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbmZpZ3VyYXRpb25fZmlsZV9leGlzdHNcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBleGlzdHNcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbmZpZ3VyYXRpb25fcmVhZHlcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIGNvbmZpZ3VyYXRpb24gaXMgcmVhZHlcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29ubmVjdGlvbl9yZWFkeVwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY29ubmVjdGlvbiBpcyByZWFkeVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0aW9uX2Vycm9yXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0aW9uX3NmdHBfZW5kXCI6XG4gICAgICAgIGNhc2UgXCJjb25uZWN0aW9uX2Z0cF9lbmRcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHNmdHAgY29ubmVjdGlvbiBlbmRzXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZnRwX21rZGlyXCI6XG4gICAgICAgIGNhc2UgXCJmdHBfbWtkaXJcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpb24gb2YgZGlyZWN0b3J5IDogXCIgKyBkYXRhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2Z0cF9ta2Rpcl91cGxvYWRfZmlsZV9lcnJvclwiOlxuICAgICAgICBjYXNlIFwiZnRwX21rZGlyX3VwbG9hZF9maWxlX2Vycm9yXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW9uIG9mIGRpcmVjdG9yeSBcIiArIGRhdGEgKyBcIiBmYWlsXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ1cGxvYWRfZmlsZVwiOlxuICAgICAgICBjYXNlIFwic2Z0cF91cGxvYWRfZmlsZVwiOlxuICAgICAgICBjYXNlIFwiZnRwX3VwbG9hZF9maWxlXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBvZiBcIiArIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ1cGxvYWRfZmlsZV9lcnJvclwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidXBsb2FkX2ZpbGVfc3VjY2Vzc1wiOlxuICAgICAgICBjYXNlIFwic2Z0cF91cGxvYWRfZmlsZV9zdWNjZXNzXCI6XG4gICAgICAgIGNhc2UgXCJmdHBfdXBsb2FkX2ZpbGVfc3VjY2Vzc1wiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGxvYWQgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZG93bmxvYWRfZmlsZVwiOlxuICAgICAgICBjYXNlIFwic2Z0cF9kb3dubG9hZF9maWxlXCI6XG4gICAgICAgIGNhc2UgXCJmdHBfZG93bmxvYWRfZmlsZVwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEb3dubG9hZCBvZiBcIiArIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkb3dubG9hZF9maWxlX2Vycm9yXCI6XG4gICAgICAgIGNhc2UgXCJzZnRwX2Rvd25sb2FkX2ZpbGVfZXJyb3JcIjpcbiAgICAgICAgY2FzZSBcImZ0cF9kb3dubG9hZF9maWxlX2Vycm9yXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkb3dubG9hZF9maWxlX3N1Y2Nlc3NcIjpcbiAgICAgICAgY2FzZSBcInNmdHBfZG93bmxvYWRfZmlsZV9zdWNjZXNzXCI6XG4gICAgICAgIGNhc2UgXCJmdHBfZG93bmxvYWRfZmlsZV9zdWNjZXNzXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvd25sb2FkIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZU9ic2VydmVyO1xuIl19