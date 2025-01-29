import { ShardingManager } from 'discord.js';
import { configDotenv } from 'dotenv';
import { Logger } from '../lib/common/Logger';
import { clientConfig } from '../lib/config/clientConfig';

configDotenv();

const manager = new ShardingManager('./src/client/client.ts', {
  token: process.env.CLIENT_TOKEN,
  execArgv: ['--import', 'tsx'],
});

const logger = new Logger();

logger.info(`Starting ${clientConfig.clientName}...`);

manager.spawn({
  timeout: 10000,
});

manager.on('shardCreate', (shard) => {
  logger.info(`Starting shard: ${shard.id}`);
  if (shard.id + 1 === manager.totalShards) {
    shard.once('ready', () => {
      setTimeout(() => {
        logger.info('All shards are online and ready!');
      }, 200);
    });
  }
});
