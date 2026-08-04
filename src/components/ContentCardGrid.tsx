import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';

export interface ContentCardItem {
  href: string;
  title: string;
  summary?: string;
  meta?: string;
  badge?: string;
}

export function ContentCardGrid({ items }: { items: ContentCardItem[] }) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <a className="card-link" href={item.href} key={item.href}>
          <Card padding={5} elevation="none">
            <div className="card-content">
              <div className="card-kicker">
                {item.badge ? (
                  <Badge label={item.badge} variant="neutral" />
                ) : null}
                {item.meta ? (
                  <Text type="supporting" color="secondary">
                    {item.meta}
                  </Text>
                ) : null}
              </div>
              <Heading level={3} textWrap="balance">
                {item.title}
              </Heading>
              {item.summary ? (
                <Text as="p" color="secondary" textWrap="pretty">
                  {item.summary}
                </Text>
              ) : null}
              <Text type="label" color="accent">
                Read more <span aria-hidden="true">→</span>
              </Text>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}
