import { Identifier } from './Identifier';
import { Renderable } from './Renderable';

export type MessagingAPI = {
  editMessage: (id: Identifier, messageBody: Renderable) => void;
};
