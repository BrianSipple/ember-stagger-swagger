import crossBrowserizeStyleObject from 'ember-stagger-swagger/utils/cross-browserize-style-object';
import { moduleFor, test } from 'ember-qunit';


const VENDOR_PREFIXES = [
  'webkit',
  'ms',
  'moz',
  'o',
];

const domNodeLikeObject = {
  style: {}
};

const invalidObject = {
  doesntHaveAStyleProperty: 'shameful'
};

let actual, expected;

module('Unit | Utility | dom/cross-browserize style');

test(`applying vendor-prefixed properties to a DOM Node object's \
"style" property`, function(assert) {

  crossBrowserizeStyleObject(domNodeLikeObject, 'animation', 'twirl 3s ease-in-out');

  expected = VENDOR_PREFIXES;
  actual = Object
    .keys(domNodeLikeObject.style)
    .map(propName => propName.slice(0, propName.search(/[A-Z]/)));

  assert.deepEqual(actual, expected);

});
