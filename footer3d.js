import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const footerCanvas = document.getElementById('footer-3d-canvas');
if (footerCanvas) {
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / footerCanvas.parentElement.clientHeight, 0.1, 100);
  camera.position.z = 12;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: footerCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  
  // Lighting
  const light = new THREE.PointLight(0xd4a574, 3, 50);
  light.position.set(0, 5, 5);
  scene.add(light);
  
  const fillLight = new THREE.DirectionalLight(0x8a5a2b, 2);
  fillLight.position.set(-5, -5, -5);
  scene.add(fillLight);
  
  const ambient = new THREE.AmbientLight(0x221100, 2);
  scene.add(ambient);

  // Group for the main centerpiece
  const centerGroup = new THREE.Group();
  scene.add(centerGroup);

  // 1. Wireframe Outer Sphere
  const outerGeo = new THREE.IcosahedronGeometry(3.5, 1);
  const outerMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4a574,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  centerGroup.add(outerMesh);
  
  // 2. Inner Glowing Diamond (Octahedron)
  const innerGeo = new THREE.OctahedronGeometry(2, 0);
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    emissive: 0x3a2000,
    metalness: 1.0,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.9
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  centerGroup.add(innerMesh);

  // 3. Floating Gold Dust Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = 150;
  const posArray = new Float32Array(particlesCount * 3);
  const speedArray = new Float32Array(particlesCount);
  
  for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread across the footer width and height
    posArray[i] = (Math.random() - 0.5) * 30; // x
    posArray[i+1] = (Math.random() - 0.5) * 15; // y
    posArray[i+2] = (Math.random() - 0.5) * 10 - 5; // z
    
    speedArray[i/3] = 0.5 + Math.random();
  }
  
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speedArray, 1));
  
  const particlesMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xd4a574,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlesMesh);

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    // Rotate the 3D centerpiece
    outerMesh.rotation.y = time * 0.15;
    outerMesh.rotation.x = time * 0.1;
    
    innerMesh.rotation.y = time * -0.2;
    innerMesh.rotation.z = time * 0.15;
    
    // Gentle floating effect
    centerGroup.position.y = Math.sin(time * 0.8) * 0.4;

    // Animate Particles
    const positions = particlesGeo.attributes.position.array;
    const speeds = particlesGeo.attributes.aSpeed.array;
    
    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // move up slowly
      positions[i3 + 1] += Math.sin(time + speeds[i]) * 0.01 + speeds[i] * 0.02;
      
      // gently sway x
      positions[i3] += Math.cos(time * 0.5 + i) * 0.01;
      
      // reset if too high
      if (positions[i3 + 1] > 8) {
        positions[i3 + 1] = -8;
      }
    }
    particlesGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  
  animate();

  // Resize handler specific to footer
  function resize() {
    const width = window.innerWidth;
    const height = footerCanvas.parentElement.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  
  window.addEventListener('resize', resize);
  
  // Initial size sync (timeout allows layout to settle)
  setTimeout(resize, 50);
}
