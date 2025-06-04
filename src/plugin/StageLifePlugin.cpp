#include "StageLifePlugin.h"

//==============================================================================
StageLifeAudioProcessor::StageLifeAudioProcessor()
    : AudioProcessor(BusesProperties()
        .withInput("Input", juce::AudioChannelSet::stereo(), true)
        .withOutput("Output", juce::AudioChannelSet::stereo(), true)),
      parameters(*this, nullptr, "StageLife",
      {
          std::make_unique<juce::AudioParameterFloat>("gain", "Gain", 0.0f, 2.0f, 1.0f),
          std::make_unique<juce::AudioParameterBool>("enabled", "Enabled", true)
      }),
      fft(11), // 2048 point FFT
      window(2048, juce::dsp::WindowingFunction<float>::hann)
{
    // Get parameter pointers
    gainParameter = parameters.getRawParameterValue("gain");
    enabledParameter = parameters.getRawParameterValue("enabled");
    
    // Initialize WebSocket connection to Stage-Life app
    initializeWebSocketConnection();
    
    // Initialize audio processing components
    initializeAudioProcessing();
}

StageLifeAudioProcessor::~StageLifeAudioProcessor()
{
    if (websocketClient)
    {
        websocketClient->disconnect();
    }
}

//==============================================================================
void StageLifeAudioProcessor::initializeWebSocketConnection()
{
    websocketClient = std::make_unique<WebSocketClient>();
    
    // Try to connect to Stage-Life app
    isConnectedToApp = websocketClient->connect("ws://localhost:8080");
    
    if (isConnectedToApp)
    {
        DBG("Connected to Stage-Life application");
    }
    else
    {
        DBG("Could not connect to Stage-Life application - running in standalone mode");
    }
}

void StageLifeAudioProcessor::initializeAudioProcessing()
{
    // Initialize FFT data arrays
    fftData.resize(2048 * 2, 0.0f);
    analysisBuffer.resize(2048, 0.0f);
    
    DBG("Stage-Life plugin audio processing initialized");
}

//==============================================================================
const juce::String StageLifeAudioProcessor::getName() const
{
    return "Stage-Life";
}

void StageLifeAudioProcessor::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    currentSampleRate = sampleRate;
    currentBlockSize = samplesPerBlock;
    
    DBG("Stage-Life plugin prepared: " + juce::String(sampleRate) + "Hz, " + juce::String(samplesPerBlock) + " samples");
}

void StageLifeAudioProcessor::releaseResources()
{
    // Release any resources when playback stops
}

bool StageLifeAudioProcessor::isBusesLayoutSupported(const BusesLayout& layouts) const
{
    // Support stereo input/output
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

    if (layouts.getMainInputChannelSet() != layouts.getMainOutputChannelSet())
        return false;

    return true;
}

void StageLifeAudioProcessor::processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    juce::ScopedNoDenormals noDenormals;
    
    auto totalNumInputChannels = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();
    
    // Clear any output channels that don't contain input data
    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear(i, 0, buffer.getNumSamples());
    
    // Check if plugin is enabled
    if (!*enabledParameter)
    {
        return; // Pass through audio unchanged
    }
    
    // Send audio data to Stage-Life app
    if (isConnectedToApp)
    {
        sendAudioDataToApp(buffer);
    }
    
    // Perform real-time audio analysis
    performFFTAnalysis(buffer);
    
    // Apply Stage-Life processing
    applyStageLifeProcessing(buffer);
    
    // Apply gain parameter
    float gain = *gainParameter;
    for (int channel = 0; channel < totalNumInputChannels; ++channel)
    {
        auto* channelData = buffer.getWritePointer(channel);
        
        for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
        {
            channelData[sample] *= gain;
        }
    }
}

void StageLifeAudioProcessor::sendAudioDataToApp(const juce::AudioBuffer<float>& buffer)
{
    if (!websocketClient || !websocketClient->isConnected())
        return;
        
    // Send audio data from the first channel
    const float* audioData = buffer.getReadPointer(0);
    websocketClient->sendAudioData(audioData, buffer.getNumSamples(), currentSampleRate);
}

