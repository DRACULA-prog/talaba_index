import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OfficialLetter } from '../../types';
import { useApp } from '../../context/AppContext';

interface LetterPrintPreviewModalProps {
  letter: OfficialLetter | null;
  onClose: () => void;
}

export const LetterPrintPreviewModal: React.FC<LetterPrintPreviewModalProps> = ({
  letter,
  onClose
}) => {
  const { platformSettings } = useApp();

  if (!letter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Actions bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Rasmiy Hujjat Ko'rinishi ({letter.letterNumber})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              Chop Etish
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="my-6 p-8 bg-white border border-slate-300 rounded-xl shadow-xs text-slate-900 space-y-6 text-xs leading-relaxed font-serif">
          {/* Header with University emblem styling */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="text-sm font-bold tracking-wide uppercase">
              O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI
            </div>
            <div className="text-base font-black tracking-wider uppercase mt-1">
              {platformSettings.universityName.toUpperCase()}
            </div>
            <div className="text-xs font-bold tracking-wide uppercase mt-0.5 text-slate-700">
              {platformSettings.facultyName.toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-600 font-sans mt-1">
              Rasmiy xizmat yozishmasi va ma'lumotnomalar xizmati • Qo'qon shahri
            </div>
          </div>

          {/* Letter Info Meta */}
          <div className="flex justify-between font-sans text-xs">
            <div>
              <p>Xat raqami: <strong className="font-mono">{letter.letterNumber}</strong></p>
              <p>Sana: <strong>{letter.createdAt}</strong></p>
              <p>Turi: <span className="underline font-semibold">{letter.letterType}</span></p>
            </div>
            <div className="text-right">
              <p>Yo'nalish: <strong>{letter.direction}</strong></p>
              <p>Guruh: <strong className="font-mono">{letter.group}</strong></p>
              {letter.studentName && <p>Talaba: <strong>{letter.studentName}</strong></p>}
            </div>
          </div>

          {/* Title */}
          <div className="text-center font-bold text-sm uppercase py-2 tracking-wide font-sans">
            {letter.title}
          </div>

          {/* Content */}
          <div className="text-justify indent-8 text-[13px] leading-6 font-sans">
            {letter.content}
          </div>

          {letter.reason && (
            <div className="p-3 bg-slate-50 border-l-4 border-blue-600 font-sans text-xs">
              <strong>Asos (Sabab):</strong> {letter.reason}
            </div>
          )}

          {/* Signature & Stamp Mock */}
          <div className="pt-8 flex items-end justify-between font-sans">
            <div>
              <p className="font-semibold text-slate-700">Mas'ul Tyutor:</p>
              <p className="font-bold text-slate-900 mt-1">{letter.authorName}</p>
              <p className="text-[11px] text-slate-500 italic">(Elektron imzo bilan tasdiqlangan)</p>
            </div>

            <div className="text-center p-3 rounded-2xl border-2 border-dashed border-blue-600/60 bg-blue-50/40 text-blue-900">
              <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] font-bold uppercase tracking-wider">UniGrant E-Xizmat</div>
              <div className="text-[9px] text-blue-700 font-mono">№ {letter.letterNumber} / Tasdiqlandi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
