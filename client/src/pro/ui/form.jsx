import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/pro/lib/utils';

const field =
  'w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40';

function Input({ className, type, ...props }) {
  return <input type={type} data-slot="input" className={cn(field, 'h-9 py-1', className)} {...props} />;
}

function Textarea({ className, ...props }) {
  return <textarea data-slot="textarea" className={cn(field, 'flex min-h-16 field-sizing-content py-2', className)} {...props} />;
}

function Label({ className, ...props }) {
  return <LabelPrimitive.Root data-slot="label" className={cn('flex select-none items-center gap-2 text-sm font-medium leading-none', className)} {...props} />;
}

function Separator({ className, orientation = 'horizontal', decorative = true, ...props }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn('shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px', className)}
      {...props}
    />
  );
}

export { Input, Textarea, Label, Separator };
