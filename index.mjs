import { rest } from 'msw';
import { setupServer } from 'msw/node';
import fetch from 'node-fetch';

const server = setupServer(
  rest.all('http://localhost/post', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ foo: 'bar' }));
  })
);

server.listen({ onUnhandledRequest: 'error' });

await Promise.race([
  fetch('http://localhost/post', {
    method: 'post',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ the: 'thing' }),
  })
    .then((r) => r.json())
    .then(console.log),
  new Promise((reject) => {
    setTimeout(() => {
      console.error('POST timed out!');
      process.exit(1);
    }, 5000);
  }),
]);
