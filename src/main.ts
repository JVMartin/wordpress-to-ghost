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
})().catch((e: Error) => {
  /**
   * This is the only exception handler in the application.
   * Exceptions should not be caught anywhere else.
   * See:
   * https://web.archive.org/web/20190716190534/https://wiki.c2.com/?DontCatchExceptions
   *
   * This is also the only place we explicitly use the console, since there may
   * be an error / issue with our Pino logger.
   */

  // tslint:disable-next-line:no-console
  console.error(e.stack);
  process.exit(1);
});
