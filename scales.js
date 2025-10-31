// --------------------- //
// 🎵 SCALE GENERATOR JS //
// --------------------- //

const ENHARMONICS = [
  ["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E", "Fb"], ["F", "E#"],
  ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]
];
const MODES = ["Ionian","Dorian","Phrygian","Lydian","Mixolydian","Aeolian","Locrian"];
const MODE_INTERVALS = {
  Ionian:[2,2,1,2,2,2,1], Dorian:[2,1,2,2,2,1,2], Phrygian:[1,2,2,2,1,2,2],
  Lydian:[2,2,2,1,2,2,1], Mixolydian:[2,2,1,2,2,1,2],
  Aeolian:[2,1,2,2,1,2,2], Locrian:[1,2,2,1,2,2,2]
};

// Generate scale with enharmonic logic
function generateScale(root, mode) {
  const intervals = MODE_INTERVALS[mode];
  const startIndex = ENHARMONICS.findIndex(group => group.includes(root));
  let scale = [root];
  let current = startIndex;
  for (let i = 0; i < intervals.length; i++) {
    current = (current + intervals[i]) % ENHARMONICS.length;
    const prevLetter = scale[i][0];
    const nextNote = ENHARMONICS[current].find(n => n[0] !== prevLetter) || ENHARMONICS[current][0];
    scale.push(nextNote);
  }
  return scale;
}

function randomScale() {
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const mode = MODES[Math.floor(Math.random() * MODES.length)];
  const scale = generateScale(root, mode);
  const degree = Math.floor(Math.random() * 7) + 1;
  const degRoot = scale[degree - 1];
  const degreeText = Math.random() < 0.5 ? "" : ` starting on the ${ordinal(degree)} degree (${degRoot})`;
  return { name: `${root} ${mode}${degreeText}`, notes: scale.join(" - ") };
}
function ordinal(n){return n+(["st","nd","rd"][((n+90)%100-10)%10-1]||"th");}

// ---------------------------- //
// ⚙️ DOM + Auto Mode + Timer   //
// ---------------------------- //

let autoInterval = null;
let timerInterval = null;
let remainingTime = 0;

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

  let totalTime = parseFloat(intervalInput.value);

  const startTimer = (seconds) => {
    totalTime = seconds;
    remainingTime = seconds;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      remainingTime -= 0.1;
      updateTimerVisual();
      if (remainingTime <= 0) remainingTime = seconds;
    }, 100);
  };

  genBtn.addEventListener("click", () => {
    const data = randomScale();
    output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
  });

  autoBtn.addEventListener("click", () => {
    if (autoInterval) {
      clearInterval(autoInterval);
      clearInterval(timerInterval);
      autoInterval = null;
      timerCircle.style.strokeDashoffset = 283;
      autoBtn.textContent = "▶ Start Auto";
    } else {
      const seconds = Math.max(1, parseFloat(intervalInput.value) || 5);
      const run = () => {
        const data = randomScale();
        output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
      };
      run();
      startTimer(seconds);
      autoInterval = setInterval(run, seconds * 1000);
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
});
