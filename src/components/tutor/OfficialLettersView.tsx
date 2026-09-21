import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Send, 
  Search, 
  Filter, 
  Printer, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Users, 
  Download 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OfficialLetter } from '../../types';
import { ComposeLetterModal } from './ComposeLetterModal';
import { LetterPrintPreviewModal } from './LetterPrintPreviewModal';

export const OfficialLettersView: React.FC = () => {
  const { officialLetters, groups, letterTypes } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [previewLetter, setPreviewLetter] = useState<OfficialLetter | null>(null);

  // Filtering
  const filteredLetters = officialLetters.filter(letter => {
    const matchSearch = 
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (letter.studentName && letter.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      letter.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.group.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = selectedTypeFilter === 'all' || letter.letterType === selectedTypeFilter;
    const matchGroup = selectedGroupFilter === 'all' || letter.group.toLowerCase() === selectedGroupFilter.toLowerCase();

    return matchSearch && matchType && matchGroup;
  });

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Aloqa Xatlari, Tushuntirish Xatlari va Rasmiy Bildirgilar
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Talabalar davomati, dars qoldirish holatlari va ota-onalar bilan rasmiy xat yozishmalari
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yangi Xat Tuzish / Yuklash
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Qidiruv: raqam, mavzu, talaba..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type filter */}
        <div>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha Xat Turlari ({letterTypes.length})</option>
            {letterTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Group filter */}
        <div>
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-medium"
          >
            <option value="all">Barcha Guruhlar ({groups.length})</option>
            {groups.map(g => (
              <option key={g.id} value={g.name}>{g.name} - {g.direction}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Letters List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredLetters.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Tanlangan mezonlar bo'yicha hech qanday xat topilmadi.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLetters.map((letter) => (
              <div 
                key={letter.id} 
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                      {letter.letterNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                      {letter.letterType}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {letter.group}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {letter.createdAt}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {letter.title}
                  </h4>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {letter.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    {letter.studentName && (
                      <span>Talaba: <strong className="text-slate-700">{letter.studentName}</strong></span>
                    )}
                    {letter.reason && (
                      <span>Asos: <span className="text-slate-600 italic">"{letter.reason}"</span></span>
                    )}
                    {letter.fileName && (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        <Paperclip className="w-3 h-3" />
                        {letter.fileName} ({letter.fileSize})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => setPreviewLetter(letter)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    Rasmiy Ko'rinish & Chop Etish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <ComposeLetterModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />

      {/* Print Preview Modal */}
      <LetterPrintPreviewModal
        letter={previewLetter}
        onClose={() => setPreviewLetter(null)}
      />
    </div>
  );
};
