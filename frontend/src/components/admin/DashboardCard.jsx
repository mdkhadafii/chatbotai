import Card from "../ui/Card.jsx";

const toneClasses = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-primary/10 text-primary dark:bg-primary/20",
  success: "bg-success/15 text-success dark:bg-success/20",
  warning: "bg-warning/15 text-warning dark:bg-warning/20",
  danger: "bg-destructive/15 text-destructive dark:bg-destructive/20",
};

function DashboardCard({ icon, label, value, description, tone = "neutral" }) {
  return (
    <Card className="grid gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon ? (
          <span className={`grid h-9 w-9 place-items-center rounded-md ${toneClasses[tone] || toneClasses.neutral}`}>
            {icon}
          </span>
        ) : null}
      </div>
      <div>
        <strong className="text-3xl font-semibold tracking-normal">{value}</strong>
        {description ? <p className="mt-1 mb-0 text-xs text-muted-foreground">{description}</p> : null}
      </div>
    </Card>
  );
}

export default DashboardCard;
