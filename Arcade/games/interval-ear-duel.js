const intervals = [
  "m2", "M2", "m3", "M3", "P4", "Tritone",
  "P5", "m6", "M6", "m7", "M7", "octave"
];

let currentInterval = "";
let score = 0;
let timeLeft = 30;
let timerId = null;

const rightSound = new Audio("../sounds/right-answer.mp3");
const wrongSound = new Audio("../sounds/wrong-answer.mp3");

const intervalDisplay = document.getElementById("interval-display");
const buttons = document.querySelectorAll(".option-btn");
const scoreSpan = document.getElementById("score");
const timerSpan = document.getElementById("timer");

function playIntervalAudio(interval) {
  // Minor intervals get "m-" prefix for filename
  let filename = interval;
  if (interval.startsWith("m") && !interval.includes("-")) {
    filename = "m-" + interval.slice(1);
  }

  // All files are in the audio folder relative to this file
  const audio = new Audio(`audio/${filename}.mp3`);

  audio.currentTime = 0;
  audio.play().catch(err => {
    console.error(`Failed to play audio file: audio/${filename}.mp3`, err);
  });
}

function setNewInterval() {
  currentInterval = intervals[Math.floor(Math.random() * intervals.length)];
  intervalDisplay.textContent = currentInterval; // Display the text in the element
  playIntervalAudio(currentInterval);
}

function handleAnswer(selected) {
  if (!currentInterval) return;

  if (selected === currentInterval) {
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

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedInterval = button.getAttribute("data-interval");
    handleAnswer(selectedInterval);
  });
});

function startTimer() {
  timerSpan.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      intervalDisplay.textContent = "Time's Up!";
      buttons.forEach(btn => btn.disabled = true);
      showRetryButton();

      setTimeout(() => {
        const playerName = prompt("Enter your name for the leaderboard:");
        if (playerName) {
          const leaderboard = JSON.parse(localStorage.getItem("intervalEarDuelLeaderboard")) || [];
          leaderboard.push({ name: playerName, score: score });
          leaderboard.sort((a, b) => b.score - a.score);
          localStorage.setItem("intervalEarDuelLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
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
    buttons.forEach(btn => btn.disabled = false);
    setNewInterval();
    startTimer();
  };

  intervalDisplay.parentNode.appendChild(retryBtn);
}

// Start game
setNewInterval();
startTimer();
