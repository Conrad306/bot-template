import { CommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../../../lib/common/ExtendedClient';
import { SlashCommand } from '../../../../lib/common/command/SlashCommand';

/**
 * Feel free to update if you add specific features (like categories)
 * Also, you could definitely add cooldown to this, i just chose not to.
 */
export default class HelpCommand extends SlashCommand {
  constructor(client: ExtendedClient) {
    super('help', client, {
      description: 'View help command of all existing commands.',
    });
  }

  public async run(interaction: CommandInteraction) {
    const formatPage = (pageItems: SlashCommand[], pageIndex: number) => {
      return pageItems
        .map(
          (command, index) =>
            `${pageIndex * 3 + index + 1}. **${command.name}** - ${command.description}`,
        )
        .join('\n');
    };
    this.client.utils.buildPagination<SlashCommand>(
      interaction,
      this.client.slashCommands.map((v) => v),
      Math.ceil(this.client.slashCommands.size / 3),
      0,
      formatPage,
    );
  }
}
