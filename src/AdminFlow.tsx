import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Default napkin configuration
// New napkins are not visible by default (enabled: false)
// Only LGA and Recommendations are visible by default
const DEFAULT_NAPKINS = [
  { id: 'lga-flow', name: 'AC-14371: Large Government Agencies', enabled: true },
  { id: 'appinsights-ai', name: 'AppInsights AI', enabled: false },
  { id: 'adobe-recommendations', name: 'Adobe Recommendations', enabled: true },
  { id: 'company-flow', name: 'Company Flow: Adobe Vendor Setup', enabled: false },
  { id: 'adobesyncui', name: 'AC-14309: Adobe Sync UI', enabled: false },
  { id: 'adobe-new-functionalities', name: 'Adobe New Functionalities Tester', enabled: false }
];

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use environment variable for password, fallback to default for development
    const adminPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      sessionStorage.setItem('admin-authenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h1>Admin Access</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              marginTop: '5px',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

const AdminDashboard = () => {
  const [napkins, setNapkins] = useState(DEFAULT_NAPKINS);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!sessionStorage.getItem('admin-authenticated')) {
      navigate('/admin');
      return;
    }

    // Load current settings
    const saved = localStorage.getItem('napkin-visibility');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        const updated = DEFAULT_NAPKINS.map(napkin => ({
          ...napkin,
          enabled: settings[napkin.id] !== false // Default to true if not specified
        }));
        setNapkins(updated);
      } catch (e) {
        console.error('Error loading napkin settings:', e);
      }
    }
  }, [navigate]);

  const handleToggle = (id: string) => {
    setNapkins(prev => prev.map(napkin => 
      napkin.id === id ? { ...napkin, enabled: !napkin.enabled } : napkin
    ));
  };

  const handleSave = () => {
    const settings: Record<string, boolean> = {};
    napkins.forEach(napkin => {
      settings[napkin.id] = napkin.enabled;
    });
    
    localStorage.setItem('napkin-visibility', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authenticated');
    navigate('/admin');
  };

  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Napkin Visibility Control</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <p>Control which napkins are visible on the landing page:</p>
      </div>

      {napkins.map(napkin => (
        <div key={napkin.id} style={{ 
          marginBottom: '15px',
          padding: '10px',
          border: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{napkin.name}</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={napkin.enabled}
              onChange={() => handleToggle(napkin.id)}
            />
            {napkin.enabled ? 'Visible' : 'Hidden'}
          </label>
        </div>
      ))}

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Save Settings
        </button>
        
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>

      {message && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

const AdminFlow = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminFlow; 