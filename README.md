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
npm start
```

This will use [Vite](https://vitejs.dev) to serve your app on [http://localhost:3000](http://localhost:3000). Vite will automatically update the browser via hot module reloading on save while providing extremely fast rebuilds.

## Production Build

To generate a production build, run

```sh
npm run build:frontend
```

This will generate a folder `frontend/dist` that contains a directly deployable artifact without external dependencies that can be served as a static web site.

To test the production build locally, run

```shell
npm run preview
```

## License

[Licensed under Apache License Version 2.0](LICENSE)
