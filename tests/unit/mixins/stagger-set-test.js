import Ember from 'ember';
import StaggerSetMixin from 'ember-stagger-swagger/mixins/stagger-set';
import { module, test } from 'qunit';
import Constants from 'ember-stagger-swagger/constants/constants';
import testDefaultsAfterInvalidInstantiation from '../../helpers/unit/test-defaults-after-invalid-instantiation';

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
//
// function testSettingToDefault (assert, constructorObj, propName, expectedValue, invalidInputs) {
//
//   invalidInputs.forEach((val) => {
//     subject = constructorObj.create({...minimalConfig, [propName]: val });
//     expected = expectedValue;
//     actual = subject.get(`${propName}`);
//     assert.equal(actual, expected);
//   });
//
// }


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


test(`\`staggerInterval\` defaults to ${DEFAULTS.STAGGER_INTERVAL_MS} when it's
  not set to a value greater than or equal to 32`, function (assert) {
  assert.expect(4);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = -900;
  const invalidNumber2 = 31;

  subject = StaggerSetObject.create({ ...minimalConfig, staggerInterval: valid });
  expected = valid;
  actual = subject.get('staggerInterval');
  assert.equal(actual, expected);

  expected = DEFAULTS.STAGGER_INTERVAL_MS;

  testDefaultsAfterInvalidInstantiation(assert,
    StaggerSetObject,
    'staggerInterval',
    expected,
    minimalConfig,
    [invalidNaN, invalidNumber, invalidNumber2]
  );
});

test(`\`inDelay\` defaults to ${DEFAULTS.ANIMATION_DELAY_IN} if not set
  to a number greater than 0`, function (assert) {
  assert.expect(3);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = -900;

  subject = StaggerSetObject.create({...minimalConfig, inDelay: valid });
  expected = valid;
  actual = subject.get('inDelay');
  assert.equal(actual, expected);

  expected = DEFAULTS.ANIMATION_DELAY_IN;

  testDefaultsAfterInvalidInstantiation(
    assert,
    StaggerSetObject,
    'inDelay',
    expected,
    minimalConfig,
    [invalidNaN, invalidNumber]
  );
});

test(`\`outDelay\` defaults to matching \`inDelay\` if not set
  to a number greater than 0`, function (assert) {

  assert.expect(3);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = -900;

  subject = StaggerSetObject.create({...minimalConfig, outDelay: valid });
  expected = valid;
  actual = subject.get('outDelay');
  assert.equal(actual, expected);

  expected = DEFAULTS.ANIMATION_DELAY_IN;

  testDefaultsAfterInvalidInstantiation(
    assert,
    StaggerSetObject,
    'outDelay',
    expected,
    minimalConfig,
    [invalidNaN, invalidNumber]
  );
});

test(`\`inDuration\` defaults to ${DEFAULTS.ANIMATION_DURATION_IN} if not set
  to a number greater than 0`, function (assert) {

  assert.expect(4);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = 0;
  const invalidNumber2 = -900;

  subject = StaggerSetObject.create({...minimalConfig, inDuration: valid });
  expected = valid;
  actual = subject.get('inDuration');
  assert.equal(actual, expected);

  expected = DEFAULTS.ANIMATION_DURATION_IN;

  testDefaultsAfterInvalidInstantiation(
    assert,
    StaggerSetObject,
    'inDuration',
    expected,
    minimalConfig,
    [invalidNaN, invalidNumber, invalidNumber2]
  );
});

test(`\`outDuration\` defaults to matching \`inDuration\` if not set
  to a number greater than 0`, function (assert) {

  assert.expect(4);

  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  const valid = 90;
  const invalidNaN = 'superfast';
  const invalidNumber = 0;
  const invalidNumber2 = -900;

  subject = StaggerSetObject.create({...minimalConfig, outDuration: valid });
  expected = valid;
  actual = subject.get('outDuration');
  assert.equal(actual, expected);

  expected = DEFAULTS.ANIMATION_DURATION_IN;

  testDefaultsAfterInvalidInstantiation(
    assert,
    StaggerSetObject,
    'outDuration',
    expected,
    minimalConfig,
    [invalidNaN, invalidNumber, invalidNumber2]
  );
});

test(`\`inTimingFunc\` defaults to ${DEFAULTS.TIMING_FUNCTION_IN} if not set`, function (assert) {
  assert.expect(2);
  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);
  expected = DEFAULTS.TIMING_FUNCTION_IN;

  subject = StaggerSetObject.create({...minimalConfig, inTimingFunc: DEFAULTS.TIMING_FUNCTION_IN });
  actual = subject.get('inTimingFunc');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, inTimingFunc: null });
  actual = subject.get('inTimingFunc');
  assert.equal(actual, expected);
});

test(`\`outTimingFunc\` defaults to ${DEFAULTS.TIMING_FUNCTION_OUT} if not set`, function (assert) {
  assert.expect(2);
  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);
  expected = DEFAULTS.TIMING_FUNCTION_OUT;

  subject = StaggerSetObject.create({...minimalConfig, outTimingFunc: DEFAULTS.TIMING_FUNCTION_OUT });
  actual = subject.get('outTimingFunc');
  assert.equal(actual, expected);

  subject = StaggerSetObject.create({...minimalConfig, outTimingFunc: null });
  actual = subject.get('outTimingFunc');
  assert.equal(actual, expected);
});

test(`\`outDirection\` defaults to matching \`inDirection\` if not set`, function (assert) {
  assert.expect(1);
  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  inDirection = ANIMATION_DIRECTIONS.LEFT;
  subject = StaggerSetObject.create({...minimalConfig, inDirection, outDirection: null });

  expected = inDirection;
  actual = subject.get('outDirection');
  assert.equal(actual, expected);
});

test(`\`outEffect\` defaults to matching \`inEffect\` if not set`, function (assert) {
  assert.expect(1);
  StaggerSetObject = Ember.Object.extend(StaggerSetMixin);

  inEffect = ANIMATION_NAMES.SLIDE_AND_FADE;
  subject = StaggerSetObject.create({...minimalConfig, inEffect, outEffect: null });

  expected = inEffect;
  actual = subject.get('inEffect');
  assert.equal(actual, expected);
});
