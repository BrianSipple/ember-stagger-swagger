/*jshint node:true*/

const packagesToAdd = [
  { name: 'broccoli-funnel', target: '^1.0.1' },
  { name: 'broccoli-merge-trees', target: '^1.1.1' },
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
