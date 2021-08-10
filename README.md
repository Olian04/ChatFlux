# expert-waffle

An architecture for managing dynamic messages in discord, inspired by the flux architecture.

## Usage

```ts
type CountState = {
  count: number;
}
type CountAction = 'increment' | 'decrement';

const storage = new Map<Identifier, CountState>();
const db: SimpleDatabase<CountState> = {
  get: id => {
    const maybeData = storage.get(id);
    if (!maybeData) {
      throw new Error(`Unexpected ID: ${id}`);
    }
    return maybeData;
  },
  set: (id, newData) => {
    storage.set(id, newData);
  },
  has: id => storage.has(id),
  delete: id => storage.delete(id),
}

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

const Counter = factory<CountState, CountAction>({
  database: db,
  reduce: reducer,
  render: renderer,
});

app.on('message', message => {
  if (message.content !== '!count') return;
  const msg = message.channel.send('Loading...');
  const body = Counter.create(msg.id);
  msg.edit(body);

  setInterval(() => {
    const newBody = Counter.update(msg.id, 'increment');
    msg.edit(newBody);
  }, 3000 /* 3 seconds */);
});
```
