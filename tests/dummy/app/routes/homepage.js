import Ember from 'ember';

const { Route } = Ember;

const spaceCrafts = [
  { name: 'Falcon Heavy', weight: 33, size: 99, imgURL: '' },
  { name: 'Falcon Heavy', weight: 33, size: 99, imgURL: '' },
  { name: 'Falcon Heavy', weight: 33, size: 99, imgURL: '' },
  { name: 'Falcon Heavy', weight: 33, size: 99, imgURL: '' },
  { name: 'Falcon Heavy', weight: 33, size: 99, imgURL: '' },
  { name: 'Falcon Heavy', weight: 33, size: 99, imgURL: '' },
];

export default Route.extend({

  model () {
    return {
      staggerDirectionOptions: ['left', 'up', 'right', 'down'],
      staggerListItems: spaceCrafts,
    };
  },

});
