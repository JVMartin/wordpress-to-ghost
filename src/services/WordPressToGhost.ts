import { Logger } from 'pino';
import * as _ from 'lodash';
// @ts-ignore
import { toMobiledoc } from '@tryghost/html-to-mobiledoc';

import { IGhostJson, IGhostMeta, IGhostPost, IGhostTag, IGhostUser } from '../types/GhostJson';

import { MySqlClient } from './MySqlClient';

export class WordPressToGhost {
  public static readonly GHOST_VERSION: string = '2.34.0';

  constructor(private readonly logger: Logger, private readonly mySqlClient: MySqlClient) {}

  public async wordPressToGhostJson(): Promise<IGhostJson> {
    this.logger.trace(`${WordPressToGhost.name}::migrate`);

    return {
      meta: this.getMeta(),
      data: {
        posts: await this.getPosts(),
        tags: await this.getTags(),
        posts_tags: [],
        users: await this.getUsers(),
      },
    };
  }

  private async getPosts(): Promise<IGhostPost[]> {
    this.logger.trace(`${WordPressToGhost.name}::getPosts`);

    const rows: any[] = await this.mySqlClient.query(`
      SELECT * from wp_posts
      WHERE post_type='post'
      AND post_status='publish'
    `);

    return _.map(rows, (row: any): IGhostPost => {
      return {
        id: row.ID,
        mobiledoc: JSON.stringify(toMobiledoc(row.post_content)),
        published_at: (row.post_date as Date).valueOf(),
        published_by: row.post_author,
        title: row.post_title,
      };
    });
  }

  private async getTags(): Promise<IGhostTag[]> {
    this.logger.trace(`${WordPressToGhost.name}::getTags`);

    return [];
  }

  private async getUsers(): Promise<IGhostUser[]> {
    this.logger.trace(`${WordPressToGhost.name}::getUsers`);

    const rows: any[] = await this.mySqlClient.query('SELECT * from wp_users');

    return _.map(rows, (row: any): IGhostUser => {
      return {
        id: row.ID,
        name: row.display_name,
        email: row.user_email,
      };
    });
  }

  private getMeta(): IGhostMeta {
    this.logger.trace(`${WordPressToGhost.name}::getMeta`);

    return {
      exported_on: Date.now(),
      version: WordPressToGhost.GHOST_VERSION,
    };
  }
}
