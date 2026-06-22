import { cn } from "../../lib/utils.js";

function Select({ label, children, className, error, ...props }) {
  return (
    <label className={cn("grid gap-2", className)}>
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-sm text-destructive">{error}</span> : null}
    </label>
  );
}

export default Select;
