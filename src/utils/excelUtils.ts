import * as XLSX from 'xlsx';
import { Student } from '../types';

export interface ParsedRowData {
  fullName: string;
  studentId: string;
  group: string;
  direction: string;
  subjectName: string;
  score: number;
  maxScore: number;
  credits: number;
  missedHours: number;
  attendanceRate: number;
  period: string;
}

/**
 * Namuna uchun XLS/XLSX shablonini generatsiya qilish va yuklab berish
 */
export function downloadSampleExcel(direction = "Turizm", group = "TZ-1-24", period = "Oktyabr oyi (Oraliq)") {
  const sampleData = [
    {
      "Talaba F.I.Sh.": "Abdullayev Sardor Rustam o'g'li",
      "Talaba ID": "240101",
      "Yo'nalish": direction,
      "Guruh": group,
      "Fan nomi": "Xalqaro turizm asoslari",
      "Kredit": 6,
      "To'plangan ball": 94,
      "Maksimal ball": 100,
      "Qoldirilgan soat": 2,
      "Davomat (%)": 97,
      "Davr": period
    },
    {
      "Talaba F.I.Sh.": "Karimova Madina Sherzod qizi",
      "Talaba ID": "240102",
      "Yo'nalish": direction,
      "Guruh": group,
      "Fan nomi": "Xalqaro turizm asoslari",
      "Kredit": 6,
      "To'plangan ball": 96,
      "Maksimal ball": 100,
      "Qoldirilgan soat": 0,
      "Davomat (%)": 100,
      "Davr": period
    },
    {
      "Talaba F.I.Sh.": "Yo'ldoshev Jasur Bobur o'g'li",
      "Talaba ID": "240103",
      "Yo'nalish": direction,
      "Guruh": group,
      "Fan nomi": "Turizmda servis va mehmondo'stlik",
      "Kredit": 6,
      "To'plangan ball": 88,
      "Maksimal ball": 100,
      "Qoldirilgan soat": 4,
      "Davomat (%)": 94,
      "Davr": period
    },
    {
      "Talaba F.I.Sh.": "Olimova Zilola Anvar qizi",
      "Talaba ID": "240104",
      "Yo'nalish": direction,
      "Guruh": group,
      "Fan nomi": "Mikroiqtisodiyot",
      "Kredit": 5,
      "To'plangan ball": 92,
      "Maksimal ball": 100,
      "Qoldirilgan soat": 2,
      "Davomat (%)": 96,
      "Davr": period
    },
    {
      "Talaba F.I.Sh.": "Toshmatov Jamshid Bekzod o'g'li",
      "Talaba ID": "240105",
      "Yo'nalish": direction,
      "Guruh": group,
      "Fan nomi": "Mikroiqtisodiyot",
      "Kredit": 5,
      "To'plangan ball": 81,
      "Maksimal ball": 100,
      "Qoldirilgan soat": 6,
      "Davomat (%)": 90,
      "Davr": period
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ballar va Davomat");
  
  // Column widths
  ws['!cols'] = [
    { wch: 34 }, // Ism
    { wch: 12 }, // ID
    { wch: 24 }, // Yo'nalish
    { wch: 14 }, // Guruh
    { wch: 32 }, // Fan
    { wch: 8 },  // Kredit
    { wch: 15 }, // To'plangan ball
    { wch: 14 }, // Max ball
    { wch: 16 }, // Qoldirilgan soat
    { wch: 14 }, // Davomat (%)
    { wch: 22 }  // Davr
  ];

  XLSX.writeFile(wb, `UniGrant_Namuna_${group.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.xlsx`);
}

/**
 * Yuklangan XLS/XLSX faylni o'qish va ma'lumotlarni chiqarib olish
 */
export async function parseExcelFile(file: File): Promise<ParsedRowData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // JSON formatga o'tkazish
        const rawJson: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);

        const parsedRows: ParsedRowData[] = rawJson.map((row) => {
          // Mos keluvchi ustun nomlarini qidirish
          const fullName = String(
            row["Talaba F.I.Sh."] || 
            row["F.I.Sh."] || 
            row["Ism familiya"] || 
            row["FIO"] || 
            row["Full Name"] || 
            "Noma'lum talaba"
          ).trim();

          const studentId = String(
            row["Talaba ID"] || 
            row["ID"] || 
            row["Talaba_ID"] || 
            row["Hemis ID"] || 
            Math.floor(100000 + Math.random() * 900000)
          ).trim();

          const group = String(row["Guruh"] || row["Group"] || "611-21 DI").trim();
          const direction = String(row["Yo'nalish"] || row["Yonalish"] || row["Mutaxassislik"] || "Dasturiy injiniring").trim();
          const subjectName = String(row["Fan nomi"] || row["Fan"] || row["Subject"] || "Umumiy fan").trim();
          const score = Number(row["To'plangan ball"] || row["Ball"] || row["Score"] || 0);
          const maxScore = Number(row["Maksimal ball"] || row["Max ball"] || 100);
          const credits = Number(row["Kredit"] || row["Credit"] || 4);
          const missedHours = Number(row["Qoldirilgan soat"] || row["Qoldiq"] || 0);
          const attendanceRate = Number(row["Davomat (%)"] || row["Davomat"] || 95);
          const period = String(row["Davr"] || row["Hafta"] || "Joriy davr").trim();

          return {
            fullName,
            studentId,
            group,
            direction,
            subjectName,
            score,
            maxScore,
            credits,
            missedHours,
            attendanceRate,
            period
          };
        });

        resolve(parsedRows);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Talabalar Grant reytingini Excelga yuklab berish
 */
export function exportGrantRankingToExcel(students: Student[], fileName = "UniGrant_Grant_Nomzodlari_Reytingi.xlsx") {
  const exportData = students.map((s, index) => {
    const verifiedBonus = s.achievements
      .filter(a => a.status === 'tasdiqlandi')
      .reduce((sum, a) => sum + (a.bonusPoints || 0), 0);

    return {
      "Reyting o'rni": index + 1,
      "Talaba F.I.Sh.": s.fullName,
      "Talaba ID": s.studentId,
      "Yo'nalish": s.direction,
      "Guruh": s.group,
      "Joriy GPA": s.gpa.toFixed(2),
      "Yutuqlar bonusi (Ball)": verifiedBonus,
      "Davomat (%)": `${s.attendanceRate}%`,
      "Qoldirilgan soat": `${s.missedHours} soat`,
      "Grant holati": s.grantType || (index < 5 ? "Davlat granti nomzodi" : "Shartnoma"),
      "Biriktirilgan Tyutor": s.assignedTutorName
    };
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Grant Reytingi");
  ws['!cols'] = [
    { wch: 14 },
    { wch: 34 },
    { wch: 14 },
    { wch: 25 },
    { wch: 14 },
    { wch: 12 },
    { wch: 22 },
    { wch: 14 },
    { wch: 18 },
    { wch: 24 },
    { wch: 26 }
  ];

  XLSX.writeFile(wb, fileName);
}

/**
 * Yangi yaratilgan talabalar va ota-onalar login/parollarini Excel qilib berish
 */
export function exportCredentialsToExcel(students: Student[], fileName = "UniGrant_Talaba_va_OtaOna_Loginlar.xlsx") {
  const exportData = students.map(s => ({
    "Talaba F.I.Sh.": s.fullName,
    "Talaba ID": s.studentId,
    "Guruh": s.group,
    "Yo'nalish": s.direction,
    "Talaba Logini": s.login,
    "Talaba Dastlabki Paroli": s.password,
    "Ota-ona Kirish Kodi": s.parentCode,
    "Biriktirilgan Tyutor": s.assignedTutorName,
    "Telefon raqam": s.phone || "+998 90 --- -- --"
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Login Parollar");
  ws['!cols'] = [
    { wch: 34 },
    { wch: 12 },
    { wch: 14 },
    { wch: 25 },
    { wch: 18 },
    { wch: 24 },
    { wch: 22 },
    { wch: 26 },
    { wch: 20 }
  ];

  XLSX.writeFile(wb, fileName);
}
