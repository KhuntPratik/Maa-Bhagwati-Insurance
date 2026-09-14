import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./admin/Home";
import LandingPage from "./LandingPage/LandingPage";
import Dashboard from "./admin/Dashboard";
import AdminLogin from "./admin/AdminLogin";
import Navbar from "./admin/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import Policies from "./admin/Policies";
import Renewals from "./admin/Renewals";

function AppShell() {
  const location = useLocation();
  const isAdminArea = ["/home", "/dashboard", "/policies", "/renewals"].includes(
    location.pathname
  );

  return (
    <>
      {isAdminArea && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policies"
          element={
            <ProtectedRoute>
              <Policies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/renewals"
          element={
            <ProtectedRoute>
              <Renewals />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;