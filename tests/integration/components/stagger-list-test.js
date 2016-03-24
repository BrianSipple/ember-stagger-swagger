import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import getNode from 'tests/helpers/integration/get-node';

let actual, expected;

moduleForComponent('stagger-list', 'Integration | Component | stagger list', {
  integration: true
});

// const CLASS_NAMES = {
//   itemsHidden: 'items-hidden',
//   itemsShowing: 'items-showing',
//   itemsCollapsing: 'items-collapsing',
// };
//
// const ANIMATION_NAME_MAP = {
//   left: {
//     in: 'SlideAndFadeInFromRight',
//     out: 'SlideAndFadeOutRight',
//   },
//   down: {
//     in: 'SlideAndFadeInFromTop',
//     out: 'SlideAndFadeOutUp',
//   },
//   right: {
//     in: 'SlideAndFadeInFromLeft',
//     out: 'SlideAndFadeOutLeft',
//   },
//   up: {
//     in: 'SlideAndFadeInFromBottom',
//     out: 'SlideAndFadeOutDown',
//   },
// };

test('rendering', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{stagger-list}}`);

  expected = '';
  actual = getNode(this).textContent;
  assert.equal(actual, expected);

  // Template block usage:
  this.render(hbs`
    {{#stagger-list}}
      template block text
    {{/stagger-list}}
  `);

  expected = 'template block text';
  actual = getNode(this).textContent;
  assert.equal(actual, expected);
});


// test('choosing the animation direction', function (assert) {
//
// });
//
//
// test(`toggling the element's class hooks when the
// value of the \`itemsShowing\` attribute changes`, function (assert) {
//
//
//
// });
//
//
// test('overriding the animation keyframes applied', function (assert) {
//
// });
