'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: [
          'blank/www/js/*.js', 'blank/www/js/model/*.js', 'blank/www/js/view/*.js',
          'sample/**/www/js/*.js', 'sample/**/www/js/model/*.js', 'sample/**/www/js/view/*.js'
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint']);

};