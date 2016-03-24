/**
 * Get the actual DOM node of of the component rendered during an integration
 * test, which, initially, will have a parent div wrapping it.
 *
 * This gives us direct access to the element, and, inherently, the DOM API
 */
export default function getNode (context) {
  // allow for context to be passed as a param, otherwise, use the bound "this"
  context = context || this;
  return context.$()[0].firstElementChild;
}
