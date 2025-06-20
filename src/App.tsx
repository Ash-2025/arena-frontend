import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Games from "./pages/Games";
import GameDataPage from "./pages/GameDataByName";
import Dashboard from "./pages/Dashboard";
import GameDataByDate from "./pages/GameDataByDate";
import { Toaster } from "sonner";
import AuthLayout from "./layouts/AuthLayout";
import { ProtectedRoute } from "./layouts/RouteWrapper";
import { AuthProvider } from "./hooks/UseAuth";

import  Play  from "./pages/Play";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute> <AppLayout /> </ProtectedRoute>,
      children: [
        {
          path: "/games",
          element: <Games />
        },
        {
          path: "/:game_name",
          element: <GameDataPage />
        },
        {
          path: "/dashboard",
          element: 
            <Dashboard />
        },
        {
          path: "/games/:date",
          element: <GameDataByDate />
        },
        {
          path:"/game-details",
          element: <Play />
        }
      ]
    },
    {
      path: "/auth",
      element: <AuthLayout />
    },
    {
      path: "*",
      element: <h1>404</h1>
    }
  ])
  const QClient = new QueryClient();
  return (
    <QueryClientProvider client={QClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
