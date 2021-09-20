import { Identifier } from './types/Identifier';
import { Reducer } from './types/Reducer';
import { Renderer } from './types/Renderer';
import { Serializeable } from './types/Serializeable';
import { SimpleDatabase } from './types/SimpleDatabse';
import { PseudoClass } from './util/PseudoClass';

export const factory = PseudoClass(function <
  State extends Serializeable,
  Action,
  RenderTarget = string
>(context: {
  database: SimpleDatabase<State>;
  reduce: Reducer<State, Action>;
  render: Renderer<State, RenderTarget>;
}) {
  const _exists = async (id: Identifier) => context.database.has(id);
  const _delete = async (id: Identifier) => {
    context.database.delete(id);
  };

  const _dispatch = async (id: Identifier, action: Action) => {
    if (!(await _exists(id))) {
      throw new Error(
        `Unknown ID: Cannot dispatch to an unknown ID. (ID: ${id})`
      );
    }
    const prevState = await context.database.get(id);
    const newState = context.reduce(prevState, action);
    await context.database.set(id, newState);
  };

  const _render = async (id: Identifier) => {
    if (!(await _exists(id))) {
      throw new Error(`Unknown ID: Cannot get an unknown ID. (ID: ${id})`);
    }
    const state = await context.database.get(id);
    const newBody = context.render(state);
    return newBody;
  };

  const _create = async (id: Identifier) => {
    if (await _exists(id)) {
      throw new Error(
        `ID Already in use: Cannot create using the same ID twice. (ID: ${id})`
      );
    }
    const state = context.reduce(undefined, undefined);
    await context.database.set(id, state);
    const newBody = context.render(state);
    return newBody;
  };

  return {
    render: _render,
    create: _create,
    dispatch: _dispatch,
    exists: _exists,
    delete: _delete,
  };
});
