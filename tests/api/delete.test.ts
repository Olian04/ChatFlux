import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

const id = 'blue';

describe(`API - Delete`, () => {
  it(`Should delete without error`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    expect(storage.get(id)).to.equal(undefined);
    await Counter.create(id);
    expect(storage.get(id)).to.not.equal(undefined);
    await Counter.delete(id);
    expect(storage.get(id)).to.equal(undefined);
  });

  it(`Should error when deleting none existing ID`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    expect(storage.get(id)).to.equal(undefined);
    try {
      await Counter.delete(id);
      expect.fail(`Didn't fail as expected`);
    } catch {}
    expect(storage.get(id)).to.equal(undefined);
  });
});
