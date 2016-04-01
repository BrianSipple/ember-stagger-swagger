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
  * _required_: maybe (if no `outDirection` is set)
  * _default_: The provided `outDirection`.
  * _constraints_: The direction must be a keyword matching either `left`, `down`, `right`, or `up`.

##### <a name="api-outDirection"></a> `outDirection`  
  * _description_: The direction of animation when the items stagger out of view. The direction must be a keyword matching either `left`, `down`, `right`, or `up`.
  * _required_: maybe (if no `inDirection` is set)
  * _default_: The provided `inDirection`.
  * _constraints_: The direction must be a keyword matching either `left`, `down`, `right`, or `up`.  

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
  * _description_: the number of milleseconds between the animation of successive items in the set.
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






#### Practical Tips

Technically, a `stagger-set` component has no required arguments; it will simply wrap its content in a `<div>` element if left unmodified. This is so that it can be configured in several different ways before making any assumptions about how to render items, compute animation values, etc.

With that in mind, let's see how we can really move things.


The minimum amount of configuration required for a `stagger-set` component to get things moving, so to speak, is either an `inDirection` or `outDirection` matching one of either `left`, `down`, `right`, or `up`.



### Specifying the stagger direction




### Specifying Custom Keyframes


## Hooks

* `onAnimationStart`: called immediately after the last item in the set triggers its [`animationstart`](https://developer.mozilla.org/en-US/docs/Web/Events/animationstart) event.
  * called with:
    * `animationEvent`: the [`animationevent` object](https://developer.mozilla.org/en-US/docs/Web/Events/animationstart#Properties)

* `onAnimationComplete`: called immediately after the last item in the set triggers its [`animationend`](https://developer.mozilla.org/en-US/docs/Web/Events/animationend) event.
  * called with:
    * `animationEvent`: the [`animationevent` object](https://developer.mozilla.org/en-US/docs/Web/Events/animationend#Properties)

Together, these hooks can provide more control over interactions with the component during its animation. For example, if you set up a button to trigger toggles of the animation, you might want to make sure that its disable between the start and completion events.

## Future Goals
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
