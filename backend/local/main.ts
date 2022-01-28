import { prepareTable } from './dynamo';
import { startWebSocketServer } from './socket';

const start = async () => {
  await prepareTable();
  startWebSocketServer();
};

start();
