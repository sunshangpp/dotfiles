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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvb2JzZXJ2ZXJzL0NvbnNvbGVPYnNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGVBQWUsR0FBRyxFQUMxQjs7QUFFRCxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDckQsWUFBUSxLQUFLO0FBQ1QsYUFBSyxtQkFBbUI7QUFDcEIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUM3RSxrQkFBTTtBQUFBLGFBQ0wscUNBQXFDO0FBQ3RDLG1CQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7QUFDL0Qsa0JBQU07QUFBQSxhQUNMLG1DQUFtQztBQUNwQyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyx1REFBdUQsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM1RSxrQkFBTTtBQUFBLGFBQ0wsaUNBQWlDO0FBQ2xDLG1CQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDcEQsa0JBQU07QUFBQSxhQUNMLDJCQUEyQjtBQUM1QixtQkFBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQzdDLGtCQUFNO0FBQUEsYUFDTCxxQkFBcUI7QUFDdEIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUMxQyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLGFBQ0wsa0JBQWtCO0FBQ25CLG1CQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkMsbUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxhQUNMLGtCQUFrQjtBQUNuQixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUIsa0JBQU07QUFBQSxhQUNMLHFCQUFxQixDQUFDO0FBQzNCLGFBQUssb0JBQW9CO0FBQ3JCLG1CQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDeEMsa0JBQU07QUFBQSxhQUNMLFlBQVksQ0FBQztBQUNsQixhQUFLLFdBQVc7QUFDWixtQkFBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMvQyxrQkFBTTtBQUFBLGFBQ0wsOEJBQThCLENBQUM7QUFDcEMsYUFBSyw2QkFBNkI7QUFDOUIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGtCQUFNO0FBQUEsYUFDTCxhQUFhLENBQUM7QUFDbkIsYUFBSyxrQkFBa0IsQ0FBQztBQUN4QixhQUFLLGlCQUFpQjtBQUNsQixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDakMsa0JBQU07QUFBQSxhQUNMLG1CQUFtQjtBQUNwQixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUIsa0JBQU07QUFBQSxhQUNMLHFCQUFxQixDQUFDO0FBQzNCLGFBQUssMEJBQTBCLENBQUM7QUFDaEMsYUFBSyx5QkFBeUI7QUFDMUIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixrQkFBTTtBQUFBLGFBQ0wsZUFBZSxDQUFDO0FBQ3JCLGFBQUssb0JBQW9CLENBQUM7QUFDMUIsYUFBSyxtQkFBbUI7QUFDcEIsbUJBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ25DLGtCQUFNO0FBQUEsYUFDTCxxQkFBcUIsQ0FBQztBQUMzQixhQUFLLDBCQUEwQixDQUFDO0FBQ2hDLGFBQUsseUJBQXlCO0FBQzFCLG1CQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxQixrQkFBTTtBQUFBLGFBQ0wsdUJBQXVCLENBQUM7QUFDN0IsYUFBSyw0QkFBNEIsQ0FBQztBQUNsQyxhQUFLLDJCQUEyQjtBQUM1QixtQkFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDLGtCQUFNO0FBQUE7QUFFTixrQkFBTTtBQUFBLEtBQ2I7Q0FDSixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL3NmdHAtZGVwbG95bWVudC9saWIvb2JzZXJ2ZXJzL0NvbnNvbGVPYnNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIE1lc3NhZ2VPYnNlcnZlcigpIHtcbn1cblxuTWVzc2FnZU9ic2VydmVyLnByb3RvdHlwZS5ub3RpZnkgPSBmdW5jdGlvbih2YWx1ZSwgZGF0YSkge1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgY2FzZSBcInByb2plY3Rfbm90X2ZvdW5kXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0ZSBhIHByb2plY3QgYmVmb3JlIHRyeWluZyB0byBjcmVhdGUgYSBjb25maWd1cmF0aW9uIGZpbGVcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbmZpZ3VyYXRpb25fZmlsZV9jcmVhdGlvbl9zdWNjZXNzXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBjb25maWd1cmF0aW9uIGZpbGUgd2FzIGNyZWF0ZWQgd2l0aCBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25maWd1cmF0aW9uX2ZpbGVfY3JlYXRpb25fZXJyb3JcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQSBlcnJvciBvY2N1cmVkIGR1cmluZyBjb25maWd1cmF0aW9uIGZpbGUgY3JlYXRpb24gOiBcIiArIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25maWd1cmF0aW9uX2ZpbGVfZG9lc250X2V4aXN0XCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBjb25maWd1cmF0aW9uIGZpbGUgZG9lc24ndCBleGlzdFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29uZmlndXJhdGlvbl9maWxlX2V4aXN0c1wiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY29uZmlndXJhdGlvbiBmaWxlIGV4aXN0c1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY29uZmlndXJhdGlvbl9yZWFkeVwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY29uZmlndXJhdGlvbiBpcyByZWFkeVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb25uZWN0aW9uX3JlYWR5XCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZSBjb25uZWN0aW9uIGlzIHJlYWR5XCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3Rpb25fZXJyb3JcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbm5lY3Rpb25fc2Z0cF9lbmRcIjpcbiAgICAgICAgY2FzZSBcImNvbm5lY3Rpb25fZnRwX2VuZFwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgc2Z0cCBjb25uZWN0aW9uIGVuZHNcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNmdHBfbWtkaXJcIjpcbiAgICAgICAgY2FzZSBcImZ0cF9ta2RpclwiOlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGlvbiBvZiBkaXJlY3RvcnkgOiBcIiArIGRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzZnRwX21rZGlyX3VwbG9hZF9maWxlX2Vycm9yXCI6XG4gICAgICAgIGNhc2UgXCJmdHBfbWtkaXJfdXBsb2FkX2ZpbGVfZXJyb3JcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpb24gb2YgZGlyZWN0b3J5IFwiICsgZGF0YSArIFwiIGZhaWxcIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInVwbG9hZF9maWxlXCI6XG4gICAgICAgIGNhc2UgXCJzZnRwX3VwbG9hZF9maWxlXCI6XG4gICAgICAgIGNhc2UgXCJmdHBfdXBsb2FkX2ZpbGVcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBsb2FkIG9mIFwiICsgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInVwbG9hZF9maWxlX2Vycm9yXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ1cGxvYWRfZmlsZV9zdWNjZXNzXCI6XG4gICAgICAgIGNhc2UgXCJzZnRwX3VwbG9hZF9maWxlX3N1Y2Nlc3NcIjpcbiAgICAgICAgY2FzZSBcImZ0cF91cGxvYWRfZmlsZV9zdWNjZXNzXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkb3dubG9hZF9maWxlXCI6XG4gICAgICAgIGNhc2UgXCJzZnRwX2Rvd25sb2FkX2ZpbGVcIjpcbiAgICAgICAgY2FzZSBcImZ0cF9kb3dubG9hZF9maWxlXCI6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvd25sb2FkIG9mIFwiICsgZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRvd25sb2FkX2ZpbGVfZXJyb3JcIjpcbiAgICAgICAgY2FzZSBcInNmdHBfZG93bmxvYWRfZmlsZV9lcnJvclwiOlxuICAgICAgICBjYXNlIFwiZnRwX2Rvd25sb2FkX2ZpbGVfZXJyb3JcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRvd25sb2FkX2ZpbGVfc3VjY2Vzc1wiOlxuICAgICAgICBjYXNlIFwic2Z0cF9kb3dubG9hZF9maWxlX3N1Y2Nlc3NcIjpcbiAgICAgICAgY2FzZSBcImZ0cF9kb3dubG9hZF9maWxlX3N1Y2Nlc3NcIjpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG93bmxvYWQgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlT2JzZXJ2ZXI7XG4iXX0=