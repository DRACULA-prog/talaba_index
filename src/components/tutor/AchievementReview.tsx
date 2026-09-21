import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Award, 
  Sparkles, 
  AlertCircle,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Achievement, Student } from '../../types';

export const AchievementReview: React.FC = () => {
  const { students, reviewAchievement, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'kutilmoqda' | 'tasdiqlandi' | 'rad_etildi'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected achievement for review modal
  const [activeReviewAch, setActiveReviewAch] = useState<Achievement | null>(null);
  const [bonusPointsInput, setBonusPointsInput] = useState<number>(20);
  const [reviewCommentInput, setReviewCommentInput] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Gather all achievements across students assigned to this tutor / direction
  const allAchievements: Achievement[] = [];
  students.forEach(st => {
    st.achievements.forEach(ach => {
      allAchievements.push(ach);
    });
  });

  const filtered = allAchievements.filter(ach => {
    const matchesStatus = filterStatus === 'all' || ach.status === filterStatus;
    const matchesSearch = ach.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ach.group.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = allAchievements.filter(a => a.status === 'kutilmoqda').length;

  const handleApprove = (ach: Achievement) => {
    setActiveReviewAch(ach);
    // suggest reasonable bonus points based on category
    let suggested = 20;
    if (ach.category === 'xalqaro_sertifikat') suggested = 25;
    else if (ach.category === 'ilmiy_maqola') suggested = 30;
    else if (ach.category === 'respublika_olimpiada') suggested = 25;
    else if (ach.category === 'tavsiyanoma') suggested = 15;
    setBonusPointsInput(suggested);
    setReviewCommentInput(`Hujjat asl nusxasi va reyestr raqami tekshirildi. Talaba foydasiga +${suggested} reyting bonusi biriktirildi.`);
  };

  const handleReject = (ach: Achievement) => {
    setActiveReviewAch(ach);
    setBonusPointsInput(0);
    setReviewCommentInput("Hujjat talab darajasida emas yoki ko'rsatilgan davrga to'g'ri kelmadi.");
  };

  const executeReview = (status: 'tasdiqlandi' | 'rad_etildi') => {
    if (!activeReviewAch) return;

    reviewAchievement(
      activeReviewAch.id,
      status,
      status === 'tasdiqlandi' ? bonusPointsInput : 0,
      reviewCommentInput.trim() || (status === 'tasdiqlandi' ? "Tasdiqlandi" : "Rad etildi"),
      currentUser.fullName
    );

    setActionSuccess(
      status === 'tasdiqlandi' 
        ? `Yutuq tasdiqlandi va talabaga +${bonusPointsInput} ball qo'shildi!` 
        : "Yutuq rad etildi."
    );

    setTimeout(() => {
      setActiveReviewAch(null);
      setActionSuccess('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                Talabalar Yutuq va Sertifikatlarini Ekspertizadan O'tkazish
              </h3>
              <p className="text-xs text-slate-500">
                Talabalar shaxsiy kabinetidan yuklagan hujjatlarni tekshiring va GPA tenglik holatlarida hisoblanuvchi bonus ballarni belgilang.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Kutilmoqda: <strong>{pendingCount} ta</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Barchasi ({allAchievements.length})
          </button>
          <button
            onClick={() => setFilterStatus('kutilmoqda')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterStatus === 'kutilmoqda' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-800'
            }`}
          >
            Kutilmoqda ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('tasdiqlandi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'tasdiqlandi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Tasdiqlanganlar
          </button>
          <button
            onClick={() => setFilterStatus('rad_etildi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'rad_etildi' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Rad etilganlar
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Talaba yoki yutuq nomi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Achievements */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">Mos keluvchi yutuqlar topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ach => (
            <div 
              key={ach.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                ach.status === 'kutilmoqda' ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                      {ach.group} • {ach.studentName}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                      {ach.title}
                    </h4>
                  </div>

                  {ach.status === 'tasdiqlandi' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold shrink-0">
                      +{ach.bonusPoints} ball tasdiqlangan
                    </span>
                  ) : ach.status === 'rad_etildi' ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold shrink-0">
                      Rad etilgan
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold shrink-0 animate-pulse">
                      Tekshiruv kutilmoqda
                    </span>
                  )}
                </div>

                {/* Student's Comment */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase block mb-0.5">
                    Talaba qoldirgan izoh:
                  </span>
                  <p className="italic">"{ach.studentComment}"</p>
                </div>

                {/* File Attachment */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1 font-mono text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    {ach.fileName || "hujjat.pdf"}
                  </span>
                  <span className="text-[11px] text-slate-400">{ach.fileSize || "1.2 MB"} • {ach.dateSubmitted}</span>
                </div>
              </div>

              {/* Action Buttons or Existing Decision */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {ach.status === 'kutilmoqda' ? (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handleReject(ach)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Rad etish
                    </button>
                    <button
                      onClick={() => handleApprove(ach)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      Tasdiqlash & Ball berish
                    </button>
                  </div>
                ) : (
                  <div className="w-full text-xs text-slate-500 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-700">Ko'rib chiqdi: </span>
                      {ach.reviewedBy}
                    </div>
                    <button
                      onClick={() => handleApprove(ach)}
                      className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold underline"
                    >
                      Qayta baholash
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Confirmation Modal */}
      {activeReviewAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Yutuqni Baholash va Tasdiqlash
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Talaba: <strong>{activeReviewAch.studentName}</strong> ({activeReviewAch.group})
            </p>

            {actionSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hujjat nomi:
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800">
                  {activeReviewAch.title}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tenglikda qo'shiluvchi bonus ball (0 - 50 ball):
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={bonusPointsInput}
                  onChange={(e) => setBonusPointsInput(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Ikki talaba GPA ko'rsatkichi bir xil bo'lganda ushbu bonus ballar hal qiluvchi mezon hisoblanadi.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tyutor xulosasi va rasmiy izohi:
                </label>
                <textarea
                  rows={3}
                  value={reviewCommentInput}
                  onChange={(e) => setReviewCommentInput(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveReviewAch(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => executeReview('rad_etildi')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                >
                  Rad etish
                </button>
                <button
                  type="button"
                  onClick={() => executeReview('tasdiqlandi')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Tasdiqlash (+{bonusPointsInput} b.)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
