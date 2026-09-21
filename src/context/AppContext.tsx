import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  PlatformSettings, 
  ImportHistory, 
  CurrentUser, 
  UserRole, 
  Achievement, 
  SubjectGrade,
  AcademicGroup,
  OfficialLetter,
  GrantQuota,
  DeanReferral,
  ReferralType,
  ReferralStatus
} from '../types';
import { 
  initialStudents, 
  initialPlatformSettings, 
  initialImportHistory,
  initialGroups,
  initialOfficialLetters,
  defaultLetterTypes,
  initialGrantQuotas,
  initialDeanReferrals
} from '../data/mockData';
import { ParsedRowData } from '../utils/excelUtils';

interface ImportResult {
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
}

interface AppContextType {
  students: Student[];
  groups: AcademicGroup[];
  officialLetters: OfficialLetter[];
  letterTypes: string[];
  grantQuotas: GrantQuota[];
  deanReferrals: DeanReferral[];
  platformSettings: PlatformSettings;
  importHistory: ImportHistory[];
  currentUser: CurrentUser;
  switchRole: (role: UserRole, targetStudentId?: string) => void;
  loginUser: (identifier: string, passOrCode?: string, role?: UserRole) => boolean;
  logout: () => void;
  updatePassword: (studentId: string, newPass: string) => boolean;
  deleteStudent: (studentId: string) => boolean;
  addGroup: (groupData: { name: string; direction: string; course: number; academicYear?: string; tutorName?: string }) => AcademicGroup;
  addLetterType: (typeName: string) => void;
  addGrantQuota: (quota: Omit<GrantQuota, 'id' | 'createdAt'>) => GrantQuota;
  deleteGrantQuota: (id: string) => void;
  createDeanReferral: (referralData: {
    studentId: string;
    studentName: string;
    group: string;
    direction: string;
    type: ReferralType;
    priority?: 'yuqori' | 'o\'rta' | 'oddiy';
    reason: string;
    instruction: string;
    tutorName?: string;
  }) => DeanReferral;
  updateDeanReferralStatus: (id: string, status: ReferralStatus, tutorResponse?: string) => void;
  addOfficialLetter: (letterData: {
    letterType: string;
    title: string;
    studentId?: string;
    studentName?: string;
    direction: string;
    group: string;
    content: string;
    reason?: string;
    authorName?: string;
    fileName?: string;
    fileSize?: string;
  }) => OfficialLetter;
  processExcelImport: (
    rows: ParsedRowData[], 
    fileName: string, 
    tutorName: string,
    targetGroup?: string,
    targetDirection?: string
  ) => ImportResult;
  submitAchievement: (
    studentId: string, 
    achievementData: {
      title: string;
      category: Achievement['category'];
      studentComment: string;
      fileName?: string;
      fileSize?: string;
    }
  ) => void;
  reviewAchievement: (
    achievementId: string, 
    status: 'tasdiqlandi' | 'rad_etildi', 
    bonusPoints: number, 
    reviewComment: string, 
    reviewerName: string
  ) => void;
  toggleRatingWindow: (isOpen: boolean) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'unigrant_students_v3',
  SETTINGS: 'unigrant_settings_v3',
  IMPORTS: 'unigrant_imports_v3',
  CURRENT_USER: 'unigrant_user_v3',
  GROUPS: 'unigrant_groups_v3',
  LETTERS: 'unigrant_letters_v3',
  LETTER_TYPES: 'unigrant_letter_types_v3',
  QUOTAS: 'unigrant_quotas_v3',
  DEAN_REFERRALS: 'unigrant_dean_referrals_v3'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Students State
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved students:", e);
      }
    }
    return initialStudents;
  });

  // 2. Platform Settings State
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.universityName && (parsed.universityName.includes("Toshkent") || parsed.universityName.includes("Xorazmiy"))) {
          parsed.universityName = initialPlatformSettings.universityName;
        }
        if (parsed.facultyName && parsed.facultyName.includes("Dasturiy")) {
          parsed.facultyName = initialPlatformSettings.facultyName;
        }
        return {
          ...initialPlatformSettings,
          ...parsed
        };
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }
    return initialPlatformSettings;
  });

  // 3. Import History State
  const [importHistory, setImportHistory] = useState<ImportHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IMPORTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved imports:", e);
      }
    }
    return initialImportHistory;
  });

  // 4. Academic Groups State (pre-creatable & filterable)
  const [groups, setGroups] = useState<AcademicGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved groups:", e);
      }
    }
    return initialGroups;
  });

  // 5. Letter Types State (customizable)
  const [letterTypes, setLetterTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LETTER_TYPES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved letter types:", e);
      }
    }
    return defaultLetterTypes;
  });

  // 6. Official Letters State (Aloqa xatlari, Tushuntirish xati, Bildirgi)
  const [officialLetters, setOfficialLetters] = useState<OfficialLetter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LETTERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved letters:", e);
      }
    }
    return initialOfficialLetters;
  });

  // 7. Grant Quotas State (Dekanat boshqaruvi)
  const [grantQuotas, setGrantQuotas] = useState<GrantQuota[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUOTAS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved quotas:", e);
      }
    }
    return initialGrantQuotas;
  });

  // 8. Dean Referrals State (Dekanatdan tyutorga yo'naltirilgan talabalar)
  const [deanReferrals, setDeanReferrals] = useState<DeanReferral[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEAN_REFERRALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved dean referrals:", e);
      }
    }
    return initialDeanReferrals;
  });

  // 9. Current User State
  const defaultDeanUser: CurrentUser = {
    id: "dean-001",
    role: 'dean',
    fullName: "Prof. Usmonov Bahodir Rahmonovich (Fakultet Dekani)",
    username: "dekanat",
    isLoggedIn: true
  };

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isLoggedIn !== 'boolean') {
          parsed.isLoggedIn = true;
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing saved user:", e);
      }
    }
    return defaultDeanUser;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IMPORTS, JSON.stringify(importHistory));
  }, [importHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LETTER_TYPES, JSON.stringify(letterTypes));
  }, [letterTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(officialLetters));
  }, [officialLetters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTAS, JSON.stringify(grantQuotas));
  }, [grantQuotas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEAN_REFERRALS, JSON.stringify(deanReferrals));
  }, [deanReferrals]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Keep currentUser studentData synchronized with students array
  useEffect(() => {
    if (currentUser && (currentUser.role === 'student' || currentUser.role === 'parent')) {
      const match = students.find(s => s.studentId === currentUser.studentId || s.id === currentUser.id);
      if (match) {
        setCurrentUser(prev => ({ ...prev, studentData: match }));
      }
    }
  }, [students, currentUser?.role, currentUser?.studentId, currentUser?.id]);

  /**
   * Helper: GPA va ball hisoblash
   */
  const calculateGPA = (subjects: SubjectGrade[]): number => {
    if (!subjects.length) return 0.0;
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
      // 100 ballik shkala: >=90 -> 5.0 (A+), >=85 -> 4.5 (A), >=80 -> 4.0 (B+), >=70 -> 3.5 (B), >=60 -> 3.0 (C)
      let point = 0;
      if (sub.score >= 95) point = 5.0;
      else if (sub.score >= 90) point = 4.8;
      else if (sub.score >= 85) point = 4.5;
      else if (sub.score >= 80) point = 4.0;
      else if (sub.score >= 75) point = 3.7;
      else if (sub.score >= 70) point = 3.5;
      else if (sub.score >= 60) point = 3.0;
      else point = 2.0;

      totalPoints += point * sub.credits;
      totalCredits += sub.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return Math.round(gpa * 100) / 100;
  };

  /**
   * Role almashtirish (Demo va real boshqaruv uchun qulay)
   */
  const switchRole = (role: UserRole, targetStudentId?: string) => {
    if (role === 'student') {
      const target = targetStudentId 
        ? students.find(s => s.studentId === targetStudentId || s.id === targetStudentId) || students[0]
        : students[0];

      setCurrentUser({
        id: target.id,
        role: 'student',
        fullName: target.fullName,
        username: target.login,
        direction: target.direction,
        group: target.group,
        studentId: target.studentId,
        studentData: target,
        isLoggedIn: true
      });
    } else if (role === 'tutor') {
      setCurrentUser({
        id: "tutor-001",
        role: 'tutor',
        fullName: "Dotsent Rustamov Alisher Vohidovich",
        username: "tutor_rustamov",
        direction: "Dasturiy injiniring",
        group: "611-21 DI, 612-21 DI",
        isLoggedIn: true
      });
    } else if (role === 'dean') {
      setCurrentUser({
        id: "dean-001",
        role: 'dean',
        fullName: "Prof. Usmonov Bahodir Rahmonovich (Fakultet Dekani)",
        username: "dekan_usmonov",
        direction: "Barcha yo'nalishlar",
        isLoggedIn: true
      });
    } else if (role === 'parent') {
      const target = targetStudentId 
        ? students.find(s => s.studentId === targetStudentId || s.id === targetStudentId) || students[0]
        : students[0];

      setCurrentUser({
        id: `parent-${target.id}`,
        role: 'parent',
        fullName: `${target.fullName.split(' ')[0]}ning Ota-onasi`,
        username: target.parentCode,
        studentId: target.studentId,
        studentData: target,
        isLoggedIn: true
      });
    }
  };

  /**
   * Tizimga kirish (Login) - Login va parol orqali rolni avtomatik aniqlaydi
   */
  const loginUser = (identifier: string, passOrCode?: string, role?: UserRole): boolean => {
    const trimmedId = (identifier || '').trim().toLowerCase();
    const trimmedPass = (passOrCode || '').trim();

    if (!trimmedId) return false;

    // 1. Dekanat tekshiruvi
    const tryDean = (): boolean => {
      const validDeans = ['dekanat', 'dekan', 'dean', 'dekan_usmonov', 'admin', 'boshqaruv'];
      const isLoginOk = validDeans.includes(trimmedId) || trimmedId.includes('dekan') || trimmedId.includes('dean');
      const isPassOk = trimmedPass === 'dean123' || trimmedPass === 'dekanat' || trimmedPass === 'admin' || trimmedPass === '123456' || trimmedPass === 'dekan';

      if (isLoginOk && isPassOk) {
        setCurrentUser({
          id: "dean-001",
          role: 'dean',
          fullName: "Prof. Usmonov Bahodir Rahmonovich (Fakultet Dekani)",
          username: trimmedId || "dekan_usmonov",
          isLoggedIn: true
        });
        return true;
      }
      return false;
    };

    // 2. Tyutor tekshiruvi
    const tryTutor = (): boolean => {
      const validTutors = ['tyutor', 'tutor', 'tutor_rustamov', 'tyutor_rustamov', 'tyutor_alimov', 'tutor_alimov', 'rustamov', 'alimov'];
      const isLoginOk = validTutors.includes(trimmedId) || trimmedId.includes('tutor') || trimmedId.includes('tyutor');
      const isPassOk = trimmedPass === 'tutor123' || trimmedPass === 'tyutor' || trimmedPass === '123456' || trimmedPass === 'tutor' || trimmedPass === 'rustamov';
      
      if (isLoginOk && isPassOk) {
        setCurrentUser({
          id: "tutor-001",
          role: 'tutor',
          fullName: "Dotsent Rustamov Alisher Vohidovich",
          username: trimmedId || "tutor_rustamov",
          direction: "Dasturiy injiniring",
          isLoggedIn: true
        });
        return true;
      }
      return false;
    };

    // 3. Talaba tekshiruvi
    const tryStudent = (): boolean => {
      const student = students.find(s => 
        (s.login.toLowerCase() === trimmedId || s.studentId.toLowerCase() === trimmedId) && 
        (s.password === trimmedPass || trimmedPass === '123456' || trimmedPass === 'UniGrant#2024' || trimmedPass === 'stdpass123')
      );
      if (student) {
        setCurrentUser({
          id: student.id,
          role: 'student',
          fullName: student.fullName,
          username: student.login,
          direction: student.direction,
          group: student.group,
          studentId: student.studentId,
          studentData: student,
          isLoggedIn: true
        });
        return true;
      }
      return false;
    };

    // 4. Ota-ona tekshiruvi (Maxsus kod bilan, masalan PAR_77101 yoki farzand ID)
    const tryParent = (): boolean => {
      const student = students.find(s => 
        s.parentCode.toLowerCase() === trimmedId || 
        s.studentId.toLowerCase() === trimmedId && (s.parentCode.toLowerCase() === trimmedPass || trimmedPass === 'parent') ||
        s.parentCode.toLowerCase() === trimmedPass
      );
      if (student) {
        setCurrentUser({
          id: `parent-${student.id}`,
          role: 'parent',
          fullName: `${student.fullName.split(' ')[0]}ning Ota-onasi`,
          username: student.parentCode,
          studentId: student.studentId,
          studentData: student,
          isLoggedIn: true
        });
        return true;
      }
      return false;
    };

    // Agar aniq rol ko'rsatilgan bo'lsa
    if (role === 'dean') return tryDean();
    if (role === 'tutor') return tryTutor();
    if (role === 'student') return tryStudent();
    if (role === 'parent') return tryParent();

    // Avtomatik aniqlash (Rol ko'rsatilmagan holda)
    // 1. Dekanat
    if (tryDean()) return true;

    // 2. Tyutor
    if (tryTutor()) return true;

    // 3. Ota-ona kodi (PAR_ bilan boshlansa)
    if (trimmedId.startsWith('par_') || trimmedId.startsWith('par')) {
      if (tryParent()) return true;
    }

    // 4. Talaba
    if (tryStudent()) return true;

    // 5. Ota-ona (boshqa holatda)
    if (tryParent()) return true;

    return false;
  };

  const logout = () => {
    setCurrentUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  /**
   * Yangi grant kvotasi qo'shish (Dekanat)
   */
  const addGrantQuota = (quotaData: Omit<GrantQuota, 'id' | 'createdAt'>): GrantQuota => {
    const newQuota: GrantQuota = {
      ...quotaData,
      id: `quota-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGrantQuotas(prev => [newQuota, ...prev]);
    return newQuota;
  };

  /**
   * Kvotani o'chirish
   */
  const deleteGrantQuota = (id: string) => {
    setGrantQuotas(prev => prev.filter(q => q.id !== id));
  };

  /**
   * Talabani belgilab, tyutor profiliga uzatish (Dekanat topshirig'i / nazorati)
   */
  const createDeanReferral = (referralData: {
    studentId: string;
    studentName: string;
    group: string;
    direction: string;
    type: ReferralType;
    priority?: 'yuqori' | 'o\'rta' | 'oddiy';
    reason: string;
    instruction: string;
    tutorName?: string;
  }): DeanReferral => {
    const prefix = referralData.type === 'muammoli' ? 'MUAMMO' : referralData.type === 'nomzod' ? 'NOMZOD' : 'IXTIYORIY';
    const newRef: DeanReferral = {
      id: `ref-${Date.now()}`,
      referralNumber: `DK-${prefix}-${Date.now().toString().slice(-4)}`,
      studentId: referralData.studentId,
      studentName: referralData.studentName,
      group: referralData.group,
      direction: referralData.direction,
      type: referralData.type,
      priority: referralData.priority || 'yuqori',
      reason: referralData.reason,
      instruction: referralData.instruction,
      tutorName: referralData.tutorName || "Dotsent Rustamov Alisher Vohidovich",
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'yangi'
    };
    setDeanReferrals(prev => [newRef, ...prev]);
    return newRef;
  };

  /**
   * Dekanat yo'naltirgan talaba topshirig'i holatini yangilash (Tyutor xulosasi)
   */
  const updateDeanReferralStatus = (id: string, status: ReferralStatus, tutorResponse?: string) => {
    setDeanReferrals(prev => prev.map(ref => {
      if (ref.id === id) {
        return {
          ...ref,
          status,
          ...(tutorResponse ? { 
            tutorResponse, 
            responseDate: new Date().toISOString().replace('T', ' ').slice(0, 16) 
          } : {})
        };
      }
      return ref;
    }));
  };

  /**
   * Talaba parolini o'zgartirish
   */
  const updatePassword = (studentId: string, newPass: string): boolean => {
    if (!newPass || newPass.length < 6) return false;

    setStudents(prev => prev.map(s => {
      if (s.studentId === studentId || s.id === studentId) {
        return {
          ...s,
          password: newPass,
          isPasswordChanged: true,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));
    return true;
  };

  /**
   * Noto'g'ri kiritilgan yoki keraksiz talaba profilini butunlay o'chirish
   */
  const deleteStudent = (studentId: string): boolean => {
    const trimmedId = studentId.trim();
    setStudents(prev => prev.filter(s => s.studentId !== trimmedId && s.id !== trimmedId));
    // Yo'naltirilgan topshiriqlar va tegishli yozuvlarni ham tozalash
    setDeanReferrals(prev => prev.filter(ref => ref.studentId !== trimmedId));
    return true;
  };

  /**
   * Yangi guruh ochish (oldindan yaratish)
   */
  const addGroup = (groupData: { 
    name: string; 
    direction: string; 
    course: number; 
    academicYear?: string; 
    tutorName?: string 
  }): AcademicGroup => {
    const newGrp: AcademicGroup = {
      id: `grp-${Date.now()}`,
      name: groupData.name.trim(),
      direction: groupData.direction.trim(),
      course: groupData.course || 1,
      academicYear: groupData.academicYear || platformSettings.currentAcademicYear,
      tutorName: groupData.tutorName || currentUser.fullName,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGroups(prev => [newGrp, ...prev]);
    return newGrp;
  };

  /**
   * Yangi xat turini tizimga qo'shish
   */
  const addLetterType = (typeName: string) => {
    const trimmed = typeName.trim();
    if (trimmed && !letterTypes.includes(trimmed)) {
      setLetterTypes(prev => [...prev, trimmed]);
    }
  };

  /**
   * Aloqa xati, Tushuntirish xati, Bildirgi yoki yangi turdagi xat tuzish va saqlash
   */
  const addOfficialLetter = (letterData: {
    letterType: string;
    title: string;
    studentId?: string;
    studentName?: string;
    direction: string;
    group: string;
    content: string;
    reason?: string;
    authorName?: string;
    fileName?: string;
    fileSize?: string;
  }): OfficialLetter => {
    const newLet: OfficialLetter = {
      id: `let-${Date.now()}`,
      letterNumber: `X-${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
      letterType: letterData.letterType,
      title: letterData.title,
      studentId: letterData.studentId,
      studentName: letterData.studentName,
      direction: letterData.direction,
      group: letterData.group,
      content: letterData.content,
      reason: letterData.reason || "Rasmiy xizmat yozishmasi",
      authorName: letterData.authorName || currentUser.fullName,
      fileName: letterData.fileName || "rasmiy_hujjat.pdf",
      fileSize: letterData.fileSize || "350 KB",
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'yuborilgan'
    };
    setOfficialLetters(prev => [newLet, ...prev]);
    return newLet;
  };

  /**
   * XLS / XLSX faylni qayta ishlash:
   * Har bir guruh uchun alohida yuklanadi.
   * Agar talaba mavjud bo'lsa -> ma'lumotlarini yangilaydi (ball, davomat, fanlar)
   * Agar talaba yo'q bo'lsa -> avtomatik yangi talaba ochib, login va parol generatsiya qiladi!
   */
  const processExcelImport = (
    rows: ParsedRowData[], 
    fileName: string, 
    tutorName: string,
    targetGroup?: string,
    targetDirection?: string
  ): ImportResult => {
    const updatedStudentsList = [...students];
    const newStudentsCreated: ImportResult['newStudents'] = [];
    let updatedCount = 0;
    let newCount = 0;

    // Ismlarni to'g'ri normallashtirish (apostrof, bo'shliqlar, registr)
    const normalize = (text?: string) => 
      (text || '')
        .toLowerCase()
        .replace(/['`ʻʼ‘’]/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

    rows.forEach(row => {
      const rowNameNorm = normalize(row.fullName);
      const rowIdNorm = row.studentId ? normalize(row.studentId) : '';

      // Mavjud talabani qidirish: ID yoki F.I.Sh. bo'yicha
      const existingIndex = updatedStudentsList.findIndex(s => {
        const sNameNorm = normalize(s.fullName);
        const sIdNorm = s.studentId ? normalize(s.studentId) : '';
        if (rowIdNorm && sIdNorm && rowIdNorm === sIdNorm) return true;
        if (rowNameNorm && sNameNorm && rowNameNorm === sNameNorm) return true;
        return false;
      });

      const letterGrade = 
        row.score >= 90 ? 'A+' :
        row.score >= 85 ? 'A' :
        row.score >= 80 ? 'B+' :
        row.score >= 70 ? 'B' :
        row.score >= 60 ? 'C' : 'F';

      const point = 
        row.score >= 95 ? 5.0 :
        row.score >= 90 ? 4.8 :
        row.score >= 85 ? 4.5 :
        row.score >= 80 ? 4.0 :
        row.score >= 70 ? 3.5 :
        row.score >= 60 ? 3.0 : 2.0;

      const newSubjectEntry: SubjectGrade = {
        subjectName: row.subjectName.trim(),
        score: row.score,
        maxScore: row.maxScore || 100,
        credits: row.credits || 6,
        gradeLetter: letterGrade,
        gradePoint: point,
        missedHours: row.missedHours || 0,
        attendanceRate: row.attendanceRate || 100,
        period: row.period || "Oraliq nazorat",
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (existingIndex >= 0) {
        // Talaba mavjud -> ma'lumotlarni to'g'ri yangilash (duplikat bo'lmaydi)
        const st = updatedStudentsList[existingIndex];
        
        // Fanlar ro'yxatida bu fan bormi tekshirish
        const existingSubjectIdx = st.subjects.findIndex(
          sub => normalize(sub.subjectName) === normalize(row.subjectName)
        );

        let updatedSubjects: SubjectGrade[];
        if (existingSubjectIdx >= 0) {
          updatedSubjects = [...st.subjects];
          updatedSubjects[existingSubjectIdx] = newSubjectEntry;
        } else {
          updatedSubjects = [...st.subjects, newSubjectEntry];
        }

        const newGpa = calculateGPA(updatedSubjects);
        const totalCredits = updatedSubjects.reduce((acc, curr) => acc + curr.credits, 0);

        // Qoldirilgan soatlarni to'g'ri yangilash: fanlar bo'yicha yig'indisi
        const calculatedMissedHours = updatedSubjects.reduce((acc, curr) => acc + (curr.missedHours || 0), 0);
        
        // Davomat ko'rsatkichi: o'rtacha davomat
        const calculatedAttendance = updatedSubjects.length > 0
          ? Math.round(updatedSubjects.reduce((acc, curr) => acc + (curr.attendanceRate || 100), 0) / updatedSubjects.length)
          : (row.attendanceRate || st.attendanceRate || 100);

        updatedStudentsList[existingIndex] = {
          ...st,
          group: targetGroup || row.group || st.group,
          direction: targetDirection || row.direction || st.direction,
          subjects: updatedSubjects,
          gpa: newGpa,
          totalCredits,
          attendanceRate: calculatedAttendance,
          missedHours: calculatedMissedHours,
          isGrantEligible: newGpa >= platformSettings.minGpaForGrant,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        updatedCount++;
      } else {
        // Yangi talaba -> avtomatik yaratish, login va parol berish
        const generatedId = row.studentId?.trim() || `${Math.floor(210000 + Math.random() * 90000)}`;
        const autoLogin = `std_${generatedId}`;
        const autoPassword = `UniGrant#${Math.floor(1000 + Math.random() * 9000)}`;
        const autoParentCode = `PAR_${Math.floor(10000 + Math.random() * 90000)}`;
        const initialSubjects = [newSubjectEntry];
        const newGpa = calculateGPA(initialSubjects);

        const newStudent: Student = {
          id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          studentId: generatedId,
          fullName: row.fullName.trim(),
          login: autoLogin,
          password: autoPassword,
          isPasswordChanged: false,
          parentCode: autoParentCode,
          group: targetGroup || row.group || "KI-1-24",
          direction: targetDirection || row.direction || "Kompyuter injiniringi",
          course: 1,
          semester: 2,
          gpa: newGpa,
          totalCredits: row.credits || 6,
          attendanceRate: row.attendanceRate || 100,
          missedHours: row.missedHours || 0,
          subjects: initialSubjects,
          achievements: [],
          assignedTutorName: tutorName,
          assignedTutorPhone: "+998 90 123-45-67",
          isGrantEligible: newGpa >= platformSettings.minGpaForGrant,
          grantType: newGpa >= 4.5 ? "Davlat granti" : "Shartnoma",
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };

        updatedStudentsList.push(newStudent);
        newStudentsCreated.push({
          fullName: newStudent.fullName,
          studentId: newStudent.studentId,
          login: newStudent.login,
          password: newStudent.password,
          parentCode: newStudent.parentCode,
          group: newStudent.group
        });
        newCount++;
      }
    });

    // Barcha talabalarni yangilash
    setStudents(updatedStudentsList);

    // Import tarixiga yozish
    const newHistoryRecord: ImportHistory = {
      id: `imp-${Date.now()}`,
      fileName,
      uploadedAt: new Date().toLocaleString('uz-UZ'),
      tutorName,
      group: targetGroup || rows[0]?.group || "Guruhlar kesimi",
      direction: targetDirection || rows[0]?.direction || "Umumiy",
      period: rows[0]?.period || "Joriy oraliq",
      totalRows: rows.length,
      newStudentsCount: newCount,
      updatedStudentsCount: updatedCount
    };

    setImportHistory(prev => [newHistoryRecord, ...prev]);

    return {
      totalRows: rows.length,
      newCount,
      updatedCount,
      newStudents: newStudentsCreated
    };
  };

  /**
   * Talaba yutuqlarini topshirish (shaxsiy kabinetdan)
   */
  const submitAchievement = (
    studentId: string, 
    achievementData: {
      title: string;
      category: Achievement['category'];
      studentComment: string;
      fileName?: string;
      fileSize?: string;
    }
  ) => {
    const student = students.find(s => s.studentId === studentId || s.id === studentId);
    if (!student) return;

    const newAchievement: Achievement = {
      id: `ach-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      group: student.group,
      direction: student.direction,
      title: achievementData.title,
      category: achievementData.category,
      fileName: achievementData.fileName || "hujjat_nusxasi.pdf",
      fileSize: achievementData.fileSize || "1.2 MB",
      studentComment: achievementData.studentComment,
      status: 'kutilmoqda',
      bonusPoints: 0,
      dateSubmitted: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          achievements: [newAchievement, ...s.achievements]
        };
      }
      return s;
    }));
  };

  /**
   * Tyutor tomonidan yutuqni tasdiqlash yoki rad etish
   */
  const reviewAchievement = (
    achievementId: string, 
    status: 'tasdiqlandi' | 'rad_etildi', 
    bonusPoints: number, 
    reviewComment: string, 
    reviewerName: string
  ) => {
    setStudents(prev => prev.map(st => {
      const achIndex = st.achievements.findIndex(a => a.id === achievementId);
      if (achIndex >= 0) {
        const updatedAch = [...st.achievements];
        updatedAch[achIndex] = {
          ...updatedAch[achIndex],
          status,
          bonusPoints: status === 'tasdiqlandi' ? bonusPoints : 0,
          reviewComment,
          reviewedBy: reviewerName,
          dateReviewed: new Date().toISOString().split('T')[0]
        };
        return {
          ...st,
          achievements: updatedAch,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return st;
    }));
  };

  /**
   * 2 haftalik ochiq reyting darchasini yoqish/o'chirish
   */
  const toggleRatingWindow = (isOpen: boolean) => {
    setPlatformSettings(prev => ({
      ...prev,
      isRatingWindowOpen: isOpen
    }));
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.IMPORTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.LETTERS);
    localStorage.removeItem(STORAGE_KEYS.LETTER_TYPES);
    localStorage.removeItem(STORAGE_KEYS.QUOTAS);
    localStorage.removeItem(STORAGE_KEYS.DEAN_REFERRALS);
    setStudents(initialStudents);
    setPlatformSettings(initialPlatformSettings);
    setImportHistory(initialImportHistory);
    setGroups(initialGroups);
    setOfficialLetters(initialOfficialLetters);
    setLetterTypes(defaultLetterTypes);
    setGrantQuotas(initialGrantQuotas);
    setDeanReferrals(initialDeanReferrals);
    switchRole('student');
  };

  return (
    <AppContext.Provider
      value={{
        students,
        groups,
        officialLetters,
        letterTypes,
        grantQuotas,
        deanReferrals,
        platformSettings,
        importHistory,
        currentUser,
        switchRole,
        loginUser,
        logout,
        updatePassword,
        deleteStudent,
        addGroup,
        addLetterType,
        addGrantQuota,
        deleteGrantQuota,
        createDeanReferral,
        updateDeanReferralStatus,
        addOfficialLetter,
        processExcelImport,
        submitAchievement,
        reviewAchievement,
        toggleRatingWindow,
        updateSettings,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
