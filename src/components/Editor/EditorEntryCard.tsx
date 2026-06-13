import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { editorEntryCardShell } from '../GlassPanel';

interface EditorEntryCardProps {
  children: ReactNode;
  position: number;
  actions?: ReactNode;
}

export function EditorEntryCard({
  children,
  position,
  actions,
}: EditorEntryCardProps) {
  return (
    <div className={cn(editorEntryCardShell, 'overflow-hidden')}>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className="inline-flex size-6 items-center justify-center rounded-md border border-neutral-600/70 bg-white/50 text-xs font-medium text-neutral-600"
            aria-label={`Entry ${position}`}
          >
            {position}
          </span>
          {actions ? <div className="flex items-center">{actions}</div> : null}
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}
