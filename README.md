# ember-stagger-swagger

*Stagger animation for Ember Components (see the demo [here](demo-link))*


## Initial installation
```
ember install ember-stagger-swagger
```

## Usage

`ember-stagger-swagger` ships with a `stagger-set` component that can be used directly in a template to wrap the items that you wish to animate.

The component treats all direct child elements as its "list items":

```

<h2>Spell Ingredients </h2>
{{#stagger-set}}

  {{#each potions as |potion|}}
    <li>{{potion.name}}</li>
  {{/each}}

{{/stagger-set}}

```

`ember-stagger-swagger` exposes a component mixin that can be imported directly from the addon:
```
import StaggerSetMixin from 'ember-stagger-swagger/mixins/stagger-set';
```

## API

##### <a name="api-inDirection"></a>`inDirection`  
  * _description_: The direction of animation when the items stagger into view.
  * _required_: yes
  * _constraints_: A string keyword matching either `'left'`, `'down'`, `'right'`, or `'up'`.

##### <a name="api-outDirection"></a> `outDirection`  
  * _description_: The direction of animation when the items stagger out of view.
  * _required_: no
  * _default_: The provided `inDirection`.
  * _constraints_: A string keyword matching either `'left'`, `'down'`, `'right'`, or `'up'`.

##### <a name="api-inEffect"></a> `inEffect`  
  * _description_: A recognized animation effect applied to each list item when it's animating in.
  * _required_: yes
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

##### <a name="api-enterOnRender"></a> `enterOnRender`  
  * _description_: Whether or not the elements in the stagger set should animate into view when the component is rendered.
  * _required_: no
  * _default_: `true`
  * _constraints_: `true` or `false`  

##### <a name="api-showItems"></a> `showItems`  
  * _description_: Manual hook for toggling the animation back and forth according to its in and out settings.
  * _required_: no
  * _default_: `true` to correspond with [`enterOnRender`](#api-enterOnRender)'s default.
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
  * _constraints_: a string matching any [valid CSS `timing-function` value](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).


##### <a name="api-outTimingFunc"></a> `outTimingFunc`  
  * _description_: The [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) applied to each item in the set when it's animating out.
  * _required_: no
  * _default_: `cubic-bezier(0.55, 0.055, 0.675, 0.19)` (AKA ["ease-in-cubic"](http://easings.net/#easeInCubic))
  * _constraints_: a string matching any [valid CSS `timing-function` value](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).

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

##### <a name="api-outDuration"></a> `outDuration`  
  * _description_: The [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) applied to each item in the set when it's animating out.
  * _required_: no
  * _default_: `cubic-bezier(0.55, 0.055, 0.675, 0.19)` (AKA ["ease-in-cubic"](http://easings.net/#easeInCubic))
  * _constraints_: a string matching any [valid CSS `timing-function` value](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).

##### <a name="api-duration"></a> `duration`  
  * _description_: A convenience property to set a single duration on both the entrance and exit animations. If set alongside any `inDuration` or `outDuration`, this property will take precedence
  * _required_: no
  * _default_: null (property is ignored if unset),
  * _constraints_: a numeric value greater than zero




### Practical Tips

Technically, a `stagger-set` component has no required arguments; it will simply wrap its content in a `<div>` element if left unmodified. This is so that it can be configured in several different ways before making any assumptions about how to render items, compute animation values, etc.

With that in mind, let's see how we can really move things.


The minimum amount of configuration required for a `stagger-set` component to get things moving, so to speak, is either an `inDirection` or `outDirection` matching one of either `left`, `down`, `right`, or `up`.



#### Stagger directions

#### Effect Types



#### Custom Keyframes


## Action Hooks

* `onAnimationStart`: called immediately after the last item in the set triggers its [`animationstart`](https://developer.mozilla.org/en-US/docs/Web/Events/animationstart) event.
  * called with:
    * `animationEvent`: the [`animationevent` object](https://developer.mozilla.org/en-US/docs/Web/Events/animationstart#Properties)

* `onAnimationComplete`: called immediately after the last item in the set triggers its [`animationend`](https://developer.mozilla.org/en-US/docs/Web/Events/animationend) event.
  * called with:
    * `animationEvent`: the [`animationevent` object](https://developer.mozilla.org/en-US/docs/Web/Events/animationend#Properties)

Together, these hooks can provide more control over interactions with the component during its animation. For example, if you set up a button to trigger toggles of the animation, you might want to make sure that its disable between the start and completion events.


## Future Goals
* Improved vertical slide effects
  * possibly break the mixins apart to deal with vertical and horizontal animation separately?
* Removing need for any CSS by using the Web Animations API.
  * Libraries like GSAP or Velocity are great for fulfilling that today (see: [`liquid-fire-velocity`](https://github.com/ember-animation/liquid-fire-velocity)), but they're too heavy for just a handful of base defaults and go against `stagger-swagger's` zero-dependency design goals.






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
