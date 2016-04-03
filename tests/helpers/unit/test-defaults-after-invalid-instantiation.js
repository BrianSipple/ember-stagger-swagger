/**
 * Helper function that instantiates an object with invalid property values,
 * and tests that the value was set to an expected default.
 *
 */
export default function testDefaultsAfterInvalidInstantiation (
  assert,
  constructorObj,
  propName,
  expectedValue,
  standardObjConfig = {},
  invalidInputs
) {

  invalidInputs.forEach((input) => {
    subject = constructorObj.create({ ...standardObjConfig, [propName]: input });
    expected = expectedValue;
    actual = subject.get(`${propName}`);
    assert.equal(actual, expected);
  });

};
