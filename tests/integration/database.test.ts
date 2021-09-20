import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

describe(`Integration - Database`, () => {
  it(`Shouldn't modify database if no creation nor action has been dispatched.`, () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    expect(storage.size).to.equal(sizeBefore);
  });

  it(`Should add one entry to database on create.`, async () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    await Counter.create('blue');
    expect(storage.size).to.equal(sizeBefore + 1);
  });

  it(`Should remove one entry from database on delete.`, async () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    await Counter.create('blue');
    expect(storage.size).to.equal(sizeBefore + 1);
    await Counter.delete('blue');
    expect(storage.size).to.equal(sizeBefore);
  });

  it(`Should update data when action is dispatched.`, async () => {
    const storage = new Map();
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    await Counter.create('blue');
    expect(storage.get('blue')).to.deep.equal({ count: 0 });
    await Counter.dispatch('blue', 'increment');
    expect(storage.get('blue')).to.deep.equal({ count: 1 });
  });
});
