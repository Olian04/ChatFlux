import { Identifier, SimpleDatabase } from '../../src/api';
import { CountState } from './countTypes';

//  Simulate async operations
const sleep = () =>
  new Promise((resolve) => setTimeout(resolve, 5 + 5 * Math.random()));

export const createDB = (
  storage: Map<Identifier, CountState>
): SimpleDatabase<CountState> => {
  return {
    get: async (id) => {
      const maybeData = storage.get(id);
      if (!maybeData) {
        throw new Error(`Unknown ID: ${id}`);
      }
      await sleep();
      return maybeData;
    },
    set: async (id, newData) => {
      await sleep();
      storage.set(id, newData);
    },
    has: async (id) => {
      await sleep();
      return storage.has(id);
    },
    delete: async (id) => {
      await sleep();
      storage.delete(id);
    },
  };
};
