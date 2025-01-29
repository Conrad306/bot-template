import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  MessageReplyOptions,
  User,
} from 'discord.js';
import { ExtendedClient } from './ExtendedClient';
import { resolve } from 'path';
import { readdirSync } from 'fs';

/**
 * A utility class that contains functions the client uses to generate information (eg embeds, codeblock, etc)
 */
export class ClientUtils {
  private client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }
  /**
   * Generates a success embed with possible message components for interactions.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns InteractionReplyOptions
   */
  public generateSuccessInteraction(
    embedData: APIEmbed,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [],
    ephemeral = false,
  ): InteractionReplyOptions {
    return {
      embeds: [
        new EmbedBuilder(embedData).setColor(this.client.config.colors.success),
      ],
      components,
      flags: ephemeral ? ['Ephemeral'] : [],
    };
  }

  /**
   * Generates a success embed with possible message components for messages.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns MessageReplyOptions
   */
  public generateSuccessMessage(
    embedData: APIEmbed,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [],
  ): MessageReplyOptions {
    return {
      embeds: [
        new EmbedBuilder(embedData).setColor(this.client.config.colors.success),
      ],
      components,
    };
  }

  /**
   * Generates a warning embed with possible message components for interactions.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns InteractionReplyOptions
   */
  public generateWarningInteraction(
    embedData: APIEmbed,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [],
    ephemeral = false,
  ): InteractionReplyOptions {
    return {
      embeds: [
        new EmbedBuilder(embedData).setColor(this.client.config.colors.warning),
      ],
      components,
      flags: ephemeral ? ['Ephemeral'] : [],
    };
  }

  /**
   * Generates a warning embed with possible message components for messages.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns MessageReplyOptions
   */
  public generateWarningMessage(
    embedData: APIEmbed,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [],
  ): MessageReplyOptions {
    return {
      embeds: [
        new EmbedBuilder(embedData).setColor(this.client.config.colors.warning),
      ],
      components,
    };
  }

  /**
   * Generates an error embed with possible message components for interactions.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns InteractionReplyOptions
   */
  public generateErrorInteraction(
    embedData: APIEmbed,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [],
    ephemeral = false,
  ): InteractionReplyOptions {
    return {
      embeds: [
        new EmbedBuilder(embedData).setColor(this.client.config.colors.error),
      ],
      components,
      flags: ephemeral ? ['Ephemeral'] : [],
    };
  }

  /**
   * Generates an error embed with possible message components for messages.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns MessageReplyOptions
   */
  public generateErrorMessage(
    embedData: APIEmbed,
    components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [],
  ): MessageReplyOptions {
    return {
      embeds: [
        new EmbedBuilder(embedData).setColor(this.client.config.colors.error),
      ],
      components,
    };
  }

  /**
   * Recursively reads all files from a directory and returns their absolute paths.
   * @param {string} directory - The directory to scan for files.
   * @returns {string[]} An array of absolute paths to the matching files.
   */
  public readFiles(directory: string, extension: string = ''): string[] {
    const files: string[] = [];

    readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
      const entryPath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.readFiles(entryPath, extension));
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(entryPath);
      }
    });

    return files;
  }

  /**
   * Checks if a user is part of the `botOwners` array.
   * @param user The user to check
   * @returns `boolean`
   */
  isAdmin(user: User): boolean {
    return this.client.config.botOwners.includes(user.id);
  }

  async buildPagination<T>(
    interaction: CommandInteraction,
    items: T[],
    totalPages: number,
    currentPage: number,
    formatPage: (pageItems: T[], index: number) => string,
  ) {
    const createEmb = (page: number) => {
      const embed = new EmbedBuilder()
        .setTitle(`Page ${page + 1} of ${totalPages}`)
        .setColor('Blurple')
        .setDescription(
          formatPage(items.slice(page * 2, (page + 1) * 2), page) ||
            'No items to display.',
        );
      return embed;
    };

    const createActionRow = () => {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('page_back')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId('page_fwd')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === totalPages - 1),
      );
    };

    const initalResponse = await interaction.reply({
      embeds: [createEmb(currentPage)],
      components: [createActionRow()],
      withResponse: true,
    });

    const collector =
      initalResponse.resource?.message?.createMessageComponentCollector({
        time: 60000,
        filter: (msg) => msg.user.id == interaction.user.id,
      });

    collector?.on('collect', async (btn: ButtonInteraction) => {
      if (!btn.isButton()) return;

      if (btn.customId === 'page_back' && currentPage > 0) {
        currentPage--;
      } else if (btn.customId === 'page_fwd' && currentPage < totalPages - 1) {
        currentPage++;
      }

      await btn.update({
        embeds: [createEmb(currentPage)],
        components: [createActionRow()],
      });
    });

    collector?.on('end', async () => {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('page_back')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('page_fwd')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );

      await interaction.editReply({
        components: [disabledRow],
      });
      interaction
        .followUp('Message collector ended, disabling buttons..')
        .then((msg) => {
          setTimeout(() => msg.delete(), 3000);
        });
    });
  }
}
