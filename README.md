# next-generation-scrum-poker

Prototype for a new Scrum Poker

## Development

You need a running [docker](https://docs.docker.com/get-docker/) demon for local development. To test and develop backend and frontend, run

```shell
npm start
```

This will spin up the database via `docker` and launch the local API gateway.

In parallel, it will use [Vite](https://vitejs.dev) to serve your app on [http://localhost:3000](http://localhost:3000). Vite will automatically update the browser via hot module reloading on save while providing extremely fast rebuilds.

For the parallel execution, you will need to have `npm-run-all` installed:

```shell
npm install -g npm-run-all
```

## Production Build

To generate a production build for the frontend, run

```sh
API_URL=wss://my.api.gateway.com npm run build:frontend
```

replacing the API gateway with your production gateway. If you do not specify it, the development gateway will be used.

This will generate a folder `frontend/dist` that contains a directly deployable artifact without external dependencies that can be served as a static web site.

To test the production build locally, run

```shell
npm run preview
```

Note that you can also specify an `API_URL` for `npm start` and `npm run preview`.

To build the backend, run

```shell
npm run build:backend
```

which will generate `build` folders for each backend function that can be deployed as AWS lambda functions.

## License

[Licensed under Apache License Version 2.0](LICENSE)
