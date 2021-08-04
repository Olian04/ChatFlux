import { Renderer } from '../../src/api';
import { CountState } from './countTypes';

export const renderer: Renderer<CountState> = (state) =>
  `Count: ${state.count}`;
