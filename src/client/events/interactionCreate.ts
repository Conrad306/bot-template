import { Interaction, InteractionType } from 'discord.js';
import { EventLoader } from '../../../lib/common/loader';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';

export default class InteractionCreate extends EventLoader {
  constructor(client: ExtendedClient) {
    super(client, 'interactionCreate');
  }

  override async run(interaction: Interaction) {
    this.client.logger.info(
      `${interaction.type} interaction created by ${interaction.user.id}${
        interaction.type === InteractionType.ApplicationCommand
          ? `: ${interaction.toString()}`
          : ''
      }`,
    );
    if (interaction.isCommand()) {
      this.client.slashCommandLoader.handle(interaction);
    } else if (interaction.isButton()) {
      this.client.buttonLoader.handle(interaction);
    } else if (interaction.isAnySelectMenu()) {
      this.client.selectMenuLoader.handle(interaction);
    }
  }
}
