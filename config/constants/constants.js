const DEFAULTS = {

  /**
  * 2 frames per item (1 frame @ 60fps ~= 16ms) creates a noticeably staggered
  * but still-perceptively fluid motion.
  * (see: https://en.wikipedia.org/wiki/Traditional_animation#.22Shooting_on_twos.22)
  */
  STAGGER_INTERVAL_MS: 32,

  ANIMATION_DELAY_IN: 0,
  ANIMATION_DELAY_OUT: 0,

  ANIMATION_DURATION_IN: 500,
  ANIMATION_DURATION_OUT: 500,

  TIMING_FUNCTION_IN: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',  // ease-out-cubic
  TIMING_FUNCTION_OUT: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',  // ease-in-cubic
};

const foo = {

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


export default {
  foo,
  b,
  DEFAULTS: DEFAULTS,
  ANIMATION_DIRECTIONS,
  ANIMATION_NAMES,
  KEYFRAMES_MAP,
};
