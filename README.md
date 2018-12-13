## Feedbacks

* Install `@lwc/engine` and `@lwc/compiler` is a real footgun, we need a single `lwc` module
* Poor experience with the lwc resolver. We need a better heuristic to ship and resolve LWC modules in non-core projects:
    * With the default configuration of the `@lwc/rollup-plugin`, it takes +2 seconds before each rollup invocation to find all the components present in `node_modules` folder for a project with this complexity.
    * `@lwc/module-resolver` package contains the `__test__` folder. But since the `@lwc/modules-resolver` recursively walk the `node_modules` directory, the fixtures modules will be resolved: `fake/module2`, `other-resource`.
* When the component grows in complexity in term of event handling, it requires a lot of back-and-forth between the template and the component class. I would be great to support single file component.
* Naming convention is awkward, `progressBar` -> `progress-bar`,...
* Need some documentation around controlled input vs. uncontrolled input: https://reactjs.org/docs/uncontrolled-components.html / https://reactjs.org/docs/forms.html
* Need to restart watcher to pick-up css. Took me 10 minutes to remember this.
* Unnecessary DOM node re-creation: `<span>{foo}</span>`, when `foo` is updated the `span` appears to be recreated (the `<span>` blinks in the Chrome devtool). This need to be investigated a bit more.

## Credits

* Podcast search and directory API: [fyyd-api](https://github.com/eazyliving/fyyd-api) 
* Icons collection: [Media Player - Outline by Nawicon Studio](https://thenounproject.com/nawiconstudio/collection/media-player-outline/)
* Icon collection: [categories Jemis mali](https://thenounproject.com/jemismali/collection/categories/)
* Heart by Marvin Wilhelm from the Noun Project
* gamepad by shashank singh from the Noun Project
* Video Player by Sarah Throne-Ploehn from the Noun Project
* Art by Shastry from the Noun Project
* news by shashank singh from the Noun Project
* grid by LAFS from the Noun Project
* Search by kitzsingmaniiz from the Noun Project

## Resources

* [Using the Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
