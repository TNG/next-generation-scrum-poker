import { promisify } from 'util';

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

const TableName = 'scrum-poker-local';

const params = {
  TableName,
  KeySchema: [{ AttributeName: 'primaryKey', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'primaryKey', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

const createTable = promisify(dynamodb.createTable.bind(dynamodb));

export const prepareTable = async () => {
  while (true) {
    try {
      const data = await createTable(params);
      console.log('Created table:', JSON.stringify(data, null, 2));
      return;
    } catch (err: any) {
      if (err.code === 'ResourceInUseException') {
        console.log(`Table "${TableName}" already exists`);
        return;
      } else if (err.code === 'UnknownEndpoint') {
        console.log('Database not found, retrying...');
      } else {
        console.error('Error creating table:', JSON.stringify(err, null, 2));
        return;
      }
    }
  }
};
