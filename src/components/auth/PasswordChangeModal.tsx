import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updatePassword } = useApp();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Yangi kiritilgan parollar bir-biriga mos kelmadi!");
      return;
    }

    const res = updatePassword(currentUser.studentId || currentUser.id, newPassword);
    if (res) {
      setSuccess("Parolingiz muvaffaqiyatli o'zgartirildi!");
      setTimeout(() => {
        onClose();
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 1500);
    } else {
      setError("Parolni yangilashda xatolik yuz berdi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Shaxsiy Parolni O'zgartirish
              </h3>
              <p className="text-xs text-slate-500">
                Kabinet xavfsizligini ta'minlash
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            &times;
          </button>
        </div>

        {error && (
          <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Joriy Parol:
            </label>
            <input
              type="password"
              placeholder="Joriy parolingizni kiriting"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Yangi Parol:
            </label>
            <input
              type="password"
              placeholder="Kamida 6 ta belgi"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Yangi Parolni Takrorlang:
            </label>
            <input
              type="password"
              placeholder="Yangi parolni qayta kiriting"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
