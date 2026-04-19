import { useState, useCallback } from 'react';
import type { Route } from "./+types/home";
import { I18nProvider } from '../lib/i18n';
import type { Student } from '../types';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { StudentDetails, EmptyState } from '../components/StudentDetails';
import '../styles/globals.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Recycling Reward System" },
    { name: "description", content: "Track student recycling rewards and collections" },
  ];
}

export default function Home() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSelectStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  return (
    <I18nProvider>
      <div className="app">
        <Header />
        <div className="app-layout">
          <Sidebar selectedStudent={selectedStudent} onSelectStudent={handleSelectStudent} />
          <main className="main-content">
            {selectedStudent ? (
              <StudentDetails student={selectedStudent} />
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </I18nProvider>
  );
}