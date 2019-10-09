import { Logger } from 'pino';

import { MySqlClient } from './MySqlClient';

export class WordPressToGhost {
  constructor(private readonly logger: Logger, private readonly mySqlClient: MySqlClient) {}

  public async migrate(): Promise<any> {
    this.logger.trace(`${WordPressToGhost.name}::migrate`);
    this.logger.trace(`${this.mySqlClient}`);

    return {};
  }
}
