import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        danger: "bg-danger text-primary-foreground hover:bg-danger/80 border border-danger",
        sadek: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  size,
  variant,
  asChild,
  children,
  ...props
}: ButtonProps) {
  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(
        buttonVariants({ variant, size, className }),
        children.props.className,
      ),
    });
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
