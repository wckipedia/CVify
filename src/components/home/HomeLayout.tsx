import { type MouseEvent } from 'react';
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
  return (
    <GlassPanel
      as="nav"
      className="grid w-full grid-cols-[1fr_auto_1fr] items-center px-5 py-3"
    >
      <Link
        to="/"
        className="justify-self-start text-lg font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-70"
      >
        CVify
      </Link>
      <div className="flex items-center gap-1">
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
      <div aria-hidden="true" className="justify-self-end" />
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
