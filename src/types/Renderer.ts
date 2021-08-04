import { Renderable } from './Renderable';

export type Renderer<State> = (state: State) => Renderable;
