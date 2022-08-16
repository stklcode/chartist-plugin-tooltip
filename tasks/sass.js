/**
 * sass
 * ======
 *
 * Compile scss to css
 *
 * Link: https://github.com/gruntjs/grunt-contrib-sass
 */

'use strict';

const sass = require('sass');

module.exports = function () {
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
