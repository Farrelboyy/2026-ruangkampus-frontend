import React, { useEffect, useState } from 'react';
import { getBaseStyles, getColors } from '../utils';
import { translations } from '../translations';
import type { RoomLoan } from '../types';
import LoanForm from '../components/LoanForm'; // 👈 Import komponen yang udah dipecah
import LoanTable from '../components/LoanTable'; // 👈 Import komponen yang udah dipecah

interface UserDashboardProps {
  onLogout: () => void;
  username: string;
  isDarkMode: boolean;
  language: 'id' | 'en';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, username, isDarkMode, language }) => {
  const [loans, setLoans] = useState<RoomLoan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // State Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', body: '' });
  const [errorMessage, setErrorMessage] = useState('');
  
  // State Form
  const [formData, setFormData] = useState({
    borrowerName: username,
    roomName: '',
    startTime: null as Date | null,
    endTime: null as Date | null,
    purpose: ''
  });

  const colors = getColors(isDarkMode);
  const baseStyles = getBaseStyles(colors);
  const t = translations[language];
  const apiUrl = 'http://localhost:5273/api/RoomLoans';

  const allCampusRooms = [
    "Amphitheater Terbuka", "Auditorium Utama (Kapasitas 500)", "Aula Pascasarjana (Theater Room)", "Bengkel Mekanik & CNC", "Coworking Space Perpustakaan", "Gelanggang Olahraga (GOR) Indoor",
    "Ruang Kelas GKB-A 101 (Lantai 1)", "Ruang Kelas GKB-A 102 (Lantai 1)", "Ruang Kelas GKB-A 103 (Lantai 1)", "Ruang Kelas GKB-A 201 (Lantai 2)", "Ruang Kelas GKB-A 202 (Lantai 2)", "Ruang Kelas GKB-A 203 (Lantai 2)", "Ruang Kelas GKB-B 301 (Lantai 3)", "Ruang Kelas GKB-B 302 (Lantai 3)", "Ruang Kelas GKB-B 304 (Lantai 3)",
    "Laboratorium Basis Data & Big Data", "Laboratorium Elektronika Dasar", "Laboratorium Jaringan Komputer (Jarkom)", "Laboratorium Keamanan Siber (Cyber Security)", "Laboratorium Multimedia & Game Dev", "Laboratorium Pemrograman Dasar (Labdas)", "Laboratorium Rekayasa Perangkat Lunak (RPL)", "Laboratorium Robotika & Otomasi", "Laboratorium Sistem Cerdas & AI", "Laboratorium Sistem Informasi Geografis (GIS)", "Laboratorium Sistem Tertanam (Embedded System)", "Laboratorium Telekomunikasi Nirkabel",
    "Ruang Teori D3-205", "Ruang Teori D4-101", "Ruang Teori D4-102", "Ruang Seminar A", "Ruang Seminar B", "Ruang Sidang Tugas Akhir (Jurusan)", "Ruang Sidang Utama (Rektorat)", "Sekretariat BEM/DPM", "Studio Musik & Broadcasting"
  ];

  const fetchLoans = () => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setLoans(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLoans();
    setFormData(prev => ({ ...prev, borrowerName: username }));
  }, [username]);

  const filteredLoans = loans.filter(loan =>
    loan.borrowerName === username &&
    (loan.roomName.toLowerCase().includes(searchTerm.toLowerCase()) || loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allCampusRooms.includes(formData.roomName)) {
      setErrorMessage(language === 'id' ? "Nama ruangan tidak valid. Mohon pilih dari daftar dropdown." : "Invalid room name. Please select from the dropdown list.");
      setShowErrorModal(true); return;
    }
    if (!formData.startTime || !formData.endTime) {
      setErrorMessage(language === 'id' ? "Mohon lengkapi Tanggal Mulai dan Selesai." : "Please complete the Start and End Date.");
      setShowErrorModal(true); return;
    }
    if (formData.endTime <= formData.startTime) {
      setErrorMessage(language === 'id' ? "Waktu selesai harus lebih akhir dari waktu mulai." : "End time must be after the start time.");
      setShowErrorModal(true); return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    const payload = {
      ...formData,
      borrowerName: username,
      startTime: formData.startTime?.toISOString(),
      endTime: formData.endTime?.toISOString(),
      status: 'Pending'
    };
    const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;
    const method = editingId ? 'PUT' : 'POST';
    if (editingId) Object.assign(payload, { id: editingId });

    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setModalMessage({ title: editingId ? t.successUpdate : t.successTitle, body: t.successSent });
    setShowSuccessModal(true);
    fetchLoans();
    handleCancelEdit();
  };

  const handleEditClick = (loan: RoomLoan) => {
    if (loan.status !== 'Pending') return;
    setFormData({
      borrowerName: loan.borrowerName,
      roomName: loan.roomName,
      startTime: new Date(loan.startTime),
      endTime: new Date(loan.endTime),
      purpose: loan.purpose
    });
    setEditingId(loan.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ borrowerName: username, roomName: '', startTime: null, endTime: null, purpose: '' });
  };

  const handleDelete = async (loan: RoomLoan) => {
    if (loan.status === 'Pending' && confirm(t.deleteBody)) {
      await fetch(`${apiUrl}/${loan.id}`, { method: 'DELETE' });
      fetchLoans();
    }
  };

  const IconWarning = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);

  return (
    <div style={baseStyles.pageContainer}>
      {/* MODAL ERROR */}
      {showErrorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10002 }}>
          <div style={{ backgroundColor: colors.bgPanel, padding: '32px', borderRadius: '24px', textAlign: 'center', width: '90%', maxWidth: '400px', border: `1px solid ${colors.borderSubtle}`, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: isDarkMode ? '#7F1D1D' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: isDarkMode ? '4px solid #991B1B' : '4px solid #FEF2F2' }}>
              <span style={{ color: '#EF4444' }}><IconWarning /></span>
            </div>
            <h2 style={{ color: colors.textPrimary, marginBottom: '12px', fontSize: '1.25rem', fontWeight: '700' }}>{language === 'id' ? 'Validasi Gagal' : 'Validation Failed'}</h2>
            <p style={{ color: colors.textSecondary, marginBottom: '24px', lineHeight: '1.5' }}>{errorMessage}</p>
            <button onClick={() => setShowErrorModal(false)} style={{ ...baseStyles.button, width: '100%', padding: '12px', backgroundColor: '#EF4444' }}>{language === 'id' ? 'Mengerti' : 'Understood'}</button>
          </div>
        </div>
      )}

      {/* MODAL CONFIRM */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: colors.bgPanel, padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '480px', border: `1px solid ${colors.borderSubtle}` }}>
            <h3 style={{ color: colors.brandPrimary, marginTop: 0, marginBottom: '12px', borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: '12px' }}>{t.confirmTitle}</h3>
            <p style={{ color: colors.textPrimary, marginBottom: '24px' }}>{t.confirmBody}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirmModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.bgPanel, color: colors.textPrimary, cursor: 'pointer', fontWeight: '600' }}>{t.btnNo}</button>
              <button onClick={handleFinalSubmit} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: colors.brandPrimary, color: 'white', cursor: 'pointer', fontWeight: '600' }}>{t.btnYes}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUCCESS */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 }}>
          <div style={{ backgroundColor: colors.bgPanel, padding: '40px', borderRadius: '24px', textAlign: 'center', width: '90%', maxWidth: '420px', border: `1px solid ${colors.borderSubtle}` }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: isDarkMode ? '#064E3B' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: isDarkMode ? '4px solid #065F46' : '4px solid #F0FDF4' }}>
              <span style={{ fontSize: '40px', color: isDarkMode ? '#6EE7B7' : '#166534', fontWeight: 'bold' }}>✓</span>
            </div>
            <h2 style={{ color: colors.brandPrimary, marginBottom: '12px', fontSize: '1.5rem', fontWeight: '700' }}>{modalMessage.title}</h2>
            <p style={{ color: colors.textSecondary, marginBottom: '32px' }}>{modalMessage.body}</p>
            <button onClick={() => setShowSuccessModal(false)} style={{ ...baseStyles.button, width: '100%', padding: '14px', backgroundColor: colors.brandPrimary }}>{t.btnClose}</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={baseStyles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '120px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.brandPrimary, margin: 0 }}>🏢 {t.appName}</h1>
          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: isDarkMode ? '#064E3B' : '#DCFCE7', color: isDarkMode ? '#6EE7B7' : '#166534' }}>{t.studentMode}</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: colors.textPrimary, fontWeight: 'bold' }}>👤 {username}</span>
          <button onClick={onLogout} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${colors.brandPrimary}`, color: colors.brandPrimary, borderRadius: '6px', cursor: 'pointer' }}>{t.logout}</button>
        </div>
      </nav>

      {/* CONTENT UTAMA - PANGGIL KOMPONEN ANAK */}
      <div style={baseStyles.contentWrapper}>
        <div style={baseStyles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: `2px solid ${colors.borderSubtle}`, paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: colors.textPrimary }}>{editingId ? t.editLoan : t.createLoan}</h3>
            {editingId && <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>{t.cancelEdit}</button>}
          </div>
          
          {/* 👇 PANGGIL FORM DI SINI */}
          <LoanForm 
            formData={formData} setFormData={setFormData} onSubmit={handleInitialSubmit}
            isDarkMode={isDarkMode} language={language} colors={colors} editingId={editingId} username={username}
          />
        </div>

        <div style={baseStyles.panel}>
          {/* 👇 PANGGIL TABEL DI SINI */}
          <LoanTable 
            loans={filteredLoans} fetchLoans={fetchLoans} onEdit={handleEditClick} onDelete={handleDelete}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm} isDarkMode={isDarkMode} language={language} colors={colors} editingId={editingId}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;