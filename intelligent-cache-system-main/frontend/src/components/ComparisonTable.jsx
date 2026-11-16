import React from 'react';
import { Award, Clock, Database, Layers, ArrowUpRight } from 'lucide-react';

export default function ComparisonTable({
  comparisonData,
  activeAlgo,
  onSelectAlgo
}) {
  const displayData = comparisonData || [];
  if (displayData.length === 0) return null;

  return (
    <div className="comparison-section">
      <div className="comparison-header">
        <div>
          <h3 className="comparison-title">Multi-Algorithm Performance Benchmark</h3>
          <p className="comparison-subtitle">
            Ranked by Hit Efficiency on the current workload. Click any card to inspect its step-by-step memory trace.
          </p>
        </div>
      </div>

      <div className="benchmark-cards-grid">
        {displayData.map((item, index) => {
          const isSelected = activeAlgo === item.algorithm;
          const isBest = index === 0;

          return (
            <div
              key={item.algorithm}
              onClick={() => onSelectAlgo(item.algorithm)}
              className={`benchmark-card ${isSelected ? 'selected' : ''} ${isBest ? 'gold-border' : ''}`}
            >
              <div className="card-top-row">
                <div className="rank-and-name">
                  <span className={`rank-badge ${isBest ? 'rank-1' : ''}`}>#{index + 1}</span>
                  <strong className="algo-name">{item.algorithm}</strong>
                </div>
                {isBest && (
                  <span className="best-tag">
                    <Award size={14} /> Highest Hit Ratio
                  </span>
                )}
              </div>

              <div className="ratio-bar-wrapper">
                <div className="ratio-labels">
                  <span>Hit Ratio</span>
                  <strong className="ratio-num">{(item.hitRatio * 100).toFixed(1)}%</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.max(4, item.hitRatio * 100)}%` }}
                  />
                </div>
              </div>

              <div className="metrics-mini-grid">
                <div className="metric-cell">
                  <span className="label">Hits / Misses</span>
                  <span className="val">
                    <span style={{ color: '#10b981' }}>{item.hits}</span> /{' '}
                    <span style={{ color: '#f43f5e' }}>{item.misses}</span>
                  </span>
                </div>

                <div className="metric-cell">
                  <span className="label">Replacements</span>
                  <span className="val">{item.replacements || 0}</span>
                </div>

                <div className="metric-cell">
                  <span className="label">Memory Overhead</span>
                  <span className="val">{item.memoryOverhead || `${item.memoryOverheadBytes || 0} B`}</span>
                </div>

                <div className="metric-cell">
                  <span className="label">Compute Latency</span>
                  <span className="val">{item.executionTimeMs} ms</span>
                </div>
              </div>

              <div className="inspect-footer">
                {isSelected ? 'Currently Viewing Trace' : 'Click to View Step Trace'}
                <ArrowUpRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}