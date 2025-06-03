# 🎵 Stage-Life: Autonomous Development Assignment

## **COMPREHENSIVE DEVELOPMENT PROMPT FOR GITHUB COPILOT AGENT**

You are a highly skilled autonomous software development agent tasked with building **Stage-Life** - a complete transformation of the existing Matchering audio application into a professional live performance recording, mixing, and mastering solution.

---

## **PROJECT OVERVIEW**

**Mission**: Transform Matchering → Stage-Life: "Record. Better."
**Target**: Professional musicians, live performers, studio engineers
**Business Model**: $9 one-time purchase with device activation
**Timeline**: 14-week implementation plan (see `LIVE_SHOW_MIX_AND_MASTER_IMPLEMENTATION_PLAN.md`)

### **Core Features to Build**
1. **Logic Pro Plugin Integration** (JUCE framework)
2. **Real-time Audio Recording & Processing Suite**
3. **AI-Powered Mixing & Mastering Engine**
4. **3D Animated Interface** (drumsticks, van visuals)
5. **Multi-Platform Deployment** (Web, macOS, Windows, iPad)
6. **Payment System** with device activation
7. **Advanced Audio Processing** with latest libraries
8. **Professional Live Recording Tools**

---

## **DEVELOPMENT INSTRUCTIONS**

### **Phase 1: Environment Setup & Architecture (Week 1-2)**

1. **Initialize Modern Development Environment**:
   ```bash
   # Install all required dependencies
   npm install
   
   # Set up development servers
   npm run setup-dev
   ```

2. **Technology Stack Implementation**:
   - **Frontend**: React 18 + TypeScript + Three.js for 3D
   - **Audio Processing**: Web Audio API + Tone.js + latest libraries
   - **Desktop App**: Electron for cross-platform
   - **Plugin Development**: JUCE framework for Logic Pro
   - **Animation**: GSAP + Three.js for 3D effects
   - **Payment**: Stripe integration
   - **AI Integration**: Ready for OpenAI/ElevenLabs APIs

3. **Project Structure Setup**:
   ```
   /src
     /components
       /ui              # UI components
       /audio           # Audio processing
       /animations      # 3D animations
     /plugins
       /logic-pro       # JUCE-based plugin
     /electron          # Desktop app
     /web              # Web application
     /payment          # Stripe integration
   ```

### **Phase 2: Core Audio Engine (Week 3-4)**

4. **Real-Time Audio Recording Implementation**:
   - Build multi-track recording capability
   - Implement low-latency audio processing
   - Create professional-grade audio pipeline
   - Add support for all major audio formats

5. **AI-Powered Processing Engine**:
   - Integrate latest open-source audio ML models
   - Build automatic mixing algorithms
   - Implement mastering chain automation
   - Create intelligent EQ and compression

### **Phase 3: Visual Interface & 3D Animations (Week 5-6)**

6. **3D Animated Interface Development**:
   - **Left Panel**: Animated drumsticks that separate on hover revealing "Live" in 3D
   - **Right Panel**: White van back view, door opens with smoke revealing "Example"
   - Glass reflections underneath both visuals
   - Smooth GSAP animations with professional timing

7. **UI/UX Redesign**:
   - Implement Stage-Life branding
   - Light blue color scheme with translucent elements
   - Remove all Matchering references
   - Modern, professional interface design

### **Phase 4: Logic Pro Plugin (Week 7-8)**

8. **JUCE Framework Plugin Development**:
   - Create Logic Pro X compatible plugin
   - Real-time communication with main app
   - Professional audio parameter controls
   - Cross-platform compatibility (macOS/Windows)

### **Phase 5: Advanced Features (Week 9-10)**

9. **Multi-Platform Applications**:
   - Web application deployment
   - macOS desktop app (Electron)
   - Windows desktop app
   - iPad app optimization

10. **Payment System Integration**:
    - Stripe payment processing
    - Device activation system
    - License management
    - $9 one-time purchase flow

### **Phase 6: Testing & Optimization (Week 11-12)**

11. **Professional Audio Testing**:
    - Latency optimization
    - Audio quality validation
    - Multi-device testing
    - Performance optimization

### **Phase 7: Deployment & Distribution (Week 13-14)**

12. **Production Deployment**:
    - Web hosting setup
    - App store submissions
    - Plugin distribution
    - Documentation completion

---

## **SPECIFIC IMPLEMENTATION REQUIREMENTS**

### **Audio Processing Specifications**
- **Sample Rates**: Support 44.1kHz, 48kHz, 96kHz, 192kHz
- **Bit Depths**: 16-bit, 24-bit, 32-bit float
- **Formats**: WAV, FLAC, MP3, AIFF, M4A
- **Latency**: <10ms for real-time processing
- **Plugin Standards**: VST3, AU, AAX compatibility

