import {React} from '../../node_modules/es-react/dev/index.js';
import {html} from '../html.js';

const WebSocketContext = React.createContext('defaultValue');

type CardValue = 'not-voted' | 'coffee' | '3';

interface WebSocketState {
    resultsVisible: boolean,
    votes: {
        [userId: string]: CardValue
    }
}

interface WebSocketApi {
    state: WebSocketState,

    setVote(vote: CardValue): void
    revealVotes(): void,
    resetVotes(): void
}

export const WebSocketProvider = ({children}) => {
    const value: WebSocketApi = {
        state: {
            resultsVisible: false,
            votes: {
                happyUser: "not-voted",
                otherUser: "3"
            }
        },
        setVote: (vote: CardValue): void => {},
        revealVotes: (): void => {},
        resetVotes: (): void => {}
    };
    return html`
      <${WebSocketContext.Provider} value=${value}>${children}<//>
    `;
};

export const WebSocketConsumer = WebSocketContext.Consumer;
