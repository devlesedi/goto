// Generated on 2014-10-22 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Define the configuration for all the tasks
  grunt.initConfig({

    svgstore: {
      options: {
        prefix : 'shape-', // This will prefix each <g> ID
      },
      default : {
          files: {
            'views/svgs/svg-defs.svg': ['views/svgs/*.svg'],
          }
        }
      }    
  });

  grunt.loadNpmTasks('grunt-svgstore');

  grunt.registerTask('default', [
    'svgstore'
  ]);
};
