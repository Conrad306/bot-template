import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  APIEmbed,
  ApplicationCommandOptionData,
  AutocompleteInteraction,
  BitFieldResolvable,
  ButtonBuilder,
  ButtonInteraction,
  CommandInteraction,
  Embed,
  MessageActionRowComponentBuilder,
  MessageFlags,
  MessageFlagsString,
} from 'discord.js';

/** Defined base options for extended command handler classes. */
export type BaseCommandOptions = {
  /**
   * The description used.
   * If used for text command, it is added to the `help` command.
   */
  description?: string;
};

export type InteractionCommandOptions = BaseCommandOptions & {
  /** Whether it can only be run in a guild */
  guildOnly?: boolean;
  /** Whether it can only be run by the owner of the bot */
  devOnly?: boolean;
  /** Whether it can only be run by the owner of the guild the command is ran in */
  ownerOnly?: boolean;

  applicationData?: ApplicationCommandOptionData[];
};

export type ApplicationInteractionCommandOptions = InteractionCommandOptions & {
  cooldown?: number;
};

export type TextCommandOptions = Omit<
  ApplicationInteractionCommandOptions,
  'applicationData'
>;

export enum InteractionType {
  AutoComplete,
  SelectMenu,
  SlashCommand,
  Button,
  ModalSubmit,
}
export type InteractionGroups =
  | AnySelectMenuInteraction
  | CommandInteraction
  | ButtonInteraction
  | AutocompleteInteraction;

export const BaseInteractionType: Map<InteractionType, string> = new Map<
  InteractionType,
  string
>([
  [InteractionType.Button, 'Button'],
  [InteractionType.ModalSubmit, 'Modal Submit'],
  [InteractionType.SlashCommand, 'Slash Command'],
  [InteractionType.SelectMenu, 'Select Menu'],
  [InteractionType.AutoComplete, 'Auto-complete'],
]);

export interface GeneratedMessage {
  embeds?: APIEmbed[];
  components?: ActionRowBuilder<MessageActionRowComponentBuilder>[];
  flags?: MessageFlags;
  content?: string;
}
