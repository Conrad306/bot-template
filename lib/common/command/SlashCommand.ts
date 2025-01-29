import { BaseInteraction } from './BaseInteraction';
import { ExtendedClient } from '../ExtendedClient';
import {
  ApplicationInteractionCommandOptions,
  InteractionType,
} from '../../../types/index';
import {
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  CommandInteraction,
} from 'discord.js';
export class SlashCommand extends BaseInteraction {
  constructor(
    name: string,
    client: ExtendedClient,
    options: ApplicationInteractionCommandOptions,
  ) {
    super(name, client, InteractionType.SlashCommand, options);
    this.description = options.description ?? '';
    this.options = options;
    this.options.applicationData = options.applicationData || [];
  }

  public override run(interaction: CommandInteraction) {
    return super.run(interaction);
  }

  public async autoComplete(
    _interaction: AutocompleteInteraction,
    _option: AutocompleteFocusedOption,
  ): Promise<void> {}
}
