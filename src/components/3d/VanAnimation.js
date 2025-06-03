import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './VanAnimation.css';

function VanAnimation({ isHovered }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const vanPartsRef = useRef({});
  const [smokeParticles, setSmokeParticles] = useState([]);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

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

    // Create van body
    const bodyGeometry = new THREE.BoxGeometry(2.5, 1.2, 1.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xeeeeee,
      shininess: 100
    });
    const vanBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    vanBody.position.set(0, 0, 0);
    scene.add(vanBody);

    // Create van doors
    const doorGeometry = new THREE.BoxGeometry(0.6, 1.0, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xdddddd,
      shininess: 80
    });

    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(1.0, 0, 0.8);
    scene.add(leftDoor);

    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(1.6, 0, 0.8);
    scene.add(rightDoor);

    vanPartsRef.current = {
      body: vanBody,
      leftDoor,
      rightDoor
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    // Create smoke particles
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });

    const particles = [];
    for (let i = 0; i < 10; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        1.3 + Math.random() * 0.6,
        -0.3 + Math.random() * 0.3,
        0.9 + Math.random() * 0.2
      );
      particle.visible = false;
      scene.add(particle);
      particles.push(particle);
    }
    setSmokeParticles(particles);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle rotation
      vanBody.rotation.y += 0.005;

      // Animate smoke particles
      particles.forEach((particle, index) => {
        if (particle.visible) {
          particle.position.y += 0.02;
          particle.material.opacity -= 0.005;
          
          if (particle.material.opacity <= 0) {
            particle.visible = false;
            particle.material.opacity = 0.6;
            particle.position.y = -0.3 + Math.random() * 0.3;
          }
        }
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
    const { leftDoor, rightDoor } = vanPartsRef.current;
    
    if (leftDoor && rightDoor) {
      if (isHovered) {
        // Open doors
        leftDoor.rotation.y = -Math.PI / 3;
        rightDoor.rotation.y = Math.PI / 3;
        
        // Show smoke
        smokeParticles.forEach((particle, index) => {
          setTimeout(() => {
            particle.visible = true;
          }, index * 100);
        });
      } else {
        // Close doors
        leftDoor.rotation.y = 0;
        rightDoor.rotation.y = 0;
        
        // Hide smoke
        smokeParticles.forEach(particle => {
          particle.visible = false;
        });
      }
    }
  }, [isHovered, smokeParticles]);

  return (
    <div className="van-3d-container">
      <div ref={mountRef} className="van-canvas" />
      <div className={`example-text-3d ${isHovered ? 'visible' : ''}`}>
        Example
      </div>
    </div>
  );
}

export default VanAnimation;