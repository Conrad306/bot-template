import { BaseInteraction, Client, ClientOptions, Collection } from 'discord.js';
import { clientConfig } from '../config/clientConfig';
import { resolve } from 'path';
import { Logger } from './Logger';
import { PrismaClient } from '@prisma/client';
import { ClientUtils } from './ClientUtils';
import {
  AutoCompleteLoader,
  ButtonLoader,
  EventLoader,
  SelectMenuLoader,
  SlashCommandLoader,
  TextCommandLoader,
} from './loader';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { Button, SlashCommand, SelectMenu } from './command';
import TextCommand from './command/TextCommand';
/**
 * The main Discord.js client, with extensions and utility functions.
 */
export class ExtendedClient extends Client {
  /** The directory of the bot */
  public __dirname: string;

  /** The config file for the bot */
  public readonly config: typeof clientConfig;
  /** An internal logger class for the client */
  logger: Logger;

  /** A set of utility functions for the bot */
  utils: ClientUtils;

  // Client Collections

  /** The clients collection of discord.js events.
   *  @see https://discord.js.org/docs/packages/discord.js/14.17.3/ClientEvents:Interface
   */
  public events: Map<string, EventLoader>;

  /** A collection of buttons loaded by the client. */
  public buttons: Collection<string, Button>;

  /** The loader used for button interactions. */
  public buttonLoader: ButtonLoader;

  /** The loader used for auto complete interactions. */
  public autoCompleteLoader: AutoCompleteLoader;

  /** A collection of select menus loaded by the client. */
  public selectMenus: Collection<string, SelectMenu>;

  /** The loader used for select menu interactions. */
  public selectMenuLoader: SelectMenuLoader;

  /** A collection of slash commands loaded by the client */
  public slashCommands: Collection<string, SlashCommand>;

  /** The loader used for slash command interactions. */
  public slashCommandLoader: SlashCommandLoader;

  /** A collection of text commands loaded by the client. */
  public textCommands: Collection<string, TextCommand>;
  /** The loader used for slash command interactions. */
  public textCommandLoader: TextCommandLoader;

  /** The database connection on the client */
  public prisma: PrismaClient;

  constructor(options: ClientOptions) {
    super(options);

    this.__dirname = resolve();
    this.config = clientConfig;
    this.logger = new Logger();

    this.utils = new ClientUtils(this);

    this.events = new Map();
    this.autoCompleteLoader = new AutoCompleteLoader(this);

    this.buttons = new Collection();
    this.buttonLoader = new ButtonLoader(this);

    this.selectMenus = new Collection();
    this.selectMenuLoader = new SelectMenuLoader(this);

    this.slashCommands = new Collection();
    this.slashCommandLoader = new SlashCommandLoader(this);

    this.textCommands = new Collection();
    this.textCommandLoader = new TextCommandLoader(this);

    this.prisma = new PrismaClient();

    this.autoCompleteLoader.load();
    this.buttonLoader.load();
    this.selectMenuLoader.load();
    this.slashCommandLoader.load();
    this.textCommandLoader.loadFiles();
    this.loadEvents();
  }

  override async login() {
    return super.login();
  }

  private loadEvents() {
    const eventsPath = resolve(this.__dirname, 'src', 'client', 'events');
    if (!existsSync(eventsPath)) {
      return this.logger.error(`Failed to read path: ${eventsPath}`);
    }
    this.utils.readFiles(eventsPath).forEach(async (eventFilePath) => {
      const eventModule = await import(pathToFileURL(eventFilePath).href);
      const eventClass = eventModule.default;
      if (eventClass && typeof eventClass === 'function') {
        const event = new eventClass(this);
        if (event instanceof EventLoader) {
          event.listen();
          this.events.set(event.name, event);
        } else {
          this.logger.warn(
            `Event file ${eventFilePath} does not export a valid EventLoader class.`,
          );
        }
      }
    });
  }
}
