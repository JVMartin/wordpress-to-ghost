import * as pino from 'pino';

import { Config } from './Config';

/**
 * Responsible for creating a Pino instance for logging.
 *
 * See: http://getpino.io/
 */
export class LoggerFactory {
  public static getLogger(config: Config): pino.Logger {
    return pino({
      level: config.logLevel,
    });
  }
}
