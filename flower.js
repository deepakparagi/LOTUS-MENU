import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('flower-container');
if (container) {
  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 6, 12);
  camera.lookAt(0, 1, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffeedd, 0.6);
  scene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(0xffd7a0, 1.2);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xa0c0ff, 0.5);
  fillLight.position.set(-5, 0, -5);
  scene.add(fillLight);

  // Lotus Flower Group
  const lotusGroup = new THREE.Group();
  scene.add(lotusGroup);

  // Materials
  const petalMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a574, // Gold color matching the brand
    roughness: 0.3,
    metalness: 0.4,
    side: THREE.DoubleSide,
    emissive: 0x3a2000,
    emissiveIntensity: 0.1
  });

  const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0d5a8,
    roughness: 0.8,
    metalness: 0.1
  });

  // Receptacle (center)
  const centerGeo = new THREE.SphereGeometry(0.5, 32, 16);
  const centerMesh = new THREE.Mesh(centerGeo, centerMaterial);
  centerMesh.scale.y = 0.5;
  lotusGroup.add(centerMesh);

  // Petal Geometry
  // A simple petal shape using a manipulated sphere
  const petalGeo = new THREE.SphereGeometry(1, 32, 16);
  const positions = petalGeo.attributes.position;
  for(let i=0; i<positions.count; i++) {
    const y = positions.getY(i);
    const z = positions.getZ(i);
    // Flatten and taper
    positions.setZ(i, z * 0.15); // Flatten heavily
    if (y > 0) {
      positions.setX(i, positions.getX(i) * (1 - y)); // Pointy top
    } else {
      positions.setX(i, positions.getX(i) * (1 + y * 1.5)); // Tapered bottom
    }
  }
  petalGeo.computeVertexNormals();

  // Create Petals
  const layers = [
    { count: 6, radius: 0.3, scale: 1.5, angleOffset: 0, openAngle: Math.PI / 6 },
    { count: 8, radius: 0.5, scale: 2.0, angleOffset: Math.PI / 8, openAngle: Math.PI / 3.5 },
    { count: 12, radius: 0.7, scale: 2.4, angleOffset: Math.PI / 12, openAngle: Math.PI / 2.5 },
    { count: 16, radius: 0.9, scale: 2.6, angleOffset: Math.PI / 16, openAngle: Math.PI / 2.2 }
  ];

  const petals = [];

  layers.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.count; i++) {
      const angle = (i / layer.count) * Math.PI * 2 + layer.angleOffset;
      
      const petal = new THREE.Mesh(petalGeo, petalMaterial);
      
      // Pivot group to rotate petal from its base
      const pivot = new THREE.Group();
      
      pivot.position.x = Math.sin(angle) * layer.radius;
      pivot.position.z = Math.cos(angle) * layer.radius;
      pivot.rotation.y = angle;
      
      // Position petal so its base is at the pivot (y=0)
      petal.position.y = layer.scale * 0.5;
      petal.scale.set(layer.scale * 0.4, layer.scale, layer.scale * 0.4);
      
      // Initial closed rotation (pointing upwards)
      pivot.rotation.x = -0.1;
      
      pivot.add(petal);
      lotusGroup.add(pivot);
      
      petals.push({
        pivot: pivot,
        targetAngle: -layer.openAngle,
        delay: layerIdx * 0.8 // stagger opening
      });
    }
  });

  // Tilt to see inside
  lotusGroup.rotation.x = Math.PI / 8;
  // Offset downwards slightly
  lotusGroup.position.y = -1;

  // Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    // Slow breathing and rotation
    lotusGroup.position.y = -1 + Math.sin(time * 0.5) * 0.3;
    lotusGroup.rotation.y = time * 0.1;

    // Opening animation
    petals.forEach((p, i) => {
      // Smooth interpolation to open angle
      const t = Math.max(0, Math.min(1, (time - p.delay) * 0.3));
      const ease = 1 - Math.pow(1 - t, 3); // Cubic ease out
      
      // Gentle breathing effect when open
      const breathe = Math.sin(time * 2 + i) * 0.03 * ease;
      
      p.pivot.rotation.x = THREE.MathUtils.lerp(-0.1, p.targetAngle, ease) + breathe;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
