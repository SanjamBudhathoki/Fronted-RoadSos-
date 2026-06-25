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
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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



/* how to make a react project a working app like i was 
 used to React and make a full application ,'
  now i need a mobile app, how to do it step
  wise step process this is my web app code i */