import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';

export default function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange
}) {
  return (
    <div className="playback-panel">
      <div className="scrubber-container">
        <span className="step-counter">
          Step <strong>{totalSteps === 0 ? 0 : currentStep + 1}</strong> of <strong>{totalSteps}</strong>
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onStepForward(Number(e.target.value) - currentStep)}
          disabled={totalSteps === 0}
          className="scrubber-range"
        />
      </div>

      <div className="playback-buttons-row">
        <button
          type="button"
          onClick={onReset}
          disabled={totalSteps === 0 || currentStep === 0}
          className="ctrl-btn"
          title="Reset to Start"
        >
          <RotateCcw size={16} />
        </button>

        <button
          type="button"
          onClick={() => onStepBackward()}
          disabled={totalSteps === 0 || currentStep === 0}
          className="ctrl-btn"
          title="Previous Step"
        >
          <SkipBack size={16} />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          disabled={totalSteps === 0}
          className={`ctrl-btn play-btn ${isPlaying ? 'playing' : ''}`}
          title={isPlaying ? 'Pause' : 'Play Simulation'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          type="button"
          onClick={() => onStepForward(1)}
          disabled={totalSteps === 0 || currentStep >= totalSteps - 1}
          className="ctrl-btn"
          title="Next Step"
        >
          <SkipForward size={16} />
        </button>

        <div className="speed-toggle-group">
          {[
            { label: '0.5x', val: 1200 },
            { label: '1x', val: 600 },
            { label: '2x', val: 300 }
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onSpeedChange(s.val)}
              className={`speed-pill ${speed === s.val ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}