import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldAlert, 
  Users, 
  KeyRound, 
  LogOut, 
  Clock, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenPasswordModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPasswordModal }) => {
  const { currentUser, platformSettings, resetAllData, logout } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentUser) return null;

  const roleLabels: Record<UserRole, { title: string; color: string; icon: React.ReactNode }> = {
    student: {
      title: "Talaba Kabineti",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />
    },
    tutor: {
      title: "Tyutor Kabineti",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <UserCheck className="w-4 h-4 text-blue-600" />
    },
    dean: {
      title: "Dekanat (Boshqaruv)",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <ShieldAlert className="w-4 h-4 text-purple-600" />
    },
    parent: {
      title: "Ota-ona Portali",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Users className="w-4 h-4 text-amber-600" />
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-2xs">
      {/* Top Banner: Status */}
      <div className={`px-4 py-1 text-xs font-medium transition-colors flex items-center justify-between ${
        platformSettings.isRatingWindowOpen 
          ? 'bg-emerald-600 text-white' 
          : 'bg-slate-800 text-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                platformSettings.isRatingWindowOpen ? 'bg-emerald-200' : 'bg-slate-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                platformSettings.isRatingWindowOpen ? 'bg-emerald-100' : 'bg-slate-400'
              }`}></span>
            </span>
            <span className="text-[11px]">
              {platformSettings.isRatingWindowOpen ? (
                <>
                  <strong>FAOL DAVR:</strong> Semestr yakuniy ochiq Grant reytingi faollashtirilgan
                </>
              ) : (
                <>
                  Odatiy o'quv davri • Ochiq reyting darchasi semestr yakunida ochiladi
                </>
              )}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] opacity-90">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {platformSettings.currentAcademicYear} • {platformSettings.currentSemester}-semestr
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          
          {/* Logo & Faculty name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-slate-900 tracking-tight">
                  UniGrant <span className="text-indigo-600">GPA</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {platformSettings.universityName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-xs md:max-w-md">
                {platformSettings.facultyName}
              </p>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            {/* Active Role Tag */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleLabels[currentUser.role].color}`}>
              {roleLabels[currentUser.role].icon}
              <span>{roleLabels[currentUser.role].title}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
                    {currentUser.fullName.split(' ')[0]} {currentUser.fullName.split(' ')[1]?.[0]}.
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                    {currentUser.group || currentUser.direction || currentUser.username}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Login: {currentUser.username}
                      </p>
                      {currentUser.role === 'student' && currentUser.studentData && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Joriy GPA:</span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {currentUser.studentData.gpa.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'student' && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenPasswordModal();
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                          Parolni o'zgartirish
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm("Barcha ma'lumotlarni boshlang'ich holatga qaytarishni xohlaysizmi?")) {
                            resetAllData();
                            setIsDropdownOpen(false);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        Boshlang'ich holatga qaytarish
                      </button>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Tizimdan chiqish
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Tizimdan chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
