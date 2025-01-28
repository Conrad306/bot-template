import { CommandInteraction, CacheType } from 'discord.js';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';
import { SlashCommand } from '../../../lib/common/command/SlashCommand';

/** This command will NOT be loaded by the interaction handler. */
export class ExampleCommand extends SlashCommand {
  constructor(client: ExtendedClient) {
    super('cmdname', client, {
      description: 'What your command does...',
      /** Only able to be ran by the bot developer */
      devOnly: false,
      /** Can only be ran in a guild */
      guildOnly: true,
      /** Can only be ran by the owner of the guild. */
      ownerOnly: false,
    });
  }

  public run(_interaction: CommandInteraction) {
    /**
     * Do whatever you want here!
     * this return statement just mutes the error caused by the return type
     * (which without it would be void) not matching the BaseInteraction.run return type.
     * Typically, you'd just return the interaction.reply()
     */
    return Promise.resolve();
  }
}
