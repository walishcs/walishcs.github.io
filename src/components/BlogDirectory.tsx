import { Button } from '@astryxdesign/core/Button';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { Heading } from '@astryxdesign/core/Heading';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { List, ListItem } from '@astryxdesign/core/List';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useId, useMemo, useState } from 'react';
import {
  getBlogArchive,
  normalizeTags,
  searchBlogTags,
  selectBlogPosts,
  tagHref,
  tagSize,
  type BlogDirectoryPost,
  type BlogTag,
} from '../lib/blog-directory';

export function BlogDirectory({
  posts,
  tags,
  activeTag,
}: {
  posts: BlogDirectoryPost[];
  tags: BlogTag[];
  activeTag?: string;
}) {
  const [month, setMonth] = useState('');
  const [query, setQuery] = useState('');
  const id = useId();
  const archive = useMemo(() => getBlogArchive(posts), [posts]);
  const visiblePosts = useMemo(
    () => selectBlogPosts(posts, { month }),
    [posts, month],
  );
  const visibleTags = useMemo(() => searchBlogTags(tags, query), [tags, query]);
  const maximum = Math.max(1, ...tags.map((tag) => tag.count));
  const monthLabel = month
    ? new Intl.DateTimeFormat('en', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${month}-01T00:00:00Z`))
    : 'All posts';

  const navigation = (location: string) => (
    <VStack gap={8}>
      <VStack
        as="section"
        gap={3}
        aria-labelledby={`${id}-${location}-archive`}
      >
        <Heading level={2} id={`${id}-${location}-archive`}>
          Archive
        </Heading>
        <Button
          label={`All posts (${posts.length})`}
          variant={month ? 'ghost' : 'secondary'}
          aria-pressed={!month}
          onClick={() => setMonth('')}
        />
        <CollapsibleGroup
          type="multiple"
          defaultValue={archive[0] ? [archive[0].year] : []}
          chevronPosition="start"
          hasDividers
        >
          {archive.map((year) => (
            <Collapsible
              key={year.year}
              value={year.year}
              trigger={
                <Text weight="semibold">
                  {year.year} ({year.count})
                </Text>
              }
            >
              <VStack gap={1} paddingInlineStart={4}>
                {year.months.map((entry) => (
                  <Button
                    key={entry.value}
                    label={`${entry.label} (${entry.count})`}
                    variant={month === entry.value ? 'secondary' : 'ghost'}
                    aria-pressed={month === entry.value}
                    onClick={() => setMonth(entry.value)}
                  />
                ))}
              </VStack>
            </Collapsible>
          ))}
        </CollapsibleGroup>
      </VStack>
      <VStack as="section" gap={3} aria-labelledby={`${id}-${location}-tags`}>
        <Heading level={2} id={`${id}-${location}-tags`}>
          Tags
        </Heading>
        {tags.length ? (
          <>
            <TextInput
              label="Search tags"
              value={query}
              onChange={setQuery}
              hasClear
              size="sm"
            />
            <HStack
              wrap="wrap"
              gap={3}
              vAlign="center"
              aria-label="Tags by frequency"
            >
              {visibleTags.map((tag) => (
                <Link
                  key={tag.value}
                  href={tag.href}
                  size={tagSize(tag.count, maximum)}
                  className="blog-tag-link"
                  hasUnderline={activeTag === tag.label}
                  aria-current={activeTag === tag.label ? 'page' : undefined}
                >
                  {tag.label} ({tag.count})
                </Link>
              ))}
            </HStack>
            {!visibleTags.length && (
              <Text as="p" role="status">
                No matching tags.
              </Text>
            )}
          </>
        ) : (
          <Text as="p" color="secondary">
            No tags yet.
          </Text>
        )}
      </VStack>
    </VStack>
  );

  return (
    <Grid className="blog-directory" gap={8} align="start">
      <aside
        className="blog-directory-mobile"
        aria-label="Blog navigation"
        data-pagefind-ignore
      >
        <Collapsible trigger="Browse by date or tag" defaultIsOpen={false}>
          {navigation('mobile')}
        </Collapsible>
      </aside>
      <VStack
        as="section"
        gap={4}
        className="blog-directory-results"
        aria-labelledby={`${id}-results`}
      >
        {activeTag && (
          <Link href="/blog/" hasUnderline>
            Back to all blog posts
          </Link>
        )}
        <Heading level={2} id={`${id}-results`}>
          {monthLabel}
        </Heading>
        <Text as="p" color="secondary" role="status" aria-live="polite">
          {visiblePosts.length} {visiblePosts.length === 1 ? 'post' : 'posts'}
        </Text>
        {visiblePosts.length ? (
          <List
            hasDividers
            density="spacious"
            aria-labelledby={`${id}-results`}
          >
            {visiblePosts.map((post) => (
              <ListItem
                key={post.href}
                label={
                  <Heading level={3}>
                    <Link href={post.href} color="inherit" hasUnderline>
                      {post.title}
                    </Link>
                  </Heading>
                }
                description={
                  <VStack gap={3} paddingBlockStart={2}>
                    <Text type="supporting">
                      <time dateTime={post.publishedAt}>
                        {post.formattedDate}
                      </time>
                    </Text>
                    {post.summary && (
                      <Text as="p" color="secondary">
                        {post.summary}
                      </Text>
                    )}
                    {normalizeTags(post.tags).length > 0 && (
                      <HStack wrap="wrap" gap={3} aria-label="Article tags">
                        {normalizeTags(post.tags).map((tag) => (
                          <Link
                            key={tag}
                            href={tagHref(tag)}
                            size="sm"
                            className="blog-tag-link"
                            hasUnderline
                          >
                            {tag}
                          </Link>
                        ))}
                      </HStack>
                    )}
                  </VStack>
                }
              />
            ))}
          </List>
        ) : (
          <Text as="p">
            {month
              ? 'No posts for this month.'
              : 'Writing will appear here when published.'}
          </Text>
        )}
      </VStack>
      <aside
        className="blog-directory-sidebar"
        aria-label="Blog navigation"
        data-pagefind-ignore
      >
        {navigation('desktop')}
      </aside>
    </Grid>
  );
}
