import { Link } from '@astryxdesign/core/Link';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { useMemo, useState } from 'react';
import { ContentCardGrid } from '@/components/ContentCardGrid';
import {
  groupBlogPosts,
  type BlogDirectoryMode,
  type BlogDirectoryPost,
} from '@/lib/blog-directory';

export function BlogDirectory({ posts }: { posts: BlogDirectoryPost[] }) {
  const [mode, setMode] = useState<BlogDirectoryMode>('tag');
  const groups = useMemo(() => groupBlogPosts(posts, mode), [mode, posts]);

  return (
    <section className="blog-directory" aria-label="Blog directory">
      <header className="blog-directory-controls" data-pagefind-ignore>
        <p>Browse by</p>
        <SegmentedControl
          value={mode}
          onChange={(value) => setMode(value as BlogDirectoryMode)}
          label="Group blog posts by"
          size="sm"
        >
          <SegmentedControlItem value="tag" label="First tag" />
          <SegmentedControlItem value="year" label="Year" />
        </SegmentedControl>
      </header>
      <nav className="blog-directory-index" aria-label={`${mode} directory`}>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                className="site-link"
                href={`#${group.id}`}
                color="inherit"
                hasUnderline
              >
                {group.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="blog-directory-groups" aria-live="polite">
        {groups.map((group) => (
          <section
            className="blog-directory-group"
            id={group.id}
            key={group.id}
            aria-labelledby={`${group.id}-heading`}
          >
            <h2 id={`${group.id}-heading`}>{group.label}</h2>
            <ContentCardGrid
              items={group.posts.map((post) => ({
                href: post.href,
                title: post.title,
                summary: post.summary,
                meta: post.formattedDate,
              }))}
            />
          </section>
        ))}
      </section>
    </section>
  );
}
