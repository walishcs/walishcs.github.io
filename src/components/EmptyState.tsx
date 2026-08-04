import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card padding={6} variant="muted">
      <div className="empty-state">
        <Heading level={3}>{title}</Heading>
        <Text as="p" color="secondary">
          {message}
        </Text>
      </div>
    </Card>
  );
}
