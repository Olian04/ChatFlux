import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

const id = 'blue';

describe(`API - Render`, () => {
  it(`Should render without error`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    await Counter.create(id);
    expect(await Counter.render(id)).to.equal(`Count: 0`);

    // Idempotent
    expect(await Counter.render(id)).to.equal(`Count: 0`);
  });

  it(`Should error when rendering none existing ID`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });

    expect(storage.get(id)).to.equal(undefined);
    try {
      await Counter.render(id);
      expect.fail(`Didn't fail as expected`);
    } catch {}
    expect(storage.get(id)).to.equal(undefined);
  });
});
