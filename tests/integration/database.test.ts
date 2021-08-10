import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ChatFlux } from '../../src/api';
import { CountAction, CountState } from '../util/countTypes';
import { createDB } from '../util/inMemoryDatabase';
import { renderer } from '../util/countRenderer';
import { reducer } from '../util/countReducer';

describe(`Database`, () => {
  it(`Shouldn't modify database if no creation nor updated has been issued.`, () => {
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
    const db = createDB(storage);
    const sizeBefore = storage.size;
    const Counter = new ChatFlux<CountState, CountAction>({
      database: db,
      reduce: reducer,
      render: renderer,
    });
    Counter.create('blue');
    expect(storage.size).to.equal(sizeBefore + 1);
  });

  it(`Should remove one entry from database on delete.`, () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    Counter.create('blue');
    expect(storage.size).to.equal(sizeBefore + 1);
    Counter.delete('blue');
    expect(storage.size).to.equal(sizeBefore);
  });

  it(`Should update data in database when action is dispatched.`, () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = new ChatFlux<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    Counter.create('blue');
    expect(storage.size).to.equal(sizeBefore + 1);
    Counter.delete('blue');
    expect(storage.size).to.equal(sizeBefore);
  });
});
