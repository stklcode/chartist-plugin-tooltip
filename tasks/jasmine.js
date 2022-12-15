/**
 * jasmine
 * =======
 *
 * Test settings
 *
 * Link: https://github.com/gruntjs/grunt-contrib-jasmine
 */

'use strict';

module.exports = function (grunt) {
  return {
    dist: {
      src: [
        'node_modules/chartist/dist/index.umd.js',
        '<%= pkg.config.src %>/scripts/<%= pkg.config.src_name %>.js'
      ],
      options: {
        specs: '<%= pkg.config.test %>/spec/**/spec-*.js',
        helpers: '<%= pkg.config.test %>/spec/**/helper-*.js',
        phantomjs: {
          'ignore-ssl-errors': true
        },
        // https://github.com/gruntjs/grunt-contrib-jasmine/issues/339
        version: '3.8.0',
        noSandbox: true
      }
    }
  };
};
