import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTask } from "../api/tasks";
import { Loader } from "../components/Loader";

export function TaskDetails() {
  const { id = "" } = useParams();
  const { data: task, isLoading } = useQuery({ queryKey: ["task", id], queryFn: () => getTask(id), enabled: Boolean(id) });
  if (isLoading) return <Loader />;
  if (!task) return null;

  return (
    <div className="grid max-w-3xl gap-5">
      <div>
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <p className="text-sm text-ink/60">{task.status} · {task.priority}</p>
      </div>
      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="mb-2 font-semibold">Description</h2>
        <p className="whitespace-pre-wrap text-sm text-ink/80">{task.description || "No description."}</p>
      </section>
      <section className="grid gap-3 rounded-lg border border-line bg-white p-5 text-sm">
        <p><strong>Assignee:</strong> {task.assignee?.name || task.assignee_id}</p>
        <p><strong>Due date:</strong> {task.due_date ? new Date(task.due_date).toLocaleString() : "-"}</p>
        <p><strong>Completed:</strong> {task.completed_at ? new Date(task.completed_at).toLocaleString() : "-"}</p>
      </section>
    </div>
  );
}
