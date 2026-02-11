import React from 'react';

// --- WARNA DINAMIS (Palet Warna Slate Professional) ---
export const getColors = (isDark: boolean) => ({
  bgMain: isDark ? '#0F172A' : '#F8FAFC',       // Background Utama (Gelap/Terang)
  bgPanel: isDark ? '#1E293B' : '#FFFFFF',      // Warna Kotak/Panel
  textPrimary: isDark ? '#F1F5F9' : '#1E293B',  // Teks Utama (Putih/Hitam)
  textSecondary: isDark ? '#94A3B8' : '#64748B', // Teks Abu-abu
  brandPrimary: '#2563EB',                      // Biru Utama (Tetap)
  brandAccent: '#0EA5E9',                       
  borderSubtle: isDark ? '#334155' : '#E2E8F0', // Garis Pinggir
  inputBg: isDark ? '#0F172A' : '#FFFFFF',      // Background Input
  inputBorder: isDark ? '#475569' : '#CBD5E1',  // Garis Input
  hover: isDark ? '#334155' : '#F1F5F9',        // Efek Hover Tabel
});

// --- STYLES DINAMIS ---
export const getBaseStyles = (colors: any): { [key: string]: React.CSSProperties } => ({
  pageContainer: {
    minHeight: '100vh', width: '100vw', backgroundColor: colors.bgMain, color: colors.textPrimary,
    fontFamily: "'Segoe UI', 'Inter', sans-serif", display: 'flex', flexDirection: 'column',
    alignItems: 'center', margin: 0, padding: 0, position: 'absolute', top: 0, left: 0, overflowX: 'hidden',
    transition: 'background-color 0.3s, color 0.3s' // Animasi Halus pas ganti tema
  },
  navbar: {
    width: '100%', backgroundColor: colors.bgPanel, padding: '16px 40px',
    borderBottom: `1px solid ${colors.borderSubtle}`, display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', zIndex: 10, boxSizing: 'border-box',
    transition: 'background-color 0.3s'
  },
  contentWrapper: {
    width: '100%', maxWidth: '1400px', padding: '40px', display: 'grid',
    gridTemplateColumns: '1fr 1.5fr', gap: '40px', boxSizing: 'border-box',
  },
  panel: {
    backgroundColor: colors.bgPanel, borderRadius: '12px', padding: '32px',
    border: `1px solid ${colors.borderSubtle}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: 'fit-content',
    transition: 'background-color 0.3s, border-color 0.3s'
  },
  sectionTitle: {
    fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px', color: colors.textPrimary,
    borderBottom: `2px solid ${colors.borderSubtle}`, paddingBottom: '12px',
  },
  formGroup: { marginBottom: '20px', textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '8px', border: `1px solid ${colors.inputBorder}`,
    backgroundColor: colors.inputBg, color: colors.textPrimary, fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'all 0.2s',
  },
  button: {
    width: '100%', padding: '14px', backgroundColor: colors.brandPrimary, color: 'white',
    border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
    marginTop: '10px', fontSize: '1rem', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(0, 86, 179, 0.2)',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: {
    textAlign: 'left', padding: '14px', backgroundColor: colors.bgMain, color: colors.textSecondary, 
    borderBottom: `1px solid ${colors.borderSubtle}`, textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700'
  },
  td: { padding: '14px', borderBottom: `1px solid ${colors.borderSubtle}`, color: colors.textPrimary, verticalAlign: 'middle' },
});

export const getStatusBadgeStyle = (status: string, isDark: boolean): React.CSSProperties => {
  const map: Record<string, any> = {
    Approved: { bg: isDark ? '#064E3B' : '#DCFCE7', text: isDark ? '#6EE7B7' : '#166534', border: isDark ? '#065F46' : '#BBF7D0' },
    Pending: { bg: isDark ? '#713F12' : '#FEF9C3', text: isDark ? '#FDE047' : '#854D0E', border: isDark ? '#854D0E' : '#FEF08A' },
    Rejected: { bg: isDark ? '#7F1D1D' : '#FEE2E2', text: isDark ? '#FCA5A5' : '#991B1B', border: isDark ? '#991B1B' : '#FECACA' }
  };
  const c = map[status] || map.Pending;
  return {
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
    backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`, display: 'inline-block',
  };
};