import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../translations';

interface AccessibilityWidgetProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isGrayscale: boolean;
  toggleGrayscale: () => void;
  scale: number;
  setFontScale: (scale: number) => void;
  onReset: () => void;
  language: 'id' | 'en';
  setLanguage: (l: 'id' | 'en') => void;
}

const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({
  isDarkMode, toggleDarkMode,
  isGrayscale, toggleGrayscale,
  scale, setFontScale,
  onReset,
  language, setLanguage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  // --- REFS BUAT DETEKSI KLIK LUAR ---
  const panelRef = useRef<HTMLDivElement>(null);   // Wilayah Panel Menu
  const buttonRef = useRef<HTMLButtonElement>(null); // Wilayah Tombol Bulet

  // --- LOGIC KLIK DI LUAR (CLICK OUTSIDE) ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cek apakah menu lagi kebuka
      if (isOpen) {
        // Cek apakah yang diklik ITU BUKAN Panel DAN BUKAN Tombol Pembuka
        if (
          panelRef.current && 
          !panelRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false); // Tutup menu otomatis
        }
      }
    };

    // Pasang radar pendengar klik
    document.addEventListener('mousedown', handleClickOutside);
    
    // Bersihin radar pas komponen ilang
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateScale = (delta: number) => {
    const newScale = Math.round((scale + delta) * 10) / 10;
    if (newScale >= 0.8 && newScale <= 1.5) setFontScale(newScale);
  };

  // --- STYLES ---
  const panelStyle: React.CSSProperties = {
    position: 'fixed', bottom: '90px', left: '25px',
    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '16px', borderRadius: '16px',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
    width: '220px', zIndex: 100000, 
    display: isOpen ? 'block' : 'none',
    color: isDarkMode ? 'white' : '#1E293B',
    fontFamily: "'Inter', sans-serif",
    animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px'
  };

  const btnFeatureStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer',
    width: '100%', gap: '6px', fontWeight: '600', fontSize: '0.75rem',
    transition: 'all 0.2s', 
    backgroundColor: isDarkMode ? '#334155' : '#F1F5F9',
    color: isDarkMode ? '#CBD5E1' : '#475569',
  };

  const activeBtnStyle = {
    backgroundColor: '#2563EB', color: 'white', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
  };

  const langContainerStyle: React.CSSProperties = {
    display: 'flex', backgroundColor: isDarkMode ? '#0F172A' : '#E2E8F0',
    borderRadius: '20px', padding: '3px', marginBottom: '12px'
  };

  const langBtnStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1, padding: '6px 0', borderRadius: '16px', border: 'none', cursor: 'pointer',
    fontWeight: '700', fontSize: '0.75rem', textAlign: 'center',
    backgroundColor: isActive ? 'white' : 'transparent',
    color: isActive ? '#2563EB' : (isDarkMode ? '#94A3B8' : '#64748B'),
    boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.2s'
  });

  // --- ICONS ---
  const IconZoomIn = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
  const IconZoomOut = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
  const IconEye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  const IconMoon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
  const IconSun = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
  const IconPerson = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>;
  const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;

  return (
    <>
      {/* PANEL MENU (Dikasi REF panelRef) */}
      <div ref={panelRef} style={panelStyle}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.5px' }}>{t.accessTitle}</span>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: isDarkMode?'#94A3B8':'#64748B', lineHeight: 1 }}>&times;</button>
        </div>

        <div style={langContainerStyle}>
          <button style={langBtnStyle(language === 'id')} onClick={() => setLanguage('id')}>ID</button>
          <button style={langBtnStyle(language === 'en')} onClick={() => setLanguage('en')}>EN</button>
        </div>

        <div style={gridStyle}>
          <button style={{...btnFeatureStyle, opacity: scale >= 1.5 ? 0.5 : 1}} onClick={() => updateScale(0.1)} disabled={scale >= 1.5} title={t.zoomIn}>
            <IconZoomIn /><span>{t.zoomIn}</span>
          </button>
          
          <button style={{...btnFeatureStyle, opacity: scale <= 0.8 ? 0.5 : 1}} onClick={() => updateScale(-0.1)} disabled={scale <= 0.8} title={t.zoomOut}>
            <IconZoomOut /><span>{t.zoomOut}</span>
          </button>

          <button style={{ ...btnFeatureStyle, ...(isGrayscale ? activeBtnStyle : {}) }} onClick={toggleGrayscale} title={t.grayscale}>
            <IconEye /><span>{t.grayscale}</span>
          </button>

          <button style={{ ...btnFeatureStyle, ...(isDarkMode ? activeBtnStyle : {}) }} onClick={toggleDarkMode} title={isDarkMode ? t.lightMode : t.darkMode}>
            {isDarkMode ? <IconSun /> : <IconMoon />}<span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
        
        <button onClick={onReset} style={{ width: '100%', marginTop: '12px', padding: '8px', background: 'none', border: 'none', color: '#EF4444', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <IconRefresh /> {t.reset}
        </button>
      </div>

      {/* TOMBOL PEMBUKA (Dikasi REF buttonRef) */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        title="Aksesibilitas"
        style={{
          position: 'fixed', bottom: '25px', left: '25px',
          width: '50px', height: '50px', borderRadius: '50%',
          backgroundColor: '#2563EB', color: 'white', border: '3px solid white',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
          zIndex: 100001, transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <IconPerson />
      </button>

      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
};

export default AccessibilityWidget;