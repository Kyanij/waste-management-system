import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ManageStudents } from '../components/ManageStudents/ManageStudents';
import type { Route } from "./+types/manage-student";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EcoCampus - Manage Students" },
    { name: "description", content: "Manage student records for recycling program" },
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

export default function ManageStudentRoute() {
  return (
    <ProtectedRoute>
      <ManageStudents />
    </ProtectedRoute>
  );
}