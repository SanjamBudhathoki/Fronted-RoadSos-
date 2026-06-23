import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loginRoutes } from "./routes/login.routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import mainRoutes from "./routes/main.routes.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { syncOfflineSOS } from "./services/offlineSOS.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [...loginRoutes,...mainRoutes],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
        <RouterProvider router={router} />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);