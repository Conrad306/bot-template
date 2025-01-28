import { ButtonInteraction, MessageFlags } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';
import { Button } from '../command/index';
import { BaseInteractionLoader } from './BaseInteractionLoader';
import { InteractionType } from '../../../types/index';

export class ButtonLoader extends BaseInteractionLoader {
  constructor(client: ExtendedClient) {
    super(client);
  }

  public override load() {
    return super.load('buttons');
  }

  /**
   *
   * @param customId The custom id of the button (matches \<Button\>.name)
   * @returns The found button, or undefined.
   */
  private fetchButton(customId: string): Button | undefined {
    return this.client.buttons.find((button) =>
      customId.startsWith(button.name),
    );
  }

  handle(interaction: ButtonInteraction) {
    const button = this.fetchButton(interaction.customId);

    if (!button) return;
    if (
      interaction.message.interactionMetadata?.user.id !== interaction.user.id
    ) {
      return interaction.reply({
        content: 'You cannot use this button.',
        flags: [MessageFlags.Ephemeral],
      });
    }

    const missingPermissions = button.validate(
      interaction,
      InteractionType.Button,
    );
    if (missingPermissions)
      return interaction.reply(
        this.client.utils.generateErrorMessage(missingPermissions),
      );

    return this.run(button, interaction);
  }

  async run(button: Button, interaction: ButtonInteraction) {
    await button.run(interaction).catch((error) => {
      this.client.logger.error(error);

      const message = this.client.utils.generateErrorMessage(
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
