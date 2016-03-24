import crossBrowserizeStyleObject from 'ember-stagger-swagger/utils/cross-browserize-style-object';
import { module, test } from 'qunit';


const myDiv = document.createElement('div');

const invalidObject = {
  doesntHaveAStyleProperty: 'shameful',
};

let actual, expected;

module('Unit | Utility | cross-browserize style object');

test(`applying vendor-prefixed properties to a DOM Node object's \
"style" property`, function(assert) {

  crossBrowserizeStyleObject(myDiv, 'animation', 'twirl 3s ease-in-out');

  assert.ok(myDiv.style[`webkitAnimation`]);
  assert.ok(myDiv.style[`msAnimation`]);
  assert.ok(myDiv.style[`mozAnimation`]);
  assert.ok(myDiv.style[`oAnimation`]);
  assert.ok(myDiv.style[`animation`]);

});

test('no-opping when the object passed is not a valid `HTMLElement`', function (assert) {

  expected = Object.create(invalidObject);
  crossBrowserizeStyleObject(invalidObject);
  actual = invalidObject;

  assert.deepEqual(actual, expected);

});
