/**
 * sass
 * ======
 *
 * Compile scss to css
 *
 * Link: https://github.com/gruntjs/grunt-contrib-sass
 */

'use strict';

const sass = require('node-sass');

module.exports = function (grunt) {
  return {
    options: {
      implementation: sass,
      sourceMap: true
    },
    dist: {
      files: [{
        expand: true,
        cwd: '<%= pkg.config.src %>/scss',
        src: ['*.scss'],
        dest: '<%= pkg.config.src %>/css',
        ext: '.css'
      }]
    }
  };
};
