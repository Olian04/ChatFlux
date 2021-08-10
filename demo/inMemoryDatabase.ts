import { Identifier, SimpleDatabase } from 'chatflux';
import { CountState } from './modules/counter/types';

export const createDB = (
  storage = new Map<Identifier, CountState>()
): SimpleDatabase<CountState> => ({
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
});
