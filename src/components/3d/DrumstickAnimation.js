import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './DrumstickAnimation.css';

function DrumstickAnimation({ isHovered }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const drumsticksRef = useRef([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(280, 180);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create drumsticks
    const drumstickGeometry = new THREE.CylinderGeometry(0.05, 0.08, 2, 8);
    const drumstickMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 30
    });

    const leftDrumstick = new THREE.Mesh(drumstickGeometry, drumstickMaterial);
    leftDrumstick.position.set(-0.8, 0, 0);
    leftDrumstick.rotation.z = 0.3;

    const rightDrumstick = new THREE.Mesh(drumstickGeometry, drumstickMaterial);
    rightDrumstick.position.set(0.8, 0, 0);
    rightDrumstick.rotation.z = -0.3;

    drumsticksRef.current = [leftDrumstick, rightDrumstick];
    scene.add(leftDrumstick);
    scene.add(rightDrumstick);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle rotation animation
      drumsticksRef.current.forEach((drumstick, index) => {
        drumstick.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (drumsticksRef.current.length > 0) {
      const [leftDrumstick, rightDrumstick] = drumsticksRef.current;
      
      if (isHovered) {
        // Animate separation on hover
        leftDrumstick.position.x = -1.5;
        leftDrumstick.rotation.z = 0.8;
        rightDrumstick.position.x = 1.5;
        rightDrumstick.rotation.z = -0.8;
      } else {
        // Return to original position
        leftDrumstick.position.x = -0.8;
        leftDrumstick.rotation.z = 0.3;
        rightDrumstick.position.x = 0.8;
        rightDrumstick.rotation.z = -0.3;
      }
    }
  }, [isHovered]);

  return (
    <div className="drumstick-3d-container">
      <div ref={mountRef} className="drumstick-canvas" />
      <div className={`live-text-3d ${isHovered ? 'visible' : ''}`}>
        Live
      </div>
    </div>
  );
}

export default DrumstickAnimation;