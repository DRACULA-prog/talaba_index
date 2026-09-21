import React, { useState } from 'react';
import { 
  Lock, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle,
  User,
  ShieldAlert,
  UserCheck,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { loginUser, platformSettings } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Foydalanuvchi kiritayotganda qaysi profil ekanligini avtomatik ko'rsatish
  const getDetectedBadge = () => {
    const val = identifier.trim().toLowerCase();
    if (!val) return null;
    if (val.includes('dekan') || val.includes('dean') || val === 'admin') {
      return { title: "Dekanat", color: "bg-purple-50 text-purple-700 border-purple-200", icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> };
    }
    if (val.includes('tutor') || val.includes('tyutor') || val.includes('rustamov') || val.includes('alimov')) {
      return { title: "Tyutor", color: "bg-blue-50 text-blue-700 border-blue-200", icon: <UserCheck className="w-3.5 h-3.5 text-blue-600" /> };
    }
    if (val.startsWith('par_') || val.startsWith('par')) {
      return { title: "Ota-ona", color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Users className="w-3.5 h-3.5 text-amber-600" /> };
    }
    if (val.startsWith('std_') || /^\d{6}$/.test(val)) {
      return { title: "Talaba", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> };
    }
    return null;
  };

  const detectedBadge = getDetectedBadge();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError("Iltimos, login yoki identifikatoringizni kiriting.");
      return;
    }

    const ok = loginUser(trimmedId, password);
    if (!ok) {
      setError("Kiritilgan login yoki parol noto'g'ri. Iltimos, ma'lumotlaringizni tekshirib qaytadan kiriting.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-700 items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          UniGrant GPA Tizimi
        </h1>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          {platformSettings.universityName} • {platformSettings.facultyName}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 rounded-3xl">
          
          <div className="mb-6 text-center">
            <h2 className="text-base font-bold text-slate-900">
              Tizimga Kirish
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Shaxsiy hisobingizga kirish uchun login va parolingizni kiriting
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Login yoki Talaba ID:
                </label>
                {detectedBadge && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${detectedBadge.color}`}>
                    {detectedBadge.icon}
                    <span>{detectedBadge.title}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Login yoki ID raqamingiz"
                  className="w-full text-xs rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                  autoFocus
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Parol:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol"
                  className="w-full text-xs rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Kirish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
