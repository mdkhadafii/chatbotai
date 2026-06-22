import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      tone: {
        neutral: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-success/15 text-success dark:bg-success/20",
        warning: "border-transparent bg-warning/15 text-warning dark:bg-warning/20",
        danger: "border-transparent bg-destructive/15 text-destructive dark:bg-destructive/20",
        info: "border-transparent bg-primary/10 text-primary dark:bg-primary/20",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

function Badge({ children, tone, className }) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}

export default Badge;
