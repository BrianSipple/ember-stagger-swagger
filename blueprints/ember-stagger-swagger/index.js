/*jshint node:true*/

const packagesToAdd = [
  { name: 'broccoli-funnel', target: '^1.0.1' },
  { name: 'csswring', target: '^4.2.2' },
  { name: 'postcss-cssnext', target: '^2.5.1' },
  { name: 'postcss-reporter', target: '^1.3.3' },
  { name: 'broccoli-merge-trees', target: '^1.1.1' },
  { name: 'broccoli-postcss', target: '^2.1.1' },
];



module.exports = {
  description: 'ember-stagger-swagger',

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  normalizeEntityName: function () {},

  /**
   * Add the small collection of modules that we're using to process CSS
   */
  afterInstall: function(options) {
    return this.addPackagesToProject(packagesToAdd);
  },

  afterUninstall: function(options) {
    return this.removePackagesFromProject(packagesToAdd);
  }


};
