import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb/dist-types/commands/CreateTableCommand';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { AWSError } from '../shared/types';

const dynamodb = new DynamoDB({
  apiVersion: '2012-08-10',
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: { accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey' },
});

export const ddb = DynamoDBDocument.from(dynamodb);

const TableName = 'scrum-poker-local';

const params: CreateTableCommandInput = {
  TableName,
  KeySchema: [{ AttributeName: 'primaryKey', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'primaryKey', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

const createTable = async () => {
  try {
    const tableData = await dynamodb.createTable(params);
    console.log('Created table:', JSON.stringify(tableData, null, 2));
  } catch (err) {
    if (err && (err as AWSError).name === 'ResourceInUseException') {
      console.log('Table already exists');
      return;
    }
    throw err;
  }
};

const DATABASE_WAIT_SECONDS = 60;

export const prepareTable = async () => {
  // Wait at most 60s for the database to be available
  const timeout = Date.now() + DATABASE_WAIT_SECONDS * 1000;
  while (Date.now() < timeout) {
    try {
      await createTable();
      return;
    } catch (err) {
      if (!(err instanceof Error)) {
        return;
      }
      if ((err as AWSError).code === 'ResourceInUseException') {
        console.log(`Table "${TableName}" already exists`);
        return;
      } else if (['UnknownEndpoint', 'ECONNRESET'].includes((err as AWSError).code!)) {
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
