"use client";
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus-visible:ring-red-500",
        success: "border-green-500 focus-visible:ring-green-500"
      },
      size: {
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Textarea = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };