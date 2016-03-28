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


const defaults = {

  /**
   * 2 frames per item (1 frame @ 60fps ~= 16ms) creates a noticeably staggered
   * but still-perceptively fluid motion.
   * (see: https://en.wikipedia.org/wiki/Traditional_animation#.22Shooting_on_twos.22)
   */
  STAGGER_INTERVAL: 32,

  IN_TIMING_FUNCTION: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',  // ease-out-cubic
  OUT_TIMING_FUNCTION: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',  // ease-in-cubic
};


const CLASS_NAMES = {
  itemsHidden: 'items-hidden',
  itemsShowing: 'items-showing',
  itemsCollapsing: 'items-collapsing',
};

const ANIMATION_DIRECTIONS = {
  LEFT: 'left',
  DOWN: 'down',
  RIGHT: 'right',
  UP: 'up',
};

const ANIMATION_NAMES = {
  SLIDE_AND_FADE: 'slideAndFade',
  SLIDE: 'slide',
  FADE: 'fade',
  //SCALE: 'scale', // TODO: Scale from left, right, up, down, and up
};

const KEYFRAMES_MAP = {
  [ANIMATION_DIRECTIONS.LEFT]: {
    in: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeInFromRight',
    },
    out: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeOutLeft',
    },
  },
  [ANIMATION_DIRECTIONS.DOWN]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromTop',
    out: '__EmberStaggerSwagger__SlideAndFadeOutDown',
  },
  [ANIMATION_DIRECTIONS.RIGHT]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromLeft',
    out: '__EmberStaggerSwagger__SlideAndFadeOutRight',
  },
  [ANIMATION_DIRECTIONS.UP]: {
    in: '__EmberStaggerSwagger__SlideAndFadeInFromBottom',
    out: '__EmberStaggerSwagger__SlideAndFadeOutUp',
  },
  // [ANIMATION_DIRECTIONS.LEFT]: {
  //   in: '__EmberStaggerSwagger__SlideAndFadeInFromRight',
  //   out: '__EmberStaggerSwagger__SlideAndFadeOutLeft',
  //   inverseDirection: ANIMATION_DIRECTIONS.RIGHT,
  // },
  // [ANIMATION_DIRECTIONS.DOWN]: {
  //   in: '__EmberStaggerSwagger__SlideAndFadeInFromTop',
  //   out: '__EmberStaggerSwagger__SlideAndFadeOutDown',
  //   inverseDirection: ANIMATION_DIRECTIONS.UP,
  // },
  // [ANIMATION_DIRECTIONS.RIGHT]: {
  //   in: '__EmberStaggerSwagger__SlideAndFadeInFromLeft',
  //   out: '__EmberStaggerSwagger__SlideAndFadeOutRight',
  //   inverseDirection: ANIMATION_DIRECTIONS.LEFT,
  // },
  // [ANIMATION_DIRECTIONS.UP]: {
  //   in: '__EmberStaggerSwagger__SlideAndFadeInFromBottom',
  //   out: '__EmberStaggerSwagger__SlideAndFadeOutUp',
  //   inverseDirection: ANIMATION_DIRECTIONS.DOWN,
  // },
};

const ANIMATION_NAME_PREFIXES  = [
  'webkit',
  'ms',
  'moz',
  'o',
];

