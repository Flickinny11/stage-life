#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_utils/juce_audio_utils.h>
#include <memory>

/**
 * Stage-Life Audio Plugin
 * Real-time communication between DAW and Stage-Life application
 */

class WebSocketClient; // Forward declaration

class StageLifeAudioProcessor : public juce::AudioProcessor
{
public:
    StageLifeAudioProcessor();
    ~StageLifeAudioProcessor() override;

    // AudioProcessor interface
    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock(juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    // AudioProcessor metadata
    const juce::String getName() const override { return "Stage-Life"; }
    bool acceptsMidi() const override { return false; }
    bool producesMidi() const override { return false; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override { return 0.0; }

    // Program management
    int getNumPrograms() override { return 1; }
    int getCurrentProgram() override { return 0; }
    void setCurrentProgram(int index) override {}
    const juce::String getProgramName(int index) override { return "Default"; }
    void changeProgramName(int index, const juce::String& newName) override {}

    // State management
    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

    // Editor
    bool hasEditor() const override { return true; }
    juce::AudioProcessorEditor* createEditor() override;

    // Bus layout
    bool isBusesLayoutSupported(const BusesLayout& layouts) const override;

    // Plugin parameters
    juce::AudioProcessorValueTreeState& getValueTreeState() { return parameters; }

private:
    // Plugin parameters
    juce::AudioProcessorValueTreeState parameters;
    
    // Audio processing
    std::atomic<float>* gainParameter = nullptr;
    std::atomic<float>* enabledParameter = nullptr;
    
    // Communication with Stage-Life app
    std::unique_ptr<WebSocketClient> websocketClient;
    
    // Audio analysis
    juce::dsp::FFT fft;
    juce::dsp::WindowingFunction<float> window;
    std::vector<float> fftData;
    std::vector<float> analysisBuffer;
    
    // Processing state
    double currentSampleRate = 44100.0;
    int currentBlockSize = 512;
    bool isConnectedToApp = false;
    
    // Methods
    void initializeAudioProcessing();
    void initializeWebSocketConnection();
    void sendAudioDataToApp(const juce::AudioBuffer<float>& buffer);
    void applyStageLifeProcessing(juce::AudioBuffer<float>& buffer);
    void performFFTAnalysis(const juce::AudioBuffer<float>& buffer);
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(StageLifeAudioProcessor)
};

/**
 * WebSocket Client for real-time communication
 */
class WebSocketClient
{
public:
    WebSocketClient();
    ~WebSocketClient();
    
    bool connect(const juce::String& url);
    void disconnect();
    bool isConnected() const { return connected; }
    
    void sendAudioData(const float* audioData, int numSamples, double sampleRate);
    void sendParameter(const juce::String& paramName, float value);
    
private:
    std::atomic<bool> connected{false};
    juce::String serverUrl;
    
    // In a real implementation, this would use a WebSocket library
    void simulateConnection();
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(WebSocketClient)
};