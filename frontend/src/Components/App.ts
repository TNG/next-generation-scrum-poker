import { html } from '../html.js';
import { WebSocketProvider } from './WebSocket.js';
import { PageSelector } from './PageSelector.js';
import { css } from '../css.js';

const styling = css`
  font: 14px sans-serif;
`;

export const App = () =>
  html`<div className=${styling}>
    <${WebSocketProvider}><${PageSelector} /><//>
  </div>`;
