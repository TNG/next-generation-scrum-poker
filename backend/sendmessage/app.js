const { loginUser } = require('./login-user.js');
const { setVote } = require('./set-vote.js');
const { resetVotes } = require('./reset-votes.js');
const { revealVotes } = require('./reveal-votes.js');
const { broadcastState } = require('./broadcast-state.js');

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage,
  });
  const connectionId = event.requestContext.connectionId;
  const { type, payload } = JSON.parse(event.body).data;

  switch (type) {
    case 'login':
      await loginUser(payload.user, payload.session, connectionId, TABLE_NAME, ddb);
      break;
    case 'reveal-votes':
      await revealVotes(connectionId, TABLE_NAME, ddb);
      break;
    case 'set-vote':
      await setVote(payload.vote, connectionId, TABLE_NAME, ddb);
      break;
    case 'reset-votes':
      await resetVotes(connectionId, TABLE_NAME, ddb);
      break;
  }

  const postCalls = await broadcastState(connectionId, apigwManagementApi, TABLE_NAME, ddb);

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
