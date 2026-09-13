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
        <Heading
          level={4}
          accessibilityLevel={2}
          id={`${id}-${location}-archive`}
        >
          Archive
        </Heading>
        <List density="compact" aria-label="All dates">
          <ListItem
            label="All posts"
            endContent={<Text type="supporting">{posts.length}</Text>}
            isSelected={!month}
            onClick={() => setMonth('')}
          />
        </List>
        <CollapsibleGroup
          type="multiple"
          defaultValue={archive[0] ? [archive[0].year] : []}
          chevronPosition="start"
          density="compact"
        >
          {archive.map((year) => (
            <Collapsible
              key={year.year}
              value={year.year}
              trigger={
                <HStack width="100%" hAlign="between" vAlign="center" gap={2}>
                  <Text type="label">{year.year}</Text>
                  <Text type="supporting">{year.count}</Text>
                </HStack>
              }
            >
              <VStack paddingInlineStart={4}>
                <List density="compact" aria-label={`${year.year} months`}>
                  {year.months.map((entry) => (
                    <ListItem
                      key={entry.value}
                      label={entry.label}
                      endContent={<Text type="supporting">{entry.count}</Text>}
                      isSelected={month === entry.value}
                      onClick={() => setMonth(entry.value)}
                    />
                  ))}
                </List>
              </VStack>
            </Collapsible>
          ))}
        </CollapsibleGroup>
      </VStack>
      <VStack as="section" gap={3} aria-labelledby={`${id}-${location}-tags`}>
        <Heading level={4} accessibilityLevel={2} id={`${id}-${location}-tags`}>
          Tags
        </Heading>
        {tags.length ? (
          <>
            <TextInput
              label="Search tags"
              isLabelHidden
              placeholder="Search tags…"
              value={query}
              onChange={setQuery}
              hasClear
              size="md"
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
                  {tag.label}{' '}
                  <Text type="supporting" color="secondary">
                    {tag.count}
                  </Text>
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
    <Grid className="blog-directory" gap={10} align="start">
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
        <HStack
          hAlign="between"
          vAlign="center"
          gap={3}
          className="blog-directory-heading"
        >
          <Heading level={4} accessibilityLevel={2} id={`${id}-results`}>
            {monthLabel}
          </Heading>
          <Text type="supporting" role="status" aria-live="polite">
            {visiblePosts.length} {visiblePosts.length === 1 ? 'post' : 'posts'}
          </Text>
        </HStack>
        {visiblePosts.length ? (
          <List
            hasDividers
            density="spacious"
            aria-labelledby={`${id}-results`}
          >
            {visiblePosts.map((post) => (
              <ListItem
                key={post.href}
                className="blog-post-row"
                label={
                  <VStack gap={3}>
                    <Text type="supporting">
                      <time dateTime={post.publishedAt}>
                        {post.formattedDate}
                      </time>
                    </Text>
                    <Heading level={2} accessibilityLevel={3}>
                      <Link
                        href={post.href}
                        color="inherit"
                        className="site-link"
                      >
                        {post.title}
                      </Link>
                    </Heading>
                  </VStack>
                }
                description={
                  <VStack gap={3} paddingBlockStart={2}>
                    {post.summary && (
                      <Text
                        as="p"
                        type="body"
                        size="lg"
                        color="secondary"
                        textWrap="pretty"
                      >
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
                            color="secondary"
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
