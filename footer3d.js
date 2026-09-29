import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const footerCanvas = document.getElementById('footer-3d-canvas');
if (footerCanvas) {
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / footerCanvas.parentElement.clientHeight, 0.1, 100);
  camera.position.z = 10;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: footerCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  
  // Lighting
  const ambient = new THREE.AmbientLight(0xffeedd, 1);
  scene.add(ambient);
  
  const pointLight = new THREE.PointLight(0xd4a574, 5, 20);
  pointLight.position.set(0, 0, 2);
  scene.add(pointLight);

  const centerGroup = new THREE.Group();
  scene.add(centerGroup);

  // Elite 3D Geometry: A delicate golden geodesic sphere
  // Icosahedron with detail 2 creates a beautiful complex geometric sphere
  const geometry = new THREE.IcosahedronGeometry(4.5, 2);
  
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMat = new THREE.LineBasicMaterial({ 
    color: 0xd4a574,
    transparent: true,
    opacity: 0.12, // Very faint, subtle, luxury
    depthWrite: false
  });
  const lines = new THREE.LineSegments(edges, lineMat);
  centerGroup.add(lines);

  // Floating Gold Dust Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = 200;
  const posArray = new Float32Array(particlesCount * 3);
  const speedArray = new Float32Array(particlesCount);
  
  for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread across the footer width and height
    posArray[i] = (Math.random() - 0.5) * 30; // x
    posArray[i+1] = (Math.random() - 0.5) * 20; // y
    posArray[i+2] = (Math.random() - 0.5) * 15 - 5; // z
    
    speedArray[i/3] = 0.2 + Math.random() * 0.5;
  }
  
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speedArray, 1));
  
  // Custom particle sprite (soft circle) to make them look like glowing orbs
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 248, 231, 1)'); // var(--gold-100)
  gradient.addColorStop(0.2, 'rgba(212, 165, 116, 0.8)'); // var(--gold-300)
  gradient.addColorStop(1, 'rgba(212, 165, 116, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const particleTexture = new THREE.CanvasTexture(canvas);
  
  const particlesMat = new THREE.PointsMaterial({
    size: 0.2,
    map: particleTexture,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlesMesh);

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    // Smooth, slow rotation of the geodesic sphere
    lines.rotation.y = time * 0.05;
    lines.rotation.x = time * 0.03;
    lines.rotation.z = time * 0.02;
    
    // Gentle floating effect for the structure
    centerGroup.position.y = Math.sin(time * 0.5) * 0.3;

    // Animate Particles
    const positions = particlesGeo.attributes.position.array;
    const speeds = particlesGeo.attributes.aSpeed.array;
    
    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // move up slowly
      positions[i3 + 1] += speeds[i] * 0.01;
      
      // gently sway x
      positions[i3] += Math.cos(time * 0.5 + i) * 0.005;
      
      // reset if too high
      if (positions[i3 + 1] > 10) {
        positions[i3 + 1] = -10;
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
