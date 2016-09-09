module.exports = {
  nbFinishedFile: 0,
  initConnection: function() {
    var Connection = require('ssh2');
    connection = new Connection();
    connection.on('error', function(err) {
      console.log('Connection :: error :: ' + err);
    });

    connection.on('end', function() {
      console.log('Connection :: end');
    });

    connection.on('close', function(had_error) {
      console.log('Connection :: close');
    });
    return connection;
  },

  uploadFiles: function (connection, aFiles) {

    var fs = require('fs');
    var path = require('path');
    var SFTP = require('./SFTP');

    connection.sftp(function(err, sftp) {
      if (err)
        throw err;

      sftp.on('end', function() {
        console.log('SFTP :: SFTP session closed');
      });

      aFiles.forEach(function(file) {
        var relativePath = path.relative(atom.project.path, file.src);
        console.log('SFTP :: Mkdir :: ' + path.dirname(file.dest));
        connection.exec('mkdir -p ' + path.dirname(file.dest), function (err) {
          if (err) {

            SFTP.createMessage('Upload of : ' + relativePath, relativePath, 'error');
            throw err;
          }

          console.log('SFTP :: Fast put :: ' + file.src + ' -> ' + file.dest);
          sftp.fastPut(file.src, file.dest, function(err) {
            if (err) {
              SFTP.createMessage('Upload of : ' + relativePath, relativePath, 'error');
              throw err;
            }
            SFTP.createMessage('Upload of : ' + relativePath, relativePath, 'success');
            sftp.end();
          });
        });
      });
    });
  },

  downloadFiles: function (connection, aFiles) {

    var fs = require('fs');
    var path = require('path');
    var SFTP = require('./SFTP');

    connection.sftp(function(err, sftp) {
      if (err)
        throw err;

      sftp.on('end', function() {
        console.log('SFTP :: SFTP session closed');
      });

      aFiles.forEach(function(file) {
        var relativePath = path.relative(atom.project.path, file.dest);
        console.log('SFTP :: Fast get :: ' + file.src + ' -> ' + file.dest);
        sftp.fastGet(file.src, file.dest, function(err) {
          if (err) {
            SFTP.createMessage('Download of : ' + relativePath, relativePath, 'error');
            throw err;
          }
          SFTP.createMessage('Download of : ' + relativePath, relativePath, 'success');
          sftp.end();
        });
      });
    });
  },

  uploadCurrentFile: function() {
    var fs = require('fs');
    var path = require('path');
    var SFTP = require('./SFTP');

    var editor = atom.workspace.activePaneItem;
    var srcFile = editor.buffer.file.path;
    var fileName = path.basename(srcFile);

    fs.readFile(path.join(atom.project.path, "sftp-config.json"), 'utf8', function(err, data) {
      if (err)
        throw err;

      var config = JSON.parse(data);
      var connection = SFTP.initConnection();

      connection.on('ready', function () {
        var relativePath = path.relative(atom.project.path, srcFile);
        var destFile = path.join(config.destDir, relativePath);

        SFTP.uploadFiles(connection, [
          {src:srcFile, dest:destFile}
        ]);
      });

      connection.connect(config);
    });
  },

  uploadOpenFiles: function() {
    var fs = require('fs');
    var path = require('path');
    var SFTP = require('./SFTP');

    var aPath = [];
    var items = atom.workspace.getActivePane().getItems();
    for (var i in items) {
      aPath.push(items[i].buffer.file.path);
    }

    fs.readFile(path.join(atom.project.path, "sftp-config.json"), 'utf8', function(err, data) {
      if (err)
        throw err;

      var config = JSON.parse(data);
      var aFiles = [];
      for (var i in aPath) {
        var srcFile = aPath[i];
        var relativePath = path.relative(atom.project.path, srcFile);
        var destFile = path.join(config.destDir, relativePath);

        aFiles.push({src:srcFile, dest:destFile});
      }

      var connection = SFTP.initConnection();

      connection.on('ready', function () {
        SFTP.uploadFiles(connection, aFiles);
      });

      connection.connect(config);
    });
  },

  createMessage: function(message, file, classes) {
    var atomModule = require('atom');
    var $ = atomModule.$;
    var md5 = require('MD5');

    var workspace = $(".workspace");
    var sftpMessages = workspace.find(".sftp-messages ul");
    if (sftpMessages.length === 0) {
      $('.workspace').append('<div class="sftp-messages"><ul></ul></div>');
      sftpMessages = workspace.find(".sftp-messages ul");
    }

    sftpMessages.append('<li id="'+md5(file)+'" class="message '+classes+'">'+message+'</li>');

    setTimeout(function() {
      var message = $("#"+md5(file));
      var messages = $(".sftp-messages ul").children('.message');
      message.remove();
      if (sftpMessages.find('.message').length === 0) {
        sftpMessages.parent().remove();
      }
    }, 3000);
  },

  downloadCurrentFile: function() {
    // console.log('download current file');
    var fs = require('fs');
    var path = require('path');
    var SFTP = require('./SFTP');

    var editor = atom.workspace.activePaneItem;
    var destFile = editor.buffer.file.path;
    var fileName = path.basename(destFile);
    var relativePath = path.relative(atom.project.path, destFile);

    atom.confirm({
      message: "You will download the current file, be careful, it will be overwritted.",
      detailedMessage: relativePath,
      buttons: {
        "Overwrite": function () {
          fs.readFile(path.join(atom.project.path, "sftp-config.json"), 'utf8', function(err, data) {
            if (err)
              throw err;

            var config = JSON.parse(data);
            var connection = SFTP.initConnection();

            connection.on('ready', function () {

              var srcFile = path.join(config.destDir, relativePath);

              SFTP.downloadFiles(connection, [
                {src:srcFile, dest:destFile}
              ]);
            });

            connection.connect(config);
          });
        },
        "Cancel": null
      }
    });
  },

  mapToRemote: function() {
    // console.log('map to remote');
    var fs = require('fs');
    var path = require('path');
    var config = {
      host: "your_host",
      username: "your_user",
      password: "your_pass",
      port: "your_port",
      destDir: "destination_directory"
    };
    fs.writeFile(path.join(atom.project.path, "sftp-config.json"), JSON.stringify(config, undefined, 2));
  }

  // uploadSelection: function(entry) {
  //   console.log('upload selection');
  //   var atomModule = require('atom');
  //   var fs = require('fs');
  //   var path = require('path');
  //   var SFTP = require('./SFTP');
  //
  //   var $ = atomModule.$;
  //   var aPath = [];
  //
  //   $(".tree-view .selected").each(function () {
  //     aPath.push($(this).view().getPath());
  //   });
  //
  //   fs.readFile(path.join(atom.project.path, "sftp-config.json"), 'utf8', function(err, data) {
  //     if (err)
  //       throw err;
  //
  //     var config = JSON.parse(data);
  //     var aFiles = [];
  //     for (var i in aPath) {
  //       var srcFile = aPath[i];
  //       var relativePath = path.relative(atom.project.path, srcFile);
  //       var destFile = path.join(config.destDir, relativePath);
  //
  //       aFiles.push({src:srcFile, dest:destFile});
  //     }
  //
  //     var connection = SFTP.initConnection();
  //
  //     connection.on('ready', function () {
  //       SFTP.uploadFiles(connection, aFiles);
  //     });
  //
  //     connection.connect(config);
  //   });
  // }
};
