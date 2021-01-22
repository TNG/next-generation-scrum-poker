import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Config } from './types';
import { loginUser } from './login-user';
import { resetVotes } from './reset-votes';
import { removeUsersNotVoted } from './remove-users-not-voted';
import { setScale } from './set-scale';
import { revealVotes } from './reveal-votes';
import { setVote } from './set-vote';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

const TABLE_NAME = process.env.TABLE_NAME || 'scrum_poker';

export const handler: APIGatewayProxyHandler = async (event) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName,
  });
  const connectionId = event.requestContext.connectionId;
  const { type, payload } = JSON.parse(event.body as string).data;
  const config: Config = {
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
