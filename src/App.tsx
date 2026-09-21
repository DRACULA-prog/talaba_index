import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TutorDashboard } from './components/tutor/TutorDashboard';
import { DeanDashboard } from './components/dean/DeanDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { PasswordChangeModal } from './components/auth/PasswordChangeModal';
import { LoginView } from './components/auth/LoginView';
import { GraduationCap, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, platformSettings } = useApp();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // If user is not logged in, enforce login via credentials only
  if (!currentUser || currentUser.isLoggedIn === false) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser.role === 'student' && (
          <StudentDashboard onOpenPasswordModal={() => setIsPasswordModalOpen(true)} />
        )}

        {currentUser.role === 'tutor' && (
          <TutorDashboard />
        )}

        {currentUser.role === 'dean' && (
          <DeanDashboard />
        )}

        {currentUser.role === 'parent' && (
          <ParentDashboard />
        )}
      </main>

      {/* Modals */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* University Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">
              {platformSettings.universityName} • {platformSettings.facultyName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Oliy Ta'lim, Fan va Innovatsiyalar Vazirligi Me'yorlari
            </span>
            <span>•</span>
            <span>UniGrant GPA Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
