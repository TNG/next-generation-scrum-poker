import * as WebSocket from 'ws';
import { onConnect } from '../onconnect/src/on-connect';
import { ddb } from './dynamo';
import { onMessage } from '../sendmessage/src/on-message';
import { onDisconnect } from '../ondisconnect/src/on-disconnect';

interface WebsocketWithId extends WebSocket {
  id: string;
}

export const startWebSocketServer = () => {
  const wss = new WebSocket.Server({
    port: 8080,
    host: 'localhost',
  });

  wss.on('connection', (ws) => {
    const socketId = generateId(16);
    (ws as WebsocketWithId).id = socketId;

    const config = {
      connectionId: socketId,
      tableName: 'scrum-poker-local',
      ddb,
      handler: {
        postToConnection: (postData: { ConnectionId: string; Data: unknown }) => {
          const client = [...wss.clients].find(
            (client) => (postData.ConnectionId = (client as WebsocketWithId).id)
          );
          const resultPromise = client
            ? new Promise<void>((resolve, reject) =>
                client.send(postData.Data, (error) => (error ? reject(error) : resolve()))
              )
            : Promise.reject(new Error(`Could not find client with id ${postData.ConnectionId}`));
          return { promise: () => resultPromise };
        },
      },
    };

    onConnect(config).then((result) => console.log('Connected', socketId, result));

    ws.on('close', () =>
      onDisconnect(config)
        .then((result) => console.log('Disconnected', socketId, result))
        .catch((error) => console.log('Error disconnecting', error))
    );

    ws.on('unexpected-response', (request, message) =>
      console.log(`Unexpected socket response`, request, message)
    );

    ws.on('error', (error) => console.log('Socket error', error));

    ws.on('message', (data) => {
      const message = JSON.parse(String(data));
      onMessage(message.data, config)
        .then((result) => console.log('Processed message', message, result))
        .catch((error) => console.log('Error processing message', error));
    });
  });
};

const generateId = (length: number): string => {
  const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
};
