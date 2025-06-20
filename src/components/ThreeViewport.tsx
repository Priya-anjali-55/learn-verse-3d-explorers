
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createSubjectContent, animateScene } from '@/utils/threeModels';

interface ThreeViewportProps {
  selectedSubject: string;
  currentModel: number;
  isLoading: boolean;
}

const ThreeViewport: React.FC<ThreeViewportProps> = ({ selectedSubject, currentModel, isLoading }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current || !selectedSubject) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create initial 3D content
    createSubjectContent(scene, selectedSubject, currentModel);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Rotate scene objects
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
          child.rotation.y += deltaMove.x * 0.01;
          child.rotation.x += deltaMove.y * 0.01;
        }
      });

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Auto-rotation when not dragging
      if (!isDragging) {
        scene.children.forEach(child => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
            child.rotation.y += 0.005;
            child.rotation.x += 0.002;
          }
        });
      }

      // Animate dynamic elements
      animateScene(scene);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedSubject, currentModel]);

  if (isLoading) {
    return (
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading 3D scene...</p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="flex-1" />;
};

export default ThreeViewport;
