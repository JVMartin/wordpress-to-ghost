// @ts-ignore
import { toMobiledoc } from '@tryghost/html-to-mobiledoc';
import * as _ from 'lodash';
import { Logger } from 'pino';

import {
  IGhostJson,
  IGhostMeta,
  IGhostPost,
  IGhostPostTag,
  IGhostTag,
  IGhostUser,
} from '../types/GhostJson';

import { MySqlClient } from './MySqlClient';

export class WordPressToGhost {
  public static readonly GHOST_VERSION: string = '2.34.0';

  constructor(private readonly logger: Logger, private readonly mySqlClient: MySqlClient) {}

  public async wordPressToGhostJson(): Promise<IGhostJson> {
    this.logger.trace(`${WordPressToGhost.name}::${this.wordPressToGhostJson.name}`);

    const posts = await this.scrapePosts();
    const postIdMap = this.postsToPostIdMap(posts);
    const [tags, postTags]: [IGhostTag[], IGhostPostTag[]] = await this.scrapeTagsAndPostTags(
      postIdMap,
    );

    return {
      meta: this.getMeta(),
      data: {
        posts,
        tags,
        posts_tags: postTags,
        users: await this.scrapeUsers(),
      },
    };
  }

  /**
   * Create a map that takes a post id as the key and returns true
   * if the post exists.
   */
  private postsToPostIdMap(posts: IGhostPost[]): { [id: number]: boolean } {
    this.logger.trace(`${WordPressToGhost.name}::${this.postsToPostIdMap.name}`);

    return _.reduce(
      posts,
      (map, ghostPost) => {
        return {
          ...map,
          [ghostPost.id]: true,
        };
      },
      {},
    );
  }

  /**
   * Scrape the WordPress database for users.
   */
  private async scrapePosts(): Promise<IGhostPost[]> {
    this.logger.trace(`${WordPressToGhost.name}::${this.scrapePosts.name}`);

    const rows: any[] = await this.mySqlClient.query(`
      SELECT * from wp_posts
      WHERE post_type='post'
      AND post_status='publish'
    `);

    return _.map(
      rows,
      (row: any): IGhostPost => {
        return {
          id: row.ID,
          title: row.post_title,
          slug: row.post_name,
          mobiledoc: JSON.stringify(toMobiledoc(row.post_content)),
          published_at: (row.post_date as Date).valueOf(),
          published_by: row.post_author,
          updated_at: (row.post_modified as Date).valueOf(),
          updated_by: row.post_author,
        };
      },
    );
  }

  /**
   * Scrape the WordPress database for tags and posts_tags.
   */
  private async scrapeTagsAndPostTags(postIdMap: {
    [value: number]: boolean;
  }): Promise<[IGhostTag[], IGhostPostTag[]]> {
    this.logger.trace(`${WordPressToGhost.name}::${this.scrapeTagsAndPostTags.name}`);

    const rows = await this.mySqlClient.query(`
      SELECT name, slug, object_id as post_id
      FROM wp_term_relationships
      JOIN wp_term_taxonomy
          ON wp_term_relationships.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id
      JOIN wp_terms
          ON wp_terms.term_id = wp_term_taxonomy.term_id
      WHERE taxonomy = 'post_tag';
    `);

    const tagSlugToId: { [slug: string]: number } = {};
    const ghostTags: IGhostTag[] = [];
    const ghostPostTags: IGhostPostTag[] = [];

    let tagAutoIncrement = 0;

    for (const row of rows) {
      // Don't scrape tags of posts that are not in our system
      if (!postIdMap[row.post_id]) {
        continue;
      }

      // If we haven't seen this tag yet, "create" it
      if (!tagSlugToId[row.slug]) {
        tagSlugToId[row.slug] = ++tagAutoIncrement;
        ghostTags.push({
          id: tagSlugToId[row.slug],
          name: row.name,
          slug: row.slug,
          description: '',
        });
      }

      ghostPostTags.push({
        post_id: row.post_id,
        tag_id: tagSlugToId[row.slug],
      });
    }

    return [ghostTags, ghostPostTags];
  }

  /**
   * Scrape the WordPress database for users.
   */
  private async scrapeUsers(): Promise<IGhostUser[]> {
    this.logger.trace(`${WordPressToGhost.name}::${this.scrapeUsers.name}`);

    const rows: any[] = await this.mySqlClient.query('SELECT * from wp_users');

    return _.map(
      rows,
      (row: any): IGhostUser => {
        return {
          id: row.ID,
          name: row.display_name,
          email: row.user_email,
        };
      },
    );
  }

  private getMeta(): IGhostMeta {
    this.logger.trace(`${WordPressToGhost.name}::${this.getMeta.name}`);

    return {
      exported_on: Date.now(),
      version: WordPressToGhost.GHOST_VERSION,
    };
  }
}
