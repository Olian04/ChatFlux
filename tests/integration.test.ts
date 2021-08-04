import { describe, it } from 'mocha';
import { expect } from 'chai';
import { factory } from '../src/api';
import { CountAction, CountState } from './util/countTypes';
import { createDB } from './util/inMemoryDatabase';
import { renderer } from './util/countRenderer';
import { reducer } from './util/countReducer';

// START OF TEST

describe(`Database updates when action is dispatched`, () => {
  it(`Shouldn't modify database if no creation nor updated has been issued.`, () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = factory<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    expect(storage.size).to.equal(sizeBefore);
  });

  it(`Should add one entry to database on create.`, () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = factory<CountState, CountAction>({
      database: createDB(storage),
      reduce: reducer,
      render: renderer,
    });
    Counter.create('blue');
    expect(storage.size).to.equal(sizeBefore + 1);
  });

  it(`Should remove one entry from database on delete.`, () => {
    const storage = new Map();
    const sizeBefore = storage.size;
    const Counter = factory<CountState, CountAction>({
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
