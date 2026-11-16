import React from 'react';
import { ArrowDown, CheckCircle2, AlertCircle, AlertTriangle, Cpu } from 'lucide-react';

export default function Visualizer({ currentStepData, cacheCapacity, activeAlgoName }) {
  if (!currentStepData) {
    return (
      <div className="visualizer-empty">
        <Cpu size={40} color="#6366f1" />
        <p>Run a simulation above to view the animated memory frames.</p>
      </div>
    );
  }

  const { request, cacheState, result, evictedPage, predictions } = currentStepData;
  const isHit = result === 'HIT';

  const paddedSlots = Array.from({ length: cacheCapacity }, (_, i) => {
    const pageVal = cacheState && cacheState[i] !== undefined ? cacheState[i] : null;
    let score = null;

    if (pageVal !== null && predictions && Array.isArray(predictions)) {
      const predObj = predictions.find((p) => p.page === pageVal);
      if (predObj) score = predObj.score;
    }

    return {
      index: i,
      page: pageVal,
      isRequestedPage: pageVal === request,
      score
    };
  });

  return (
    <div className="visualizer-container">
      <div className="step-status-header">
        <div className="status-metric">
          <span className="status-label">Accessing Virtual Page</span>
          <div className="requested-page-badge">Page {request}</div>
        </div>

        <div className={`status-pill ${isHit ? 'hit' : 'miss'}`}>
          {isHit ? (
            <>
              <CheckCircle2 size={18} />
              <span>PAGE HIT</span>
            </>
          ) : (
            <>
              <AlertCircle size={18} />
              <span>PAGE FAULT (MISS)</span>
            </>
          )}
        </div>

        {evictedPage !== null && (
          <div className="eviction-alert-pill">
            <AlertTriangle size={16} />
            <span>Evicted Victim: Page <strong>{evictedPage}</strong></span>
          </div>
        )}
      </div>

      <div className="frames-section">
        <h4 className="frames-heading">Physical Memory Cache Slots ({cacheCapacity} Frames)</h4>
        <div className="frame-slots-grid">
          {paddedSlots.map((slot) => {
            const hasPage = slot.page !== null;
            const isTarget = slot.isRequestedPage;

            return (
              <div
                key={slot.index}
                className={`frame-slot-card ${hasPage ? 'occupied' : 'empty'} ${
                  isTarget && isHit ? 'hit-highlight' : ''
                } ${isTarget && !isHit ? 'inserted-highlight' : ''}`}
              >
                <div className="slot-id">Frame #{slot.index}</div>
                <div className="slot-content">
                  {hasPage ? (
                    <span className="page-id-text">Page {slot.page}</span>
                  ) : (
                    <span className="empty-text">[ Empty Slot ]</span>
                  )}
                </div>

                {slot.score !== null && (
                  <div className="pred-score-badge" title="Predicted Future Utility Score">
                    Score: <strong>{(slot.score * 100).toFixed(0)}%</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}