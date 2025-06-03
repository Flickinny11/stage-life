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
  }

  async initialize() {
    try {
      // Initialize Audio Context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      console.log('Audio Engine initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Audio Engine:', error);
      return false;
    }
  }

  async requestMicrophoneAccess() {
    try {
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
      // Setup MediaRecorder for high-quality recording
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

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;
      
      console.log('Recording started');
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
    
    console.log('Recording stopped');
    return true;
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
    if (!this.analyser || !this.dataArray) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    return {
      frequency: Array.from(this.dataArray),
      sampleRate: this.audioContext.sampleRate,
      timestamp: this.audioContext.currentTime
    };
  }

  setGain(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  async applyAIProcessing(audioBlob) {
    // Placeholder for AI processing integration
    // This will be enhanced with local AI models in Phase 3
    console.log('AI processing placeholder - ready for enhancement');
    return audioBlob;
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

    this.isRecording = false;
    console.log('Audio Engine destroyed');
  }
}

export default AudioEngine;