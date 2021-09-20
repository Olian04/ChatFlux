[![](https://img.shields.io/npm/v/chatflux/latest)](https://www.npmjs.com/package/chatflux)
[![](https://img.shields.io/npm/dt/chatflux)](https://www.npmjs.com/package/chatflux)
[![](https://img.shields.io/github/workflow/status/Olian04/ChatFlux/Node.js%20CI/main)](https://github.com/Olian04/ChatFlux/actions/workflows/nodejs.yml)

# ChatFlux

An extended flux implementation designed for usage with chat bots.

Install: [`npm i chatflux`](https://www.npmjs.com/package/chatflux)

```ts
import { ChatFlux, Reducer, Renderer } from 'ChatFlux';
import { db } from './db';

type CountState = {
  count: number;
}
type CountAction = 'increment' | 'decrement';

const reducer: Reducer<CountState, CountAction> = (state = { count: 0 }, action) => {
  switch (action) {
    case 'increment':
      return ({
        ...state,
        count: state.count + 1,
      });
    case 'decrement':
      return ({
        ...state,
        count: state.count - 1,
      });
    default:
      return state;
  }
};

const renderer: Renderer<CountState, string> = state => `Count: ${state.count}`;

const Counter = new ChatFlux<CountState, CountAction>({
  database: db,
  reduce: reducer,
  render: renderer,
});

app.on('message', async (message) => {
  if (message.content !== '!count') return;
  const msg = message.channel.send('Loading...');
  const body = await Counter.create(msg.id);
  msg.edit(body);

  setInterval(async () => {
    await Counter.dispatch(msg.id, 'increment');
    const newBody = await Counter.render(msg.id);
    msg.edit(newBody);
  }, 3000 /* 3 seconds */);
});
```
