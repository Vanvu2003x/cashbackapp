import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow-xs hover:bg-blue-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200",
        destructive:
          "border-transparent bg-red-500 text-white shadow-xs hover:bg-red-600",
        outline: "text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700",
        success: "border-transparent bg-emerald-500/15 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        warning: "border-transparent bg-amber-500/15 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        shopee: "border-transparent bg-orange-500 text-white shadow-xs",
        tiktok: "border-transparent bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900",
        lazada: "border-transparent bg-blue-700 text-white shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
