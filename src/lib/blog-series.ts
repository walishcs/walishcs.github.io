interface SeriesEntry {
  id: string;
  data: { title: string; posts: (string | null)[] };
}

interface PublicPost {
  id: string;
  data: { title: string };
}

export interface SeriesPostLink {
  title: string;
  href: string;
}

export interface BlogSeriesNavigation {
  title: string;
  position: number;
  total: number;
  previous?: SeriesPostLink;
  next?: SeriesPostLink;
}

/** Only pass published posts: unavailable references never become public links. */
export function buildBlogSeriesNavigation(
  seriesEntries: SeriesEntry[],
  publishedPosts: PublicPost[],
): Map<string, BlogSeriesNavigation> {
  const publicPosts = new Map(publishedPosts.map((post) => [post.id, post]));
  const membership = new Map<string, string>();
  const navigation = new Map<string, BlogSeriesNavigation>();

  for (const series of seriesEntries) {
    for (const id of series.data.posts) {
      if (!id) continue;
      const existing = membership.get(id);
      if (existing !== undefined) {
        throw new Error(
          `Blog post "${id}" is listed more than once in blog series "${existing}" and "${series.id}". Keep each post in one series and list it only once.`,
        );
      }
      membership.set(id, series.id);
    }

    const posts = series.data.posts.flatMap((id) => {
      const post = id ? publicPosts.get(id) : undefined;
      return post ? [post] : [];
    });
    if (posts.length < 2) continue;

    const link = (post: PublicPost | undefined): SeriesPostLink | undefined =>
      post ? { title: post.data.title, href: `/blog/${post.id}/` } : undefined;

    posts.forEach((post, index) => {
      navigation.set(post.id, {
        title: series.data.title,
        position: index + 1,
        total: posts.length,
        previous: link(posts[index - 1]),
        next: link(posts[index + 1]),
      });
    });
  }

  return navigation;
}
