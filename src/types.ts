export type UserRole = 'student' | 'tutor' | 'dean' | 'parent';

export type AchievementCategory = 
  | 'xalqaro_sertifikat' 
  | 'respublika_olimpiada' 
  | 'ilmiy_maqola' 
  | 'tavsiyanoma' 
  | 'sport_jamoatchilik';

export type AchievementStatus = 'kutilmoqda' | 'tasdiqlandi' | 'rad_etildi';

export interface SubjectGrade {
  subjectName: string;
  score: number; // 0 - 100
  maxScore: number;
  credits: number;
  gradeLetter: string; // 'A+', 'A', 'B+', 'B', 'C+', 'C', etc.
  gradePoint: number; // 4.5, 4.0, 3.5, etc.
  missedHours: number;
  attendanceRate: number; // percentage, e.g. 96
  period: string; // '1-Hafta', '1-Oy (Sentyabr)', etc.
  teacherName?: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  group: string;
  direction: string;
  title: string;
  category: AchievementCategory;
  fileName?: string;
  fileSize?: string;
  studentComment: string; // talaba izohi
  status: AchievementStatus;
  bonusPoints: number; // tyutor belgilagan qo'shimcha ballar (tenglikda hisoblanadi)
  dateSubmitted: string;
  reviewedBy?: string;
  reviewComment?: string;
  dateReviewed?: string;
}

export interface Student {
  id: string;
  studentId: string; // masalan, '210145'
  fullName: string;
  login: string;
  password: string;
  isPasswordChanged: boolean;
  parentCode: string;
  group: string; // masalan, '611-21 DI'
  direction: string; // masalan, 'Dasturiy injiniring'
  course: number; // 1, 2, 3, 4
  semester: number; // 1 - 8
  gpa: number; // 0.0 - 5.0
  totalCredits: number;
  attendanceRate: number; // percentage
  missedHours: number;
  subjects: SubjectGrade[];
  achievements: Achievement[];
  assignedTutorName: string;
  assignedTutorPhone: string;
  phone?: string;
  email?: string;
  isGrantEligible: boolean;
  grantType?: 'Davlat granti' | 'Oshirilgan stipendiya' | 'Rektor granti' | 'Shartnoma';
  createdAt: string;
  updatedAt: string;
}

export interface ImportHistory {
  id: string;
  fileName: string;
  uploadedAt: string;
  tutorName: string;
  group: string;
  direction: string;
  period: string;
  totalRows: number;
  newStudentsCount: number;
  updatedStudentsCount: number;
}

export interface AcademicGroup {
  id: string;
  name: string; // masalan, 'KI-1-24', 'TZ-1-24', 'EK-1-25'
  direction: string; // masalan, 'Kompyuter injiniringi', 'Turizm', 'Iqtisodiyot'
  course: number;
  academicYear: string;
  tutorName: string;
  createdAt: string;
}

export interface OfficialLetter {
  id: string;
  letterNumber: string; // masalan: 'X-2025/08'
  letterType: string; // 'Aloqa xati', 'Tushuntirish xati', 'Bildirgi', yoki yangi tur
  title: string;
  studentId?: string;
  studentName?: string;
  direction: string;
  group: string;
  content: string; // batafsil matn / tushuntirish
  reason?: string; // masalan: "Dars qoldirgani sababli", "Tartib-intizom", "Ota-onaga ma'lumot"
  authorName: string;
  fileName?: string;
  fileSize?: string;
  createdAt: string;
  status: 'yuborilgan' | 'kutilmoqda' | 'qabul_qilindi';
}

export interface PlatformSettings {
  universityName: string;
  facultyName: string;
  currentAcademicYear: string;
  currentSemester: number;
  isRatingWindowOpen: boolean; // 2 haftalik ochiq reyting darchasi
  ratingWindowStartDate: string;
  ratingWindowEndDate: string;
  grantQuotaPercentage: number; // e.g. Top 15%
  minGpaForGrant: number; // e.g. 4.20
}

export interface CurrentUser {
  id: string;
  role: UserRole;
  fullName: string;
  username: string;
  direction?: string;
  group?: string;
  studentId?: string; // If student or parent
  studentData?: Student;
  isLoggedIn?: boolean;
}

export type ReferralType = 'muammoli' | 'nomzod' | 'ixtiyoriy';
export type ReferralStatus = 'yangi' | 'jarayonda' | 'bajarildi';

export interface GrantQuota {
  id: string;
  title: string;
  quotaType: string;
  direction: string; // 'Barcha yo\'nalishlar' yoki aniq yo'nalish
  course: number | 'all';
  totalSeats: number;
  minGpa: number;
  minAttendanceRate: number;
  academicYear: string;
  semester: number;
  description?: string;
  createdAt: string;
}

export interface DeanReferral {
  id: string;
  referralNumber: string;
  studentId: string;
  studentName: string;
  group: string;
  direction: string;
  type: ReferralType;
  priority: 'yuqori' | 'o\'rta' | 'oddiy';
  reason: string;
  instruction: string;
  tutorName: string;
  createdAt: string;
  status: ReferralStatus;
  tutorResponse?: string;
  responseDate?: string;
  resolvedAt?: string;
}
