import React, { useState, useEffect, useRef } from 'react';
import SimulationForm from '../components/SimulationForm';
import ComparisonTable from '../components/ComparisonTable';
import Visualizer from '../components/Visualizer';
import PlaybackControls from '../components/PlaybackControls';
import { simulationService } from '../services/api';

export default function Home() {
  const [simulationData, setSimulationData] = useState(null);
  const [activeAlgo, setActiveAlgo] = useState('PREDICTION');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  const handleRunSimulation = async (payload) => {
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    try {
      const res = await simulationService.runSimulation(payload);
      const data = res.data;
      setSimulationData(data);
      setCurrentStep(0);

      if (data.comparison && data.comparison.length > 0) {
        setActiveAlgo(data.comparison[0].algorithm);
      }
    } catch (err) {
      setError(err.message || 'Failed to run cache simulation');
    } finally {
      setLoading(false);
    }
  };

  const activeAlgoData = simulationData?.details?.[activeAlgo] || null;
  const totalSteps = activeAlgoData?.steps?.length || 0;
  const currentStepData = activeAlgoData?.steps?.[currentStep] || null;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSteps, speed]);

  const handleStepForward = (delta = 1) => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, Math.max(0, prev + delta)));
  };

  const handleStepBackward = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="home-container">
      <section className="hero-compact">
        <h1 className="hero-title-compact">
          Intelligent Cache Prediction &amp; <span className="gradient-text">Replacement System</span>
        </h1>
        <p className="hero-subtitle-compact">
          Simulating, evaluating, and visualizing FIFO, LRU, LFU, Belady's Optimal, and Statistical Predictive caching policies.
        </p>
      </section>

      <SimulationForm onRunSimulation={handleRunSimulation} loading={loading} />

      {error && <div className="alert-box error">{error}</div>}

      {simulationData && (
        <ComparisonTable
          comparisonData={simulationData.comparison}
          activeAlgo={activeAlgo}
          onSelectAlgo={(algo) => {
            setActiveAlgo(algo);
            setCurrentStep(0);
            setIsPlaying(false);
          }}
        />
      )}

      {simulationData && (
        <section className="visualizer-section">
          <div className="section-header-compact">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Step Trace Inspector: <span style={{ color: 'var(--accent-cyan)' }}>{activeAlgo}</span>
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Frame Capacity: <strong>{simulationData.cacheSize}</strong> | Total Requests: <strong>{totalSteps}</strong>
            </span>
          </div>

          <Visualizer
            currentStepData={currentStepData}
            cacheCapacity={simulationData.cacheSize}
            activeAlgoName={activeAlgo}
          />

          <PlaybackControls
            currentStep={currentStep}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={(val) => setSpeed(val)}
          />
        </section>
      )}
    </div>
  );
}