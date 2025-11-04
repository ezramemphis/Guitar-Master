const ENHARMONICS = [
  ["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E", "Fb"], ["F", "E#"],
  ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]
];

const CHORD_TYPES = ["maj", "min", "dim", "aug", "7", "m7", "maj7"];

// Generate a random arpeggio
function randomArpeggio() {
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const type = CHORD_TYPES[Math.floor(Math.random() * CHORD_TYPES.length)];
  return { name: `${root} ${type} arpeggio`, notes: getArpeggioNotes(root, type).join(" - ") };
}

// Generate notes for the arpeggio (same as chord but sequential)
function getArpeggioNotes(root, type) {
  const rootIndex = ENHARMONICS.findIndex(g => g.includes(root));
  const notes = [root];
  switch(type){
    case "maj":
      notes.push(ENHARMONICS[(rootIndex + 4) % 12][0], ENHARMONICS[(rootIndex + 7) % 12][0]);
      break;
    case "min":
      notes.push(ENHARMONICS[(rootIndex + 3) % 12][0], ENHARMONICS[(rootIndex + 7) % 12][0]);
      break;
    case "dim":
      notes.push(ENHARMONICS[(rootIndex + 3) % 12][0], ENHARMONICS[(rootIndex + 6) % 12][0]);
      break;
    case "aug":
      notes.push(ENHARMONICS[(rootIndex + 4) % 12][0], ENHARMONICS[(rootIndex + 8) % 12][0]);
      break;
    case "7":
      notes.push(ENHARMONICS[(rootIndex + 4) % 12][0], ENHARMONICS[(rootIndex + 7) % 12][0], ENHARMONICS[(rootIndex + 10) % 12][0]);
      break;
    case "m7":
      notes.push(ENHARMONICS[(rootIndex + 3) % 12][0], ENHARMONICS[(rootIndex + 7) % 12][0], ENHARMONICS[(rootIndex + 10) % 12][0]);
      break;
    case "maj7":
      notes.push(ENHARMONICS[(rootIndex + 4) % 12][0], ENHARMONICS[(rootIndex + 7) % 12][0], ENHARMONICS[(rootIndex + 11) % 12][0]);
      break;
  }
  return notes;
}

// ---------------------------- //
// ⚙️ DOM + Auto Mode + Timer   //
// ---------------------------- //

let autoInterval = null;
let timerInterval = null;
let remainingTime = 0;

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("arpeggio-output");
  const genBtn = document.getElementById("generate-btn");
  const autoBtn = document.getElementById("autoBtn");
  const intervalInput = document.getElementById("intervalInput");
  const timerText = document.getElementById("timer-text");
  const timerCircle = document.querySelector(".timer-progress");

  const fullDash = 283;

  const updateTimerVisual = () => {
    const seconds = Math.max(1, Math.ceil(remainingTime));
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
      if (remainingTime <= 0) remainingTime = seconds;
      updateTimerVisual();
    }, 100);
  };

  genBtn.addEventListener("click", () => {
    const data = randomArpeggio();
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
        const data = randomArpeggio();
        output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
      };
      run();
      startTimer(seconds);
      autoInterval = setInterval(run, seconds * 1000);
      autoBtn.textContent = "⏸ Stop Auto";
    }
  });
});



const toggleBtn = document.getElementById('toggleRainbow');
const exerciseContainer = document.querySelector('.exercise-container');

toggleBtn.classList.add('off'); // start OFF

toggleBtn.addEventListener('click', () => {
  // Toggle rainbow state on the container
  exerciseContainer.classList.toggle('rainbow');

  // Determine if rainbow mode is active
  const isOn = exerciseContainer.classList.contains('rainbow');

  // Update button visuals
  toggleBtn.classList.toggle('on', isOn);
  toggleBtn.classList.toggle('off', !isOn);
});
