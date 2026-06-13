import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'border border-neutral-900 bg-neutral-900 text-white shadow-sm hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md active:translate-y-0 active:scale-[0.98]',
        secondary:
          'border border-neutral-600 bg-white/50 text-neutral-800 shadow-sm hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-white/80 hover:shadow-md active:translate-y-0 active:scale-[0.98]',
        destructive:
          'border border-red-400 bg-white/50 text-red-600 shadow-sm hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-50 hover:shadow-md active:translate-y-0 active:scale-[0.98]',
        ghost:
          'border border-transparent text-neutral-600 hover:-translate-y-0.5 hover:border-neutral-500 hover:bg-white/60 hover:text-neutral-900 hover:shadow-sm active:translate-y-0 active:scale-[0.98]',
        outline:
          'border border-neutral-600 bg-transparent text-neutral-800 hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-white/60 hover:shadow-sm active:translate-y-0 active:scale-[0.98]',
        link: 'border-transparent text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-base',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
