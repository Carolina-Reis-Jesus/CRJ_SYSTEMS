import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import TicketQueue from "@/pages/TicketQueue";
import CustomerDirectory from "@/pages/CustomerDirectory";
import SecurityAudit from "@/pages/SecurityAudit";

const Protected = ({ children }) => {
  const { user, hydrated } = useAuth();
  if (!hydrated) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Protected>
                <AppShell />
              </Protected>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<TicketQueue />} />
            <Route path="customers" element={<CustomerDirectory />} />
            <Route path="security" element={<SecurityAudit />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
};

export default App;
