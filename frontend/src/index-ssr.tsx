import renderToString from 'preact-render-to-string';
import { App } from './Components/App/App';

export function render() {
  return renderToString(<App />);
}
