import { BaseInteraction } from './BaseInteraction';
import { ExtendedClient } from '../ExtendedClient';
import {
  InteractionGroups,
  InteractionOptions,
  InteractionType,
} from '../../../types/index';
import { AnySelectMenuInteraction } from 'discord.js';

export class SelectMenu extends BaseInteraction {
  constructor(
    name: string,
    client: ExtendedClient,
    options: InteractionOptions,
  ) {
    super(name, client, InteractionType.SelectMenu, options);
  }
}
