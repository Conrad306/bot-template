import { ClientEvents } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';

export class EventLoader {
  /**
   * The name of the event.
   * @see https://discord.js.org/docs/packages/discord.js/14.17.3/ClientEvents:Interface
   */
  public readonly name: keyof ClientEvents;

  /**
   * Our client.
   */
  public readonly client: ExtendedClient;

  /**
   * The listener function for our event.
   */
  private readonly _listener;

  constructor(client: ExtendedClient, name: keyof ClientEvents) {
    this.name = name;
    this.client = client;

    this._listener = this._run.bind(this);
  }

  private async _run(...args: any) {
    try {
      return await this.run(...args);
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  /**
   * Execute our event.
   * @param _args The arguments for our event.
   */
  public async run(..._args: any): Promise<any> {}

  /**
   * Listen for our event.
   */
  public listen() {
    return this.client.on(this.name, this._listener);
  }

  /**
   * Stop listening for our event.
   */
  public removeListener() {
    return this.client.off(this.name, this._listener);
  }
}
