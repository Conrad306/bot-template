import { Message } from 'discord.js';
import { EventLoader } from '../../../lib/common/loader';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';

export default class MessageCreate extends EventLoader {
  constructor(client: ExtendedClient) {
    super(client, 'messageCreate');
  }

  override async run(message: Message) {
    this.client.textCommandLoader.handle(message);
  }
}
