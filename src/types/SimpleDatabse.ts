import { Identifier } from './Identifier';
import { Serializeable } from './Serializeable';

export type SimpleDatabase<T extends Serializeable> = {
  get: (id: Identifier) => Promise<T>;
  set: (id: Identifier, data: T) => Promise<void>;
  delete: (id: Identifier) => Promise<void>;
  has: (id: Identifier) => Promise<boolean>;
};
