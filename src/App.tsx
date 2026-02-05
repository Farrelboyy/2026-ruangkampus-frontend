import React, { useEffect, useState } from 'react'

// --- TIPE DATA UTAMA ---
interface RoomLoan {
  id: number;
  borrowerName: string;
  roomName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
}

// --- STYLE SYSTEM ---
// Perhatikan: Gw pake React.CSSProperties (Lebih sopan & dikenal VS Code)
const baseStyles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontFamily: "'Segoe UI', 'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    overflowX: 'hidden',
  },
  navbar: {
    width: '100%',
    backgroundColor: '#1e293b',
    padding: '20px 40px',
    borderBottom: '1px solid #334155',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '1400px',
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '40px',
    boxSizing: 'border-box',
  },
  panel: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid #334155',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    height: 'fit-content',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#e2e8f0',
    borderBottom: '2px solid #334155',
    paddingBottom: '10px',
  },
  formGroup: { marginBottom: '15px' },
  label: { 
    display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' 
  },
  input: {
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569',
    backgroundColor: '#0f172a', color: 'white', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', colorScheme: 'dark',
  },
  button: {
    width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white',
    border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
    marginTop: '10px', fontSize: '1rem', transition: 'background 0.2s',
  },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: {
    textAlign: 'left', padding: '12px', backgroundColor: '#0f172a',
    color: '#94a3b8', borderBottom: '1px solid #334155', textTransform: 'uppercase',
    fontSize: '0.75rem', letterSpacing: '0.5px',
  },
  td: { 
    padding: '12px', borderBottom: '1px solid #334155', color: '#cbd5e1', verticalAlign: 'middle' 
  },
};

const getStatusBadgeStyle = (status: string): React.CSSProperties => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    Approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80', border: '#22c55e' },
    Pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15', border: '#eab308' },
    Rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: '#ef4444' }
  };
  const c = colors[status] || colors.Pending;
  return {
    padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
    backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`,
    display: 'inline-block', textAlign: 'center',
  };
};

const getActionBtnStyle = (type: 'delete' | 'approve'): React.CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: '600',
  backgroundColor: type === 'delete' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
  color: type === 'delete' ? '#f87171' : '#4ade80',
  border: `1px solid ${type === 'delete' ? '#ef4444' : '#22c55e'}`,
  marginRight: '8px',
});

function App() {
  const [loans, setLoans] = useState<RoomLoan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    borrowerName: '', roomName: '', startTime: '', endTime: '', purpose: ''
  });

  const apiUrl = 'http://localhost:5273/api/RoomLoans';

  const fetchLoans = () => {
    setLoading(true);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchLoans(); }, []);

  // Pake React.FormEvent (Jelas & Tegas)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, status: 'Pending' };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("✅ Berhasil dikirim!");
        fetchLoans();
        setFormData({ borrowerName: '', roomName: '', startTime: '', endTime: '', purpose: '' });
      }
    } catch (error) { console.error(error); }
  };

  // Pake React.ChangeEvent (Jelas & Tegas)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus data ini?")) return;
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchLoans();
      else alert("Gagal hapus data.");
    } catch (error) { console.error(error); }
  };

  const handleApprove = async (loan: RoomLoan) => {
    const updatedLoan = { ...loan, status: 'Approved' };
    try {
      const response = await fetch(`${apiUrl}/${loan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLoan)
      });
      if (response.ok) fetchLoans();
      else alert("Gagal update status.");
    } catch (error) { console.error(error); }
  };

  return (
    <div style={baseStyles.pageContainer}>
      <nav style={baseStyles.navbar}>
        <h1 style={baseStyles.brand}>🏢 RuangKampus Enterprise</h1>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Administrator Panel</div>
      </nav>

      <div style={baseStyles.contentWrapper}>
        <div style={baseStyles.panel}>
          <h3 style={baseStyles.sectionTitle}>📝 Buat Pengajuan Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={baseStyles.formGroup}>
              <label style={baseStyles.label}>Nama Peminjam</label>
              <input style={baseStyles.input} type="text" name="borrowerName" value={formData.borrowerName} 
                onChange={handleChange} required placeholder="Nama Lengkap" />
            </div>
            <div style={baseStyles.formGroup}>
              <label style={baseStyles.label}>Ruangan</label>
              <input style={baseStyles.input} type="text" name="roomName" value={formData.roomName} 
                onChange={handleChange} required placeholder="Gedung / Ruangan" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={baseStyles.formGroup}>
                <label style={baseStyles.label}>Mulai</label>
                <input style={baseStyles.input} type="datetime-local" name="startTime" value={formData.startTime} 
                  onChange={handleChange} required />
              </div>
              <div style={baseStyles.formGroup}>
                <label style={baseStyles.label}>Selesai</label>
                <input style={baseStyles.input} type="datetime-local" name="endTime" value={formData.endTime} 
                  onChange={handleChange} required />
              </div>
            </div>
            <div style={baseStyles.formGroup}>
              <label style={baseStyles.label}>Keperluan</label>
              <input style={baseStyles.input} type="text" name="purpose" value={formData.purpose} 
                onChange={handleChange} required placeholder="Deskripsi Kegiatan" />
            </div>
            <button type="submit" style={baseStyles.button}>🚀 Submit Data</button>
          </form>
        </div>

        <div style={baseStyles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.25rem' }}>📊 Monitoring Status</h3>
            <button onClick={fetchLoans} style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>🔄 Refresh</button>
          </div>

          <div style={baseStyles.tableContainer}>
            {loading ? <p style={{ textAlign: 'center', color: '#64748b' }}>Loading...</p> : (
              <table style={baseStyles.table}>
                <thead>
                  <tr>
                    <th style={baseStyles.th}>Peminjam</th>
                    <th style={baseStyles.th}>Ruangan</th>
                    <th style={baseStyles.th}>Status</th>
                    <th style={baseStyles.th}>Aksi (Action)</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Kosong brok.</td></tr>
                  ) : (
                    loans.map((loan) => (
                      <tr key={loan.id} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={baseStyles.td}>
                          <div style={{ fontWeight: '500' }}>{loan.borrowerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(loan.startTime).toLocaleDateString()}</div>
                        </td>
                        <td style={baseStyles.td}>
                          <div style={{ color: '#60a5fa' }}>{loan.roomName}</div>
                        </td>
                        <td style={baseStyles.td}>
                          <span style={getStatusBadgeStyle(loan.status)}>{loan.status}</span>
                        </td>
                        <td style={baseStyles.td}>
                          {loan.status === 'Pending' && (
                            <button 
                              onClick={() => handleApprove(loan)}
                              style={getActionBtnStyle('approve')}
                              title="Setujui Peminjaman"
                            >
                              ✅ ACC
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(loan.id)}
                            style={getActionBtnStyle('delete')}
                            title="Hapus Data"
                          >
                            🗑️ Del
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App