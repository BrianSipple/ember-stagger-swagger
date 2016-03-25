import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({

  model () {
    debugger;
    return {
      list1: [
        { title: 'Item 1' },
        { title: 'Item 2' },
        { title: 'Item 3' },
      ]
    };
  },
});
