import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Layers, 
  Gauge, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  Zap,
  Info
} from 'lucide-react';

const ALGO_CONCEPTS = {
  FIFO: {
    title: 'First-In, First-Out (FIFO)',
    tagline: 'Queue-based replacement policy',
    ds: 'Circular Queue / FIFO Array (O(1))',
    anomaly: "Belady's Anomaly: Increasing frames can unexpectedly increase page faults!",
    vivaTip: 'Ignores access frequency and recency. Evicts the page in memory for the longest time.'
  },
  LRU: {
    title: 'Least Recently Used (LRU)',
    tagline: 'Exploits Temporal Locality',
    ds: 'Doubly Linked List + Hash Map (O(1))',
    anomaly: 'Susceptible to scan-thrashing on large sequential loops (N > M).',
    vivaTip: 'Assumes pages referenced recently will be referenced again soon. Industry standard baseline.'
  },
  LFU: {
    title: 'Least Frequently Used (LFU)',
    tagline: 'Access frequency popularity counter',
    ds: 'Min-Heap / Frequency Bucket List (O(log M))',
    anomaly: 'Cache pollution by obsolete pages that had a burst of past accesses.',
    vivaTip: 'Requires counter aging or decay mechanisms; uses FIFO to break frequency ties.'
  },
  Optimal: {
    title: "Belady's Optimal (OPT / MIN)",
    tagline: 'Theoretical lowest page-fault bound',
    ds: 'Offline Future Lookahead Array (O(M * N))',
    anomaly: 'Physically impossible in real online hardware (requires future knowledge).',
    vivaTip: 'Used as the theoretical benchmark ceiling to measure how close practical policies get.'
  },
  PREDICTION: {
    title: 'Lightweight Predictive Engine',
    tagline: 'Markov Transitions + Interval Expectancy',
    ds: '1st-Order Transition Matrix + Cycle Tracker (O(M))',
    anomaly: 'No neural networks: < 1 KB memory overhead, completely explainable scoring formula.',
    vivaTip: 'Combines transition probabilities, recency decay, frequency density, and periodic cycle alignment.'
  }
};

export default function OSInteractiveHub({ activeHitRatio, currentCacheSize }) {
  const [activeTab, setActiveTab] = useState('AMAT');
  const [selectedAlgoTab, setSelectedAlgoTab] = useState('PREDICTION');
  
  const [tCache, setTCache] = useState(2);
  const [tRam, setTRam] = useState(80);

  const effectiveHitRatio = typeof activeHitRatio === 'number' ? activeHitRatio : 0.45;
  const missRate = 1 - effectiveHitRatio;
  const amat = parseFloat((tCache + missRate * tRam).toFixed(2));
  const noCacheLatency = tRam;
  const speedup = parseFloat((noCacheLatency / amat).toFixed(2));

  return (
    <div className="os-interactive-hub">
      <div className="hub-tabs-row">
        <button
          type="button"
          onClick={() => setActiveTab('AMAT')}
          className={`hub-tab-btn ${activeTab === 'AMAT' ? 'active' : ''}`}
        >
          <Gauge size={16} />
          <span>Interactive AMAT Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CONCEPTS')}
          className={`hub-tab-btn ${activeTab === 'CONCEPTS' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>OS Policy Concepts &amp; Viva Cheatsheet</span>
        </button>
      </div>

      {activeTab === 'AMAT' && (
        <div className="hub-content-box">
          <div className="amat-grid">
            <div className="amat-controls">
              <div className="amat-header">
                <span className="hub-badge">
                  <TrendingUp size={13} /> Hardware Access Time Formula
                </span>
                <h4 className="amat-title">Average Memory Access Time (AMAT)</h4>
                <p className="amat-desc">
                  Explore how cache hit rates directly reduce CPU memory stall latency:
                </p>
                <div className="formula-callout">
                  <code>AMAT = T<sub>hit</sub> + (1 - HitRatio) &times; T<sub>miss</sub></code>
                </div>
              </div>

              <div className="slider-box">
                <div className="slider-label-row">
                  <span>Cache Hit Latency (T<sub>hit</sub>)</span>
                  <strong style={{ color: 'var(--accent-cyan)' }}>{tCache} ns</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tCache}
                  onChange={(e) => setTCache(Number(e.target.value))}
                  className="hub-range-slider"
                />
              </div>

              <div className="slider-box">
                <div className="slider-label-row">
                  <span>Main Memory Miss Penalty (T<sub>miss</sub>)</span>
                  <strong style={{ color: 'var(--accent-rose)' }}>{tRam} ns</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="150"
                  step="5"
                  value={tRam}
                  onChange={(e) => setTRam(Number(e.target.value))}
                  className="hub-range-slider"
                />
              </div>
            </div>

            <div className="amat-stats-card">
              <div className="stat-card-top">
                <span className="stat-label">Effective AMAT</span>
                <div className="stat-big-val">
                  {amat} <span className="stat-unit">ns</span>
                </div>
              </div>

              <div className="stat-pills-grid">
                <div className="mini-stat-pill">
                  <span className="mini-label">Active Hit Ratio</span>
                  <strong className="mini-val" style={{ color: '#38bdf8' }}>
                    {(effectiveHitRatio * 100).toFixed(1)}%
                  </strong>
                </div>
                <div className="mini-stat-pill">
                  <span className="mini-label">Direct RAM Time</span>
                  <strong className="mini-val" style={{ color: 'var(--text-secondary)' }}>
                    {noCacheLatency} ns
                  </strong>
                </div>
                <div className="mini-stat-pill span-all">
                  <span className="mini-label">Effective Memory Speedup</span>
                  <strong className="mini-val" style={{ color: '#10b981' }}>
                    <Zap size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {speedup}x Faster than un-cached RAM
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'CONCEPTS' && (
        <div className="hub-content-box">
          <div className="algo-tabs-pills">
            {Object.keys(ALGO_CONCEPTS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedAlgoTab(key)}
                className={`algo-pill-btn ${selectedAlgoTab === key ? 'active' : ''}`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="concept-detail-box">
            <div className="concept-header-row">
              <div>
                <h4 className="concept-title">{ALGO_CONCEPTS[selectedAlgoTab].title}</h4>
                <span className="concept-tagline">{ALGO_CONCEPTS[selectedAlgoTab].tagline}</span>
              </div>
              <span className="ds-badge">
                <Layers size={13} /> {ALGO_CONCEPTS[selectedAlgoTab].ds}
              </span>
            </div>

            <div className="concept-grid">
              <div className="concept-card anomaly">
                <span className="card-lbl">
                  <HelpCircle size={14} /> OS Failure Mode / Trade-off
                </span>
                <p>{ALGO_CONCEPTS[selectedAlgoTab].anomaly}</p>
              </div>

              <div className="concept-card tip">
                <span className="card-lbl">
                  <Sparkles size={14} /> Viva Defense Takeaway
                </span>
                <p>{ALGO_CONCEPTS[selectedAlgoTab].vivaTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}