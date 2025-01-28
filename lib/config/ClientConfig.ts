import {
  ActivityType,
  GatewayIntentBits,
  PermissionsString,
  PresenceData,
} from 'discord.js';

export const clientConfig = {
  /** The name your bot is generated with */
  clientName: '',

  version: '',

  /**
   * The hex data your bot uses as support colors
   * @example parseInt("ffffff", 16)
   */
  colors: {
    primary: parseInt('3deb54', 16),
    success: parseInt('3deb54', 16),
    warning: parseInt('fff714', 16),
    error: parseInt('d92323', 16),
  },

  /**
   * External Links (eg bot code or dashboard)
   */
  external: {
    githubUrl: '',
    dashboardUrl: '',
    documentation: '',
    supportServer: '',
  },

  /**
   * GuildPresences, MessageContent, and GuildMembers are privileged and must be enabled in the dev portal
   * @see https://discord.com/developers/docs/topics/gateway#privileged-intents
   * */
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],

  /**
   * People that can access bot only commands
   * @example botOwners: ["12345876234", "526452783645"]
   */
  botOwners: [''],

  presence: {
    activities: [
      {
        type: ActivityType.Playing,
        name: '',
      },
    ],
    status: 'online',
  } as PresenceData,

  /**
   * The permissions the client will take advantage of.
   */
  requiredPermissions: ['Administrator'] as PermissionsString[],

  /**
   * The prefix used when running text commands.
   * Can also use a single value, or none, because pinging the bot will always work.
   */
  textCommandPrefix: ['!'],
};
