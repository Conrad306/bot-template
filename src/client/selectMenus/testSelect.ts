import {
  AnySelectMenuInteraction,
  RoleSelectMenuInteraction,
} from 'discord.js';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';
import { SelectMenu } from '../../../lib/common/command/SelectMenu';
import { InteractionGroups } from '../../../types';

export default class TestSelectMenu extends SelectMenu {
  constructor(client: ExtendedClient) {
    super('testselect', client, {});
  }

  public run(interaction: RoleSelectMenuInteraction) {
    return interaction.reply(
      `You chose ${interaction.roles.map((role) => role.name)}`,
    );
  }
}
