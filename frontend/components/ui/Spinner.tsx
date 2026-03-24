import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "indigo" | "white" | "slate" | "green";
  label?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-9 h-9 border-2",
  xl: "w-14 h-14 border-[3px]",
};

const colorClasses = {
  indigo: "border-indigo-600/30 border-t-indigo-500",
  white: "border-white/30 border-t-white",
  slate: "border-slate-600/40 border-t-slate-300",
  green: "border-green-600/30 border-t-green-500",
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", color = "indigo", label, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("inline-flex flex-col items-center gap-3", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeClasses[size],
          colorClasses[color]
        )}
        aria-label={label ?? "Loading"}
        role="status"
      />
      {label && (
        <span className="text-slate-400 text-sm">{label}</span>
      )}
    </div>
  )
);
Spinner.displayName = "Spinner";

// ─── Full-page spinner ───────────────────────────────────────────────────────

export function PageSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50">
      <Spinner size="xl" color="indigo" label={label} />
    </div>
  );
}

// ─── Inline spinner (for buttons, etc.) ─────────────────────────────────────

export function InlineSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block",
        className
      )}
    />
  );
}

export { Spinner };
export default Spinner;
