import React, { useState, useEffect } from 'react';
import { 
  Send, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  GraduationCap, 
  FileText,
  Star,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, ReferralType } from '../../types';

interface ReferStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccess?: () => void;
}

export const ReferStudentModal: React.FC<ReferStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess
}) => {
  const { createDeanReferral, groups } = useApp();

  const [referralType, setReferralType] = useState<ReferralType>('muammoli');
  const [priority, setPriority] = useState<'yuqori' | 'o\'rta' | 'oddiy'>('yuqori');
  const [reason, setReason] = useState('');
  const [instruction, setInstruction] = useState('');
  const [targetTutor, setTargetTutor] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill smart reason & instruction when student or type changes
  useEffect(() => {
    if (!student) return;

    setTargetTutor(student.assignedTutorName || "Dotsent Rustamov Alisher Vohidovich");

    // Smart default type suggestion
    if (student.attendanceRate < 90 || student.missedHours >= 8) {
      setReferralType('muammoli');
      setReason(`Davomat ${student.attendanceRate}% ga tushgan, sababsiz ${student.missedHours} soat dars qoldirgan. Joriy semestr davlat granti talablaridan chiqish xavfi mavjud.`);
      setInstruction(`Tyutor zudlik bilan talaba va uning ota-onasi bilan uchrashib, dars qoldirish sabablarini aniqlasin, rasmiy tushuntirish xati olsin va dekanatga hisobot kiritsin.`);
      setPriority('yuqori');
    } else if (student.gpa >= 4.70) {
      setReferralType('nomzod');
      setReason(`Yuqori GPA (${student.gpa.toFixed(2)}) ko'rsatkichi hamda namunali davomat (${student.attendanceRate}%). Davlat nomdor stipendiyasi yoki grant tanloviga tavsiya etiladi.`);
      setInstruction(`Talabaning ilmiy maqolalari, xalqaro sertifikatlari va yutuqlar portfelini to'liq shakllantirib, Fakultet Ilmiy Kengashiga taqdim etilsin.`);
      setPriority('yuqori');
    } else {
      setReferralType('ixtiyoriy');
      setReason(`Talabaning qiziqishlari, darsdan tashqari to'garaklar va ijtimoiy faolligini o'rganish bo'yicha profilaktik topshiriq.`);
      setInstruction(`Talaba bilan suhbat o'tkazilib, uning yo'nalish bo'yicha ilmiy to'garakka qamrab olinishi va shaxsiy o'sish rejasi belgilansin.`);
      setPriority('oddiy');
    }
  }, [student]);

  // Handle changing type manually to update templates
  const handleTypeChange = (type: ReferralType) => {
    setReferralType(type);
    if (!student) return;

    if (type === 'muammoli') {
      setReason(`Talabaning davomati (${student.attendanceRate}%) va dars qoldirish holati (${student.missedHours} soat) bo'yicha intizomiy nazorat.`);
      setInstruction(`Talaba va ota-onasi bilan tushuntirish ishlari olib borilsin, tushuntirish xati olinib, dekanatga xulosa berilsin.`);
      setPriority('yuqori');
    } else if (type === 'nomzod') {
      setReason(`Talaba GPA (${student.gpa.toFixed(2)}) bo'yicha a'lochi bo'lib, davlat granti yoki nomdor stipendiya tanloviga nomzod sifatida belgilandi.`);
      setInstruction(`Talabaning yutuqlar to'plami va tavsiyanoma hujjatlari Fakultet Kengashiga kiritish uchun tayyorlansin.`);
      setPriority('o\'rta');
    } else {
      setReason(`Talabaning ijtimoiy ahvoli, darsga ishtiyoqi va qo'shimcha to'garaklar bo'yicha o'rganish ishlari.`);
      setInstruction(`Talaba bilan individual suhbat o'tkazilib, tyutor xulosasi kiritilsin.`);
      setPriority('oddiy');
    }
  };

  if (!isOpen || !student) return null;

  // Available unique tutors
  const tutorList = Array.from(new Set([
    student.assignedTutorName,
    "Dotsent Rustamov Alisher Vohidovich",
    "Katta o'qituvchi To'rayev Bekzod",
    "Dotsent Alimov Mansur Karimboyevich",
    ...groups.map(g => g.tutorName).filter(Boolean)
  ])).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createDeanReferral({
      studentId: student.studentId,
      studentName: student.fullName,
      group: student.group,
      direction: student.direction,
      type: referralType,
      priority,
      reason: reason.trim(),
      instruction: instruction.trim(),
      tutorName: targetTutor
    });

    setSuccessMsg("Talaba muvaffaqiyatli belgilandi va tyutor profiliga yo'naltirildi!");
    setTimeout(() => {
      setSuccessMsg('');
      onSuccess?.();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Talabani Tyutor Profiliga Yo'naltirish
              </h3>
              <p className="text-xs text-slate-500">
                Dekanat nazorati ostidagi topshiriq va ko'rsatma yuborish
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

        {/* Selected Student Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-slate-900 text-sm">{student.fullName}</div>
            <div className="text-slate-500 mt-0.5">
              Guruh: <span className="font-semibold text-slate-800">{student.group}</span> • 
              Yo'nalish: <span className="font-semibold text-slate-800">{student.direction}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Talaba ID: <span className="font-mono text-slate-600">{student.studentId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-center">
              <div className="text-[10px] text-slate-400">GPA</div>
              <div className="font-bold text-sm text-indigo-700">{student.gpa.toFixed(2)}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-center">
              <div className="text-[10px] text-slate-400">Davomat</div>
              <div className={`font-bold text-sm ${student.attendanceRate < 90 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {student.attendanceRate}%
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-center">
              <div className="text-[10px] text-slate-400">Qoldirilgan</div>
              <div className={`font-bold text-sm ${student.missedHours >= 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                {student.missedHours} s.
              </div>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="my-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Referral Type Selector */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">
              Yo'naltirish Toifasi:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('muammoli')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  referralType === 'muammoli'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Muammoli</span>
                </div>
                <div className="text-[10px] text-slate-500">Past davomat, qarzdorlik</div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('nomzod')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  referralType === 'nomzod'
                    ? 'border-purple-500 bg-purple-50 text-purple-900 font-semibold ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                  <Star className="w-4 h-4" />
                  <span>Nomzod</span>
                </div>
                <div className="text-[10px] text-slate-500">Grant, stipendiya, a'lochi</div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('ixtiyoriy')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  referralType === 'ixtiyoriy'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <Info className="w-4 h-4" />
                  <span>Ixtiyoriy</span>
                </div>
                <div className="text-[10px] text-slate-500">Ijtimoiy o'rganish</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Mas'ul Tyutor:
              </label>
              <select
                value={targetTutor}
                onChange={(e) => setTargetTutor(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {tutorList.map((tut, i) => (
                  <option key={i} value={tut}>{tut}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Muhimlik Darajasi:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              >
                <option value="yuqori">🔴 Yuqori (Kechiktirib bo'lmas)</option>
                <option value="o'rta">🟡 O'rta daraja</option>
                <option value="oddiy">🟢 Oddiy rejaviy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Asos / Sababi:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Dekanat ushbu talabani nima sababdan nazoratga olayotgani..."
              className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Dekanat Topshirig'i / Tyutorga Ko'rsatma:
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Tyutor tomonidan bajarilishi lozim bo'lgan aniq vazifa va muddat..."
              className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
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
              <Send className="w-4 h-4" />
              <span>Tyutorga Uzatish & Topshiriq Yuborish</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
