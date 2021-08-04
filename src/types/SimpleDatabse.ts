import { Identifier } from './Identifier';
import { Serializeable } from './Serializeable';

export type SimpleDatabase<T extends Serializeable> = {
  get: (id: Identifier) => T;
  set: (id: Identifier, data: T) => void;
  delete: (id: Identifier) => void;
  has: (id: Identifier) => boolean;
};
