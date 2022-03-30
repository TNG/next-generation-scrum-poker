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

const DATABASE_WAIT_SECONDS = 60;

export const prepareTable = async () => {
  // Wait at most 60s for the database to be available
  const timeout = Date.now() + DATABASE_WAIT_SECONDS * 1000;
  while (Date.now() < timeout) {
    try {
      const data = await createTable();
      console.log('Created table:', JSON.stringify(data, null, 2));
      return;
    } catch (err) {
      if (!(err instanceof Error)) {
        return;
      }
      if ((err as AWSError).code === 'ResourceInUseException') {
        console.log(`Table "${TableName}" already exists`);
        return;
      } else if ((err as AWSError).code === 'UnknownEndpoint') {
        console.log('Database not found, retrying...');
      } else {
        console.error('Error creating table:', JSON.stringify(err, null, 2));
        process.exit(1);
      }
    }
  }
  console.error(`Database was not available within ${DATABASE_WAIT_SECONDS}s.`);
  process.exit(1);
};
