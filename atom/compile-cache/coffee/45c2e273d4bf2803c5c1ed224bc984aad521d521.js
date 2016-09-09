(function() {
  module.exports = {
    config: {
      path: {
        title: 'gorename path',
        description: 'Set this if the gorename executable is not found within your PATH',
        type: 'string',
        "default": 'gorename'
      }
    },
    activate: function() {
      return new (require('./go-rename-view'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcmVuYW1lL2xpYi9nby1yZW5hbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLG1FQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLFVBSFQ7T0FERjtLQURGO0FBQUEsSUFPQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsR0FBQSxDQUFBLENBQUssT0FBQSxDQUFRLGtCQUFSLENBQUQsRUFESTtJQUFBLENBUFY7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ssun/.atom/packages/go-rename/lib/go-rename.coffee
