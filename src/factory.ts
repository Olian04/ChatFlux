import { Identifier } from './types/Identifier';
import { Reducer } from './types/Reducer';
import { Renderer } from './types/Renderer';
import { Serializeable } from './types/Serializeable';
import { SimpleDatabase } from './types/SimpleDatabse';
import { PseudoClass } from './util/PseudoClass';

export const factory = PseudoClass(function <
  State extends Serializeable,
  Action
>(context: {
  database: SimpleDatabase<State>;
  reduce: Reducer<State, Action>;
  render: Renderer<State>;
}) {
  const dispatch = async (id: Identifier, action: Action) => {
    if (!(await context.database.has(id))) {
      throw new Error(
        `Unknown ID: Cannot dispatch to an unknown ID. (ID: ${id})`
      );
    }
    const prevState = await context.database.get(id);
    const newState = context.reduce(prevState, action);
    await context.database.set(id, newState);
  };

  const get = async (id: Identifier) => {
    if (!(await context.database.has(id))) {
      throw new Error(`Unknown ID: Cannot get an unknown ID. (ID: ${id})`);
    }
    const state = await context.database.get(id);
    const newBody = context.render(state);
    return newBody;
  };

  const update = async (id: Identifier, action?: Action) => {
    if (!(await context.database.has(id))) {
      throw new Error(`Unknown ID: Cannot update an unknown ID. (ID: ${id})`);
    }
    if (action !== undefined) {
      await dispatch(id, action);
    }
    return get(id);
  };

  const create = async (id: Identifier) => {
    if (await context.database.has(id)) {
      throw new Error(
        `ID Already in use: Cannot create using the same ID twice. (ID: ${id})`
      );
    }
    const state = context.reduce();
    await context.database.set(id, state);
    const newBody = context.render(state);
    return newBody;
  };

  const getOrCreate = async (id: Identifier) => {
    if (await context.database.has(id)) {
      return get(id);
    }
    return create(id);
  };

  return {
    get,
    create,
    update,
    dispatch,
    getOrCreate,
    has: (id: Identifier) => context.database.has(id),
    delete: (id: Identifier) => context.database.delete(id),
  };
});
