// ================================
// ELEMENTS
// ================================
const circleWrapper = document.querySelector('.circle-wrapper');
const circle = document.querySelector('.circle');
const container = document.querySelector('.container');
const sliderText = document.getElementById("sliderText");
const muteBtn = document.getElementById("muteBtn");
const diceBtn = document.getElementById("diceBtn");
const pauseBtn = document.getElementById("pauseBtn");
const songProgress = document.getElementById("songProgress");

// ================================
// AUDIO STATE
// ================================
let currentAudio = null;
let isMuted = localStorage.getItem("isMuted") === "true";
let hasActivated = false;
let isPaused = false;

muteBtn.textContent = isMuted ? "🔇" : "🔈";

// ================================
// SONG DATA
// ================================
const songs = [
  "music/All For Nothing - Zachariehs.mp3",
  "music/a way out - my head is empty.mp3",
  "music/Redemption Arc - Zachariehs.mp3",
  "music/the day when happiness faded away - .diedlonely.mp3",
  "music/does it ever get better? - Lonnex.mp3",
  "music/home - .diedlonely.mp3",
  "music/losing - Lonnex.mp3",
  "music/i think i love you - Money Flip.mp3",
  "music/Ethereal (Slowed) - Money Flip.mp3",
  "music/snowfall - Øneheart.mp3",
  "music/Gods creation - daniel.mp3.mp3",
  "music/green to blue (slowed  reverbed) - daniel.mp3.mp3",
  "music/3 am walk (Slowed & Reverb Version) - daniel.mp3.mp3",
  "music/stellar - .diedlonely.mp3",
  "music/keep your warmth - Antent.mp3",
  "music/Do Not Be Afraid - Zacharies.mp3",
  "music/i was only temporary - my head is empty.mp3",
  "music/falling back - vultu.mp3",
  "music/dark snowy night - daniel.mp3.mp3",
  "music/Fr3sh - Kareem Lotfy.mp3"
];

// ================================
// AUDIO FUNCTIONS
// ================================
function playRandomSong() {
  if (currentAudio) currentAudio.pause();

  const random = songs[Math.floor(Math.random() * songs.length)];
  currentAudio = new Audio(random);
  currentAudio.volume = isMuted ? 0 : 0.6;
  sliderText.textContent = random.split("/").pop().replace(".mp3", "");
  currentAudio.play();

  currentAudio.addEventListener("ended", playRandomSong);
  updateSlider();
}

function toggleMute() {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔈";
  localStorage.setItem("isMuted", isMuted);
  if (currentAudio) currentAudio.volume = isMuted ? 0 : 0.6;
}

function rollDice() {
  playRandomSong();
}

muteBtn.addEventListener("click", toggleMute);
diceBtn.addEventListener("click", rollDice);

// ================================
// ACTIVATE / TOGGLE PANEL
// ================================
circleWrapper.addEventListener("click", () => {
  container.classList.toggle("active");
  hasActivated = true; // once clicked, we consider it "activated"

  // Only play music if it's not already playing
  if (!currentAudio) {
    setTimeout(() => playRandomSong(), 850);
  }
});


// ================================
// FIXED SMOOTH ROTATION
// ================================
let isSliding = false;
let rotationX = 0;
let rotationY = 0;

// Prevent jump during glide
circleWrapper.addEventListener("transitionstart", e => {
  if (["left", "transform"].includes(e.propertyName)) isSliding = true;
});
circleWrapper.addEventListener("transitionend", e => {
  if (["left", "transform"].includes(e.propertyName)) isSliding = false;
});

// Stable rotation using requestAnimationFrame
let targetX = 0, targetY = 0;
document.addEventListener("mousemove", e => {
  if (!hasActivated || isSliding) return;
  const rect = circleWrapper.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const xNorm = (e.clientX - cx) / (rect.width / 2);
  const yNorm = (e.clientY - cy) / (rect.height / 2);
  targetX = -9 * yNorm;
  targetY = 9 * xNorm;
});

function smoothRotate() {
  rotationX += (targetX - rotationX) * 0.1;
  rotationY += (targetY - rotationY) * 0.1;
  circle.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  requestAnimationFrame(smoothRotate);
}
smoothRotate();

// ================================
// SONG PROGRESS + CONTROLS
// ================================
function updateSlider() {
  if (!currentAudio || isPaused) return;

  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  if (!isNaN(percent)) songProgress.value = percent;

  sliderText.style.transform = `translateX(${100 - percent * 2}%)`;
  requestAnimationFrame(updateSlider);
}

pauseBtn.addEventListener("click", () => {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
    pauseBtn.textContent = "⏸";
    isPaused = false;
    updateSlider();
  } else {
    currentAudio.pause();
    pauseBtn.textContent = "▶️";
    isPaused = true;
  }
});

songProgress.addEventListener("input", () => {
  if (!currentAudio) return;
  const seekTime = (songProgress.value / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;
  sliderText.style.transform = `translateX(${100 - songProgress.value * 2}%)`;
});

// ================================
// SCI-FI CURSOR TRAIL
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

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

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 7}px, ${mouseY - 7}px)`;
  });

  function animateTrail() {
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
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
});
