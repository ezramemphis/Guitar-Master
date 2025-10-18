// fireflies.js
const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 500);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const fireflyCount = 500;
const positions = new Float32Array(fireflyCount*3);
const velocities = [];

for(let i=0;i<fireflyCount;i++){
  positions[i*3] = (Math.random()-0.5)*60;
  positions[i*3+1] = (Math.random()-0.5)*30;
  positions[i*3+2] = (Math.random()-0.5)*60;
  velocities.push([(Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1]);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));

const material = new THREE.PointsMaterial({
  color: 0xffff88,
  size: 0.5,
  transparent: true,
  opacity: 0.9
});

const points = new THREE.Points(geometry, material);
scene.add(points);

function animate(){
  requestAnimationFrame(animate);
  const pos = geometry.attributes.position.array;
  for(let i=0;i<fireflyCount;i++){
    pos[i*3] += velocities[i][0];
    pos[i*3+1] += velocities[i][1];
    pos[i*3+2] += velocities[i][2];
    if(Math.abs(pos[i*3])>30) velocities[i][0]*=-1;
    if(Math.abs(pos[i*3+1])>15) velocities[i][1]*=-1;
    if(Math.abs(pos[i*3+2])>30) velocities[i][2]*=-1;
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