export default Mixin.create({

  classNames: ['_ember-stagger-swagger_stagger-list'],


  /* ----------------------- API ------------------------ */

  /* Flag for triggering either the show or hide animation */
  showItems: false,

  /* trigger the entrance animation when this element is inserted into the DOM */
  enterOnRender: false,

  /* MILLESECONDS */
  staggerInterval: null,

  inDirection: null,
  outDirection: null,
  inAnimationName: null,
  outAnimationName: null,

  /* Timing Function */
  inTimingFunc: null,
  outTimingFunc: null,
  timingFunc: null, // single timing function for both in and out

  /* Duration (seconds) */
  inDuration: 0.5,
  outDuration: 0.5,
  duration: 0.5,  // single duration for both in and out

  /* ----------------------- /API ------------------------ */


  isAnimating: false,

  /**
   * Callback (to be initialized) for our animationend event listener
   */
  _onStaggerStart: null,
  _onStaggerComplete: null,

  /**
   * Array of cached "list item" elements to cache upon insertion
   */
  _listItemElems: null,


  _inAnimationName: computed('inAnimationName', 'inDirection', function computeInAnimationName () {
    return this.get('inAnimationName') || KEYFRAMES_MAP[this.get('inDirection')].in;
  }),

  _outAnimationName: computed('outAnimationName', 'outDirection', function computeOutAnimationName () {
    return this.get('outAnimationName') || KEYFRAMES_MAP[this.get('outDirection')].out;
  }),

  currentAnimationName: computed(
    '_inAnimationName',
    '_outAnimationName',
    'showItems',
    function currentAnimationName() {
      return this.get('showItems') ? this.get('_inAnimationName') : this.get('_outAnimationName');
    }
  ),

  currentAnimationDuration: computed('inDuration', 'outDuration', 'duration', 'showItems', function computeCurrentAnimationDuration () {
    // give priority to a specified in/out duration
    if (this.get('duration')) {
      return this.get('duration');
    }

    // otherwise, set according to the state of showItems
    return this.get('showItems') ? this.get('inDuration') : this.get('outDuration');
  }),

  currentAnimationTimingFunction: computed('inTimingFunc', 'outTimingFunc', 'timingFunc', 'showItems', function computeCurrentTimingFunction () {
    // give priority to a specified in/out duration
    if (this.get('timingFunc')) {
      return this.get('timingFunc');
    }

    // otherwise, set according to the state of showItems
    return this.get('showItems') ? this.get('inTimingFunc') : this.get('outTimingFunc');
  }),


  init () {
    this._super(...arguments);

    this._resolveInitialStaggerInterval();
    this._resolveInitialStaggerDirections();
    this._resolveInitialTimingFunctions();
  },


  didInsertElement () {
    this._super(...arguments);

    this._initAnimationCallbacks();
    this._cacheListItems();
    run.scheduleOnce('afterRender', this, '_prepareItemsInDOM');
  },


  /**
   * Trigger the staggering animation when something on the outside updates `showItems`
   */
  didUpdateAttrs (attrData) {
    this._super(...arguments);

    const showItems = attrData.newAttrs.showItems.value;

    // animate when showItems has changed
    if (showItems !== attrData.oldAttrs.showItems.value) {
      const classToAdd = showItems ? CLASS_NAMES.itemsShowing : CLASS_NAMES.itemsCollapsing
      const classToRemove = showItems ? CLASS_NAMES.itemsCollapsing : CLASS_NAMES.itemsShowing;

      run.once(() => {
        this.element.classList.remove(classToRemove);
        this.element.classList.add(classToAdd);
      });
      run.scheduleOnce('afterRender', this, () => {
        this._triggerAnimation();
      });
    }
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

  _initAnimationCallbacks () {

    /* AnimationEvent listener to handle keeping the list items hidden */
    this._onStaggerComplete = function onStaggerComplete (event) {

      // only update the DOM after we've finished animating all items
      const lastListItemElem = this.element.lastElementChild;

      if (Object.is(event.target, lastListItemElem)) {
        run.once(() => {
          this.set('isAnimating', false);
          this.element.classList.toggle(CLASS_NAMES.itemsHidden);
        });
      }

    }.bind(this);
  },


  _prepareItemsInDOM () {
    if (!this.showItems) {
      this.element.classList.add(CLASS_NAMES.itemsHidden);
    }

    this._setInitialAnimationValuesForItems();
    this.element.addEventListener('animationend', this._onStaggerComplete, false);
    this.element.addEventListener('webkitAnimationEnd', this._onStaggerComplete, false);
    this.element.addEventListener('oAnimationEnd', this._onStaggerComplete, false);
    this.element.addEventListener('msAnimationEnd', this._onStaggerComplete, false);
  },


  _resolveInitialStaggerInterval () {
    if (!this.staggerInterval) {
      this.staggerInterval = defaults.STAGGER_INTERVAL;

    } else {
      assert(
        'stagger interval must be a numeric value greater than 0',
        !Number.isNaN(Number(this.staggerInterval)) && this.staggerInterval > 0
      );
    }
  },

  _resolveInitialStaggerDirections () {
    // enforce inDirection
    assert(
      'stagger-list must have a valid `inDirection`',
      !!this.inDirection && !!KEYFRAMES_MAP[this.inDirection]
    );

    // if not set, set the default outDirection to the continuation of the inDirection
    if (!this.outDirection) {
      this.outDirection = this.inDirection;

    } else if (!KEYFRAMES_MAP[this.outDirection]) {
      warn(`invalid \`outDirection\`. Defaulting to the continuation of \`inDirection\`
        https://https://github.com/BrianSipple/ember-stagger-swagger#usage`
      );
      this.outDirection = this.inDirection;
    }
  },

  _resolveInitialTimingFunctions () {
    this.inTimingFunc = this.inTimingFunc || defaults.IN_TIMING_FUNCTION;
    this.outTimingFunc = this.outTimingFunc || defaults.OUT_TIMING_FUNCTION;
  },


  _setInitialAnimationValuesForItems () {
    const animationDelay = this.get('staggerInterval');
    const easingFunction = this.get('currentAnimationTimingFunction');
    const animationDuration = `${this.get('currentAnimationDuration')}ms`;

    this._listItemElems.forEach((listItemElem, idx) => {
      setElementStyleProperty(listItemElem, 'animationDelay', `${animationDelay * (idx + 1)}ms`);
      setElementStyleProperty(listItemElem, 'animationTimingFunction', easingFunction);
      setElementStyleProperty(listItemElem, 'animationDuration', animationDuration);
    });
  },

  // _updateStylePropertyForItems (propName, value, addIndexMultiple = false) {
  //   if (addIndexMultiple) {
  //     this._listItemElems.forEach((item, idx) => {
  //       setElementStyleProperty(item, propName, value + (value * idx));
  //     });
  //   } else {
  //     this._listItemElems.forEach(item => { setElementStyleProperty(item, propName, value); });
  //   }
  // },

  _triggerAnimation() {
    const currentAnimationName = this.get('currentAnimationName');
    const currentAnimationDelay = this.get('staggerInterval');
    const currentAnimationDuration = `${this.get('currentAnimationDuration')}ms`;
    const currentAnimationTimingFunction = this.get('currentAnimationTimingFunction');

    this.set('isAnimating', true);
    this._listItemElems.forEach((listItemElem, idx) => {
      setElementStyleProperty(listItemElem, 'animationDelay', `${currentAnimationDelay * (idx + 1)}ms`);
      setElementStyleProperty(listItemElem, 'animationTimingFunction', currentAnimationTimingFunction);
      setElementStyleProperty(listItemElem, 'animationDuration', currentAnimationDuration);
      setElementStyleProperty(listItemElem, 'animationName', currentAnimationName);
    });
  },

});
