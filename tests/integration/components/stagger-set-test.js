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
    actual = event instanceof window.AnimationEvent;
    assert.equal(actual, expected);

    expected = 'animationstart';
    actual = event.type;
    assert.equal(actual, expected);
  }

  function onAnimationComplete (event) {
    expected = true;
    actual = event instanceof window.AnimationEvent;
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


test(`toggling the element's animation name when the
  value of the \`showItems\` attribute changes after
  the initial render`, function (assert) {

  const inEffect = ANIMATION_NAMES.FADE;
  const inDirection = ANIMATION_DIRECTIONS.DOWN;
  const dataDown = DataDown.create({ showItems: false, inEffect, inDirection });

  this.set('dataDown', dataDown);

  this.render(hbs`
    {{#stagger-set
      inEffect=dataDown.inEffect
      inDirection=dataDown.inDirection
      showItems=dataDown.showItems
    }}
      <li>Seattle</li>
      <li>New York City</li>
      <li>Boston</li>
    {{/stagger-set}}
  `);

  expected = '';
  actual = getNode(this).children[0].style.animationName;
  assert.equal(actual, expected);

  run(() => {
    set(dataDown, 'showItems', true);
  });

  expected = KEYFRAMES_MAP[inDirection].in[inEffect];
  actual = getNode(this).children[0].style.animationName;
  assert.equal(actual, expected);
});


test(`mapping keyframes according to the current direction and effect name`, function (assert) {

  const dataDown = DataDown.create({ outEffect: null, showItems: false });
  this.set('dataDown', dataDown);


  Object.keys(ANIMATION_DIRECTIONS).forEach((animationDirection) => {

    Object.keys(ANIMATION_NAMES).forEach((animationName) => {

      run(() => {
        set(dataDown, 'inEffect', ANIMATION_NAMES[animationName]);
        set(dataDown, 'inDirection', ANIMATION_DIRECTIONS[animationDirection]);
        set(dataDown, 'showItems', true);
      });

      this.render(hbs`
        {{#stagger-set
          inDirection=dataDown.inDirection
          inEffect=dataDown.inEffect
          outEffect=dataDown.outEffect
          showItems=dataDown.showItems
        }}
          <li>Seattle</li>
          <li>New York City</li>
          <li>Boston</li>
        {{/stagger-set}}
      `);


      expected = KEYFRAMES_MAP[ANIMATION_DIRECTIONS[animationDirection]].in[ANIMATION_NAMES[animationName]];
      actual = getNode(this).children[0].style.animationName;
      assert.equal(actual, expected);

    });
  });
});
