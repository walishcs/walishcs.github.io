import { Outline, useOutlineFromMarkdown } from '@astryxdesign/core/Outline';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { useLayoutEffect, useState } from 'react';

interface BlogOutlineProps {
  body: string;
  contentId: string;
}

export function BlogOutline({ body, contentId }: BlogOutlineProps) {
  const items = useOutlineFromMarkdown(body);
  const [headerOffset, setHeaderOffset] = useState(0);

  useLayoutEffect(() => {
    const content = document.getElementById(contentId);
    const headings = content?.querySelectorAll<HTMLHeadingElement>(
      'h1, h2, h3, h4, h5, h6',
    );
    const previousIds = headings
      ? Array.from(headings, (heading) => heading.id)
      : [];

    headings?.forEach((heading, index) => {
      const item = items[index];
      if (item) heading.id = item.id;
    });

    const siteHeader = document.querySelector<HTMLElement>('.site-header');
    const updateHeaderOffset = () => {
      setHeaderOffset(
        Math.ceil(siteHeader?.getBoundingClientRect().height ?? 0),
      );
    };

    updateHeaderOffset();
    const resizeObserver =
      siteHeader && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateHeaderOffset)
        : null;
    if (siteHeader && resizeObserver) resizeObserver.observe(siteHeader);

    return () => {
      resizeObserver?.disconnect();
      headings?.forEach((heading, index) => {
        heading.id = previousIds[index] ?? '';
      });
    };
  }, [contentId, items]);

  if (items.length === 0) return null;

  return (
    <VStack gap={2}>
      <Text type="label" color="secondary">
        On this page
      </Text>
      <Outline items={items} density="compact" offset={headerOffset} />
    </VStack>
  );
}
