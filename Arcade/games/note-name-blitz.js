const notes = [
  "C", "C♯", "D", "D♯", "E", "E♯", "F", "F♯", "G", "G♯", "A", "A♯", "B", "B♯",
  "C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"
];

let currentNote = "";  
let score = 0;
let timeLeft = 30;
let selectedClef = "treble"; // default clef

const rightSound = new Audio("../sounds/right-answer.mp3");
const wrongSound = new Audio("../sounds/wrong-answer.mp3");

const vfContainer = document.getElementById("vf-container");
const buttons = document.querySelectorAll(".note-button");
const scoreSpan = document.getElementById("score");
const timerSpan = document.getElementById("timer");

const startModal = document.getElementById("start-modal");
const startGameBtn = document.getElementById("start-game-btn");

let vf, context, stave;

function initVexflow() {
  vfContainer.innerHTML = "";
  vf = new Vex.Flow.Factory({
  renderer: { elementId: "vf-container", width: 400, height: 200 } // bigger canvas
});
  context = vf.getContext();
context.scale(1.6, 1.6); // scale everything up (adjust as needed)
  stave = new Vex.Flow.Stave(40, 10, 150); // even shorter width
  stave.addClef(selectedClef).setContext(context).draw();
}

function getRandomNote() {
  const baseNote = notes[Math.floor(Math.random() * notes.length)];
  let octave = Math.random() < 0.5 ? 4 : 5;
  if (selectedClef === "bass") {
    octave -= 1;  // shift down octave for bass clef notes
  }
  return baseNote + octave; 
}

function convertToVexNote(noteWithOctave) {
  const baseNotes = {
    "C": "c", "D": "d", "E": "e", "F": "f", "G": "g", "A": "a", "B": "b"
  };
  const letter = noteWithOctave[0];
  const accidental = noteWithOctave.slice(1, -1);
  let octave = parseInt(noteWithOctave.slice(-1), 10);

  // Adjust octave for bass clef here as well (in case noteWithOctave came from somewhere else)
  if (selectedClef === "bass") {
    octave -= 1;
  }

  let pitch = baseNotes[letter];

  if (!pitch) return "c/4";

  let full = pitch;
  if (accidental === "♯") full += "#";
  else if (accidental === "♭") full += "b";
  else if (accidental === "♯♯") full += "##";
  else if (accidental === "♭♭") full += "bb";
  else if (accidental === "♯♯♯") full += "###";
  else if (accidental === "♭♭♭") full += "bbb";

  return full + "/" + octave;
}

function renderNote(noteWithOctave) {
  initVexflow();
  const vexNote = new Vex.Flow.StaveNote({ clef: selectedClef, keys: [convertToVexNote(noteWithOctave)], duration: "q" });

  const accidental = noteWithOctave.slice(1, -1);
  if (accidental.includes("♯")) {
    vexNote.addModifier(new Vex.Flow.Accidental("#"), 0);
  } else if (accidental.includes("♭")) {
    vexNote.addModifier(new Vex.Flow.Accidental("b"), 0);
  }

  const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables([vexNote]);

  const formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 300);
  voice.draw(context, stave);
}

function setNewNote() {
  currentNote = getRandomNote();
  renderNote(currentNote);
}

function handleAnswer(selected) {
  const noteWithoutOctave = currentNote.slice(0, -1);
  if (selected === noteWithoutOctave) {
    rightSound.currentTime = 0;
    rightSound.play();
    score++;
    scoreSpan.textContent = score;
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
  setNewNote();
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedNote = button.textContent;
    handleAnswer(selectedNote);
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
      buttons.forEach(btn => btn.disabled = true);
      showRetryButton();

      setTimeout(() => {
        const playerName = prompt("Enter your name for the leaderboard:");
        if (playerName) {
          const leaderboard = JSON.parse(localStorage.getItem("noteNameBlitzLeaderboard")) || [];
          leaderboard.push({ name: playerName, score: score });
          leaderboard.sort((a, b) => b.score - a.score);
          localStorage.setItem("noteNameBlitzLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
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
    timeLeft = 60; // reset time to 60 seconds
    retryBtn.remove();
    buttons.forEach(btn => btn.disabled = false);
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
      setNewNote();
      startTimer();
    }
  }, 1000);
}

// New: Show modal on page load, wait for user to pick clef + start
startGameBtn.addEventListener("click", () => {
  const clefRadio = document.querySelector('input[name="clef"]:checked');
  selectedClef = clefRadio ? clefRadio.value : "treble";
  startModal.style.display = "none";

  // Reset values
  score = 0;
  timeLeft = 60;
  scoreSpan.textContent = score;
  timerSpan.textContent = timeLeft;

  startCountdownThenGame();
});

// On load, show the modal (in case CSS hides it by default)
window.addEventListener("load", () => {
  startModal.style.display = "flex";
});
