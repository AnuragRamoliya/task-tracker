import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTasks, updateTaskStatus } from "../api/tasks";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { useAuthStore } from "../store/authStore";
import type { Status, Task } from "../types";
import { canManage } from "../utils/roles";

const statuses: Status[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"];
const allowedTransitions: Record<Status, Status[]> = {
  TODO: ["IN_PROGRESS", "BLOCKED"],
  IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],
  IN_REVIEW: ["DONE", "BLOCKED"],
  BLOCKED: ["TODO", "IN_PROGRESS"],
  DONE: []
};

const statusOptionsFor = (status: Status) => [status, ...allowedTransitions[status]];

export function TaskList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useAuthStore((state) => state.user?.role);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", priority: "" });
  const [selected, setSelected] = useState<Task | null>(null);
  const [nextStatus, setNextStatus] = useState<Status>("IN_PROGRESS");
  const statusOptions = selected ? statusOptionsFor(selected.status) : statuses;
  const { data } = useQuery({ queryKey: ["tasks", filters], queryFn: () => getTasks(filters) });
  const mutation = useMutation({
    mutationFn: () => updateTaskStatus(selected!.id, nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelected(null);
    }
  });

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-ink/60">Filter, assign, and move work through review.</p>
        </div>
        {canManage(role) && (
          <button onClick={() => navigate("/tasks/new")} className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 font-semibold text-white">
            <Plus size={18} /> New task
          </button>
        )}
      </div>
      <div className="grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-4">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
          <option value="">All priorities</option>
          {["LOW", "MEDIUM", "HIGH"].map((priority) => <option key={priority}>{priority}</option>)}
        </select>
      </div>
      <Table
        rows={data?.data || []}
        columns={[
          { header: "Title", cell: (task) => <Link className="font-semibold text-brand" to={`/tasks/${task.id}`}>{task.title}</Link> },
          { header: "Priority", cell: (task) => task.priority },
          { header: "Status", cell: (task) => <button onClick={() => { setSelected(task); setNextStatus(statusOptionsFor(task.status)[0]); }} className="rounded-md bg-mist px-2 py-1">{task.status}</button> },
          { header: "Assignee", cell: (task) => task.assignee?.name || task.assignee_id },
          { header: "Due", cell: (task) => task.due_date ? new Date(task.due_date).toLocaleDateString() : "-" },
          { header: "", cell: (task) => <Link to={`/tasks/${task.id}`} aria-label="View"><Eye size={18} /></Link> }
        ]}
      />
      <div className="flex items-center justify-between">
        <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="rounded-md border border-line bg-white px-3 py-2">Previous</button>
        <span className="text-sm text-ink/60">Page {data?.meta.page || 1} of {data?.meta.totalPages || 1}</span>
        <button disabled={(data?.meta.page || 1) >= (data?.meta.totalPages || 1)} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="rounded-md border border-line bg-white px-3 py-2">Next</button>
      </div>
      <Modal title="Update status" open={Boolean(selected)} onClose={() => setSelected(null)}>
        <div className="grid gap-4">
          <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as Status)}>
            {statusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
          <button onClick={() => mutation.mutate()} className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Update</button>
        </div>
      </Modal>
    </div>
  );
}
