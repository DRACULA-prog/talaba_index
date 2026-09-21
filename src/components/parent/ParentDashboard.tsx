import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Trophy, 
  CheckCircle2, 
  Phone, 
  Clock, 
  BookOpen, 
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export const ParentDashboard: React.FC = () => {
  const { currentUser, students, platformSettings } = useApp();

  // Find the child associated with this parent
  const child: Student = students.find(
    s => s.studentId === currentUser.studentId || s.parentCode === currentUser.username
  ) || students[0];

  const verifiedAchievements = child.achievements.filter(a => a.status === 'tasdiqlandi');

  // Compute ranking of child
  const sortedStudents = [...students].sort((a, b) => b.gpa - a.gpa);
  const rankIndex = sortedStudents.findIndex(s => s.studentId === child.studentId);
  const currentRank = rankIndex >= 0 ? rankIndex + 1 : 1;
  const grantQuotaCount = Math.max(1, Math.round((students.length * platformSettings.grantQuotaPercentage) / 100));
  const isGrantCandidate = currentRank <= grantQuotaCount && child.gpa >= platformSettings.minGpaForGrant;

  return (
    <div className="space-y-6">
      {/* Warm & Trustworthy Parent Welcome Banner */}
      <div className="bg-linear-to-r from-amber-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                Ota-ona Portali
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/10 text-slate-200">
                Kirish kodi: {child.parentCode}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Farzandingiz: {child.fullName}
            </h1>

            <p className="text-sm text-slate-300">
              {child.direction} • {child.group} guruhi talabasi • {child.course}-kurs ({child.semester}-semestr)
            </p>
          </div>

          {/* Child's Scholarship standing card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shrink-0 max-w-sm">
            <div className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider mb-1">
              Grant va Stipendiya Ko'rsatkichi
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              {isGrantCandidate ? (
                <span className="text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  Davlat Granti Nomzodi
                </span>
              ) : (
                <span>To'lov-shartnoma asosida</span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Fakultet bo'yicha <strong>#{currentRank}-o'rinda</strong> turibdi (Eng yuqori natijalar qatorida).
            </p>
          </div>
        </div>

        {/* Core Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-slate-300">O'zlashtirish (GPA)</div>
            <div className="text-2xl font-bold font-display text-white mt-1">
              {child.gpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
            <div className="text-[10px] text-emerald-300 mt-0.5 font-semibold">
              A'lo (Eng yuqori baholar)
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-slate-300">Dars Davomati</div>
            <div className="text-2xl font-bold font-display text-white mt-1">{child.attendanceRate}%</div>
            <div className="text-[10px] text-slate-300 mt-0.5">{child.missedHours} soat qoldirilgan</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-slate-300">Tasdiqlangan Yutuqlar</div>
            <div className="text-2xl font-bold font-display text-white mt-1">{verifiedAchievements.length} ta</div>
            <div className="text-[10px] text-amber-300 mt-0.5">Sertifikat va diplomlar</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-slate-300">Fanlar Soni</div>
            <div className="text-2xl font-bold font-display text-white mt-1">{child.subjects.length} ta</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Barcha oraliqlar topshirildi</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subjects & Grades Breakdown (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Fanlar Kesimida Baholar va To'plangan Ballar
                </h3>
                <p className="text-xs text-slate-500">
                  O'qituvchilar tomonidan rasmiy yuklangan qaydnoma asosida
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="p-3.5">Fan Nomi</th>
                  <th className="p-3.5 text-center">To'plangan Ball</th>
                  <th className="p-3.5 text-center">Baho</th>
                  <th className="p-3.5 text-center">Davomat</th>
                  <th className="p-3.5 text-right">O'qituvchi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {child.subjects.map((sub, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{sub.subjectName}</td>
                    <td className="p-3.5 text-center font-bold text-slate-800">
                      {sub.score} <span className="text-slate-400 font-normal text-[10px]">/ 100</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.gradeLetter}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-semibold text-emerald-700">
                      {sub.attendanceRate}%
                    </td>
                    <td className="p-3.5 text-right text-slate-600">
                      {sub.teacherName || "Kafedra o'qituvchisi"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Child's Achievements */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-display font-bold text-slate-900 text-base mb-1">
              Farzandingizning Tasdiqlangan Yutuqlari
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Xalqaro sertifikatlar, ilmiy maqolalar va olimpiada sovrinlari
            </p>

            {child.achievements.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                Hozircha yutuqlar yuklanmagan
              </div>
            ) : (
              <div className="space-y-3">
                {child.achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-slate-900 text-xs">{ach.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 italic mt-1">"{ach.studentComment}"</p>
                      {ach.reviewComment && (
                        <p className="text-[11px] text-blue-700 font-medium mt-1">
                          Tyutor tasdig'i: {ach.reviewComment}
                        </p>
                      )}
                    </div>
                    {ach.status === 'tasdiqlandi' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                        Tasdiqlangan (+{ach.bonusPoints} b.)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold shrink-0">
                        Tekshiruvda
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tutor Contact & Advisory */}
        <div className="space-y-6">
          {/* Tutor Contact */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Guruh Tyutori / Murabbiyi</h3>
                <p className="text-xs text-slate-500">Doimiy aloqa uchun</p>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-[10px] uppercase font-semibold">Tyutor F.I.Sh:</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{child.assignedTutorName}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500">Telefon:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {child.assignedTutorPhone}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
              Hurmatli ota-ona! Farzandingizning darslarga qatnashishi, oraliq baholari yoki grant holati bo'yicha savollaringiz bo'lsa, to'g'ridan-to'g'ri biriktirilgan tyutor bilan bog'lanishingiz mumkin.
            </div>
          </div>

          {/* GPA Tushuntirish Qutisi (Parent-friendly guidance) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              GPA Nima va U Qanday Ishlaydi?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>GPA (Grade Point Average)</strong> — talabaning barcha fanlardan to'plagan baholarining o'rtacha og'irlikli qiymati bo'lib, 0.0 dan 5.0 ballgacha hisoblanadi.
            </p>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li><strong>4.50 — 5.00:</strong> A'lo (Davlat granti va oshirilgan stipendiya)</li>
              <li><strong>3.80 — 4.49:</strong> Yaxshi darajadagi o'zlashtirish</li>
              <li><strong>3.00 dan past:</strong> O'zlashtirishni kuchaytirish talab etiladi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
