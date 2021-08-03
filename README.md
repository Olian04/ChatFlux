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
        count: state.count + 1,
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
  const channel = message.channel;
  const msg = channel.send('Loading...');
  const id = msg.id;
  Counter.create(id);
});

app.on('reaction', reaction => {
  const id = reaction.message.id;
  if (!Counter.has(id)) return;
  switch (reaction.emoji) {
    case '👍':
      Counter.update(id, 'increment');
      return;
    case '👎':
      Counter.update(id, 'decrement');
      return;
    default:
      return;
  }
});
```

## Internals

```ts
type Identifier = string | number;
type Serializeable = string | number | boolean | Serializeable[] | { [k in string | number]: Serializeable }
type Embed = 'stub_type'; // Will be brought in from discordjs
type Renderable = string | Embed;

type SimpleDatabase<T extends Serializeable> = {
  get: (id: Identifier) => T;
  set: (id: Identifier, data: T) => void;
  delete: (id: Identifier) => void;
  has: (id: Identifier) => boolean;
}

type Reducer<State, Action> = (state?: State, action?: Action) => State;
type Renderer<State> = (state: State) => Renderable;

type MessagingAPI = {
  editMessage: (id: Identifier, messageBody: Renderable) => void;
}

const DiscordProxy: MessagingAPI = {
  editMessage: (id, messageBody) => console.log(id, messageBody), // Mock
}

const factory = <State extends Serializeable, Action>(context: {
  database: SimpleDatabase<State>;
  reduce: Reducer<State, Action>;
  render: Renderer<State>;
}, api: MessagingAPI = DiscordProxy) => {
  const update = (id: Identifier, action: Action) => {
    const prevState = context.database.get(id);
    const newState = context.reduce(prevState, action);
    context.database.set(id, newState);
    const newBody = context.render(newState);
    api.editMessage(id, newBody);
  }

  const create = (id: Identifier) => {
    const state = context.reduce();
    context.database.set(id, state);
    const newBody = context.render(state);
    api.editMessage(id, newBody);
  }

  return {
    update,
    create,
    has: context.database.has.bind(context.database),
    delete: context.database.delete.bind(context.database),
  }
}
```

WIP: [typescript playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgJhAdsAlgMxRATlAvFAZ2CxUQHMoAfKRAVwFsAjbAbgChRIoBlbFAQwA2KAF4R+jQdHxES5KjQbMc1RgHs1U-ogW8SQ0eMkQA2gF0FAbygmA1lFKFipCtTpNsZgFw8+BsRJSUAC+HODQAKIecHhQAOREtIwA+pwQcSxQAPRZUADqKIKCUMwlWGq0ZAAWwA46aOX0UHAoBADGalhwAFYEYVwASkgIWIHSTnKuUFHMcOz90Nwo9GBSACL8wBL8BBAAPAAqUBAAHsDDBL76wgHGAHyxlmxQUGQQwD4AFChwPvBIqAw2AAlHgHgd2C9dh8oN9frAEMh0JgsAAaZqbfg+A6g3APABuah+kOaECk5y+Pz+iMBKNxBKJc2eUCqO0p8P+SKBWHpJQ0WkQ7FCCygQzgtDa2D23C253RAEE2qg1IgHvhPkRNhAAPw+GVa9H8JUoFW6qCK5WIXn687sNKi4bYKU2iBq2Gaik8WUQXlDRAjMbze0AWQgBAI-DILnlAAUYI9mRAWsBQ+HIxB2dSAcjsOj6GGI28AEJqOAgHx+gPGXmE4lsYUdRBEKBrVodLox8onctQVOF6NxhMvJMoFMF9PsvPj4ulkC8xsETQQAB0gjUZDhU7TM7LwPROV7ajatnrbDYC9qaCNwE6IFi0u9xzOFyuAhuRikCuNKrun0b5zOHwnheOBMUYHYMx4ZZVggDYtnA3YHy1O4SSwJMJUgsUMKwJC5XNb9VVQx0sArYjnW9FD60NMAUB8PtIwHeN8FbdpOjgTs1G7XlgKgC8oFoMBQPOWI4SzLkUUNAifAtE0rTBKAeJePiwDQ-EXVif9TmAZchO2XZlzeYA4WBEklJVZtEAgAB3dT8E0s5lzQ8VJU+FSIDU71JMtEzmTM5AtJ0sCIOXaFNxoayXR8l4-Is6ySzLDSVQA7S0P9bBPksmzvSi6L+Bo5cRzHbcIDCzL4rnElhRi2o2jQrURKpBFs25bjfN48zag9cZ7JS9CXJyvzksC+DgtCn50S6gb2qbWoytnRL-Ic1KRg1bLTKgPKUAK5N6LeUq4tnHKqqgNDgFoLAdEU-jBINNravEOU2tZAgfB64a9JXZ7l0YUg4D-JKAt0hCfVRNqEHJSC3qB4LwfeFcfv9f7Fu06Hdj3ZlQmFe0AGEKmQWyFOZDpaGQHx3GUIURVxkngBklVYjiUh7vzZA4gUOIEGZgEMjPPiiE6dNYky3s8r2TlaVzKBqfxijPh8vi4EYPVoPWILEOl4AXTdHjDJ8H55Kuvj6H4EBmDg-hYn50Y3gM95jPW9BYQAQmN03YMxUErpeYAqnKKzwv9iIsHKLBPgAAwAVUsk5ICVJNYDWHwABJLB+YIw6m0JopO95zp0V2zcxSrQahd5JwD83Wuzq30xCu3xorj3i+ZZ69ZiPEnAFm3nuMkvSQhtv5Jrm3YfOXvT3PDqc+c7BSJnnCNZddENbp1URK6x52ppnwAAYQi82Sq8IKzRzaKpYWvQ-CeztoIPiJm0JZ4A4i8NqXlOvPYS96Ll1-rq++zmZbeTgtTLmJsgKAABqKAABGAB0VghTVvrseInNH7c1foAnOZ0Lpfzfj-P+nl8FANJiA84YC8a1GgXA-BiD1oICvLQQQHx8Ef1wV1Sq9Z5h8WWk6EiDo0poQXpQrWltHwdzDhrZOlguoUJpunbhU8Ij4gBJcfAV4lS3j2IvTyUtKGr1-DxVGkFFZ9ychhHw5jJRomZLw-hdjcz1h8meZRqiwF1THnESQtB0g+VccgAgy4BJCRKl4wQPi4jokZogLmrNnFsCAA)
