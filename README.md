# next-generation-scrum-poker
Prototype for a new Scrum Poker

# config file
Create a file with your custom aws settings. This allows you to deploy
your own stack for testing purposes.

aws.config
```
stackname="[your-stack]"
bucketname="[your-bucket]"
dynamoname="[your-bucket]"

export stackname
export bucketname
export dynamoname
```


THe S3 bucket has to be created manually via UI.

## License

[Licensed under Apache License Version 2.0](LICENSE)
