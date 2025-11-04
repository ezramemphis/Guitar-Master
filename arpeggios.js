// --------------------- //
// 🎵 ARPEGGIO GENERATOR //
// --------------------- //

// 🎵 ENHARMONICS
const ENHARMONICS = [
  ["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E", "Fb"], ["F", "E#"],
  ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]
];

const NOTE_TO_SEMITONE = ENHARMONICS.reduce((acc, group, i) => {
  group.forEach(n => acc[n] = i);
  return acc;
}, {});

// ---------------------- //
// 🧭 LEVEL ARPEGGIO POOLS //
// ---------------------- //
const LEVEL_ARPEGGIOS = {
  1: [
    "Maj7", "Min7", "Dom7", "Min7b5",
    "Dom7sus4", "7#5", "Dim7 (1 octave from root)"
  ],
  2: [
    "Min(Maj7)", "Maj7#5", "Maj7b5", "Min7#5",
    "7b5", "Dim(Maj7) (1 octave from root)"
  ],
  3: [
    "Maj7", "Min7", "Dom7", "Min7b5",
    "Dom7sus4", "7#5", "Dim7 (1 octave from any chord tone)"
  ],
  4: [
    "Min(Maj7)", "Maj7#5", "Maj7b5", "Min7#5",
    "7b5", "Dim(Maj7) (1 octave from any chord tone)"
  ]
};

// --------------------- //
// 🎯 GLOBAL LEVEL SET   //
// --------------------- //
let currentLevel = 1;

// ----------------------------- //
// 🎲 RANDOM ARPEGGIO GENERATOR //
// ----------------------------- //
function randomArpeggio(level = currentLevel) {
  const pool = LEVEL_ARPEGGIOS[level] || LEVEL_ARPEGGIOS[1];
  const type = pool[Math.floor(Math.random() * pool.length)];
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const notes = getArpeggioNotes(root, type);
  return { name: `${root} ${type} arpeggio`, notes: notes.join(" - ") };
}

// --------------------- //
// 🎶 NOTE CONSTRUCTION  //
// --------------------- //
function getArpeggioNotes(root, type) {
  const rootIndex = NOTE_TO_SEMITONE[root];
  const steps = {
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    min7b5: [0, 3, 6, 10],
    dom7sus4: [0, 5, 7, 10],
    "7#5": [0, 4, 8, 10],
    dim7: [0, 3, 6, 9],
    "min(maj7)": [0, 3, 7, 11],
    "maj7#5": [0, 4, 8, 11],
    "maj7b5": [0, 4, 6, 11],
    "min7#5": [0, 3, 8, 10],
    "7b5": [0, 4, 6, 10],
    "dim(maj7)": [0, 3, 6, 11]
  };

  // Find matching interval set
  const match = Object.keys(steps).find(k =>
    type.toLowerCase().includes(k.replace(/[()]/g, ""))
  );

  const semis = steps[match] || steps.maj7;
  return semis.map(s => ENHARMONICS[(rootIndex + s) % 12][0]);
}

// ---------------------------- //
// ⚙️ DOM + Auto Mode + Timer   //
// ---------------------------- //
let timerInterval = null;
let remainingTime = 0;
let totalTime = 5;

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("arpeggio-output");
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

    const data = randomArpeggio();
    output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
    updateTimerVisual();

    timerInterval = setInterval(() => {
      remainingTime -= 0.1;
      if (remainingTime <= 0) {
        const data = randomArpeggio();
        output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
        remainingTime = totalTime;
      }
      updateTimerVisual();
    }, 100);
  };

  genBtn.addEventListener("click", () => {
    const data = randomArpeggio();
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
