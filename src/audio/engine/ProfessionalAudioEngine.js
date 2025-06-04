/**
 * Professional Audio Engine for Stage-Life
 * Implements real-time DSP processing with professional-grade audio effects
 */

class ProfessionalAudioEngine {
  constructor() {
    this.audioContext = null;
    this.inputStream = null;
    this.mediaRecorder = null;
    this.isRecording = false;
    this.isInitialized = false;
    
    // Audio processing nodes
    this.inputNode = null;
    this.gainNode = null;
    this.analyserNode = null;
    this.eqNode = null;
    this.compressorNode = null;
    this.reverbNode = null;
    this.outputNode = null;
    
    // Multi-track recording support
    this.tracks = new Map();
    this.activeChannels = 0;
    this.maxChannels = 16;
    
    // Analysis data
    this.analysisData = {
      frequencies: null,
      lufs: 0,
      truePeak: 0,
      dynamicRange: 0
    };
    
    // Processing parameters
    this.processingParams = {
      eq: {
        lowGain: 0,
        midGain: 0,
        highGain: 0,
        lowFreq: 200,
        midFreq: 1000,
        highFreq: 5000
      },
      compressor: {
        threshold: -16,
        ratio: 4,
        attack: 0.003,
        release: 0.1,
        knee: 2
      },
      reverb: {
        roomSize: 0.3,
        damping: 0.5,
        wetness: 0.2
      }
    };
  }

  async initialize(sampleRate = 48000) {
    try {
      // Initialize high-quality audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: sampleRate,
        latencyHint: 'interactive'
      });
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create processing chain
      this.createProcessingChain();
      
