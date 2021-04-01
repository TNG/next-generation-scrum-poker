import css from 'csz';
import { PageSelector } from './PageSelector';
import { WebSocketProvider } from './WebSocket';

const styling = css`
  font: 14px sans-serif;
`;

export const App = () => (
  <div className={styling}>
    <WebSocketProvider>
      <PageSelector />
    </WebSocketProvider>
  </div>
);
