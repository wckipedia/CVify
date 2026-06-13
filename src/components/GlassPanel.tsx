import type { ReactNode } from 'react';

const glassBase =
  'bg-white/60 backdrop-blur-[14px] border border-neutral-600 ' +
  'shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'nav' | 'section';
}

export function GlassPanel({
  children,
  className = '',
  as: Tag = 'div',
}: GlassPanelProps) {
  return (
    <Tag className={`${glassBase} rounded-2xl ${className}`}>{children}</Tag>
  );
}

export const editorEntryCardShell =
  'overflow-hidden rounded-xl border bg-white/40 border-neutral-600';

export const glassCardClass =
  'bg-white/60 backdrop-blur-[14px] border border-neutral-600 ' +
  'shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]';
