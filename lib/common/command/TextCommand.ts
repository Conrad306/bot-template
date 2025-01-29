import { Message } from 'discord.js';
import { TextCommandOptions } from '../../../types';
import { ExtendedClient } from '../ExtendedClient';

export default class TextCommand {
  name: string;
  description?: string;
  public readonly client: ExtendedClient;
  private readonly devOnly?: boolean;

  constructor(
    name: string,
    client: ExtendedClient,
    options: TextCommandOptions,
  ) {
    this.name = name;
    this.description = options.description;
    this.client = client;
    this.devOnly = options.devOnly || false;
  }

  public async validate(message: Message) {
    if (this.devOnly && !this.client.utils.isAdmin(message.author)) {
      return {
        embeds: this.client.utils.generateErrorMessage({
          title: 'Missing Permissions',
          description: 'Must be bot developer to use this command',
        }).embeds,
      };
    }
  }

  public async run(_message: Message, _args: string[]): Promise<void> {}
}
