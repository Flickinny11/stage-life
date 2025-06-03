import React, { useRef, useEffect } from 'react';
import './AudioVisualizer.css';

function AudioVisualizer({ audioEngine, isActive }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isActive || !audioEngine) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      const audioData = audioEngine.getAudioData();
      
      if (!audioData) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const { frequency } = audioData;
      const bufferLength = frequency.length;
      const barWidth = canvas.width / bufferLength;

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (frequency[i] / 255) * canvas.height;
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, `hsl(${200 + (frequency[i] / 255) * 60}, 100%, 70%)`);
        gradient.addColorStop(1, `hsl(${200 + (frequency[i] / 255) * 60}, 100%, 40%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioEngine, isActive]);

  return (
    <div className="audio-visualizer-container">
      <canvas 
        ref={canvasRef} 
        className="audio-visualizer-canvas"
        width={400}
        height={200}
      />
      <div className="visualizer-overlay">
        <div className="frequency-label">Frequency Spectrum</div>
      </div>
    </div>
  );
}

export default AudioVisualizer;