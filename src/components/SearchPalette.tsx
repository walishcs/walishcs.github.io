import {
  CommandPalette,
  CommandPaletteFooter,
  CommandPaletteInput,
} from '@astryxdesign/core/CommandPalette';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Kbd } from '@astryxdesign/core/Kbd';
import type {
  SearchableItem,
  SearchSource,
} from '@astryxdesign/core/Typeahead';
import { useEffect, useMemo, useState } from 'react';

interface PagefindResultData {
  url: string;
  plain_excerpt: string;
  meta: Record<string, string>;
}

interface PagefindSearchResult {
  data(): Promise<PagefindResultData>;
}

interface PagefindRuntime {
  search(query: string): Promise<{ results: PagefindSearchResult[] }>;
}

interface SiteSearchAuxiliaryData {
  group: string;
  excerpt: string;
}

interface SiteSearchItem extends SearchableItem<SiteSearchAuxiliaryData> {}

const RESULT_LIMIT = 12;
let pagefindRuntime: Promise<PagefindRuntime> | null = null;

function loadPagefind() {
  if (!pagefindRuntime) {
    const pagefindUrl = '/pagefind/pagefind.js';
    pagefindRuntime = import(
      /* @vite-ignore */ pagefindUrl
    ) as Promise<PagefindRuntime>;
  }

  return pagefindRuntime;
}

export function SearchPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  const searchSource = useMemo<SearchSource<SiteSearchItem>>(
    () => ({
      bootstrap: () => [],
      async search(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return [];

        try {
          const pagefind = await loadPagefind();
          const response = await pagefind.search(trimmedQuery);
          const results = await Promise.all(
            response.results
              .slice(0, RESULT_LIMIT)
              .map((result) => result.data()),
          );
          setIsUnavailable(false);

          return results.map((result) => ({
            id: result.url,
            label: result.meta.title || result.url,
            auxiliaryData: {
              group: result.meta.section || 'Page',
              excerpt: result.plain_excerpt,
            },
          }));
        } catch {
          setIsUnavailable(true);
          return [];
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="site-search" aria-label="Site search">
      <IconButton
        label="Search site"
        tooltip="Search site (⌘/Ctrl K)"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="site-search-icon"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        searchSource={searchSource}
        input={
          <CommandPaletteInput
            label="Search the site"
            placeholder="Search publications, talks, posts, and pages…"
            endContent={<Kbd keys="mod+k" />}
          />
        }
        footer={<CommandPaletteFooter />}
        onValueChange={(url) => window.location.assign(url)}
        renderItem={(item) => (
          <span className="site-search-result">
            <strong>{item.label}</strong>
            {item.auxiliaryData?.excerpt && (
              <span>{item.auxiliaryData.excerpt}</span>
            )}
          </span>
        )}
        emptyBootstrapText="Type to search the site"
        emptySearchText={
          isUnavailable
            ? 'Search is available after running a production build.'
            : 'No matching pages found'
        }
        label="Site search"
      />
    </section>
  );
}
