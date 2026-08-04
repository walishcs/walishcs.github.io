import { Link } from '@astryxdesign/core/Link';
import { Pagination } from '@astryxdesign/core/Pagination';
import { useState } from 'react';
import { paginateItems } from '@/lib/collection-utils';
import { formatDate } from '@/lib/format';

const PAGE_SIZE = 5;

export interface NewsFeedItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url?: string | null;
}

export function NewsFeed({ items }: { items: NewsFeedItem[] }) {
  const [page, setPage] = useState(1);
  const visibleItems = paginateItems(items, page, PAGE_SIZE);

  return (
    <section className="news-feed" aria-label="News updates">
      <ul className="news-list" aria-live="polite">
        {visibleItems.map((item) => (
          <li className="news-item" key={item.id}>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <article className="news-copy">
              <h3>
                {item.url ? (
                  <Link
                    className="site-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                    hasUnderline
                  >
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              {item.summary ? <p>{item.summary}</p> : null}
            </article>
          </li>
        ))}
      </ul>
      {items.length > PAGE_SIZE ? (
        <footer className="news-pagination">
          <Pagination
            page={page}
            onChange={setPage}
            totalItems={items.length}
            pageSize={PAGE_SIZE}
            variant="pages"
            size="sm"
            label="News pagination"
          />
        </footer>
      ) : null}
    </section>
  );
}
