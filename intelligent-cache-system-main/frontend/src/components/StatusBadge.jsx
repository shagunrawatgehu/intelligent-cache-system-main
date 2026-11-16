import React, { useState, useEffect } from 'react';
import { healthService } from '../services/api';
import { Server, Database, RefreshCw } from 'lucide-react';

export default function StatusBadge() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthService.checkHealth();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="status-bar-container">
      <div className="status-item">
        <Server size={18} color="#60a5fa" />
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Backend Express API</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span className={`status-dot ${loading ? 'warning' : health ? 'online' : 'offline'}`}></span>
            {loading ? 'Checking...' : health ? 'Online (Port 5000)' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="status-item">
        <Database size={18} color="#a78bfa" />
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Database (MySQL)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span className={`status-dot ${loading ? 'warning' : health?.database?.connected ? 'online' : 'warning'}`}></span>
            {loading ? 'Checking...' : health?.database?.connected ? 'Connected' : health ? 'MySQL Disconnected' : 'Unknown'}
          </div>
        </div>
      </div>

      <button
        onClick={fetchHealth}
        disabled={loading}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          padding: '0.45rem 0.9rem',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem'
        }}
      >
        <RefreshCw size={14} className={loading ? 'spin' : ''} />
        Refresh Status
      </button>
    </div>
  );
}