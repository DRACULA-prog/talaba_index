import React, { useState } from 'react';
import { 
  Lock, 
  GraduationCap, 
  UserCheck, 
  ShieldAlert, 
  Users, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, loginUser, students } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginUser(identifier, password, selectedRole);
    if (success) {
      onClose();
    } else {
      setError("Login yoki parol noto'g'ri. Iltimos qayta tekshiring yoki pastdagi namunaviy akkauntdan foydalaning.");
    }
  };

  const handleQuickDemo = (role: UserRole, studentId?: string) => {
    switchRole(role, studentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                UniGrant Tizimiga Kirish
              </h3>
              <p className="text-xs text-slate-500">
                Rolingiz bo'yicha tizimga kiring
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
            &times;
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mt-4 text-xs font-semibold">
          <button
            onClick={() => { setSelectedRole('student'); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              selectedRole === 'student' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Talaba
          </button>
          <button
            onClick={() => { setSelectedRole('tutor'); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              selectedRole === 'tutor' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Tyutor
          </button>
          <button
            onClick={() => { setSelectedRole('dean'); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              selectedRole === 'dean' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Dekanat
          </button>
          <button
            onClick={() => { setSelectedRole('parent'); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              selectedRole === 'parent' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Ota-ona
          </button>
        </div>

        {error && (
          <div className="p-3 my-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 mt-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {selectedRole === 'parent' ? "Ota-ona Maxsus Kodi yoki Talaba ID:" : "Login yoki Talaba ID:"}
            </label>
            <input
              type="text"
              placeholder={
                selectedRole === 'parent' 
                  ? "Masalan: PAR_77101 yoki 210101" 
                  : selectedRole === 'student'
                  ? "Masalan: std_210101 yoki 210101"
                  : "Loginni kiriting"
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              required
            />
          </div>

          {selectedRole !== 'parent' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Parol:
              </label>
              <input
                type="password"
                placeholder="Parolingizni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <span>Tizimga Kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Profile Switcher for Evaluation */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Sinov uchun tayyor namunaviy profillar (1-bosishda kirish):
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleQuickDemo('student', '210101')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 block">Mirzayev Bobur (Talaba)</span>
                <span className="text-[11px] text-slate-500">GPA: 4.88 • IELTS 8.0 • 1-o'rin</span>
              </div>
              <span className="text-xs font-semibold text-indigo-600">Kirish &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickDemo('student', '210102')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 block">Karimova Rayhona (Talaba)</span>
                <span className="text-[11px] text-slate-500">GPA: 4.88 • Scopus maqola • Tenglik holati</span>
              </div>
              <span className="text-xs font-semibold text-indigo-600">Kirish &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickDemo('tutor')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 block">Dots. Rustamov Alisher (Tyutor)</span>
                <span className="text-[11px] text-slate-500">XLSX yuklash & Yutuqlarni tasdiqlash markazi</span>
              </div>
              <span className="text-xs font-semibold text-blue-600">Kirish &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickDemo('dean')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200/80 transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 block">Prof. Usmonov Bahodir (Dekan)</span>
                <span className="text-[11px] text-slate-500">2 haftalik reyting darchasi & Grant taqsimoti</span>
              </div>
              <span className="text-xs font-semibold text-purple-600">Kirish &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickDemo('parent', '210101')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 block">Bobur Mirzayevning Ota-onasi</span>
                <span className="text-[11px] text-slate-500">Kod: PAR_77101 • Farzand monitoringi</span>
              </div>
              <span className="text-xs font-semibold text-amber-600">Kirish &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
