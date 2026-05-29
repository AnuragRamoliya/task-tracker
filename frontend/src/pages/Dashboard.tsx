import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, ListChecks, type LucideIcon } from "lucide-react";
import { getTasks } from "../api/tasks";
import { Loader } from "../components/Loader";

export function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["tasks", "dashboard"], queryFn: () => getTasks({ limit: 100 }) });
  const tasks = data?.data || [];
  const done = tasks.filter((task) => task.status === "DONE").length;
  const blocked = tasks.filter((task) => task.status === "BLOCKED").length;

  if (isLoading) return <Loader />;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-ink/60">Current delivery health and work distribution.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {([
          ["Total tasks", tasks.length, ListChecks],
          ["Completed", done, CheckCircle2],
          ["Blocked", blocked, Clock3]
        ] as Array<[string, number, LucideIcon]>).map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-lg border border-line bg-white p-5">
            <Icon className="mb-3 text-brand" size={24} />
            <p className="text-sm text-ink/60">{String(label)}</p>
            <p className="text-3xl font-bold">{String(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
