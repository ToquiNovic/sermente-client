import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { AdminPanelLayout, PublicLayout } from "./layouts";
import { AdminGuard } from "./components/AdminGuard";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Dashboard,
  CreateCategory,
  UserPage,
  RolePage,
  SurveysPage,
  CreateSurveyPage,
  ComingSoon,
  SurveyManagerPage,
  CompanyPage,
  CreateCompany,
  CompanyManage,
  RespondentPage
} from "@/pages";
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

  return <App />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TooltipProvider>
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
                  <Route path="/respondent" element={<RespondentPage />} />
                </Route>

                {/* Rutas Protegidas */}
                <Route element={<AdminGuard />}>
                  <Route element={<AdminPanelLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/create-category"
                      element={<CreateCategory />}
                    />
                    <Route
                      path="/create-user"
                      element={<Navigate to="/users" />}
                    />
                    <Route path="/users" element={<UserPage />} />
                    <Route path="/rol" element={<RolePage />} />
                    <Route path="/surveys" element={<SurveysPage />} />
                    <Route path="/surveys/new" element={<CreateSurveyPage />} />
                    <Route path="/commingsoon" element={<ComingSoon />} />
                    <Route
                      path="/surveys/manage/:id"
                      element={<SurveyManagerPage />}
                    />
                    <Route path="/company" element={<CompanyPage />} />
                    <Route path="/company/new" element={<CreateCompany />} />
                    <Route path="/company/manage/:id" element={<CompanyManage />} />
                    
                  </Route>
                </Route>

                {/* Fallback para rutas no encontradas */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </PersistGate>
        </TooltipProvider>
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
