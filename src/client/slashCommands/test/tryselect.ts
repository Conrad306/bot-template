import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  RoleSelectMenuBuilder,
} from 'discord.js';
import { ExtendedClient } from '../../../../lib/common/ExtendedClient';
import { SlashCommand } from '../../../../lib/common/command/SlashCommand';

export default class TryButtonCommand extends SlashCommand {
  constructor(client: ExtendedClient) {
    super('tryselect', client, {
      description: 'Test using select menus',
    });
  }

  public run(interaction: CommandInteraction) {
    let selectMenu = new RoleSelectMenuBuilder()
      .setCustomId('testselect')
      .setPlaceholder('Select a role.');
    const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
      selectMenu,
    );
    return interaction.reply(
      this.client.utils.generateSuccessMessage({ title: 'Success!' }, [row]),
    );
  }
}
