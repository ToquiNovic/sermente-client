// App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { AdminLayout, PublicLayout } from "./layouts";
import { AdminGuard } from "./components/AdminGuard";
import { Dashboard } from "@/pages";
import { store } from "@/redux/store";

const Login = lazy(() => import("@/pages/Login/Login"));

function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Login />} />
            </Route>
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </Provider>
  );
}

export default App;
