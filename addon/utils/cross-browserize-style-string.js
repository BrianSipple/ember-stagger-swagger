const DEFAULT_VENDOR_PREFIXES = [
  'webkit',
  'ms',
  'moz',
  'o',
];

export default function crossBrowserizeStyleString (styleProp = '', styleValue, prefixes) {
  const prefixList = Array.isArray(prefixes) ? prefixes : DEFAULT_VENDOR_PREFIXES;

  return prefixList
    .map(prefix => `-${prefix}-${styleProp}: ${styleValue};`)
    .join(' ');
}
