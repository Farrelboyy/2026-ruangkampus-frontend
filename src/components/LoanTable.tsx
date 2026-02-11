import React from 'react';
import { getBaseStyles, getStatusBadgeStyle } from '../utils';
import { translations } from '../translations';
import type { RoomLoan } from '../types';

interface LoanTableProps {
  loans: RoomLoan[];
  fetchLoans: () => void;
  onEdit: (loan: RoomLoan) => void;
  onDelete: (loan: RoomLoan) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDarkMode: boolean;
  language: 'id' | 'en';
  colors: any;
  editingId: number | null;
}

const LoanTable: React.FC<LoanTableProps> = ({ 
  loans, fetchLoans, onEdit, onDelete, searchTerm, setSearchTerm, isDarkMode, language, colors, editingId 
}) => {
  const baseStyles = getBaseStyles(colors);
  const t = translations[language];

  // 👇 KAMUS TRANSLATE RUANGAN (Biar History ngikutin Bahasa)
  const roomDictionary = [
    { id: "Amphitheater Terbuka", en: "Open Amphitheater" },
    { id: "Auditorium Utama (Kapasitas 500)", en: "Main Auditorium (Capacity 500)" },
    { id: "Aula Pascasarjana (Theater Room)", en: "Postgraduate Hall (Theater Room)" },
    { id: "Bengkel Mekanik & CNC", en: "Mechanical & CNC Workshop" },
    { id: "Coworking Space Perpustakaan", en: "Library Coworking Space" },
    { id: "Gelanggang Olahraga (GOR) Indoor", en: "Indoor Sports Hall" },
    { id: "Ruang Kelas GKB-A 101 (Lantai 1)", en: "GKB-A Classroom 101 (1st Floor)" },
    { id: "Ruang Kelas GKB-A 102 (Lantai 1)", en: "GKB-A Classroom 102 (1st Floor)" },
    { id: "Ruang Kelas GKB-A 103 (Lantai 1)", en: "GKB-A Classroom 103 (1st Floor)" },
    { id: "Ruang Kelas GKB-A 201 (Lantai 2)", en: "GKB-A Classroom 201 (2nd Floor)" },
    { id: "Ruang Kelas GKB-A 202 (Lantai 2)", en: "GKB-A Classroom 202 (2nd Floor)" },
    { id: "Ruang Kelas GKB-A 203 (Lantai 2)", en: "GKB-A Classroom 203 (2nd Floor)" },
    { id: "Ruang Kelas GKB-B 301 (Lantai 3)", en: "GKB-B Classroom 301 (3rd Floor)" },
    { id: "Ruang Kelas GKB-B 302 (Lantai 3)", en: "GKB-B Classroom 302 (3rd Floor)" },
    { id: "Ruang Kelas GKB-B 304 (Lantai 3)", en: "GKB-B Classroom 304 (3rd Floor)" },
    { id: "Laboratorium Basis Data & Big Data", en: "Database & Big Data Laboratory" },
    { id: "Laboratorium Elektronika Dasar", en: "Basic Electronics Laboratory" },
    { id: "Laboratorium Jaringan Komputer (Jarkom)", en: "Computer Network Laboratory (Jarkom)" },
    { id: "Laboratorium Keamanan Siber (Cyber Security)", en: "Cyber Security Laboratory" },
    { id: "Laboratorium Multimedia & Game Dev", en: "Multimedia & Game Dev Laboratory" },
    { id: "Laboratorium Pemrograman Dasar (Labdas)", en: "Basic Programming Laboratory (Labdas)" },
    { id: "Laboratorium Rekayasa Perangkat Lunak (RPL)", en: "Software Engineering Laboratory (RPL)" },
    { id: "Laboratorium Robotika & Otomasi", en: "Robotics & Automation Laboratory" },
    { id: "Laboratorium Sistem Cerdas & AI", en: "Intelligent Systems & AI Laboratory" },
    { id: "Laboratorium Sistem Informasi Geografis (GIS)", en: "Geographic Information System (GIS) Laboratory" },
    { id: "Laboratorium Sistem Tertanam (Embedded System)", en: "Embedded System Laboratory" },
    { id: "Laboratorium Telekomunikasi Nirkabel", en: "Wireless Telecommunication Laboratory" },
    { id: "Ruang Teori D3-205", en: "Theory Room D3-205" },
    { id: "Ruang Teori D4-101", en: "Theory Room D4-101" },
    { id: "Ruang Teori D4-102", en: "Theory Room D4-102" },
    { id: "Ruang Seminar A", en: "Seminar Room A" },
    { id: "Ruang Seminar B", en: "Seminar Room B" },
    { id: "Ruang Sidang Tugas Akhir (Jurusan)", en: "Final Project Defense Room (Department)" },
    { id: "Ruang Sidang Utama (Rektorat)", en: "Main Meeting Room (Rectorate)" },
    { id: "Sekretariat BEM/DPM", en: "BEM/DPM Secretariat" },
    { id: "Studio Musik & Broadcasting", en: "Music & Broadcasting Studio" }
  ];

  // 👇 Helper: Cek nama di kamus, balikin sesuai bahasa yg dipilih
  const getTranslatedRoomName = (storedName: string) => {
    const found = roomDictionary.find(r => r.id === storedName || r.en === storedName);
    if (found) {
      return language === 'id' ? found.id : found.en;
    }
    return storedName; // Kalo gak ketemu di kamus, balikin aslinya
  };

  const IconEdit = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
  const IconTrash = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ ...baseStyles.sectionTitle, marginBottom: 0, border: 'none' }}>📊 {t.historyTitle}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg, color: colors.textPrimary, outline: 'none' }} />
          <button onClick={fetchLoans} style={{ background: colors.bgPanel, color: colors.textPrimary, border: `1px solid ${colors.inputBorder}`, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>🔄 {t.refresh}</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={baseStyles.table}>
          <thead><tr><th style={baseStyles.th}>{t.thInfo}</th><th style={baseStyles.th}>{t.thStatus}</th><th style={baseStyles.th}>{t.thAction}</th></tr></thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: colors.textSecondary }}>{language === 'id' ? 'Belum ada data peminjaman' : 'No loan history found'}</td></tr>
            ) : loans.map(loan => (
              <tr key={loan.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}`, backgroundColor: editingId === loan.id ? (isDarkMode ? '#3F2C06' : '#FEF3C7') : 'transparent' }}>
                <td style={baseStyles.td}>
                  {/* 👇 PAKE HELPER TRANSLATE DISINI */}
                  <b>{getTranslatedRoomName(loan.roomName)}</b><br />
                  <small style={{ color: colors.textSecondary }}>{loan.startTime ? new Date(loan.startTime).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</small><br />
                  <small style={{ fontStyle: 'italic', color: colors.textSecondary }}>"{loan.purpose}"</small>
                </td>
                <td style={baseStyles.td}><span style={getStatusBadgeStyle(loan.status, isDarkMode)}>{loan.status}</span></td>
                <td style={baseStyles.td}>
                  {loan.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => onEdit(loan)} style={{ background: isDarkMode ? '#1E3A8A' : '#DBEAFE', color: isDarkMode ? '#93C5FD' : '#1E40AF', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><IconEdit /></button>
                      <button onClick={() => onDelete(loan)} style={{ background: isDarkMode ? '#7F1D1D' : '#FEE2E2', color: isDarkMode ? '#FCA5A5' : '#991B1B', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><IconTrash /></button>
                    </div>
                  ) : <span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>🔒 {t.locked}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LoanTable;