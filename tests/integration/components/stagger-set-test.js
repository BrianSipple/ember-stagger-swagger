import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import getNode from '../../helpers/integration/get-node';

const {
  run,
  warn,
} = Ember;

const CLASS_NAMES = {
  itemsHidden: 'items-hidden',
  itemsShowing: 'items-showing',
  itemsCollapsing: 'items-collapsing',
};

const {
  ANIMATION_DIRECTIONS,
  ANIMATION_NAMES,
  KEYFRAMES_MAP,
} = Constants;


function renderMinimalContent () {
  this.render(hbs`
    {{#stagger-set inDirection="left" inEffect="slideAndFade"}}
      Seattle
    {{/stagger-set}}
  `);
}


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



test(`during didInsertElement: properly setting \`itemsHidden\` based
  upon the value of \`showItems\``, function (assert) {

  this.set('showItems', true);

  this.render(hbs`
    {{#stagger-set showItems=showItems}}
      template block text
    {{/stagger-set}}
  `);

  expected = false;
  actual = getNode(this).classList.contains(CLASS_NAMES.itemsHidden);
  assert.equal(actual, expected);


  run(() => {
    this.set('showItems', false);
  });

  this.render(hbs`
    {{#stagger-set showItems=showItems}}
      template block text
    {{/stagger-set}}
  `);

  expected = true;
  actual = getNode(this).classList.contains(CLASS_NAMES.itemsHidden);
  assert.equal(actual, expected);
});



test(`toggling the element's animation class hooks when the
  value of the \`showItems\` attribute changes -- but only after
  the initial render`, function (assert) {

  const dataDown = Ember.Object.create({
    showItems: false
  });

  this.set('dataDown', dataDown);

  this.render(hbs`
    {{#stagger-set showItems=dataDown.showItems}}
      template block text
    {{/stagger-set}}
  `);

  expected = false;
  actual = getNode(this).classList.contains(CLASS_NAMES.itemsShowing, CLASS_NAMES.itemsCollapsing);
  assert.equal(actual, expected);

  run(() => {
    dataDown.set('showItems', true);
  });

  let classList = getNode(this).classList;
  expected = true;
  actual = classList.contains(CLASS_NAMES.itemsShowing);
  assert.equal(actual, expected);

  expected = false;
  actual = classList.contains(CLASS_NAMES.itemsCollapsing);
  assert.equal(actual, expected);


  run(() => {
    dataDown.set('showItems', false);
  });

  classList = getNode(this).classList;

  expected = false;
  actual = classList.contains(CLASS_NAMES.itemsShowing);
  assert.equal(actual, expected);

  expected = true;
  actual = classList.contains(CLASS_NAMES.itemsCollapsing);
  assert.equal(actual, expected);

});


test(`mapping keyframes according to the \`staggerDirection\``, function (assert) {

  let currentAnimationDirection = STAGGER_DIRECTIONS.DOWN;

  const dataDown = Ember.Object.create({
    showItems: false,
    staggerDirection: currentAnimationDirection,
  });

  this.set('dataDown', dataDown);

  this.render(hbs`
    {{#stagger-set staggerDirection=dataDown.staggerDirection showItems=dataDown.showItems}}
      <li>Seattle</li>
      <li>New York City</li>
      <li>Boston</li>
    {{/stagger-set}}
  `);

  // no animation yet
  expected = null;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);

  run(() => {
    dataDown.set('showItems', true);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);

  run(() => {
    dataDown.set('showItems', false);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);



  currentAnimationDirection = ANIMATION_NAME_MAP[STAGGER_DIRECTIONS.UP];

  run(() => {
    this.set('staggerDirection', currentAnimationDirection);
    this.set('showItems', true);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);

  run(() => {
    this.set('showItems', false);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);



  currentAnimationDirection = ANIMATION_NAME_MAP[STAGGER_DIRECTIONS.LEFT];

  run(() => {
    this.set('staggerDirection', currentAnimationDirection);
    this.set('showItems', true);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);

  run(() => {
    this.set('showItems', false);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);



  currentAnimationDirection = ANIMATION_NAME_MAP[STAGGER_DIRECTIONS.RIGHT];

  run(() => {
    this.set('staggerDirection', currentAnimationDirection);
    this.set('showItems', true);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].in;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);

  run(() => {
    this.set('showItems', false);
  });
  expected = ANIMATION_NAME_MAP[currentAnimationDirection].out;
  actual = getNode(this).style.animationName;
  assert.equal(actual, expected);

});



//
//
// test('overriding the animation keyframes applied with the `inAnimationName` and `outAnimationName` attributes', function (assert) {
//
// });
