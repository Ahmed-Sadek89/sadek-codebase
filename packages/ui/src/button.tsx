import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

export const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        danger:
          "bg-danger text-primary-foreground hover:bg-danger/80 border border-danger",
        "outline-danger":
          "bg-transparent text-danger hover:text-primary-foreground hover:bg-danger border border-danger",
        success:
          "bg-success text-primary-foreground hover:bg-success/80 border border-success",
        warning:
          "bg-warning text-primary-foreground hover:bg-warning/80 border border-warning",
        info: "bg-info text-primary-foreground hover:bg-info/80 border border-info",
        "outline-primary":
          "bg-transparent text-primary hover:text-primary-foreground hover:bg-primary border border-primary",
        "outline-success":
          "bg-transparent text-success hover:text-primary-foreground hover:bg-success border border-success",
        "outline-info":
          "bg-transparent text-info hover:text-primary-foreground hover:bg-info border border-info",
        "outline-warning":
          "bg-transparent text-warning hover:text-primary-foreground hover:bg-warning border border-warning",
        sadek: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
