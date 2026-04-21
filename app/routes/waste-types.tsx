import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { WasteTypes } from '../components/WasteTypes/WasteTypes';
import type { Route } from "./+types/waste-types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EcoCampus - Waste Types" },
    { name: "description", content: "Manage waste types and pricing" },
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

  return children;
}

export default function WasteTypesPage() {
  return (
    <ProtectedRoute>
      <WasteTypes />
    </ProtectedRoute>
  );
}