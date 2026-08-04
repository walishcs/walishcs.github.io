import { Button } from '@astryxdesign/core/Button';
import { Link } from '@astryxdesign/core/Link';
import { MobileNav } from '@astryxdesign/core/MobileNav';
import { useState } from 'react';

interface NavigationItem {
  href: string;
  label: string;
  isCurrent: boolean;
}

export function MobileNavigation({ items }: { items: NavigationItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mobile-navigation" aria-label="Mobile navigation">
      <Button
        className="mobile-menu-toggle"
        label={isOpen ? 'Close navigation' : 'Open navigation'}
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
            aria-hidden="true"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        }
        variant="ghost"
        onClick={() => setIsOpen(true)}
        isIconOnly
      />
      <MobileNav
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        header="Navigation"
        side="end"
      >
        <nav aria-label="Mobile primary navigation">
          <ul className="mobile-nav-list">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  className="site-link mobile-nav-link"
                  href={item.href}
                  color="inherit"
                  isStandalone
                  aria-current={item.isCurrent ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </MobileNav>
    </section>
  );
}
