1.0.10 / 15-05-2016 (dd-mm-yyyy)
================================
* `visibility` is no longer set to `hidden` on items that have yet to be animated in (The only rule now applied is `opacity: 0`). This prevents an issue in Safari where even when toggling `visibility` back to `visible`, items would retain their status of `hidden`.

1.0.9 / 20-04-2016
================================
* Upgrade to `ember@2.5` and `ember-cli@2.6.0-beta.1`

1.0.8 / 20-04-2016
================================
* Fix typo in README describing when the `onAnimationStart` action was called.

1.0.7 / 09-04-2016
================================
* perform short-circuited default setting before warning for invalid arguments.
* use `Ember.Logger.warn` instead of `Ember.warn`

1.0.6 / 06-04-2016
================================
* hotfix: set `isDevelopingAddon` to false 😳

1.0.5 / 04-04-2016
================================
* Fix build by using Chrome in TravisCI.

1.0.4 / 03-04-2016
================================
* Remove dependency adding in blueprint (see: https://github.com/BrianSipple/ember-stagger-swagger/issues/1)

1.0.3 / 03-04-2016
================================
* Bring keyframes into main css file
  * Fixes broken import
  * Removes need for postCSS build step.

1.0.2 / 03-04-2016
================================
* Implement addPackagesToProject inside of the main blueprint `afterInstall` hook so that CSS is properly processed.

1.0.1 / 03-04-2016
================================
* Minor README fixes.

1.0.0 / 03-04-2016
================================
* Initial release version.
