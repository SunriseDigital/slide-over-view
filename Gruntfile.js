module.exports = function(grunt) {

  var banner = '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: banner
      },
      dist: {
        src: ['src/rect/*.js', 'src/*.js'],
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
    sass: {
      dist: {
        options:{
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.scss'],
          dest: 'lib',
          ext: '.min.css'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['src/rect/*.js', 'src/*.js', 'src/*.scss'],
        tasks: ['concat', 'uglify', 'sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['watch']);
};