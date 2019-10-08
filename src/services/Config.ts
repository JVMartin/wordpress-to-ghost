import { Level, Logger } from 'pino';

/**
 * The Config class represents *all* configuration for the application.
 *
 * All configurations are set via process environment variables.
 * When a process environment variable is not provided, the default should
 * target a production environment (rather than a development environment).
 */
export class Config {
  /**
   * The log level, application-wide.
   *
   * Environment variable: LOG_LEVEL
   */
  public readonly logLevel: Level;

  constructor() {
    this.checkRequiredVars();

    /**
     * -------------------------------------------------------------------------
     * OPTIONAL VARIABLES
     * -------------------------------------------------------------------------
     */
    if (process.env.LOG_LEVEL) {
      if (['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(process.env.LOG_LEVEL)) {
        this.logLevel = process.env.LOG_LEVEL as Level;
      } else {
        throw new Error(`Invalid LOG_LEVEL: ${process.env.LOG_LEVEL}`);
      }
    } else {
      this.logLevel = 'info';
    }

    /**
     * -------------------------------------------------------------------------
     * REQUIRED VARIABLES
     * -------------------------------------------------------------------------
     */
    // We can safely cast these to strings because we already called
    // checkRequiredVars();
  }

  /**
   * Log all configs that are safe to log.
   * DO NOT log any secrets here!
   */
  public logConfigSafely(logger: Logger): void {
    logger.info({
      config: {
        logLevel: this.logLevel,
      },
    });
  }

  private checkRequiredVars(): void {
    const requiredVars: string[] = [];

    const missingVars = requiredVars.reduce((vars: string[], v: string) => {
      if (!process.env[v]) {
        vars.push(v);
      }

      return vars;
    }, []);

    if (missingVars.length) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}
