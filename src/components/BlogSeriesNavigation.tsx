import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import type { BlogSeriesNavigation as SeriesNavigation } from '@/lib/blog-series';

export function BlogSeriesNavigation({
  navigation,
}: {
  navigation?: SeriesNavigation;
}) {
  if (!navigation || (!navigation.previous && !navigation.next)) return null;

  return (
    <nav aria-label="Series navigation" data-pagefind-ignore>
      <VStack gap={3} paddingBlock={6}>
        <Text type="label">Series: {navigation.title}</Text>
        <Text type="supporting">
          Part {navigation.position} of {navigation.total}
        </Text>
        {navigation.previous && (
          <Link href={navigation.previous.href} rel="prev" isStandalone>
            Previous: {navigation.previous.title}
          </Link>
        )}
        {navigation.next && (
          <Link href={navigation.next.href} rel="next" isStandalone>
            Next: {navigation.next.title}
          </Link>
        )}
      </VStack>
    </nav>
  );
}
