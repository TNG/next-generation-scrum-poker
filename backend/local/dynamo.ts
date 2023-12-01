import { AWSError } from '../shared/types';
import { awsPromise } from './aws';

const TableName = 'scrum-poker-local';

const createTable = async () => {
  const aws = await awsPromise;
  const tableData = await aws.DynamoDB.CreateTable({
    TableName,
    KeySchema: [{ AttributeName: 'primaryKey', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'primaryKey', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });
  console.log('Created table:', JSON.stringify(tableData, null, 2));
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
      if ((err as AWSError).Message === 'Cannot create preexisting table') {
        console.log(`Table "${TableName}" already exists`);
        return;
      } else if (err.message.includes('ECONNREFUSED') || err.message.includes('socket hang up')) {
        console.log('Database not found, retrying...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        console.error('Error creating table:', err);
        process.exit(1);
      }
    }
  }
  console.error(`Database was not available within ${DATABASE_WAIT_SECONDS}s.`);
  process.exit(1);
};
