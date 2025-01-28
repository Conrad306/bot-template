import { CommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../../../lib/common/ExtendedClient';
import { SlashCommand } from '../../../../lib/common/command/SlashCommand';

export default class ExampleCommand extends SlashCommand {
  constructor(client: ExtendedClient) {
    super('ping', client, {
      description: 'Get bot latency',
    });
  }

  public async run(interaction: CommandInteraction) {
    const message = await interaction
      .reply({
        content: 'Ping?',
        withResponse: true,
      })
      .catch(this.client.logger.error);
    if (!message) return {};

    const hostLatency =
      message.resource?.message?.createdTimestamp! -
      interaction.createdTimestamp;
    const apiLatency = Math.round(this.client.ws.ping);

    return interaction.editReply({
      content: `Pong! Round trip took ${(
        hostLatency + apiLatency
      ).toLocaleString()}ms. (Host latency is ${hostLatency.toLocaleString()} and API latency is ${apiLatency.toLocaleString()}ms)`,
    });
  }
}
