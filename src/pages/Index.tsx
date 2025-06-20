
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Gamepad2, 
  Atom, 
  Globe, 
  Calculator, 
  Telescope, 
  Heart, 
  Lightbulb,
  Play,
  RotateCcw,
  Volume2
} from 'lucide-react';

const subjects = [
  {
    id: 'biology',
    name: 'Biology',
    icon: Heart,
    color: 'bg-green-500',
    description: 'Explore DNA, cells, and human anatomy in 3D',
    examples: ['DNA Helix', 'Human Heart', 'Plant Cell']
  },
  {
    id: 'space',
    name: 'Space Science',
    icon: Telescope,
    color: 'bg-purple-500',
    description: 'Journey through the solar system and beyond',
    examples: ['Solar System', 'Planetary Orbits', 'Galaxies']
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: Calculator,
    color: 'bg-blue-500',
    description: 'Visualize geometric shapes and mathematical concepts',
    examples: ['3D Shapes', 'Vectors', 'Fractals']
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: Globe,
    color: 'bg-emerald-500',
    description: 'Explore Earth\'s features and continents',
    examples: ['3D Globe', 'Continents', 'Volcanoes']
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: Atom,
    color: 'bg-orange-500',
    description: 'Interact with molecules and atomic structures',
    examples: ['Molecules', 'Atomic Models', 'Reactions']
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'Understand forces, energy, and physical laws',
    examples: ['Pendulum', 'Light Rays', 'Circuits']
  }
];

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>();

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [mode, setMode] = useState<'learn' | 'play'>('learn');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || selectedSubject === null) return;

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

    // Create initial 3D content based on selected subject
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

      // Animate planetary orbits and other dynamic elements
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

  const createSubjectContent = (scene: THREE.Scene, subject: string, modelIndex: number) => {
    // Clear existing objects
    const objectsToRemove = scene.children.filter(child => child instanceof THREE.Mesh || child instanceof THREE.Group);
    objectsToRemove.forEach(obj => scene.remove(obj));

    switch (subject) {
      case 'biology':
        if (modelIndex === 0) createDNAHelix(scene);
        else if (modelIndex === 1) createHumanHeart(scene);
        else if (modelIndex === 2) createPlantCell(scene);
        break;
      case 'space':
        if (modelIndex === 0) createSolarSystem(scene);
        else if (modelIndex === 1) createPlanetaryOrbits(scene);
        else if (modelIndex === 2) createGalaxy(scene);
        break;
      case 'math':
        if (modelIndex === 0) createGeometricShapes(scene);
        else if (modelIndex === 1) createVectors(scene);
        else if (modelIndex === 2) createFractal(scene);
        break;
      case 'geography':
        if (modelIndex === 0) createGlobe(scene);
        else if (modelIndex === 1) createContinents(scene);
        else if (modelIndex === 2) createVolcano(scene);
        break;
      case 'chemistry':
        if (modelIndex === 0) createMolecule(scene);
        else if (modelIndex === 1) createAtomicModel(scene);
        else if (modelIndex === 2) createChemicalReaction(scene);
        break;
      case 'physics':
        if (modelIndex === 0) createAtom(scene);
        else if (modelIndex === 1) createLightRays(scene);
        else if (modelIndex === 2) createCircuit(scene);
        break;
    }
  };

  const animateScene = (scene: THREE.Scene) => {
    scene.children.forEach(child => {
      if (child.userData.orbit !== undefined) {
        // Animate planetary orbits
        child.userData.angle += child.userData.speed;
        child.position.x = Math.cos(child.userData.angle) * child.userData.distance;
        child.position.z = Math.sin(child.userData.angle) * child.userData.distance;
      }
      if (child.userData.type === 'electron') {
        // Animate electrons
        child.userData.angle += 0.05;
        const radius = 1;
        child.position.x = Math.cos(child.userData.angle) * radius;
        child.position.z = Math.sin(child.userData.angle) * radius;
      }
    });
  };

  // Biology models
  const createDNAHelix = (scene: THREE.Scene) => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 4;
      const x = Math.cos(angle) * 0.5;
      const z = Math.sin(angle) * 0.5;
      const y = (i / 100) * 4 - 2;
      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      100,
      0.05,
      8,
      false
    );
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8
    });
    const helix = new THREE.Mesh(geometry, material);
    scene.add(helix);

    // Add complementary helix
    const points2 = points.map(p => new THREE.Vector3(-p.x, p.y, -p.z));
    const geometry2 = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points2),
      100,
      0.05,
      8,
      false
    );
    const material2 = new THREE.MeshPhongMaterial({ 
      color: 0xff0088,
      transparent: true,
      opacity: 0.8
    });
    const helix2 = new THREE.Mesh(geometry2, material2);
    scene.add(helix2);
  };

  const createHumanHeart = (scene: THREE.Scene) => {
    const heartGroup = new THREE.Group();
    
    // Main heart chambers
    const heartGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    heartGeometry.scale(1, 1.2, 0.8);
    const heartMaterial = new THREE.MeshPhongMaterial({ color: 0xdc143c });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heartGroup.add(heart);

    // Atria (top chambers)
    const atriumGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    const atriumMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    
    const leftAtrium = new THREE.Mesh(atriumGeometry, atriumMaterial);
    leftAtrium.position.set(-0.3, 0.8, 0);
    heartGroup.add(leftAtrium);
    
    const rightAtrium = new THREE.Mesh(atriumGeometry, atriumMaterial);
    rightAtrium.position.set(0.3, 0.8, 0);
    heartGroup.add(rightAtrium);

    // Blood vessels
    const vesselGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const vesselMaterial = new THREE.MeshPhongMaterial({ color: 0x8b0000 });
    
    const aorta = new THREE.Mesh(vesselGeometry, vesselMaterial);
    aorta.position.set(0, 1.5, 0);
    heartGroup.add(aorta);

    scene.add(heartGroup);
  };

  const createPlantCell = (scene: THREE.Scene) => {
    const cellGroup = new THREE.Group();
    
    // Cell wall
    const wallGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const wallMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x90EE90, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true
    });
    const cellWall = new THREE.Mesh(wallGeometry, wallMaterial);
    cellGroup.add(cellWall);

    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0x4B0082 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    nucleus.position.set(0, 0, 0);
    cellGroup.add(nucleus);

    // Chloroplasts
    for (let i = 0; i < 6; i++) {
      const chloroplastGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const chloroplastMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
      const chloroplast = new THREE.Mesh(chloroplastGeometry, chloroplastMaterial);
      chloroplast.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 0.8
      );
      cellGroup.add(chloroplast);
    }

    // Vacuole
    const vacuoleGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    const vacuoleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x87CEEB, 
      transparent: true, 
      opacity: 0.5 
    });
    const vacuole = new THREE.Mesh(vacuoleGeometry, vacuoleMaterial);
    vacuole.position.set(0.5, 0.3, 0);
    cellGroup.add(vacuole);

    scene.add(cellGroup);
  };

  // Space models
  const createSolarSystem = (scene: THREE.Scene) => {
    // Sun
    const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets
    const planets = [
      { size: 0.1, distance: 1, color: 0x8c7853, speed: 0.02 },
      { size: 0.15, distance: 1.5, color: 0xffc649, speed: 0.015 },
      { size: 0.16, distance: 2, color: 0x6b93d6, speed: 0.01 },
      { size: 0.12, distance: 2.5, color: 0xc1440e, speed: 0.008 }
    ];

    planets.forEach((planetData, index) => {
      const planetGeometry = new THREE.SphereGeometry(planetData.size, 16, 16);
      const planetMaterial = new THREE.MeshPhongMaterial({ color: planetData.color });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      
      planet.position.x = planetData.distance;
      planet.userData = { distance: planetData.distance, speed: planetData.speed, angle: 0 };
      
      scene.add(planet);
    });
  };

  const createPlanetaryOrbits = (scene: THREE.Scene) => {
    // Central star
    const starGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(star);

    // Orbit rings
    const orbits = [1, 1.8, 2.6, 3.4];
    orbits.forEach(radius => {
      const orbitGeometry = new THREE.TorusGeometry(radius, 0.01, 8, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x666666, 
        transparent: true, 
        opacity: 0.3 
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });

    // Planets with detailed orbits
    const planetData = [
      { size: 0.08, distance: 1, color: 0xff6b6b, speed: 0.03 },
      { size: 0.12, distance: 1.8, color: 0x4ecdc4, speed: 0.02 },
      { size: 0.15, distance: 2.6, color: 0x45b7d1, speed: 0.015 },
      { size: 0.18, distance: 3.4, color: 0xf9ca24, speed: 0.01 }
    ];

    planetData.forEach((data, index) => {
      const planetGeometry = new THREE.SphereGeometry(data.size, 12, 12);
      const planetMaterial = new THREE.MeshPhongMaterial({ color: data.color });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      
      planet.position.x = data.distance;
      planet.userData = { distance: data.distance, speed: data.speed, angle: 0, orbit: index };
      
      scene.add(planet);
    });
  };

  const createGalaxy = (scene: THREE.Scene) => {
    const galaxyGroup = new THREE.Group();
    
    // Central black hole
    const blackHoleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    galaxyGroup.add(blackHole);

    // Spiral arms with stars
    for (let arm = 0; arm < 4; arm++) {
      for (let i = 0; i < 50; i++) {
        const angle = (arm * Math.PI / 2) + (i * 0.2);
        const radius = 0.5 + (i * 0.05);
        
        const starGeometry = new THREE.SphereGeometry(0.02, 4, 4);
        const starMaterial = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.8) 
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        star.position.x = Math.cos(angle) * radius;
        star.position.z = Math.sin(angle) * radius;
        star.position.y = (Math.random() - 0.5) * 0.2;
        
        galaxyGroup.add(star);
      }
    }

    scene.add(galaxyGroup);
  };

  // Math models
  const createGeometricShapes = (scene: THREE.Scene) => {
    const shapes = [
      { geometry: new THREE.BoxGeometry(0.8, 0.8, 0.8), position: [-1.5, 0, 0], color: 0x4fc3f7 },
      { geometry: new THREE.SphereGeometry(0.5, 16, 16), position: [0, 0, 0], color: 0x81c784 },
      { geometry: new THREE.ConeGeometry(0.5, 1, 8), position: [1.5, 0, 0], color: 0xff8a65 }
    ];

    shapes.forEach(shape => {
      const material = new THREE.MeshPhongMaterial({ color: shape.color });
      const mesh = new THREE.Mesh(shape.geometry, material);
      mesh.position.set(...shape.position);
      scene.add(mesh);
    });
  };

  const createVectors = (scene: THREE.Scene) => {
    const vectorGroup = new THREE.Group();
    
    // Origin point
    const originGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const originMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const origin = new THREE.Mesh(originGeometry, originMaterial);
    vectorGroup.add(origin);

    // Vector arrows
    const vectors = [
      { direction: [1, 0, 0], color: 0xff0000, label: 'X' },
      { direction: [0, 1, 0], color: 0x00ff00, label: 'Y' },
      { direction: [0, 0, 1], color: 0x0000ff, label: 'Z' },
      { direction: [1, 1, 0], color: 0xffff00, label: 'XY' },
      { direction: [1, 1, 1], color: 0xff00ff, label: 'XYZ' }
    ];

    vectors.forEach(vectorData => {
      // Arrow shaft
      const arrowGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
      const arrowMaterial = new THREE.MeshPhongMaterial({ color: vectorData.color });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      
      // Point arrow in direction
      const direction = new THREE.Vector3(...vectorData.direction).normalize();
      arrow.lookAt(direction);
      arrow.rotateX(Math.PI / 2);
      arrow.position.copy(direction.multiplyScalar(0.75));
      
      vectorGroup.add(arrow);

      // Arrow head
      const headGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
      const head = new THREE.Mesh(headGeometry, arrowMaterial);
      head.position.copy(direction.multiplyScalar(2));
      head.lookAt(direction.multiplyScalar(3));
      vectorGroup.add(head);
    });

    scene.add(vectorGroup);
  };

  const createFractal = (scene: THREE.Scene) => {
    const fractalGroup = new THREE.Group();
    
    const createSierpinskiTetrahedron = (level: number, size: number, position: THREE.Vector3) => {
      if (level === 0) {
        const geometry = new THREE.TetrahedronGeometry(size);
        const material = new THREE.MeshPhongMaterial({ 
          color: new THREE.Color().setHSL(level / 5, 0.8, 0.6),
          transparent: true,
          opacity: 0.7
        });
        const tetrahedron = new THREE.Mesh(geometry, material);
        tetrahedron.position.copy(position);
        fractalGroup.add(tetrahedron);
      } else {
        const newSize = size / 2;
        const offset = size / 2;
        
        // Four smaller tetrahedrons
        createSierpinskiTetrahedron(level - 1, newSize, position.clone().add(new THREE.Vector3(offset, offset, offset)));
        createSierpinskiTetrahedron(level - 1, newSize, position.clone().add(new THREE.Vector3(-offset, -offset, offset)));
        createSierpinskiTetrahedron(level - 1, newSize, position.clone().add(new THREE.Vector3(-offset, offset, -offset)));
        createSierpinskiTetrahedron(level - 1, newSize, position.clone().add(new THREE.Vector3(offset, -offset, -offset)));
      }
    };

    createSierpinskiTetrahedron(3, 1, new THREE.Vector3(0, 0, 0));
    scene.add(fractalGroup);
  };

  // Geography models
  const createGlobe = (scene: THREE.Scene) => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.8
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add continents as smaller spheres
    const continents = [
      { lat: 40, lon: -100, color: 0x4caf50 }, // North America
      { lat: -15, lon: -60, color: 0x8bc34a }, // South America
      { lat: 50, lon: 10, color: 0x66bb6a }, // Europe
      { lat: 20, lon: 78, color: 0x43a047 }, // Asia
    ];

    continents.forEach(continent => {
      const phi = (90 - continent.lat) * (Math.PI / 180);
      const theta = (continent.lon + 180) * (Math.PI / 180);
      
      const x = -(1.05 * Math.sin(phi) * Math.cos(theta));
      const z = (1.05 * Math.sin(phi) * Math.sin(theta));
      const y = (1.05 * Math.cos(phi));

      const contGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const contMaterial = new THREE.MeshPhongMaterial({ color: continent.color });
      const contMesh = new THREE.Mesh(contGeometry, contMaterial);
      contMesh.position.set(x, y, z);
      scene.add(contMesh);
    });
  };

  const createContinents = (scene: THREE.Scene) => {
    const continentGroup = new THREE.Group();
    
    // Base earth
    const earthGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEEB });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    continentGroup.add(earth);

    // Detailed continents
    const continents = [
      { name: 'North America', lat: 45, lon: -100, size: 0.3, color: 0x228B22 },
      { name: 'South America', lat: -15, lon: -60, size: 0.25, color: 0x32CD32 },
      { name: 'Europe', lat: 50, lon: 10, size: 0.15, color: 0x90EE90 },
      { name: 'Asia', lat: 35, lon: 100, size: 0.4, color: 0x006400 },
      { name: 'Africa', lat: 0, lon: 20, size: 0.3, color: 0x9ACD32 },
      { name: 'Australia', lat: -25, lon: 140, size: 0.1, color: 0x7CFC00 },
      { name: 'Antarctica', lat: -80, lon: 0, size: 0.2, color: 0xF0F8FF }
    ];

    continents.forEach(continent => {
      const phi = (90 - continent.lat) * (Math.PI / 180);
      const theta = (continent.lon + 180) * (Math.PI / 180);
      
      const x = -(1.25 * Math.sin(phi) * Math.cos(theta));
      const z = (1.25 * Math.sin(phi) * Math.sin(theta));
      const y = (1.25 * Math.cos(phi));

      const contGeometry = new THREE.SphereGeometry(continent.size, 12, 12);
      contGeometry.scale(1.2, 0.3, 1);
      const contMaterial = new THREE.MeshPhongMaterial({ color: continent.color });
      const contMesh = new THREE.Mesh(contGeometry, contMaterial);
      contMesh.position.set(x, y, z);
      continentGroup.add(contMesh);
    });

    scene.add(continentGroup);
  };

  const createVolcano = (scene: THREE.Scene) => {
    const volcanoGroup = new THREE.Group();
    
    // Volcano base
    const baseGeometry = new THREE.ConeGeometry(1, 1.5, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.75;
    volcanoGroup.add(base);

    // Crater
    const craterGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.3);
    const craterMaterial = new THREE.MeshPhongMaterial({ color: 0x8B0000 });
    const crater = new THREE.Mesh(craterGeometry, craterMaterial);
    crater.position.y = 0.6;
    volcanoGroup.add(crater);

    // Lava
    const lavaGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const lavaMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4500 });
    const lava = new THREE.Mesh(lavaGeometry, lavaMaterial);
    lava.position.y = 0.7;
    volcanoGroup.add(lava);

    // Smoke particles
    for (let i = 0; i < 20; i++) {
      const smokeGeometry = new THREE.SphereGeometry(0.05, 4, 4);
      const smokeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x808080,
        transparent: true,
        opacity: 0.3
      });
      const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
      smoke.position.set(
        (Math.random() - 0.5) * 0.5,
        0.8 + Math.random() * 1.5,
        (Math.random() - 0.5) * 0.5
      );
      volcanoGroup.add(smoke);
    }

    scene.add(volcanoGroup);
  };

  // Chemistry models
  const createMolecule = (scene: THREE.Scene) => {
    // Water molecule (H2O)
    const oxygenGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const oxygenMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const oxygen = new THREE.Mesh(oxygenGeometry, oxygenMaterial);
    scene.add(oxygen);

    // Hydrogen atoms
    const hydrogenGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    const hydrogen1 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogen1.position.set(0.8, 0.6, 0);
    scene.add(hydrogen1);

    const hydrogen2 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogen2.position.set(0.8, -0.6, 0);
    scene.add(hydrogen2);

    // Bonds
    const bondGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const bondMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    const bond1 = new THREE.Mesh(bondGeometry, bondMaterial);
    bond1.position.set(0.4, 0.3, 0);
    bond1.rotation.z = -Math.PI / 6;
    scene.add(bond1);

    const bond2 = new THREE.Mesh(bondGeometry, bondMaterial);
    bond2.position.set(0.4, -0.3, 0);
    bond2.rotation.z = Math.PI / 6;
    scene.add(bond2);
  };

  const createAtomicModel = (scene: THREE.Scene) => {
    const atomGroup = new THREE.Group();
    
    // Nucleus with protons and neutrons
    const nucleusGroup = new THREE.Group();
    
    // Protons (red)
    for (let i = 0; i < 6; i++) {
      const protonGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const protonMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const proton = new THREE.Mesh(protonGeometry, protonMaterial);
      proton.position.set(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      );
      nucleusGroup.add(proton);
    }
    
    // Neutrons (blue)
    for (let i = 0; i < 6; i++) {
      const neutronGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const neutronMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
      const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
      neutron.position.set(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      );
      nucleusGroup.add(neutron);
    }
    
    atomGroup.add(nucleusGroup);

    // Electron shells
    const shells = [0.8, 1.4, 2.0];
    shells.forEach((radius, shellIndex) => {
      // Orbital ring
      const orbitGeometry = new THREE.TorusGeometry(radius, 0.01, 8, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x74b9ff,
        transparent: true,
        opacity: 0.3
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = shellIndex * Math.PI / 4;
      orbit.rotation.y = shellIndex * Math.PI / 3;
      atomGroup.add(orbit);

      // Electrons
      const electronCount = shellIndex === 0 ? 2 : (shellIndex === 1 ? 4 : 2);
      for (let i = 0; i < electronCount; i++) {
        const electronGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const electronMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.set(radius, 0, 0);
        electron.userData = { 
          type: 'electron', 
          shell: shellIndex, 
          angle: (i * 2 * Math.PI) / electronCount,
          radius: radius
        };
        atomGroup.add(electron);
      }
    });

    scene.add(atomGroup);
  };

  const createChemicalReaction = (scene: THREE.Scene) => {
    const reactionGroup = new THREE.Group();
    
    // Reactants: 2H2 + O2
    // Hydrogen molecules
    for (let i = 0; i < 2; i++) {
      const h2Group = new THREE.Group();
      
      const h1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      const h2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      
      h1.position.set(-0.15, 0, 0);
      h2.position.set(0.15, 0, 0);
      
      h2Group.add(h1, h2);
      h2Group.position.set(-2 + i * 0.8, 0.5, 0);
      reactionGroup.add(h2Group);
    }
    
    // Oxygen molecule
    const o2Group = new THREE.Group();
    const o1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    const o2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    
    o1.position.set(-0.2, 0, 0);
    o2.position.set(0.2, 0, 0);
    o2Group.add(o1, o2);
    o2Group.position.set(-2, -0.5, 0);
    reactionGroup.add(o2Group);
    
    // Arrow
    const arrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.rotation.z = -Math.PI / 2;
    arrow.position.set(0, 0, 0);
    reactionGroup.add(arrow);
    
    // Products: 2H2O
    for (let i = 0; i < 2; i++) {
      const h2oGroup = new THREE.Group();
      
      // Oxygen
      const oxygen = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
      );
      
      // Hydrogens
      const h1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      const h2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
      
      h1.position.set(0.25, 0.2, 0);
      h2.position.set(0.25, -0.2, 0);
      
      h2oGroup.add(oxygen, h1, h2);
      h2oGroup.position.set(2 + i * 0.8, 0, 0);
      reactionGroup.add(h2oGroup);
    }

    scene.add(reactionGroup);
  };

  // Physics models
  const createAtom = (scene: THREE.Scene) => {
    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);

    // Electron orbits
    const orbitGeometry = new THREE.TorusGeometry(1, 0.01, 8, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x74b9ff,
      transparent: true,
      opacity: 0.3
    });

    for (let i = 0; i < 3; i++) {
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = (i * Math.PI) / 3;
      orbit.rotation.y = (i * Math.PI) / 4;
      scene.add(orbit);

      // Electrons
      const electronGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const electronMaterial = new THREE.MeshPhongMaterial({ color: 0x0984e3 });
      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      electron.position.set(1, 0, 0);
      electron.userData = { orbit: i, angle: 0 };
      scene.add(electron);
    }
  };

  const createLightRays = (scene: THREE.Scene) => {
    const lightGroup = new THREE.Group();
    
    // Light source
    const sourceGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.set(-2, 0, 0);
    lightGroup.add(source);
    
    // Prism
    const prismGeometry = new THREE.ConeGeometry(0.3, 0.8, 3);
    const prismMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    });
    const prism = new THREE.Mesh(prismGeometry, prismMaterial);
    prism.rotation.z = Math.PI / 2;
    lightGroup.add(prism);
    
    // Light rays
    const colors = [0xff0000, 0xff8000, 0xffff00, 0x00ff00, 0x0000ff, 0x8000ff, 0xff00ff];
    colors.forEach((color, index) => {
      const rayGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2);
      const rayMaterial = new THREE.MeshBasicMaterial({ color });
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      
      ray.position.set(1, 0, 0);
      ray.rotation.z = Math.PI / 2;
      ray.rotation.y = (index - 3) * 0.1;
      lightGroup.add(ray);
    });
    
    // Screen
    const screenGeometry = new THREE.PlaneGeometry(1, 2);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf0f0f0,
      transparent: true,
      opacity: 0.8
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(2.5, 0, 0);
    lightGroup.add(screen);

    scene.add(lightGroup);
  };

  const createCircuit = (scene: THREE.Scene) => {
    const circuitGroup = new THREE.Group();
    
    // Circuit board
    const boardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    circuitGroup.add(board);
    
    // Battery
    const batteryGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.2);
    const batteryMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const battery = new THREE.Mesh(batteryGeometry, batteryMaterial);
    battery.position.set(-1, 0.5, 0.1);
    circuitGroup.add(battery);
    
    // LED
    const ledGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const ledMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(1, 0.5, 0.1);
    circuitGroup.add(led);
    
    // Resistor
    const resistorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    const resistorMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
    const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
    resistor.position.set(0, -0.5, 0.1);
    resistor.rotation.z = Math.PI / 2;
    circuitGroup.add(resistor);
    
    // Wires
    const wireGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
    const wireMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    
    // Top wire
    const topWire = new THREE.Mesh(wireGeometry, wireMaterial);
    topWire.position.set(0, 0.5, 0.1);
    topWire.rotation.z = Math.PI / 2;
    circuitGroup.add(topWire);
    
    // Bottom wire
    const bottomWire = new THREE.Mesh(wireGeometry, wireMaterial);
    bottomWire.position.set(0, -0.5, 0.1);
    bottomWire.rotation.z = Math.PI / 2;
    circuitGroup.add(bottomWire);
    
    // Side wires
    const leftWire = new THREE.Mesh(wireGeometry, wireMaterial);
    leftWire.position.set(-1, 0, 0.1);
    circuitGroup.add(leftWire);
    
    const rightWire = new THREE.Mesh(wireGeometry, wireMaterial);
    rightWire.position.set(1, 0, 0.1);
    circuitGroup.add(rightWire);

    scene.add(circuitGroup);
  };

  const handleSubjectSelect = (subjectId: string) => {
    setIsLoading(true);
    setCurrentModel(0);
    setTimeout(() => {
      setSelectedSubject(subjectId);
      setIsLoading(false);
    }, 500);
  };

  const resetScene = () => {
    setSelectedSubject(null);
    setMode('learn');
    setCurrentModel(0);
  };

  const nextModel = () => {
    const maxModels = 3;
    setCurrentModel((prev) => (prev + 1) % maxModels);
  };

  if (selectedSubject === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              EduVerse 3D
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Interactive Web-Based Learning and Gaming Platform
            </p>
            <p className="text-gray-400">
              Explore complex concepts through immersive 3D visualizations and interactive games
            </p>
          </div>

          {/* Features */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Learn Mode</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
              <span>Play Mode</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Volume2 className="w-5 h-5 text-green-400" />
              <span>Audio Narration</span>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Choose Your Learning Adventure
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const IconComponent = subject.icon;
                return (
                  <Card 
                    key={subject.id}
                    className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
                    onClick={() => handleSubjectSelect(subject.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${subject.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-white">{subject.name}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-300">
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {subject.examples.map((example) => (
                          <Badge key={example} variant="secondary" className="bg-slate-700 text-gray-300">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-400">
            <p>Built with Three.js • React • TypeScript</p>
            <p className="mt-2">Click and drag to rotate • Scroll to zoom • Interactive learning awaits!</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={resetScene}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>
            
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            
            <div className="flex items-center gap-2">
              {currentSubject && (
                <>
                  <div className={`p-1.5 rounded ${currentSubject.color}`}>
                    <currentSubject.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{currentSubject.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={mode === 'learn' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('learn')}
              className={mode === 'learn' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-gray-300 hover:bg-slate-700'}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn Mode
            </Button>
            <Button
              variant={mode === 'play' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('play')}
              className={mode === 'play' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-gray-300 hover:bg-slate-700'}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Play Mode
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* 3D Viewport */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading 3D scene...</p>
              </div>
            </div>
          ) : (
            <div ref={mountRef} className="w-full h-full" />
          )}
          
          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-300">
            <p><strong>Controls:</strong></p>
            <p>• Click & drag to rotate</p>
            <p>• Scroll to zoom</p>
            <p>• Auto-rotation when idle</p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {mode === 'learn' ? 'Learning Mode' : 'Game Mode'}
              </h3>
              <p className="text-gray-300 text-sm">
                {mode === 'learn' 
                  ? 'Explore and interact with 3D models to understand concepts better.'
                  : 'Test your knowledge with interactive challenges and games.'
                }
              </p>
            </div>

            <Separator className="bg-slate-700" />

            <div>
              <h4 className="text-white font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
                  onClick={nextModel}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Next Model ({currentModel + 1}/3)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio Guide
                </Button>
              </div>
            </div>

            {mode === 'play' && (
              <>
                <Separator className="bg-slate-700" />
                <div>
                  <h4 className="text-white font-medium mb-3">Game Challenge</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-gray-300 text-sm mb-3">
                      Click on the correct object when prompted!
                    </p>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      Start Challenge
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Separator className="bg-slate-700" />

            <div>
              <h4 className="text-white font-medium mb-3">Did You Know?</h4>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  {selectedSubject === 'biology' && "DNA contains the genetic instructions for all living organisms!"}
                  {selectedSubject === 'space' && "Jupiter is so large that all other planets could fit inside it!"}
                  {selectedSubject === 'math' && "The golden ratio appears frequently in nature and art!"}
                  {selectedSubject === 'geography' && "Earth's continents are constantly moving due to plate tectonics!"}
                  {selectedSubject === 'chemistry' && "Water molecules are polar, which gives water its unique properties!"}
                  {selectedSubject === 'physics' && "Atoms are 99.9% empty space!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
