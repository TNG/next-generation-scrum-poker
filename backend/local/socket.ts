import * as WebSocket from 'ws';
import { onConnect } from '../onconnect/src/on-connect';
import { ddb } from './dynamo';
import { onMessage } from '../sendmessage/src/on-message';

interface WebsocketWithId extends WebSocket {
  id: string;
}

export const startWebSocketServer = () => {
  const wss = new WebSocket.Server({
    port: 8080,
    host: 'localhost',
  });

  wss.on('connection', (ws) => {
    (ws as WebsocketWithId).id = generateId(16);
    onConnect(ddb, (ws as WebsocketWithId).id).then((e) => {
      console.log('onConnect', e);
    });

    ws.on('message', (data) => {
      const message = JSON.parse(String(data));
      const config = {
        connectionId: (ws as WebsocketWithId).id,
        tableName: 'scrum-poker-local',
        ddb,
        handler: {
          postToConnection: (postData: { ConnectionId: string; Data: unknown }) => {
            const wsc = Array.from(wss.clients.values()).filter(
              (wssc) => postData.ConnectionId === (wssc as WebsocketWithId).id
            );
            if (wsc.length === 1) {
              wsc[0].send(postData.Data);
            }
            return { promise: () => Promise.resolve() }; // a hack to be aws compliant
          },
        },
      };
      onMessage(message.data, config)
        .then((result) => console.log('Processed message', result))
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
