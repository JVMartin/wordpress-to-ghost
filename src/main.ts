import { Config } from './services/Config';
import { FileWriter } from './services/FileWriter';
import { LoggerFactory } from './services/LoggerFactory';
import { MySqlClient } from './services/MySqlClient';
import { WordPressToGhost } from './services/WordPressToGhost';

(async () => {
  const config = new Config();
  const logger = LoggerFactory.getLogger(config);
  const mySqlClient = new MySqlClient(config, logger);
  const wordPressToGhost = new WordPressToGhost(logger, mySqlClient);
  const fileWriter = new FileWriter(logger);

  config.logConfigSafely(logger);
  mySqlClient.connect();
  const ghostJson = await wordPressToGhost.wordPressToGhostJson();
  fileWriter.writeJsonToFile(ghostJson, 'ghost.json');
  mySqlClient.end();
})();
