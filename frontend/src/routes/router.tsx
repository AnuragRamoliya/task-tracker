import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { ProjectList } from "../pages/ProjectList";
import { Register } from "../pages/Register";
import { TaskDetails } from "../pages/TaskDetails";
import { TaskForm } from "../pages/TaskForm";
import { TaskList } from "../pages/TaskList";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/tasks", element: <TaskList /> },
          { path: "/tasks/new", element: <TaskForm /> },
          { path: "/tasks/:id", element: <TaskDetails /> },
          { path: "/projects", element: <ProjectList /> }
        ]
      }
    ]
  }
]);
