// nebula.js
const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050020);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = 70;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Particles Cloud ---
const cloudGroup = new THREE.Group();
scene.add(cloudGroup);

const particleCount = 2500;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i*3] = (Math.random() - 0.5) * 100;
  positions[i*3 + 1] = (Math.random() - 0.5) * 60;
  positions[i*3 + 2] = (Math.random() - 0.5) * 100;

  const hue = 250 + Math.random() * 40;
  const color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);
  colors[i*3] = color.r;
  colors[i*3+1] = color.g;
  colors[i*3+2] = color.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.3,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
});

const cloudParticles = new THREE.Points(geometry, material);
cloudGroup.add(cloudParticles);

// --- Animate ---
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;
  cloudGroup.rotation.y = t * 0.02;
  cloudGroup.rotation.x = Math.sin(t*0.1) * 0.1;
  camera.position.x = Math.sin(t*0.02)*15;
  camera.position.y = Math.sin(t*0.01)*8;
  camera.lookAt(0,0,0);
  renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
