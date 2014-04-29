module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    watch:
      files:['coffee/**/*.coffee']
      tasks:['coffee']
    coffee:
      compile:
        files:[
          expand:true
          cwd: 'coffee/'
          src:['**/*.coffee']
          dest: './Resources'
          ext: '.js'
        ]
        
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks 'grunt-exec'
  grunt.registerTask 'default', ['watch']
  return
