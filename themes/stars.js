const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = 60;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Hypnotic Spiral Vortex --- //
const vortexGroup = new THREE.Group();
scene.add(vortexGroup);

const vortexCount = 2000;
const positions = new Float32Array(vortexCount * 3);
const colors = new Float32Array(vortexCount * 3);

for (let i = 0; i < vortexCount; i++) {
    const angle = Math.random() * Math.PI * 12; // many twists
    const radius = Math.random() * 40;
    const height = (Math.random() - 0.5) * 60;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const hue = 180 + Math.random() * 60;
    const color = new THREE.Color(`hsl(${hue}, 100%, 70%)`);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.15,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
});

const vortexPoints = new THREE.Points(geometry, material);
vortexGroup.add(vortexPoints);

// --- Animate --- //
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate vortex for hypnotic effect
    vortexGroup.rotation.y += 0.003;
    vortexGroup.rotation.x += 0.001;

    // Camera subtle drift
    camera.position.x = Math.sin(time * 0.03) * 20;
    camera.position.y = Math.sin(time * 0.015) * 10;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();

// --- Resize Handling --- //
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
