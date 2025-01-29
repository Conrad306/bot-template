import { AnySelectMenuInteraction } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';
import { BaseInteractionLoader } from './BaseInteractionLoader';
import { SelectMenu } from '../command/SelectMenu';
import { InteractionType } from '../../../types';

export class SelectMenuLoader extends BaseInteractionLoader {
  constructor(client: ExtendedClient) {
    super(client);
  }

  public override load() {
    return super.load('selectMenus');
  }
  private fetchMenu(customId: string) {
    return this.client.selectMenus.find((menu) =>
      customId.startsWith(menu.name),
    );
  }

  public handle(interaction: AnySelectMenuInteraction) {
    const menu = this.fetchMenu(interaction.customId);

    if (!menu) {
      return this.client.logger.error(
        `${interaction.user.tag} [${interaction.user.id}] invoked select menu ${interaction.customId} even though it doesn't exist.`,
      );
    }

    const missingPermissions = menu.validate(
      interaction,
      InteractionType.SelectMenu,
    );

    if (missingPermissions) {
      return interaction.reply(
        this.client.utils.generateErrorInteraction(missingPermissions),
      );
    }

    this.run(menu, interaction);
  }

  async run(menu: SelectMenu, interaction: AnySelectMenuInteraction) {
    await menu.run(interaction).catch((error) => {
      this.client.logger.error(error);

      const message = this.client.utils.generateErrorInteraction(
        {
          title: 'An error has occured!',
          description: 'An unexpected error has occured.',
        },
        [],
        true,
      );

      interaction.deferReply();
      return interaction.followUp(message);
    });
  }
}
