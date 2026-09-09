import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./admin/Home";
import LandingPage from "./LandingPage/LandingPage";
import Dashboard from "./admin/Dashboard";
import AdminLogin from "./admin/AdminLogin";
import Navbar from "./admin/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import Policies from "./admin/Policies";

function AppShell() {
  const location = useLocation();
  const isAdminArea = ["/home", "/dashboard", "/policies"].includes(
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