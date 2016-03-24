# Ember-stagger-swagger

*Ember Addon for staggered list item animations*


## Initial installation
```
ember install ember-stagger-swagger
```

## Usage

`ember-stagger-swagger` ships with a `stagger-list` component that can be used directly in a template to wrap
the items you wish to animate.

By default, the component treats all direct child elements as its "list items":

```

<h2> Spell Ingredients </h2>
{{#stagger-list items=potions}}

  {{#each potions as |potion|}}
    <li>{{potion.name}}</li>
  {{/each}}

{{/stagger-list}}

```

`ember-stagger-swagger` exposes a component mixin that can be imported directly from the addon:
```
import StaggerListMixin from 'ember-stagger-swagger/mixins/stagger-list';
```

### Specifying the stagger type



### Overriding Keyframes






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
