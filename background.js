const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();

// Ethereal fog
scene.fog = new THREE.FogExp2(0x040611, 0.045);

// Camera setup
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 10, 40);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x02030a, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

// Lights
const mainLight = new THREE.PointLight(0x66ccff, 2, 200);
mainLight.position.set(0, 25, 0);
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xaa66ff, 0.6, 200);
fillLight.position.set(30, 10, 30);
scene.add(fillLight);

const ambient = new THREE.AmbientLight(0x446688, 0.3);
scene.add(ambient);

// Floating crystals
const crystalGroup = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const geom = new THREE.TetrahedronGeometry(Math.random() * 1.2 + 0.3);
  const hue = 180 + Math.random() * 120;
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(`hsl(${hue}, 100%, 60%)`),
    emissive: new THREE.Color(`hsl(${hue}, 100%, 50%)`),
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const crystal = new THREE.Mesh(geom, mat);
  crystal.position.set(
    (Math.random() - 0.5) * 100,
    Math.random() * 40 - 10,
    (Math.random() - 0.5) * 100
  );
  crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  crystalGroup.add(crystal);
}
scene.add(crystalGroup);

// Spirit particles
const particles = new THREE.Group();
for (let i = 0; i < 600; i++) {
  const geom = new THREE.SphereGeometry(0.08, 6, 6);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(`hsl(${180 + Math.random() * 120}, 100%, 70%)`),
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const p = new THREE.Mesh(geom, mat);
  p.position.set((Math.random() - 0.5) * 150, Math.random() * 60 - 20, (Math.random() - 0.5) * 150);
  particles.add(p);
}
scene.add(particles);

// Liquid energy surface (undulating plane)
const surfaceGeom = new THREE.PlaneGeometry(200, 200, 80, 80);
const surfaceMat = new THREE.MeshStandardMaterial({
  color: 0x111133,
  emissive: 0x00ccff,
  emissiveIntensity: 0.5,
  wireframe: true,
  transparent: true,
  opacity: 0.4
});
const surface = new THREE.Mesh(surfaceGeom, surfaceMat);
surface.rotation.x = -Math.PI / 2;
surface.position.y = -5;
scene.add(surface);

// Animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.015;

  // Crystals shimmer & float
  crystalGroup.children.forEach((c, i) => {
    c.rotation.x += 0.002 + Math.sin(time + i) * 0.001;
    c.rotation.y += 0.003;
    c.position.y += Math.sin(time * 0.6 + i) * 0.02;

    const hueShift = (Math.sin(time + i * 0.2) * 30 + 180) / 360;
    c.material.emissive.setHSL(hueShift, 1, 0.6);
  });

  // Ripple surface (modern geometry update)
  const pos = surface.geometry.attributes.position;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = Math.sin(x * 0.15 + time) * 1.2 + Math.cos(y * 0.1 + time * 0.8) * 1.2;
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;

  // Spirit particles drift
  particles.children.forEach((p, i) => {
    p.position.y += Math.sin(time * 0.5 + i) * 0.02;
    p.position.x += Math.cos(time * 0.3 + i) * 0.002;
    p.material.opacity = 0.1 + Math.sin(time + i) * 0.05;
  });

  // Gentle camera movement
  camera.position.x = Math.sin(time * 0.1) * 20;
  camera.position.z = Math.cos(time * 0.1) * 40;
  camera.lookAt(0, 0, 0);

  // Fog breathing
  scene.fog.density = 0.04 + Math.sin(time * 0.2) * 0.01;

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
