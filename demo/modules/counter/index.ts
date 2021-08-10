import { factory } from '@olian/expert-waffle';

import { CountAction, CountState } from './types';
import { reducer } from './reducer';
import { renderer } from './renderer';
import { createDB } from '../../inMemoryDatabase';

export const Counter = factory<CountState, CountAction>({
  database: createDB(),
  reduce: reducer,
  render: renderer,
});
