import { ComponentChildren, ComponentType, createContext } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { WEBSOCKET_URL } from '../../config';
import { SCALES } from '../../constants';
import {
  getLoginRequest,
  getRemoveUsersNotVotedRequest,
  getResetVotesRequest,
  getRevealVotesRequest,
  getSetScaleRequest,
  getSetVoteRequest,
} from '../../requests/websocket-requests';
import { WebSocketApi, WebSocketLoginData } from '../../types/WebSocket';
import { doNothing } from '../../helpers/helpers';
import {
  CardValue,
  ServerMessage,
  VOTE_NOTE_VOTED,
  VOTE_OBSERVER,
  Votes,
  WebSocketState,
} from '../../shared/WebSocketMessages';

const initialWebSocketState: WebSocketState = {
  resultsVisible: false,
  votes: {},
  scale: SCALES.COHEN_SCALE.values,
};

const initialLoginData: WebSocketLoginData = { user: '', session: '' };

export const WebSocketContext = createContext<WebSocketApi>({
  connected: false,
  login: doNothing,
  loginData: initialLoginData,
  loggedIn: false,
  state: initialWebSocketState,
  setVote: doNothing,
  setScale: doNothing,
  revealVotes: doNothing,
  resetVotes: doNothing,
  removeUsersNotVoted: doNothing,
});

function getInitialVotes(votes: Votes): Votes {
  return Object.fromEntries(
    Object.keys(votes).map((user) => [
      user,
      votes[user] === VOTE_OBSERVER ? VOTE_OBSERVER : VOTE_NOTE_VOTED,
    ])
  );
}

export const WebSocketProvider = ({ children }: { children: ComponentChildren }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, setState] = useState(initialWebSocketState);
  const [loginData, setLoginData] = useState(initialLoginData);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!socket) {
      const webSocket = new WebSocket(WEBSOCKET_URL);
      webSocket.onopen = () => {
        if (loginData.user && loginData.session) {
          webSocket.send(getLoginRequest(loginData.user, loginData.session));
        }
        setSocket(webSocket);
      };
      webSocket.onmessage = (event: MessageEvent) => {
        const message: ServerMessage = JSON.parse(event.data);
        switch (message.type) {
          case 'state':
            return setState(message.payload);
          case 'not-logged-in':
            return setLoggedIn(false);
          default:
            console.error(`Unexpected Websocket message ${event.data}`);
        }
      };
      webSocket.onclose = () => {
        setSocket(null);
      };
    }
  }, [socket]);

  const login = (user: string, session: string) => {
    socket?.send(getLoginRequest(user, session));
    setLoginData({ user, session });
    setLoggedIn(true);
    // Optimistically show the non-voted state of the current user
    setState({
      ...initialWebSocketState,
      votes: {
        [user]: VOTE_NOTE_VOTED,
      },
    });
  };

  const setVote = (vote: CardValue) => {
    socket?.send(getSetVoteRequest(vote));
    setState({ ...state, votes: { ...state.votes, [loginData.user]: vote } });
  };

  const setScale = (scale: Array<CardValue>) => {
    socket?.send(getSetScaleRequest(scale));
    setState({ ...state, votes: getInitialVotes(state.votes), scale });
  };

  const revealVotes = () => {
    socket?.send(getRevealVotesRequest());
    setState({
      ...state,
      resultsVisible: true,
    });
  };

  const removeUsersNotVoted = () => {
    socket?.send(getRemoveUsersNotVotedRequest());
    setState({
      ...state,
      votes: Object.fromEntries(
        Object.entries(state.votes).filter(([, voted]) => voted !== VOTE_NOTE_VOTED)
      ),
    });
  };

  const resetVotes = () => {
    socket?.send(getResetVotesRequest());
    setState({
      votes: getInitialVotes(state.votes),
      resultsVisible: false,
      scale: state.scale,
    });
  };

  const value: WebSocketApi = {
    connected: Boolean(socket),
    login,
    loginData,
    loggedIn,
    state,
    setVote,
    setScale,
    revealVotes,
    resetVotes,
    removeUsersNotVoted,
  };
  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const WebSocketConsumer = WebSocketContext.Consumer;

type ConnectToWebSocket = (
  Component: ComponentType<{ socket: WebSocketApi }>
) => ComponentType<Record<string, never>>;

export const connectToWebSocket: ConnectToWebSocket =
  (Component) =>
  (...props) =>
    (
      <WebSocketConsumer>
        {(socket: WebSocketApi) => <Component socket={socket} {...props} />}
      </WebSocketConsumer>
    );
