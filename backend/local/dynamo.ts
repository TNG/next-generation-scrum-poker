import { AWSError, config, DynamoDB } from 'aws-sdk';
import { CreateTableOutput } from 'aws-sdk/clients/dynamodb';

config.update(
  {
    region: 'local',
    endpoint: 'http://localhost:8000',
  },
  true
);
const dynamodb = new DynamoDB();

export const ddb = new DynamoDB.DocumentClient({
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

const createTable = () =>
  new Promise((resolve, reject) =>
    dynamodb.createTable(params, (error: AWSError, data: CreateTableOutput) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  );

export const prepareTable = async () => {
  for (;;) {
    try {
      const data = await createTable();
      console.log('Created table:', JSON.stringify(data, null, 2));
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