### **3D Animation Requirements**
- **Performance**: 60fps on modern hardware
- **Loading**: Progressive loading for 3D assets
- **Responsiveness**: Touch and mouse interactions
- **Quality**: High-resolution textures and models

### **Payment Integration Specs**
- **Provider**: Stripe
- **Price**: $9 USD one-time purchase
- **Features**: Device activation, license verification
- **Security**: Encrypted key storage

### **Platform Support**
- **Web**: Chrome, Firefox, Safari, Edge (latest versions)
- **Desktop**: macOS 10.15+, Windows 10+
- **Mobile**: iPad iOS 14+
- **Plugin**: Logic Pro X 10.5+, other DAWs via VST3

---

## **CODE QUALITY STANDARDS**

### **Development Practices**
- **TypeScript**: Strict mode enabled
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Documentation**: JSDoc for all functions
- **Version Control**: Semantic versioning

### **Performance Requirements**
- **Bundle Size**: <5MB for web app
- **Load Time**: <3s initial load
- **Memory Usage**: <500MB peak usage
- **Audio Latency**: <10ms round-trip

### **Security Standards**
- **API Keys**: Environment variables only
- **Payment Data**: PCI compliance
- **User Data**: GDPR compliance
- **Audio Files**: Secure local storage

---

## **INTEGRATION POINTS**

### **External Services (Optional - User Configurable)**
- **OpenAI API**: For advanced AI features
- **ElevenLabs**: For voice processing
- **Spotify/Apple Music**: For reference tracks
- **Cloud Storage**: Automated backups

### **Required Integrations**
- **Stripe**: Payment processing
- **Web Audio API**: Browser audio
- **Electron**: Desktop packaging
- **JUCE**: Plugin development

---

## **DELIVERABLES CHECKLIST**

### **Week 1-2: Foundation**
- [ ] Development environment setup
- [ ] Project structure implementation
- [ ] Basic React app with TypeScript
- [ ] Three.js integration working
- [ ] Audio context initialization

### **Week 3-4: Audio Core**
- [ ] Real-time audio recording
- [ ] Multi-track support
- [ ] Audio format support
- [ ] Basic processing pipeline

### **Week 5-6: Interface**
- [ ] 3D drumstick animations
- [ ] Van door opening effect
- [ ] Glass reflection effects
- [ ] Complete UI redesign

### **Week 7-8: Plugin**
- [ ] JUCE project setup
- [ ] Logic Pro plugin working
- [ ] Real-time communication
- [ ] Parameter automation

### **Week 9-10: Multi-Platform**
- [ ] Electron app working
- [ ] Web deployment ready
- [ ] iPad optimization
- [ ] Stripe integration complete

### **Week 11-12: Testing**
- [ ] Audio latency optimized
- [ ] Cross-platform testing
- [ ] Performance benchmarks
- [ ] Security audit

### **Week 13-14: Production**
- [ ] Production deployment
- [ ] Documentation complete
- [ ] Distribution ready
- [ ] Support system

---

## **SUCCESS METRICS**

### **Technical Metrics**
- Audio latency <10ms
- 60fps 3D animations
- <3s app load time
- 99.9% uptime

### **User Experience Metrics**
- Intuitive interface navigation
- Professional audio quality
- Smooth payment flow
- Multi-platform consistency

### **Business Metrics**
- $9 purchase conversion
- Device activation success
- User retention >80%
- Professional adoption

---

## **AUTONOMOUS DEVELOPMENT GUIDELINES**

### **Decision Making**
- Prioritize audio quality over visual effects
- Choose proven libraries over experimental ones
- Implement progressive enhancement
- Ensure backward compatibility

### **Problem Solving**
- Research latest audio processing techniques
- Leverage modern web APIs
- Follow audio industry standards
- Implement professional workflows

### **Quality Assurance**
- Test on professional audio hardware
- Validate with real musicians
- Benchmark against industry tools
- Ensure consistent performance

---

## **FINAL NOTES**

This is a **complete autonomous development assignment**. Implement every feature listed in the implementation plan, following modern best practices, ensuring professional-grade audio quality, and creating a polished user experience that justifies the $9 price point.

**Repository**: `https://github.com/Flickinny11/stage-life`
**Implementation Plan**: See `LIVE_SHOW_MIX_AND_MASTER_IMPLEMENTATION_PLAN.md`
**Timeline**: 14 weeks to complete implementation

**Start immediately** with Phase 1 and work systematically through all phases. This application should be production-ready and capable of competing with professional audio software.

---

*Transform live performance recording with Stage-Life: "Record. Better."*
