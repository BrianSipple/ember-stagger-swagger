import Ember from 'ember';
import StaggerListMixin from 'ember-stagger-swagger/mixins/stagger-list';
import { module, test } from 'qunit';

module('Unit | Mixin | stagger list');

// Replace this with your real tests.
test('it works', function(assert) {
  let StaggerListObject = Ember.Object.extend(StaggerListMixin);
  let subject = StaggerListObject.create();
  assert.ok(subject);
});
