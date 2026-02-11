import React, { useEffect, useState } from 'react';
import { getBaseStyles, getColors, getStatusBadgeStyle } from '../utils';
import { translations } from '../translations';
import type { RoomLoan } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  language: 'id' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, isDarkMode, language }) => {
  const [loans, setLoans] = useState<RoomLoan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const colors = getColors(isDarkMode);
  const baseStyles = getBaseStyles(colors);
  const t = translations[language];
  
  const apiUrl = 'http://localhost:5273/api/RoomLoans';

  const fetchLoans = () => { fetch(apiUrl).then(res => res.json()).then(data => setLoans(data)); };
  
  useEffect(() => { fetchLoans(); }, []);

  const filteredLoans = loans.filter(loan => 
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 👇 INI UPDATE LOGIC-NYA (Bisa Approve & Reject)
  const handleStatusUpdate = async (loan: RoomLoan, newStatus: string) => {
    await fetch(`${apiUrl}/${loan.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...loan, status: newStatus }) 
    });
    fetchLoans();
  };

  const openDeleteModal = (id: number) => { setSelectedId(id); setShowDeleteModal(true); };
  const closeDeleteModal = () => { setShowDeleteModal(false); setSelectedId(null); };
  const confirmDelete = async () => { if (selectedId) { await fetch(`${apiUrl}/${selectedId}`, { method: 'DELETE' }); fetchLoans(); closeDeleteModal(); } };

  const IconCheck = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
  const IconX = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>); // 👈 Icon Silang Baru
  const IconTrash = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);

  return (
    <div style={baseStyles.pageContainer}>
      {showDeleteModal && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}><div style={{ backgroundColor: colors.bgPanel, padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '480px', border: `1px solid ${colors.borderSubtle}` }}><h3 style={{ color: isDarkMode ? '#F87171' : '#991B1B', marginTop: 0, marginBottom: '12px', borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: '12px', fontSize: '1.25rem', fontWeight: '700' }}>{t.deleteTitle}</h3><p style={{ color: colors.textPrimary, marginBottom: '24px', lineHeight: '1.6' }}>{t.deleteBody}</p><div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}><button onClick={closeDeleteModal} style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.bgPanel, cursor: 'pointer', fontWeight: '600', color: colors.textPrimary }}>{t.btnNo}</button><button onClick={confirmDelete} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: 'white', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)' }}>{t.btnYes}</button></div></div></div>)}
      <nav style={baseStyles.navbar}><div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '120px' }}><h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.brandPrimary, margin: 0 }}>🏢 {t.appName}</h1><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: isDarkMode ? '#1E3A8A' : '#DBEAFE', color: isDarkMode ? '#BFDBFE' : '#1E40AF' }}>{t.adminMode}</span></div><button onClick={onLogout} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${colors.brandPrimary}`, color: colors.brandPrimary, borderRadius: '6px', cursor: 'pointer' }}>{t.logout}</button></nav>
      <div style={{...baseStyles.contentWrapper, display: 'block'}}> 
        <div style={baseStyles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: colors.textPrimary }}>📊 {t.allData}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg, color: colors.textPrimary, outline: 'none' }} />
              <button onClick={fetchLoans} style={{ background: colors.bgPanel, color: colors.textPrimary, border: `1px solid ${colors.inputBorder}`, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>🔄 {t.refresh}</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={baseStyles.table}>
              <thead><tr><th style={baseStyles.th}>{t.thBorrower}</th><th style={baseStyles.th}>{t.thRoom}</th><th style={baseStyles.th}>{t.thStatus}</th><th style={baseStyles.th}>{t.thAction}</th></tr></thead>
              <tbody>
                {filteredLoans.map(loan => (
                  <tr key={loan.id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                    <td style={baseStyles.td}><b>{loan.borrowerName}</b><br/><small style={{color: colors.textSecondary}}>{loan.purpose}</small></td>
                    <td style={baseStyles.td}>{loan.roomName}<br/><small style={{color: colors.textSecondary}}>{new Date(loan.startTime).toLocaleDateString()}</small></td>
                    <td style={baseStyles.td}><span style={getStatusBadgeStyle(loan.status, isDarkMode)}>{loan.status}</span></td>
                    <td style={baseStyles.td}>
                      <div style={{display: 'flex', gap: '8px'}}>
                        {loan.status === 'Pending' && (
                          <>
                            {/* TOMBOL APPROVE (Check) */}
                            <button onClick={() => handleStatusUpdate(loan, 'Approved')} title="Setujui" style={{background: isDarkMode ? '#064E3B' : '#DCFCE7', color: isDarkMode ? '#6EE7B7' : '#166534', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><IconCheck /></button>
                            
                            {/* TOMBOL REJECT (X) - WARNA KUNING/ORANGE BIAR BEDA */}
                            <button onClick={() => handleStatusUpdate(loan, 'Rejected')} title="Tolak" style={{background: isDarkMode ? '#78350F' : '#FEF3C7', color: isDarkMode ? '#FCD34D' : '#D97706', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><IconX /></button>
                          </>
                        )}
                        {/* TOMBOL DELETE (Trash) */}
                        <button onClick={() => openDeleteModal(loan.id)} title="Hapus" style={{background: isDarkMode ? '#7F1D1D' : '#FEE2E2', color: isDarkMode ? '#FCA5A5' : '#991B1B', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><IconTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;