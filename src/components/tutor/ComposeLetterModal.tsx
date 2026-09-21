import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  FileText, 
  Paperclip, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileCheck2,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

interface ComposeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedStudent?: Student | null;
  defaultGroup?: string;
}

export const ComposeLetterModal: React.FC<ComposeLetterModalProps> = ({
  isOpen,
  onClose,
  preSelectedStudent,
  defaultGroup
}) => {
  const { 
    groups, 
    students, 
    letterTypes, 
    addLetterType, 
    addOfficialLetter, 
    currentUser 
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>(letterTypes[0] || "Aloqa xati (Ota-onaga ogohlantirish)");
  const [isCreatingNewType, setIsCreatingNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const [selectedGroup, setSelectedGroup] = useState(defaultGroup || groups[0]?.name || "KI-1-24");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(preSelectedStudent?.studentId || '');
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('Dars qoldirgani sababli');
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // When group or preSelectedStudent changes
  useEffect(() => {
    if (preSelectedStudent) {
      setSelectedStudentId(preSelectedStudent.studentId);
      setSelectedGroup(preSelectedStudent.group);
      setTitle(`${preSelectedStudent.fullName} bo'yicha rasmiy xat`);
      if (preSelectedStudent.missedHours >= 10) {
        setContent(`Hurmatli ota-ona! Farzandingiz ${preSelectedStudent.fullName} ${preSelectedStudent.group} guruhida joriy oyda sababsiz ${preSelectedStudent.missedHours} soat dars qoldirdi. Davomat ${preSelectedStudent.attendanceRate}% gacha pasaygan. Talabaning grant holatini saqlab qolish va dars intizomini tiklash maqsadida tyutor bilan zudlik bilan uchrashishingizni so'raymiz.`);
      }
    }
  }, [preSelectedStudent]);

  if (!isOpen) return null;

  // Students in selected group
  const groupStudents = students.filter(s => s.group.toLowerCase() === selectedGroup.toLowerCase());
  const selectedGroupObj = groups.find(g => g.name.toLowerCase() === selectedGroup.toLowerCase());
  const directionName = selectedGroupObj?.direction || "Kompyuter injiniringi";

  const handleCreateType = () => {
    if (!newTypeName.trim()) return;
    addLetterType(newTypeName.trim());
    setSelectedType(newTypeName.trim());
    setNewTypeName('');
    setIsCreatingNewType(false);
  };

  const handleQuickTemplate = (templateType: string) => {
    const student = groupStudents.find(s => s.studentId === selectedStudentId) || groupStudents[0];
    const sName = student ? student.fullName : "Talaba";
    const sGroup = selectedGroup;

    if (templateType === 'aloqa_otaona') {
      setSelectedType("Aloqa xati (Ota-onaga ogohlantirish)");
      setTitle(`${sName}ning dars qoldirishi yuzasidan ota-onaga aloqa xati`);
      setReason("Dars qoldirgani sababli");
      setContent(`Hurmatli ota-ona! Farzandingiz ${sName} (${sGroup} guruhi) joriy oy mobaynida darslarda yetarli qatnashmayotganligi sababli ushbu aloqa xati yuborilmoqda. Farzandingizning darslarga o'z vaqtida qatnashishi va oraliq nazorat baholarini yaxshilashi uchun amaliy ko'mak berishingizni so'raymiz.`);
    } else if (templateType === 'tushuntirish') {
      setSelectedType("Tushuntirish xati (Talaba arizasi/tushuntirishi)");
      setTitle(`${sName} tomonidan dars qoldirish sabablari bo'yicha tushuntirish xati`);
      setReason("Sababli holat yuzasidan");
      setContent(`Men, ${sGroup} guruhi talabasi ${sName}, shu yilning oraliq davrida salomatligim / oilaviy sabablar tufayli dars qoldirishga majbur bo'ldim. Qoldirilgan darslar mavzularini o'zlashtirib, barcha laboratoriya va topshiriqlarni fan o'qituvchilariga to'liq topshirishni o'z zimmamga olaman.`);
    } else if (templateType === 'bildirgi') {
      setSelectedType("Bildirgi (Dekanatga xizmat xati)");
      setTitle(`${sGroup} guruhi talabasi ${sName}ni rag'batlantirish to'g'risida bildirgi`);
      setReason("Namunali xulq va fan yutuqlari");
      setContent(`Fakultet Dekanatiga: ${sGroup} guruhi talabasi ${sName} darslarda faol ishtirok etib, a'lo baholarga o'qib kelmoqda hamda xalqaro sertifikat/olimpiada sovrindori bo'lganligi munosabati bilan universitetning Maxsus stipendiyasiga tavsiya etiladi.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError("Iltimos, xat sarlavhasi va batafsil matnini to'ldiring!");
      return;
    }

    const currentStudent = groupStudents.find(s => s.studentId === selectedStudentId);

    addOfficialLetter({
      letterType: selectedType,
      title: title.trim(),
      studentId: currentStudent?.studentId,
      studentName: currentStudent?.fullName || "Guruh talabalari",
      direction: directionName,
      group: selectedGroup,
      content: content.trim(),
      reason: reason.trim(),
      authorName: currentUser.fullName,
      fileName: attachedFile ? attachedFile.name : undefined,
      fileSize: attachedFile ? `${(attachedFile.size / 1024).toFixed(0)} KB` : undefined
    });

    setSuccess("Rasmiy xat muvaffaqiyatli tuzildi va tizimga kiritildi!");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                Rasmiy Xat Tuzish va Yuklash
              </h3>
              <p className="text-xs text-slate-500">
                Aloqa xati, tushuntirish xati yoki dekanatga bildirgi
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

        {/* Quick Template Fill Buttons */}
        <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-600 mr-1">Tezkor shablonlar:</span>
          <button
            type="button"
            onClick={() => handleQuickTemplate('aloqa_otaona')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200 transition-colors"
          >
            Ota-onaga aloqa xati
          </button>
          <button
            type="button"
            onClick={() => handleQuickTemplate('tushuntirish')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold border border-blue-200 transition-colors"
          >
            Tushuntirish xati
          </button>
          <button
            type="button"
            onClick={() => handleQuickTemplate('bildirgi')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200 transition-colors"
          >
            Dekanatga bildirgi
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Letter Type selection & creation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                1. Xatning Turi:
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingNewType(!isCreatingNewType)}
                className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {isCreatingNewType ? "Ro'yxatdan tanlash" : "Yangi xat turi yaratish"}
              </button>
            </div>

            {isCreatingNewType ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Yangi xat turi nomi (masalan: Kafedra buyrug'i, Ogohlantirish...)"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreateType}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold shrink-0"
                >
                  Qo'shish
                </button>
              </div>
            ) : (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {letterTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Group and Student selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                2. Akademik Guruh:
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.name}>{g.name} ({g.direction})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                3. Tegishli Talaba:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Guruhning barcha talabalariga umumiy</option>
                {groupStudents.map(st => (
                  <option key={st.id} value={st.studentId}>
                    {st.fullName} (GPA: {st.gpa.toFixed(2)}, Davomat: {st.attendanceRate}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Title & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                4. Xat Sarlavhasi (Mavzusi):
              </label>
              <input
                type="text"
                placeholder="Masalan: Dars qoldirish holati bo'yicha aloqa xati"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                5. Asos / Sabab:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Dars qoldirgani sababli">Dars qoldirgani sababli (Davomat)</option>
                <option value="Oraliq baholar pastligi">Oraliq baholar pastligi (GPA xavfi)</option>
                <option value="Tartib-intizom buzilishi">Tartib-intizom va xulq</option>
                <option value="Namunali o'qish va yutuq">Namunali o'qish va yutuq (Rag'bat)</option>
                <option value="Ota-onaga ma'lumot berish">Ota-onaga ma'lumot berish</option>
              </select>
            </div>
          </div>

          {/* 4. Content / Body */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              6. Xat Matni va Tushuntirish Mazmuni:
            </label>
            <textarea
              rows={4}
              placeholder="Xatning to'liq rasmiy matnini yozing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-800"
              required
            />
          </div>

          {/* 5. Attachment File */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              7. Hujjat Fayli (Ixtiyoriy - .pdf, .docx, skaner):
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span>Fayl biriktirish</span>
                <input
                  type="file"
                  onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {attachedFile && (
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" />
                  {attachedFile.name} ({(attachedFile.size / 1024).toFixed(0)} KB)
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              Xatni Saqlash & Rasmiylashtirish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
