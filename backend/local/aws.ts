import awsLite from '@aws-lite/client';

// singleton AWS instance for local development
export const awsPromise = awsLite({
  // We need a real region to not fail validation
  region: 'eu-central-1',
  host: 'localhost',
  port: 8000,
  protocol: 'http',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
});
