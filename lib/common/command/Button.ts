import { ButtonInteraction } from 'discord.js';
import { InteractionOptions, InteractionType } from '../../../types/index';
import { ExtendedClient } from '../ExtendedClient';
import { BaseInteraction } from './BaseInteraction';

export class Button extends BaseInteraction {
  constructor(
    name: string,
    client: ExtendedClient,
    options: InteractionOptions,
  ) {
    super(name, client, InteractionType.Button, options);
  }

  public override run(interaction: ButtonInteraction) {
    return super.run(interaction);
  }
}
