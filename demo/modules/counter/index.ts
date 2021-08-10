import { ChatFlux } from 'chatflux';

import { CountAction, CountState } from './types';
import { reducer } from './reducer';
import { renderer } from './renderer';
import { createDB } from '../../inMemoryDatabase';

export const Counter = new ChatFlux<CountState, CountAction>({
  database: createDB(),
  reduce: reducer,
  render: renderer,
});
