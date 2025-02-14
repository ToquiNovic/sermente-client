import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout, PublicLayout } from "./layouts";
import { AdminGuard } from "./components/AdminGuard";
import { Dashboard, CreateCategory, UserPage, RolePage } from "@/pages";
import { CreateUser } from "@/pages/User";
import { store, persistor } from "./redux/store";
import { Spinner } from "@/components";
import { useCheckBackend } from "@/hooks/useCheckBackend";

const Login = lazy(() => import("@/pages/Login/Login"));

const queryClient = new QueryClient();

function AppWrapper() {
  const { backendReady, loading } = useCheckBackend();

  if (loading) {
    return <Spinner />;
  }

  if (!backendReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">
          El backend no está disponible, por favor intenta más tarde.
        </p>
      </div>
    );
  }

  return (
    <App />
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate
          loading={<div>Loading persisted state...</div>}
          persistor={persistor}
        >
          <Toaster
            position="bottom-right"
            richColors
            expand={true}
            duration={3000}
            closeButton={true}
          />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Rutas Públicas */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Login />} />
              </Route>

              {/* Rutas Protegidas */}
              <Route element={<AdminGuard />}>
                <Route element={<AdminLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-category" element={<CreateCategory />} />
                  <Route
                    path="/create-user"
                    element={
                      <CreateUser
                        onUserCreated={(user) => {
                          console.log("Usuario creado:", user);
                          navigate("/users"); 
                        }}
                      />
                    }
                  />
                  <Route path="/users" element={<UserPage />} />
                  <Route path="/rol" element={<RolePage />} />
                </Route>
              </Route>

              {/* Fallback para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default function MainApp() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
