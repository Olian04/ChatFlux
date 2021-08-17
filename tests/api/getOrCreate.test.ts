import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

const id = 'blue';

describe('API - GetOrCreate', () => {
  it(`Should create for unknown IDs`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    expect(storage.has(id)).to.be.false;
    await Counter.getOrCreate(id);
    expect(storage.has(id)).to.be.true;
  });

  it(`Should get for known IDs`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    storage.set(id, { count: 42 });
    const body = await Counter.getOrCreate(id);
    expect(body).to.equal('Count: 42');
  });

  it(`Shouldn't error when called multiple times in a row`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    try {
      await Counter.getOrCreate(id);
      await Counter.getOrCreate(id);
    } catch {
      expect.fail(`Failed when called twice in a row`);
    }
  });
});
