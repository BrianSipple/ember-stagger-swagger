# Ember-stagger-swagger

*Ember Addon for staggered list item animations*


## Initial installation
```
ember install ember-stagger-swagger
```

## Usage

`ember-stagger-swagger` ships with a `stagger-set` component that can be used directly in a template to wrap
the items you wish to animate.

The component treats all direct child elements as its "list items":

```

<h2> Spell Ingredients </h2>
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

### Configuring animation

Technically, a `stagger-set` component has no required arguments; it will simply wrap its content in a `<div>` element if left unmodified. This is so that it can be configured in several different ways before making any assumptions about how to render items, compute animation values, etc.

With that in mind, let's see how we can really move things.


The minimum amount of configuration required for a `stagger-set` component to get things moving, so to speak, is either an `inDirection` or `outDirection` matching one of either `left`, `down`, `right`, or `up`.


### Specifying the stagger direction



### Specifying Custom Keyframes


### Future Goals
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
