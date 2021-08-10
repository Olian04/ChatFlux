import { Identifier } from './types/Identifier';
import { Reducer } from './types/Reducer';
import { Renderer } from './types/Renderer';
import { Serializeable } from './types/Serializeable';
import { SimpleDatabase } from './types/SimpleDatabse';
import { PseudoClass } from './util/PseudoClass';

export const factory = PseudoClass(function<State extends Serializeable, Action>(
  context: {
    database: SimpleDatabase<State>;
    reduce: Reducer<State, Action>;
    render: Renderer<State>;
  }
) {
  const update = async (id: Identifier, action: Action) => {
    if (! (await context.database.has(id))) {
      throw new Error(`Unknown ID: Cannot update an unknown ID. (ID: ${id})`);
    }
    const prevState = await context.database.get(id);
    const newState = context.reduce(prevState, action);
    context.database.set(id, newState);
    const newBody = context.render(newState);
    return newBody;
  };

  const create = async (id: Identifier, onSaved?: () => void) => {
    if (await context.database.has(id)) {
      throw new Error(
        `ID Already in use: Cannot create using the same ID twice. (ID: ${id})`
      );
    }
    const state = context.reduce();
    context.database.set(id, state)
      .then(() => onSaved?.());
    const newBody = context.render(state);
    return newBody;
  };

  return {
    update,
    create,
    has: (id: Identifier) => context.database.has(id),
    delete: (id: Identifier) => context.database.delete(id),
  };
});
