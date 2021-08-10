import { Identifier, SimpleDatabase } from '@olian/expert-waffle';
import { CountState } from './modules/counter/types';

export const createDB = (
  storage = new Map<Identifier, CountState>()
): SimpleDatabase<CountState> => ({
  get: (id) => {
    const maybeData = storage.get(id);
    if (!maybeData) {
      throw new Error(`Unexpected ID: ${id}`);
    }
    return maybeData;
  },
  set: (id, newData) => {
    storage.set(id, newData);
  },
  has: (id) => storage.has(id),
  delete: (id) => storage.delete(id),
});
