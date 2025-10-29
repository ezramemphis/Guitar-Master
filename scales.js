// --------------------- //
// 🎵 SCALE GENERATOR JS //
// --------------------- //

// Enharmonic note list with both sharp and flat spellings
const ENHARMONICS = [
  ["C"],
  ["C#", "Db"],
  ["D"],
  ["D#", "Eb"],
  ["E", "Fb"],
  ["F", "E#"],
  ["F#", "Gb"],
  ["G"],
  ["G#", "Ab"],
  ["A"],
  ["A#", "Bb"],
  ["B", "Cb"]
];

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

// Interval formulas (in semitones)
const MODE_INTERVALS = {
  Ionian: [2, 2, 1, 2, 2, 2, 1],
  Dorian: [2, 1, 2, 2, 2, 1, 2],
  Phrygian: [1, 2, 2, 2, 1, 2, 2],
  Lydian: [2, 2, 2, 1, 2, 2, 1],
  Mixolydian: [2, 2, 1, 2, 2, 1, 2],
  Aeolian: [2, 1, 2, 2, 1, 2, 2],
  Locrian: [1, 2, 2, 1, 2, 2, 2]
};

// ---------------------------- //
// 🎶 Generate a scale properly //
// ---------------------------- //
function generateScale(rootNote, mode) {
  const intervals = MODE_INTERVALS[mode];
  const startIndex = findNoteIndex(rootNote);
  if (startIndex === -1) return [];

  const scale = [rootNote];
  let currentIndex = startIndex;

  for (let i = 0; i < intervals.length; i++) {
    currentIndex = (currentIndex + intervals[i]) % ENHARMONICS.length;
    const prevLetter = scale[i][0];
    const nextOptions = ENHARMONICS[currentIndex];

    // Pick enharmonic spelling that avoids repeating the same letter name
    const nextNote =
      nextOptions.find(n => n[0] !== prevLetter) || nextOptions[0];

    scale.push(nextNote);
  }

  return scale;
}

// Find the enharmonic index of a given note
function findNoteIndex(note) {
  return ENHARMONICS.findIndex(group => group.includes(note));
}

// Randomly pick root and mode
function randomScale() {
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const mode = MODES[Math.floor(Math.random() * MODES.length)];
  const scale = generateScale(root, mode);

  const randomDegree = Math.floor(Math.random() * 7) + 1;
  const degreeRoot = scale[randomDegree - 1];
  const degreeText =
    Math.random() < 0.5
      ? ""
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
// ⚙️ DOM + Auto Mode Control   //
// ---------------------------- //
let autoInterval = null;

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("scale-output");
  const genBtn = document.getElementById("generate-btn");
  const autoBtn = document.getElementById("autoBtn");
  const intervalInput = document.getElementById("intervalInput");

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
      autoBtn.textContent = "▶ Start Auto";
      output.innerHTML += "<br><small>Auto mode stopped.</small>";
    } else {
      const seconds = Math.max(1, parseFloat(intervalInput.value) || 5);
      const run = () => {
        const scaleData = randomScale();
        output.innerHTML = `<strong>${scaleData.name}</strong><br>${scaleData.notes}`;
      };
      run();
      autoInterval = setInterval(run, seconds * 1000);
      autoBtn.textContent = "⏸ Stop Auto";
    }
  });
});
