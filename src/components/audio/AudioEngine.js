import ProfessionalAudioEngine from '../../audio/engine/ProfessionalAudioEngine';
import AudioAI from '../../ai/AudioAI';

class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.microphone = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.analyser = null;
    this.dataArray = null;
    this.gainNode = null;
    
    // Enhanced capabilities
    this.professionalEngine = new ProfessionalAudioEngine();
    this.audioAI = new AudioAI();
    this.isProfessionalMode = false;
    
    // Real-time analysis data
    this.analysisData = {
      lufs: 0,
      truePeak: 0,
      dynamicRange: 0,
      frequencies: null
    };
  }

  async initialize() {
    try {
      // Initialize basic Audio Context first
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Initialize professional engine and AI
      await this.professionalEngine.initialize();
      await this.audioAI.initialize();

      console.log('Enhanced Audio Engine initialized successfully');
      console.log(`Sample Rate: ${this.audioContext.sampleRate}Hz`);
      console.log(`Professional Engine: ${this.professionalEngine.isReady ? 'Ready' : 'Not Ready'}`);
      console.log(`AI Processing: ${this.audioAI.isReady ? 'Ready' : 'Not Ready'}`);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Enhanced Audio Engine:', error);
      return false;
    }
  }

  async requestMicrophoneAccess() {
    try {
      // Use professional engine if available
      if (this.professionalEngine.isReady) {
        console.log('Using professional audio engine for microphone access');
        const success = await this.professionalEngine.requestMicrophoneAccess();
        if (success) {
          this.isProfessionalMode = true;
          return true;
        }
      }

      // Fallback to basic implementation
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000
        }
      });

      this.microphone = stream;
      this.setupAudioNodes(stream);
      return true;
    } catch (error) {
      console.error('Failed to access microphone:', error);
      return false;
    }
  }

  setupAudioNodes(stream) {
    // Create audio nodes
    const source = this.audioContext.createMediaStreamSource(stream);
    this.gainNode = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();

    // Configure analyser
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    // Connect audio nodes
    source.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    
    // Don't connect to destination to avoid feedback
    // this.analyser.connect(this.audioContext.destination);
  }

  startRecording() {
    if (!this.microphone || this.isRecording) {
      return false;
    }

    try {
      // Use professional engine if available
      if (this.isProfessionalMode && this.professionalEngine.isReady) {
        console.log('Starting professional recording');
        this.professionalEngine.createMultiTrackRecorder();
        return this.professionalEngine.startRecording();
      }

      // Fallback to basic recording
      this.mediaRecorder = new MediaRecorder(this.microphone, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.processRecording();
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      
      console.log('Basic recording started');
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  stopRecording() {
    if (!this.isRecording) {
      return false;
    }

    // Use professional engine if available
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      console.log('Stopping professional recording');
      return this.professionalEngine.stopRecording();
    }

    // Fallback to basic recording
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      console.log('Basic recording stopped');
      return true;
    }

    return false;
  }

  processRecording() {
    if (this.recordedChunks.length === 0) {
      return null;
    }

    const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(blob);
    
    // Trigger download or processing
    this.downloadRecording(audioUrl, 'stage-life-recording.webm');
    
    return {
      blob,
      url: audioUrl,
      duration: this.getRecordingDuration()
    };
  }

  downloadRecording(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getRecordingDuration() {
    // Calculate approximate duration
    const totalSize = this.recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0);
    const bitrate = 128000; // bits per second
    const duration = (totalSize * 8) / bitrate;
    return duration;
  }

  getAudioData() {
    // Use professional analysis if available
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      const analysis = this.professionalEngine.analyzeAudio();
      if (analysis) {
        this.analysisData = analysis;
        return {
          frequency: analysis.frequencies,
          sampleRate: this.professionalEngine.sampleRate,
          timestamp: analysis.timestamp,
          lufs: analysis.lufs,
          truePeak: analysis.truePeak,
          dynamicRange: analysis.dynamicRange,
          latency: this.professionalEngine.latency
        };
      }
    }

    // Fallback to basic analysis
    if (!this.analyser || !this.dataArray) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    return {
      frequency: Array.from(this.dataArray),
      sampleRate: this.audioContext.sampleRate,
      timestamp: this.audioContext.currentTime,
      lufs: this.analysisData.lufs,
      truePeak: this.analysisData.truePeak,
      dynamicRange: this.analysisData.dynamicRange
    };
  }

  setGain(value) {
    // Use professional engine if available
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      this.professionalEngine.setGain(value);
    }
    
    // Also set basic gain
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  async applyAIProcessing(audioBlob) {
    if (!this.audioAI.isReady) {
      console.log('AI processing not available - using basic processing');
      return audioBlob;
    }

    try {
      // Convert blob to audio buffer for AI processing
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0);

      console.log('Applying AI processing to audio...');
      
      // Get AI analysis and suggestions
      const analysis = await this.audioAI.analyzeAudio(audioData);
      const eqSuggestions = await this.audioAI.suggestEQ(audioData);
      
      if (analysis) {
        console.log('AI Audio Analysis:', analysis);
      }
      
      if (eqSuggestions && this.isProfessionalMode) {
        console.log('Applying AI EQ suggestions:', eqSuggestions);
        // Apply AI-suggested EQ settings
        this.professionalEngine.updateEQ('low', eqSuggestions.lowFreq, eqSuggestions.lowGain);
        this.professionalEngine.updateEQ('mid', eqSuggestions.midFreq, eqSuggestions.midGain);
        this.professionalEngine.updateEQ('high', eqSuggestions.highFreq, eqSuggestions.highGain);
      }

      return audioBlob;
    } catch (error) {
      console.error('AI processing failed:', error);
      return audioBlob;
    }
  }

  destroy() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }

    if (this.microphone) {
      this.microphone.getTracks().forEach(track => track.stop());
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    // Cleanup professional engine and AI
    if (this.professionalEngine) {
      this.professionalEngine.destroy();
    }
    
    if (this.audioAI) {
      this.audioAI.dispose();
    }

    this.isRecording = false;
    this.isProfessionalMode = false;
    console.log('Enhanced Audio Engine destroyed');
  }

  // New methods for professional features
  updateEQ(band, frequency, gain, Q = 0.7) {
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      this.professionalEngine.updateEQ(band, frequency, gain, Q);
    }
  }

  updateCompressor(threshold, ratio, attack, release, knee) {
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      this.professionalEngine.updateCompressor(threshold, ratio, attack, release, knee);
    }
  }

  scheduleEvent(callback, time) {
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      this.professionalEngine.scheduleEvent(callback, time);
    }
  }

  // Getters for enhanced capabilities
  get isProfessional() {
    return this.isProfessionalMode && this.professionalEngine.isReady;
  }

  get hasAI() {
    return this.audioAI.isReady;
  }

  get latency() {
    if (this.isProfessionalMode && this.professionalEngine.isReady) {
      return this.professionalEngine.latency;
    }
    return this.audioContext ? this.audioContext.baseLatency * 1000 : 0;
  }

  get capabilities() {
    return {
      professional: this.isProfessional,
      ai: this.hasAI,
      multiTrack: this.isProfessional,
      realTimeAnalysis: this.isProfessional,
      latency: this.latency,
      sampleRate: this.audioContext ? this.audioContext.sampleRate : 0
    };
  }
}

export default AudioEngine;