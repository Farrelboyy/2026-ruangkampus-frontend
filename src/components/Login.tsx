import React, { useState } from 'react';
import { getBaseStyles, getColors } from '../utils';
import { translations } from '../translations';

interface LoginProps {
  onLogin: (role: 'user' | 'admin', username: string) => void;
  onSwitchToRegister: () => void;
  initialData?: { username: string; password?: string };
  isDarkMode: boolean;
  language: 'id' | 'en';
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, initialData, isDarkMode, language }) => {
  const [formData, setFormData] = useState({ username: initialData?.username || '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // State Modal
  const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error'; code: 'AUTH_FAILED' | 'NETWORK_ERROR' | '' }>({ 
    show: false, type: 'success', code: '' 
  });
  
  const colors = getColors(isDarkMode);
  const baseStyles = getBaseStyles(colors);
  const t = translations[language];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5273/api/Auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data.user.role === 'Admin' ? 'admin' : 'user', data.user.username);
      } else {
        setModal({ show: true, type: 'error', code: 'AUTH_FAILED' });
      }
    } catch (error) { 
      console.error(error);
      setModal({ show: true, type: 'error', code: 'NETWORK_ERROR' });
    }
  };

  const closeModal = () => setModal({ ...modal, show: false });

  // Logic Translate Real-time
  const getModalMessage = () => {
    if (modal.code === 'AUTH_FAILED') {
      return language === 'id' ? 'Username atau kata sandi salah.' : 'Invalid username or password.';
    }
    if (modal.code === 'NETWORK_ERROR') {
      return language === 'id' ? 'Tidak dapat terhubung ke server.' : 'Unable to connect to server.';
    }
    return '';
  };

  const IconEyeOpen = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
  const IconEyeClosed = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>);
  const IconError = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

  return (
    <div style={baseStyles.pageContainer}>
      
      {/* MODAL ERROR */}
      {modal.show && (
        <div 
          onClick={closeModal} // 👈 INI KUNCINYA: KLIK DIMANA AJA NUTUP
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10002,
            cursor: 'pointer' // Biar kursor jadi tangan pas di luar box
          }}
        >
          <div 
            // Kita gak kasih stopPropagation biar klik di box juga nutup
            style={{ 
              backgroundColor: colors.bgPanel, padding: '32px', borderRadius: '24px', 
              textAlign: 'center', width: '90%', maxWidth: '380px', 
              border: `1px solid ${colors.borderSubtle}`, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              cursor: 'default' // Balikin kursor normal pas di dalem box
            }}
          >
            <div style={{ 
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px auto', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: isDarkMode ? '#7F1D1D' : '#FEE2E2',
              border: `4px solid ${isDarkMode ? '#991B1B' : '#FEF2F2'}`
            }}>
              <span style={{ color: isDarkMode ? '#FCA5A5' : '#EF4444' }}><IconError /></span>
            </div>
            
            <h2 style={{ color: colors.textPrimary, marginBottom: '12px', fontSize: '1.25rem', fontWeight: '700' }}>
              {language === 'id' ? 'Login Gagal!' : 'Login Failed!'}
            </h2>
            
            <p style={{ color: colors.textSecondary, marginBottom: '24px', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {getModalMessage()}
            </p>
            
            <button onClick={closeModal} style={{ ...baseStyles.button, width: '100%', padding: '12px', backgroundColor: '#EF4444' }}>
              {language === 'id' ? 'Coba Lagi' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <div style={{ backgroundColor: colors.bgPanel, padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', textAlign: 'center', border: `1px solid ${colors.borderSubtle}` }}>
          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏢</div>
            <h1 style={{ color: colors.brandPrimary, margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>{t.appName}</h1>
            <p style={{ color: colors.textSecondary, marginTop: '8px' }}>
              {language === 'id' ? 'Silahkan masuk ke akun Anda' : 'Please sign in to your account'}
            </p>
          </div>
          
          <form onSubmit={handleLoginSubmit}>
            <div style={baseStyles.formGroup}>
              <input style={baseStyles.input} type="text" placeholder={t.placeholderUser} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            </div>
            <div style={baseStyles.formGroup}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input style={{...baseStyles.input, paddingRight: '45px'}} type={showPassword ? "text" : "password"} placeholder={t.placeholderPass} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}>{showPassword ? <IconEyeClosed /> : <IconEyeOpen />}</button>
              </div>
            </div>
            <button type="submit" style={baseStyles.button}>{t.loginBtn}</button>
          </form>
          
          <p style={{ marginTop: '24px', fontSize: '0.9rem', color: colors.textSecondary }}>
            {t.noAccount} <span onClick={onSwitchToRegister} style={{ color: colors.brandPrimary, fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>{t.registerLink}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;