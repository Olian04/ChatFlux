import { Renderer } from 'chatflux';
import { CountState } from './types';

export const renderer: Renderer<CountState> = (state) =>
  `Count: ${state.count}`;
