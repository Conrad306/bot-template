import {
  ActionRowBuilder,
  APIEmbed,
  EmbedBuilder,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
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
   * Generates a success embed with possible message components.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns InteractionReplyOptions
   */
  public generateSuccessMessage(
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
   * Generates a warning embed with possible message components.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns InteractionReplyOptions
   */
  public generateWarningMessage(
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
   * Generates an error embed with possible message components.
   * @param embedData The data to build the embed with (e.g. title, description).
   * @param components Any message components to attach.
   * @param ephemeral  Whether the message should be sent as ephemeral.
   * @returns InteractionReplyOptions
   */
  public generateErrorMessage(
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

  isAdmin(user: User) {
    return this.client.config.botOwners.includes(user.id);
  }
}
