import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { RecordWasteCollection } from '../components/WasteCollection/RecordWasteCollection';
import type { Route } from "./+types/waste-collection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EcoCampus - Waste Collection" },
    { name: "description", content: "Record waste collection entries" },
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

export default function RecordWasteRoute() {
  return (
    <ProtectedRoute>
      <RecordWasteCollection />
    </ProtectedRoute>
  );
}
