cmake_minimum_required(VERSION 3.15)

project(StageLifePlugin VERSION 1.0.0)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add JUCE (uncomment when JUCE is available)
# add_subdirectory(juce EXCLUDE_FROM_ALL)

# Create the plugin target (commented for now - requires JUCE)
# juce_add_plugin(StageLifePlugin
#     COMPANY_NAME "Stage-Life"
#     IS_SYNTH FALSE
#     NEEDS_MIDI_INPUT FALSE
#     NEEDS_MIDI_OUTPUT FALSE
#     IS_MIDI_EFFECT FALSE
#     EDITOR_WANTS_KEYBOARD_FOCUS FALSE
#     COPY_PLUGIN_AFTER_BUILD TRUE
#     PLUGIN_MANUFACTURER_CODE Stgl
#     PLUGIN_CODE Stgl
#     FORMATS AU VST3 AAX Standalone
#     PRODUCT_NAME "Stage-Life"
#     DESCRIPTION "Professional live recording and processing plugin"
#     VST3_CATEGORIES "Fx" "Tools"
#     AU_MAIN_TYPE "kAudioUnitType_Effect"
# )

# Source files (commented for now)
# target_sources(StageLifePlugin
#     PRIVATE
#         StageLifePlugin.cpp
#         StageLifePlugin.h
# )

# Compile definitions (commented for now)
# target_compile_definitions(StageLifePlugin
#     PUBLIC
#         JUCE_WEB_BROWSER=0
#         JUCE_USE_CURL=0
#         JUCE_VST3_CAN_REPLACE_VST2=0
#         JUCE_DISPLAY_SPLASH_SCREEN=0
#         JUCE_REPORT_APP_USAGE=0
# )

# Link libraries (commented for now)
# target_link_libraries(StageLifePlugin
#     PRIVATE
#         juce::juce_audio_utils
#         juce::juce_audio_processors
#         juce::juce_dsp
#     PUBLIC
#         juce::juce_recommended_config_flags
#         juce::juce_recommended_lto_flags
#         juce::juce_recommended_warning_flags
# )

# For now, create placeholder targets
message(STATUS "Stage-Life Plugin configuration ready")
message(STATUS "To build plugin: install JUCE framework and uncomment plugin configuration")

add_custom_target(stage-life-plugin
    COMMAND echo "Stage-Life Plugin source files created"
    COMMAND echo "Install JUCE framework to build actual plugin"
    COMMENT "Building Stage-Life Logic Pro Plugin"
)

# Installation placeholder
# install(TARGETS StageLifePlugin
#     COMPONENT StageLifePlugin
# )