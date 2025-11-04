// --------------------- //
// 🎵 CHORD GENERATOR JS //
// --------------------- //

// 🎵 ENHARMONICS WITH PREFERRED SPELLINGS
const ENHARMONICS = [
  ["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E", "Fb"], ["F", "E#"],
  ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]
];

const NOTE_TO_SEMITONE = ENHARMONICS.reduce((acc, group, i) => {
  group.forEach(n => acc[n] = i);
  return acc;
}, {});

// -------------------- //
// 🎶 CHORD LEVEL POOLS //
// -------------------- //

const LEVEL_CHORDS = {
  1: [
    "Maj7 (6)", "Maj7 (5)", "Dom7 (6)", "Dom7 (5)",
    "Min7 (6)", "Min7 (5)", "Min7b5 (6)", "Min7b5 (5)",
    "Dim7 (6)", "Dim7 (5)", "Dom7sus4 (6)", "Dom7sus4 (5)",
    "7#5 (6)", "7#5 (5)", "Maj6 (6)", "Maj6 (5)",
    "Min6 (6)", "Min6 (5)", "Min9 (6)", "Min9 (5)",
    "Dom9 (6)", "Dom9 (5)", "7b9 (6)", "7b9 (5)",
    "7#9 (6)", "7#9 (5)", "Dom13 (6)", "Dom13 (5)"
  ],
  2: [
    "Min(Maj7)", "Maj7#5", "Maj7(b5)", "Min7(#5)",
    "7(b5)", "Dim(maj7)", "Maj9/7", "Maj9/6",
    "Min9(Maj7)", "7b9b13", "13b9", "9(b13)"
  ],
  3: [
    "Maj7 (6)", "Maj7 (5)", "Dom7 (6)", "Dom7 (5)",
    "Min7 (6)", "Min7 (5)", "Min7b5 (6)", "Min7b5 (5)",
    "Dim7 (6)", "Dim7 (5)", "Dom7sus4 (6)", "Dom7sus4 (5)",
    "7#5 (6)", "7#5 (5)", "Maj6 (6)", "Maj6 (5)",
    "Min6 (6)", "Min6 (5)", "Min9 (6)", "Min9 (5)",
    "Dom9 (6)", "Dom9 (5)", "7b9 (6)", "7b9 (5)",
    "7#9 (6)", "7#9 (5)", "Dom13 (6)", "Dom13 (5)"
  ],
  4: [
    "Min(Maj7)", "Maj7#5", "Maj7(b5)", "Min7(#5)",
    "7(b5)", "Dim(maj7)", "Maj9/7", "Maj9/6",
    "Min9(Maj7)", "7b9b13", "13b9", "9(b13)"
  ]
};

// --------------------- //
// 🎲 GLOBAL LEVEL SET   //
// --------------------- //
let currentLevel = 1;

// --------------------- //
// 🎲 RANDOM CHORD GEN   //
// --------------------- //
function randomChord(level = currentLevel) {
  const chordPool = LEVEL_CHORDS[level] || LEVEL_CHORDS[1];
  const chordType = chordPool[Math.floor(Math.random() * chordPool.length)];
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const chordName = `${root} ${chordType}`;
  const notes = getChordNotes(root, chordType);
  return { name: chordName, notes: notes.join(" - ") };
}

// --------------------- //
// 🎸 CHORD NOTE BUILDER //
// --------------------- //
function getChordNotes(root, type) {
  const rootIndex = NOTE_TO_SEMITONE[root];
  const steps = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    "7": [0, 4, 7, 10],
    m7: [0, 3, 7, 10],
    maj7: [0, 4, 7, 11]
  };
  const base = Object.keys(steps).find(k => type.toLowerCase().includes(k)) || "maj";
  const semis = steps[base];
  return semis.map(s => ENHARMONICS[(rootIndex + s) % 12][0]);
}

// ---------------------------- //
// ⚙️ DOM + Auto Mode + Timer   //
// ---------------------------- //
let timerInterval = null;
let remainingTime = 0;
let totalTime = 5;

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("chord-output");
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

    const data = randomChord();
    output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
    updateTimerVisual();

    timerInterval = setInterval(() => {
      remainingTime -= 0.1;
      if (remainingTime <= 0) {
        const data = randomChord();
        output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
        remainingTime = totalTime;
      }
      updateTimerVisual();
    }, 100);
  };

  genBtn.addEventListener("click", () => {
    const data = randomChord();
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
  if (sheetTab && sheetContainer) {
    sheetTab.addEventListener('click', () => {
      sheetContainer.classList.toggle('open');
    });
  }

  // ------------------- //
  // 🌈 Rainbow Toggle   //
  // ------------------- //
  const toggleBtn = document.getElementById('toggleRainbow');
  const exerciseContainer = document.querySelector('.exercise-container');
  if (toggleBtn && exerciseContainer) {
    toggleBtn.classList.add('off');
    toggleBtn.addEventListener('click', () => {
      exerciseContainer.classList.toggle('rainbow');
      const isOn = exerciseContainer.classList.contains('rainbow');
      toggleBtn.classList.toggle('on', isOn);
      toggleBtn.classList.toggle('off', !isOn);
    });
  }
});
