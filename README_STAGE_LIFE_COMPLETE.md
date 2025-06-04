# Stage-Life: "Record. Better."

Professional live performance recording, mixing, and mastering solution with Logic Pro integration.

## 🎯 What is Stage-Life?

Stage-Life is the complete transformation of Matchering into a professional audio platform designed for musicians, live performers, and studio engineers. It combines real-time recording, AI-powered processing, and seamless DAW integration in a beautiful, modern interface.

## ✨ Key Features

### 🎵 Real-time Audio Recording
- **Professional Quality**: 48kHz sampling with low-latency processing
- **Live Visualization**: Real-time frequency spectrum analysis
- **Smart Controls**: Adjustable gain, recording timer, and audio monitoring
- **Export Options**: High-quality WAV, FLAC, and compressed formats

### 🥁 Interactive 3D Interface
- **Animated Drumsticks**: Separate on hover to reveal "Live" recording studio
- **Van Animation**: Doors open with smoke effect revealing "Example" features
- **Glass Morphism**: Beautiful light blue gradient with translucent effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔌 Logic Pro Plugin Integration
- **Real-time Communication**: WebSocket-based plugin-to-app communication
- **Parameter Sync**: Bidirectional control and automation support
- **Professional Standards**: VST3, AU, and AAX compatibility
- **Low Latency**: <10ms round-trip for real-time performance

### 💳 Professional Licensing
- **One-Time Purchase**: $9 lifetime license
- **Secure Payment**: Credit card and PayPal integration
- **Device Activation**: Unique fingerprinting with instant activation
- **Money-Back Guarantee**: 30-day satisfaction guarantee

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Modern web browser with Web Audio API support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Flickinny11/stage-life.git
   cd stage-life
   ```

2. **Install dependencies**
   ```bash
   # Node.js dependencies
   npm install
   
   # Python dependencies  
   pip install -r requirements.txt
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Build
```bash
npm run build
```

## 🎛️ How to Use

### Recording Studio
1. Click the **animated drumsticks** to open the recording studio
2. Click "Initialize Audio System" to set up audio processing
3. Grant microphone permission when prompted
4. Adjust input gain and start recording
5. Watch real-time frequency visualization
6. Stop recording to automatically download your file

### Logic Pro Plugin
1. Click the **van animation** to open plugin connection
2. Connect to the simulated Logic Pro plugin
3. Control recording from within your DAW
4. Monitor audio levels and parameters in real-time

### Purchase & Activation
1. Click "Get Stage-Life - $9" to open payment modal
2. Complete secure payment process
3. Receive instant activation key
4. Enjoy full professional features

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern component architecture
- **Three.js**: 3D animations and WebGL rendering
- **Web Audio API**: Real-time audio processing
- **CSS3**: Glass morphism effects and animations

### Audio Engine
- **AudioEngine Class**: Professional recording capabilities
- **MediaRecorder API**: High-quality audio capture
- **Real-time Analysis**: FFT-based frequency visualization
- **Gain Control**: Professional-grade audio processing

### Plugin Framework
- **JUCE Foundation**: C++ plugin development framework
- **WebSocket Communication**: Real-time plugin-to-app messaging
- **Cross-platform**: macOS, Windows, and Linux support

### Payment System
- **Stripe Integration**: Secure payment processing
- **Device Fingerprinting**: Unique activation system
- **License Management**: Lifetime activation tracking

## 📱 Multi-Platform Support

- **Web Application**: Progressive Web App with offline capabilities
- **Desktop App**: Electron-based native applications
- **iPad App**: Optimized touch interface
- **Logic Pro Plugin**: Native AU/VST3 integration

## 🎨 Design Philosophy

Stage-Life embodies modern audio software design with:
- **Professional Aesthetics**: Clean, glass-effect interface
- **Intuitive Workflow**: Click-to-reveal interactive elements  
- **Performance First**: <10ms audio latency
- **Accessibility**: Keyboard navigation and screen reader support

## 🔊 Audio Standards

- **Sample Rates**: 44.1kHz, 48kHz, 96kHz, 192kHz
- **Bit Depths**: 16-bit, 24-bit, 32-bit float
- **Formats**: WAV, FLAC, MP3, AIFF, M4A
- **Latency**: <10ms for real-time performance
- **Quality**: Professional studio-grade audio processing

## 🛠️ Development

### Project Structure
```
src/
├── components/           # React components
│   ├── audio/           # Audio recording and processing
│   ├── 3d/              # Three.js animations
│   ├── communication/   # Plugin communication
│   └── payment/         # Payment and licensing
├── plugin/              # JUCE plugin source
└── styles/              # CSS and styling
```

### Building Plugins
```bash
cd src/plugin
cmake -B build
cmake --build build --target StageLife_AU
cmake --build build --target StageLife_VST3
```

## 📈 Roadmap

### Phase 6: Testing & Optimization (Weeks 11-12)
- [ ] Audio latency optimization
- [ ] Cross-platform testing
- [ ] Performance benchmarking
- [ ] Memory optimization

### Phase 7: Deployment & Distribution (Weeks 13-14)
- [ ] Production deployment
- [ ] App store submissions
- [ ] Plugin notarization
- [ ] Documentation completion

## 🤝 Contributing

Stage-Life is open source and welcomes contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on the foundation of the original Matchering project
- Three.js community for 3D graphics support
- Web Audio API for professional audio capabilities
- JUCE framework for plugin development

---

**Stage-Life**: Transforming live performance recording. Record. Better.

🎵 [Try the Demo](https://stage-life.app) | 🔌 [Download Plugin](https://github.com/Flickinny11/stage-life/releases) | 💬 [Join Community](https://discord.gg/stage-life)