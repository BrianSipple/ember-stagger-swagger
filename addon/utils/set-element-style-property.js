const DEFAULT_VENDOR_PREFIXES = [
  'webkit',
  'ms',
  'moz',
  'o',
];

export default function setElementStyleProp(element, standardPropName, value, prefixes = DEFAULT_VENDOR_PREFIXES) {
  if (
    element &&
    element instanceof HTMLElement &&
    element.style &&
    value &&
    typeof standardPropName === 'string'
  ) {

    const capitalizedPropName = standardPropName.substring(0, 1).toUpperCase() + standardPropName.substring(1);
    const valueToSet = `${value}`;

    for (const prefix of prefixes) {
      if (element.style[`${prefix}${capitalizedPropName}`]) {
        element.style[`${prefix}${capitalizedPropName}`] = valueToSet;
      }
    }
    element.style[standardPropName] = valueToSet;
  }
}
