# rcast

PWA podcast player written with Lightning Web Components.

## Commands

```sh
yarn start          # start the node server
yarn build          # build the app in prod mode

# Mics.
yarn lint           # run linting
yarn format         # format the code
```

## Project structure

```sh
.
├── scripts
│   ├── shared.js
│   ├── webpack.common.js       # base webpack configuration
│   ├── webpack.dev.js          # webpack config for dev mode
│   └── webpack.prod.js         # webpack config for prod mode
├── src
│   ├── assets                  # app static resource
│   ├── index.html              # page template
│   ├── main.js                 # app entry point
│   └── modules                 # LWC modules directory, containing all the namespaces
│       ├── base                # LWC namespace - base components
│       ├── component           # LWC namespace - app specific components
│       ├── rcast               # LWC namespace - application root component
│       ├── store               # LWC namespace - storage and wire definition modules
│       └── view                # LWC namespace - application view/pages components
├── package.json
└── yarn.lock
```