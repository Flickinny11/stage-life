/*
  Stage-Life Logic Pro Plugin
  Professional audio plugin for real-time communication with Stage-Life app
  
  This file would contain the main plugin implementation using JUCE framework.
  For the MVP version, this serves as a blueprint for future C++ implementation.
*/

#pragma once

#include <JuceHeader.h>

//==============================================================================
class StageLifeAudioProcessor : public juce::AudioProcessor
{
public:
    //==============================================================================
    StageLifeAudioProcessor();
    ~StageLifeAudioProcessor() override;

    //==============================================================================
    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;

    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;

    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    //==============================================================================
    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    //==============================================================================
    const juce::String getName() const override;

    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    //==============================================================================
    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram (int index) override;
    const juce::String getProgramName (int index) override;
    void changeProgramName (int index, const juce::String& newName) override;

    //==============================================================================
    void getStateInformation (juce::MemoryBlock& destData) override;
    void setStateInformation (const void* data, int sizeInBytes) override;

    //==============================================================================
    // Stage-Life specific functionality
    void startRecording();
    void stopRecording();
    bool isRecording() const { return recordingActive; }
    
    void setGain(float newGain);
    float getGain() const { return gain; }
    
    void connectToStageLifeApp();
    void disconnectFromStageLifeApp();
    bool isConnectedToApp() const { return appConnected; }

private:
    //==============================================================================
    // Audio processing
    bool recordingActive = false;
    float gain = 1.0f;
    
    // Communication with Stage-Life app
    bool appConnected = false;
    std::unique_ptr<juce::WebSocketClient> wsClient;
    
    // Audio analysis
    juce::AudioBuffer<float> analysisBuffer;
    std::unique_ptr<juce::dsp::FFT> fftProcessor;
    
    // Recording
    std::unique_ptr<juce::AudioFormatWriter> audioWriter;
    juce::File recordingFile;
    
    void analyzeAudio(const juce::AudioBuffer<float>& buffer);
    void sendAudioToApp(const juce::AudioBuffer<float>& buffer);
    void processRecordedAudio();
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (StageLifeAudioProcessor)
};

//==============================================================================
class StageLifeAudioProcessorEditor : public juce::AudioProcessorEditor
{
public:
    StageLifeAudioProcessorEditor (StageLifeAudioProcessor&);
    ~StageLifeAudioProcessorEditor() override;

    //==============================================================================
    void paint (juce::Graphics&) override;
    void resized() override;

private:
    // UI Components
    juce::TextButton recordButton;
    juce::Slider gainSlider;
    juce::Label statusLabel;
    juce::Label connectionLabel;
    
    // Connection status
    void updateConnectionStatus();
    void updateRecordingStatus();
    
    StageLifeAudioProcessor& audioProcessor;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (StageLifeAudioProcessorEditor)
};