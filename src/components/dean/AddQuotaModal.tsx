import React, { useState } from 'react';
import { 
  Award, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  BookOpen, 
  Users, 
  TrendingUp,
  Percent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddQuotaModal: React.FC<AddQuotaModalProps> = ({ isOpen, onClose }) => {
  const { addGrantQuota, groups, platformSettings } = useApp();

  const [title, setTitle] = useState('');
  const [quotaType, setQuotaType] = useState('Davlat granti');
  const [direction, setDirection] = useState("Barcha yo'nalishlar");
  const [course, setCourse] = useState<number | 'all'>('all');
  const [totalSeats, setTotalSeats] = useState<number>(10);
  const [minGpa, setMinGpa] = useState<number>(4.20);
  const [minAttendanceRate, setMinAttendanceRate] = useState<number>(95);
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const uniqueDirections = Array.from(new Set(groups.map(g => g.direction)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg("Iltimos, kvota nomini kiriting.");
      return;
    }

    if (totalSeats <= 0) {
      setErrorMsg("Ajratilgan o'rinlar soni kamida 1 bo'lishi kerak.");
      return;
    }

    addGrantQuota({
      title: title.trim(),
      quotaType,
      direction,
      course,
      totalSeats: Number(totalSeats),
      minGpa: Number(minGpa),
      minAttendanceRate: Number(minAttendanceRate),
      academicYear: platformSettings.currentAcademicYear,
      semester: platformSettings.currentSemester,
      description: description.trim() || undefined
    });

    setSuccessMsg("Yangi kvota muvaffaqiyatli ro'yxatga olindi!");
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Yangi Kvota Qo'shish
              </h3>
              <p className="text-xs text-slate-500">
                Grant, nomdor stipendiya yoki rag'batlantirish o'rinlarini belgilash
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="my-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="my-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Kvota Nomi:
            </label>
            <input
              type="text"
              placeholder="Masalan: 2024-2025 o'quv yili Davlat granti asosiy kvotasi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Kvota Turi:
              </label>
              <select
                value={quotaType}
                onChange={(e) => setQuotaType(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Davlat granti">Davlat granti (Asosiy)</option>
                <option value="Nomdor stipendiya">Nomdor stipendiya (Ibn Sino, Navoiy, Beruniy)</option>
                <option value="Fakultet maxsus granti">Fakultet maxsus rag'batlantirish granti</option>
                <option value="Ijtimoiy yordam kvotasi">Ijtimoiy himoyaga muhtojlar kvotasi</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Ta'lim Yo'nalishi:
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Barcha yo'nalishlar">Barcha yo'nalishlar uchun umumiy</option>
                {uniqueDirections.map(dir => (
                  <option key={dir} value={dir}>{dir}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Kurs:
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Barcha kurslar</option>
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Ajratilgan O'rinlar (ta):
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Min GPA Talabi:
              </label>
              <input
                type="number"
                step="0.05"
                min={2.0}
                max={5.0}
                value={minGpa}
                onChange={(e) => setMinGpa(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Min Davomat Talabi (%):
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={minAttendanceRate}
                onChange={(e) => setMinAttendanceRate(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                O'quv Davri:
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                {platformSettings.currentAcademicYear} ({platformSettings.currentSemester}-semestr)
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Izoh va Tanlov Mezonlari (Ixtiyoriy):
            </label>
            <textarea
              rows={2}
              placeholder="Kvota ajratish shartlari, qo'shimcha rag'batlantirish yoki maxsus talablar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 transition-all cursor-pointer flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Kvotani Tasdiqlash & Saqlash</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
