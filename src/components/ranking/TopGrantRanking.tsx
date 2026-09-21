import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  Filter, 
  Download, 
  Lock, 
  Clock, 
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportGrantRankingToExcel } from '../../utils/excelUtils';
import { Student } from '../../types';

export const TopGrantRanking: React.FC = () => {
  const { students, platformSettings, currentUser } = useApp();
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique directions and groups
  const directions = Array.from(new Set(students.map(s => s.direction)));
  const groups = Array.from(
    new Set(
      students
        .filter(s => selectedDirection === 'all' || s.direction === selectedDirection)
        .map(s => s.group)
    )
  );

  // Sorting logic with GPA + Verified Achievement Tie-Breaker:
  // 1. Higher GPA
  // 2. If GPA is strictly equal: Higher verified achievements bonus points
  // 3. If bonus points equal: Higher attendance rate
  // 4. Alphabetical
  const sortedStudents = [...students].sort((a, b) => {
    if (b.gpa !== a.gpa) {
      return b.gpa - a.gpa;
    }
    // Tie-breaker: Verified achievements bonus
    const aBonus = a.achievements
      .filter(ach => ach.status === 'tasdiqlandi')
      .reduce((sum, ach) => sum + (ach.bonusPoints || 0), 0);
    const bBonus = b.achievements
      .filter(ach => ach.status === 'tasdiqlandi')
      .reduce((sum, ach) => sum + (ach.bonusPoints || 0), 0);

    if (bBonus !== aBonus) {
      return bBonus - aBonus;
    }

    if (b.attendanceRate !== a.attendanceRate) {
      return b.attendanceRate - a.attendanceRate;
    }

    return a.fullName.localeCompare(b.fullName);
  });

  // Filter students
  const filteredStudents = sortedStudents.filter(student => {
    const matchesDirection = selectedDirection === 'all' || student.direction === selectedDirection;
    const matchesGroup = selectedGroup === 'all' || student.group === selectedGroup;
    const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.studentId.includes(searchQuery) ||
                          student.group.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDirection && matchesGroup && matchesSearch;
  });

  // Check if current user is Dean (Dean can always view even if 2-week window is closed)
  const isDean = currentUser.role === 'dean';
  const isWindowActive = platformSettings.isRatingWindowOpen;

  // Determine grant cutoff: top N or top %
  const grantQuotaCount = Math.max(1, Math.round((students.length * platformSettings.grantQuotaPercentage) / 100));

  return (
    <div className="space-y-6">
      {/* Banner / 2-week condition display */}
      {!isWindowActive && !isDean ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
            Semestr Yakuniy Grant Reytingi Hozircha Yopiq
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Universitet me'yoriy qoidalariga muvofiq, <strong>Grant va Stipendiya</strong> uchun umumiy TOP reyting 
            har semestrning oxirgi <strong>2 haftasida</strong> ochiq e'lon qilinadi va jonli hisoblab boriladi.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100/70 text-amber-900 text-xs font-semibold">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Kutilayotgan ochilish sanasi: 15-maydan 31-maygacha</span>
          </div>
          <div className="mt-6 pt-6 border-t border-amber-200/60 text-xs text-slate-500">
            Fakultet Dekani yoki Zamdekani admin panelidan ushbu darchani istalgan paytda sinov yoki muddatli ko'rish uchun yoqishi mumkin.
          </div>
        </div>
      ) : (
        <>
          {/* Header Controls */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <Trophy className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      Grant va Stipendiya Nomzodlari Reytingi (TOP GPA)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Oliy ball to'plagan talabalar reytingi. Bir xil GPA bo'lganda tasdiqlangan yutuqlar hal qiladi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportGrantRankingToExcel(filteredStudents)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Reytingni Excelga yuklab olish
                </button>
              </div>
            </div>

            {/* Tie-breaker explanation rule card */}
            <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Universitet Nizomi: </span>
                Agar ikki yoki undan ortiq talabaning GPA ko'rsatkichi mutlaqo bir xil bo'lsa (masalan: 4.88 va 4.88), 
                ularning shaxsiy kabinetga yuklagan va biriktirilgan tyutor tomonidan rasman tasdiqlangan 
                <strong> xalqaro sertifikatlari, maqolalari va olimpiada yutuqlari (bonus ballari)</strong> orqali 
                saralanadi.
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Yo'nalish bo'yicha filter
                </label>
                <select
                  value={selectedDirection}
                  onChange={(e) => {
                    setSelectedDirection(e.target.value);
                    setSelectedGroup('all');
                  }}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Barcha yo'nalishlar ({students.length} talaba)</option>
                  {directions.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Guruh bo'yicha filter
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Barcha guruhlar</option>
                  {groups.map(grp => (
                    <option key={grp} value={grp}>{grp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Qidirish (Ism, ID yoki Guruh)
                </label>
                <input
                  type="text"
                  placeholder="Talaba F.I.Sh. yoki ID raqami..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 w-16 text-center">O'rni</th>
                    <th className="py-3.5 px-4">Talaba F.I.Sh.</th>
                    <th className="py-3.5 px-3">Yo'nalish va Guruh</th>
                    <th className="py-3.5 px-3 text-center">GPA</th>
                    <th className="py-3.5 px-3 text-center">Tasdiqlangan Yutuqlar</th>
                    <th className="py-3.5 px-3 text-center">Davomat</th>
                    <th className="py-3.5 px-4 text-center">Grant Maqomi</th>
                    <th className="py-3.5 px-4 text-right">Biriktirilgan Tyutor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student, idx) => {
                    const verifiedAch = student.achievements.filter(a => a.status === 'tasdiqlandi');
                    const bonusTotal = verifiedAch.reduce((sum, a) => sum + (a.bonusPoints || 0), 0);
                    
                    // Check if adjacent student has same GPA (tie scenario)
                    const prevStudent = filteredStudents[idx - 1];
                    const nextStudent = filteredStudents[idx + 1];
                    const isTied = (prevStudent && prevStudent.gpa === student.gpa) || 
                                  (nextStudent && nextStudent.gpa === student.gpa);

                    const isGrantWinner = idx < grantQuotaCount && student.gpa >= platformSettings.minGpaForGrant;

                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          currentUser.studentId === student.studentId ? 'bg-indigo-50/50' : ''
                        }`}
                      >
                        {/* Rank Position */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center justify-center">
                            {idx === 0 ? (
                              <span className="w-7 h-7 rounded-full bg-amber-400 text-white font-bold flex items-center justify-center shadow-xs">
                                🥇
                              </span>
                            ) : idx === 1 ? (
                              <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center shadow-xs">
                                🥈
                              </span>
                            ) : idx === 2 ? (
                              <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shadow-xs">
                                🥉
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-600">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Student Name & ID */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {student.fullName}
                            {currentUser.studentId === student.studentId && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                                Siz
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>ID: {student.studentId}</span>
                            <span>•</span>
                            <span>{student.semester}-semestr</span>
                          </div>
                        </td>

                        {/* Direction & Group */}
                        <td className="py-4 px-3">
                          <div className="font-medium text-slate-800">{student.group}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {student.direction}
                          </div>
                        </td>

                        {/* GPA */}
                        <td className="py-4 px-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2.5 py-1 rounded-lg font-display font-bold text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {student.gpa.toFixed(2)}
                            </span>
                            {isTied && (
                              <span className="mt-1 text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200 flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                Teng GPA
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Verified Achievements & Tie-breaker points */}
                        <td className="py-4 px-3 text-center">
                          {verifiedAch.length > 0 ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                {verifiedAch.length} ta yutuq (+{bonusTotal} b.)
                              </span>
                              <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                                {verifiedAch[0].title}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Yutuqlar yo'q
                            </span>
                          )}
                        </td>

                        {/* Attendance */}
                        <td className="py-4 px-3 text-center">
                          <span className={`font-semibold ${
                            student.attendanceRate >= 95 ? 'text-emerald-700' :
                            student.attendanceRate >= 85 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {student.attendanceRate}%
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {student.missedHours} s. qoldiq
                          </div>
                        </td>

                        {/* Grant Status */}
                        <td className="py-4 px-4 text-center">
                          {isGrantWinner ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {student.grantType || "Davlat granti"}
                            </span>
                          ) : student.gpa >= platformSettings.minGpaForGrant ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                              Zaxira nomzod
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px]">
                              Shartnoma
                            </span>
                          )}
                        </td>

                        {/* Tutor */}
                        <td className="py-4 px-4 text-right">
                          <div className="text-slate-800 text-xs font-medium">
                            {student.assignedTutorName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {student.assignedTutorPhone}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
              <div>
                Jami: <strong>{filteredStudents.length} nafar</strong> talaba ko'rsatilmoqda. 
                Grant kvotasi: Eng yuqori <strong>{platformSettings.grantQuotaPercentage}%</strong> ({grantQuotaCount} ta o'rin).
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Grant g'olibi
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Zaxira nomzod
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  Shartnoma
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
