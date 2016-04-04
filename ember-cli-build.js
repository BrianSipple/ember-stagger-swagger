/*jshint node:true*/
/* global require, module */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Funnel = require('broccoli-funnel');
const path = require('path');

const MATCH_CSS = new RegExp('.*\\.css$');

module.exports = function(defaults) {

  const app = new EmberAddon(defaults, {
    // Add options here
  });

  const stylesDir = path.join(__dirname, 'app', 'styles');
  const stylesTree = new Funnel(stylesDir, {
    include: [MATCH_CSS],
    destDir: 'vendor'
  });


  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree([stylesTree]);
};
