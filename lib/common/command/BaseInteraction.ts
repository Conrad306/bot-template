import { APIEmbed, EmbedData } from 'discord.js';
import {
  BaseInteractionType,
  InteractionGroups,
  InteractionOptions,
  InteractionType,
} from '../../../types/index';
import { ExtendedClient } from '../ExtendedClient';

export class BaseInteraction {
  name: string;
  description: string;
  client: ExtendedClient;
  options: InteractionOptions;
  type: InteractionType;

  constructor(
    name: string,
    client: ExtendedClient,
    type: InteractionType,
    options?: InteractionOptions,
  ) {
    this.name = name;
    this.client = client;
    this.description = options?.description ?? '';
    this.options = options ?? {};
    this.type = type;
  }

  /**
   * Validates interaction based on interaction options.
   * @param interaction the interaction option.
   * @param type The InteractionType of the interaction
   * @returns APIEmbed | null
   */
  public validate(interaction: InteractionGroups, type: InteractionType) {
    let interactionType = BaseInteractionType.get(type);

    let emb: APIEmbed = {
      title: 'Missing Permissions',
    };

    if (this.options.guildOnly && !interaction.inGuild()) {
      emb.description = `${interactionType} must be ran in a guild.`;
      return emb;
    } else if (
      this.options.ownerOnly &&
      interaction.guild?.ownerId != interaction.user.id
    ) {
      emb.description = `${interactionType} can only be ran by the guild owner.`;
      return emb;
    }

    return null;
  }

  /** The base function to run the interaction*/
  public async run(_interaction: InteractionGroups): Promise<any> {}
}
