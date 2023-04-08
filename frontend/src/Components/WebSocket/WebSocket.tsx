import { ComponentChildren, ComponentType, createContext } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { CardValue, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { SCALES } from '../../../../shared/scales';
import { ServerMessage, Votes, WebSocketState } from '../../../../shared/serverMessages';
import { WEBSOCKET_URL } from '../../config';
import { doNothing } from '../../helpers/helpers';
import {
  getLoginRequest,
  getRemoveUserRequest,
  getResetVotesRequest,
  getRevealVotesRequest,
  getSetScaleRequest,
  getSetVoteRequest,
} from '../../requests/websocket-requests';
import { WebSocketApi, WebSocketLoginData } from '../../types/WebSocket';

const initialWebSocketState: WebSocketState = {
  resultsVisible: false,
  votes: {},
  scale: SCALES.COHEN_SCALE.values,
};

const initialLoginData: WebSocketLoginData = { user: '', session: '' };
const BASE_RETRY_WAIT = 200;
const MAX_RETRY_WAIT = 4000;

export const WebSocketContext = createContext<WebSocketApi>({
  connected: false,
  loggedIn: false,
  login: doNothing,
  loginData: initialLoginData,
  logoutReason: undefined,
  removeUser: doNothing,
  resetVotes: doNothing,
  revealVotes: doNothing,
  setScale: doNothing,
  setVote: doNothing,
  state: initialWebSocketState,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [logoutReason, setLogoutReason] = useState<string>();
  const loginDataRef = useRef(loginData);
  const clearReconnectTimeout = useRef<() => void>(doNothing);
  const reconnectRetries = useRef(0);
  loginDataRef.current = loginData;

  const connect = useCallback(() => {
    const webSocket = new WebSocket(WEBSOCKET_URL);
    webSocket.onopen = () => {
      // After a successful connection, we reset the exponential backoff wait
      reconnectRetries.current = 0;
      if (loginDataRef.current.user && loginDataRef.current.session) {
        // The login is considered to be "processing" until the server sends a state
        // message. During that time, the user should not be able to trigger backend
        // updates as otherwise votes might not be registered.
        setIsProcessing(true);
        webSocket.send(getLoginRequest(loginDataRef.current.user, loginDataRef.current.session));
      }
      setSocket(webSocket);
    };

    webSocket.onmessage = (event: MessageEvent) => {
      const message: ServerMessage = JSON.parse(event.data);
      switch (message.type) {
        case 'state':
          setIsProcessing(false);
          return setState(message.payload);
        case 'not-logged-in':
          setLogoutReason(message.payload.reason);
          return setLoggedIn(false);
        default:
          console.error(`Unexpected Websocket message ${event.data}`);
      }
    };

    webSocket.onclose = () => {
      setSocket(null);
      const timeout = setTimeout(
        () => connect(),
        Math.min(BASE_RETRY_WAIT * 2 ** (reconnectRetries.current++ / 2), MAX_RETRY_WAIT)
      );
      clearReconnectTimeout.current = () => clearTimeout(timeout);
    };

    webSocket.onerror = (error) => {
      console.error('Unexpected Websocket error', error);
      webSocket.close();
    };

    return webSocket;
  }, []);

  useEffect(() => {
    const webSocket = connect();
    return () => {
      clearReconnectTimeout.current();
      // As cleanup, we close the previous socket while ignoring any logic triggered
      // on close
      webSocket.onclose = doNothing;
      webSocket.close();
    };
  }, [connect]);

  const login = (user: string, session: string) => {
    // The login is considered to be "processing" until the server sends a state
    // message. During that time, the user should not be able to trigger backend
    // updates as otherwise votes might not be registered.
    setIsProcessing(true);
    socket?.send(getLoginRequest(user, session));
    setLoginData({ user, session });
    setLoggedIn(true);
    setLogoutReason(undefined);
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

  const removeUser = (user: string) => {
    socket?.send(getRemoveUserRequest(user));
    setState({
      ...state,
      votes: Object.fromEntries(Object.entries(state.votes).filter(([userId]) => userId !== user)),
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
    connected: Boolean(socket && !isProcessing),
    loggedIn,
    login,
    loginData,
    logoutReason,
    removeUser,
    resetVotes,
    revealVotes,
    setScale,
    setVote,
    state,
  };
  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const WebSocketConsumer = WebSocketContext.Consumer;

export const connectToWebSocket =
  <Props extends object>(Component: ComponentType<{ socket: WebSocketApi } & Props>) =>
  (props: Props) =>
    (
      <WebSocketConsumer>
        {(socket: WebSocketApi) => <Component {...props} socket={socket} />}
      </WebSocketConsumer>
    );
