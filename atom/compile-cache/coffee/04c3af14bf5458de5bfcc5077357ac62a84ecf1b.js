(function() {
  module.exports = {
    configDefaults: {
      phpExecutablePath: null
    },
    activate: function() {
      return console.log('activate linter-php');
    }
  };

}).call(this);
