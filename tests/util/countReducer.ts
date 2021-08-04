import { Reducer } from '../../src/api';
import { CountAction, CountState } from './countTypes';

export const reducer: Reducer<CountState, CountAction> = (
  state = { count: 0 },
  action
) => {
  switch (action) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'decrement':
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
};
