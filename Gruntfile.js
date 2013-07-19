module.exports = function(grunt) {

  var banner = '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n';
  var jsFiles = ['src/rect/*.js', 'src/*.js'];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: banner
      },
      dist: {
        src: jsFiles,
        dest: 'lib/jquery.slide-over-view.js'
      }
    },
    uglify: {
      options: {
        banner: banner
      },
      dist: {
        src: ['lib/jquery.slide-over-view.js'],
        dest: 'lib/jquery.slide-over-view.min.js'
      }
    },
    watch: {
      scripts: {
        files: jsFiles,
        tasks: ['concat', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['watch']);
};