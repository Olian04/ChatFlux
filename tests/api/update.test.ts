import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

const id = 'blue';

describe('API - Update', () => {
  it(`Should dispatch if action was provided`, async () => {
    const Control = new ChatFlux<CountState, CountAction>({
      database: createDB(new Map()),
      reduce: reducer,
      render: renderer,
    });
    const Test = new ChatFlux<CountState, CountAction>({
      database: createDB(new Map()),
      reduce: reducer,
      render: renderer,
    });

    await Control.create(id);
    await Control.dispatch(id, 'increment');
    const controlBody = await Control.get(id);

    await Test.create(id);
    const testBody = await Test.update(id, 'increment');

    expect(testBody).to.equal(controlBody);
  });

  it(`Shouldn't dispatch if action wasn't provided`, async () => {
    const Control = new ChatFlux<CountState, CountAction>({
      database: createDB(new Map()),
      reduce: reducer,
      render: renderer,
    });
    const Test = new ChatFlux<CountState, CountAction>({
      database: createDB(new Map()),
      reduce: reducer,
      render: renderer,
    });

    const controlBody = await Control.create(id);

    await Test.create(id);
    const testBody = await Test.update(id);

    expect(testBody).to.equal(controlBody);
  });
});
