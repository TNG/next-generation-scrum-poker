# next-generation-scrum-poker

Prototype for a new Scrum Poker

## Development

You need a running [docker](https://docs.docker.com/get-docker/) daemon for local development. To test and develop backend and frontend, run

```shell
npm start
```

This will spin up the database via `docker` and launch the local API gateway.

In parallel, it will use [Vite](https://vitejs.dev) to serve your app on [http://localhost:5175](http://localhost:5175). Vite will automatically update the browser via hot module reloading on save while providing extremely fast rebuilds.

## Production Build

To generate a production build for the frontend, run

```sh
API_URL=wss://my.api.gateway.com npm run build:frontend
```

replacing the API gateway with your production gateway. If you do not specify it, the development gateway will be used.

This will generate a folder `frontend/dist` that contains a directly deployable artifact without external dependencies that can be served as a static website.

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

## Tests

To run the frontend unit tests via [Vitest](https://vitest.dev), run

```shell
npm test
```

To run all E2E tests via [Playwright](https://playwright.dev), install playwright first once with `npx playwright install`, then run

```shell
npm run e2e
```

Note that this will download a docker image on first run, which may lead to a test timeout. Subsequent runs should work without problems though. If the dev environment is already running, then the tests will reuse it. To work on single E2E tests, run

```shell
npm run e2e:ui
```

which will start the Playwright test runner in UI mode. You can then select the tests you want to run and also watch tests.

To debug a test in the browser, run

```shell
npx playwright test <test-file-name.spec.ts> --debug
```

## License

[Licensed under Apache License Version 2.0](LICENSE)
