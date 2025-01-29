import {
  Collection,
  CommandInteraction,
  InteractionReplyOptions,
} from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';
import { BaseInteractionLoader } from './BaseInteractionLoader';
import { SlashCommand } from '../command/SlashCommand';
import { InteractionType } from '../../../types/index';
export class SlashCommandLoader extends BaseInteractionLoader {
  public cooldowns: Collection<string, Collection<string, number>>;

  constructor(client: ExtendedClient) {
    super(client);

    this.cooldowns = new Collection();
  }

  public override async load() {
    await super.load('slashCommands');

    setTimeout(async () => {
      if (process.env.NODE_ENV === 'development') {
        this.client.logger.info(
          `[DEVELOPMENT] Registering commands to guilds.`,
        );
        await Promise.all(
          this.client.guilds.cache.map((guild) =>
            guild.commands
              .set(
                this.client.slashCommands.map((cmd) => ({
                  name: cmd.name,
                  description: cmd.description,
                  options: cmd.options.applicationData,
                })),
              )
              .catch((error) => {
                if (error.code === 50001) {
                  this.client.logger.error(
                    null,
                    `Error: Missing access in ${guild.name} (${guild.id}) when trying to set slash commands.`,
                  );
                } else {
                  this.client.logger.error(error);
                }
              })
              .then(() => {
                this.client.logger.info(
                  `Registered guild commands in ${guild.name}`,
                );
              }),
          ),
        );
      } else {
        this.client.application?.commands
          .set(
            this.client.slashCommands.map((cmd) => ({
              name: cmd.name,
              description: cmd.description,
              options: cmd.options.applicationData,
            })),
          )
          .then(() => {
            this.client.logger.info(`Registered global commands.`);
          });
      }
    }, 5000);
  }

  public reload() {
    this.client.slashCommands.clear();
    this.load();
  }

  public fetchCommand(name: string): SlashCommand | undefined {
    return this.client.slashCommands.get(name);
  }

  public handle(interaction: CommandInteraction) {
    const command = this.fetchCommand(interaction.commandName);

    if (!command) {
      return this.client.logger.error(
        `${interaction.user.tag} [${interaction.user.id}] invoked application command ${interaction.commandName} even though it doesn't exist.`,
      );
    }

    const missingPermissions = command.validate(
      interaction,
      InteractionType.SlashCommand,
    );

    if (missingPermissions) {
      return interaction.reply(
        this.client.utils.generateErrorInteraction(
          missingPermissions,
        ) as InteractionReplyOptions,
      );
    }

    this.run(command, interaction);
  }

  private run(command: SlashCommand, interaction: CommandInteraction) {
    command.run(interaction).catch((error): Promise<any> => {
      this.client.logger.error(error);
      const message = this.client.utils.generateErrorInteraction({
        title: 'An Error Has Occurred',
        description: `An unexpected error was encountered while running \`${interaction.commandName}\`.`,
      });
      if (interaction.replied) return interaction.followUp(message);
      else if (interaction.deferred) return interaction.editReply(message);
      else
        return interaction.reply({
          ...message,
        });
    });
  }
}
