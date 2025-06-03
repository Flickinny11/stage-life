import React, { useState, useEffect } from 'react';
import PluginCommunication from './PluginCommunication';
import './PluginConnection.css';

function PluginConnection() {
  const [pluginComm] = useState(() => new PluginCommunication());
  const [isConnected, setIsConnected] = useState(false);
  const [pluginRecording, setPluginRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastDataTime, setLastDataTime] = useState(null);

  useEffect(() => {
    // Set up event handlers
    pluginComm.onConnect(() => {
      setIsConnected(true);
      console.log('Connected to Logic Pro plugin');
    });

    pluginComm.onDisconnect(() => {
      setIsConnected(false);
      setPluginRecording(false);
      console.log('Disconnected from Logic Pro plugin');
    });

    pluginComm.onAudioData((audioData) => {
      setLastDataTime(new Date().toLocaleTimeString());
      // Process audio data if needed
    });

    pluginComm.onParameterChange((name, value) => {
      if (name === 'input_level') {
        setAudioLevel(value);
      }
    });

    // Initialize connection
    pluginComm.initialize();
    
    // Start simulation for demo
    pluginComm.startSimulation();

    return () => {
      pluginComm.disconnect();
    };
  }, [pluginComm]);

  const handleConnect = () => {
    pluginComm.initialize();
  };

  const handleStartRecording = () => {
    if (pluginComm.startRecording()) {
      setPluginRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (pluginComm.stopRecording()) {
      setPluginRecording(false);
    }
  };

  const handleGainChange = (event) => {
    const gain = parseFloat(event.target.value);
    pluginComm.setParameter('gain', gain);
  };

  return (
    <div className="plugin-connection glass-effect">
      <h3>Logic Pro Plugin Connection</h3>
      
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {isConnected ? 'Connected to Logic Pro' : 'Not Connected'}
        </div>
        
        {!isConnected && (
          <button className="connect-button" onClick={handleConnect}>
            Connect to Plugin
          </button>
        )}
      </div>

      {isConnected && (
        <div className="plugin-controls">
          <div className="recording-section">
            <h4>Plugin Recording</h4>
            <div className="plugin-recording-status">
              <span className={`recording-indicator ${pluginRecording ? 'active' : 'inactive'}`}>
                {pluginRecording ? '● Recording from Logic Pro' : '○ Ready'}
              </span>
            </div>
            
            <div className="plugin-buttons">
              <button 
                className={`plugin-record-btn ${pluginRecording ? 'stop' : 'start'}`}
                onClick={pluginRecording ? handleStopRecording : handleStartRecording}
              >
                {pluginRecording ? 'Stop Plugin Recording' : 'Start Plugin Recording'}
              </button>
            </div>
          </div>

          <div className="audio-monitoring">
            <h4>Audio Monitoring</h4>
            <div className="level-meter">
              <label>Input Level:</label>
              <div className="level-bar">
                <div 
                  className="level-fill" 
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>
              <span className="level-value">{audioLevel.toFixed(1)}%</span>
            </div>
            
            {lastDataTime && (
              <div className="data-status">
                Last data: {lastDataTime}
              </div>
            )}
          </div>

          <div className="plugin-parameters">
            <h4>Plugin Parameters</h4>
            <div className="parameter-control">
              <label>Master Gain:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                defaultValue="1"
                onChange={handleGainChange}
                className="parameter-slider"
              />
            </div>
          </div>

          <div className="plugin-info">
            <div className="info-item">
              <span className="info-label">Sample Rate:</span>
              <span className="info-value">48 kHz</span>
            </div>
            <div className="info-item">
              <span className="info-label">Buffer Size:</span>
              <span className="info-value">256 samples</span>
            </div>
            <div className="info-item">
              <span className="info-label">Latency:</span>
              <span className="info-value">5.3 ms</span>
            </div>
          </div>
        </div>
      )}

      <div className="plugin-features">
        <h4>Plugin Features</h4>
        <ul>
          <li>✅ Real-time audio capture from Logic Pro master bus</li>
          <li>✅ Low-latency communication with Stage-Life app</li>
          <li>✅ Professional parameter automation</li>
          <li>🔄 VST3/AU cross-platform compatibility</li>
        </ul>
      </div>
    </div>
  );
}

export default PluginConnection;