const circleWrapper = document.querySelector('.circle-wrapper');
const circle = document.querySelector('.circle');
const container = document.querySelector('.container');
const sliderText = document.getElementById("sliderText");
const muteBtn = document.getElementById("muteBtn");
const diceBtn = document.getElementById("diceBtn");

let currentAudio = null;
let isMuted = localStorage.getItem("isMuted")==="true";
let hasActivated = false;

muteBtn.textContent = isMuted?"🔇":"🔈";

// Music functions
const songs = [
  "music/All For Nothing - Zachariehs.mp3",
  "music/a way out - my head is empty.mp3",
  "music/Redemption Arc - Zachariehs.mp3",
  "music/home - .diedlonely.mp3"
];

function playRandomSong(){
  if(currentAudio) currentAudio.pause();
  const random = songs[Math.floor(Math.random()*songs.length)];
  currentAudio = new Audio(random);
  currentAudio.volume = isMuted?0:0.6;
  sliderText.textContent = random.split("/").pop().replace(".mp3","");
  currentAudio.play();
  currentAudio.addEventListener("ended", playRandomSong);
}

function toggleMute(){
  isMuted = !isMuted;
  muteBtn.textContent = isMuted?"🔇":"🔈";
  localStorage.setItem("isMuted", isMuted);
  if(currentAudio) currentAudio.volume = isMuted?0:0.6;
}

function rollDice(){ playRandomSong(); }

muteBtn.addEventListener("click", toggleMute);
diceBtn.addEventListener("click", rollDice);

// Click circle to activate panel
circleWrapper.addEventListener("click", ()=>{
  if(!hasActivated){
    container.classList.add("active");
    playRandomSong();
    hasActivated = true;
  }
});





// Mouse rotation
document.addEventListener("mousemove", (e)=>{
  if(!hasActivated) return;
  const rect = circleWrapper.getBoundingClientRect();
  const centerX = rect.left+rect.width/2;
  const centerY = rect.top+rect.height/2;
  const xNorm = (e.clientX-centerX)/(rect.width/2);
  const yNorm = (e.clientY-centerY)/(rect.height/2);
  circle.style.transform = `rotateX(${-7*yNorm}deg) rotateY(${7*xNorm}deg)`;
});




const pauseBtn = document.getElementById('pauseBtn');
const songProgress = document.getElementById('songProgress');
let isPaused = false;

// Update slider as the song plays
function updateSlider() {
  if (!currentAudio) return;
  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  if (!isNaN(percent)) songProgress.value = percent;

  // Move slider text based on progress
  sliderText.style.transform = `translateX(${100 - percent * 2}%)`;

  if (!isPaused) requestAnimationFrame(updateSlider);
}

// Pause/play toggle
pauseBtn.addEventListener('click', () => {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
    pauseBtn.textContent = '⏸';
    isPaused = false;
    updateSlider();
  } else {
    currentAudio.pause();
    pauseBtn.textContent = '▶️';
    isPaused = true;
  }
});

// Scrubbing
songProgress.addEventListener('input', () => {
  if (!currentAudio) return;
  const seekTime = (songProgress.value / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;

  // Move slider text immediately
  sliderText.style.transform = `translateX(${100 - songProgress.value * 2}%)`;
});




// ================================
// Sci-Fi Cursor with Laser Trail
// ================================

document.addEventListener("DOMContentLoaded", () => {
  // Create main cursor
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  // Create trail dots
  const trailCount = 10;
  const trails = [];
  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement("div");
    dot.className = "laser-trail";
    document.body.appendChild(dot);
    trails.push(dot);
  }

  let mouseX = 0, mouseY = 0;
  const trailPos = Array(trailCount).fill({ x: 0, y: 0 });

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 7}px, ${mouseY - 7}px)`;
  });

  function animate() {
    let prevX = mouseX;
    let prevY = mouseY;
    trails.forEach((dot, i) => {
      const x = trailPos[i]?.x || prevX;
      const y = trailPos[i]?.y || prevY;
      const lerpX = x + (prevX - x) * 0.2;
      const lerpY = y + (prevY - y) * 0.2;
      dot.style.transform = `translate(${lerpX - 4}px, ${lerpY - 4}px)`;
      trailPos[i] = { x: lerpX, y: lerpY };
      prevX = lerpX;
      prevY = lerpY;
    });
    requestAnimationFrame(animate);
  }
  animate();
});

