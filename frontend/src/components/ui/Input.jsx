import { cn } from "../../lib/utils.js";

function Input({ label, className, error, ...props }) {
  return (
    <label className={cn("grid gap-2", className)}>
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      {error ? <span className="text-sm text-destructive">{error}</span> : null}
    </label>
  );
}

export default Input;
