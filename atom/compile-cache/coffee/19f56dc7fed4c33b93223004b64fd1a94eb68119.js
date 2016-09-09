(function() {
  var ChildProcess, ScalaProcess;

  ChildProcess = require('child_process');

  module.exports = ScalaProcess = (function() {
    function ScalaProcess(executable) {
      this.executable = executable;
    }

    ScalaProcess.prototype.setBlockCallback = function(blockCallback) {
      return this.blockCallback = blockCallback;
    };

    ScalaProcess.prototype.setErrorCallback = function(errorCallback) {
      return this.errorCallback = errorCallback;
    };

    ScalaProcess.prototype.initialize = function(readyCallback) {
      console.log("Spawning scala process: " + this.executable);
      this.scala = ChildProcess.spawn(this.executable);
      this.scala.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.processOut(data);
        };
      })(this));
      this.scala.stderr.on('data', (function(_this) {
        return function(data) {
          return _this.processErr(data);
        };
      })(this));
      this.scala.stdout.on('close', (function(_this) {
        return function(res) {
          return _this.processClose(res);
        };
      })(this));
      this.readyCallback = readyCallback;
      return this.waitingFirstLine = true;
    };

    ScalaProcess.prototype.buffer = "";

    ScalaProcess.prototype.error_buffer = "";

    ScalaProcess.prototype.constants = {
      END_OF_BLOCK: "//[SCALA_WORKSHEET_END_OF_DATA]\n"
    };

    ScalaProcess.prototype.writeBlock = function(block) {
      this.scala.stdin.write(block);
      this.scala.stdin.write("\n");
      return this.scala.stdin.write(this.constants.END_OF_BLOCK);
    };

    ScalaProcess.prototype.processResultBlock = function(resultBlock) {
      if (this.waitingFirstLine) {
        this.waitingFirstLine = false;
        return this.readyCallback();
      } else {
        return this.blockCallback(resultBlock);
      }
    };

    ScalaProcess.prototype.processOut = function(data) {
      var block, blocks, str, _i, _len, _results;
      str = data.toString('utf-8');
      this.buffer += str;
      if (str.contains("\n")) {
        blocks = this.buffer.split(this.constants.END_OF_BLOCK);
        this.buffer = blocks.pop();
        _results = [];
        for (_i = 0, _len = blocks.length; _i < _len; _i++) {
          block = blocks[_i];
          _results.push(this.processResultBlock(block));
        }
        return _results;
      }
    };

    ScalaProcess.prototype.processErr = function(data) {
      var token, tokens, _i, _len, _results;
      this.error_buffer += data.toString('utf-8');
      if (this.error_buffer.contains("\n")) {
        tokens = this.error_buffer.split("\n");
        this.error_buffer = tokens.pop();
        _results = [];
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          _results.push(this.errorCallback(token));
        }
        return _results;
      }
    };

    ScalaProcess.prototype.processClose = function(res) {
      return console.log("scala process closed with res: " + res);
    };

    return ScalaProcess;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHNCQUFDLFVBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxVQUFkLENBRFc7SUFBQSxDQUFiOztBQUFBLDJCQUVBLGdCQUFBLEdBQWtCLFNBQUMsYUFBRCxHQUFBO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCLGNBREQ7SUFBQSxDQUZsQixDQUFBOztBQUFBLDJCQUtBLGdCQUFBLEdBQWtCLFNBQUMsYUFBRCxHQUFBO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCLGNBREQ7SUFBQSxDQUxsQixDQUFBOztBQUFBLDJCQVFBLFVBQUEsR0FBWSxTQUFDLGFBQUQsR0FBQTtBQUNWLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSwwQkFBQSxHQUF5QixJQUFDLENBQUEsVUFBdkMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLFlBQVksQ0FBQyxLQUFiLENBQW1CLElBQUMsQ0FBQSxVQUFwQixDQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQWQsQ0FBaUIsTUFBakIsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUFVLEtBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQUFWO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFkLENBQWlCLE1BQWpCLEVBQXlCLENBQUEsU0FB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
//# sourceURL=/Users/ssun/.atom/packages/scala-worksheet/lib/scala-process.coffee