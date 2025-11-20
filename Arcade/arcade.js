document.addEventListener("DOMContentLoaded", () => {
  const machines = document.querySelectorAll(".machine");
  const hoverBleep = document.getElementById("hover-bleep");

  machines.forEach((machine) => {
    machine.addEventListener("mouseenter", () => {
      hoverBleep.currentTime = 0;
      hoverBleep.play();
    });

    machine.addEventListener("click", () => {
      const game = machine.dataset.game;

      switch (game) {
        case "interval-id":
          startGame("Interval Identification", "interval-id.html");
          break;
        case "note-id":
          startGame("Note Identification", "note-game.html");
          break;
        case "chord-id":
          startGame("Chord Identification", "chord-game.html");
          break;
        case "ear-interval":
          startGame("Ear Training: Intervals", "ear-interval-game.html");
          break;
        case "rhythm":
          startGame("Rhythm Recognition", "rhythm-game.html");
          break;
        default:
          console.log("Unknown game type.");
      }
    });
  });
});

function startGame(name, url) {
  console.log(`Starting game: ${name}`);
  window.location.href = url;
}


// leaderboard.js

const games = [
  { key: "intervalIDLeaderboard", label: "Interval Inspector" },
  { key: "noteNameBlitzLeaderboard", label: "Note Name Blitz" },
  { key: "chordIDChallengeLeaderboard", label: "Chord ID Challenge" },
  { key: "intervalEarDuelLeaderboard", label: "Interval Ear Duel" },
  { key: "rhythmEchoLeaderboard", label: "Rhythm Echo" }, //coming soon
];


let currentGameIndex = 1; // Start with Note Name Blitz as default

const titleEl = document.getElementById("leaderboard-title");
const listEl = document.getElementById("leaderboard-list");
const prevBtn = document.getElementById("prevGame");
const nextBtn = document.getElementById("nextGame");

function renderLeaderboardForGame(index) {
  const game = games[index];
  titleEl.textContent = `${game.label} Leaderboard`;

  const leaderboard = JSON.parse(localStorage.getItem(game.key)) || [];
  
  if (leaderboard.length === 0) {
    listEl.innerHTML = "<li>No scores yet</li>";
  } else {
    listEl.innerHTML = leaderboard
      .map(entry => `<li><strong>${entry.name}</strong>: ${entry.score}</li>`)
      .join("");
  }
}

function showPrevGame() {
  currentGameIndex = (currentGameIndex - 1 + games.length) % games.length;
  renderLeaderboardForGame(currentGameIndex);
}

function showNextGame() {
  currentGameIndex = (currentGameIndex + 1) % games.length;
  renderLeaderboardForGame(currentGameIndex);
}

prevBtn.addEventListener("click", showPrevGame);
nextBtn.addEventListener("click", showNextGame);

// Initialize leaderboard on page load
document.addEventListener("DOMContentLoaded", () => {
  renderLeaderboardForGame(currentGameIndex);
});


// leadboard arrow sounds

const leaderboardSnap = document.getElementById('leaderboard-snap');

document.getElementById('prevGame').addEventListener('click', () => {
  leaderboardSnap.currentTime = 0;
  leaderboardSnap.play();
  // Add your existing logic to switch to the previous leaderboard
});

document.getElementById('nextGame').addEventListener('click', () => {
  leaderboardSnap.currentTime = 0;
  leaderboardSnap.play();
  // Add your existing logic to switch to the next leaderboard
});




