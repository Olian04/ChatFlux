import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

const id = 'blue';

describe(`API - Exists`, () => {
  it(`Should return false when ID is not in database`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    expect(await Counter.exists(id)).to.be.false;

    // Idempotent
    expect(await Counter.exists(id)).to.be.false;
  });

  it(`Should return true when ID is in database`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    await Counter.create(id);
    expect(await Counter.exists(id)).to.be.true;

    // Idempotent
    expect(await Counter.exists(id)).to.be.true;
  });
});
