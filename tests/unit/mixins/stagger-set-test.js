import Ember from 'ember';
import StaggerSetMixin from 'ember-stagger-swagger/mixins/stagger-set';
import { module, test } from 'qunit';


const STAGGER_DIRECTIONS = {
  LEFT: 'left',
  DOWN: 'down',
  RIGHT: 'right',
  UP: 'up',
};


let StaggerListObject, subject;
let actual, expected;

module('Unit | Mixin | stagger list');


test('requiring a valid `staggerDirection`', function (assert) {
  assert.expect(3);

  StaggerListObject = Ember.Object.extend(StaggerSetMixin);

  assert.throws(
    () => {
      subject = StaggerListObject.create();
    },
    'failing to specify a `staggerDirection` throws an error'
  );

  assert.throws(
    () => {
      subject = StaggerListObject.create({ staggerDirection: 'spiral' });
    },
    'specifying an invalid `staggerDirection` throws an error'
  );

  assert.ok(subject = StaggerListObject.create({ staggerDirection: STAGGER_DIRECTIONS.LEFT }));
});


test(`throwing an error when an invalid \`staggerInterval\` is provided`, function (assert) {
  assert.expect(4);

  StaggerListObject = Ember.Object.extend(StaggerSetMixin);

  assert.throws(
    () => {
      subject = StaggerListObject.create({ staggerInterval: -500, staggerDirection: STAGGER_DIRECTIONS.LEFT });
    },
    'specifying a negative or 0 staggerInterval throws an errror'
  );

  assert.throws(
    () => {
      subject = StaggerListObject.create({ staggerInterval: 'superfast' });
    },
    'specifying a non-number-like staggerInterval throws an errror'
  );

  assert.ok(subject = StaggerListObject.create({ staggerInterval: 42, staggerDirection: STAGGER_DIRECTIONS.LEFT }));
  assert.ok(subject = StaggerListObject.create({ staggerInterval: '42', staggerDirection: STAGGER_DIRECTIONS.LEFT }));

});


test('initializing a default `staggerInterval` of 32 ms if none is provided', function (assert) {
  assert.expect(1);

  StaggerListObject = Ember.Object.extend(StaggerSetMixin);
  subject = StaggerListObject.create({ staggerDirection: STAGGER_DIRECTIONS.LEFT });

  expected = 32;
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);
});
