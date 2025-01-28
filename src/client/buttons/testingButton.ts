import { ButtonInteraction } from 'discord.js';
import { ExtendedClient } from '../../../lib/common/ExtendedClient';
import { Button } from '../../../lib/common/command';

export default class TestButton extends Button {
  constructor(client: ExtendedClient) {
    super('testbutton', client, {});
  }

  public async run(interaction: ButtonInteraction) {
    return interaction.reply('you clicked the button');
  }
}
