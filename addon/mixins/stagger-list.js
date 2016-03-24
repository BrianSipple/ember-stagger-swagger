/**
 * STAGGERED LIST
 *
 * A component mixin that renders list items by performing a staggered animation of their
 * entrance by listening to a "showItems" binding.
 *
 * NOTE: Right now, a "list item" is considered anything that's supplied as a direct child
 * element of the component's template block.
 */
import Ember from 'ember';
import crossBrowserize from 'ember-stagger-swagger/utils/cross-browserize-style-object';

const { Mixin, run } = Ember;

/**
 * 2 frames per item (1 frame @ 60fps ~= 16ms) creates a noticeably staggered
 * but still-perceptively fluid motion.
 * (see: https://en.wikipedia.org/wiki/Traditional_animation#.22Shooting_on_twos.22)
 */
const DEFAULT_STAGGER_INTERVAL = 32; // ms

const CLASS_NAMES = {
  itemsHidden: 'items-hidden',
  itemsShowing: 'items-showing',
  itemsCollapsing: 'items-collapsing',
};

const ANIMATION_NAME_MAP = {
  left: {
    in: 'SlideAndFadeInFromRight',
    out 'SlideAndFadeOutRight',
  },
  down: {
    in: 'SlideAndFadeInFromTop',
    out 'SlideAndFadeOutUp',
  },
  right: {
    in: 'SlideAndFadeInFromLeft',
    out 'SlideAndFadeOutLeft',
  },
  up: {
    in: 'SlideAndFadeInFromBottom',
    out 'SlideAndFadeOutDown',
  },
};

export default Mixin.create({

  tagName: 'ul',
  classNames: ['_ember-stagger-swagger-stagger-list'],

  showItems: false,

  /* MILLESECONDS */
  staggerInterval: null,

  onStaggerComplete: null,
  staggerDirection: null,


  init () {
    this._super(...arguments);
    if (!this.staggerInterval || Number.isNaN(Number(this.staggerInterval)) ) {
      this.staggerInterval = DEFAULT_STAGGER_INTERVAL;
    } else {
      this.staggerInterval = Math.max(0, Number(this.staggerInterval));
    }
  },


  didInsertElement () {
    this._super(...arguments);

    this._initStaggerAnimationFunction();
    run.scheduleOnce('afterRender', this, '_handleInitialDisplay');
  },


  willDestroyElement () {
    this._super(...arguments);

    this.element.removeEventListener('animationend', this._onStaggerComplete);
    this.element.removeEventListener('webkitAnimationEnd', this._onStaggerComplete);
    this.element.removeEventListener('oAnimationEnd', this._onStaggerComplete);
    this.element.removeEventListener('msAnimationEnd', this._onStaggerComplete);
  },

  /**
   * Trigger the staggering animation when something on the outside updates `showItems`
   */
  didUpdateAttrs () {
    this._super(...arguments);

    const showItems = this.get('showItems');
    const classToAdd = showItems ? CLASS_NAMES.itemsShowing : CLASS_NAMES.itemsCollapsing;
    const classToRemove = showItems ? CLASS_NAMES.itemsCollapsing : CLASS_NAMES.itemsShowing;

    run.once(() => {
      this.element.classList.remove(classToRemove);
      this.element.classList.add(classToAdd);
    });
  },


  _initStaggerAnimationFunction () {

    /* AnimationEvent listener to handle keeping the list items hidden */
    this.onStaggerComplete = function onStaggerComplete (event) {

      // only update the DOM after we've finished animating all items
      const lastListItemElem = this.element.lastElementChild;

      if (Object.is(event.target, lastListItemElem)) {
        run.once(() => {
          this.element.classList.toggle(CLASS_NAMES.itemsHidden);
        });
      }

    }.bind(this);
  },


  _handleInitialDisplay () {
    if (!this.showItems) {
      this.element.classList.add(CLASS_NAMES.itemsHidden);
    }
    this._setStaggerProps();
    this.element.addEventListener('animationend', this._onStaggerComplete, false);
    this.element.addEventListener('webkitAnimationEnd', this._onStaggerComplete, false);
    this.element.addEventListener('oAnimationEnd', this._onStaggerComplete, false);
    this.element.addEventListener('msAnimationEnd', this._onStaggerComplete, false);
  },


  _setStaggerProps () {
    const interval = this.get('staggerInterval');

    let delay;
    Array.from(this.element.children).forEach((listItemElem, idx) => {
      delay = (idx + 1) * interval;
      crossBrowserize(listItemElem, 'animationDelay', `${delay}ms`);
      listItemElem.style.animationDelay = `${delay}ms`;
    });
  },



});
