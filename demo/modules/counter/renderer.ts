import { Renderer } from '@olian/expert-waffle';
import { CountState } from './types';

export const renderer: Renderer<CountState> = (state) =>
  `Count: ${state.count}`;
