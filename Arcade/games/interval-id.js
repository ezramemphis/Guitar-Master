const intervals = [
  { name: "Unison", semitones: 0 },
  { name: "m2", semitones: 1 },
  { name: "M2", semitones: 2 },
  { name: "m3", semitones: 3 },
  { name: "M3", semitones: 4 },
  { name: "P4", semitones: 5 },
  { name: "aug4", semitones: 6 },
  { name: "P5", semitones: 7 },
  { name: "m6", semitones: 8 },
  { name: "M6", semitones: 9 },
  { name: "m7", semitones: 10 },
  { name: "Maj7", semitones: 11 },
  { name: "Octave", semitones: 12 },
];

const chromaticSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const chromaticFlats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const naturalNotes = ["C", "D", "E", "F", "G", "A", "B"];

const lowestMidi = 60;
const highestMidi = 83;

const buttons = document.querySelectorAll(".note-button");
const vfContainer = document.getElementById("vf-container");
const scoreSpan = document.getElementById("score");
const timerSpan = document.getElementById("timer");
const startModal = document.getElementById("start-modal");
const startGameBtn = document.getElementById("start-game-btn");

let score = 0;
let timeLeft = 30;
let selectedClef = "treble";
let currentIntervalName = "";
let vf, context, stave;

const rightSound = new Audio("../sounds/right-answer.mp3");
const wrongSound = new Audio("../sounds/wrong-answer.mp3");

function noteToMidi(note, octave) {
  const index = chromaticSharps.indexOf(note);
  return index + 12 * (octave + 1);
}

function midiToNote(midi, preferFlat = false) {
  const index = midi % 12;
  const note = preferFlat ? chromaticFlats[index] : chromaticSharps[index];
  const octave = Math.floor(midi / 12) - 1;
  return { note, octave };
}

function getIntervalNotes() {
  while (true) {
    const baseOctave = 4;
    const baseNote = naturalNotes[Math.floor(Math.random() * naturalNotes.length)];
    const baseMidi = noteToMidi(baseNote, baseOctave);

    const interval = intervals[Math.floor(Math.random() * intervals.length)];
    const topMidi = baseMidi + interval.semitones;

    if (topMidi <= highestMidi) {
      const minorIntervals = ["m2", "m3", "m6", "m7"];
      const useFlat = minorIntervals.includes(interval.name);
      return {
        intervalName: interval.name,
        baseNote: midiToNote(baseMidi),
        topNote: midiToNote(topMidi, useFlat),
      };
    }
  }
}

function initVexflow() {
  vfContainer.innerHTML = "";
  vf = new Vex.Flow.Factory({
    renderer: { elementId: "vf-container", width: 400, height: 200 },
  });
  context = vf.getContext();
  context.scale(1.6, 1.6);
  stave = new Vex.Flow.Stave(40, 10, 150);
  stave.addClef(selectedClef).setContext(context).draw();
}

function convertToVexKey(note, octave) {
  return `${note.toLowerCase()}/${octave}`;
}

function renderInterval(baseNote, topNote) {
  initVexflow();
  const keys = [
    convertToVexKey(baseNote.note, selectedClef === "bass" ? baseNote.octave - 1 : baseNote.octave),
    convertToVexKey(topNote.note, selectedClef === "bass" ? topNote.octave - 1 : topNote.octave),
  ];

  const staveNote = new Vex.Flow.StaveNote({ clef: selectedClef, keys, duration: "q" });

  keys.forEach((key, i) => {
    if (key.includes("#")) staveNote.addModifier(new Vex.Flow.Accidental("#"), i);
    if (key.includes("b")) staveNote.addModifier(new Vex.Flow.Accidental("b"), i);
  });

  const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables([staveNote]);
  new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 300);
  voice.draw(context, stave);
}

function setNewInterval() {
  const { intervalName, baseNote, topNote } = getIntervalNotes();
  currentIntervalName = intervalName;
  renderInterval(baseNote, topNote);
}

function handleAnswer(selected) {
  if (selected === currentIntervalName) {
    rightSound.currentTime = 0;
    rightSound.play();
    score++;
    scoreSpan.textContent = score;
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
  setNewInterval();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    handleAnswer(button.textContent);
  });
});


function startTimer() {
  timerSpan.textContent = timeLeft;
  const countdown = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      vfContainer.innerHTML = `<h2 style="color:white;">Time's Up! Your score: ${score}</h2>`;
      buttons.forEach((btn) => (btn.disabled = true));
      showRetryButton();

      setTimeout(() => {
        const playerName = prompt("Enter your name for the leaderboard:");
        if (playerName) {
          const leaderboard = JSON.parse(localStorage.getItem("intervalIdLeaderboard")) || [];
          leaderboard.push({ name: playerName, score });
          leaderboard.sort((a, b) => b.score - a.score);
          localStorage.setItem("intervalIdLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
          renderLeaderboard();
        }
      }, 300);
    }
  }, 1000);
}

function showRetryButton() {
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Retry";
  retryBtn.className = "option-btn";
  retryBtn.style.marginTop = "20px";
  retryBtn.onclick = () => {
    score = 0;
    scoreSpan.textContent = score;
    timeLeft = 30;
    retryBtn.remove();
    buttons.forEach((btn) => (btn.disabled = false));
    startCountdownThenGame();
  };
  vfContainer.parentNode.appendChild(retryBtn);
}

function startCountdownThenGame() {
  let count = 3;
  vfContainer.innerHTML = `<h2 style="color:white;">Starting in ${count}...</h2>`;
  timerSpan.textContent = timeLeft;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      vfContainer.innerHTML = `<h2 style="color:white;">Starting in ${count}...</h2>`;
    } else {
      clearInterval(countdownInterval);
      setNewInterval();
      startTimer();
    }
  }, 1000);
}

startGameBtn.addEventListener("click", () => {
  const clefRadio = document.querySelector('input[name="clef"]:checked');
  selectedClef = clefRadio ? clefRadio.value : "treble";
  startModal.style.display = "none";

  score = 0;
  timeLeft = 60; // Increased time for better playability
  scoreSpan.textContent = score;
  timerSpan.textContent = timeLeft;

  startCountdownThenGame();
});

window.addEventListener("load", () => {
  startModal.style.display = "flex";
  renderLeaderboard();
});

function startTimer() {
  timerSpan.textContent = timeLeft;
  const countdown = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      vfContainer.innerHTML = `<h2 style="color:white;">Time's Up! Your score: ${score}</h2>`;
      buttons.forEach(btn => btn.disabled = true);
      showRetryButton();

      setTimeout(() => {
        const playerName = prompt("Enter your name for the leaderboard:");
        if (playerName) {
          const leaderboard = JSON.parse(localStorage.getItem("intervalIDLeaderboard")) || [];
          leaderboard.push({ name: playerName, score: score });
          leaderboard.sort((a, b) => b.score - a.score);
          localStorage.setItem("intervalIDLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
        }
      }, 300);
    }
  }, 1000);
}