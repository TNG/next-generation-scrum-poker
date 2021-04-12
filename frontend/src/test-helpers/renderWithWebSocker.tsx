import { ComponentChildren } from 'preact';
import { WebSocketApi } from '../types/WebSocket';
import { SCALES } from '../constants';
import { render } from '@testing-library/preact';
import { WebSocketContext } from '../Components/WebSocket';

const doNothing = () => {};

type PartialWebsocketApi = {
  [P in keyof WebSocketApi]?: P extends 'state' ? Partial<WebSocketApi['state']> : WebSocketApi[P];
};

const getApi = (
  defaultContext: PartialWebsocketApi,
  context: PartialWebsocketApi
): WebSocketApi => ({
  connected: false,
  login: doNothing,
  loginData: { user: '', session: '' },
  loggedIn: false,
  setVote: doNothing,
  setScale: doNothing,
  revealVotes: doNothing,
  resetVotes: doNothing,
  removeUsersNotVoted: doNothing,
  ...defaultContext,
  ...context,
  state: {
    resultsVisible: false,
    votes: {},
    scale: SCALES.COHEN_SCALE.values,
    ...defaultContext.state,
    ...context.state,
  },
});

export const getRenderWithWebSocket = (
  children: ComponentChildren,
  defaultApi: PartialWebsocketApi = {}
) => (api: PartialWebsocketApi = {}) => {
  const rendered = render(
    <WebSocketContext.Provider value={getApi(defaultApi, api)}>
      {children}
    </WebSocketContext.Provider>
  );
  return {
    ...rendered,
    rerender(apiUpdate: PartialWebsocketApi = {}) {
      rendered.rerender(
        <WebSocketContext.Provider value={getApi(defaultApi, apiUpdate)}>
          {children}
        </WebSocketContext.Provider>
      );
    },
  };
};
