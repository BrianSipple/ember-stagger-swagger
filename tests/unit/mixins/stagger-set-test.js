import Ember from 'ember';
import StaggerSetMixin from 'ember-stagger-swagger/mixins/stagger-set';
import { module, test } from 'qunit';
import Constants from 'ember-stagger-swagger/constants/constants';

const {
  ANIMATION_DIRECTIONS,
  ANIMATION_NAMES,
  KEYFRAMES_MAP,
  DEFAULTS,
} = Constants;

const minimalConfig = {
  inDirection: ANIMATION_DIRECTIONS.LEFT,
  inEffect: ANIMATION_NAMES.SLIDE_AND_FADE,
};


let StaggerSetObject, subject;
let actual, expected;

module('Unit | Mixin | stagger list');

test('requiring a valid `inDirection`', function (assert) {
  assert.expect(3);
  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  assert.throws(
    () => { subject = StaggerSetObject.create({ inDirection: null }); },
    /inDirection/,
    'failing to specify a `inDirection` throws an error'
  );

  assert.throws(
    () => { subject = StaggerSetObject.create({ inDirection: 'spiral' }); },
    /inDirection/,
    'specifying an invalid `inDirection` throws an error'
  );

  assert.ok(subject = StaggerSetObject.create(minimalConfig));
});

test('requiring a valid `inEffect`', function (assert) {
  assert.expect(3);
  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  assert.throws(
    () => {
      subject = StaggerSetObject.create({
        inDirection: ANIMATION_DIRECTIONS.LEFT,
        inEffect: null,
      });
    },
    /inEffect/,
    'failing to specify a `inEffect` throws an error'
  );

  assert.throws(
    () => {
      subject = StaggerSetObject.create({
        inDirection: ANIMATION_DIRECTIONS.LEFT,
        inEffect: 'supernova',
      });
    },
    'specifying an invalid `inEffect` throws an error'
  );

  assert.ok(subject = StaggerSetObject.create(minimalConfig));
});


test(`setting a proper default when an invalid \`staggerInterval\` is provided`, function (assert) {
  assert.expect(5);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = -900;
  const invalidNumber2 = 31;

  subject = StaggerSetObject.create({...minimalConfig, staggerInterval: valid });
  expected = valid;
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);

  expected = DEFAULTS.STAGGER_INTERVAL_MS;
  
  subject = StaggerSetObject.create({...minimalConfig, staggerInterval: invalidNaN });
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, staggerInterval: invalidNumber });
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, staggerInterval: invalidNumber2 });
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, staggerInterval: null });
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);
});


test(`setting a proper default when an invalid \`inDelay\` is provided`, function (assert) {
  assert.expect(4);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = -900;

  subject = StaggerSetObject.create({...minimalConfig, inDelay: valid });
  expected = valid;
  actual = subject.get('inDelay');
  assert.equal(actual, expected);

  expected = DEFAULTS.ANIMATION_DELAY_IN;

  subject = StaggerSetObject.create({...minimalConfig, inDelay: invalidNaN });
  actual = subject.get('inDelay');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, inDelay: invalidNumber });
  actual = subject.get('inDelay');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, inDelay: null });
  actual = subject.get('inDelay');
  assert.equal(actual, expected);
});
