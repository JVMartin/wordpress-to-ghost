import * as mysql from 'mysql';
import { Logger } from 'pino';

import { Config } from './Config';

export class MySqlClient {
  private connection: mysql.Connection;

  constructor(private readonly config: Config, private readonly logger: Logger) {
    this.connection = mysql.createConnection({
      host: this.config.mySqlHost,
      database: this.config.mySqlDatabase,
      user: this.config.mySqlUsername,
      password: this.config.mySqlPassword,
    });
  }

  public query(query: string): Promise<any> {
    this.logger.trace(`${MySqlClient.name}::${this.query.name}`);

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  }

  public connect(): void {
    this.logger.trace(`${MySqlClient.name}::${this.connect.name}`);

    this.connection.connect();
  }

  public end(): void {
    this.logger.trace(`${MySqlClient.name}::${this.end.name}`);

    this.connection.end();
  }
}
