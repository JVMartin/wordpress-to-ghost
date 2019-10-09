export interface IGhostJson {
  meta: IGhostMeta;

  data: {
    posts: IGhostPost[];
    tags: IGhostTag[];
    posts_tags: Array<{
      tag_id: number;
      post_id: number;
    }>;
    users: IGhostUser[];
  };
}

export interface IGhostMeta {
  // epoch time in ms
  exported_on: number;
  // the version of ghost this is intended to import into
  version: string;
}

export interface IGhostPost {
  id: number;
  title: string;
  mobiledoc: string;
  // epoch time in ms
  published_at: number;
  published_by: number;
}

export interface IGhostTag {
  id: number;
  name: string;
  description: string;
}

export interface IGhostUser {
  id: number;
  name: string;
  email: string;
}
