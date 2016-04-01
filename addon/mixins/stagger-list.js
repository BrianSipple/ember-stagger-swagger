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
import setElementStyleProperty from 'ember-stagger-swagger/utils/set-element-style-property';
import getAnimationPrefix from 'ember-stagger-swagger/utils/get-animation-prefix';

const {
  Mixin,
  computed,
  run,
  warn,
  assert,
} = Ember;

const {
  notEmpty,
  bool,
} = computed;


const defaults = {

  /**
   * 2 frames per item (1 frame @ 60fps ~= 16ms) creates a noticeably staggered
   * but still-perceptively fluid motion.
   * (see: https://en.wikipedia.org/wiki/Traditional_animation#.22Shooting_on_twos.22)
   */
  STAGGER_INTERVAL: 32,

  INITIAL_DELAY: 0,

  TOTAL_DURATION_MS: 500,

  IN_TIMING_FUNCTION: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',  // ease-out-cubic
  OUT_TIMING_FUNCTION: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',  // ease-in-cubic
};


const CLASS_NAMES = {
  untoggled: 'hasnt-entered',
  listItemCompletedInitialToggle: 'completed-initial-enter',
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
  SCALE: 'scale',
};

const KEYFRAMES_MAP = {
  [ANIMATION_DIRECTIONS.LEFT]: {
    in: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeInFromRight',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideInFromRight',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeIn',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleIn',
    },
    out: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeOutLeft',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideOutLeft',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeOut',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleOut',
    },
  },
  [ANIMATION_DIRECTIONS.DOWN]: {
    in: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeInFromTop',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideInFromTop',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeIn',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleIn',
    },
    out: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeOutDown',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideOutDown',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeOut',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleOut',
    },
  },
  [ANIMATION_DIRECTIONS.RIGHT]: {
    in: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeInFromLeft',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideInFromLeft',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeIn',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleIn',
    },
    out: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeOutRight',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideOutRight',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeOut',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleOut',
    },
  },
  [ANIMATION_DIRECTIONS.UP]: {
    in: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeInFromBottom',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideInFromBottom',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeIn',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleIn',
    },
    out: {
      [ANIMATION_NAMES.SLIDE_AND_FADE]: '__EmberStaggerSwagger__SlideAndFadeOutUp',
      [ANIMATION_NAMES.SLIDE]: '__EmberStaggerSwagger__SlideOutUp',
      [ANIMATION_NAMES.FADE]: '__EmberStaggerSwagger__FadeOut',
      [ANIMATION_NAMES.SCALE]: '__EmberStaggerSwagger__ScaleOut',
    },
  },
};


