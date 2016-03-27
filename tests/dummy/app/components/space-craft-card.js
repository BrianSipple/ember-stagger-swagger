import Ember from 'ember';

const {
  Component,
  computed,
} = Ember;

export default Component.extend({

  classNames: [
    'space-craft-card',
    'o-flex-grid',
    'o-flex-grid--auto',
    'o-flex-grid--noWrap',
  ],


  model: null,

  itemNumber: computed('index', function computeItemNumber() {
    return this.get('index') + 1;
  }),
});
