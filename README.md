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

const renderer: Renderer<CountState> = state => `Count: ${state.count}`;

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
    const newBody = await Counter.update(msg.id, 'increment');
    msg.edit(newBody);
  }, 3000 /* 3 seconds */);
});
```
