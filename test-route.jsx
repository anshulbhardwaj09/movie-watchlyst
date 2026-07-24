import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App';

const html = renderToString(
  <StaticRouter location="/browse">
    <App />
  </StaticRouter>
);

console.log("RENDERED HTML CONTAINS HERO?", html.includes('Your next obsession is waiting'));
console.log("RENDERED HTML CONTAINS BROWSE?", html.includes('Trending'));
