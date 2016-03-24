const DEFAULT_VENDOR_PREFIXES = [
  'webkit',
  'ms',
  'moz',
  'o',
];

export default function crossBrowserizeStyleObject (elem, styleProp, styleValue, prefixes = DEFAULT_VENDOR_PREFIXES) {

  if (
    elem &&
    elem instanceof HTMLElement &&
    elem.style &&
    styleValue &&
    typeof styleProp === 'string'
  ) {
    const capitalizedProp = styleProp.substring(0, 1).toUpperCase() + styleProp.substring(1);

    for (const prefix of prefixes) {
      elem.style[`${prefix}${capitalizedProp}`] = `${styleValue}`;
    }
  }
}
