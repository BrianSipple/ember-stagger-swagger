import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import { skip } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import getNode from '../../helpers/integration/get-node';
import Constants from 'ember-stagger-swagger/constants/constants';

const {
  run,
  set,
} = Ember;

const {
  CLASS_NAMES,
  DEFAULTS,
  ANIMATION_DIRECTIONS,
  ANIMATION_NAMES,
  KEYFRAMES_MAP,
} = Constants;

const DataDown = Ember.Object.extend({
  showItems: false,
  inDirection: ANIMATION_DIRECTIONS.RIGHT,
  inEffect: ANIMATION_NAMES.SLIDE_AND_FADE,
});

function renderMinimalContent () {
  this.render(hbs`
    {{#stagger-set inDirection="left" inEffect="slideAndFade"}}
      Seattle
    {{/stagger-set}}
  `);
}


let dataDown;
let actual, expected;

moduleForComponent('stagger-set', 'Integration | Component | stagger set', {
  integration: true
});

test('rendering block content', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  renderMinimalContent.call(this);

  expected = 'Seattle';
  actual = getNode(this).textContent.trim();
  assert.equal(actual, expected);
});


skip(`broadcasting animation start and animation completion`, function (assert) {

  function onAnimationStart (event) {
    expected = true;
    actual = event instanceof AnimationEvent;
    assert.equal(actual, expected);

    expected = 'animationstart';
    actual = event.type;
    assert.equal(actual, expected);
  }

  function onAnimationComplete (event) {
    expected = true;
    actual = event instanceof AnimationEvent;
    assert.equal(actual, expected);

    expected = 'animationend';
    actual = event.type;
    assert.equal(actual, expected);
  }

  dataDown = DataDown.create({ showItems: false });

  this.set('onAnimationComplete', onAnimationComplete);
  this.set('onAnimationStart', onAnimationStart);
  this.set('dataDown', dataDown);

  run(() => {
    this.render(hbs`
      {{#stagger-set
        showItems=dataDown.showItems
        inEffect=dataDown.inEffect
        inDirection=dataDown.inDirection
        onAnimationStart=onAnimationStart
        onAnimationComplete=onAnimationComplete
      }}
        <li>Seattle</li>
        <li>New York City</li>
        <li>Boston</li>
      {{/stagger-set}}
    `);
  });
});
//
//
//
// test('hiding items from the view if initialized with `showItems` set to `false`', function (assert) {
//
//   dataDown = DataDown.create();
//
//   this.render(hbs`
//     {{#stagger-set showItems=dataDown.showItems inEffect=dataDown.inEffect inDuration=dataDown.inDirection}}
//       <li>Seattle</li>
//       <li>New York City</li>
//       <li>Boston</li>
//     {{/stagger-set}}
//   `);
//
//   expected = trues;
//   actual = getNode(this).classList.contains(CLASS_NAMES.untoggled);
//   assert.equal(actual, expected);
//
//
//   run(() => {
//     set(dataDown, 'showItems', true);
//   });
//
//   expected = true;
//   actual = getNode(this).classList.contains(CLASS_NAMES.untoggled);
//   assert.equal(actual, expected);
// });


//
// test(`toggling the element's animation class hooks when the
//   value of the \`showItems\` attribute changes -- but only after
//   the initial render`, function (assert) {
//
//   const dataDown = Ember.Object.create({
//     showItems: false
//   });
//
//   this.set('dataDown', dataDown);
//
//   this.render(hbs`
//     {{#stagger-set showItems=dataDown.showItems}}
//       template block text
//     {{/stagger-set}}
//   `);
//
//   expected = false;
//   actual = getNode(this).classList.contains(CLASS_NAMES.itemsShowing, CLASS_NAMES.itemsCollapsing);
//   assert.equal(actual, expected);
//
//   run(() => {
//     dataDown.set('showItems', true);
//   });
//
//   let classList = getNode(this).classList;
//   expected = true;
//   actual = classList.contains(CLASS_NAMES.itemsShowing);
//   assert.equal(actual, expected);
//
//   expected = false;
//   actual = classList.contains(CLASS_NAMES.itemsCollapsing);
//   assert.equal(actual, expected);
//
//
//   run(() => {
//     dataDown.set('showItems', false);
//   });
//
//   classList = getNode(this).classList;
//
//   expected = false;
//   actual = classList.contains(CLASS_NAMES.itemsShowing);
//   assert.equal(actual, expected);
//
//   expected = true;
//   actual = classList.contains(CLASS_NAMES.itemsCollapsing);
//   assert.equal(actual, expected);
//
// });
//
//
// test(`mapping keyframes according to the \`staggerDirection\``, function (assert) {
//
//   let currentAnimationDirection = STAGGER_DIRECTIONS.DOWN;
//
//   const dataDown = Ember.Object.create({
//     showItems: false,
//     staggerDirection: currentAnimationDirection,
//   });
//
//   this.set('dataDown', dataDown);
//
//   this.render(hbs`
//     {{#stagger-set staggerDirection=dataDown.staggerDirection showItems=dataDown.showItems}}
//       <li>Seattle</li>
//       <li>New York City</li>
//       <li>Boston</li>
//     {{/stagger-set}}
//   `);
//
//   // no animation yet
//   expected = null;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//   run(() => {
//     dataDown.set('showItems', true);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//   run(() => {
//     dataDown.set('showItems', false);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//
//
//   currentAnimationDirection = ANIMATION_NAME_MAP[STAGGER_DIRECTIONS.UP];
//
//   run(() => {
//     this.set('staggerDirection', currentAnimationDirection);
//     this.set('showItems', true);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//   run(() => {
//     this.set('showItems', false);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//
//
//   currentAnimationDirection = ANIMATION_NAME_MAP[STAGGER_DIRECTIONS.LEFT];
//
//   run(() => {
//     this.set('staggerDirection', currentAnimationDirection);
//     this.set('showItems', true);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//   run(() => {
//     this.set('showItems', false);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//
//
//   currentAnimationDirection = ANIMATION_NAME_MAP[STAGGER_DIRECTIONS.RIGHT];
//
//   run(() => {
//     this.set('staggerDirection', currentAnimationDirection);
//     this.set('showItems', true);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
//   run(() => {
//     this.set('showItems', false);
//   });
//   expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
//   actual = getNode(this).style.animationName;
//   assert.equal(actual, expected);
//
// });



//
//
// test('overriding the animation keyframes applied with the `inAnimationName` and `outAnimationName` attributes', function (assert) {
//
// });
