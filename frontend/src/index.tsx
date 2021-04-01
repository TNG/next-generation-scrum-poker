import { hydrate } from 'preact';
import { App } from './Components/App';

// Hydrate instead of "render" is necessary to reuse pre-rendered content
hydrate(<App />, document.body);
