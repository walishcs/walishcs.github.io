import { describe, expect, it, vi } from 'vitest';
import {
  createPagefindSearchController,
  PAGEFIND_DEBOUNCE_MS,
  PAGEFIND_RESULT_LIMIT,
  type PagefindRuntime,
  type PagefindSearchResult,
} from './pagefind-search';

const makeResult = (id: string): PagefindSearchResult => ({
  id,
  data: vi.fn(async () => ({
    url: `/${id}/`,
    plain_excerpt: `${id} excerpt`,
    meta: { section: 'Publication', title: `${id} title` },
  })),
});

describe('Pagefind search controller', () => {
  it('prepares the Pagefind runtime only once', async () => {
    const runtime = {
      init: vi.fn(async () => undefined),
      debouncedSearch: vi.fn(),
    } as unknown as PagefindRuntime;
    const loadPagefind = vi.fn(async () => runtime);
    const controller = createPagefindSearchController({
      loadPagefind,
      onAvailabilityChange: vi.fn(),
    });

    await Promise.all([controller.prepare(), controller.prepare()]);

    expect(loadPagefind).toHaveBeenCalledTimes(1);
    expect(runtime.init).toHaveBeenCalledTimes(1);
  });

  it('debounces for 200ms and loads only the first six results', async () => {
    const results = Array.from({ length: 8 }, (_, index) =>
      makeResult(`result-${index + 1}`),
    );
    const runtime = {
      init: vi.fn(async () => undefined),
      debouncedSearch: vi.fn(async () => ({ results })),
    } satisfies PagefindRuntime;
    const onAvailabilityChange = vi.fn();
    const controller = createPagefindSearchController({
      loadPagefind: async () => runtime,
      onAvailabilityChange,
    });

    const items = await controller.source.search('  Seediq  ');

    expect(runtime.debouncedSearch).toHaveBeenCalledWith(
      'Seediq',
      {},
      PAGEFIND_DEBOUNCE_MS,
    );
    expect(items).toHaveLength(PAGEFIND_RESULT_LIMIT);
    expect(
      results
        .slice(0, PAGEFIND_RESULT_LIMIT)
        .map((result) => vi.mocked(result.data).mock.calls.length),
    ).toEqual(Array(PAGEFIND_RESULT_LIMIT).fill(1));
    expect(results.at(-1)?.data).not.toHaveBeenCalled();
    expect(onAvailabilityChange).toHaveBeenCalledWith(false);
  });

  it('reuses result data only for the same query', async () => {
    const result = makeResult('shared');
    const runtime = {
      init: vi.fn(async () => undefined),
      debouncedSearch: vi.fn(async () => ({ results: [result] })),
    } satisfies PagefindRuntime;
    const controller = createPagefindSearchController({
      loadPagefind: async () => runtime,
      onAvailabilityChange: vi.fn(),
    });

    await controller.source.search('Seediq');
    await controller.source.search('Seediq');
    await controller.source.search('Atayal');

    expect(result.data).toHaveBeenCalledTimes(2);
  });

  it('ignores a debounced search superseded by a newer query', async () => {
    const runtime = {
      init: vi.fn(async () => undefined),
      debouncedSearch: vi.fn(async () => null),
    } satisfies PagefindRuntime;
    const onAvailabilityChange = vi.fn();
    const controller = createPagefindSearchController({
      loadPagefind: async () => runtime,
      onAvailabilityChange,
    });

    await expect(controller.source.search('seed')).resolves.toEqual([]);
    expect(onAvailabilityChange).not.toHaveBeenCalled();
  });
});
