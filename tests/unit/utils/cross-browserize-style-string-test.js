import crossBrowserizeStyleString from 'ember-stagger-swagger/utils/cross-browserize-style-string';
import { module, test } from 'qunit';

let actual, expected;

const VENDOR_PREFIXES = [
  'webkit',
  'moz',
  'ms',
  'o',
];

module('Unit | Utility | dom/cross browserize style string');

// Replace this with your real tests.
test(`creating a string suitable to be used as an inline
  style value on a DOM element which contains vendor-prefixed versions
  of a style property`, function(assert) {

  expected = '-webkit-flex-grow: 1; -moz-flex-grow: 1; -ms-flex-grow: 1; -o-flex-grow: 1;';

  actual = crossBrowserizeStyleString('flex-grow', '1', VENDOR_PREFIXES);
  assert.equal(actual, expected);
});
