import Ember from 'ember';
import layout from '../templates/components/stagger-list';
import StaggerListMixin from '../mixins/stagger-list';

const { Component } = Ember;

export default Component.extend(StaggerListMixin, {
  layout
});
