import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createProject, getProjects } from "../api/projects";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { useAuthStore } from "../store/authStore";
import { canManage } from "../utils/roles";

export function ProjectList() {
  const role = useAuthStore((state) => state.user?.role);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const { data = [] } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const mutation = useMutation({
    mutationFn: () => createProject(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setForm({ name: "", description: "" });
    }
  });

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {canManage(role) && <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 font-semibold text-white"><Plus size={18} /> New project</button>}
      </div>
      <Table rows={data} columns={[{ header: "Name", cell: (project) => <span className="font-semibold">{project.name}</span> }, { header: "Description", cell: (project) => project.description || "-" }]} />
      <Modal title="Create project" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} className="grid gap-4">
          <FormField label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Description"><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <button className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Create</button>
        </form>
      </Modal>
    </div>
  );
}
