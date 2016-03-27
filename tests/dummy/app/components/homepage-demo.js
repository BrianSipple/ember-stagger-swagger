import Ember from 'ember';

const {
  Component,
} = Ember;

export default Component.extend({

  classNames: ['homepage-demo'],

  staggerDirectionOptions: null,
  staggerListItems: null,
  currentStaggerDirection: null,

  showItems: false,

  init () {
    this._super(...arguments);

    this.currentStaggerDirection = this.currentStaggerDirection || 'left';
  },


  actions: {

    onStaggerDirectionSelected (direction) {
        this.set('currentStaggerDirection', direction);
    },

  }
});
