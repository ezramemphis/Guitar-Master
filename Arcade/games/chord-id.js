// Chord ID Challenge with VexFlow triads and leaderboard

const VF = Vex.Flow;

const roots = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

const qualities = ["major", "minor", "diminished", "augmented"];

const scoreSpan = document.getElementById("score");
const timerSpan = document.getElementById("timer");
const vfContainer = document.getElementById("vf-container");
const buttons = document.querySelectorAll(".option-btn");

let currentRoot = "";
let currentQuality = "";
let score = 0;
let timeLeft = 60;
let countdownInterval = null;

// Map chord quality to intervals (semitone steps from root)
const chordIntervals = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
};

// Map note names to VexFlow note letters and accidentals
// VexFlow requires note format like 'C#4', so we fix octave as 4 for simplicity
const noteNameMap = {
  "C": "C",
  "C#": "C#",
  "D": "D",
  "D#": "D#",
  "E": "E",
  "F": "F",
  "F#": "F#",
  "G": "G",
  "G#": "G#",
  "A": "A",
  "A#": "A#",
  "B": "B",
};

// Utility: get semitone index for root
function getRootIndex(root) {
  return roots.indexOf(root);
}

// Create the chord notes as VexFlow StaveNotes
function createChordNotes(root, quality) {
  const rootIndex = getRootIndex(root);
  const intervals = chordIntervals[quality];
  const notes = [];

  for (const interval of intervals) {
    let noteIndex = (rootIndex + interval) % roots.length;
    let noteName = roots[noteIndex];

    // VexFlow requires octave number, fix 4 for all
    notes.push(noteNameMap[noteName] + "4");
  }

  // Convert notes to Vex.Flow StaveNotes with keys and duration
  return notes.map(n => new VF.StaveNote({
    clef: "treble",
    keys: [n],
    duration: "q",
    // Just one note per StaveNote for chords
  }));
}

// Because we want a chord symbol rendered with notes stacked vertically,
// better to create a single StaveNote with all keys for the chord
function createChordStaveNote(root, quality) {
  const rootIndex = getRootIndex(root);
  const intervals = chordIntervals[quality];

  // Get all note names for the chord
  const keys = intervals.map(interval => {
    let noteIndex = (rootIndex + interval) % roots.length;
    let noteName = roots[noteIndex];
    return noteNameMap[noteName] + "4";
  });

  return new VF.StaveNote({
    clef: "treble",
    keys,
    duration: "w",
  });
}

// Draw the chord using VexFlow in the vf-container
function renderChord(root, quality) {
  // Clear old rendering
  vfContainer.innerHTML = "";

  const renderer = new VF.Renderer(vfContainer, VF.Renderer.Backends.SVG);
  renderer.resize(600, 180);
  const context = renderer.getContext();

  const stave = new VF.Stave(10, 40, 580);
  stave.addClef("treble");
  stave.setContext(context).draw();

  // Draw chord symbol text above stave
  context.setFont("Arial", 20, "");
  context.fillText(`${root} ${capitalize(quality)}`, 480, 25);

  // Create the chord note and draw it
  const chordNote = createChordStaveNote(root, quality);
  // Add accidentals if necessary
  chordNote.getKeys().forEach((key, i) => {
    if (key.includes("#")) {
      chordNote.addModifier(new VF.Accidental("#"), i);
    }
  });

  // Create a voice with the chord note
  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickable(chordNote);

  // Format and justify the voice to stave width
  new VF.Formatter().joinVoices([voice]).format([voice], 400);

  voice.draw(context, stave);
}

// Capitalize first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate a random chord
function getRandomChord() {
  currentRoot = roots[Math.floor(Math.random() * roots.length)];
  currentQuality = qualities[Math.floor(Math.random() * qualities.length)];
  return { root: currentRoot, quality: currentQuality };
}

// Set new chord and render it
function setNewChord() {
  const chord = getRandomChord();
  currentRoot = chord.root;
  currentQuality = chord.quality;
  renderChord(currentRoot, currentQuality);
}

// Handle user answer selection
function handleAnswer(selectedQuality) {
  if (selectedQuality.toLowerCase() === currentQuality) {
    playSound(rightSound);
    score++;
    scoreSpan.textContent = score;
  } else {
    playSound(wrongSound);
  }
  setNewChord();
}

// Play audio safely
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Timer logic
function startTimer() {
  timerSpan.textContent = timeLeft;
  countdownInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

// End game: disable buttons, show message, and leaderboard prompt
function endGame() {
  buttons.forEach(btn => (btn.disabled = true));
  vfContainer.innerHTML = "<div style='font-size: 24px; margin-top: 50px; color: #fff;'>⏰ Time's Up!</div>";
  showRetryButton();

  setTimeout(() => {
    const playerName = prompt("Enter your name for the leaderboard:");
    if (playerName) {
      const leaderboard = JSON.parse(localStorage.getItem("chordIDChallengeLeaderboard")) || [];
      leaderboard.push({ name: playerName, score: score });
      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem("chordIDChallengeLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
    }
  }, 300);
}

// Show retry button below chord display
function showRetryButton() {
  if (document.getElementById("retry-btn")) return; // avoid duplicates

  const retryBtn = document.createElement("button");
  retryBtn.id = "retry-btn";
  retryBtn.textContent = "Retry";
  retryBtn.className = "option-btn";
  retryBtn.style.marginTop = "20px";

  retryBtn.onclick = () => {
    score = 0;
    scoreSpan.textContent = score;
    timeLeft = 60;
    retryBtn.remove();
    buttons.forEach(btn => (btn.disabled = false));
    setNewChord();
    startTimer();
  };

  vfContainer.parentNode.appendChild(retryBtn);
}

// Sounds
const rightSound = new Audio("../sounds/right-answer.mp3");
const wrongSound = new Audio("../sounds/wrong-answer.mp3");

// Attach event listeners
buttons.forEach(button => {
  button.addEventListener("click", () => {
    if (timeLeft <= 0) return; // ignore clicks after time's up
    const selectedQuality = button.getAttribute("data-chord");
    handleAnswer(selectedQuality);
  });
});

// Initialize
setNewChord();
startTimer();
