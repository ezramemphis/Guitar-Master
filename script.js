
// Elements
const circleWrapper = document.querySelector('.circle-wrapper');
const circle = document.querySelector('.circle');
const container = document.querySelector('.container');
const sliderText = document.getElementById("sliderText");
const muteBtn = document.getElementById("muteBtn");
const diceBtn = document.getElementById("diceBtn");
const pauseBtn = document.getElementById("pauseBtn");
const songProgress = document.getElementById("songProgress");

// Audio State
let currentAudio = null;
let isMuted = localStorage.getItem("isMuted") === "true";
let hasActivated = false; // Idk why but removing this breaks the animation for the circle, for now this stays
let isPaused = false;

muteBtn.textContent = isMuted ? "🔇" : "🔈";

// SONG DATA
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

// Audio Functions
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




const songSelect = document.getElementById("songSelect");

// Populate dropdown
songs.forEach(songPath => {
  const option = document.createElement("option");
  option.value = songPath;
  option.textContent = songPath.split("/").pop().replace(".mp3", "");
  songSelect.appendChild(option);
});

// Handle song selection
songSelect.addEventListener("change", () => {
  const selectedSong = songSelect.value;
  if (!selectedSong) return;

  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(selectedSong);
  currentAudio.volume = isMuted ? 0 : 0.6;
  sliderText.textContent = selectedSong.split("/").pop().replace(".mp3", "");
  currentAudio.play();

  currentAudio.addEventListener("ended", playRandomSong);
  updateSlider();
});




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





// FIXED SMOOTH ROTATION (fixing for after left slide, works nicely)
let isSliding = false;
let rotationX = 0;
let rotationY = 0;
let targetX = 0, targetY = 0;
let mouseX = 0, mouseY = 0;

// Track mouse globally (make the vinyl look at the mouse)
document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Stable rotation using requestAnimationFrame
function smoothRotate() {
  if (hasActivated && !isSliding) {
    const rect = circleWrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const xNorm = (mouseX - cx) / (rect.width / 2);
    const yNorm = (mouseY - cy) / (rect.height / 2);

    targetX = -9 * yNorm;
    targetY = 9 * xNorm;

    rotationX += (targetX - rotationX) * 0.1;
    rotationY += (targetY - rotationY) * 0.1;

    circle.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }

  requestAnimationFrame(smoothRotate);
}
smoothRotate();










// Song progress and controls
function updateSlider() {
  if (!currentAudio || isPaused) return;

  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  if (!isNaN(percent)) songProgress.value = percent;

  sliderText.style.transform = `translateX(${100 - percent * 2}%)`;
  requestAnimationFrame(updateSlider);
}






// CALENDAR

const calendarBtn = document.getElementById("calendarBtn");
const calendarOverlay = document.getElementById("calendarOverlay");
const closeCalendar = document.getElementById("closeCalendar");
const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let calendarDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Set header text
  calendarTitle.textContent = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  // First day of month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarGrid.innerHTML = "";

  // Empty placeholders
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += `<div class="calendar-empty"></div>`;
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.textContent = day;

    cell.addEventListener("click", () => {
      // Load clicked date into your journal
      const selected = new Date(year, month, day);
      loadDate(selected);
      calendarOverlay.style.display = "none";
      overlay.style.display = "flex";
    });

    calendarGrid.appendChild(cell);
  }
}

// Open calendar
calendarBtn.addEventListener("click", () => {
  calendarOverlay.style.display = "flex";
  renderCalendar(calendarDate);
});

// Close calendar
closeCalendar.addEventListener("click", () => {
  calendarOverlay.style.display = "none";
});

// Navigation
prevMonthBtn.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar(calendarDate);
});

nextMonthBtn.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar(calendarDate);
});









// --------------- PRACTICE TIME TRACKER ----------------
function getExerciseType() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("scale")) return "scales";
  if (path.includes("arpeggio")) return "arpeggios";
  if (path.includes("chord")) return "chords";
  return null;
}

let exercise = getExerciseType();
let startTime = exercise ? Date.now() : null;

function loadSeconds(exType) {
  return parseInt(localStorage.getItem(`seconds-${exType}`) || "0");
}

function saveSeconds(exType, seconds) {
  localStorage.setItem(`seconds-${exType}`, seconds);
}

// Convert seconds to HH:MM:SS
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

// --- Real-time counting ---
if (exercise) {
  setInterval(() => {
    const now = Date.now();
    const secondsSpent = Math.floor((now - startTime) / 1000);
    if (secondsSpent > 0) {
      const oldSeconds = loadSeconds(exercise);
      saveSeconds(exercise, oldSeconds + secondsSpent);
      startTime = Date.now(); // reset startTime
      updatePracticeStats(); // update the overlay in real-time
    }
  }, 1000); // every second
}

// --- Save remaining time on page unload ---
window.addEventListener("beforeunload", () => {
  if (!exercise || !startTime) return;

  const endTime = Date.now();
  const secondsSpent = Math.floor((endTime - startTime) / 1000);

  if (secondsSpent > 0) {
    const oldSeconds = loadSeconds(exercise);
    saveSeconds(exercise, oldSeconds + secondsSpent);
  }
});


// --- Update Practice Log stats ---
function updatePracticeStats() {
  document.getElementById("scalesMinutes").textContent =
    formatTime(loadSeconds("scales"));

  document.getElementById("arpeggiosMinutes").textContent =
    formatTime(loadSeconds("arpeggios"));

  document.getElementById("chordsMinutes").textContent =
    formatTime(loadSeconds("chords"));
}

// --- Show overlay and update stats ---
const journalBtn = document.getElementById("journalBtn");
const overlay = document.getElementById("practiceLogOverlay");

journalBtn.addEventListener("click", () => {
  updatePracticeStats();
  overlay.style.display = "flex";
});
