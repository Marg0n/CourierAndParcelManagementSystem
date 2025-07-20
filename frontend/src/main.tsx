import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import Router from "./routes/Router.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={Router} />
    <Toaster richColors closeButton position="top-center"  />
  </StrictMode>,
);
