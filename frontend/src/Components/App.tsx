import css from '/web_modules/csz.js';
import * as React from '/web_modules/react.js';
import { PageSelector } from './PageSelector.js';
import { WebSocketProvider } from './WebSocket.js';

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
