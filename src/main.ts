import { Config } from './services/Config';
import { LoggerFactory } from './services/LoggerFactory';
import { MySqlClient } from './services/MySqlClient';
import { WordPressToGhost } from './services/WordPressToGhost';

(async () => {
  const config = new Config();
  const logger = LoggerFactory.getLogger(config);
  const mySqlClient = new MySqlClient(config, logger);
  const wordPressToGhost = new WordPressToGhost(logger, mySqlClient);

  config.logConfigSafely(logger);
  mySqlClient.connect();
  const json = await wordPressToGhost.migrate();
  logger.info(json);
  mySqlClient.end();
})();
