import React, { useState, useEffect } from 'react';
import RecordingControls from './audio/RecordingControls';
import PluginConnection from './communication/PluginConnection';
import PaymentModal from './payment/PaymentModal';
import DrumstickAnimation from './3d/DrumstickAnimation';
import VanAnimation from './3d/VanAnimation';
import './StageLifeInterface.css';

function StageLifeInterface() {
  const [showRecording, setShowRecording] = useState(false);
  const [showPlugin, setShowPlugin] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [drumstickHovered, setDrumstickHovered] = useState(false);
  const [vanHovered, setVanHovered] = useState(false);

  useEffect(() => {
    // Check if already activated
    const activation = localStorage.getItem('stage-life-activation');
    if (activation) {
      try {
        const data = JSON.parse(activation);
        setIsActivated(!!data.activationKey);
      } catch (error) {
        console.error('Error parsing activation data:', error);
      }
    }
  }, []);

  const handlePaymentSuccess = (activationKey) => {
    setIsActivated(true);
    alert(`Payment successful! Your activation key is: ${activationKey}`);
  };

  const handlePurchaseClick = () => {
    if (isActivated) {
      alert('Stage-Life is already activated on this device!');
    } else {
      setShowPayment(true);
    }
  };

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
          {isActivated && (
            <div className="activation-status">
              ✅ Professional License Active
            </div>
          )}
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
            onClick={() => setShowPlugin(!showPlugin)}
            onMouseEnter={() => setVanHovered(true)}
            onMouseLeave={() => setVanHovered(false)}
          >
            <VanAnimation isHovered={vanHovered} />
          </div>
        </div>

        {showRecording && <RecordingControls />}
        {showPlugin && <PluginConnection />}

        <div className="action-buttons">
          <button 
            className={`cta-button glass-effect ${isActivated ? 'activated' : ''}`}
            onClick={handlePurchaseClick}
          >
            {isActivated ? '✅ Stage-Life Activated' : 'Get Stage-Life - $9'}
          </button>
          <button 
            className="demo-button glass-effect"
            onClick={() => setShowRecording(!showRecording)}
          >
            {showRecording ? 'Hide Studio' : 'Try Recording Studio'}
          </button>
          <button 
            className="demo-button glass-effect"
            onClick={() => setShowPlugin(!showPlugin)}
          >
            {showPlugin ? 'Hide Plugin' : 'Logic Pro Plugin'}
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

      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default StageLifeInterface;