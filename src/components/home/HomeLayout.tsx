import { Menu, X } from 'lucide-react';
import { type MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GlassPanel } from '../GlassPanel';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

function scrollToSection(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
): void {
  event.preventDefault();
  const id = href.slice(1);
  const section = document.getElementById(id);
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.pushState(null, '', href);
}

export function HomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <GlassPanel as="nav" className="px-4 py-3 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-70"
          onClick={() => setMenuOpen(false)}
        >
          CVify.
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <a
                href={link.href}
                onClick={(event) => scrollToSection(event, link.href)}
              >
                {link.label}
              </a>
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {menuOpen && (
        <div className="mt-3 flex flex-col gap-1 border-t border-neutral-600/40 pt-3 md:hidden">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              className="justify-start"
              asChild
            >
              <a
                href={link.href}
                onClick={(event) => {
                  scrollToSection(event, link.href);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            </Button>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="mb-3 block text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
      {children}
    </Label>
  );
}

export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 text-center">
      <SectionLabel>{subtitle}</SectionLabel>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
