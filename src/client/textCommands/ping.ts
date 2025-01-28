import { Message } from 'discord.js';
import TextCommand from '../../../lib/common/command/TextCommand';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';

export default class PingTextCommand extends TextCommand {
  constructor(client: ExtendedClient) {
    super('ping', client, {});
  }

  public async run(message: Message, args: string[]) {
    message.reply('Pong');
  }
}
