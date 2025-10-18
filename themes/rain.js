// rain.js
const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 500);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const rainCount = 2000;
const positions = new Float32Array(rainCount*3);

for(let i=0;i<rainCount;i++){
  positions[i*3] = (Math.random()-0.5)*50;
  positions[i*3+1] = Math.random()*80;
  positions[i*3+2] = (Math.random()-0.5)*50;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x88ccff,
  size: 0.1,
  transparent: true,
  opacity: 0.7
});

const rain = new THREE.Points(geometry, material);
scene.add(rain);

function animate() {
  requestAnimationFrame(animate);
  const pos = geometry.attributes.position.array;
  for(let i=0;i<rainCount;i++){
    pos[i*3+1] -= 0.5;
    if(pos[i*3+1]<-10) pos[i*3+1]=50;
  }
  geometry.attributes.position.needsUpdate = true;
  camera.lookAt(0,0,0);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
