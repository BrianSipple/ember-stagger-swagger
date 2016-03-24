import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import getNode from '../../helpers/integration/get-node';

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
  actual = getNode(this).textContent.trim();
  assert.equal(actual, expected);

  // Template block usage:
  this.render(hbs`
    {{#stagger-list}}
      template block text
    {{/stagger-list}}
  `);

  expected = 'template block text';
  actual = getNode(this).textContent.trim();
  assert.equal(actual, expected);
});

test(`properly setting the \`itemsHidden\` upon insersiton based
  upon the value of \`showItems\``, function (assert) {
  
});


// test('choosing the animation direction', function (assert) {
//
//   this.render(hbs`
//     {{#stagger-list}}
//       <li>Seattle</li>
//       <li>New York City</li>
//       <li>Boston</li>
//     {{/stagger-list}}
//   `);
//
//   expected =
//
//   run(() => {
//     this.set('showItems', true);
//   });
//
//
// });

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
