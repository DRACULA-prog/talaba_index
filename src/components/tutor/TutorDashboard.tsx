import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Award, 
  History, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Eye,
  Plus,
  FolderPlus,
  FileText,
  Mail,
  Filter,
  Check,
  Layers,
  Send,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadSampleExcel, parseExcelFile, exportCredentialsToExcel, ParsedRowData } from '../../utils/excelUtils';
import { AchievementReview } from './AchievementReview';
import { OfficialLettersView } from './OfficialLettersView';
import { GroupManagerModal } from './GroupManagerModal';
import { ComposeLetterModal } from './ComposeLetterModal';
import { StudentProfileDetailModal } from '../student/StudentProfileDetailModal';
import { DeanReferralsView } from './DeanReferralsView';
import { Student } from '../../types';

export const TutorDashboard: React.FC = () => {
  const { 
    students, 
    groups, 
    processExcelImport, 
    importHistory, 
    currentUser,
    deanReferrals,
    deleteStudent
  } = useApp();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'upload' | 'referrals' | 'students' | 'review' | 'history'>('upload');

  // Split-view inside "upload" tab:
  // 'attendance_grades' = 1. Talabalar davomati va bahosi oynasi
  // 'letters' = 2. Aloqa xati va boshqa xatlar yuklash oynasi
  const [dataEntrySubTab, setDataEntrySubTab] = useState<'attendance_grades' | 'letters'>('attendance_grades');

  // Group manager modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Selected student for Profile View / Compose Letter / Deletion
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);
  const [letterStudent, setLetterStudent] = useState<Student | null>(null);
  const [isComposeLetterOpen, setIsComposeLetterOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Upload state for Attendance & Grades
  const [selectedPeriod, setSelectedPeriod] = useState("Oraliq nazorat (Joriy oy)");
  const [targetGroup, setTargetGroup] = useState<string>(groups[0]?.name || "KI-1-24");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRowData[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [importSummary, setImportSummary] = useState<{
    totalRows: number;
    newCount: number;
    updatedCount: number;
    newStudents: Array<{
      fullName: string;
      studentId: string;
      login: string;
      password: string;
      parentCode: string;
      group: string;
    }>;
  } | null>(null);

  // Find target direction based on selected group
  const activeGroupObj = groups.find(g => g.name.toLowerCase() === targetGroup.toLowerCase());
  const targetDirection = activeGroupObj?.direction || "Kompyuter injiniringi";

  // Filter students for "Guruh Talabalari" list
  const [studentSearch, setStudentSearch] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Available unique directions from groups
  const availableDirections = Array.from(new Set(groups.map(g => g.direction)));

  const filteredStudents = students.filter(s => {
    const matchSearch = 
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.includes(studentSearch) ||
      s.group.toLowerCase().includes(studentSearch.toLowerCase());

    const matchDirection = filterDirection === 'all' || s.direction.toLowerCase() === filterDirection.toLowerCase();
    const matchGroup = filterGroup === 'all' || s.group.toLowerCase() === filterGroup.toLowerCase();
    const matchCourse = filterCourse === 'all' || s.course.toString() === filterCourse;

    let matchStatus = true;
    if (filterStatus === 'low_attendance') {
      matchStatus = s.attendanceRate < 95;
    } else if (filterStatus === 'grant_eligible') {
      matchStatus = s.isGrantEligible;
    } else if (filterStatus === 'high_missed') {
      matchStatus = s.missedHours >= 10;
    }

    return matchSearch && matchDirection && matchGroup && matchCourse && matchStatus;
  });

  // File selection & parsing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsParsing(true);
    setUploadError('');

    try {
      const rows = await parseExcelFile(file);
      if (rows.length === 0) {
        setUploadError("Faylda hech qanday ma'lumot topilmadi yoki ustunlar noto'g'ri.");
      } else {
        setParsedRows(rows);
      }
    } catch (err: unknown) {
      console.error(err);
      setUploadError("Faylni o'qishda xatolik yuz berdi. Iltimos namunaviy .xlsx shablonidan foydalaning.");
    } finally {
      setIsParsing(false);
    }
  };

  // Submit parsed rows into system for the target group
  const handleProcessImport = () => {
    if (!parsedRows.length || !uploadedFile) return;

    const result = processExcelImport(
      parsedRows, 
      uploadedFile.name, 
      currentUser.fullName,
      targetGroup,
      targetDirection
    );

    setImportSummary(result);
    setParsedRows([]);
    setUploadedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Tutor Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Tyutor va O'qituvchi Boshqaruv Markazi
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Mas'ul tyutor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.fullName} • Faol guruhlar soni: <strong>{groups.length} ta</strong> • Jami talabalar: <strong>{students.length} nafar</strong>
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            + Guruh Yaratish (Boshqarish)
          </button>

          <button
            onClick={() => exportCredentialsToExcel(students)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <KeyRound className="w-4 h-4 text-indigo-600" />
            Login/Parollarni Yuklash
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Ma'lumot Kiritish & Xatlar
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'referrals'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Dekanat Topshiriqlari ({deanReferrals.length})</span>
          {deanReferrals.some(r => r.status === 'yangi') && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'students'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Talabalar Ro'yxati ({filteredStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'review'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Yutuqlarni Tasdiqlash
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          Yuklash Tarixi ({importHistory.length})
        </button>
      </div>

      {/* TAB 1: SPLIT DATA ENTRY & UPLOAD (2ga bo'lingan) */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Split Switcher (Panel A vs Panel B) */}
          <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-2 max-w-2xl text-xs font-semibold">
            <button
              onClick={() => setDataEntrySubTab('attendance_grades')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
                dataEntrySubTab === 'attendance_grades'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              1. Talabalar Davomati va Bahosi (XLSX)
            </button>

            <button
              onClick={() => setDataEntrySubTab('letters')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
                dataEntrySubTab === 'letters'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              2. Aloqa Xati va Boshqa Xatlar Yuklash
            </button>
          </div>

          {/* SUB-SECTION 1: Attendance & Grades Excel Upload by Group */}
          {dataEntrySubTab === 'attendance_grades' && (
            <div className="space-y-6">
              {/* Instructions and Download Template */}
              <div className="bg-linear-to-r from-blue-50/70 via-indigo-50/50 to-white rounded-3xl p-6 border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      Guruhlar Kesimida Davomat va Baholarni Yuklash
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Guruhga moslangan .xlsx
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    Har bir guruhning talabalari davomati va baholari alohida XLS/XLSX faylda yuklanadi.
                    Guruhni tanlang yoki yangi guruh yarating, shunda jadvaldagi ballar avtomatik tegishli guruh talabalariga biriktiriladi.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadSampleExcel(targetDirection, targetGroup, selectedPeriod)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    "{targetGroup}" uchun Shablon Yuklab Olish
                  </button>
                </div>
              </div>

              {/* Import Summary after successful import */}
              {importSummary && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-xs animate-in fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-base">
                          Fayl Muvaffaqiyatli Bazaga Integratsiya Qilindi!
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Jami qatorlar: <strong>{importSummary.totalRows} ta</strong> • 
                          Yangilangan talabalar: <strong>{importSummary.updatedCount} nafar</strong> • 
                          Yangi ochilgan talabalar: <strong>{importSummary.newCount} nafar</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setImportSummary(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-sm"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Display newly generated logins and passwords */}
                  {importSummary.newStudents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-900 uppercase">
                          Yangi Yaratilgan Talabalar uchun Generatsiya Qilingan Kirish Kalitlari:
                        </span>
                        <button
                          onClick={() => exportCredentialsToExcel(students)}
                          className="text-xs text-emerald-900 font-semibold underline flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Ro'yxatni Excelda saqlash
                        </button>
                      </div>

                      <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-emerald-100/50 text-emerald-900 font-semibold">
                            <tr>
                              <th className="p-2.5">Talaba F.I.Sh.</th>
                              <th className="p-2.5">Talaba ID</th>
                              <th className="p-2.5">Guruh</th>
                              <th className="p-2.5">Generatsiya qilingan Login</th>
                              <th className="p-2.5">Dastlabki Parol</th>
                              <th className="p-2.5">Ota-ona Kodi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-100">
                            {importSummary.newStudents.map((st, i) => (
                              <tr key={i}>
                                <td className="p-2.5 font-bold text-slate-800">{st.fullName}</td>
                                <td className="p-2.5 font-mono">{st.studentId}</td>
                                <td className="p-2.5 font-mono font-bold text-blue-700">{st.group}</td>
                                <td className="p-2.5 font-mono text-indigo-700 font-bold">{st.login}</td>
                                <td className="p-2.5 font-mono text-emerald-800 bg-emerald-50/50">{st.password}</td>
                                <td className="p-2.5 font-mono text-amber-800 font-bold">{st.parentCode}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Group & File Upload Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Select Group */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700">
                        1. Qaysi Guruh uchun Yuklanmoqda:
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsGroupModalOpen(true)}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        + Yangi guruh
                      </button>
                    </div>
                    <select
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-900"
                    >
                      {groups.map(g => (
                        <option key={g.id} value={g.name}>
                          {g.name} — {g.direction} ({g.course}-kurs)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Direction read-only info */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      2. Biriktirilgan Ta'lim Yo'nalishi:
                    </label>
                    <div className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-medium truncate">
                      {targetDirection}
                    </div>
                  </div>

                  {/* Period Selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      3. Nazorat Davri (Semestr / Oraliq):
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Oraliq nazorat (Aprel oyi)">Oraliq nazorat (Aprel oyi)</option>
                      <option value="Yakuniy baholash (May oyi)">Yakuniy baholash (May oyi)</option>
                      <option value="Haftalik monitoring">Haftalik monitoring</option>
                      <option value="Semestr davomati va yakun">Semestr davomati va yakun</option>
                    </select>
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20">
                  <input
                    type="file"
                    id="excel-upload"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {uploadedFile ? uploadedFile.name : `"${targetGroup}" guruhi uchun .xlsx yoki .xls faylni tanlang`}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Faylni sudrab tashlang yoki kompyuterdan tanlash uchun bosing
                      </p>
                    </div>
                  </label>
                </div>

                {uploadError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Parsed Preview Table */}
                {parsedRows.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 uppercase">
                        O'qilgan Ma'lumotlar ({parsedRows.length} qator topildi)
                      </span>
                      <button
                        onClick={handleProcessImport}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        "{targetGroup}" Guruhiga Tasdiqlash & Bazani Yangilash
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                          <tr>
                            <th className="p-2.5">Talaba F.I.Sh.</th>
                            <th className="p-2.5">Talaba ID</th>
                            <th className="p-2.5">Belgilangan Guruh</th>
                            <th className="p-2.5">Fan Nomi</th>
                            <th className="p-2.5 text-center">Ball</th>
                            <th className="p-2.5 text-center">Davomat</th>
                            <th className="p-2.5 text-center">Qoldirilgan soat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {parsedRows.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-slate-800">{r.fullName}</td>
                              <td className="p-2.5 font-mono">{r.studentId}</td>
                              <td className="p-2.5 font-mono font-semibold text-blue-700">{targetGroup}</td>
                              <td className="p-2.5">{r.subjectName}</td>
                              <td className="p-2.5 text-center font-bold text-indigo-700">{r.score} / {r.maxScore}</td>
                              <td className="p-2.5 text-center font-semibold text-emerald-700">{r.attendanceRate}%</td>
                              <td className="p-2.5 text-center text-slate-500">{r.missedHours}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: Official Letters & Explanations */}
          {dataEntrySubTab === 'letters' && (
            <OfficialLettersView />
          )}
        </div>
      )}

      {/* TAB: DEKANAT TOPSHIRIQLARI & NAZORATDAGI TALABALAR */}
      {activeTab === 'referrals' && (
        <DeanReferralsView
          onInspectStudent={(st) => setInspectStudent(st)}
          onComposeLetterForStudent={(st) => {
            setLetterStudent(st);
            setIsComposeLetterOpen(true);
          }}
        />
      )}

      {/* TAB 2: STUDENTS LIST WITH ADVANCED FILTERS & ACTIONS */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Multi-faceted Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-blue-600" />
                Guruhlar va Yo'nalishlar Bo'yicha Qidiruv Filtrlari:
              </span>
              <span className="text-slate-500 text-[11px]">
                Topilgan talabalar: <strong className="text-slate-900">{filteredStudents.length} nafar</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Search text */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ism, ID raqami yoki guruh..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Direction filter */}
              <div>
                <select
                  value={filterDirection}
                  onChange={(e) => {
                    setFilterDirection(e.target.value);
                    setFilterGroup('all');
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Barcha Yo'nalishlar</option>
                  {availableDirections.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Group filter */}
              <div>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                >
                  <option value="all">Barcha Guruhlar</option>
                  {groups
                    .filter(g => filterDirection === 'all' || g.direction.toLowerCase() === filterDirection.toLowerCase())
                    .map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="all">Barcha holatlar</option>
                  <option value="low_attendance">Davomati &lt; 95% (Xavfli)</option>
                  <option value="high_missed">Qoldirilgan &gt; 10 soat</option>
                  <option value="grant_eligible">Grantga da'vogarlar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="p-3.5">Talaba F.I.Sh.</th>
                    <th className="p-3.5">Talaba ID</th>
                    <th className="p-3.5">Yo'nalish & Guruh</th>
                    <th className="p-3.5 text-center">GPA</th>
                    <th className="p-3.5 text-center">Davomat</th>
                    <th className="p-3.5 text-center">Qoldirilgan</th>
                    <th className="p-3.5 text-center">Yutuqlar</th>
                    <th className="p-3.5 text-right">Amallar (Xat / Profil)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        Tanlangan filtrlarga mos keluvchi talabalar topilmadi.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(st => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          <button
                            onClick={() => setInspectStudent(st)}
                            className="hover:text-blue-600 text-left"
                          >
                            {st.fullName}
                          </button>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">{st.studentId}</td>
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {st.group}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">{st.direction}</span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold">
                            {st.gpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            st.attendanceRate >= 95 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {st.attendanceRate}%
                          </span>
                        </td>
                        <td className="p-3.5 text-center text-slate-600 font-medium">
                          {st.missedHours} soat
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-[11px]">
                            {st.achievements.length} ta
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Button: View Profile & Achievements */}
                            <button
                              onClick={() => setInspectStudent(st)}
                              title="Talabaning profili va barcha yutuqlarini ko'rish"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Profil/Yutuq</span>
                            </button>

                            {/* Button: Compose Letter for this student */}
                            <button
                              onClick={() => {
                                setLetterStudent(st);
                                setIsComposeLetterOpen(true);
                              }}
                              title="Aloqa yoki tushuntirish xati tuzish"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Xat</span>
                            </button>

                            {/* Button: Delete incorrectly entered student */}
                            <button
                              onClick={() => setStudentToDelete(st)}
                              title="Noto'g'ri kiritilgan talabani o'chirish"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>O'chirish</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEW ACHIEVEMENTS */}
      {activeTab === 'review' && (
        <AchievementReview />
      )}

      {/* TAB 4: IMPORT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">XLS / XLSX Yuklashlar Qaydnomasi</h3>
            <p className="text-xs text-slate-500">Guruhlar kesimida yuklangan barcha qaydnomalar arxivi</p>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase">
              <tr>
                <th className="p-3.5">Fayl Nomi</th>
                <th className="p-3.5">Yuklangan Vaqt</th>
                <th className="p-3.5">Mas'ul Tyutor</th>
                <th className="p-3.5">Yo'nalish & Guruh</th>
                <th className="p-3.5">Davr</th>
                <th className="p-3.5 text-center">Qatorlar</th>
                <th className="p-3.5 text-right">Natija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {importHistory.map(h => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    {h.fileName}
                  </td>
                  <td className="p-3.5 text-slate-500">{h.uploadedAt}</td>
                  <td className="p-3.5 text-slate-800">{h.tutorName}</td>
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {h.group}
                    </span>
                    <span className="block text-[11px] text-slate-500">{h.direction}</span>
                  </td>
                  <td className="p-3.5">{h.period}</td>
                  <td className="p-3.5 text-center font-bold">{h.totalRows} ta</td>
                  <td className="p-3.5 text-right">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      +{h.newStudentsCount} yangi / {h.updatedStudentsCount} yangilandi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Group Manager Modal */}
      <GroupManagerModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onGroupCreated={(groupName) => {
          setTargetGroup(groupName);
        }}
      />

      {/* Student Profile Detail Modal */}
      <StudentProfileDetailModal
        student={inspectStudent}
        onClose={() => setInspectStudent(null)}
        onComposeLetter={(st) => {
          setLetterStudent(st);
          setIsComposeLetterOpen(true);
        }}
      />

      {/* Compose Letter Modal */}
      <ComposeLetterModal
        isOpen={isComposeLetterOpen}
        onClose={() => {
          setIsComposeLetterOpen(false);
          setLetterStudent(null);
        }}
        preSelectedStudent={letterStudent}
        defaultGroup={letterStudent?.group || targetGroup}
      />

      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Talaba profilini o'chirish
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Haqiqatan ham noto'g'ri kiritilgan <strong>{studentToDelete.fullName}</strong> (ID: {studentToDelete.studentId}, Guruhi: {studentToDelete.group}) profilini tizimdan butunlay olib tashlamoqchimisiz?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(studentToDelete.studentId);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
