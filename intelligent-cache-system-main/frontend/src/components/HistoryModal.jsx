import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/api';
import { Database, Trash2, X, RefreshCw, Calendar, Play } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, onLoadSimulation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await simulationService.getHistory();
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch simulation history from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete simulation #${id} from MySQL?`)) return;
    try {
      await simulationService.deleteSimulation(id);
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      alert(`Error deleting simulation: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={22} color="#818cf8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Saved Experiments (MySQL)</h3>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: '0.75rem' }} />
              <p>Querying database tables...</p>
            </div>
          )}

          {error && <div className="alert-box error">{error}</div>}

          {!loading && !error && history.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <p>No saved simulations found in MySQL database.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Run an experiment with "Persist to MySQL" enabled to save records here.
              </p>
            </div>
          )}

          {!loading && history.length > 0 && (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cache Size</th>
                    <th>Requests</th>
                    <th>Reference String</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((sim) => (
                    <tr key={sim.id}>
                      <td><strong>#{sim.id}</strong></td>
                      <td>{sim.cache_size} frames</td>
                      <td>{sim.total_requests || sim.reference_string.split(',').length}</td>
                      <td className="ref-cell" title={sim.reference_string}>
                        {sim.reference_string.length > 28
                          ? `${sim.reference_string.slice(0, 28)}...`
                          : sim.reference_string}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(sim.created_at).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              onLoadSimulation(sim);
                              onClose();
                            }}
                            className="mini-action-btn load"
                            title="Load into visualizer"
                          >
                            <Play size={14} /> Load
                          </button>
                          <button
                            onClick={(e) => handleDelete(sim.id, e)}
                            className="mini-action-btn delete"
                            title="Delete record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}