void StageLifeAudioProcessor::applyStageLifeProcessing(juce::AudioBuffer<float>& buffer)
{
    // Apply real-time effects based on Stage-Life parameters
    // This would integrate with the main app's processing engine
    
    for (int channel = 0; channel < buffer.getNumChannels(); ++channel)
    {
        auto* channelData = buffer.getWritePointer(channel);
        
        // Example: Simple high-pass filter
        for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
        {
            // Placeholder for Stage-Life processing algorithms
            // In production, this would apply EQ, compression, etc.
        }
    }
}

void StageLifeAudioProcessor::performFFTAnalysis(const juce::AudioBuffer<float>& buffer)
{
    // Copy audio data for analysis
    const float* inputData = buffer.getReadPointer(0);
    int samplesToProcess = juce::jmin(buffer.getNumSamples(), (int)analysisBuffer.size());
    
    std::copy(inputData, inputData + samplesToProcess, analysisBuffer.begin());
    
    // Apply window and perform FFT
    window.multiplyWithWindowingTable(analysisBuffer.data(), analysisBuffer.size());
    
    // Copy to FFT buffer (real part only)
    for (size_t i = 0; i < analysisBuffer.size(); ++i)
    {
        fftData[i * 2] = analysisBuffer[i];      // Real part
        fftData[i * 2 + 1] = 0.0f;               // Imaginary part
    }
    
    // Perform FFT
    fft.performFrequencyOnlyForwardTransform(fftData.data());
    
    // Send analysis data to app if connected
    if (isConnectedToApp && websocketClient)
    {
        // In production, this would send FFT results to the main app
    }
}

//==============================================================================
bool StageLifeAudioProcessor::hasEditor() const
{
    return true;
}

juce::AudioProcessorEditor* StageLifeAudioProcessor::createEditor()
{
    // Return a generic editor for now
    return new juce::GenericAudioProcessorEditor(*this);
}

//==============================================================================
void StageLifeAudioProcessor::getStateInformation(juce::MemoryBlock& destData)
{
    auto state = parameters.copyState();
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

void StageLifeAudioProcessor::setStateInformation(const void* data, int sizeInBytes)
{
    std::unique_ptr<juce::XmlElement> xmlState(getXmlFromBinary(data, sizeInBytes));

    if (xmlState.get() != nullptr)
        if (xmlState->hasTagName(parameters.state.getType()))
            parameters.replaceState(juce::ValueTree::fromXml(*xmlState));
}

//==============================================================================
// WebSocket Client Implementation

WebSocketClient::WebSocketClient()
{
}

WebSocketClient::~WebSocketClient()
{
    disconnect();
}

bool WebSocketClient::connect(const juce::String& url)
{
    serverUrl = url;
    
    // In a real implementation, this would establish a WebSocket connection
    // For now, we'll simulate the connection
    simulateConnection();
    
    return connected.load();
}

void WebSocketClient::disconnect()
{
    connected = false;
    DBG("WebSocket disconnected from Stage-Life app");
}

void WebSocketClient::sendAudioData(const float* audioData, int numSamples, double sampleRate)
{
    if (!connected.load())
        return;
        
    // In production, this would send audio data over WebSocket
    // For now, we'll just log the activity
    static int logCounter = 0;
    if (++logCounter % 1000 == 0) // Log every 1000 calls to avoid spam
    {
        DBG("Sending audio data: " + juce::String(numSamples) + " samples at " + juce::String(sampleRate) + "Hz");
    }
}

void WebSocketClient::sendParameter(const juce::String& paramName, float value)
{
    if (!connected.load())
        return;
        
    // In production, this would send parameter changes over WebSocket
    DBG("Parameter update: " + paramName + " = " + juce::String(value));
}

void WebSocketClient::simulateConnection()
{
    // Simulate connection attempt
    juce::Thread::sleep(100); // Simulate connection delay
    
    // For demo purposes, assume connection succeeds
    connected = true;
    DBG("WebSocket connected to Stage-Life app (simulated)");
}

//==============================================================================
// Plugin factory function

juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new StageLifeAudioProcessor();
}