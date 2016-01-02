/* jshint node: true */
'use strict';

var transpile = require('broccoli-babel-transpiler'),
    funnel = require('broccoli-funnel'),
    merge = require('broccoli-merge-trees'),
    path = require('path');

module.exports = {
  name: 'ember-web-workers',
  postprocessTree: function(type, tree) {
    if (type === 'all') {
      var workers = transpile('web-workers');

      workers = funnel(workers, {
        include: ['**/*.js'],
        destDir: path.join('assets', 'web-workers')
      });

      var workerLib = funnel(this.root, {
        files: ['web-worker.js'],
        destDir: 'assets'
      });

      workerLib = transpile(workerLib);

      return merge([workers, workerLib, tree])
    } else {
      return tree;
    }
  }
};
