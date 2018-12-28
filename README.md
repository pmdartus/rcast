## Feedbacks

* Install `@lwc/engine` and `@lwc/compiler` is a real footgun, we need a single `lwc` module
* Poor experience with the lwc resolver. We need a better heuristic to ship and resolve LWC modules in non-core projects:
    * With the default configuration of the `@lwc/rollup-plugin`, it takes +2 seconds before each rollup invocation to find all the components present in `node_modules` folder for a project with this complexity.
    * `@lwc/module-resolver` package contains the `__test__` folder. But since the `@lwc/modules-resolver` recursively walk the `node_modules` directory, the fixtures modules will be resolved: `fake/module2`, `other-resource`.
* When the component grows in complexity in term of event handling, it requires a lot of back-and-forth between the template and the component class. I would be great to support single file component.
* Naming convention is awkward, `progressBar` -> `progress-bar`,... But we get use to it little by little. 
* Need some documentation around controlled input vs. uncontrolled input: https://reactjs.org/docs/uncontrolled-components.html / https://reactjs.org/docs/forms.html
* Need to restart watcher to pick-up css. Took me 10 minutes to remember this.
* Unnecessary DOM node re-creation: `<span>{foo}</span>`, when `foo` is updated the `span` appears to be recreated (the `<span>` blinks in the Chrome devtool). This need to be investigated a bit more.
* `@lwc/rollup-plugin` doesn't play well with other rollup plugin. `import gridIcon from '../../../public/svg/grid.svg';` can't be used along with the `rollup-plugin-svg` because it throws the following error `WC1005: No available transformer for "/Users/p.dartus/code/_tmp/rcast/src/client/public/svg/grid.svg`.
* By default the `@lwc/rollup-plugin` doesn't allow the definition of custom properties and there is no way to configure it. A workaround is to define everything in the `index.html`.
* Creation of a new component requires to restart the build watch.
* Engine at runtime should warn if a the object doesn't have a property accessed from the template defined (make sure the property is at least set `null` or `undefined`). This would avoid a lot of pain when the property name has a typo in the template.
* The compiler care about what get's imported from LWC or not. It's the job of rollup. `Invalid import. "LigthningElement" is not part of the lwc api.`
* Clunky error message: `[LWC warning]: Property "podcast" of [object:vm undefined (5)] is set to a non-trackable object, which means changes into that object cannot be observed.`. This error message appears when set a `Response` object to a track property.
* Debugging application with shadow DOM enabled on an iPhone with safari debugger is painful! The debugger doesn't allow to inspect the native shadow DOM, only the top level element is debuggable. 
* Validating the HTML attribute name is really painful. For example `<animate>` SVG tag element with `attributeName` attribute is not recognazied by the the compiler. So I am blocked and it would require to update the compiler to make it pass.
* The following error message is useless: `If property active decorated with @api in [object:vm undefined (2)] is used in the template, the value true set manually may be overridden by the template, consider binding the property only in the template.`
* Really hard to debug styling with multiple shadow and slots in between.
* Really bad error message: `Assert Violation: evaluateTemplate() second argument must be an imported template instead of undefined`. This is caused when the render method returns `undefined`. We should improve the error message. We should not throw if the template is `undefined`, this is pretty bad (icon was missing a template). How does it works when we want to lazyload the content of the component?
* When project starts growing rollup start being slow (+3s to recompile). Spend all the time in redoing the glob (`resolveLwcNpmModules`), we should really optimize this. Dropping `rollup-plugin-filesize` and `resolveLwcNpmModules`, drop the compilation time in watch mode to 300ms.
* It's really strange to have another package to install the `@lwc/wire-service` and import the wire decorator from `lwc`
* Error message can be improved when an error occurs when evaluating a template. Source map five 
```
Uncaught (in promise) TypeError: Cannot read property 'name' of undefined
    at tmpl$G (spinner.js:9)
    at evaluateTemplate (engine.js:7144)
    at invokeComponentRenderMethod (engine.js:7323)
    at renderComponent (engine.js:7462)
    at rehydrate (engine.js:8926)
    at renderVM (engine.js:8827)
    at insertCustomElmHook (engine.js:6035)
    at Object.insert (engine.js:6365)
    at updateDynamicChildren (engine.js:5294)
    at updateChildrenHook (engine.js:6043)
```
* `registerWireService` API is awkward. You pass the register function into it... We should strive for a better API to register/use the wire service along with the engine.
* The source mapping is completely off when working on a large project.
* Registering the wire adapter make it really hard to mock and unit test. Why should it be registered in the first place, it yet again some state that the application has to keep track of.

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
