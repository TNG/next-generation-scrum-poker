import {ReactDOM} from '../node_modules/es-react/dev/index.js';
import {html} from './html.js';

const App = () => html`<div>hi!</div>`;

ReactDOM.render(html`<${App}/>`, document.getElementById('root'));
