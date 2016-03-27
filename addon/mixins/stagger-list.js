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
//import crossBrowserize from 'ember-stagger-swagger/utils/cross-browserize-style-object';
import setElementStyleProperty from 'ember-stagger-swagger/utils/set-element-style-property';

const {
  Mixin,
  computed,
  run,
  assert,
} = Ember;

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

const STAGGER_DIRECTIONS = {
  LEFT: 'left',
  DOWN: 'down',
  RIGHT: 'right',
  UP: 'up',
};

const ANIMATION_NAME_MAP = {
  [STAGGER_DIRECTIONS.LEFT]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromRight',
    out: '__EmberStaggerSwagger__SlideAndFadeOutRight',
  },
  [STAGGER_DIRECTIONS.DOWN]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromTop',
    out: '__EmberStaggerSwagger__SlideAndFadeOutUp',
  },
  [STAGGER_DIRECTIONS.RIGHT]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromLeft',
    out: '__EmberStaggerSwagger__SlideAndFadeOutLeft',
  },
  [STAGGER_DIRECTIONS.UP]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromBottom',
    out: '__EmberStaggerSwagger__SlideAndFadeOutDown',
  },
};

const ANIMATION_NAME_PREFIXES  = [
  'webkit',
  'ms',
  'moz',
  'o',
];

export default Mixin.create({

  classNames: ['_ember-stagger-swagger_stagger-list'],

  showItems: false,

  /* MILLESECONDS */
  staggerInterval: null,

  staggerDirection: null,
  inAnimationName: null,
  outAnimationName: null,

  /**
   * Callback (to be initialized) for our animationend event listener
   */
  _onStaggerStart: null,
  _onStaggerComplete: null,

  /**
   * Array of cached "list item" elements to cache upon insertion
   */
  _listItemElems: null,


  _inAnimationName: computed('inAnimationName', 'staggerDirection', function computeInAnimationName () {
    return this.get('inAnimationName') || ANIMATION_NAME_MAP[this.get('staggerDirection')].in;
  }),

  _outAnimationName: computed ('outAnimationName', 'staggerDirection', function computeOutAnimationName () {
    return this.get('outAnimationName') || ANIMATION_NAME_MAP[this.get('staggerDirection')].out;
  }),

  currentAnimationName: computed(
    '_inAnimationName',
    '_outAnimationName',
    'showItems',
    function currentAnimationName() {
      return this.get('showItems') ? this.get('_inAnimationName') : this.get('_outAnimationName');
    }
  ),


  init () {
    this._super(...arguments);

    this._initStaggerInterval();

    assert(
      'stagger-list must have a valid `staggerDirection`',
      !!this.staggerDirection && !!ANIMATION_NAME_MAP[this.staggerDirection]
    );
  },


  didInsertElement () {
    this._super(...arguments);

    this._initStaggerAnimationFunctions();
    this._cacheListItems();
    run.scheduleOnce('afterRender', this, '_setInitialDisplayState');
  },


  /**
   * Trigger the staggering animation when something on the outside updates `showItems`
   */
  didUpdateAttrs () {
    this._super(...arguments);

    const showItems = this.get('showItems');
    const classToAdd = showItems ? CLASS_NAMES.itemsShowing : CLASS_NAMES.itemsCollapsing
    const classToRemove = showItems ? CLASS_NAMES.itemsCollapsing : CLASS_NAMES.itemsShowing;

    run.once(() => {
      this.element.classList.remove(classToRemove);
      this.element.classList.add(classToAdd);
    });

    run.scheduleOnce('afterRender', this, () => {
      this._setAnimationNameOnItems(this.get('currentAnimationName'));
    });
  },


  willDestroyElement () {
    this._super(...arguments);

    this.element.removeEventListener('animationend', this._onStaggerComplete);
    this.element.removeEventListener('webkitAnimationEnd', this._onStaggerComplete);
    this.element.removeEventListener('oAnimationEnd', this._onStaggerComplete);
    this.element.removeEventListener('msAnimationEnd', this._onStaggerComplete);

    this._listItemElems = null;
  },



  _cacheListItems () {
    this._listItemElems = Array.from(this.element.children);
  },

  _initStaggerAnimationFunctions () {

    /* AnimationEvent listener to handle keeping the list items hidden */
    this._onStaggerComplete = function onStaggerComplete (event) {

      // only update the DOM after we've finished animating all items
      const lastListItemElem = this.element.lastElementChild;

      if (Object.is(event.target, lastListItemElem)) {
        run.once(() => {
          debugger;
          this.element.classList.toggle(CLASS_NAMES.itemsHidden);
        });
      }

    }.bind(this);

    // this._onStaggerStart = function onStaggerStart (event) {
    //   run.once(() => {
    //
    //   });
    // }
  },


  _setInitialDisplayState () {
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
    this._listItemElems.forEach((listItemElem, idx) => {
      delay = (idx + 1) * interval;
      setElementStyleProperty(listItemElem, 'animationDelay', `${delay}ms`);  // TODO: Something more efficient than a full-prefix-list sledgehammer?
    });
  },

  _initStaggerInterval () {
    if (!this.staggerInterval) {
      this.staggerInterval = DEFAULT_STAGGER_INTERVAL;

    } else {
      assert(
        'stagger interval must be a numeric value greater than 0',
        !Number.isNaN(Number(this.staggerInterval)) && this.staggerInterval > 0
      );
    }
  },

  _setAnimationNameOnItems(currentAnimationName) {
    this._listItemElems.forEach((listItemElem, idx) => {
      setElementStyleProperty(listItemElem, 'animationName', currentAnimationName);
    });
  },

});
