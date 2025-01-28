import { AutocompleteInteraction } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';
import { BaseInteractionLoader } from './BaseInteractionLoader';
import { SlashCommand } from '../command/SlashCommand';

export class AutoCompleteLoader extends BaseInteractionLoader {
  constructor(client: ExtendedClient) {
    super(client);
  }

  public override load() {
    return super.load('autoCompletes');
  }

  private fetchAutoComplete(name: string) {
    return this.client.slashCommands.find(
      (autoComplete) => autoComplete.name == name,
    );
  }

  public handle(interaction: AutocompleteInteraction) {
    const autoComplete = this.fetchAutoComplete(interaction.commandName);
    if (!autoComplete) return;

    return this.run(autoComplete, interaction);
  }

  async run(autoComplete: SlashCommand, interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);

    autoComplete
      .autoComplete(interaction, focused)
      .catch(async (error): Promise<any> => {
        this.client.logger.error(error);
        if (!interaction.responded) return interaction.respond([]);
      });
  }
}
