// --------------------- //
// 🎵 SCALE GENERATOR JS //
// --------------------- //

// 🎵 ENHARMONICS WITH PREFERRED SPELLINGS
const ENHARMONICS = [
  ["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E", "Fb"], ["F", "E#"],
  ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]
];

const LETTERS = ["C","D","E","F","G","A","B"];
const NOTE_TO_SEMITONE = ENHARMONICS.reduce((acc, group, i) => {
  group.forEach(n => acc[n] = i);
  return acc;
}, {});

// 🎵 LEVEL SCALE POOLS
const LEVEL_SCALES = {
  1: ["Ionian","Dorian","Phrygian","Lydian","Mixolydian","Aeolian","Locrian"],
  2: ["Melodic Minor","Dorian b2","Lydian Augmented","Lydian b7","Mixolydian b6","Aeolian b5","Altered"],
  3: ["Harmonic Minor","Locrian natural 6","Ionian #5","Dorian #4","Phrygian Major","Lydian #2","Altered dim 7"],
  4: ["Harmonic Major","Dorian b5","Phrygian b4","Lydian diminished","Mixolydian b2","Lydian Augmented #2","Locrian dim 7"]
};

// 🎵 SCALE INTERVALS
const MODE_INTERVALS = {
  "Ionian": [2,2,1,2,2,2,1],
  "Dorian": [2,1,2,2,2,1,2],
  "Phrygian": [1,2,2,2,1,2,2],
  "Lydian": [2,2,2,1,2,2,1],
  "Mixolydian": [2,2,1,2,2,1,2],
  "Aeolian": [2,1,2,2,1,2,2],
  "Locrian": [1,2,2,1,2,2,2],

  "Melodic Minor": [2,1,2,2,2,2,1],
  "Dorian b2": [1,2,2,2,2,1,2],
  "Lydian Augmented": [2,2,2,2,1,2,1],
  "Lydian b7": [2,2,2,1,2,1,2],
  "Mixolydian b6": [2,2,1,2,1,2,2],
  "Aeolian b5": [2,1,2,1,2,2,2],
  "Altered": [1,2,1,2,2,2,2],

  "Harmonic Minor": [2,1,2,2,1,3,1],
  "Locrian natural 6": [1,2,2,1,2,2,2],
  "Ionian #5": [2,2,1,2,3,1,1],
  "Dorian #4": [2,1,3,1,2,2,1],
  "Phrygian Major": [1,3,1,2,2,1,2],
  "Lydian #2": [3,1,2,2,2,1,1],
  "Altered dim 7": [1,2,1,2,1,3,2],

  "Harmonic Major": [2,2,1,2,1,3,1],
  "Dorian b5": [2,1,2,1,2,2,2],
  "Phrygian b4": [1,2,1,2,2,2,2],
  "Lydian diminished": [2,2,1,1,2,2,2],
  "Mixolydian b2": [1,2,2,1,2,1,3],
  "Lydian Augmented #2": [3,1,2,2,1,2,2],
  "Locrian dim 7": [1,2,1,2,1,2,3]
};

// --------------------- //
// 🎲 GLOBAL LEVEL SET   //
// --------------------- //
let currentLevel = 1;

// 🎲 HELPER: Find note in ENHARMONICS by letter
function pickNoteByLetter(semitone, letter) {
  const group = ENHARMONICS[semitone];
  const note = group.find(n => n[0].toUpperCase() === letter);
  return note || group[0];
}

// 🎲 GENERATE SCALE (full-proof consecutive letters)
function generateScale(root, mode) {
  const intervals = MODE_INTERVALS[mode] || [2,2,1,2,2,2,1];
  let semitone = NOTE_TO_SEMITONE[root];
  let scale = [root];
  let letterIndex = LETTERS.indexOf(root[0].toUpperCase());

  for (let i = 0; i < intervals.length; i++) {
    semitone = (semitone + intervals[i]) % 12;
    letterIndex = (letterIndex + 1) % 7;
    const nextLetter = LETTERS[letterIndex];
    scale.push(pickNoteByLetter(semitone, nextLetter));
  }

  scale[scale.length - 1] = root; // octave match
  return scale;
}

