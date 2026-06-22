import { cn } from "../../lib/utils.js";

function Card({ children, className }) {
  return (
    <section className={cn("rounded-lg border bg-card text-card-foreground shadow-soft", className)}>
      {children}
    </section>
  );
}

export default Card;
