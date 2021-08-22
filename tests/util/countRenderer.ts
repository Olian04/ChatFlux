import { Renderer } from '../../src/api';
import { CountState } from './countTypes';

export const renderer: Renderer<CountState, string> = (state) =>
  `Count: ${state.count}`;
