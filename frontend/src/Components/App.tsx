import { css } from '../css.js';
import React from '../react.js';
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
