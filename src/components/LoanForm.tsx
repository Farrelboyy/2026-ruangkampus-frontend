import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id, enUS } from 'date-fns/locale';
import { getBaseStyles } from '../utils';
import { translations } from '../translations';

registerLocale('id', id);
registerLocale('en', enUS);

interface LoanFormProps {
  formData: {
    borrowerName: string;
    roomName: string;
    startTime: Date | null;
    endTime: Date | null;
    purpose: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    borrowerName: string;
    roomName: string;
    startTime: Date | null;
    endTime: Date | null;
    purpose: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  isDarkMode: boolean;
  language: 'id' | 'en';
  colors: any;
  editingId: number | null;
  username: string;
}

const LoanForm: React.FC<LoanFormProps> = ({ 
  formData, setFormData, onSubmit, isDarkMode, language, colors, editingId, username 
}) => {
  const baseStyles = getBaseStyles(colors);
  const t = translations[language];
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const customDatePickerStyles = `
    .react-datepicker-wrapper { width: 100%; }
    .react-datepicker {
      display: flex !important; font-family: 'Inter', sans-serif;
      border: 1px solid ${colors.borderSubtle};
      background-color: ${isDarkMode ? '#1E293B' : '#FFFFFF'} !important;
      color: ${colors.textPrimary} !important;
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .react-datepicker__header {
      background-color: ${isDarkMode ? '#0F172A' : '#F1F5F9'} !important;
      border-bottom: 1px solid ${colors.borderSubtle}; padding-top: 15px;
    }
    .react-datepicker__current-month, .react-datepicker__day-name {
      color: ${colors.textPrimary} !important; font-weight: 600;
    }
    .react-datepicker__day {
      color: ${colors.textPrimary} !important; width: 2rem; line-height: 2rem; margin: 0.2rem;
    }
    .react-datepicker__day:hover {
      background-color: ${colors.brandPrimary} !important; color: white !important; border-radius: 50%;
    }
    .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
      background-color: ${colors.brandPrimary} !important; color: white !important; border-radius: 50%; font-weight: bold;
    }
    .react-datepicker__day--disabled { color: ${colors.textSecondary} !important; opacity: 0.3; }
    .react-datepicker__time-container {
      width: 130px !important; border-left: 1px solid ${colors.borderSubtle};
      background-color: ${isDarkMode ? '#1E293B' : '#FFFFFF'} !important;
    }
    .react-datepicker__header--time {
      background-color: ${isDarkMode ? '#0F172A' : '#F1F5F9'} !important;
      border-bottom: 1px solid ${colors.borderSubtle}; padding: 15px 0;
    }
    .react-datepicker-time__header { color: ${colors.textPrimary} !important; font-weight: 600; }
    .react-datepicker__time, .react-datepicker__time-box, .react-datepicker__time-list {
      background-color: ${isDarkMode ? '#1E293B' : '#FFFFFF'} !important;
    }
    .react-datepicker__time-list { height: 230px !important; padding-bottom: 0 !important; }
    .react-datepicker__time-list-item {
      background-color: ${isDarkMode ? '#1E293B' : '#FFFFFF'} !important;
      color: ${colors.textPrimary} !important; height: auto !important; padding: 10px 0 !important;
      display: flex; align-items: center; justify-content: center;
    }
    .react-datepicker__time-list-item:hover {
      background-color: ${isDarkMode ? '#334155' : '#E2E8F0'} !important; color: ${colors.textPrimary} !important;
    }
    .react-datepicker__time-list-item--selected {
      background-color: ${colors.brandPrimary} !important; color: white !important; font-weight: bold;
    }
    .custom-date-input {
      width: 100%; padding: 12px 45px 12px 16px; border-radius: 8px;
      border: 1px solid ${colors.inputBorder}; background-color: ${colors.inputBg};
      color: ${colors.textPrimary}; outline: none; font-size: 0.95rem; font-weight: 500;
      transition: border-color 0.2s; text-overflow: ellipsis;
    }
    .custom-date-input:focus {
      border-color: ${colors.brandPrimary};
      box-shadow: 0 0 0 3px ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
    }
  `;

  const roomsData = {
    id: [
      "Amphitheater Terbuka", "Auditorium Utama (Kapasitas 500)", "Aula Pascasarjana (Theater Room)", "Bengkel Mekanik & CNC", "Coworking Space Perpustakaan", "Gelanggang Olahraga (GOR) Indoor",
      "Ruang Kelas GKB-A 101 (Lantai 1)", "Ruang Kelas GKB-A 102 (Lantai 1)", "Ruang Kelas GKB-A 103 (Lantai 1)", "Ruang Kelas GKB-A 201 (Lantai 2)", "Ruang Kelas GKB-A 202 (Lantai 2)", "Ruang Kelas GKB-A 203 (Lantai 2)", "Ruang Kelas GKB-B 301 (Lantai 3)", "Ruang Kelas GKB-B 302 (Lantai 3)", "Ruang Kelas GKB-B 304 (Lantai 3)",
      "Laboratorium Basis Data & Big Data", "Laboratorium Elektronika Dasar", "Laboratorium Jaringan Komputer (Jarkom)", "Laboratorium Keamanan Siber (Cyber Security)", "Laboratorium Multimedia & Game Dev", "Laboratorium Pemrograman Dasar (Labdas)", "Laboratorium Rekayasa Perangkat Lunak (RPL)", "Laboratorium Robotika & Otomasi", "Laboratorium Sistem Cerdas & AI", "Laboratorium Sistem Informasi Geografis (GIS)", "Laboratorium Sistem Tertanam (Embedded System)", "Laboratorium Telekomunikasi Nirkabel",
      "Ruang Teori D3-205", "Ruang Teori D4-101", "Ruang Teori D4-102", "Ruang Seminar A", "Ruang Seminar B", "Ruang Sidang Tugas Akhir (Jurusan)", "Ruang Sidang Utama (Rektorat)", "Sekretariat BEM/DPM", "Studio Musik & Broadcasting"
    ],
    en: [
      "Open Amphitheater", "Main Auditorium (Capacity 500)", "Postgraduate Hall (Theater Room)", "Mechanical & CNC Workshop", "Library Coworking Space", "Indoor Sports Hall",
      "GKB-A Classroom 101 (1st Floor)", "GKB-A Classroom 102 (1st Floor)", "GKB-A Classroom 103 (1st Floor)", "GKB-A Classroom 201 (2nd Floor)", "GKB-A Classroom 202 (2nd Floor)", "GKB-A Classroom 203 (2nd Floor)", "GKB-B Classroom 301 (3rd Floor)", "GKB-B Classroom 302 (3rd Floor)", "GKB-B Classroom 304 (3rd Floor)",
      "Database & Big Data Laboratory", "Basic Electronics Laboratory", "Computer Network Laboratory (Jarkom)", "Cyber Security Laboratory", "Multimedia & Game Dev Laboratory", "Basic Programming Laboratory (Labdas)", "Software Engineering Laboratory (RPL)", "Robotics & Automation Laboratory", "Intelligent Systems & AI Laboratory", "Geographic Information System (GIS) Laboratory", "Embedded System Laboratory", "Wireless Telecommunication Laboratory",
      "Theory Room D3-205", "Theory Room D4-101", "Theory Room D4-102", "Seminar Room A", "Seminar Room B", "Final Project Defense Room (Department)", "Main Meeting Room (Rectorate)", "BEM/DPM Secretariat", "Music & Broadcasting Studio"
    ]
  };

  const allCampusRooms = roomsData[language].sort();
  const filteredRooms = allCampusRooms.filter(room => room.toLowerCase().includes(formData.roomName.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const IconCalendar = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color: colors.textSecondary}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);

  return (
    <form onSubmit={onSubmit}>
      <style>{customDatePickerStyles}</style>
      <div style={baseStyles.formGroup}><label style={baseStyles.label}>{t.borrowerName}</label><input style={{...baseStyles.input, backgroundColor: isDarkMode ? '#334155' : '#F1F5F9', color: colors.textPrimary}} type="text" value={username} readOnly /></div>
      
      <div style={baseStyles.formGroup} ref={dropdownRef}>
        <label style={baseStyles.label}>{t.roomLabel}</label>
        <div style={{ position: 'relative' }}>
          <input 
            style={baseStyles.input} 
            value={formData.roomName} 
            onChange={e => { setFormData({...formData, roomName: e.target.value}); setShowDropdown(true); }} 
            onFocus={(e) => { e.target.select(); setShowDropdown(true); }} 
            placeholder={language === 'id' ? "Ketik 'Ruang' atau 'Laboratorium'..." : "Type 'Room' or 'Laboratory'..."} 
            required 
          />
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: colors.bgPanel, border: `1px solid ${colors.borderSubtle}`, borderRadius: '8px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              {filteredRooms.length > 0 ? (filteredRooms.map((room, index) => (
                <div 
                  key={index} 
                  onClick={() => { setFormData({...formData, roomName: room}); setShowDropdown(false); }} 
                  style={{ padding: '10px 14px', cursor: 'pointer', color: colors.textPrimary, borderBottom: index !== filteredRooms.length - 1 ? `1px solid ${colors.borderSubtle}` : 'none', fontSize: '0.9rem' }} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1E293B' : '#F8FAFC'} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {room}
                </div>
              ))) : (
                <div style={{ padding: '10px 14px', color: colors.textSecondary, fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {language === 'id' ? 'Tidak ada ruangan cocok' : 'No matching room'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={baseStyles.formGroup}>
          <label style={baseStyles.label}>{t.startLabel}</label>
          <div style={{position: 'relative'}}>
            <DatePicker 
              selected={formData.startTime} 
              onChange={(date: Date | null) => setFormData({...formData, startTime: date})} 
              showTimeSelect timeFormat="HH:mm" timeIntervals={5} 
              dateFormat={language === 'id' ? "d MMMM yyyy, HH:mm" : "MMMM d, yyyy, HH:mm"} 
              placeholderText={language === 'id' ? "Pilih mulai..." : "Select start..."} 
              className="custom-date-input" locale={language === 'id' ? 'id' : 'en'} minDate={new Date()} 
            />
            <IconCalendar />
          </div>
        </div>
        <div style={baseStyles.formGroup}>
          <label style={baseStyles.label}>{t.endLabel}</label>
          <div style={{position: 'relative'}}>
            <DatePicker 
              selected={formData.endTime} 
              onChange={(date: Date | null) => setFormData({...formData, endTime: date})} 
              showTimeSelect timeFormat="HH:mm" timeIntervals={5} 
              dateFormat={language === 'id'   ? "d MMMM yyyy, HH:mm" : "MMMM d, yyyy, HH:mm"} 
              placeholderText={language === 'id' ? "Pilih selesai..." : "Select end..."} 
              className="custom-date-input" locale={language === 'id' ? 'id' : 'en'} 
              minDate={formData.startTime || new Date()} 
            />
            <IconCalendar />
          </div>
        </div>
      </div>

      <div style={baseStyles.formGroup}><label style={baseStyles.label}>{t.purposeLabel}</label><input style={baseStyles.input} type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} required placeholder={language === 'id' ? "Contoh: Diskusi Kelompok PBL" : "Ex: Group Discussion"} /></div>
      <button type="submit" style={{ ...baseStyles.button, backgroundColor: editingId ? '#F59E0B' : colors.brandPrimary }}>{editingId ? t.saveBtn : t.sendBtn}</button>
    </form>
  );
};

export default LoanForm;