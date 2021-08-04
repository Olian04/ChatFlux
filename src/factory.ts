import { DiscordProxy } from './discordProxy';
import { Identifier } from './types/Identifier';
import { MessagingAPI } from './types/MessagingAPI';
import { Reducer } from './types/Reducer';
import { Renderer } from './types/Renderer';
import { Serializeable } from './types/Serializeable';
import { SimpleDatabase } from './types/SimpleDatabse';

export const factory = <State extends Serializeable, Action>(
  context: {
    database: SimpleDatabase<State>;
    reduce: Reducer<State, Action>;
    render: Renderer<State>;
  },
  api: MessagingAPI = DiscordProxy
) => {
  const update = (id: Identifier, action: Action) => {
    if (!context.database.has(id)) {
      throw new Error(`Unknown ID: Cannot update an unknown ID. (ID: ${id})`);
    }
    const prevState = context.database.get(id);
    const newState = context.reduce(prevState, action);
    context.database.set(id, newState);
    const newBody = context.render(newState);
    api.editMessage(id, newBody);
  };

  const create = (id: Identifier) => {
    if (context.database.has(id)) {
      throw new Error(
        `ID Already in use: Cannot create using the same ID twice. (ID: ${id})`
      );
    }
    const state = context.reduce();
    context.database.set(id, state);
    const newBody = context.render(state);
    api.editMessage(id, newBody);
  };

  return {
    update,
    create,
    has: context.database.has.bind(context.database),
    delete: context.database.delete.bind(context.database),
  };
};
