import React, { useState, useEffect } from 'react';
import AudioEngine from './AudioEngine';
import AudioVisualizer from './AudioVisualizer';
import './RecordingControls.css';

function RecordingControls() {
  const [audioEngine] = useState(() => new AudioEngine());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [gain, setGain] = useState(1.0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const initializeAudio = async () => {
    const initialized = await audioEngine.initialize();
    if (initialized) {
      setIsInitialized(true);
      const permission = await audioEngine.requestMicrophoneAccess();
      setHasPermission(permission);
    }
  };

  const startRecording = () => {
    if (audioEngine.startRecording()) {
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (audioEngine.stopRecording()) {
      setIsRecording(false);
    }
  };

  const handleGainChange = (event) => {
    const newGain = parseFloat(event.target.value);
    setGain(newGain);
    audioEngine.setGain(newGain);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isInitialized) {
    return (
      <div className="recording-controls glass-effect">
        <h3>Professional Recording Suite</h3>
        <p>Initialize audio system to begin live recording</p>
        <button 
          className="init-button glass-effect"
          onClick={initializeAudio}
        >
          Initialize Audio System
        </button>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="recording-controls glass-effect">
        <h3>Microphone Access Required</h3>
        <p>Please grant microphone permission for live recording</p>
        <button 
          className="init-button glass-effect"
          onClick={initializeAudio}
        >
          Request Permission
        </button>
      </div>
    );
  }

  return (
    <div className="recording-controls glass-effect">
      <h3>Live Recording Studio</h3>
      
      <div className="recording-status">
        <div className={`status-indicator ${isRecording ? 'recording' : 'ready'}`}>
          {isRecording ? '● Recording' : '○ Ready'}
        </div>
        <div className="recording-time">
          {formatTime(recordingTime)}
        </div>
      </div>

      <div className="visualizer-section">
        <AudioVisualizer 
          audioEngine={audioEngine} 
          isActive={hasPermission}
        />
      </div>

      <div className="controls-section">
        <div className="primary-controls">
          <button
            className={`record-button ${isRecording ? 'stop' : 'record'}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? '⏹ Stop Recording' : '🔴 Start Recording'}
          </button>
        </div>

        <div className="audio-controls">
          <div className="gain-control">
            <label>Input Gain:</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={gain}
              onChange={handleGainChange}
              className="gain-slider"
            />
            <span className="gain-value">{gain.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      <div className="features-info">
        <div className="feature-item">
          <span className="feature-icon">🎵</span>
          <span>48kHz High-Quality Recording</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🎛️</span>
          <span>Real-time Audio Processing</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔗</span>
          <span>Logic Pro Integration Ready</span>
        </div>
      </div>
    </div>
  );
}

export default RecordingControls;