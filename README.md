# ember-stagger-swagger

[![npm version](https://badge.fury.io/js/ember-stagger-swagger.svg)](https://badge.fury.io/js/ember-stagger-swagger) [![Build Status](https://travis-ci.org/BrianSipple/ember-stagger-swagger.svg?branch=master)](https://travis-ci.org/BrianSipple/ember-stagger-swagger) [![Ember Observer Score](http://emberobserver.com/badges/ember-stagger-swagger.svg)](http://emberobserver.com/addons/ember-stagger-swagger) [![Code Climate](https://codeclimate.com/github/BrianSipple/ember-stagger-swagger/badges/gpa.svg)](https://codeclimate.com/github/BrianSipple/ember-stagger-swagger)

*GPU-only stagger animation for Ember Components*

![](http://33.media.tumblr.com/29addca2c908d96a071932761ffd177a/tumblr_nstg1jgKcg1uruo10o1_500.gif)

See the demo [here](#demo).


## Installation
```
ember install ember-stagger-swagger
```

## Usage

`ember-stagger-swagger` ships with a `stagger-set` component that can be used directly in a template to wrap the items that you wish to animate.

Conceptually, the component treats all direct child elements as its _set items_ or _list items_:

```htmlbars

<h2>Spell Ingredients </h2>

{{#stagger-set inDirection="right" inEffect="slideAndFade"}}

  {{#each potions as |potion|}}
    <li>{{potion.name}}</li>
  {{/each}}

{{/stagger-set}}

```

Additionally, `ember-stagger-swagger` exposes a mixin that can be imported directly from the addon and extended however you see fit:
```js.es6
import StaggerSetMixin from 'ember-stagger-swagger/mixins/stagger-set';
```

## API

##### <a name="api-inDirection"></a>`inDirection`  
  * _description_: The direction of animation when the items stagger into view.
  * _required_: *yes*
  * _constraints_: A string keyword matching either `'left'`, `'down'`, `'right'`, or `'up'`.

##### <a name="api-outDirection"></a> `outDirection`  
  * _description_: The direction of animation when the items stagger out of view.
  * _required_: no
  * _default_: The provided `inDirection`.
  * _constraints_: A string keyword matching either `'left'`, `'down'`, `'right'`, or `'up'`.

##### <a name="api-inEffect"></a> `inEffect`  
  * _description_: A recognized animation effect applied to each list item when it's animating in.
  * _required_: *yes*
  * _constraints_: A string keyword matching either `'slideAndFade'`, `'slide'`, `'fade'`, or `'scale'` (see the [demo](#demo) for a preview of each).

##### <a name="api-outEffect"></a> `outEffect`  
  * _description_: A recognized animation effect applied to each list item when it's animating in.
  * _required_: no
  * _default_: the provided `inEffect`
  * _constraints_: A string keyword matching either `'slideAndFade'`, `'slide'`, `'fade'`, or `'scale'` (see the [demo](#demo) for a preview of each).

##### <a name="api-customInEffect"></a> `customInEffect`  
  * _description_: An [animation name](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name) matching a [CSS animation keyframe](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) that you have defined in your project. If specified alongside an `inEffect`, this name will take precedence. This can be used to create your own effects and integrate them with `stagger-swagger`'s built-in functionality.
  * _required_: no
  * _default_: `null`
  * _constraints_: None. Just make sure the name matches a CSS animation keyframe that you have defined in your project.

##### <a name="api-customOutEffect"></a> `customOutEffect`  
  * _description_: An [animation name](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name) matching a [CSS animation keyframe](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) that you have defined in your project. If specified alongside an `outEffect`, this name will take precedence. This can be used to create your own effects and integrate them with `stagger-swagger`'s built-in functionality.
  * _required_: no
  * _default_: `null`
  * _constraints_: None. Just make sure the name matches a CSS animation keyframe that you have defined in your project.


##### <a name="api-showItems"></a> `showItems`  
  * _description_: Manual hook for toggling the set between its entrance and exit animations.
  * _required_: no
  * _default_: `true` to correspond with [`enterOnRender`](#api-enterOnRender)'s default.
  * _constraints_: `true` or `false`    


##### <a name="api-enterOnRender"></a> `enterOnRender`  
  * _description_: Whether or not the elements in the stagger set should animate into view when the component is rendered.  
  *Note:* `enterOnRender` allows for a
  more fine-grained level of control than just using `showItems`. Without `enterOnRender`, initializing the component with `showItems` set to `true` will cause the items to render in their normal visible state, from which the animation can be toggled further. Setting `enterOnRender` to true -- in conjunction with setting `showItems` to true (both of which are the default) -- creates a stagger-in animation on render and then hinges on the state of `showItems` going forward.
  * _required_: no
  * _default_: `true`
  * _constraints_: `true` or `false`   


##### <a name="api-staggerInterval"></a> `staggerInterval`
  * _description_: the number of milliseconds between the animation of successive items in the set.
  * _required_: no
  * _default_: 32ms. 2 frames per item (1 frame @ 60fps ~= 16ms) creates a noticeably staggered but still-perceptively [smooth and fluid motion](https://en.wikipedia.org/wiki/Traditional_animation#.22Shooting_on_twos.22).
  * _constraints_: a number value greater than or equal to 32.


##### <a name="api-inDelay"></a> `inDelay`  
  * _description_: Duration of delay for the items' entrance animation (when the animation is activated).
  * _required_: no
  * _default_: 0
  * _constraints_: a number value greater than or equal to 0.

##### <a name="api-outDelay"></a> `outDelay`  
  * _description_: Duration of delay for the items' exit animation (when the animation is activated).
  * _required_: no
  * _default_: 0
  * _constraints_: a number value greater than or equal to 0.


##### <a name="api-inTimingFunc"></a> `inTimingFunc`  
  * _description_: The [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) applied to each item in the set when it's animating in.
  * _required_: no
  * _default_: `cubic-bezier(0.215, 0.610, 0.355, 1.000)` (AKA ["ease-out-cubic"](http://easings.net/#easeOutCubic))
  * _constraints_: a string matching any [valid CSS `timing-function` value](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function). If this property is invalid, the browser will default to using [`ease`](http://cubic-bezier.com/#.25,.1,.25,1).


##### <a name="api-outTimingFunc"></a> `outTimingFunc`  
  * _description_: The [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) applied to each item in the set when it's animating out.
  * _required_: no
  * _default_: `cubic-bezier(0.55, 0.055, 0.675, 0.19)` (AKA ["ease-in-cubic"](http://easings.net/#easeInCubic))
  * _constraints_: a string matching any [valid CSS `timing-function` value](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function). If this property is invalid, the browser will default to using [`ease`](http://cubic-bezier.com/#.25,.1,.25,1).

##### <a name="api-inDuration"></a> `inDuration`  
  * _description_: The duration (in milliseconds) that *a single item* will take when animating in.
  * _required_: no
  * _default_: 500
  * _constraints_: a numeric value greater than 0

##### <a name="api-outDuration"></a> `outDuration`  
  * _description_: The duration (in milliseconds) that *a single item* will take when animating out.
  * _required_: no
  * _default_: 500
  * _constraints_: a numeric value greater than 0

##### <a name="api-duration"></a> `duration`  
  * _description_: A convenience property to set a single duration on both the entrance and exit animations. If set alongside any `inDuration` or `outDuration`, this property will take precedence
  * _required_: no
  * _default_: null (property is ignored if unset),
  * _constraints_: a numeric value greater than zero




### Practical Tips

#### Styling
Because the DOM elements of Ember components are, by default, `<div>`s, and because it handles setting an `animationName` property on the component's direct children, you can safely design, conceptualize, and style your child elements as you normally would for the list items of a relative container.

Furthermore, because the keyframes for the built-in effects of `slide` and `slideAndFade` define transforms to bring their element in or out of its container's visible bounds (e.g., `transform: translate3d(-100, 0, 0)` at the 100%-stop of a left slide), it may well be useful to restrict overflow on the top-level component's element so that the children disappear when they're outside of said bounds.

The [stagger-set "list items" demo](#demo) is an example of how this would appear.

#### Creating Animation Effects
By default, a `stagger-list` component will attempt to map the keywords provided for `inEffect` or `outEffect` to one of its [built-in keyframes](/app/styles/_keyframes.css).

However, you're free to implement your own keyframes and have them called instead. Just define them in your stylesheets as you would normally, and then pass the keyframe name to a `stagger-list` as a string argument for either `customInEffect` or `customOutEffect`. When these attributes are defined, `stagger-list` will always set them on the `animation-name` property of its child elements' style definition at the appropriate time. 

## Action Hooks

* `onAnimationStart`: called immediately after the last item in the set triggers its [`animationstart`](https://developer.mozilla.org/en-US/docs/Web/Events/animationstart) event.
  * called with:
    * `animationEvent`: the [`animationevent` object](https://developer.mozilla.org/en-US/docs/Web/Events/animationstart#Properties)

* `onAnimationComplete`: called immediately after the last item in the set triggers its [`animationend`](https://developer.mozilla.org/en-US/docs/Web/Events/animationend) event.
  * called with:
    * `animationEvent`: the [`animationevent` object](https://developer.mozilla.org/en-US/docs/Web/Events/animationend#Properties)

Together, these hooks can provide more control over interactions with the component during its animation. For example, if you set up a button to trigger toggles of the animation, you might want to make sure that it's disabled between the start and completion events.


## Future Goals
* [Improved effects for the vertical `slide` animation](#link-to-issue)?  
  * possibly break the mixins apart to deal with vertical and horizontal animation separately?
* Removing need for any CSS by using the Web Animations API.
  * Libraries like GSAP or Velocity are great for fulfilling that today (see: [`liquid-fire-velocity`](https://github.com/ember-animation/liquid-fire-velocity)), but they're too heavy for just a handful of base defaults and go against `ember-stagger-swagger's` zero-dependency design goals.


## Developing Locally

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).



[demo]: http://www.sipple.io/ember-stagger-swagger-demo/
