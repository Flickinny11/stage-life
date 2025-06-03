import React, { useState } from 'react';
import RecordingControls from './audio/RecordingControls';
import DrumstickAnimation from './3d/DrumstickAnimation';
import VanAnimation from './3d/VanAnimation';
import './StageLifeInterface.css';

function StageLifeInterface() {
  const [showRecording, setShowRecording] = useState(false);
  const [drumstickHovered, setDrumstickHovered] = useState(false);
  const [vanHovered, setVanHovered] = useState(false);

  return (
    <div className="stage-life-interface">
      <div className="main-container">
        <header className="main-header">
          <h1>
            <span className="stage-text">Stage</span>
            <span className="life-text">-Life</span>
          </h1>
          <h2 className="tagline">Record. Better.</h2>
          <p className="description">
            Professional live performance recording, mixing, and mastering solution
          </p>
        </header>

        <div className="animation-panels">
          <div 
            className="panel drumsticks-panel glass-effect" 
            onClick={() => setShowRecording(!showRecording)}
            onMouseEnter={() => setDrumstickHovered(true)}
            onMouseLeave={() => setDrumstickHovered(false)}
          >
            <DrumstickAnimation isHovered={drumstickHovered} />
          </div>

          <div 
            className="panel van-panel glass-effect"
            onMouseEnter={() => setVanHovered(true)}
            onMouseLeave={() => setVanHovered(false)}
          >
            <VanAnimation isHovered={vanHovered} />
          </div>
        </div>

        {showRecording && <RecordingControls />}

        <div className="action-buttons">
          <button className="cta-button glass-effect">
            Get Stage-Life - $9
          </button>
          <button 
            className="demo-button glass-effect"
            onClick={() => setShowRecording(!showRecording)}
          >
            {showRecording ? 'Hide Studio' : 'Try Recording Studio'}
          </button>
        </div>

        <div className="features-preview">
          <div className="feature glass-effect">
            <h3>Real-time Recording</h3>
            <p>Capture live performances with professional quality</p>
          </div>
          <div className="feature glass-effect">
            <h3>AI-Powered Mixing</h3>
            <p>Intelligent audio processing and enhancement</p>
          </div>
          <div className="feature glass-effect">
            <h3>Logic Pro Integration</h3>
            <p>Seamless workflow with your favorite DAW</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StageLifeInterface;