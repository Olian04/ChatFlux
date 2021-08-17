import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

const id = 'blue';

describe(`API - Dispatch`, () => {
  it(`Should update state`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    await Counter.create(id);
    expect(storage.get(id)).to.deep.equal({ count: 0 });
    expect(await Counter.get(id)).to.equal('Count: 0');

    for (let i = 1; i <= 10; i++) {
      expect(await Counter.dispatch(id, 'increment')).to.be.undefined;
      expect(storage.get(id)).to.deep.equal({ count: i });
      expect(await Counter.get(id)).to.equal(`Count: ${i}`);
    }

    expect(storage.get(id)).to.deep.equal({ count: 10 });
    expect(await Counter.get(id)).to.equal(`Count: ${10}`);

    for (let i = 10; i > 0; i--) {
      expect(await Counter.dispatch(id, 'decrement')).to.be.undefined;
      expect(storage.get(id)).to.deep.equal({ count: i - 1 });
      expect(await Counter.get(id)).to.equal(`Count: ${i - 1}`);
    }
  });
});
