import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout, PublicLayout } from "./layouts";
import { AdminGuard } from "./components/AdminGuard";
import { Dashboard } from "@/pages";
import { store, persistor } from "./redux/store";

const Login = lazy(() => import("@/pages/Login/Login"));

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading persisted state...</div>} persistor={persistor}>
        <Toaster
          position="bottom-right"
          richColors
          expand={true}
          duration={3000}
          closeButton={true}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              {/* Rutas Públicas */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Login />} />
              </Route>

              {/* Rutas Protegidas */}
              <Route element={<AdminGuard />}>
                <Route element={<AdminLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Route>

              {/* Fallback para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </PersistGate>
    </Provider>
  );
}

export default App;
