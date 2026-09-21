import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  FolderPlus, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GroupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: (groupName: string, directionName: string) => void;
}

export const GroupManagerModal: React.FC<GroupManagerModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated
}) => {
  const { groups, addGroup, students, currentUser } = useApp();

  // Existing directions
  const existingDirections = Array.from(new Set(groups.map(g => g.direction)));

  // Form states
  const [selectedDirection, setSelectedDirection] = useState(existingDirections[0] || "Kompyuter injiniringi");
  const [isCustomDirection, setIsCustomDirection] = useState(false);
  const [customDirectionName, setCustomDirectionName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [course, setCourse] = useState<number>(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalDirection = isCustomDirection ? customDirectionName.trim() : selectedDirection.trim();
    const finalGroupName = groupName.trim().toUpperCase();

    if (!finalDirection) {
      setError("Iltimos, ta'lim yo'nalishini kiriting yoki tanlang!");
      return;
    }

    if (!finalGroupName) {
      setError("Iltimos, guruh nomini kiriting (masalan: KI-1-24, TZ-1-24)!");
      return;
    }

    // Check if group already exists
    const exists = groups.some(g => g.name.toLowerCase() === finalGroupName.toLowerCase());
    if (exists) {
      setError(`"${finalGroupName}" nomli guruh tizimda allaqachon mavjud!`);
      return;
    }

    const created = addGroup({
      name: finalGroupName,
      direction: finalDirection,
      course,
      tutorName: currentUser.fullName
    });

    setSuccess(`"${finalGroupName}" guruhi muvaffaqiyatli yaratildi va ro'yxatga qo'shildi!`);
    if (onGroupCreated) {
      onGroupCreated(created.name, created.direction);
    }

    setGroupName('');
    if (isCustomDirection) {
      setCustomDirectionName('');
      setIsCustomDirection(false);
      setSelectedDirection(finalDirection);
    }

    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                Guruhlar va Yo'nalishlar Boshqaruvi
              </h3>
              <p className="text-xs text-slate-500">
                Fayl yuklashdan oldin yangi guruhlarni ro'yxatga kiritish
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

        {/* Add Group Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 my-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              Yangi Akademik Guruh Ochish
            </span>
            <button
              type="button"
              onClick={() => setIsCustomDirection(!isCustomDirection)}
              className="text-[11px] text-blue-700 font-semibold underline"
            >
              {isCustomDirection ? "Mavjud yo'nalishlardan tanlash" : "+ Yangi yo'nalish nomi yozish"}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ta'lim Yo'nalishi:
              </label>
              {isCustomDirection ? (
                <input
                  type="text"
                  placeholder="Masalan: Logistika, Biotibbiyot..."
                  value={customDirectionName}
                  onChange={(e) => setCustomDirectionName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <select
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {existingDirections.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Guruh Nomi (Kodi):
              </label>
              <input
                type="text"
                placeholder="Masalan: KI-1-24, TZ-2-25, EK-1-25..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bosqich (Kurs):
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1-kurs</option>
                <option value={2}>2-kurs</option>
                <option value={3}>3-kurs</option>
                <option value={4}>4-kurs</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Guruhni Saqlash
              </button>
            </div>
          </div>
        </form>

        {/* Existing Groups Overview */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Tizimda Ro'yxatdan O'tgan Guruhlar ({groups.length} ta guruh)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {groups.map(grp => {
              const studentCount = students.filter(s => s.group.toLowerCase() === grp.name.toLowerCase()).length;
              return (
                <div key={grp.id} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {grp.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {grp.course}-kurs
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {grp.direction}
                    </span>
                  </div>

                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold shrink-0 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    {studentCount} talaba
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
