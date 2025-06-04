import { io } from 'socket.io-client';

class PluginCommunication {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.pluginData = {
      isRecording: false,
      audioLevel: 0,
      sampleRate: 48000,
      parameters: {}
    };
    this.callbacks = {
      onConnect: null,
      onDisconnect: null,
      onAudioData: null,
      onParameterChange: null
    };
  }

  initialize(port = 8080) {
    try {
      // For MVP, we'll simulate plugin communication
      // In production, this would connect to a WebSocket server
      console.log('Initializing plugin communication on port', port);
      
      // Simulate connection success
      setTimeout(() => {
        this.isConnected = true;
        if (this.callbacks.onConnect) {
          this.callbacks.onConnect();
        }
        console.log('Plugin communication initialized');
      }, 1000);

      return true;
    } catch (error) {
      console.error('Failed to initialize plugin communication:', error);
      return false;
    }
  }

  // Send commands to plugin
  startRecording() {
    if (!this.isConnected) {
      console.warn('Plugin not connected');
      return false;
    }

    const message = {
      type: 'command',
      action: 'start_recording',
      timestamp: Date.now()
    };

    this.sendMessage(message);
    this.pluginData.isRecording = true;
    return true;
  }

  stopRecording() {
    if (!this.isConnected) {
      console.warn('Plugin not connected');
      return false;
    }

    const message = {
      type: 'command',
      action: 'stop_recording',
      timestamp: Date.now()
    };

    this.sendMessage(message);
    this.pluginData.isRecording = false;
    return true;
  }

  setParameter(name, value) {
    if (!this.isConnected) {
      console.warn('Plugin not connected');
      return false;
    }

    const message = {
      type: 'parameter',
      name: name,
      value: value,
      timestamp: Date.now()
    };

    this.sendMessage(message);
    this.pluginData.parameters[name] = value;
    return true;
  }

  // Simulate receiving audio data from plugin
  simulateAudioData() {
    if (!this.isConnected || !this.pluginData.isRecording) {
      return;
    }

    // Generate mock audio data for demonstration
    const audioData = {
      type: 'audio_data',
      samples: this.generateMockSamples(1024),
      sampleRate: this.pluginData.sampleRate,
      channels: 2,
      timestamp: Date.now()
    };

    if (this.callbacks.onAudioData) {
      this.callbacks.onAudioData(audioData);
    }
  }

  generateMockSamples(numSamples) {
    const samples = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      // Generate some realistic audio-like data
      samples[i] = (Math.random() - 0.5) * 0.1 * Math.sin(i * 0.01);
    }
    return Array.from(samples);
  }

  sendMessage(message) {
    // For MVP, just log the message
    // In production, this would send via WebSocket
    console.log('Sending to plugin:', message);
    
    // Simulate response for demo purposes
    setTimeout(() => {
      this.handlePluginMessage({
        type: 'response',
        original: message,
        status: 'success',
        timestamp: Date.now()
      });
    }, 100);
  }

  handlePluginMessage(message) {
    console.log('Received from plugin:', message);

    switch (message.type) {
      case 'status':
        this.handleStatusUpdate(message);
        break;
      case 'audio_data':
        if (this.callbacks.onAudioData) {
          this.callbacks.onAudioData(message);
        }
        break;
      case 'parameter_change':
        this.pluginData.parameters[message.name] = message.value;
        if (this.callbacks.onParameterChange) {
          this.callbacks.onParameterChange(message.name, message.value);
        }
        break;
      case 'response':
        // Handle command responses
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  handleStatusUpdate(message) {
    if (message.connected !== undefined) {
      this.isConnected = message.connected;
      if (!this.isConnected && this.callbacks.onDisconnect) {
        this.callbacks.onDisconnect();
      }
    }

    if (message.recording !== undefined) {
      this.pluginData.isRecording = message.recording;
    }

    if (message.audioLevel !== undefined) {
      this.pluginData.audioLevel = message.audioLevel;
    }
  }

  // Event handlers
  onConnect(callback) {
    this.callbacks.onConnect = callback;
  }

  onDisconnect(callback) {
    this.callbacks.onDisconnect = callback;
  }

  onAudioData(callback) {
    this.callbacks.onAudioData = callback;
  }

  onParameterChange(callback) {
    this.callbacks.onParameterChange = callback;
  }

  // Getters
  getConnectionStatus() {
    return this.isConnected;
  }

  getPluginData() {
    return { ...this.pluginData };
  }

  isPluginRecording() {
    return this.pluginData.isRecording;
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isConnected = false;
    console.log('Plugin communication disconnected');
  }

  // Start simulation for demo purposes
  startSimulation() {
    setInterval(() => {
      if (this.isConnected) {
        this.simulateAudioData();
        
        // Simulate parameter changes occasionally
        if (Math.random() < 0.1) {
          const level = Math.random() * 100;
          this.handlePluginMessage({
            type: 'parameter_change',
            name: 'input_level',
            value: level,
            timestamp: Date.now()
          });
        }
      }
    }, 100);
  }
}

export default PluginCommunication;