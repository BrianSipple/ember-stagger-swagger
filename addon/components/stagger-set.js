import Ember from 'ember';
import layout from '../templates/components/stagger-set';
import StaggerSetMixin from '../mixins/stagger-set';

const { Component } = Ember;

export default Component.extend(StaggerSetMixin, {
  layout
});
