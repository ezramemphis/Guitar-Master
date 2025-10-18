// --------------------- //
// 🎵 SCALE GENERATOR JS //
// --------------------- //

// All possible note roots (enharmonics simplified)
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// All major modes
const MODES = [
  "Ionian",
  "Dorian",
  "Phrygian",
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian"
];

// Interval formulas for each mode (in semitones)
const MODE_INTERVALS = {
  Ionian:      [2, 2, 1, 2, 2, 2, 1],
  Dorian:      [2, 1, 2, 2, 2, 1, 2],
  Phrygian:    [1, 2, 2, 2, 1, 2, 2],
  Lydian:      [2, 2, 2, 1, 2, 2, 1],
  Mixolydian:  [2, 2, 1, 2, 2, 1, 2],
  Aeolian:     [2, 1, 2, 2, 1, 2, 2],
  Locrian:     [1, 2, 2, 1, 2, 2, 2]
};

// ---------------------- //
// 🎶 Generate a scale   //
// ---------------------- //
function generateScale(rootNote, mode) {
  const intervals = MODE_INTERVALS[mode];
  const startIndex = NOTES.indexOf(rootNote);
  let scale = [rootNote];
  let currentIndex = startIndex;

  for (let i = 0; i < intervals.length; i++) {
    currentIndex = (currentIndex + intervals[i]) % NOTES.length;
    scale.push(NOTES[currentIndex]);
  }

  return scale;
}

// ------------------------------ //
// 🔀 Random scale generator      //
// ------------------------------ //
function randomScale() {
  const root = NOTES[Math.floor(Math.random() * NOTES.length)];
  const mode = MODES[Math.floor(Math.random() * MODES.length)];
  const scale = generateScale(root, mode);

  // Randomly decide if we’re starting from a specific degree
  const randomDegree = Math.floor(Math.random() * 7) + 1;
  const degreeRoot = scale[randomDegree - 1];
  const degreeText =
    Math.random() < 0.5
      ? "" // half the time show normal scale
      : ` starting on the ${ordinal(randomDegree)} degree (${degreeRoot})`;

  return {
    name: `${root} ${mode}${degreeText}`,
    notes: scale.join(" - ")
  };
}

// Utility for “3rd”, “5th”, etc.
function ordinal(n) {
  return n + (["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th");
}

// ---------------------------- //
// ⚙️ DOM + Auto Mode           //
// ---------------------------- //
let autoInterval = null;

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".exercise-container");

  // Create output area
  const output = document.createElement("div");
  output.className = "scale-output";
  output.style.marginTop = "25px";
  output.style.fontSize = "1.2rem";
  output.style.color = "#3ab0ff";
  container.appendChild(output);

  // Generate button
  const genBtn = document.createElement("button");
  genBtn.textContent = "Generate Scale";
  genBtn.className = "back-btn";
  genBtn.style.marginTop = "20px";
  container.appendChild(genBtn);

  // Auto generate controls
  const autoContainer = document.createElement("div");
  autoContainer.style.marginTop = "30px";
  autoContainer.innerHTML = `
    <label style="display:block; margin-bottom:8px;">Auto-generate every (seconds):</label>
    <input type="number" id="intervalInput" value="5" min="1" style="padding:6px; border-radius:8px; border:1px solid #3ab0ff; background:#14161e; color:#e0e0e0; width:80px; text-align:center;">
    <button id="autoBtn" class="back-btn" style="margin-left:10px;">Start Auto</button>
  `;
  container.appendChild(autoContainer);

  const intervalInput = autoContainer.querySelector("#intervalInput");
  const autoBtn = autoContainer.querySelector("#autoBtn");

  // Manual generation
  genBtn.addEventListener("click", () => {
    const scaleData = randomScale();
    output.innerHTML = `<strong>${scaleData.name}</strong><br>${scaleData.notes}`;
  });

  // Auto mode toggle
  autoBtn.addEventListener("click", () => {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
      autoBtn.textContent = "Start Auto";
      output.innerHTML += "<br><small>Auto mode stopped.</small>";
    } else {
      const seconds = Math.max(1, parseFloat(intervalInput.value) || 5);
      const run = () => {
        const scaleData = randomScale();
        output.innerHTML = `<strong>${scaleData.name}</strong><br>${scaleData.notes}`;
      };
      run(); // generate immediately
      autoInterval = setInterval(run, seconds * 1000);
      autoBtn.textContent = "Stop Auto";
    }
  });
});
