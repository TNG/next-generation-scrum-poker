const { loginUser } = require('./login-user.js');
const { setVote } = require('./set-vote.js');
const { setScale } = require('./set-scale.js');
const { resetVotes } = require('./reset-votes.js');
const { revealVotes } = require('./reveal-votes.js');
const { removeUsersNotVoted } = require('./remove-users-not-voted.js');

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName,
  });
  const connectionId = event.requestContext.connectionId;
  const { type, payload } = JSON.parse(event.body).data;
  const config = {
    connectionId,
    tableName: TABLE_NAME,
    ddb,
    apigwManagementApi,
  };

  try {
    switch (type) {
      case 'login':
        await loginUser(payload.user, payload.session, config);
        break;
      case 'set-scale':
        await setScale(payload.scale, config);
        break;
      case 'reveal-votes':
        await revealVotes(config);
        break;
      case 'set-vote':
        await setVote(payload.vote, config);
        break;
      case 'reset-votes':
        await resetVotes(config);
        break;
      case 'remove-users-not-voted':
        await removeUsersNotVoted(config);
        break;
    }
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
