import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-slate-700/60 border-slate-600/60 text-slate-300",
        indigo:
          "bg-indigo-600/20 border-indigo-500/40 text-indigo-300",
        green:
          "bg-green-600/20 border-green-500/40 text-green-300",
        yellow:
          "bg-yellow-600/20 border-yellow-500/40 text-yellow-300",
        red:
          "bg-red-600/20 border-red-500/40 text-red-300",
        blue:
          "bg-blue-600/20 border-blue-500/40 text-blue-300",
        purple:
          "bg-purple-600/20 border-purple-500/40 text-purple-300",
        pink:
          "bg-pink-600/20 border-pink-500/40 text-pink-300",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "green" && "bg-green-400",
            variant === "yellow" && "bg-yellow-400",
            variant === "red" && "bg-red-400",
            variant === "indigo" && "bg-indigo-400",
            variant === "blue" && "bg-blue-400",
            (!variant || variant === "default") && "bg-slate-400"
          )}
        />
      )}
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

// ─── Status badge helper ────────────────────────────────────────────────────

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: BadgeProps["variant"]; dot: boolean }
> = {
  pending: { label: "Pending", variant: "yellow", dot: true },
  parsing: { label: "Parsing", variant: "blue", dot: true },
  generating: { label: "Generating", variant: "indigo", dot: true },
  completed: { label: "Completed", variant: "green", dot: true },
  failed: { label: "Failed", variant: "red", dot: true },
};

export function StatusBadge({
  status,
  size,
}: {
  status: ProjectStatus;
  size?: BadgeProps["size"];
}) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size} dot={config.dot}>
      {config.label}
    </Badge>
  );
}

export { Badge, badgeVariants };
export default Badge;
