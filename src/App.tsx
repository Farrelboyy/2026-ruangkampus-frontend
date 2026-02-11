import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AccessibilityWidget from './components/AccessibilityWidget';
import { getColors } from './utils';

function App() {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [autoFillCreds, setAutoFillCreds] = useState({ username: '', password: '' });

  // --- STATE SETTINGS ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [fontScale, setFontScale] = useState(1.0);
  const [language, setLanguage] = useState<'id' | 'en'>('id'); // Default Indo

  const colors = getColors(isDarkMode);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    document.documentElement.style.filter = isGrayscale ? 'grayscale(100%)' : 'none';
    document.body.style.backgroundColor = colors.bgMain;
  }, [fontScale, isGrayscale, isDarkMode, colors.bgMain]);

  const handleLogin = (role: 'admin' | 'user', name: string) => { setUserRole(role); setUsername(name); };
  const handleLogout = () => { setUserRole(null); setUsername(''); setCurrentView('login'); setAutoFillCreds({ username: '', password: '' }); };
  const handleRegisterSuccess = (u: string, p: string) => { setAutoFillCreds({ username: u, password: p }); setCurrentView('login'); };
  const handleResetAccessibility = () => { setIsDarkMode(false); setIsGrayscale(false); setFontScale(1.0); setLanguage('id'); };

  let content;
  // OPER 'language' KE SEMUA ANAK
  if (userRole === 'admin') {
    content = <AdminDashboard onLogout={handleLogout} isDarkMode={isDarkMode} language={language} />;
  } else if (userRole === 'user') {
    content = <UserDashboard onLogout={handleLogout} username={username} isDarkMode={isDarkMode} language={language} />;
  } else if (currentView === 'register') {
    content = <Register onSwitchToLogin={() => setCurrentView('login')} onRegisterSuccess={handleRegisterSuccess} isDarkMode={isDarkMode} language={language} />;
  } else {
    content = <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} initialData={autoFillCreds} isDarkMode={isDarkMode} language={language} />;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: colors.bgMain, transition: 'background-color 0.3s', position: 'relative' }}>
      <style>{`body, html { margin: 0 !important; padding: 0 !important; width: 100%; height: 100%; background-color: ${colors.bgMain}; box-sizing: border-box; } * { box-sizing: border-box; }`}</style>
      {content}
      <AccessibilityWidget 
        isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isGrayscale={isGrayscale} toggleGrayscale={() => setIsGrayscale(!isGrayscale)}
        scale={fontScale} setFontScale={setFontScale}
        onReset={handleResetAccessibility}
        language={language} setLanguage={setLanguage} // <--- OPER KE WIDGET
      />
    </div>
  );
}

export default App;