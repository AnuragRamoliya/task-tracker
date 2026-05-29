import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/projects";
import { createTask } from "../api/tasks";
import { getUsers } from "../api/users";
import { FormField } from "../components/FormField";

export function TaskForm() {
  const navigate = useNavigate();
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM", project_id: "", assignee_id: "", due_date: "" });
  const mutation = useMutation({
    mutationFn: () => createTask({ ...form, project_id: Number(form.project_id), assignee_id: Number(form.assignee_id), due_date: new Date(form.due_date).toISOString() }),
    onSuccess: () => navigate("/tasks")
  });

  return (
    <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} className="grid max-w-2xl gap-4">
      <h1 className="text-2xl font-bold">Create task</h1>
      <FormField label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
      <FormField label="Description"><textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Project"><select required value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}><option value="">Select project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></FormField>
        <FormField label="Assignee"><select required value={form.assignee_id} onChange={(e) => setForm({ ...form, assignee_id: e.target.value })}><option value="">Select assignee</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></FormField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Priority"><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{["LOW", "MEDIUM", "HIGH"].map((priority) => <option key={priority}>{priority}</option>)}</select></FormField>
        <FormField label="Due date"><input required type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></FormField>
      </div>
      <button className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Save task</button>
    </form>
  );
}
