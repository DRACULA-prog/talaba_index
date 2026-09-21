import React from 'react';
import { 
  X, 
  GraduationCap, 
  Award, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Mail, 
  Phone, 
  FileText, 
  Send, 
  ShieldCheck, 
  KeyRound 
} from 'lucide-react';
import { Student } from '../../types';

interface StudentProfileDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onComposeLetter?: (student: Student) => void;
}

export const StudentProfileDetailModal: React.FC<StudentProfileDetailModalProps> = ({
  student,
  onClose,
  onComposeLetter
}) => {
  if (!student) return null;

  const verifiedAchievements = student.achievements.filter(a => a.status === 'tasdiqlandi');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-slate-900 text-lg">
                  {student.fullName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {student.group}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Talaba ID: <strong className="font-mono text-slate-700">{student.studentId}</strong> • {student.direction} • {student.course}-kurs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-xs">
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <span className="text-slate-500 text-[11px]">Joriy GPA</span>
            <div className="text-xl font-bold font-display text-indigo-700 mt-0.5">
              {student.gpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-slate-500 text-[11px]">Davomat Ko'rsatkichi</span>
            <div className="text-xl font-bold font-display text-emerald-700 mt-0.5">
              {student.attendanceRate}%
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <span className="text-slate-500 text-[11px]">Qoldirilgan Darslar</span>
            <div className="text-xl font-bold font-display text-amber-700 mt-0.5">
              {student.missedHours} soat
            </div>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <span className="text-slate-500 text-[11px]">Tasdiqlangan Yutuqlar</span>
            <div className="text-xl font-bold font-display text-purple-700 mt-0.5">
              {verifiedAchievements.length} ta
            </div>
          </div>
        </div>

        {/* Action Button: Compose letter */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Ushbu talabaga aloqa xati, ogohlantirish yoki dekanatga bildirgi tuzish:</span>
          </div>
          {onComposeLetter && (
            <button
              onClick={() => {
                onClose();
                onComposeLetter(student);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Xat Tuzish
            </button>
          )}
        </div>

        {/* Subjects & Grades Table */}
        <div className="space-y-3 mb-6">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Fanlar bo'yicha baholari va davomati ({student.subjects.length} ta fan)
          </h4>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-2.5">Fan Nomi</th>
                  <th className="p-2.5 text-center">Kredit</th>
                  <th className="p-2.5 text-center">To'plangan Ball</th>
                  <th className="p-2.5 text-center">Baho</th>
                  <th className="p-2.5 text-center">Davomat</th>
                  <th className="p-2.5 text-right">O'qituvchi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.subjects.map((sub, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-800">{sub.subjectName}</td>
                    <td className="p-2.5 text-center text-slate-500">{sub.credits}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900">
                      {sub.score} <span className="text-slate-400 font-normal text-[10px]">/ 100</span>
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.gradeLetter}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-semibold text-emerald-700">
                      {sub.attendanceRate}%
                    </td>
                    <td className="p-2.5 text-right text-slate-600">{sub.teacherName || "Kafedra"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-3 mb-6">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            Talaba Shaxsiy Yutuqlari va Sertifikatlari ({student.achievements.length} ta)
          </h4>

          {student.achievements.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
              Ushbu talaba tomonidan hali yutuqlar yuklanmagan
            </div>
          ) : (
            <div className="space-y-2.5">
              {student.achievements.map((ach) => (
                <div key={ach.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{ach.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600">
                        {ach.category.replace('_', ' ')}
                      </span>
                    </div>
                    {ach.studentComment && (
                      <p className="text-slate-600 italic mt-1 text-[11px]">"{ach.studentComment}"</p>
                    )}
                    {ach.reviewComment && (
                      <p className="text-blue-700 font-medium mt-1 text-[11px]">
                        Tyutor xulosasi: {ach.reviewComment}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {ach.status === 'tasdiqlandi' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                        Tasdiqlangan (+{ach.bonusPoints} ball)
                      </span>
                    ) : ach.status === 'rad_etildi' ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                        Rad etilgan
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[10px]">
                        Kutilmoqda
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credentials & Parent code info */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-600">Talaba Logini: <strong className="font-mono text-indigo-700">{student.login}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Ota-ona Kirish Kodi: <strong className="font-mono text-amber-700">{student.parentCode}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
