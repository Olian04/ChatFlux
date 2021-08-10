import { Identifier, SimpleDatabase } from '../../src/api';
import { CountState } from './countTypes';

export const createDB = (
  storage: Map<Identifier, CountState>,
): SimpleDatabase<CountState> => {
  return ({
    get: async (id) => {
      const maybeData = storage.get(id);
      if (!maybeData) {
        throw new Error(`Unexpected ID: ${id}`);
      }
      return maybeData;
    },
    set: async (id, newData) => {
      storage.set(id, newData);
    },
    has: async (id) => storage.has(id),
    delete: async (id) => {
      storage.delete(id);
    },
  })
};
