import { AWSError } from 'aws-sdk';
import { CreateTableOutput, GetItemOutput, PutItemOutput } from 'aws-sdk/clients/dynamodb';

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});
const dynamodb = new AWS.DynamoDB();

export const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const params = {
  TableName: 'scrum-poker-local',
  KeySchema: [{ AttributeName: 'primaryKey', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'primaryKey', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

export const createTable = () =>
  dynamodb.createTable(params, function (err: AWSError, data: CreateTableOutput) {
    if (err) {
      console.error('Error JSON.', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table.', JSON.stringify(data, null, 2));
    }
  });

const putItem = (connectionId: string) => {
  ddb.put(
    {
      TableName: 'scrum-poker-local',
      Item: {
        primaryKey: `connectionId:${connectionId}`,
        connectionId: connectionId,
      },
    },
    (err: AWSError, data: PutItemOutput) => {
      console.log(err);
      console.log(data);
    }
  );
};

const getItem = (connectionId: string) => {
  ddb.get(
    {
      TableName: 'scrum-poker-local',
      Key: {
        primaryKey: `connectionId:${connectionId}`,
      },
    },
    (err: AWSError, data: GetItemOutput) => {
      console.log(err);
      console.log(data);
    }
  );
};

// a simple test - remove me
// putItem('4');
// getItem('4');
