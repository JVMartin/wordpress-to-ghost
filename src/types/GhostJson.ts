export interface IGhostJson {
  meta: IGhostMeta;

  data: {
    posts: IGhostPost[];
    tags: IGhostTag[];
    posts_tags: IGhostPostTag[];
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
  slug: string;
  mobiledoc: string;
  // epoch time in ms
  published_at: number;
  published_by: number;
  updated_at: number;
  updated_by: number;
}

export interface IGhostTag {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface IGhostPostTag {
  post_id: number;
  tag_id: number;
}

export interface IGhostUser {
  id: number;
  name: string;
  email: string;
}
