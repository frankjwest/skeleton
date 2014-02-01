module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    watch: {
      scripts: {
        files: ['a/j/dev/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['a/s/*.scss'],
        tasks: ['sass:dev'],
        options: {
          spawn: false,
        }
      }
    },
    
    concat: {
      all: {
        src: [
          'a/j/dev/*.js'
        ],
        dest: 'a/j/live.js',
      }
    },
    
    uglify: {
      all: {
        src: 'a/j/live.js',
        dest: 'a/j/live.min.js',
      }
    },

    sass: {
      dev: {
        options: {
          style: 'expanded',
          lineNumbers: true
        },
        files: {
          'a/c/dev/live.css': 'a/s/main.scss',
          'a/c/dev/internal-style-guide.css': 'a/s/internal-style-guide.scss'
        }
      },
      build: {
        options: {
          style: 'compressed'
        },
        files: {
          'a/c/live.min.css': 'a/s/main.scss',
          'a/c/internal-style-guide.min.css': 'a/s/internal-style-guide.scss'
        }
      }
    },
    
    connect: {
      server: {
        options: {
          port: 9001,
          hostname: '*'
        }
      }
    }
    
  });

  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect', 'watch', 'concat', 'uglify', 'sass:dev']);

};