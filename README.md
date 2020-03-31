# next-generation-scrum-poker

Prototype for a new Scrum Poker

# Config file

Create a file with your custom aws settings. This allows you to deploy
your own stack for testing purposes.

## aws.config

create your own aws.config (use aws-prod.config as template)
and replace following variables

```
stackname="[your-stack]"
subdomainname="[your-bucket]"
tablename="[your-table]"

# constants
basedomainname="playground.aws.tngtech.com"
certificate="arn:aws:acm:eu-central-1:530798195059:certificate/9fb19f73-7147-4e1b-afeb-beb88568d5d5"

# auto generated variables
S3Backend=${subdomainname}
S3Frontend=${subdomainname}.${basedomainname}
StackBase=${stackname}-base
StackBackend=${stackname}-backend
```

## Deployment

### Create the S3 Buckets & deploy FE + BE

Currently it is assumed we are using eu-central-1!

```
./inits3.sh
./scrumctrl.sh --deploy
```

# Frontend

## Development

To test and develop the frontend, run

```shell
cd frontend
npm ci
npm start
```

This will launch TypeScript in watch mode and a server that automatically reloads when any code is edited.

Note that except for TypeScript, which has really fast incremental builds, no further build step is required during development. This is possible due to the use of ES modules in the browser but has some consequences:

- Imports of TypeScript files need to have `.js`(!!) extensions. This is very confusing but the reason is that ES modules need extensions to work and in the created output, the files will have `.js` extensions, not `.ts(x)`. I.e. to import `./Component.tsx`, you write

  ```js
  import Component from './Component.js';
  ```

- All dependencies need to be available as ES modules. This is the biggest pain point as for obscure reasons, many packages including React itself are only distributed as CommonJS modules. For React, we are therefore using a fork that exposes an ES modules build. Another alternative could be to add [Snowpack](https://www.snowpack.dev/) at some point, which will fix this but require some changes to the build setup.
- Dependencies need to be imported via relative paths. I.e. not

  ```js
  import React from 'react';
  ```

  but (in this case) e.g.

  ```js
  import React from '../../node_modules/es-react/dev/react.js';
  ```

To support this, it is very recommended to configure you IDE to always add `.js` extensions and never shorten imports, e.g.

![IntelliJ config](docs/intellij-config.png)

## Production Build

To generate a production build, run

```sh
cd frontend
npm run build
```

This will generate a folder `frontend/dist` that contains a directly deployable artifact without external dependencies that can be served as a static web site.

## License

[Licensed under Apache License Version 2.0](LICENSE)
