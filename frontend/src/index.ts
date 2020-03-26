import { ReactDOM } from '../node_modules/es-react/dev/index.js';
import { html } from './html.js';
import { App } from './Components/App.js';

ReactDOM.render(html`<${App} />`, document.getElementById('root'));
