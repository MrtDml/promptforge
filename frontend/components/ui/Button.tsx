import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white focus-visible:ring-indigo-500",
        secondary:
          "bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 focus-visible:ring-slate-500",
        ghost:
          "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100 focus-visible:ring-slate-500",
        danger:
          "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white focus-visible:ring-red-500",
        outline:
          "bg-transparent border border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-slate-300 hover:text-white focus-visible:ring-slate-500",
        success:
          "bg-green-600 hover:bg-green-500 active:bg-green-700 text-white focus-visible:ring-green-500",
      },
      size: {
        sm: "text-xs px-3 py-1.5 rounded-md",
        md: "text-sm px-4 py-2.5 rounded-lg",
        lg: "text-base px-6 py-3 rounded-lg",
        xl: "text-base px-8 py-4 rounded-xl",
        icon: "p-2 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, loadingText, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
