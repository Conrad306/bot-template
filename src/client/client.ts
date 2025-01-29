import { ExtendedClient } from '../../lib/common/ExtendedClient';
import { clientConfig } from '../../lib/config/clientConfig';

const client = new ExtendedClient({
  allowedMentions: { parse: ['users'] },
  presence: clientConfig.presence,
  intents: clientConfig.intents,
});

client.login().catch((error) => {
  client.logger.error(error);
});
