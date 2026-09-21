import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Trophy, 
  KeyRound, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentAchievements } from './StudentAchievements';
import { TopGrantRanking } from '../ranking/TopGrantRanking';

interface StudentDashboardProps {
  onOpenPasswordModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenPasswordModal }) => {
  const { currentUser, students, platformSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'subjects' | 'achievements' | 'ranking' | 'profile'>('subjects');

  // Find active student data
  const currentStudent = students.find(
    s => s.studentId === currentUser.studentId || s.id === currentUser.id
  ) || students[0];

  const verifiedAchievements = currentStudent.achievements.filter(a => a.status === 'tasdiqlandi');
  const totalBonusPoints = verifiedAchievements.reduce((sum, a) => sum + (a.bonusPoints || 0), 0);

  // Student position in faculty ranking
  const sortedStudents = [...students].sort((a, b) => {
    if (b.gpa !== a.gpa) return b.gpa - a.gpa;
    const aBonus = a.achievements.filter(ach => ach.status === 'tasdiqlandi').reduce((s, ach) => s + (ach.bonusPoints || 0), 0);
    const bBonus = b.achievements.filter(ach => ach.status === 'tasdiqlandi').reduce((s, ach) => s + (ach.bonusPoints || 0), 0);
    return bBonus - aBonus;
  });

  const rankIndex = sortedStudents.findIndex(s => s.studentId === currentStudent.studentId);
  const currentRank = rankIndex >= 0 ? rankIndex + 1 : 1;
  const grantQuotaCount = Math.max(1, Math.round((students.length * platformSettings.grantQuotaPercentage) / 100));
  const isGrantCandidate = currentRank <= grantQuotaCount && currentStudent.gpa >= platformSettings.minGpaForGrant;

  return (
    <div className="space-y-6">
      {/* Student Welcome & Top Stats Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-40 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Talaba Shaxsiy Kabineti
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-white/10 text-slate-200 border border-white/10">
                ID: {currentStudent.studentId}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Guruh: {currentStudent.group}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {currentStudent.fullName}
            </h1>

            <p className="text-sm text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>{currentStudent.direction}</span>
              <span>•</span>
              <span>{currentStudent.course}-bosqich ({currentStudent.semester}-semestr)</span>
              <span>•</span>
              <span className="text-indigo-200 font-medium">Tyutor: {currentStudent.assignedTutorName}</span>
            </p>
          </div>

          {/* Quick Grant Status Banner on Top Right */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
              isGrantCandidate 
                ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20' 
                : 'bg-indigo-600 text-white'
            }`}>
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">
                Grant / Stipendiya Holati
              </div>
              <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                {isGrantCandidate ? (
                  <span className="text-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Davlat Granti Nomzodi
                  </span>
                ) : (
                  <span>Shartnoma asosida</span>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Fakultetda <strong className="text-white">#{currentRank}-o'rinda</strong> (Top {platformSettings.grantQuotaPercentage}% ichida)
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-300 font-medium">Joriy GPA Ko'rsatkichi</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {currentStudent.gpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              A'lo darajadagi o'zlashtirish
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-300 font-medium">Davomat va Qoldiq</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {currentStudent.attendanceRate}%
              </span>
            </div>
            <div className="text-[10px] text-slate-300 mt-1">
              {currentStudent.missedHours} soat sababsiz qoldiq
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-300 font-medium">Tasdiqlangan Yutuqlar</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {verifiedAchievements.length}
              </span>
              <span className="text-xs text-slate-400">ta</span>
            </div>
            <div className="text-[10px] text-indigo-300 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              +{totalBonusPoints} ball tenglik bonusi
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-300 font-medium">Jami Kreditlar</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {currentStudent.totalCredits}
              </span>
              <span className="text-xs text-slate-400">ECTS</span>
            </div>
            <div className="text-[10px] text-slate-300 mt-1">
              {currentStudent.subjects.length} ta fan bo'yicha baholandi
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'subjects'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Fanlar va To'plangan Ballar ({currentStudent.subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'achievements'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Mening Yutuqlarim va Hujjatlarim ({currentStudent.achievements.length})
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'ranking'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          TOP Grant Reytingi
          {platformSettings.isRatingWindowOpen ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500 text-white font-bold">
              Ochiq
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-300 text-slate-700">
              Yopiq
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          Kirish Ma'lumotlari va Tyutor
        </button>
      </div>

      {/* Tab 1: Fanlar va Ballar (Imported from XLS/XLSX by Tutor) */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                O'qituvchi / Tyutor yuklagan fanlar va o'zlashtirish qaydnomasi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ushbu ballar va davomat ko'rsatkichlari XLS/XLSX fayllar orqali kiritilgan va GPA formula asosida avtomatik hisoblangan.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Oxirgi yangilanish: {currentStudent.updatedAt}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Fan Nomi</th>
                    <th className="py-3.5 px-3 text-center">Kredit</th>
                    <th className="py-3.5 px-3 text-center">To'plangan Ball</th>
                    <th className="py-3.5 px-3 text-center">Baho Harfi</th>
                    <th className="py-3.5 px-3 text-center">GPA Ekvivalenti</th>
                    <th className="py-3.5 px-3 text-center">Davomat</th>
                    <th className="py-3.5 px-4 text-right">O'qituvchi / Qayd davri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStudent.subjects.map((sub, index) => (
                    <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {sub.subjectName}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600">
                        {sub.credits} ECTS
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-slate-900">
                          {sub.score}
                        </span>
                        <span className="text-slate-400 text-[10px]"> / {sub.maxScore}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          sub.gradeLetter.startsWith('A') 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : sub.gradeLetter.startsWith('B')
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {sub.gradeLetter}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-indigo-600">
                        {sub.gradePoint.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`font-semibold ${
                          sub.attendanceRate >= 95 ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {sub.attendanceRate}%
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {sub.missedHours} s. qoldiq
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="text-slate-700 font-medium">
                          {sub.teacherName || "Kafedra o'qituvchisi"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sub.period}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Achievements */}
      {activeTab === 'achievements' && (
        <StudentAchievements student={currentStudent} />
      )}

      {/* Tab 3: TOP Grant Ranking */}
      {activeTab === 'ranking' && (
        <TopGrantRanking />
      )}

      {/* Tab 4: Profile, Passwords & Tutor info */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credentials Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <KeyRound className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Shaxsiy Kirish Ma'lumotlari
                </h3>
                <p className="text-xs text-slate-500">
                  Tizim avtomatik generatsiya qilgan login va parol
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Talaba Logini:</span>
                <span className="font-mono font-bold text-slate-900">{currentStudent.login}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Parol Holati:</span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {currentStudent.isPasswordChanged ? "Parol yangilangan" : "Dastlabki parol"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                <div>
                  <span className="font-semibold block">Ota-ona Kirish Kodi:</span>
                  <span className="text-[11px] text-amber-700">Farzandingiz rivojlanishini kuzatish uchun</span>
                </div>
                <span className="font-mono font-bold text-base px-2 py-1 bg-white rounded border border-amber-300">
                  {currentStudent.parentCode}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPasswordModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Shaxsiy Parolni O'zgartirish
              </button>
            </div>
          </div>

          {/* Assigned Tutor Contact Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <User className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Biriktirilgan Tyutor / Murabbiy
                </h3>
                <p className="text-xs text-slate-500">
                  Ballar va yutuqlarni tasdiqlash uchun mas'ul pedagog
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-[11px] mb-1 font-semibold uppercase">F.I.Sh:</p>
                <p className="font-bold text-slate-900 text-sm">{currentStudent.assignedTutorName}</p>
                <p className="text-slate-600 text-xs mt-1">{currentStudent.direction} yo'nalishi tyutori</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Bog'lanish telefoni:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {currentStudent.assignedTutorPhone}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                ℹ️ <strong>Eslatma:</strong> Yuklagan barcha sertifikat va tavsiyanomalaringiz to'g'ridan-to'g'ri 
                ushbu tyutorning shaxsiy kabinetida ko'rinadi va tekshiruvdan o'tkaziladi.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
