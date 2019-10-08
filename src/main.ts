import { Config } from './services/Config';
import { LoggerFactory } from './services/LoggerFactory';

(async () => {
  const config = new Config();
  const logger =  LoggerFactory.getLogger(config);

  config.logConfigSafely(logger);
})();
