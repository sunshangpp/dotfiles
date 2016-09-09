(function() {
  var InlineView, MessageBubble, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  InlineView = (function() {
    function InlineView() {}

    InlineView.prototype.remove = function() {
      return this.hide();
    };

    InlineView.prototype.hide = function() {
      if (this.message != null) {
        this.message.remove();
      }
      return this.message = null;
    };

    InlineView.prototype.render = function(messages, editorView) {
      var currentLine, index, item, limitOnErrorRange, position, show, _i, _len, _ref, _ref1, _results;
      this.hide();
      if (!(messages.length > 0)) {
        return;
      }
      if (editorView.editor.getLastCursor()) {
        position = editorView.editor.getCursorBufferPosition();
      } else {
        return;
      }
      currentLine = position.row + 1;
      limitOnErrorRange = atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange');
      _results = [];
      for (index = _i = 0, _len = messages.length; _i < _len; index = ++_i) {
        item = messages[index];
        show = limitOnErrorRange ? ((_ref = item.range) != null ? _ref.containsPoint(position) : void 0) && index <= 10 : ((_ref1 = item.range) != null ? _ref1.start.row : void 0) + 1 === currentLine;
        if (show) {
          if (this.message) {
            _results.push(this.message.add(item.linter, item.message));
          } else {
            _results.push(this.message = new MessageBubble({
              editorView: editorView,
              title: item.linter,
              line: item.line,
              start: item.range.start.column,
              end: item.range.end.column,
              content: item.message,
              klass: "comment-" + item.level
            }));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return InlineView;

  })();

  MessageBubble = (function(_super) {
    __extends(MessageBubble, _super);

    MessageBubble.content = function(params) {
      return this.div({
        "class": "inline-message " + params.klass,
        style: params.style
      }, (function(_this) {
        return function() {
          var msg, _i, _len, _ref, _results;
          _ref = params.messages;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            msg = _ref[_i];
            _results.push(_this.div({
              "class": "message-content"
            }, function() {
              _this.div({
                "class": "message-source"
              }, function() {
                return _this.raw(msg.src);
              });
              return _this.raw(msg.content);
            }));
          }
          return _results;
        };
      })(this));
    };

    function MessageBubble(_arg) {
      var content, editorView, end, klass, line, min, pageData, start, style, title;
      editorView = _arg.editorView, title = _arg.title, line = _arg.line, start = _arg.start, end = _arg.end, content = _arg.content, klass = _arg.klass, min = _arg.min;
      this.title = title;
      this.line = line - 1;
      this.start = start;
      this.end = end;
      this.content = content;
      this.klass = klass;
      this.editor = editorView.editor;
      this.editorView = editorView;
      this.messages = [
        {
          content: this.content,
          src: this.title
        }
      ];
      style = this.calculateStyle(this.line, this.start);
      MessageBubble.__super__.constructor.call(this, {
        messages: this.messages,
        klass: this.klass,
        style: style
      });
      if (this.min) {
        this.minimize();
      }
      pageData = editorView.find(".overlayer");
      if (pageData) {
        pageData.first().prepend(this);
      }
    }

    MessageBubble.prototype.calculateStyle = function(line, start) {
      var fstPos, last, lastPos, left, top;
      if (this.editorView && this.editor) {
        last = this.editor.getBuffer().lineLengthForRow(line);
        fstPos = this.editorView.pixelPositionForBufferPosition({
          row: line + 1,
          column: 0
        });
        lastPos = this.editorView.pixelPositionForBufferPosition({
          row: line,
          column: start
        });
        top = fstPos.top;
        left = lastPos.left;
        return "position:absolute;left:" + left + "px;top:" + top + "px;";
      }
    };

    MessageBubble.prototype.renderMsg = function(msg) {
      return View.render(function() {
        return this.div({
          "class": "message-content"
        }, (function(_this) {
          return function() {
            _this.div({
              "class": "message-source"
            }, function() {
              return _this.raw(msg.src);
            });
            return _this.raw(msg.content);
          };
        })(this));
      });
    };

    MessageBubble.prototype.update = function() {
      var msg;
      this.find(".message-content").remove();
      return this.append((function() {
        var _i, _len, _ref, _results;
        _ref = this.messages;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          msg = _ref[_i];
          _results.push(this.renderMsg(msg));
        }
        return _results;
      }).call(this));
    };

    MessageBubble.prototype.add = function(title, content) {
      this.messages.push({
        content: content,
        src: title
      });
      return this.update();
    };

    return MessageBubble;

  })(View);

  module.exports = InlineView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRU07NEJBQ0o7O0FBQUEseUJBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUVOLElBQUMsQ0FBQSxJQUFELENBQUEsRUFGTTtJQUFBLENBQVIsQ0FBQTs7QUFBQSx5QkFJQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFxQixvQkFBckI7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBLENBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUZQO0lBQUEsQ0FKTixDQUFBOztBQUFBLHlCQVFBLE1BQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxVQUFYLEdBQUE7QUFFTixVQUFBLDRGQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLENBQWMsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBaEMsQ0FBQTtBQUFBLGNBQUEsQ0FBQTtPQUhBO0FBS0EsTUFBQSxJQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBbEIsQ0FBQSxDQUFIO0FBRUUsUUFBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBbEIsQ0FBQSxDQUFYLENBRkY7T0FBQSxNQUFBO0FBSUUsY0FBQSxDQUpGO09BTEE7QUFBQSxNQVVBLFdBQUEsR0FBYyxRQUFRLENBQUMsR0FBVCxHQUFlLENBVjdCLENBQUE7QUFBQSxNQWNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4Q0FBaEIsQ0FkcEIsQ0FBQTtBQWdCQTtXQUFBLCtEQUFBOytC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
//# sourceURL=/Users/ssun/.atom/packages/linter/lib/inline-view.coffee