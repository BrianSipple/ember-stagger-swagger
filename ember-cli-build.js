/*jshint node:true*/
/* global require, module */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Funnel = require('broccoli-funnel');
const compileCSS = require('broccoli-postcss');
const path = require('path');

const cssImport = require('postcss-import');
const cssCustomProperties = require('postcss-custom-properties');
const cssWring = require('csswring');
const cssNext = require('postcss-cssnext');
const cssReporter = require('postcss-reporter');
const cssNested = require('postcss-nested');

const cssNextOptions = {
  browsers: ['last 2 version'],
  sourcemap: true,
};


const postcssOptions = {
  plugins: [
    { module: cssImport },
    { module: cssCustomProperties },
    { module: cssNested },
    { module: cssNext, options: cssNextOptions },

    // minify all the things!
    { module: cssWring },

    // report all the things!
    { module: cssReporter },
  ]
};

const STYLES_FILE_NAME = 'ember-stagger-swagger.css';
const MATCH_CSS = new RegExp('.*\\.css$');

module.exports = function(defaults) {

  const app = new EmberAddon(defaults, {
    // Add options here
    postcssOptions
  });

  const stylesDir = path.join(__dirname, 'app', 'styles');
  const styles = new Funnel(stylesDir, { include: [MATCH_CSS] });

  const CSS = compileCSS(
    [styles],
    STYLES_FILE_NAME,
    'vendor/' + STYLES_FILE_NAME,
    postcssOptions.plugins, { inline: false }
  );


  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree([CSS]);
};
