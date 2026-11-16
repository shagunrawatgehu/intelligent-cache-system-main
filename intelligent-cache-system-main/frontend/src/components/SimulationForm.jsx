import React, { useState } from 'react';
import { Play, RefreshCw, Layers, Sliders } from 'lucide-react';

const DEFAULT_REF = '7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1';
const ALL_ALGOS = ['FIFO', 'LRU', 'LFU', 'Optimal', 'PREDICTION'];

export default function SimulationForm({ onRunSimulation, loading }) {
  const [cacheSize, setCacheSize] = useState(3);
  const [referenceString, setReferenceString] = useState('');

  const handleRandom = () => {
    const length = 18;
    const maxPage = 6;
    const randomPages = Array.from({ length }, () => Math.floor(Math.random() * maxPage)).join(', ');
    setReferenceString(randomPages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedCacheSize = parseInt(cacheSize, 10);
    if (!parsedCacheSize || parsedCacheSize < 1) return;
    if (!referenceString.trim()) return;

    onRunSimulation({
      cache_size: parsedCacheSize,
      reference_string: referenceString,
      algorithms: ALL_ALGOS,
      save_to_db: true
    });
  };

  return (
    <div className="simulation-form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="cacheSizeInput">
                <Sliders size={16} /> Cache Frames (Capacity):
              </label>
            </div>
            <input
              id="cacheSizeInput"
              type="number"
              min="1"
              max="64"
              value={cacheSize}
              onChange={(e) => setCacheSize(e.target.value)}
              placeholder="e.g. 3 or 4"
              className="text-input"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div className="form-group span-2">
            <div className="label-row">
              <label htmlFor="refStringInput">
                <Layers size={16} /> Reference String (Page Requests):
              </label>
              <div className="preset-buttons">
                <button type="button" onClick={handleRandom} className="mini-btn">
                  <RefreshCw size={12} /> Randomize
                </button>
              </div>
            </div>
            <input
              id="refStringInput"
              type="text"
              value={referenceString}
              onChange={(e) => setReferenceString(e.target.value)}
              placeholder="Enter pages separated by commas, e.g. 7, 0, 1, 2, 0, 3"
              className="text-input"
              required
            />
          </div>
        </div>

        <div className="form-footer" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" disabled={loading} className="run-btn">
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" /> Simulating...
              </>
            ) : (
              <>
                <Play size={18} /> Run &amp; Compare Algorithms
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}