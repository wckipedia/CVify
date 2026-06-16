import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-[120px] w-full rounded-lg border border-input bg-white/50 px-3.5 py-2.5 text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'transition-all duration-200',
        'hover:border-neutral-700 hover:bg-white/70',
        'focus-visible:border-neutral-800 focus-visible:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-y',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
