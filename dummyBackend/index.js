const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const state = {
  resultsVisible: false,
  votes: {
    happyUser: 'not-voted',
    otherUser: '3',
  },
};

wss.on('connection', (ws) => {
  console.log('connection', ws.readyState);
  ws.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage);
    console.log(message);
    switch (message.data.type) {
      case 'login':
        state.votes[message.data.payload.user] = 'not-voted';
        break;
      case 'set-vote':
        state.votes['frontend-user'] = message.data.payload.vote;
        break;
      case 'reveal-votes':
        state.resultsVisible = true;
        break;
      case 'reset-votes':
        state.resultsVisible = false;
        Object.keys(state.votes).forEach((user) => (state.votes[user] = 'not-voted'));
    }

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(state));
      }
    }
  });
});
server.listen(4000, () => console.log(`Server started on port ${server.address().port}`));
