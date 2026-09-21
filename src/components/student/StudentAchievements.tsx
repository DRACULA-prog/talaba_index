import React, { useState } from 'react';
import { 
  Award, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Sparkles, 
  Plus, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Student, Achievement, AchievementCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentAchievementsProps {
  student: Student;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({ student }) => {
  const { submitAchievement } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AchievementCategory>('xalqaro_sertifikat');
  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      setErrorMsg("Iltimos, yutuq nomi va batafsil izohni to'liq kiriting!");
      return;
    }

    submitAchievement(student.studentId, {
      title: title.trim(),
      category,
      studentComment: comment.trim(),
      fileName: fileName || "sertifikat_hujjat.pdf",
      fileSize: fileSize || "1.5 MB"
    });

    setSuccessMsg("Yutuq muvaffaqiyatli yuklandi! Tyutoringiz ko'rib chiqib tasdiqlaganidan so'ng reytingga hisoblanadi.");
    setTitle('');
    setComment('');
    setFileName('');
    setErrorMsg('');
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMsg('');
    }, 1800);
  };

  const categoryLabels: Record<AchievementCategory, string> = {
    xalqaro_sertifikat: "Xalqaro Til / IT Sertifikati (IELTS, TOEFL, AWS, Oracle...)",
    respublika_olimpiada: "Respublika yoki Xalqaro Fan Olimpiadasi",
    ilmiy_maqola: "Xalqaro / Scopus / OAK Ilmiy Maqolasi",
    tavsiyanoma: "Kafedra yoki Korxona Tavsiyanomasi",
    sport_jamoatchilik: "Sport va Jamoat Ishlari Diplomi"
  };

  return (
    <div className="space-y-6">
      {/* Top action and info card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">
            Mening Yutuqlarim va Sertifikatlarim
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Grant tanlovida GPA ko'rsatkichlari mutlaqo teng bo'lib qolgan holatlarda siz yuklagan 
            va biriktirilgan tyutor tomonidan tasdiqlangan hujjatlar hal qiluvchi ustunlik beradi.
          </p>
        </div>

        <button
          onClick={() => { setIsModalOpen(true); setErrorMsg(''); setSuccessMsg(''); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yangi Sertifikat / Yutuq yuklash
        </button>
      </div>

      {/* Achievement list */}
      {student.achievements.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm mb-1">
            Hozircha yutuqlar yuklanmagan
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Xalqaro til sertifikatlari, olimpiada diplomlari yoki ilmiy maqolalaringizni yuklang. 
            Tyutor ularni tekshirib tasdiqlaydi.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold"
          >
            <Upload className="w-4 h-4" />
            Birinchi yutuqni yuklash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.achievements.map((ach) => (
            <div 
              key={ach.id} 
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      {categoryLabels[ach.category]?.split('(')[0] || "Yutuq"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {ach.status === 'tasdiqlandi' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Tasdiqlandi (+{ach.bonusPoints} ball)
                    </span>
                  ) : ach.status === 'rad_etildi' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Rad etildi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Tekshirilmoqda
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  {ach.title}
                </h4>

                {/* Student's explanation note */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 mb-3 border border-slate-100">
                  <p className="font-semibold text-slate-500 text-[10px] uppercase mb-0.5">
                    Sizning izohingiz:
                  </p>
                  <p className="italic">"{ach.studentComment}"</p>
                </div>

                {/* Attached file row */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="flex items-center gap-1 font-mono text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {ach.fileName || "hujjat.pdf"}
                  </span>
                  <span>{ach.fileSize || "1.2 MB"}</span>
                </div>
              </div>

              {/* Reviewer feedback block */}
              {ach.reviewComment && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900">
                    <p className="font-semibold text-[10px] text-blue-700 uppercase">
                      Tyutor xulosasi ({ach.reviewedBy}):
                    </p>
                    <p className="mt-0.5 text-xs">{ach.reviewComment}</p>
                    <p className="text-[10px] text-blue-500 mt-1">Sana: {ach.dateReviewed}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Upload className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Yangi Yutuq yoki Sertifikat Yuklash
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fayl yuklang va tyutor uchun batafsil izoh yozing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategoriya
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AchievementCategory)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="xalqaro_sertifikat">Xalqaro Til / IT Sertifikati (IELTS, TOEFL, AWS...)</option>
                  <option value="respublika_olimpiada">Respublika yoki Xalqaro Fan Olimpiadasi</option>
                  <option value="ilmiy_maqola">Ilmiy Maqola (Scopus, Web of Science, OAK)</option>
                  <option value="tavsiyanoma">Kafedra Mudiri yoki Korxona Tavsiyanomasi</option>
                  <option value="sport_jamoatchilik">Sport yoki Madaniy-Ma'rifiy Diplom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yutuq yoki Hujjat Nomi *
                </label>
                <input
                  type="text"
                  placeholder="Masalan: IELTS 7.5 sertifikati yoki ACM ICPC g'olibi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hujjat Fayli (PDF, JPG, PNG)
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 text-center">
                  <input
                    type="file"
                    id="file-upload-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="file-upload-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1"
                  >
                    <Upload className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs text-indigo-600 font-semibold">
                      {fileName ? fileName : "Faylni tanlang yoki shu yerga tashlang"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Maksimal hajm: 10 MB (PDF, JPG, PNG)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tyutor uchun tushunarli izoh *
                </label>
                <textarea
                  rows={3}
                  placeholder="Qachon va qaysi tashkilotdan olinganligi, berilgan sertifikat raqami va maqsadi haqida aniq tushuntirish yozing..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  Yuklash va Tyutorga jo'natish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
