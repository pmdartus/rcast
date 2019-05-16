# rcast

PWA podcast player written with Lightning Web Components.

## Getting started

```sh
yarn install
yarn start
```

## Commands

```sh
yarn                # install dependencies and build the application
yarn start          # start the node server

# Build
yarn build:dev      # build the app in dev mode
yarn build:prod     # build the app in prod mode

# Mics.
yarn test           # run the app tests
yarn lint           # run linting
yarn format         # format the code
```

## Project structure

```sh
.
├── scripts
│   ├── lwc-webpack-plugin          # webpack plugin to compile LWC modules
│   ├── lwc-webpack-resolver        # webpack plugin to resolve LWC modules
│   ├── shared.js
│   ├── webpack.common.js           # base webpack configuration
│   ├── webpack.dev.js              # webpack config for dev mode
│   └── webpack.prod.js             # webpack config for prod mode
├── src
│   ├── server                      # server-side node server code
│   └── client                      # client side app code
│       ├── assets                  # app static resource
│       ├── index.html              # page template
│       ├── main.js                 # app entry point
│       └── modules                 # LWC modules directory, containing all the namespaces
│           ├── base                # LWC namespace - base components
│           ├── component           # LWC namespace - app specific components
│           ├── rcast               # LWC namespace - application root component
│           ├── store               # LWC namespace - storage and wire definition modules
│           └── view                # LWC namespace - application view/pages components
├── package.json
└── yarn.lock
```