import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/AdminDashboard/AdminDashboard';
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EcoCampus Dashboard - Waste Management Analytics" },
    { name: "description", content: "Admin dashboard for waste management and recycling analytics" },
  ];
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/ecologin', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}