import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
} from 'discord.js';
import { ExtendedClient } from '../../../../lib/common/ExtendedClient';
import { SlashCommand } from '../../../../lib/common/command/SlashCommand';

export default class TryButtonCommand extends SlashCommand {
  constructor(client: ExtendedClient) {
    super('trybutton', client, {
      description: 'Test clicking buttons',
    });
  }

  public run(interaction: CommandInteraction) {
    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('testbutton')
        .setLabel('Click Me')
        .setStyle(ButtonStyle.Primary),
    );
    return interaction.reply(
      this.client.utils.generateSuccessInteraction({ title: 'Success!' }, [
        row,
      ]),
    );
  }
}
