export default function getAnimationPrefix(element) {

  if (element instanceof HTMLElement && element.style) {

    if (typeof element.style.animation !== 'undefined') {
      return '';
    }

    if (typeof element.style.webkitAnimation !== 'undefined') {
      return 'webkit';
    }

    if (typeof element.style.mozAnimation !== 'undefined') {
      return 'moz';
    }

    if (typeof element.style.msAnimation !== 'undefined') {
      return 'ms';
    }

    if (typeof element.style.oAnimation !== 'undefined') {
      return 'o';
    }

  }
}
