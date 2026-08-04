import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

interface HeroProps {
  eyebrow: string;
  heading: string;
  introduction: string;
  portrait?: string | null;
  portraitAlt: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function Hero({
  eyebrow,
  heading,
  introduction,
  portrait,
  portraitAlt,
  primary,
  secondary,
}: HeroProps) {
  return (
    <section className={`hero${portrait ? ' hero-with-portrait' : ''}`}>
      <VStack className="hero-copy" gap={4}>
        <Text className="hero-eyebrow" type="label" color="accent">
          {eyebrow}
        </Text>
        <Heading
          className="hero-heading"
          level={1}
          type="display-1"
          textWrap="balance"
        >
          {heading}
        </Heading>
        <Text as="p" type="large" color="secondary" textWrap="pretty">
          {introduction}
        </Text>
        {primary || secondary ? (
          <HStack className="hero-actions" gap={3} wrap="wrap">
            {primary ? (
              <a
                className="action-link action-link-primary"
                href={primary.href}
              >
                {primary.label}
              </a>
            ) : null}
            {secondary ? (
              <a
                className="action-link action-link-secondary"
                href={secondary.href}
              >
                {secondary.label}
              </a>
            ) : null}
          </HStack>
        ) : null}
      </VStack>
      {portrait ? (
        <figure className="hero-portrait">
          <img src={portrait} alt={portraitAlt} />
        </figure>
      ) : null}
    </section>
  );
}
