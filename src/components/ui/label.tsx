import * as LabelPrimitive from '@radix-ui/react-label';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
