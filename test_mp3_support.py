#!/usr/bin/env python3
"""
MP3 Support Test for Matchering 2.0
====================================

This script demonstrates and verifies that MP3 support is fully functional
in Matchering 2.0. It tests both the Python API and creates sample files
for web interface testing.

Requirements:
- FFmpeg must be installed (already available in Docker container)
- Matchering 2.0 must be installed
"""

import os
import tempfile
import subprocess
import sys

# Add matchering to path if running in container
if '/app' not in sys.path:
    sys.path.append('/app')

try:
    import matchering as mg
    print("✅ Matchering module imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Matchering: {e}")
    sys.exit(1)

def create_test_mp3(filename, frequency=440, duration=3):
    """Create a test MP3 file with a sine wave."""
    try:
        subprocess.check_call([
            'ffmpeg', '-f', 'lavfi', 
            '-i', f'sine=frequency={frequency}:duration={duration}',
            '-acodec', 'libmp3lame', 
            '-y', filename  # -y to overwrite without asking
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        return False

def test_mp3_loading():
    """Test MP3 file loading functionality."""
    print("\n🔧 Testing MP3 Loading...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        mp3_file = os.path.join(temp_dir, 'test_load.mp3')
        
        # Create test MP3
        if not create_test_mp3(mp3_file, 440, 2):
            print("❌ Failed to create test MP3 file")
            return False
            
        try:
            # Test loading through Matchering's loader
            from matchering.loader import load
            sound, sample_rate = load(mp3_file, "TARGET", temp_dir)
            
            print(f"✅ MP3 loaded successfully!")
            print(f"   - Shape: {sound.shape}")
            print(f"   - Sample rate: {sample_rate} Hz")
            print(f"   - Duration: {sound.shape[0] / sample_rate:.2f} seconds")
            return True
            
        except Exception as e:
            print(f"❌ Failed to load MP3: {e}")
            return False

def test_mp3_processing():
    """Test complete MP3 processing workflow."""
    print("\n⚙️  Testing MP3 Processing Workflow...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        target_mp3 = os.path.join(temp_dir, 'target.mp3')
        reference_mp3 = os.path.join(temp_dir, 'reference.mp3')
        result_wav = os.path.join(temp_dir, 'result.wav')
        
        # Create test files
        print("   Creating target MP3 (440Hz)...")
        if not create_test_mp3(target_mp3, 440, 3):
            print("❌ Failed to create target MP3")
            return False
            
        print("   Creating reference MP3 (880Hz)...")
        if not create_test_mp3(reference_mp3, 880, 3):
            print("❌ Failed to create reference MP3")
            return False
        
        try:
            print("   Processing with Matchering...")
            mg.process(
                target=target_mp3,
                reference=reference_mp3,
                results=[mg.pcm16(result_wav)]
            )
            
            if os.path.exists(result_wav):
                size = os.path.getsize(result_wav)
                print(f"✅ MP3 processing completed successfully!")
                print(f"   - Result file: {result_wav}")
                print(f"   - File size: {size:,} bytes")
                return True
            else:
                print("❌ Result file was not created")
                return False
                
        except Exception as e:
            print(f"❌ Processing failed: {e}")
            import traceback
            traceback.print_exc()
            return False

def create_sample_files():
    """Create sample MP3 files for web interface testing."""
    print("\n📁 Creating Sample MP3 Files...")
    
    # Create Downloads directory if it doesn't exist
    downloads_dir = os.path.expanduser("~/Downloads")
    if not os.path.exists(downloads_dir):
        os.makedirs(downloads_dir)
    
    samples = [
        ("matchering_test_target.mp3", 440, "Target file (440Hz sine wave)"),
        ("matchering_test_reference.mp3", 880, "Reference file (880Hz sine wave)")
    ]
    
    created_files = []
    for filename, freq, description in samples:
        filepath = os.path.join(downloads_dir, filename)
        print(f"   Creating {description}...")
        
        if create_test_mp3(filepath, freq, 5):  # 5 second files
            size = os.path.getsize(filepath)
            print(f"   ✅ Created: {filepath} ({size:,} bytes)")
            created_files.append(filepath)
        else:
            print(f"   ❌ Failed to create: {filepath}")
    
    return created_files

def test_ffmpeg_availability():
    """Test if FFmpeg is available and supports MP3."""
    print("🔍 Checking FFmpeg Availability...")
    
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f"✅ {version_line}")
            
            # Check for MP3 support
            if 'libmp3lame' in result.stdout:
                print("✅ MP3 encoding support (libmp3lame) available")
                return True
            else:
                print("⚠️  MP3 encoding support not found")
                return False
        else:
            print("❌ FFmpeg not responding properly")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ FFmpeg command timed out")
        return False
    except FileNotFoundError:
        print("❌ FFmpeg not found in PATH")
        return False

def main():
    """Run all MP3 support tests."""
    print("🎵 Matchering 2.0 MP3 Support Test")
    print("=" * 50)
    
    # Test results
    results = {
        'ffmpeg': test_ffmpeg_availability(),
        'loading': test_mp3_loading(),
        'processing': test_mp3_processing()
    }
    
    # Create sample files
    sample_files = create_sample_files()
    
    # Summary
    print("\n📊 Test Summary")
    print("=" * 50)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.capitalize():12} {status}")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("\n🎉 All tests passed! MP3 support is fully functional.")
        print("\nYou can now:")
        print("1. Upload MP3 files directly to the web interface at http://127.0.0.1:8360")
        print("2. Use MP3 files in the Python API")
        print("3. Process MP3 files as both target and reference tracks")
        
        if sample_files:
            print(f"\n📁 Sample files created in ~/Downloads:")
            for filepath in sample_files:
                print(f"   - {os.path.basename(filepath)}")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