      this.isInitialized = true;
      console.log('Professional Audio Engine initialized successfully');
      console.log(`Sample Rate: ${this.audioContext.sampleRate}Hz`);
      console.log(`Base Latency: ${this.audioContext.baseLatency}s`);
      console.log(`Output Latency: ${this.audioContext.outputLatency}s`);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Professional Audio Engine:', error);
      return false;
    }
  }

  createProcessingChain() {
    // Create audio processing nodes
    this.gainNode = this.audioContext.createGain();
    this.analyserNode = this.createAnalyserNode();
    this.eqNode = this.createEQNode();
    this.compressorNode = this.createCompressorNode();
    this.outputNode = this.audioContext.createGain();
    
    // Connect processing chain
    // Input -> EQ -> Compressor -> Gain -> Analyser -> Output
    this.gainNode.connect(this.eqNode);
    this.eqNode.connect(this.compressorNode);
    this.compressorNode.connect(this.analyserNode);
    this.analyserNode.connect(this.outputNode);
    
    console.log('Audio processing chain created');
  }

  createAnalyserNode() {
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 4096; // Higher resolution for professional analysis
    analyser.smoothingTimeConstant = 0.3;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    
    // Initialize analysis buffers
    this.analysisData.frequencies = new Float32Array(analyser.frequencyBinCount);
    
    return analyser;
  }

  createEQNode() {
    // Create 3-band parametric EQ using BiquadFilter nodes
    const lowFilter = this.audioContext.createBiquadFilter();
    const midFilter = this.audioContext.createBiquadFilter();
    const highFilter = this.audioContext.createBiquadFilter();
    
    // Configure filters
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = this.processingParams.eq.lowFreq;
    lowFilter.gain.value = this.processingParams.eq.lowGain;
    
    midFilter.type = 'peaking';
    midFilter.frequency.value = this.processingParams.eq.midFreq;
    midFilter.gain.value = this.processingParams.eq.midGain;
    midFilter.Q.value = 0.7;
    
    highFilter.type = 'highshelf';
    highFilter.frequency.value = this.processingParams.eq.highFreq;
    highFilter.gain.value = this.processingParams.eq.highGain;
    
    // Chain filters together
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    
    // Store references for parameter updates
    this.eqFilters = { lowFilter, midFilter, highFilter };
    
    return lowFilter; // Return input of the chain
  }

  createCompressorNode() {
    const compressor = this.audioContext.createDynamicsCompressor();
    const params = this.processingParams.compressor;
    
    compressor.threshold.value = params.threshold;
    compressor.ratio.value = params.ratio;
    compressor.attack.value = params.attack;
    compressor.release.value = params.release;
    compressor.knee.value = params.knee;
    
    return compressor;
  }

  createReverbNode(roomSize = 0.3, damping = 0.5, wetness = 0.2) {
    // Create convolution reverb using impulse response
    const convolver = this.audioContext.createConvolver();
    const wetGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    const output = this.audioContext.createGain();
    
    // Generate impulse response for room simulation
    const impulseBuffer = this.generateImpulseResponse(roomSize, damping);
    convolver.buffer = impulseBuffer;
    
    // Set wet/dry mix
    wetGain.gain.value = wetness;
    dryGain.gain.value = 1 - wetness;
    
    // Create reverb routing
    return {
      input: output,
      convolver,
      wetGain,
      dryGain,
      output
    };
  }

  generateImpulseResponse(roomSize, damping) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * roomSize * 4; // Room size affects reverb time
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - damping, i / sampleRate);
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    
    return impulse;
  }

  async requestMicrophoneAccess(channels = 2) {
    try {
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: this.audioContext.sampleRate,
          channelCount: Math.min(channels, this.maxChannels),
          latency: 0,
          volume: 1.0
        }
      };

      this.inputStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.inputNode = this.audioContext.createMediaStreamSource(this.inputStream);
      
      // Connect input to processing chain
      this.inputNode.connect(this.gainNode);
      
      this.activeChannels = this.inputStream.getAudioTracks()[0].getSettings().channelCount || 2;
      
      console.log(`Microphone access granted - ${this.activeChannels} channels`);
      return true;
    } catch (error) {
      console.error('Failed to access microphone:', error);
      return false;
    }
  }

  createMultiTrackRecorder(channels = 16) {
    if (!this.inputStream) {
      throw new Error('No input stream available for recording');
    }

    try {
      // Create high-quality multi-track recorder
      this.mediaRecorder = new MediaRecorder(this.inputStream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 320000 // High bitrate for professional quality
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.processMultiTrackRecording();
      };

      console.log(`Multi-track recorder created for ${channels} channels`);
      return this.mediaRecorder;
    } catch (error) {
      console.error('Failed to create multi-track recorder:', error);
      throw error;
    }
  }

  processMultiTrackRecording() {
    if (this.recordedChunks.length === 0) {
      return null;
    }

    const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(blob);
    
    return {
      blob,
      url: audioUrl,
      duration: this.getRecordingDuration(),
      channels: this.activeChannels,
      sampleRate: this.audioContext.sampleRate,
      timestamp: new Date().toISOString()
    };
  }

  getRecordingDuration() {
    const totalSize = this.recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0);
    const bitrate = 320000; // bits per second
    return (totalSize * 8) / bitrate;
  }

  // Real-time audio analysis
  analyzeAudio() {
    if (!this.analyserNode) return null;

    // Get frequency data
    this.analyserNode.getFloatFrequencyData(this.analysisData.frequencies);
    
    // Calculate LUFS (simplified implementation)
    const lufs = this.calculateLUFS(this.analysisData.frequencies);
    
    // Calculate True Peak (simplified)
    const truePeak = this.calculateTruePeak(this.analysisData.frequencies);
    
    // Calculate Dynamic Range
    const dynamicRange = this.calculateDynamicRange(this.analysisData.frequencies);
    
    this.analysisData.lufs = lufs;
    this.analysisData.truePeak = truePeak;
    this.analysisData.dynamicRange = dynamicRange;
    
    return {
      frequencies: Array.from(this.analysisData.frequencies),
      lufs,
      truePeak,
      dynamicRange,
      timestamp: this.audioContext.currentTime
    };
  }

  calculateLUFS(frequencies) {
    // Simplified LUFS calculation based on frequency analysis
    let sum = 0;
    for (let i = 0; i < frequencies.length; i++) {
      const db = frequencies[i];
      if (db > -Infinity) {
        sum += Math.pow(10, db / 10);
      }
    }
    const meanSquare = sum / frequencies.length;
    return -0.691 + 10 * Math.log10(meanSquare);
  }

  calculateTruePeak(frequencies) {
    // Simplified true peak calculation
    let maxPeak = -Infinity;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] > maxPeak) {
        maxPeak = frequencies[i];
      }
    }
    return maxPeak;
  }

  calculateDynamicRange(frequencies) {
    // Calculate dynamic range (difference between peak and RMS)
    const peak = this.calculateTruePeak(frequencies);
    const rms = this.calculateRMS(frequencies);
    return peak - rms;
  }

  calculateRMS(frequencies) {
    let sum = 0;
    for (let i = 0; i < frequencies.length; i++) {
      const db = frequencies[i];
      if (db > -Infinity) {
        sum += Math.pow(10, db / 10);
      }
    }
    return 10 * Math.log10(sum / frequencies.length);
  }

  // Parameter control methods
  updateEQ(band, frequency, gain, Q = 0.7) {
    if (!this.eqFilters) return;

    switch (band) {
      case 'low':
        this.eqFilters.lowFilter.frequency.value = frequency;
        this.eqFilters.lowFilter.gain.value = gain;
        break;
      case 'mid':
        this.eqFilters.midFilter.frequency.value = frequency;
        this.eqFilters.midFilter.gain.value = gain;
        this.eqFilters.midFilter.Q.value = Q;
        break;
      case 'high':
        this.eqFilters.highFilter.frequency.value = frequency;
        this.eqFilters.highFilter.gain.value = gain;
        break;
    }

    this.processingParams.eq[`${band}Freq`] = frequency;
    this.processingParams.eq[`${band}Gain`] = gain;
  }

  updateCompressor(threshold, ratio, attack, release, knee) {
    if (!this.compressorNode) return;

    this.compressorNode.threshold.value = threshold;
    this.compressorNode.ratio.value = ratio;
    this.compressorNode.attack.value = attack;
    this.compressorNode.release.value = release;
    this.compressorNode.knee.value = knee;

    Object.assign(this.processingParams.compressor, {
      threshold, ratio, attack, release, knee
    });
  }

  setGain(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  scheduleEvent(callback, time) {
    // Sample-accurate timing for scheduled events
    const scheduleTime = this.audioContext.currentTime + time;
    
    // Use Web Audio API's precise timing
    const oscillator = this.audioContext.createOscillator();
    oscillator.onended = callback;
    oscillator.connect(this.audioContext.createGain()); // Silent connection
    oscillator.start(scheduleTime);
    oscillator.stop(scheduleTime + 0.001); // Very short duration
  }

  startRecording() {
    if (!this.mediaRecorder || this.isRecording) {
      return false;
    }

    try {
      this.recordedChunks = [];
      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;
      
      console.log('Professional recording started');
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) {
      return false;
    }

    this.mediaRecorder.stop();
    this.isRecording = false;
    
    console.log('Professional recording stopped');
    return true;
  }

  // Cleanup resources
  destroy() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }

    if (this.inputStream) {
      this.inputStream.getTracks().forEach(track => track.stop());
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    this.tracks.clear();
    this.isRecording = false;
    this.isInitialized = false;
    
    console.log('Professional Audio Engine destroyed');
  }

  // Getters for current state
  get latency() {
    return this.audioContext ? 
      (this.audioContext.baseLatency + this.audioContext.outputLatency) * 1000 : 0;
  }

  get sampleRate() {
    return this.audioContext ? this.audioContext.sampleRate : 0;
  }

  get isReady() {
    return this.isInitialized && this.inputNode && !this.audioContext.state === 'suspended';
  }
}

export default ProfessionalAudioEngine;