import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('flower-container');
if (container) {
  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 4, 14);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffeedd, 0.4);
  scene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(0xffecd4, 2.5);
  dirLight.position.set(8, 12, 8);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x90b0ff, 1.0);
  fillLight.position.set(-8, 2, -8);
  scene.add(fillLight);
  
  const backLight = new THREE.DirectionalLight(0xffa550, 1.5);
  backLight.position.set(0, 5, -10);
  scene.add(backLight);

  // Lotus Flower Group
  const lotusGroup = new THREE.Group();
  scene.add(lotusGroup);

  // Materials
  const petalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd4a574,
    emissive: 0x110800,
    roughness: 0.25,
    metalness: 0.7,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide
  });

  const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0d5a8,
    roughness: 0.7,
    metalness: 0.2,
    emissive: 0x332200
  });

  // Receptacle (center)
  const centerGeo = new THREE.SphereGeometry(0.8, 32, 16);
  const centerMesh = new THREE.Mesh(centerGeo, centerMaterial);
  centerMesh.scale.y = 0.5;
  lotusGroup.add(centerMesh);

  // Petal Geometry
  const petalGeo = new THREE.SphereGeometry(1, 32, 32);
  const positions = petalGeo.attributes.position;
  for(let i=0; i<positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    const ny = (y + 1) / 2; // 0 to 1
    const width = Math.sin(ny * Math.PI) * (1.1 - ny * 0.4);
    const curl = Math.pow(ny, 2.5) * 0.6;
    const thickness = 0.08;
    
    positions.setX(i, x * width);
    positions.setZ(i, z * thickness - curl);
  }
  petalGeo.computeVertexNormals();

  // Create Petals
  const layers = [
    { count: 6,  radius: 0.2, scale: 1.8, angleOffset: 0,              openAngle: Math.PI / 8 },
    { count: 8,  radius: 0.4, scale: 2.2, angleOffset: Math.PI / 8,    openAngle: Math.PI / 5 },
    { count: 12, radius: 0.6, scale: 2.6, angleOffset: Math.PI / 12,   openAngle: Math.PI / 3.5 },
    { count: 16, radius: 0.8, scale: 2.9, angleOffset: Math.PI / 16,   openAngle: Math.PI / 2.5 },
    { count: 20, radius: 1.0, scale: 3.1, angleOffset: Math.PI / 20,   openAngle: Math.PI / 2.1 }
  ];

  const petals = [];

  layers.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.count; i++) {
      const angle = (i / layer.count) * Math.PI * 2 + layer.angleOffset;
      
      const petal = new THREE.Mesh(petalGeo, petalMaterial);
      
      const pivot = new THREE.Group();
      pivot.position.x = Math.sin(angle) * layer.radius;
      pivot.position.z = Math.cos(angle) * layer.radius;
      pivot.rotation.y = angle;
      
      // Bottom of petal is at y=-1 in unscaled geo. So translate up by scale.
      petal.position.y = layer.scale; 
      petal.scale.set(layer.scale * 0.45, layer.scale, layer.scale * 0.45);
      
      pivot.rotation.x = 0.1; // Initial slight close
      
      pivot.add(petal);
      lotusGroup.add(pivot);
      
      petals.push({
        pivot: pivot,
        targetAngle: -layer.openAngle,
        delay: layerIdx * 0.5 // faster stagger
      });
    }
  });

  // Tilt to see inside beautifully
  lotusGroup.rotation.x = Math.PI / 6;
  lotusGroup.position.y = -0.5;

  // Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    lotusGroup.position.y = -1.5 + Math.sin(time * 0.8) * 0.15;
    lotusGroup.rotation.y = time * 0.15;

    petals.forEach((p, i) => {
      const t = Math.max(0, Math.min(1, (time - p.delay) * 0.4));
      const ease = 1 - Math.pow(1 - t, 3);
      const breathe = Math.sin(time * 1.5 + i) * 0.02 * ease;
      p.pivot.rotation.x = THREE.MathUtils.lerp(0.1, p.targetAngle, ease) + breathe;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
