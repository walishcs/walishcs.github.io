import {
  CommandPalette,
  CommandPaletteFooter,
  CommandPaletteInput,
} from '@astryxdesign/core/CommandPalette';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Kbd } from '@astryxdesign/core/Kbd';
import {
  createPagefindSearchController,
  type PagefindRuntime,
} from '@/lib/pagefind-search';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const searchController = useMemo(
    () =>
      createPagefindSearchController({
        loadPagefind,
        onAvailabilityChange: setIsUnavailable,
      }),
    [],
  );

  const prepareSearch = useCallback(() => {
    void searchController.prepare();
  }, [searchController]);

  const handleOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      if (nextIsOpen) prepareSearch();
      setIsOpen(nextIsOpen);
    },
    [prepareSearch],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        handleOpenChange(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenChange]);

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
        onFocus={prepareSearch}
        onPointerEnter={prepareSearch}
        onClick={() => handleOpenChange(true)}
      />
      <CommandPalette
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        searchSource={searchController.source}
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
