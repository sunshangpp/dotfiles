"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  config: {
    executablePath: {
      title: 'Executable path',
      type: 'string',
      description: 'Path to puppet-lint executable',
      'default': 'puppet-lint'
    },
    automaticFix: {
      title: 'Attempt to automatically fix errors',
      type: 'boolean',
      'default': false
    },
    skipRigthToLeftRelationship: {
      title: 'Skip the right_to_left_relationship check',
      type: 'boolean',
      'default': false
    },
    skipAutoloaderLayout: {
      title: 'Skip the autoloader_layout check',
      type: 'boolean',
      'default': false
    },
    skipNamesContainingDash: {
      title: 'Skip the names_containing_dash check',
      type: 'boolean',
      'default': false
    },
    skipClassInherithsFromParamClass: {
      title: 'Skip the class_inherits_from_params_class check',
      type: 'boolean',
      'default': false
    },
    skipParameterOrder: {
      title: 'Skip the parameter_order check',
      type: 'boolean',
      'default': false
    },
    skipInheritsAcrossNamespaces: {
      title: 'Skip the inherits_across_namespaces check',
      type: 'boolean',
      'default': false
    },
    skipNestedClassesOrDefines: {
      title: 'Skip the nested_classes_or_defines check',
      type: 'boolean',
      'default': false
    },
    skipVariableScope: {
      title: 'Skip the variable_scope check',
      type: 'boolean',
      'default': false
    },
    skipSlashComments: {
      title: 'Skip the slash_comments check',
      type: 'boolean',
      'default': false
    },
    skipStarComments: {
      title: 'Skip the star_comments check',
      type: 'boolean',
      'default': false
    },
    skipSelectorInsideResource: {
      title: 'Skip the selector_inside_resource check',
      type: 'boolean',
      'default': false
    },
    skipCaseWithoutDefault: {
      title: 'Skip the case_without_default check',
      type: 'boolean',
      'default': false
    },
    skipDocumentation: {
      title: 'Skip the documentation check',
      type: 'boolean',
      'default': false
    },
    skipDoubleQuotedStrings: {
      title: 'Skip the double_quoted_strings check',
      type: 'boolean',
      'default': false
    },
    skipOnlyVariableString: {
      title: 'Skip the only_variable_string check',
      type: 'boolean',
      'default': false
    },
    skipVariablesNotEnclosed: {
      title: 'Skip the variables_not_enclosed check',
      type: 'boolean',
      'default': false
    },
    skipSingleQuoteStringWithVariables: {
      title: 'Skip the single_quote_string_with_variables check',
      type: 'boolean',
      'default': false
    },
    skipQuotedBooleans: {
      title: 'Skip the quoted_booleans check',
      type: 'boolean',
      'default': false
    },
    skipPuppetUrlWhitoutModules: {
      title: 'Skip the puppet_url_without_modules check',
      type: 'boolean',
      'default': false
    },
    skipVariableContainsDash: {
      title: 'Skip the variable_contains_dash check',
      type: 'boolean',
      'default': false
    },
    skipHardTabs: {
      title: 'Skip the hard_tabs check',
      type: 'boolean',
      'default': false
    },
    skipTrailingWhitespace: {
      title: 'Skip the trailing_whitespace check',
      type: 'boolean',
      'default': false
    },
    skip80Chars: {
      title: 'Skip the 80chars check (puppet-lint <= 1.1.0)',
      type: 'boolean',
      'default': false
    },
    skip140Chars: {
      title: 'Skip the 140chars check (puppet-lint > 1.1.0)',
      type: 'boolean',
      'default': false
    },
    skip2spSoftTabs: {
      title: 'Skip the 2sp_soft_tabs check',
      type: 'boolean',
      'default': false
    },
    skipArrowAlignment: {
      title: 'Skip the arrow_alignment check',
      type: 'boolean',
      'default': false
    },
    skipUnquotedResourceTitle: {
      title: 'Skip the unquoted_resource_title check',
      type: 'boolean',
      'default': false
    },
    skipEnsureFirstParam: {
      title: 'Skip the ensure_first_param check',
      type: 'boolean',
      'default': false
    },
    skipDuplicateParams: {
      title: 'Skip the duplicate_params check',
      type: 'boolean',
      'default': false
    },
    skipUnquotedFileMode: {
      title: 'Skip the unquoted_file_mode check',
      type: 'boolean',
      'default': false
    },
    skipFileMode: {
      title: 'Skip the file_mode check',
      type: 'boolean',
      'default': false
    },
    skipEnsureNotSymlinkTarget: {
      title: 'Skip the ensure_not_symlink_target check',
      type: 'boolean',
      'default': false
    },
    skipUnquotedNodeName: {
      title: 'Skip the unquoted_node_name check',
      type: 'boolean',
      'default': false
    }
  },

  activate: function activate() {
    var helpers = require('atom-linter');
    var command = atom.config.get('linter-puppet-lint.executablePath');
    var args = ['--help'];

    require('atom-package-deps').install('linter-puppet-lint');

    // Check if puppet-lint has support for the %{column} placeholder
    helpers.exec(command, args).then(function (output) {
      var regexColumn = /%{column}/;

      if (regexColumn.exec(output) === null) {
        atom.config.set('linter-puppet-lint.oldVersion', true);
        atom.notifications.addError('You are using an old version of puppet-lint!', {
          detail: "Please upgrade your version of puppet-lint.\n" + 'Check the README for further information.'
        });
      } else {
        atom.config.set('linter-puppet-lint.oldVersion', false);
      }
    });
  },

  provideLinter: function provideLinter() {
    // With the custom format the puppet-int ouput looks like this:
    // error mongodb::service not in autoload module layout 3 7
    var helpers = require('atom-linter');
    var path = require('path');
    var regexLine = /^(warning|error)\s(.*)\s(\d+)\s(\d+)$/;

    return {
      name: 'Puppet-Lint',
      grammarScopes: ['source.puppet'],
      scope: 'file',
      lintOnFly: false,
      lint: function lint(activeEditor) {
        if (atom.config.get('linter-puppet-lint.oldVersion') === true) {
          atom.notifications.addError('You are using an old version of puppet-lint!', {
            detail: "Please upgrade your version of puppet-lint.\n" + 'Check the README for further information.'
          });
          return [];
        }

        var command = atom.config.get('linter-puppet-lint.executablePath');
        var file = activeEditor.getPath();
        var cwd = path.dirname(file);
        var args = ['--log-format', '%{kind} %{message} %{line} %{column}'];

        var optionsMap = require('./flags.js');
        var config = atom.config.getAll('linter-puppet-lint');
        var flags = config[0]['value'];

        // Add the flags to the command options
        for (var flag in flags) {
          if (flags[flag] === true) {
            args.push(optionsMap[flag]);
          }
        }

        args.push(file);

        return helpers.exec(command, args, { cwd: cwd }).then(function (output) {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            var matches = regexLine.exec(line);
            if (matches != null) {
              errLine = Number.parseInt(matches[3]) - 1;
              errCol = Number.parseInt(matches[4]) - 1;
              toReturn.push({
                range: [[errLine, errCol], [errLine, errCol + 1]],
                type: matches[1],
                text: matches[2],
                filePath: file
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1wdXBwZXQtbGludC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFO0FBQ04sa0JBQWMsRUFBRTtBQUNkLFdBQUssRUFBRSxpQkFBaUI7QUFDeEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBVyxFQUFFLGdDQUFnQztBQUM3QyxpQkFBUyxhQUFhO0tBQ3ZCO0FBQ0QsZ0JBQVksRUFBRTtBQUNaLFdBQUssRUFBRSxxQ0FBcUM7QUFDNUMsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCwrQkFBMkIsRUFBRTtBQUMzQixXQUFLLEVBQUUsMkNBQTJDO0FBQ2xELFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0Qsd0JBQW9CLEVBQUU7QUFDcEIsV0FBSyxFQUFFLGtDQUFrQztBQUN6QyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELDJCQUF1QixFQUFFO0FBQ3ZCLFdBQUssRUFBRSxzQ0FBc0M7QUFDN0MsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxvQ0FBZ0MsRUFBRTtBQUNoQyxXQUFLLEVBQUUsaURBQWlEO0FBQ3hELFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0Qsc0JBQWtCLEVBQUU7QUFDbEIsV0FBSyxFQUFFLGdDQUFnQztBQUN2QyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELGdDQUE0QixFQUFFO0FBQzVCLFdBQUssRUFBRSwyQ0FBMkM7QUFDbEQsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCw4QkFBMEIsRUFBRTtBQUMxQixXQUFLLEVBQUUsMENBQTBDO0FBQ2pELFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FB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LENBQUMsQ0FBQyxDQUFDO0FBQ2hCLHdCQUFRLEVBQUUsSUFBSTtlQUNmLENBQUMsQ0FBQzthQUNKO1dBQ0YsQ0FBQyxDQUFDO0FBQ0gsaUJBQU8sUUFBUSxDQUFDO1NBQ2pCLENBQUMsQ0FBQztPQUNKO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvbGludGVyLXB1cHBldC1saW50L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBleGVjdXRhYmxlUGF0aDoge1xuICAgICAgdGl0bGU6ICdFeGVjdXRhYmxlIHBhdGgnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1BhdGggdG8gcHVwcGV0LWxpbnQgZXhlY3V0YWJsZScsXG4gICAgICBkZWZhdWx0OiAncHVwcGV0LWxpbnQnXG4gICAgfSxcbiAgICBhdXRvbWF0aWNGaXg6IHtcbiAgICAgIHRpdGxlOiAnQXR0ZW1wdCB0byBhdXRvbWF0aWNhbGx5IGZpeCBlcnJvcnMnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBSaWd0aFRvTGVmdFJlbGF0aW9uc2hpcDoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSByaWdodF90b19sZWZ0X3JlbGF0aW9uc2hpcCBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcEF1dG9sb2FkZXJMYXlvdXQ6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgYXV0b2xvYWRlcl9sYXlvdXQgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBOYW1lc0NvbnRhaW5pbmdEYXNoOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIG5hbWVzX2NvbnRhaW5pbmdfZGFzaCBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcENsYXNzSW5oZXJpdGhzRnJvbVBhcmFtQ2xhc3M6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgY2xhc3NfaW5oZXJpdHNfZnJvbV9wYXJhbXNfY2xhc3MgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBQYXJhbWV0ZXJPcmRlcjoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBwYXJhbWV0ZXJfb3JkZXIgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBJbmhlcml0c0Fjcm9zc05hbWVzcGFjZXM6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgaW5oZXJpdHNfYWNyb3NzX25hbWVzcGFjZXMgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBOZXN0ZWRDbGFzc2VzT3JEZWZpbmVzOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIG5lc3RlZF9jbGFzc2VzX29yX2RlZmluZXMgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBWYXJpYWJsZVNjb3BlOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIHZhcmlhYmxlX3Njb3BlIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwU2xhc2hDb21tZW50czoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBzbGFzaF9jb21tZW50cyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcFN0YXJDb21tZW50czoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBzdGFyX2NvbW1lbnRzIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwU2VsZWN0b3JJbnNpZGVSZXNvdXJjZToge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBzZWxlY3Rvcl9pbnNpZGVfcmVzb3VyY2UgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBDYXNlV2l0aG91dERlZmF1bHQ6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgY2FzZV93aXRob3V0X2RlZmF1bHQgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBEb2N1bWVudGF0aW9uOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIGRvY3VtZW50YXRpb24gY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBEb3VibGVRdW90ZWRTdHJpbmdzOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIGRvdWJsZV9xdW90ZWRfc3RyaW5ncyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcE9ubHlWYXJpYWJsZVN0cmluZzoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBvbmx5X3ZhcmlhYmxlX3N0cmluZyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcFZhcmlhYmxlc05vdEVuY2xvc2VkOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIHZhcmlhYmxlc19ub3RfZW5jbG9zZWQgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBTaW5nbGVRdW90ZVN0cmluZ1dpdGhWYXJpYWJsZXM6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgc2luZ2xlX3F1b3RlX3N0cmluZ193aXRoX3ZhcmlhYmxlcyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcFF1b3RlZEJvb2xlYW5zOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIHF1b3RlZF9ib29sZWFucyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcFB1cHBldFVybFdoaXRvdXRNb2R1bGVzOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIHB1cHBldF91cmxfd2l0aG91dF9tb2R1bGVzIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwVmFyaWFibGVDb250YWluc0Rhc2g6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgdmFyaWFibGVfY29udGFpbnNfZGFzaCBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcEhhcmRUYWJzOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIGhhcmRfdGFicyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcFRyYWlsaW5nV2hpdGVzcGFjZToge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSB0cmFpbGluZ193aGl0ZXNwYWNlIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwODBDaGFyczoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSA4MGNoYXJzIGNoZWNrIChwdXBwZXQtbGludCA8PSAxLjEuMCknLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXAxNDBDaGFyczoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSAxNDBjaGFycyBjaGVjayAocHVwcGV0LWxpbnQgPiAxLjEuMCknLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXAyc3BTb2Z0VGFiczoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSAyc3Bfc29mdF90YWJzIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwQXJyb3dBbGlnbm1lbnQ6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgYXJyb3dfYWxpZ25tZW50IGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwVW5xdW90ZWRSZXNvdXJjZVRpdGxlOiB7XG4gICAgICB0aXRsZTogJ1NraXAgdGhlIHVucXVvdGVkX3Jlc291cmNlX3RpdGxlIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwRW5zdXJlRmlyc3RQYXJhbToge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBlbnN1cmVfZmlyc3RfcGFyYW0gY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIHNraXBEdXBsaWNhdGVQYXJhbXM6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgZHVwbGljYXRlX3BhcmFtcyBjaGVjaycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgc2tpcFVucXVvdGVkRmlsZU1vZGU6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgdW5xdW90ZWRfZmlsZV9tb2RlIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwRmlsZU1vZGU6IHtcbiAgICAgIHRpdGxlOiAnU2tpcCB0aGUgZmlsZV9tb2RlIGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwRW5zdXJlTm90U3ltbGlua1RhcmdldDoge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSBlbnN1cmVfbm90X3N5bWxpbmtfdGFyZ2V0IGNoZWNrJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBza2lwVW5xdW90ZWROb2RlTmFtZToge1xuICAgICAgdGl0bGU6ICdTa2lwIHRoZSB1bnF1b3RlZF9ub2RlX25hbWUgY2hlY2snLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gICAgY29uc3QgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLXB1cHBldC1saW50LmV4ZWN1dGFibGVQYXRoJyk7XG4gICAgY29uc3QgYXJncyAgICA9IFsnLS1oZWxwJ107XG5cbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1wdXBwZXQtbGludCcpO1xuXG4gICAgLy8gQ2hlY2sgaWYgcHVwcGV0LWxpbnQgaGFzIHN1cHBvcnQgZm9yIHRoZSAle2NvbHVtbn0gcGxhY2Vob2xkZXJcbiAgICBoZWxwZXJzLmV4ZWMoY29tbWFuZCwgYXJncykudGhlbihvdXRwdXQgPT4ge1xuICAgICAgdmFyIHJlZ2V4Q29sdW1uID0gLyV7Y29sdW1ufS87XG5cbiAgICAgIGlmIChyZWdleENvbHVtbi5leGVjKG91dHB1dCkgPT09IG51bGwpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItcHVwcGV0LWxpbnQub2xkVmVyc2lvbicsIHRydWUpO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgICAgJ1lvdSBhcmUgdXNpbmcgYW4gb2xkIHZlcnNpb24gb2YgcHVwcGV0LWxpbnQhJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZXRhaWw6IFwiUGxlYXNlIHVwZ3JhZGUgeW91ciB2ZXJzaW9uIG9mIHB1cHBldC1saW50LlxcblwiXG4gICAgICAgICAgICArICdDaGVjayB0aGUgUkVBRE1FIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLidcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1wdXBwZXQtbGludC5vbGRWZXJzaW9uJywgZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXI6ICgpID0+IHtcbiAgICAvLyBXaXRoIHRoZSBjdXN0b20gZm9ybWF0IHRoZSBwdXBwZXQtaW50IG91cHV0IGxvb2tzIGxpa2UgdGhpczpcbiAgICAvLyBlcnJvciBtb25nb2RiOjpzZXJ2aWNlIG5vdCBpbiBhdXRvbG9hZCBtb2R1bGUgbGF5b3V0IDMgN1xuICAgIGNvbnN0IGhlbHBlcnMgICA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gICAgY29uc3QgcGF0aCAgICAgID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIGNvbnN0IHJlZ2V4TGluZSA9IC9eKHdhcm5pbmd8ZXJyb3IpXFxzKC4qKVxccyhcXGQrKVxccyhcXGQrKSQvO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdQdXBwZXQtTGludCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IGZhbHNlLFxuICAgICAgbGludDogKGFjdGl2ZUVkaXRvcikgPT4ge1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItcHVwcGV0LWxpbnQub2xkVmVyc2lvbicpID09PSB0cnVlKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAgICAgJ1lvdSBhcmUgdXNpbmcgYW4gb2xkIHZlcnNpb24gb2YgcHVwcGV0LWxpbnQhJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiBcIlBsZWFzZSB1cGdyYWRlIHlvdXIgdmVyc2lvbiBvZiBwdXBwZXQtbGludC5cXG5cIlxuICAgICAgICAgICAgICArICdDaGVjayB0aGUgUkVBRE1FIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybltdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLXB1cHBldC1saW50LmV4ZWN1dGFibGVQYXRoJyk7XG4gICAgICAgIGNvbnN0IGZpbGUgICAgPSBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBjd2QgICAgID0gcGF0aC5kaXJuYW1lKGZpbGUpO1xuICAgICAgICBjb25zdCBhcmdzICAgID0gWyctLWxvZy1mb3JtYXQnLCAnJXtraW5kfSAle21lc3NhZ2V9ICV7bGluZX0gJXtjb2x1bW59J11cblxuICAgICAgICB2YXIgb3B0aW9uc01hcCA9IHJlcXVpcmUoJy4vZmxhZ3MuanMnKTtcbiAgICAgICAgdmFyIGNvbmZpZyAgICAgPSBhdG9tLmNvbmZpZy5nZXRBbGwoJ2xpbnRlci1wdXBwZXQtbGludCcpXG4gICAgICAgIHZhciBmbGFncyAgICAgID0gY29uZmlnWzBdWyd2YWx1ZSddXG5cbiAgICAgICAgLy8gQWRkIHRoZSBmbGFncyB0byB0aGUgY29tbWFuZCBvcHRpb25zXG4gICAgICAgIGZvcih2YXIgZmxhZyBpbiBmbGFncykge1xuICAgICAgICAgIGlmIChmbGFnc1tmbGFnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYXJncy5wdXNoKG9wdGlvbnNNYXBbZmxhZ10pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXJncy5wdXNoKGZpbGUpXG5cbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhjb21tYW5kLCBhcmdzLCB7Y3dkOiBjd2R9KS50aGVuKG91dHB1dCA9PiB7XG4gICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBbXTtcbiAgICAgICAgICBvdXRwdXQuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVzID0gcmVnZXhMaW5lLmV4ZWMobGluZSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGVyckxpbmUgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hlc1szXSkgLSAxO1xuICAgICAgICAgICAgICBlcnJDb2wgID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoZXNbNF0pIC0gMTtcbiAgICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtbZXJyTGluZSwgZXJyQ29sXSwgW2VyckxpbmUsIGVyckNvbCArIDFdXSxcbiAgICAgICAgICAgICAgICB0eXBlOiBtYXRjaGVzWzFdLFxuICAgICAgICAgICAgICAgIHRleHQ6IG1hdGNoZXNbMl0sXG4gICAgICAgICAgICAgICAgZmlsZVBhdGg6IGZpbGVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19
//# sourceURL=/Users/ssun/.atom/packages/linter-puppet-lint/lib/main.js
