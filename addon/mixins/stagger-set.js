/**
* stagger-set mixin
*
* A component mixin that renders list items by performing a staggered animation of their
* entrance/exit by listening to a "showItems" binding.
*
* A "list item" is considered anything that's supplied as a direct child
* element of the component's template block.
*/
import Ember from 'ember';
import Constants from 'ember-stagger-swagger/constants/constants';
import getAnimationPrefix from 'ember-stagger-swagger/utils/get-animation-prefix';

const {
  Mixin,
  computed,
  run,
  Logger: { warn },
  assert,
  isNone,
} = Ember;

const {
  notEmpty,
} = computed;

const {
  CLASS_NAMES,
  DEFAULTS,
  ANIMATION_DIRECTIONS,
  ANIMATION_NAMES,
  KEYFRAMES_MAP,
} = Constants;

const warningPreface = 'ember-stagger-swagger:stagger-set-mixin: ';

export default Mixin.create({

  classNames: ['__ember-stagger-swagger__stagger-set'],
  classNameBindings: [`hasListToggled::${CLASS_NAMES.untoggled}`],

  /* -------------------------------------------------------------------- *
  * ----------------------- API ------------------------ *
  * -------------------------------------------------------------------- */
  inDirection: null,
  outDirection: null,
  inEffect: null,
  outEffect: null,
  customInEffect: null,
  customOutEffect: null,

  /* trigger the entrance animation when this element is inserted into the DOM */
  enterOnRender: true,

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
  inDelay: null,
  outDelay: null,

  /* Timing Function */
  inTimingFunc: null,
  outTimingFunc: null,
  timingFunc: null, // single timing function for both in and out

  /* Duration (milliseconds) */
  inDuration: null,
  outDuration: null,
  duration: null,  // convinience option for a single in/out duration
  /* -------------------------------------------------------------------- *
  * ----------------------- /API ------------------------ *
  * -------------------------------------------------------------------- */


  isAnimating: false,
  hasListToggled: false,

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

  needsToEnterAfterInit: computed('enterOnRender', 'hasListToggled', 'isReadyToAnimate', 'showItems', function needsInitialRender () {
    return (
      !this.get('hasListToggled') &&
      this.get('enterOnRender') &&
      this.get('showItems') &&
      this.get('isReadyToAnimate')
    );
  }),

  currentAnimationName: computed(
    '_inAnimationName',
    '_outAnimationName',
    'showItems',
    'needsToEnterAfterInit',
    function currentAnimationName() {
      return ( this.get('showItems') || this.get('needsToEnterAfterInit') ) ?
        this.get('_inAnimationName')
        :
        this.get('_outAnimationName');
    }
  ),

  currentAnimationDuration: computed('duration', 'inDuration', 'outDuration', 'showItems', function computeDuration () {
    // give priority to a valid general duration
    const generalDuration = this.get('duration');
    if (!isNone(generalDuration) && !Number.isNaN(Number(generalDuration)) && generalDuration > 0) {
      return generalDuration;
    }

    // otherwise, set according to the state of showItems
    return this.get('showItems') ? this.get('inDuration') : this.get('outDuration');
  }),

  currentAnimationTimingFunction: computed('inTimingFunc', 'outTimingFunc', 'showItems', function computeCurrentTimingFunction () {
    // otherwise, set according to the state of showItems
    return this.get('showItems') ? this.get('inTimingFunc') : this.get('outTimingFunc');
  }),

  /* -------------------- LIFECYCLE HOOKS ---------------------- */
  init () {
    this._super(...arguments);

    this._resolveInitialTimingAttrs();
    this._resolveInitialEffectAttrs();
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


    this.set('_onStaggerStart', null);
    this.set('_onStaggerComplete', null);
    this.set('_listItemElems', null);

    if (this._childInsertionListener) {
      this._childInsertionListener.disconnect();
      this.set('_childInsertionListener', null);
      this.set('_onChildElementsInserted', null);
    }
  },

  /* -------------------- ACTIONS ---------------------- */
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
  },

  /* -------------------- HELPERS ---------------------- */
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
        run.once(() => {
          if (!hasListToggled) {
            this.set('hasListToggled', true);
          }
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
    if (this.get('needsToEnterAfterInit')) {
      run.scheduleOnce('afterRender', this, '_triggerAnimation');
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


  /**
  * helper function called on init that ensures we're wired up
  * with acceptable timing properties, PROVIDING WARNINGS when
  * the user specified something invalid
  */
  _resolveInitialTimingAttrs () {

    this.staggerInterval = this.staggerInterval || DEFAULTS.STAGGER_INTERVAL_MS;
    this.inDelay = this.inDelay || DEFAULTS.ANIMATION_DELAY_IN;
    this.outDelay = this.outDelay || DEFAULTS.ANIMATION_DELAY_OUT;
    this.inDuration = this.inDuration || DEFAULTS.ANIMATION_DURATION_IN;
    this.outDuration = this.outDuration || DEFAULTS.ANIMATION_DURATION_OUT;

    /* eslint-disable max-len */
    if (isNone(this.staggerInterval) || Number.isNaN(Number(this.staggerInterval)) || this.staggerInterval < 32) {
      warn(warningPreface, `Invalid \`staggerInterval\`: ${this.staggerInterval}. Please use a numeric value greater than or equal to 32 (milliseconds). Defaulting to ${DEFAULTS.STAGGER_INTERVAL_MS} milliseconds`);
      this.staggerInterval = DEFAULTS.STAGGER_INTERVAL_MS;
    }

    if (isNone(this.inDelay) || Number.isNaN(Number(this.inDelay)) || this.inDelay < 0) {
      warn(warningPreface, `Invalid \`inDelay\`: ${this.inDelay}. Please use a numeric value greater than or equal to zero. Defaulting to ${DEFAULTS.ANIMATION_DELAY_IN}`);
      this.inDelay = DEFAULTS.ANIMATION_DELAY_IN;
    }

    if (isNone(this.outDelay) || Number.isNaN(Number(this.outDelay)) || this.outDelay < 0) {
      warn(warningPreface, `Invalid \`outDelay\`: ${this.outDelay}. Please use a numeric value greater than or equal to zero. Defaulting to ${DEFAULTS.ANIMATION_DELAY_OUT}`);
      this.outDelay = DEFAULTS.ANIMATION_DELAY_IN;
    }

    if (isNone(this.inDuration) || Number.isNaN(Number(this.inDuration)) || this.inDuration <= 0) {
      warn(warningPreface, `Invalid \`inDuration\`: ${this.inDuration}. Please use a numeric value greater than zero. Defaulting to ${DEFAULTS.ANIMATION_DURATION_IN}`);
      this.inDuration = DEFAULTS.ANIMATION_DURATION_IN;
    }

    if (isNone(this.outDuration) || Number.isNaN(Number(this.outDuration)) || this.outDuration <= 0) {
      warn(warningPreface, `Invalid \`outDuration\`: ${this.outDuration}. Please use a numeric value greater than zero. Defaulting to ${DEFAULTS.ANIMATION_DURATION_OUT}`);
      this.outDuration = DEFAULTS.ANIMATION_DURATION_OUT;
    }
    /* eslint-enable max-len */

    // Set a default timing functoin if none is provided, but don't warn
    if (isNone(this.inTimingFunc)) {
      this.inTimingFunc = DEFAULTS.TIMING_FUNCTION_IN;
    }
    if (isNone(this.outTimingFunc)) {
      this.outTimingFunc = DEFAULTS.TIMING_FUNCTION_OUT;
    }
  },

  /**
  * helper function called on init that ensures we're wired up
  * with acceptable aniamation effect properties, THROWING ERRORS when
  * required attributes are invalid and warning when optional attributes
  * are set but invalid.
  */
  _resolveInitialEffectAttrs () {
    assert(
      `stagger-set must have a valid \`inDirection\`. Received \`${this.inDirection}\``,  // TODO: Link to docs
      !isNone(this.inDirection) && !!KEYFRAMES_MAP[this.inDirection]
    );
    assert(
      `stagger-set must have a valid \`inEffect\`. Received \`${this.inEffect}\``,  // TODO: Link to docs
      !isNone(this.inEffect) && !!KEYFRAMES_MAP[this.inDirection].in[this.inEffect]
    );

    /* eslint-disable max-len */
    if (isNone(this.outDirection)) {
      this.outDirection = this.inDirection;

    } else if (!KEYFRAMES_MAP[this.outDirection]) {
      warn(warningPreface, `Invalid \`outDirection\`: ${this.outDirection}. Defaulting to ${this.inDirection}`);
      this.outDirection = this.inDirection;
    }

    if (isNone(this.outEffect)) {
      this.outEffect = this.inEffect;

    } else if (!!KEYFRAMES_MAP[this.outDirection].out[this.outEffect]) {
      warn(warningPreface, `Invalid \`outEffect\`: ${this.outEffect}. Defaulting to ${this.inEffect}`);
      this.outEffect = this.inEffect;
    }
    /* eslint-enable max-len */
  },

  _setAnimationValuesForItems (applyName = false) {

    // setting an animation name is what we use to trigger the animation, so only set if asked for
    const currentAnimationName = applyName ? this.get('currentAnimationName'): '';
    const currentStaggerInterval = this.get('staggerInterval');
    const currentAnimationDuration = `${this.get('currentAnimationDuration')}ms`;
    const currentAnimationTimingFunction = this.get('currentAnimationTimingFunction');

    // inDelay / outDelay
    const currentDelay = this.get('showItems') ? this.get('inDelay') : this.get('outDelay');    
    
    const animationPrefix = this.get('_animationPrefix');
    const propertyPrefix = animationPrefix ? `${animationPrefix}A` : 'a';
    
    this._listItemElems.forEach((listItemElem, idx) => {
      listItemElem.style[`${propertyPrefix}nimationDelay`] = `${(currentStaggerInterval * (idx + 1)) + currentDelay}ms`;    
      listItemElem.style[`${propertyPrefix}nimationTimingFunction`] = currentAnimationTimingFunction;
      listItemElem.style[`${propertyPrefix}nimationDuration`] = currentAnimationDuration;
      listItemElem.style[`${propertyPrefix}nimationName`] = currentAnimationName;
      listItemElem.style[`${propertyPrefix}nimationFillMode`] = 'both';
    });
  },

  _triggerAnimation() {
    this._setAnimationValuesForItems(true);
  },

});
