/* jshint node: true */
'use strict';

const path = require('path');
const util = require('util');

const MATCH_CSS = new RegExp('.*\\.css$');

const cssNextOptions = {
  browsers: ['last 2 version'],
  sourcemap: true,
};

module.exports = {
  name: 'ember-stagger-swagger',

  isDevelopingAddon () {
    return true;
  },

  _getCSSFileName: function () {
    return this.name + '.css';
  },

  _isAddon: function () {
    const keywords = this.project.pkg.keywords;
    return keywords && ~!!keywords.indexOf('ember-addon');
  },

  included: function (app) {
    this._super.included(app);


    if (!this._isAddon()) {
      app.import(path.join('vendor', this._getCSSFileName()));
    }

  },


  treeForVendor: function (node) {
    if (this._isAddon()) { return node; }

    const Funnel = require('broccoli-funnel');
    const mergeTrees = require('broccoli-merge-trees');
    const compileCSS = require('broccoli-postcss');
    const sourcemapsOpts = { inline: false };

    const stylesPath = path.join(this.project.nodeModulesPath, this.name, 'app', 'styles');

    const inputTrees = new Funnel(stylesPath, { include: [MATCH_CSS] });
    const inputFile = this._getCSSFileName();
    const outputFile = inputFile;
    const postCSSPlugins = this.getPostCSSPlugins();
    const cssTree = compileCSS([inputTrees], inputFile, outputFile, postCSSPlugins, sourcemapsOpts);

    node = node ? mergeTrees([node, cssTree]) : cssTree;

    return node;
  },


  getPostCSSPlugins() {
    const cssImport = require('postcss-import');
    const cssCustomProperties = require('postcss-custom-properties');
    const cssWring = require('csswring');
    const cssNext = require('postcss-cssnext');
    const cssReporter = require('postcss-reporter');
    const cssNested = require('postcss-nested');

    return [
      { module: cssImport },
      { module: cssCustomProperties },
      { module: cssNested },
      { module: cssNext, options: cssNextOptions },

      // minify all the things!
      { module: cssWring },

      // report all the things!
      { module: cssReporter },
    ];
  },

};