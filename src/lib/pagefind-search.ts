import type {
  SearchableItem,
  SearchSource,
} from '@astryxdesign/core/Typeahead';

export const PAGEFIND_DEBOUNCE_MS = 200;
export const PAGEFIND_RESULT_LIMIT = 6;

const RESULT_DATA_CACHE_LIMIT = 120;

export interface PagefindResultData {
  url: string;
  plain_excerpt: string;
  meta: Record<string, string>;
}

export interface PagefindSearchResult {
  id: string;
  data(): Promise<PagefindResultData>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
}

export interface PagefindRuntime {
  init(): Promise<void>;
  debouncedSearch(
    query: string,
    options: Record<string, never>,
    debounceTimeoutMs: number,
  ): Promise<PagefindSearchResponse | null>;
}

interface SiteSearchAuxiliaryData {
  group: string;
  excerpt: string;
}

export interface SiteSearchItem
  extends SearchableItem<SiteSearchAuxiliaryData> {}

interface PagefindSearchControllerOptions {
  loadPagefind(): Promise<PagefindRuntime>;
  onAvailabilityChange(isUnavailable: boolean): void;
}

export interface PagefindSearchController {
  prepare(): Promise<void>;
  source: SearchSource<SiteSearchItem>;
}

export function createPagefindSearchController({
  loadPagefind,
  onAvailabilityChange,
}: PagefindSearchControllerOptions): PagefindSearchController {
  let generation = 0;
  let preparePromise: Promise<void> | null = null;
  const resultDataCache = new Map<string, Promise<PagefindResultData>>();

  const prepare = () => {
    if (!preparePromise) {
      preparePromise = loadPagefind()
        .then((pagefind) => pagefind.init())
        .catch(() => {
          preparePromise = null;
        });
    }

    return preparePromise;
  };

  const loadResultData = (
    query: string,
    result: PagefindSearchResult,
  ): Promise<PagefindResultData> => {
    const cacheKey = `${query.toLocaleLowerCase()}\u0000${result.id}`;
    const cached = resultDataCache.get(cacheKey);
    if (cached) return cached;

    if (resultDataCache.size >= RESULT_DATA_CACHE_LIMIT) {
      const oldestKey = resultDataCache.keys().next().value;
      if (oldestKey) resultDataCache.delete(oldestKey);
    }

    const resultData = result.data().catch((error) => {
      resultDataCache.delete(cacheKey);
      throw error;
    });
    resultDataCache.set(cacheKey, resultData);
    return resultData;
  };

  const source: SearchSource<SiteSearchItem> = {
    bootstrap: () => [],
    cancel() {
      generation += 1;
    },
    async search(query) {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return [];

      const requestGeneration = ++generation;

      try {
        const pagefind = await loadPagefind();
        const response = await pagefind.debouncedSearch(
          trimmedQuery,
          {},
          PAGEFIND_DEBOUNCE_MS,
        );

        if (!response || requestGeneration !== generation) return [];

        const results = await Promise.all(
          response.results
            .slice(0, PAGEFIND_RESULT_LIMIT)
            .map((result) => loadResultData(trimmedQuery, result)),
        );

        if (requestGeneration !== generation) return [];

        onAvailabilityChange(false);
        return results.map((result) => ({
          id: result.url,
          label: result.meta.title || result.url,
          auxiliaryData: {
            group: result.meta.section || 'Page',
            excerpt: result.plain_excerpt,
          },
        }));
      } catch {
        if (requestGeneration === generation) {
          onAvailabilityChange(true);
        }
        return [];
      }
    },
  };

  return { prepare, source };
}