// 🎲 RANDOM SCALE
function randomScale(level = currentLevel) {
  const modePool = LEVEL_SCALES[level] || LEVEL_SCALES[1];
  const mode = modePool[Math.floor(Math.random() * modePool.length)];
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const scale = generateScale(root, mode);
  return { name: `${root} ${mode}`, notes: scale.join(" - ") };
}

















// ---------------------------- //
// ⚙️ DOM + Auto Mode + Timer   //
// ---------------------------- //
let timerInterval = null;
let remainingTime = 0;
let totalTime = 5;

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("scale-output");
  const genBtn = document.getElementById("generate-btn");
  const autoBtn = document.getElementById("autoBtn");
  const intervalInput = document.getElementById("intervalInput");
  const timerText = document.getElementById("timer-text");
  const timerCircle = document.querySelector(".timer-progress");
  const fullDash = 283;

  const updateTimerVisual = () => {
    const seconds = Math.max(0, Math.ceil(remainingTime));
    timerText.textContent = seconds;
    const offset = fullDash * (1 - remainingTime / totalTime);
    timerCircle.style.strokeDashoffset = offset;
  };

  const startAutoMode = (seconds) => {
    clearInterval(timerInterval);
    totalTime = seconds;
    remainingTime = seconds;

    // first scale immediately
    const data = randomScale();
    output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
    updateTimerVisual();

    timerInterval = setInterval(() => {
      remainingTime -= 0.1;
      if (remainingTime <= 0) {
        const data = randomScale();
        output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
        remainingTime = totalTime;
      }
      updateTimerVisual();
    }, 100);
  };

  genBtn.addEventListener("click", () => {
    const data = randomScale();
    output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
  });

  autoBtn.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerCircle.style.strokeDashoffset = fullDash;
      autoBtn.textContent = "▶ Start Auto";
    } else {
      const seconds = Math.max(1, parseFloat(intervalInput.value) || 5);
      startAutoMode(seconds);
      autoBtn.textContent = "⏸ Stop Auto";
    }
  });

  // ------------------- //
  // 🕓 Metronome Setup  //
  // ------------------- //
  const tempoInput = document.getElementById("tempoInput");
  const soundSelect = document.getElementById("metroSound");
  const metroBtn = document.getElementById("metroToggle");
  let metroInterval = null;
  let click = new Audio(`../../assets/sounds/metronome1.wav`);

  const playClick = () => {
    click.currentTime = 0;
    click.play();
  };

  metroBtn.addEventListener("click", () => {
    if (metroInterval) {
      clearInterval(metroInterval);
      metroInterval = null;
      metroBtn.textContent = "Start";
    } else {
      click = new Audio(`../../assets/sounds/metronome${soundSelect.value}.wav`);
      const bpm = Math.max(30, parseInt(tempoInput.value) || 100);
      const interval = (60 / bpm) * 1000;
      playClick();
      metroInterval = setInterval(playClick, interval);
      metroBtn.textContent = "Stop";
    }
  });

  // ------------------- //
  // 📝 Sheet Music Toggle //
  // ------------------- //
  const sheetTab = document.querySelector('.sheet-tab');
  const sheetContainer = document.querySelector('.sheet-container');
  if(sheetTab && sheetContainer) {
    sheetTab.addEventListener('click', () => {
      sheetContainer.classList.toggle('open');
    });
  }

  // ------------------- //
  // 🌈 Rainbow Toggle   //
  // ------------------- //
  const toggleBtn = document.getElementById('toggleRainbow');
  const exerciseContainer = document.querySelector('.exercise-container');
  if(toggleBtn && exerciseContainer) {
    toggleBtn.classList.add('off');
    toggleBtn.addEventListener('click', () => {
      exerciseContainer.classList.toggle('rainbow');
      const isOn = exerciseContainer.classList.contains('rainbow');
      toggleBtn.classList.toggle('on', isOn);
      toggleBtn.classList.toggle('off', !isOn);
    });
  }
});
