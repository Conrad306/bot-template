import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  APIEmbed,
  ApplicationCommandOptionData,
  AutocompleteInteraction,
  BitFieldResolvable,
  ButtonInteraction,
  CommandInteraction,
  MessageFlags,
} from 'discord.js';

/** Defined interaction options for extended interaction classes. */
export interface InteractionOptions {
  description?: string;
  /** Whether it can only be run in a guild */
  guildOnly?: boolean;
  /** Whether it can only be run by the owner of the bot */
  devOnly?: boolean;
  /** Whether it can only be run by the owner of the guild the command is ran in */
  ownerOnly?: boolean;

  applicationData?: ApplicationCommandOptionData[];
}

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
