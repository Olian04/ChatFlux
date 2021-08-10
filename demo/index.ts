import { Client, Intents } from 'discord.js';
import { betterLogging } from 'better-logging';
betterLogging(console);
console.logLevel = 4;
import { Counter } from './modules/counter';

export const app = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const emoji = {
  thumbsUp: '👍',
  thumbsDown: '👎',
}

app.on('messageCreate', async (message) => {
  if (message.content !== '!count') return;
  console.debug(`Received command (Content: ${message.content}) (ID: ${message.id})`);
  try {
    message.delete();
  } catch {};
  const response = await message.channel.send('Loading...');
  console.debug(`Sent response (ID: ${response.id})`);

  const id = response.id;
  const body = Counter.create(id);
  response.edit(body);
  console.debug(`Updated body (Content: ${body}) (ID: ${response.id})`);

  await response.react(emoji.thumbsUp);
  response.react(emoji.thumbsDown);
});

app.on('messageReactionAdd', (reaction) => {
  console.debug(`Reaction (Emoji: ${reaction.emoji.name}) added to message (ID: ${reaction.message.id})`);
  const message = reaction.message;
  const id = message.id;
  if (!Counter.has(id)) return;

  const emojiName = reaction.emoji.name;

  const action =
    emojiName === emoji.thumbsUp ? 'increment' :
    emojiName === emoji.thumbsDown ? 'decrement':
    'N/A';

  if (action === 'N/A') return;

  console.debug(`Updating counter (Action: ${action}) (ID: ${message.id})`);
  const users = [...reaction.users.cache.filter(user => !user.bot)].map(([_, user]) => user);
  const newBody = users.reduce(() => Counter.update(id, action), null);
  if (newBody === null) {
    // Only bot reactions
    return;
  }
  message.edit(newBody || 'Internal Error');
  console.debug(`Updated body (Content: ${newBody}) (ID: ${message.id})`);

  users.forEach((user) => {
    reaction.users.remove(user);
    console.debug(`Removed reaction (User ID: ${user.id}) (Message ID: ${message.id})`);
  });
});

(async () => {
  const { discord_secret } = await import('./secrets.json');
  app.login(discord_secret)
    .then(() => console.info('Successfully logged in'))
    .catch((e) => console.error('Failed to log in:', e));
})();
