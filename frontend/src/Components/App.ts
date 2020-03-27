import { html } from '../html.js';
import { WebSocketProvider } from './WebSocket.js';
import { PageSelector } from './PageSelector.js';
import { css } from '../css.js';
import React from '../../node_modules/es-react/dev/react.js';

// This ensures our Babel transform for htm works;
// Alternatively, importing React in all files which use the "html"
// function would work as well
(window as any).React = React;

const styling = css`
  font: 14px sans-serif;
`;

export const App = () =>
  html`<div className=${styling}>
    <${WebSocketProvider}><${PageSelector} /><//>
  </div>`;
