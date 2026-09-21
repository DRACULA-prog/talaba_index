import React, { useState } from 'react';
import { 
  Send, 
  AlertTriangle, 
  Star, 
  Info, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye, 
  MessageSquare, 
  Check, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, DeanReferral, ReferralStatus } from '../../types';

interface DeanReferralsViewProps {
  onInspectStudent: (student: Student) => void;
  onComposeLetterForStudent: (student: Student) => void;
}

export const DeanReferralsView: React.FC<DeanReferralsViewProps> = ({
  onInspectStudent,
  onComposeLetterForStudent
}) => {
  const { deanReferrals, updateDeanReferralStatus, students } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Response inline editing
  const [activeResponseId, setActiveResponseId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<ReferralStatus>('jarayonda');

  const filteredReferrals = deanReferrals.filter(ref => {
    const matchStatus = filterStatus === 'all' || ref.status === filterStatus;
    const matchType = filterType === 'all' || ref.type === filterType;
    return matchStatus && matchType;
  });

  const handleStartResponse = (referral: DeanReferral) => {
    setActiveResponseId(referral.id);
    setResponseText(referral.tutorResponse || '');
    setResponseStatus(referral.status === 'yangi' ? 'jarayonda' : referral.status);
  };

  const handleSaveResponse = (referralId: string) => {
    if (!responseText.trim()) return;
    updateDeanReferralStatus(referralId, responseStatus, responseText.trim());
    setActiveResponseId(null);
  };

  const pendingCount = deanReferrals.filter(r => r.status === 'yangi').length;
  const inProgressCount = deanReferrals.filter(r => r.status === 'jarayonda').length;
  const doneCount = deanReferrals.filter(r => r.status === 'bajarildi').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              Dekanatdan Kelgan Topshiriqlar & Nazoratdagi Talabalar
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {deanReferrals.length} ta topshiriq
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fakultet rahbariyati tomonidan alohida nazoratga olingan, nomzod yoki muammoli talabalar bo'yicha yo'riqnomalar
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">
            Yangi: <strong>{pendingCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            Jarayonda: <strong>{inProgressCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            Bajarildi: <strong>{doneCount}</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            Barchasi ({deanReferrals.length})
          </button>
          <button
            onClick={() => setFilterStatus('yangi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'yangi' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            Yangi ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('jarayonda')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'jarayonda' ? 'bg-white text-amber-800 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            Jarayonda ({inProgressCount})
          </button>
          <button
            onClick={() => setFilterStatus('bajarildi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'bajarildi' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            Bajarildi ({doneCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Toifasi:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Barcha toifalar</option>
            <option value="muammoli">Muammoli (davomat, intizom)</option>
            <option value="nomzod">Nomzod (grant, stipendiya)</option>
            <option value="ixtiyoriy">Ixtiyoriy (profilaktik)</option>
          </select>
        </div>
      </div>

      {/* Referrals Cards List */}
      <div className="space-y-4">
        {filteredReferrals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
            Ushbu filtr bo'yicha dekanat topshiriqlari mavjud emas.
          </div>
        ) : (
          filteredReferrals.map((referral) => {
            const studentObj = students.find(s => s.studentId === referral.studentId);
            const isEditing = activeResponseId === referral.id;

            return (
              <div 
                key={referral.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all hover:border-slate-300"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                      {referral.referralNumber}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      referral.type === 'muammoli'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : referral.type === 'nomzod'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {referral.type === 'muammoli' ? 'Muammoli talaba' : referral.type === 'nomzod' ? 'Grant/Stipendiya nomzodi' : 'Ixtiyoriy nazorat'}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      referral.priority === 'yuqori'
                        ? 'bg-rose-100 text-rose-800'
                        : referral.priority === 'o\'rta'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {referral.priority === 'yuqori' ? '🔴 Yuqori muhimlik' : referral.priority === 'o\'rta' ? '🟡 O\'rta' : '🟢 Oddiy'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {new Date(referral.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      referral.status === 'bajarildi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : referral.status === 'jarayonda'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {referral.status === 'bajarildi' ? 'Bajarildi' : referral.status === 'jarayonda' ? 'Jarayonda' : 'Yangi topshiriq'}
                    </span>
                  </div>
                </div>

                {/* Content row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 text-xs">
                  {/* Left: Student info */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm">{referral.studentName}</div>
                    <div className="text-slate-600">
                      Guruh: <span className="font-semibold">{referral.group}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">{referral.direction}</div>
                    <div className="text-slate-400 font-mono text-[10px]">ID: {referral.studentId}</div>

                    {studentObj && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-slate-400">GPA:</span>{' '}
                          <span className="font-bold text-indigo-700">{studentObj.gpa.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Davomat:</span>{' '}
                          <span className={`font-bold ${studentObj.attendanceRate < 90 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {studentObj.attendanceRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Qoldirgan:</span>{' '}
                          <span className="font-bold text-slate-700">{studentObj.missedHours} s.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Middle: Dean Reason & Instruction */}
                  <div className="lg:col-span-2 space-y-2.5">
                    <div>
                      <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider block mb-0.5">
                        Asos / Sababi:
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium bg-purple-50/40 p-2 rounded-lg border border-purple-100">
                        {referral.reason}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider block mb-0.5">
                        Dekanat Topshirig'i & Ko'rsatmasi:
                      </span>
                      <p className="text-slate-800 leading-relaxed">
                        {referral.instruction}
                      </p>
                    </div>

                    {/* Tutor's recorded response */}
                    {referral.tutorResponse && !isEditing && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 mt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 mb-1">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Tyutor Xulosasi & Amalga Oshirilgan Ishlar:
                          </span>
                          {(referral.resolvedAt || referral.responseDate) && (
                            <span className="text-[10px] text-emerald-600 font-normal">
                              {new Date(referral.resolvedAt || referral.responseDate || '').toLocaleDateString('uz-UZ')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed">{referral.tutorResponse}</p>
                      </div>
                    )}

                    {/* Tutor response form when editing */}
                    {isEditing && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-purple-200 space-y-2.5 mt-2">
                        <label className="block font-semibold text-slate-800 text-xs">
                          Tyutor Xulosasi va Ko'rilgan Chora:
                        </label>
                        <textarea
                          rows={3}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Talaba yoki ota-onasi bilan o'tkazilgan suhbat natijasi, olingan tushuntirish xati yoki erishilgan kelishuv..."
                          className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <label className="text-slate-600 text-xs font-medium">Holati:</label>
                            <select
                              value={responseStatus}
                              onChange={(e) => setResponseStatus(e.target.value as ReferralStatus)}
                              className="text-xs rounded-lg border border-slate-200 px-2 py-1 bg-white font-semibold"
                            >
                              <option value="jarayonda">🟡 Jarayonda (O'rganilmoqda)</option>
                              <option value="bajarildi">🟢 Bajarildi (Muammo bartaraf etildi)</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveResponseId(null)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100"
                            >
                              Bekor qilish
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveResponse(referral.id)}
                              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Saqlash & Dekanatga Jo'natish</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action buttons */}
                {!isEditing && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                    {studentObj && (
                      <button
                        onClick={() => onInspectStudent(studentObj)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Profil & Yutuqlarni ko'rish</span>
                      </button>
                    )}

                    {studentObj && (
                      <button
                        onClick={() => onComposeLetterForStudent(studentObj)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Aloqa / Tushuntirish xati tuzish</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleStartResponse(referral)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{referral.tutorResponse ? "Xulosani tahrirlash" : "Xulosa / Javob kiritish"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
