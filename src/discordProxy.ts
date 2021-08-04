import { MessagingAPI } from './types/MessagingAPI';

export const DiscordProxy: MessagingAPI = {
  editMessage: (id, messageBody) => console.log(id, messageBody), // Mock
};