export default Mixin.create({

  classNames: ['_ember-stagger-swagger_stagger-list'],
  classNameBindings: [`hasListToggled::${CLASS_NAMES.untoggled}`],

  /* ----------------------- API ------------------------ */

  /**
   * Flag for manually triggering either the show or hide animation
   *
   * By default, the list items will animate in on render, but
   * but this allows the user to have full toggle control if they want it.
   */
  showItems: true,


  /* MILLESECONDS */
  staggerInterval: null,

  /* MILLESECONDS */
  initialDelay: null,

  inDirection: null,
  outDirection: null,

  inEffect: null,
  outEffect: null,
  customInEffect: null,
  customOutEffect: null,


  /* Timing Function */
  inTimingFunc: null,
  outTimingFunc: null,
  timingFunc: null, // single timing function for both in and out

  /* Duration (milleseconds) */
  inDuration: 0,
  outDuration: 0,
  duration: 0,  // single duration for both in and out


  /* ----------------------- /API ------------------------ */
  isAnimating: false,
  hasListToggled: false,

  /* trigger the entrance animation when this element is inserted into the DOM */
  enterOnRender: true,  // TODO: Support

  /**
   * Callback (to be initialized) for our animationstart event listener
   */
  _onStaggerStart: null,

  /**
   * Callback (to be initialized) for our animationend event listener
   */
  _onStaggerComplete: null,


  /**
   * Callback (to be initialized) for caching the DOM nodes of our child elements
   * when they get added to the DOM
   */
  _onChildElementsInserted: null,

  _childInsertionListener: null,

  /**
   * Array of cached "list item" elements to cache upon insertion
   */
  _listItemElems: null,

  /**
   * We'll be caching the animation prefix (if any) that's needed to
   * modify DOM element style properties.
   */
  _animationPrefix: null,


  hasItemsToAnimate: notEmpty('_listItemElems'),

  isReadyToAnimate: computed('hasItemsToAnimate', 'isAnimating', function isReadyToAnimate () {
    return this.get('hasItemsToAnimate') && !this.get('isAnimating');
  }),

  _inAnimationName: computed('inEffect', 'customInEffect', 'inDirection', function computeInAnimationName () {
    return this.get('customInEffect') || KEYFRAMES_MAP[this.get('inDirection')].in[this.get('inEffect')];
  }),

  _outAnimationName: computed('outEffect', 'customOutEffect', 'outDirection', function computeOutAnimationName () {
    return this.get('customOutEffect') || KEYFRAMES_MAP[this.get('outDirection')].out[this.get('outEffect')];
  }),

  currentAnimationName: computed(
    '_inAnimationName',
    '_outAnimationName',
    'showItems',
    'needsToAnimateAfterInit',
    function currentAnimationName() {
      return ( this.get('showItems') || this.get('needsToAnimateAfterInit') ) ?
        this.get('_inAnimationName')
        :
        this.get('_outAnimationName');
    }
  ),

  currentAnimationDuration: computed('duration', 'inDuration', 'outDuration', 'showItems', function computeDuration () {
    // give priority to a specified in/out duration
    if (this.get('duration')) {
      return this.get('duration');
    }

    // otherwise, set according to the state of showItems
    return this.get('showItems') ?
      this.get('inDuration') || defaults.TOTAL_DURATION_MS
      :
      this.get('outDuration') || defaults.TOTAL_DURATION_MS;
  }),

  currentAnimationTimingFunction: computed('inTimingFunc', 'outTimingFunc', 'timingFunc', 'showItems', function computeCurrentTimingFunction () {
    // give priority to a specified in/out duration
    if (this.get('timingFunc')) {
      return this.get('timingFunc');
    }

    // otherwise, set according to the state of showItems
    return this.get('showItems') ? this.get('inTimingFunc') : this.get('outTimingFunc');
  }),

  needsToAnimateAfterInit: computed('enterOnRender', 'hasListToggled', 'isReadyToAnimate', function needsInitialRender () {
    return (
      !this.get('hasListToggled') &&
      this.get('enterOnRender') &&
      this.get('isReadyToAnimate')
    );
  }),

  init () {
    this._super(...arguments);

    this._resolveInitialTimingAttrs();
    this._resolveInitialStaggerDirections();
    this._resolveInitialTimingFunctions();
  },


  didInsertElement () {
    this._super(...arguments);

    this._initAnimationCallbacks();

    if (this.element.children && this.element.children.length) {
      this._syncWithDOM();

    } else {
      this._initChildInsertionCallback();
      this._initChildInsertionListener();
    }
  },


  /**
   * Trigger the staggering animation when something on the outside updates `showItems`
   */
  didUpdateAttrs (attrData) {
    this._super(...arguments);
    const oldShowItems = (
      typeof attrData.oldAttrs.showItems.value !== 'undefined' &&
      attrData.oldAttrs.showItems.value
    );

    const newShowItems = (
      typeof attrData.newAttrs.showItems.value !== 'undefined' &&
      attrData.newAttrs.showItems.value
    );

    if (oldShowItems !== newShowItems && this.get('isReadyToAnimate')) {
      run.scheduleOnce('afterRender', this, '_triggerAnimation');
    }
  },


  willDestroyElement () {
    this._super(...arguments);

    const animationPrefix = this.get('animationPrefix');
    const startEvent = animationPrefix ? `${animationPrefix}AnimationStart` : 'animationstart';
    const endEvent = animationPrefix ? `${animationPrefix}AnimationEnd` : 'animationend';

    this.element.removeEventListener(`${startEvent}`, this._onStaggerStart, false);
    this.element.removeEventListener(`${endEvent}`, this._onStaggerComplete, false);

    this._listItemElems = null;
    this._childInsertionListener.disconnect();
  },



  _cacheListItems () {
    this.set('_listItemElems', Array.from(this.element.children));
  },

  _cacheAnimationPrefix () {
    this.set('_animationPrefix', getAnimationPrefix(this.element));
  },

  _initAnimationCallbacks () {

    this._onStaggerStart = function onStaggerStart (event) {
      this.set('isAnimating', true);
      this.send('broadcastAnimationStart', event);

    }.bind(this);

    /**
     * AnimationEvent listener for the `animationend` event fired by each
     * child item.
     *
     * If the event corresponds to the last item, we'll trigger a run loop call
     * that will fire immediately after the animation and
     * update `hasListToggled` (if necessary), `isAnimating`, and
     * tell our `broadcastAnimationComplete` action to fire
     *
     */
    this._onStaggerComplete = function onStaggerComplete (event) {

      // only update the DOM after we've finished animating all items
      const hasListToggled = this.get('hasListToggled');
      const lastListItemElem = this._listItemElems[this._listItemElems.length - 1];
      const targetElem = event.target;

      if (!hasListToggled) {
        targetElem.classList.add(CLASS_NAMES.listItemCompletedInitialToggle);
      }

      if (Object.is(targetElem, lastListItemElem)) {
        if (!hasListToggled) {
          this.set('hasListToggled', true);
        }
        run.once(() => {
          this.set('isAnimating', false);
          this.send('broadcastAnimationComplete', event);
        });
      }

    }.bind(this);
  },

  _syncWithDOM () {
    this._cacheListItems();
    this._cacheAnimationPrefix();
    this._prepareItemsInDOM();
    if (this.get('needsToAnimateAfterInit')) {
      run.scheduleOnce('afterRender', this, '_triggerAnimation');
      //this.set('_needsToAnimateAfterInit', true);
    }
  },

  _initChildInsertionCallback () {
    this._onChildElementsInserted = function onChildElementsInserted () {
      run.scheduleOnce('afterRender', this, () => {
        this._syncWithDOM();
      });
    }
  },

  /**
   * For components whose child elements are asynchronously rendered,
   * we can listen for the completion of such rendering and cache our
   * list items then.
   */
  _initChildInsertionListener () {
    this._childInsertionListener = new MutationObserver(function childInsertionListener (mutations) {
      this._onChildElementsInserted();
    }.bind(this));

    this._childInsertionListener.observe(this.element, { childList: true });
  },

  _prepareItemsInDOM () {
    this._setAnimationValuesForItems(false);

    const animationPrefix = this.get('_animationPrefix');
    const startEvent = animationPrefix ? `${animationPrefix}AnimationStart` : 'animationstart';
    const endEvent = animationPrefix ? `${animationPrefix}AnimationEnd` : 'animationend';

    this.element.addEventListener(`${startEvent}`, this._onStaggerStart, false);
    this.element.addEventListener(`${endEvent}`, this._onStaggerComplete, false);
  },


  _resolveInitialTimingAttrs () {
    if (!this.staggerInterval) {
      this.staggerInterval = defaults.STAGGER_INTERVAL;

    } else {

      /* eslint-disable max-len */
      warn(
        `The stagger interval that you attempted to specify was invalid. Please use a numeric value greater than 0. Defaulting to ${defaults.STAGGER_INTERVAL}`,
        !Number.isNaN(Number(this.staggerInterval)) && this.staggerInterval > 0
      );
      /* eslint-enable max-len */
    }

    if (!this.initialDelay) {
      this.initialDelay = defaults.INITIAL_DELAY;

    } else {

      /* eslint-disable max-len */
      warn(
        `The initial delay that you attempted to specify was invalid. Please use a numeric value. Defaulting to ${defaults.INITIAL_DELAY}`,
        !Number.isNaN(Number(this.staggerInterval))
      );
      /* eslint-enable max-len */
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


  _setAnimationValuesForItems (applyName = false) {

    // setting an animation name is what we use to trigger the animation, so only set if asked for
    const currentAnimationName = applyName ? this.get('currentAnimationName'): '';
    const currentStaggerInterval = this.get('staggerInterval');
    const currentAnimationDuration = `${this.get('currentAnimationDuration')}ms`;
    const currentAnimationTimingFunction = this.get('currentAnimationTimingFunction');

    const animationPrefix = this.get('_animationPrefix');
    const propertyPrefix = animationPrefix ? `${animationPrefix}A` : 'a';

    this._listItemElems.forEach((listItemElem, idx) => {
      listItemElem.style[`${propertyPrefix}nimationDelay`] = `${currentStaggerInterval * (idx + 1)}ms`;
      listItemElem.style[`${propertyPrefix}nimationTimingFunction`] = currentAnimationTimingFunction;
      listItemElem.style[`${propertyPrefix}nimationDuration`] = currentAnimationDuration;
      listItemElem.style[`${propertyPrefix}nimationName`] = currentAnimationName;
      listItemElem.style[`${propertyPrefix}nimationFillMode`] = 'both';
    });
  },

  _triggerAnimation() {
    this._setAnimationValuesForItems(true);
  },

  actions: {

    broadcastAnimationStart(animationEvent) {
      if (typeof this.onAnimationStart === 'function') {
        this.onAnimationStart(animationEvent);
      }
    },

    broadcastAnimationComplete(animationEvent) {
      if (typeof this.onAnimationComplete === 'function') {
        this.onAnimationComplete(animationEvent);
      }
    },
  }
});
