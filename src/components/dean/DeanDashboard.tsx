import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Trophy, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Sliders,
  Sparkles,
  BarChart3,
  Award,
  Plus,
  Send,
  CheckCircle2,
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  UserCheck,
  Check,
  Star,
  Info,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopGrantRanking } from '../ranking/TopGrantRanking';
import { AddQuotaModal } from './AddQuotaModal';
import { ReferStudentModal } from './ReferStudentModal';
import { Student } from '../../types';

export const DeanDashboard: React.FC = () => {
  const { 
    students, 
    groups,
    platformSettings, 
    toggleRatingWindow, 
    updateSettings,
    grantQuotas,
    deleteGrantQuota,
    deanReferrals
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'quotas' | 'ranking' | 'settings'>('overview');

  // Modals state
  const [isAddQuotaOpen, setIsAddQuotaOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [selectedStudentForReferral, setSelectedStudentForReferral] = useState<Student | null>(null);

  // Filter students for Deanery
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'muammoli' | 'nomzod'>('all');

  // Statistics
  const totalStudents = students.length;
  const avgGpa = totalStudents > 0 
    ? (students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents).toFixed(2) 
    : '0.00';
  const avgAttendance = totalStudents > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents) 
    : 0;
  
  const grantQuotaCount = Math.max(1, Math.round((totalStudents * platformSettings.grantQuotaPercentage) / 100));
  const attendanceRiskCount = students.filter(s => s.attendanceRate < 90 || s.missedHours >= 10).length;
  const topCandidateCount = students.filter(s => s.gpa >= 4.70).length;

  // Unique directions and groups
  const uniqueDirections = Array.from(new Set(groups.map(g => g.direction)));
  const uniqueGroups = Array.from(new Set(groups.map(g => g.name)));

  // Filtered student list
  const filteredStudents = students.filter(s => {
    const matchSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.includes(searchQuery) ||
      s.group.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDir = filterDirection === 'all' || s.direction.toLowerCase() === filterDirection.toLowerCase();
    const matchGrp = filterGroup === 'all' || s.group.toLowerCase() === filterGroup.toLowerCase();

    let matchType = true;
    if (filterType === 'muammoli') {
      matchType = s.attendanceRate < 92 || s.missedHours >= 8 || s.gpa < 3.8;
    } else if (filterType === 'nomzod') {
      matchType = s.gpa >= 4.60;
    }

    return matchSearch && matchDir && matchGrp && matchType;
  });

  const handleOpenReferral = (student: Student) => {
    setSelectedStudentForReferral(student);
    setIsReferModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dean Office & 2-Week Window Master Control */}
      <div className="bg-linear-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Fakultet Dekanati
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-slate-200 border border-white/10">
                {platformSettings.currentAcademicYear}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Fakultet Boshqaruvi & Grant Ta'minoti
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Yo'nalishlar, guruhlar kesimida talabalar nazorati, yangi kvotalar belgilash va tyutorlarga vazifalar taqsimlash.
            </p>
          </div>

          {/* Master Toggle: 2-haftalik ochiq reyting darchasi */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shrink-0 max-w-sm">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                  Semestr Oxirgi 2 Haftalik Reyting
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                platformSettings.isRatingWindowOpen ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {platformSettings.isRatingWindowOpen ? 'OCHIQ' : 'YOPIQ'}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal mb-3">
              {platformSettings.isRatingWindowOpen 
                ? "Reyting hozir barcha talaba va ota-onalarga jonli ko'rinmoqda." 
                : "Reyting yopiq. Semestr tugashiga 2 hafta qolganda faollashadi."}
            </p>

            <button
              onClick={() => toggleRatingWindow(!platformSettings.isRatingWindowOpen)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                platformSettings.isRatingWindowOpen
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {platformSettings.isRatingWindowOpen 
                ? "Darchani yopish" 
                : "2 haftalik ochiq reytingni ochish"}
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-slate-300 text-[11px]">Jami Talabalar</div>
            <div className="text-xl font-bold font-display text-white mt-0.5">{totalStudents} nafar</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{uniqueGroups.length} ta guruh kesimida</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-slate-300 text-[11px]">O'rtacha GPA</div>
            <div className="text-xl font-bold font-display text-emerald-300 mt-0.5">{avgGpa}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Maksimal 5.0 shkala</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-slate-300 text-[11px]">Grant Kvotalari</div>
            <div className="text-xl font-bold font-display text-amber-300 mt-0.5">
              {grantQuotas.reduce((sum, q) => sum + q.totalSeats, 0)} o'rin
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{grantQuotas.length} ta faol kvota</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-slate-300 text-[11px]">Nazoratdagi Talabalar</div>
            <div className="text-xl font-bold font-display text-rose-300 mt-0.5">
              {deanReferrals.length} ta vazifa
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{attendanceRiskCount} ta xavfli davomat</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Talabalar Nazorati & Tyutorga Yo'naltirish
        </button>

        <button
          onClick={() => setActiveTab('quotas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'quotas'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Grant & Stipendiya Kvotalari ({grantQuotas.length})
        </button>

        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'ranking'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Grant Saralash & Tenglik (TOP GPA)
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Tizim Sozlamalari
        </button>
      </div>

      {/* Tab 1: Talabalar Nazorati & Tyutorga Yo'naltirish */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Active Referrals sent to Tutors */}
          {deanReferrals.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-600" />
                    Tyutorlarga Yuborilgan Topshiriqlar & Nazoratdagi Talabalar ({deanReferrals.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dekanat tomonidan tyutorlarga biriktirilgan va hisoboti kutilayotgan talabalar
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                      <th className="p-3">Raqami</th>
                      <th className="p-3">Talaba F.I.Sh.</th>
                      <th className="p-3">Guruh</th>
                      <th className="p-3">Toifasi</th>
                      <th className="p-3">Dekanat Topshirig'i</th>
                      <th className="p-3">Mas'ul Tyutor</th>
                      <th className="p-3 text-center">Holati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deanReferrals.map(ref => (
                      <tr key={ref.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">{ref.referralNumber}</td>
                        <td className="p-3 font-bold text-slate-900">{ref.studentName}</td>
                        <td className="p-3 text-slate-600">{ref.group}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ref.type === 'muammoli'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : ref.type === 'nomzod'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {ref.type === 'muammoli' ? 'Muammoli' : ref.type === 'nomzod' ? 'Nomzod' : 'Ixtiyoriy'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 max-w-xs">
                          <p className="line-clamp-2">{ref.instruction}</p>
                          {ref.tutorResponse && (
                            <p className="text-[10px] text-emerald-700 font-medium mt-1 bg-emerald-50 p-1 rounded">
                              Tyutor: {ref.tutorResponse}
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">{ref.tutorName}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ref.status === 'bajarildi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ref.status === 'jarayonda'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ref.status === 'bajarildi' ? 'Bajarildi' : ref.status === 'jarayonda' ? 'Jarayonda' : 'Yangi'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Student Search & Action Directory */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Talabalar Umumiy Ro'yxati (Nazorat va Biriktirish)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Istalgan talabani tanlab, unga topshiriq biriktirish va tyutor profiliga uzatish mumkin
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  Barchasi ({students.length})
                </button>
                <button
                  onClick={() => setFilterType('muammoli')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterType === 'muammoli' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  Muammoli ({attendanceRiskCount})
                </button>
                <button
                  onClick={() => setFilterType('nomzod')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterType === 'nomzod' ? 'bg-white text-purple-700 shadow-2xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  Nomzodlar ({topCandidateCount})
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="F.I.Sh., Talaba ID yoki guruh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <select
                  value={filterDirection}
                  onChange={(e) => setFilterDirection(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Barcha yo'nalishlar</option>
                  {uniqueDirections.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Barcha guruhlar</option>
                  {uniqueGroups.map(grp => (
                    <option key={grp} value={grp}>{grp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                    <th className="p-3">Talaba F.I.Sh.</th>
                    <th className="p-3">Guruh & Yo'nalish</th>
                    <th className="p-3 text-center">GPA</th>
                    <th className="p-3 text-center">Davomat</th>
                    <th className="p-3 text-center">Qoldirilgan</th>
                    <th className="p-3">Biriktirilgan Tyutor</th>
                    <th className="p-3 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Qidiruv bo'yicha talabalar topilmadi.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(st => {
                      const isRisk = st.attendanceRate < 90 || st.missedHours >= 10;
                      const isTop = st.gpa >= 4.70;

                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {st.fullName}
                              {isRisk && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Davomat xavfi" />}
                              {isTop && <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" title="Grant nomzodi" />}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {st.studentId}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{st.group}</div>
                            <div className="text-[10px] text-slate-500">{st.direction}</div>
                          </td>
                          <td className="p-3 text-center font-bold text-indigo-700">
                            {st.gpa.toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-bold ${isRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {st.attendanceRate}%
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-semibold ${st.missedHours >= 10 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                              {st.missedHours} soat
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{st.assignedTutorName}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleOpenReferral(st)}
                              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Tyutorga Uzatish</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Grant & Stipendiya Kvotalari Boshqaruvi */}
      {activeTab === 'quotas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Fakultet Grant & Stipendiya Kvotalari
              </h3>
              <p className="text-xs text-slate-500">
                Semestr yakuniy grant qayta taqsimoti va maxsus stipendiyalar uchun o'rinlar
              </p>
            </div>

            <button
              onClick={() => setIsAddQuotaOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Kvota Qo'shish</span>
            </button>
          </div>

          {/* Quotas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grantQuotas.map(quota => {
              // Calculate how many students qualify for this quota
              const matchingStudents = students.filter(s => {
                const matchDir = quota.direction === "Barcha yo'nalishlar" || s.direction.toLowerCase() === quota.direction.toLowerCase();
                const matchCourse = quota.course === 'all' || s.course === quota.course;
                const matchGpa = s.gpa >= quota.minGpa;
                const matchAtt = s.attendanceRate >= quota.minAttendanceRate;
                return matchDir && matchCourse && matchGpa && matchAtt;
              });

              return (
                <div key={quota.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/70">
                        {quota.quotaType}
                      </span>

                      <button
                        onClick={() => {
                          if (confirm(`"${quota.title}" kvotasini o'chirishni tasdiqlaysizmi?`)) {
                            deleteGrantQuota(quota.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">
                      {quota.title}
                    </h4>

                    {quota.description && (
                      <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">
                        {quota.description}
                      </p>
                    )}

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-400">Yo'nalish:</span>
                        <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">{quota.direction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-400">Kurs:</span>
                        <span className="font-semibold text-slate-800">
                          {quota.course === 'all' ? "Barcha kurslar" : `${quota.course}-kurs`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-400">Min GPA talabi:</span>
                        <span className="font-bold text-indigo-700">{quota.minGpa.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-400">Min Davomat:</span>
                        <span className="font-bold text-emerald-700">{quota.minAttendanceRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Ajratilgan o'rin:</span>
                      <p className="font-bold text-base text-slate-900">{quota.totalSeats} ta</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Mos kelgan talabalar:</span>
                      <p className={`font-bold text-base ${matchingStudents.length >= quota.totalSeats ? 'text-emerald-700' : 'text-purple-700'}`}>
                        {matchingStudents.length} nafar
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: TOP Grant Ranking */}
      {activeTab === 'ranking' && (
        <TopGrantRanking />
      )}

      {/* Tab 4: System Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Grant Saralash Mezonlari va Reyting Sozlamalari
              </h3>
              <p className="text-xs text-slate-500">
                Fakultet miqyosidagi kvota foizlari va minimum o'tish chegarasi
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Universitet Nomi:
              </label>
              <input
                type="text"
                value={platformSettings.universityName}
                onChange={(e) => updateSettings({ universityName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-semibold text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fakultet Nomi:
              </label>
              <input
                type="text"
                value={platformSettings.facultyName}
                onChange={(e) => updateSettings({ facultyName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-semibold text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Grant Kvotasi (% nisbatda):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={platformSettings.grantQuotaPercentage}
                  onChange={(e) => updateSettings({ grantQuotaPercentage: Number(e.target.value) })}
                  className="w-24 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-bold text-purple-700 text-sm"
                />
                <span className="text-slate-500">
                  (Eng yuqori <strong>{platformSettings.grantQuotaPercentage}%</strong> talaba grantga tavsiya qilinadi)
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Grant uchun Minimal Talab Qilinuvchi GPA:
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="5.0"
                value={platformSettings.minGpaForGrant}
                onChange={(e) => updateSettings({ minGpaForGrant: Number(e.target.value) })}
                className="w-24 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-bold text-purple-700 text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">2-Haftalik Ochiq Reyting Darchasi</p>
                <p className="text-[11px] text-slate-500">Talabalar va ota-onalar uchun jonli natijalarni ko'rsatish</p>
              </div>

              <button
                onClick={() => toggleRatingWindow(!platformSettings.isRatingWindowOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  platformSettings.isRatingWindowOpen
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {platformSettings.isRatingWindowOpen ? "Hozir yopish" : "Hozir ochish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddQuotaModal
        isOpen={isAddQuotaOpen}
        onClose={() => setIsAddQuotaOpen(false)}
      />

      <ReferStudentModal
        isOpen={isReferModalOpen}
        onClose={() => {
          setIsReferModalOpen(false);
          setSelectedStudentForReferral(null);
        }}
        student={selectedStudentForReferral}
      />
    </div>
  );
};
