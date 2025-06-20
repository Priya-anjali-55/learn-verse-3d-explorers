
import * as THREE from 'three';

export const createSubjectContent = (scene: THREE.Scene, subject: string, modelIndex: number) => {
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

export const animateScene = (scene: THREE.Scene) => {
  const time = Date.now() * 0.001;

  scene.children.forEach(child => {
    // Planetary orbit animations - enhanced for visibility
    if (child.userData.orbit !== undefined) {
      child.userData.angle += child.userData.speed;
      child.position.x = Math.cos(child.userData.angle) * child.userData.distance;
      child.position.z = Math.sin(child.userData.angle) * child.userData.distance;
    }
    
    // Electron animations - made more dramatic
    if (child.userData.type === 'electron') {
      child.userData.angle += 0.08; // Increased speed
      const radius = child.userData.radius || 1;
      const shellOffset = child.userData.shell * Math.PI / 3;
      child.position.x = Math.cos(child.userData.angle + shellOffset) * radius;
      child.position.z = Math.sin(child.userData.angle + shellOffset) * radius;
      child.position.y = Math.sin(child.userData.angle * 2) * 0.2; // Increased amplitude
    }

    // Heart beating animation - more pronounced
    if (child.userData.type === 'heart') {
      const beatScale = 1 + Math.sin(time * 6) * 0.2; // Increased amplitude and speed
      child.scale.set(beatScale, beatScale, beatScale);
    }

    // Plant cell organelle movement - more visible
    if (child.userData.type === 'chloroplast') {
      child.position.x += Math.sin(time * 3 + child.userData.offset) * 0.003; // Increased movement
      child.position.y += Math.cos(time * 2 + child.userData.offset) * 0.003;
    }

    // Galaxy rotation - more noticeable
    if (child.userData.type === 'galaxy') {
      child.rotation.y += 0.005; // Increased speed
      child.rotation.z += 0.002;
    }

    // Vector pulsing - more dramatic
    if (child.userData.type === 'vector') {
      const pulse = 1 + Math.sin(time * 4 + child.userData.offset) * 0.3; // Increased amplitude
      child.scale.set(pulse, pulse, pulse);
    }

    // Fractal rotation - more visible
    if (child.userData.type === 'fractal') {
      child.rotation.x += 0.02; // Doubled speed
      child.rotation.y += 0.03;
      child.rotation.z += 0.01;
    }

    // Continental drift simulation - enhanced
    if (child.userData.type === 'continent') {
      child.rotation.y += (child.userData.driftSpeed || 0.001) * 3; // Made 3x faster
    }

    // Volcano eruption animation - more dramatic
    if (child.userData.type === 'lava') {
      const eruptionHeight = 0.7 + Math.sin(time * 6) * 0.5; // Increased frequency
      child.position.y = eruptionHeight;
      const glowIntensity = 0.5 + Math.sin(time * 8) * 0.5;
      if (child.material && 'emissive' in child.material) {
        (child.material as THREE.MeshBasicMaterial).emissive.setRGB(glowIntensity, glowIntensity * 0.3, 0);
      }
    }

    // Smoke particle movement - enhanced
    if (child.userData.type === 'smoke') {
      child.position.y += 0.02; // Doubled speed
      child.position.x += Math.sin(time * 2 + child.userData.offset) * 0.01; // Doubled movement
      if (child.position.y > 3) child.position.y = 0.8;
    }

    // Molecular vibration - more visible
    if (child.userData.type === 'molecule') {
      const vibration = Math.sin(time * 15 + child.userData.offset) * 0.05; // Increased amplitude and frequency
      child.position.x += vibration;
      child.position.y += vibration * 0.5;
    }

    // Chemical reaction animation - enhanced
    if (child.userData.type === 'reactant') {
      child.position.x += child.userData.velocity * 0.02; // Doubled speed
      if (child.position.x > 0) {
        child.userData.type = 'product';
        child.position.x = 2;
      }
    }

    // Light ray animation - more dramatic
    if (child.userData.type === 'lightRay') {
      const wave = Math.sin(time * 8 + child.userData.offset) * 0.2; // Increased amplitude and frequency
      child.position.y += wave * 0.5;
      if (child.material && 'opacity' in child.material) {
        (child.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(time * 5) * 0.3;
      }
    }

    // Circuit electricity flow - enhanced
    if (child.userData.type === 'electricity') {
      child.position.x += child.userData.direction * 0.1; // Doubled speed
      if (Math.abs(child.position.x) > 2) {
        child.position.x = -2 * child.userData.direction;
      }
    }

    // LED blinking - more noticeable
    if (child.userData.type === 'led') {
      const blink = Math.sin(time * 12) > 0 ? 1 : 0.1; // Increased frequency, darker off state
      if (child.material && 'emissive' in child.material) {
        (child.material as THREE.MeshBasicMaterial).emissive.setRGB(blink, 0, 0);
      }
    }
  });
};

// Biology models
export const createDNAHelix = (scene: THREE.Scene) => {
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

export const createHumanHeart = (scene: THREE.Scene) => {
  const heartGroup = new THREE.Group();
  heartGroup.userData.type = 'heart';
  
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

export const createPlantCell = (scene: THREE.Scene) => {
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

  // Chloroplasts with animation data
  for (let i = 0; i < 6; i++) {
    const chloroplastGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const chloroplastMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const chloroplast = new THREE.Mesh(chloroplastGeometry, chloroplastMaterial);
    chloroplast.position.set(
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1,
      (Math.random() - 0.5) * 0.8
    );
    chloroplast.userData = { 
      type: 'chloroplast', 
      offset: i * Math.PI / 3 
    };
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
export const createSolarSystem = (scene: THREE.Scene) => {
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

export const createPlanetaryOrbits = (scene: THREE.Scene) => {
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

export const createGalaxy = (scene: THREE.Scene) => {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.userData.type = 'galaxy';
  
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
export const createGeometricShapes = (scene: THREE.Scene) => {
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

export const createVectors = (scene: THREE.Scene) => {
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

  vectors.forEach((vectorData, index) => {
    // Arrow shaft
    const arrowGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
    const arrowMaterial = new THREE.MeshPhongMaterial({ color: vectorData.color });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    
    // Point arrow in direction
    const direction = new THREE.Vector3(...vectorData.direction).normalize();
    arrow.lookAt(direction);
    arrow.rotateX(Math.PI / 2);
    arrow.position.copy(direction.multiplyScalar(0.75));
    arrow.userData = { type: 'vector', offset: index * Math.PI / 3 };
    
    vectorGroup.add(arrow);

    // Arrow head
    const headGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
    const head = new THREE.Mesh(headGeometry, arrowMaterial);
    head.position.copy(direction.multiplyScalar(2));
    head.lookAt(direction.multiplyScalar(3));
    head.userData = { type: 'vector', offset: index * Math.PI / 3 };
    vectorGroup.add(head);
  });

  scene.add(vectorGroup);
};

export const createFractal = (scene: THREE.Scene) => {
  const fractalGroup = new THREE.Group();
  fractalGroup.userData.type = 'fractal';
  
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
export const createGlobe = (scene: THREE.Scene) => {
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

export const createContinents = (scene: THREE.Scene) => {
  const continentGroup = new THREE.Group();
  
  // Base earth
  const earthGeometry = new THREE.SphereGeometry(1.2, 32, 32);
  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEEB });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  continentGroup.add(earth);

  // Detailed continents
  const continents = [
    { name: 'North America', lat: 45, lon: -100, size: 0.3, color: 0x228B22, drift: 0.0005 },
    { name: 'South America', lat: -15, lon: -60, size: 0.25, color: 0x32CD32, drift: 0.0003 },
    { name: 'Europe', lat: 50, lon: 10, size: 0.15, color: 0x90EE90, drift: 0.0002 },
    { name: 'Asia', lat: 35, lon: 100, size: 0.4, color: 0x006400, drift: 0.0001 },
    { name: 'Africa', lat: 0, lon: 20, size: 0.3, color: 0x9ACD32, drift: 0.0004 },
    { name: 'Australia', lat: -25, lon: 140, size: 0.1, color: 0x7CFC00, drift: 0.0006 },
    { name: 'Antarctica', lat: -80, lon: 0, size: 0.2, color: 0xF0F8FF, drift: 0.0001 }
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
    contMesh.userData = { type: 'continent', driftSpeed: continent.drift };
    continentGroup.add(contMesh);
  });

  scene.add(continentGroup);
};

export const createVolcano = (scene: THREE.Scene) => {
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

  // Lava with animation
  const lavaGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const lavaMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4500 });
  const lava = new THREE.Mesh(lavaGeometry, lavaMaterial);
  lava.position.y = 0.7;
  lava.userData = { type: 'lava' };
  volcanoGroup.add(lava);

  // Smoke particles with animation
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
    smoke.userData = { type: 'smoke', offset: i * Math.PI / 10 };
    volcanoGroup.add(smoke);
  }

  scene.add(volcanoGroup);
};

// Chemistry models
export const createMolecule = (scene: THREE.Scene) => {
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

export const createAtomicModel = (scene: THREE.Scene) => {
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
    proton.userData = { type: 'molecule', offset: i * Math.PI / 3 };
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
    neutron.userData = { type: 'molecule', offset: i * Math.PI / 3 };
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

export const createChemicalReaction = (scene: THREE.Scene) => {
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
    h1.userData = { type: 'reactant', velocity: 1 };
    h2.userData = { type: 'reactant', velocity: 1 };
    
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
  o1.userData = { type: 'reactant', velocity: 1 };
  o2.userData = { type: 'reactant', velocity: 1 };
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
    
    oxygen.userData = { type: 'molecule', offset: i * Math.PI };
    h1.userData = { type: 'molecule', offset: i * Math.PI + 1 };
    h2.userData = { type: 'molecule', offset: i * Math.PI + 2 };
    
    h2oGroup.add(oxygen, h1, h2);
    h2oGroup.position.set(2 + i * 0.8, 0, 0);
    reactionGroup.add(h2oGroup);
  }

  scene.add(reactionGroup);
};

// Physics models
export const createAtom = (scene: THREE.Scene) => {
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

export const createLightRays = (scene: THREE.Scene) => {
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
  
  // Light rays with animation
  const colors = [0xff0000, 0xff8000, 0xffff00, 0x00ff00, 0x0000ff, 0x8000ff, 0xff00ff];
  colors.forEach((color, index) => {
    const rayGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2);
    const rayMaterial = new THREE.MeshBasicMaterial({ 
      color,
      transparent: true,
      opacity: 0.8
    });
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    
    ray.position.set(1, 0, 0);
    ray.rotation.z = Math.PI / 2;
    ray.rotation.y = (index - 3) * 0.1;
    ray.userData = { type: 'lightRay', offset: index * Math.PI / 4 };
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

export const createCircuit = (scene: THREE.Scene) => {
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
  
  // LED with blinking animation
  const ledGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const ledMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const led = new THREE.Mesh(ledGeometry, ledMaterial);
  led.position.set(1, 0.5, 0.1);
  led.userData = { type: 'led' };
  circuitGroup.add(led);
  
  // Resistor
  const resistorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
  const resistorMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
  const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
  resistor.position.set(0, -0.5, 0.1);
  resistor.rotation.z = Math.PI / 2;
  circuitGroup.add(resistor);
  
  // Electricity flow particles
  for (let i = 0; i < 4; i++) {
    const electricityGeometry = new THREE.SphereGeometry(0.02, 4, 4);
    const electricityMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8
    });
    const electricity = new THREE.Mesh(electricityGeometry, electricityMaterial);
    electricity.position.set(-2 + i, 0.5, 0.12);
    electricity.userData = { type: 'electricity', direction: 1 };
    circuitGroup.add(electricity);
  }
  
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
