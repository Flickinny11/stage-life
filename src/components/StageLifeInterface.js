import React from 'react';
import './StageLifeInterface.css';

function StageLifeInterface() {
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
          <div className="panel drumsticks-panel glass-effect">
            <div className="drumsticks-container">
              <div className="drumstick left"></div>
              <div className="drumstick right"></div>
              <div className="live-text">Live</div>
            </div>
          </div>

          <div className="panel van-panel glass-effect">
            <div className="van-container">
              <div className="van-body"></div>
              <div className="van-door left-door"></div>
              <div className="van-door right-door"></div>
              <div className="smoke-effect"></div>
              <div className="example-text">Example</div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="cta-button glass-effect">
            Get Stage-Life - $9
          </button>
          <button className="demo-button glass-effect">
            Try Demo
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