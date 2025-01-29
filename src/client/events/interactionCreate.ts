import { Collection, Interaction, InteractionType } from 'discord.js';
import { EventLoader } from '../../../lib/common/loader';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';

export default class InteractionCreate extends EventLoader {
  constructor(client: ExtendedClient) {
    super(client, 'interactionCreate');
  }

  override async run(interaction: Interaction) {
    try {
      const cooldowns = this.client.slashCommandLoader.cooldowns;
      this.client.logger.info(
        `${interaction.type} interaction created by ${interaction.user.id}${
          interaction.type === InteractionType.ApplicationCommand
            ? `: ${interaction.toString()}`
            : ''
        }`,
      );
      if (interaction.isCommand()) {
        if (!cooldowns.has(interaction.commandName)) {
          cooldowns.set(interaction.commandName, new Collection());
        }
        const command = this.client.slashCommandLoader.fetchCommand(
          interaction.commandName,
        );
        if (!command) {
          return this.client.logger.error(
            `Exception: Cannot find command to add cooldown (${interaction.commandName})`,
          );
        }
        const now = Date.now();
        const timestamps = this.client.slashCommandLoader.cooldowns.get(
          interaction.commandName,
        );

        // this will NEVER be true. it defaults to 0 as a cooldown, so there is always a value.
        if (!timestamps) {
          return this.client.logger.error(`Exception: No timestamp exists.`);
        }
        const cooldownTimer = (command.options.cooldown ?? 0) * 1000;

        if (timestamps?.has(interaction.user.id)) {
          const expiration =
            timestamps.get(interaction.user.id) ?? 0 + cooldownTimer;
          if (now < expiration) {
            return interaction.reply(
              this.client.utils.generateErrorInteraction(
                {
                  title: 'Command on cooldown',
                  description: `Try again in <t:${Math.round(expiration / 1000)}:R>`,
                },
                [],
                true,
              ),
            );
          }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownTimer);

        this.client.slashCommandLoader.handle(interaction);
      } else if (interaction.isButton()) {
        this.client.buttonLoader.handle(interaction);
      } else if (interaction.isAnySelectMenu()) {
        this.client.selectMenuLoader.handle(interaction);
      }
    } catch (error) {
      this.client.logger.error(
        `Failed to handle command ${interaction.id}: ${error}`,
      );
    }
  }
}
