import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
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
        <Card
          className="content-card"
          padding={5}
          elevation="none"
          key={item.href}
        >
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
              <Link
                className="site-link card-title-link"
                href={item.href}
                color="inherit"
              >
                {item.title}
              </Link>
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
      ))}
    </div>
  );
}
