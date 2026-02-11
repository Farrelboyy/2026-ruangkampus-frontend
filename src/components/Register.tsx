import React, { useState, useEffect, useRef } from 'react';
import { getBaseStyles, getColors } from '../utils';
import { translations } from '../translations';

interface RegisterProps {
  onSwitchToLogin: () => void;
  isDarkMode: boolean;
  language: 'id' | 'en';
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, isDarkMode, language }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'User' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Ref buat fokus otomatis ke input
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  // STATE VALIDASI USERNAME
  const [usernameError, setUsernameError] = useState(''); 

  // STATE PASSWORD METER
  const [passStrength, setPassStrength] = useState({ score: 0, label: '', color: '' });

  // STATE MODAL (Pop-up)
  const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ 
    show: false, type: 'success', message: '' 
  });
  
  const colors = getColors(isDarkMode);
  const baseStyles = getBaseStyles(colors);
  const t = translations[language];

  // 👇 1. LOGIC KETIK (Manual Backspace juga ngilangin error)
  const handleUsernameChange = (val: string) => {
    setUsernameError(''); // Hapus error merah pas user mulai revisi
    if (val.includes(' ')) {
      setUsernameError(language === 'id' ? 'Username tidak boleh spasi' : 'No spaces allowed');
    }
    setFormData({ ...formData, username: val });
  };

  // 👇 2. LOGIC TOMBOL SILANG (CLEAR)
  const clearUsername = (e: React.MouseEvent) => {
    e.preventDefault();  // Mencegah submit form
    e.stopPropagation(); // Mencegah event bubbling
    
    setFormData({ ...formData, username: '' }); // Hapus teks
    setUsernameError(''); // Hapus error
    
    // Balikin kursor ke input biar user ga perlu klik lagi
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  };

  // 👇 3. LOGIC PASSWORD METER
  useEffect(() => {
    const pass = formData.password;
    let score = 0;
    if (pass.length >= 8) score += 40;
    if (/\d/.test(pass)) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    let label = '';
    let color = colors.borderSubtle;

    if (pass.length === 0) {
      label = ''; color = colors.borderSubtle;
    } else if (pass.length < 8) {
      label = language === 'id' ? 'Min 8 Karakter' : 'Min 8 Characters';
      color = '#EF4444'; score = 10;
    } else if (score < 60) {
      label = language === 'id' ? 'Lemah' : 'Weak';
      color = '#F59E0B';
    } else if (score < 90) {
      label = language === 'id' ? 'Lumayan' : 'Good';
      color = '#3B82F6';
    } else {
      label = language === 'id' ? 'Sangat Kuat' : 'Strong';
      color = '#10B981';
    }
    setPassStrength({ score, label, color });
  }, [formData.password, language, colors, isDarkMode]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setModal({ show: true, type: 'error', message: language === 'id' ? 'Password minimal 8 karakter!' : 'Password min 8 chars!' });
      return;
    }
    if (usernameError) return;

    const payload = { ...formData, role: 'User' };

    try {
      const res = await fetch('http://localhost:5273/api/Auth/register', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });

      if (res.ok) {
        setModal({ 
          show: true, type: 'success', 
          message: language === 'id' ? 'Registrasi Berhasil! Silakan Login.' : 'Registration Successful! Please Login.' 
        });
      } else {
        const errorText = await res.text();
        let backendMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) backendMessage = errorJson.message;
        } catch {}

        const lowerMsg = backendMessage.toLowerCase();
        const isTaken = lowerMsg.includes('taken') || lowerMsg.includes('dipakai') || lowerMsg.includes('exist') || lowerMsg.includes('duplicate');

        if (isTaken) {
          setUsernameError(language === 'id' ? 'Username ini sudah dipakai!' : 'Username is already taken!');
        } else {
          setModal({ show: true, type: 'error', message: backendMessage || 'Registration Failed' });
        }
      }
    } catch (error) { 
      console.error(error);
      setModal({ show: true, type: 'error', message: 'Network Error' });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
    if (modal.type === 'success') onSwitchToLogin();
  };

  // ICONS
  const IconEyeOpen = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents:'none'}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
  const IconEyeClosed = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents:'none'}}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>);
  const IconX = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
  const IconSuccessModal = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
  const IconErrorModal = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

  return (
    <div style={baseStyles.pageContainer}>
      
      {/* MODAL POPUP */}
      {modal.show && (
        <div 
          onClick={closeModal} 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10002,
            cursor: 'pointer'
          }}
        >
          <div 
            style={{ 
              backgroundColor: colors.bgPanel, padding: '32px', borderRadius: '24px', 
              textAlign: 'center', width: '90%', maxWidth: '380px', 
              border: `1px solid ${colors.borderSubtle}`, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              cursor: 'default'
            }}
          >
            <div style={{ 
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px auto', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: modal.type === 'success' ? (isDarkMode ? '#064E3B' : '#DCFCE7') : (isDarkMode ? '#7F1D1D' : '#FEE2E2'),
              border: `4px solid ${modal.type === 'success' ? (isDarkMode ? '#065F46' : '#F0FDF4') : (isDarkMode ? '#991B1B' : '#FEF2F2')}`
            }}>
              <span style={{ color: modal.type === 'success' ? (isDarkMode ? '#6EE7B7' : '#166534') : (isDarkMode ? '#FCA5A5' : '#EF4444') }}>
                {modal.type === 'success' ? <IconSuccessModal /> : <IconErrorModal />}
              </span>
            </div>
            <h2 style={{ color: colors.textPrimary, marginBottom: '12px', fontSize: '1.25rem', fontWeight: '700' }}>
              {modal.type === 'success' ? (language === 'id' ? 'Berhasil!' : 'Success!') : (language === 'id' ? 'Gagal!' : 'Failed!')}
            </h2>
            <p style={{ color: colors.textSecondary, marginBottom: '24px', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {modal.message}
            </p>
            <button onClick={closeModal} style={{ ...baseStyles.button, width: '100%', padding: '12px', backgroundColor: modal.type === 'success' ? colors.brandPrimary : '#EF4444' }}>
              {language === 'id' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* FORM CONTAINER */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <div style={{ backgroundColor: colors.bgPanel, padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', textAlign: 'center', border: `1px solid ${colors.borderSubtle}` }}>
          
          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏢</div>
            <h1 style={{ color: colors.brandPrimary, margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>{t.appName}</h1>
            <p style={{ color: colors.textSecondary, marginTop: '8px' }}>
              {language === 'id' ? 'Daftar Akun Baru' : 'Create New Account'}
            </p>
          </div>
          
          <form onSubmit={handleRegisterSubmit}>
            
            {/* INPUT USERNAME */}
            <div style={baseStyles.formGroup}>
              <label style={baseStyles.label}>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  ref={usernameInputRef} // 👈 Pasang Ref di sini
                  style={{
                    ...baseStyles.input, 
                    paddingRight: '40px',
                    borderColor: usernameError ? '#EF4444' : baseStyles.input.borderColor
                  }} 
                  type="text" 
                  placeholder={t.placeholderUser} 
                  value={formData.username}
                  onChange={e => handleUsernameChange(e.target.value)} 
                  required 
                />
                
                {/* 👇 TOMBOL SILANG MERAH (DI-FIX PAKE ONMOUSEDOWN) */}
                {usernameError && (
                  <button
                    type="button"
                    onMouseDown={clearUsername} // 👈 Pake onMouseDown biar lebih responsif
                    style={{
                      position: 'absolute', right: '8px', 
                      background: 'none', border: 'none', 
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 20, // 👈 Naikkin Z-Index biar ga ketutup
                      opacity: 0.8
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                  >
                    <IconX />
                  </button>
                )}
              </div>
              
              {/* Pesan Error */}
              {usernameError && (
                <div style={{ 
                  marginTop: '6px', fontSize: '0.8rem', fontWeight: '500', textAlign: 'left',
                  color: '#EF4444', 
                  display: 'flex', alignItems: 'center', gap: '4px',
                  animation: 'fadeIn 0.3s'
                }}>
                  ⚠️ {usernameError}
                </div>
              )}
            </div>

            {/* INPUT PASSWORD */}
            <div style={baseStyles.formGroup}>
              <label style={baseStyles.label}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  style={{...baseStyles.input, paddingRight: '45px'}} 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t.placeholderPass} 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                />
                <button 
                  type="button" 
                  onMouseDown={(e) => { e.preventDefault(); setShowPassword(!showPassword); }} 
                  style={{ 
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', 
                    background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary,
                    zIndex: 10, padding: '8px', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                </button>
              </div>
              
              {/* Password Meter */}
              {formData.password.length > 0 && (
                <div style={{ marginTop: '8px', transition: 'all 0.3s ease' }}>
                  <div style={{ width: '100%', height: '4px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${passStrength.score}%`, height: '100%', backgroundColor: passStrength.color, transition: 'width 0.3s ease, background-color 0.3s ease' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: passStrength.color, transition: 'color 0.3s ease' }}>
                      {passStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              style={{ 
                ...baseStyles.button, 
                opacity: formData.password.length < 8 || usernameError ? 0.6 : 1, 
                cursor: formData.password.length < 8 || usernameError ? 'not-allowed' : 'pointer' 
              }}
            >
              {t.registerBtn}
            </button>
          </form>
          
          <p style={{ marginTop: '24px', fontSize: '0.9rem', color: colors.textSecondary }}>
            {t.haveAccount} <span onClick={onSwitchToLogin} style={{ color: colors.brandPrimary, fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>{t.loginLink}</span>
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
export default Register;