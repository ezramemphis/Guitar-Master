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





//music 

const tracks = [
  'audio/you-got-it.mp3',
  'audio/i-want.mp3',
  'audio/alesis.mp3',
  'audio/rylee.mp3',
  'audio/small-hope.mp3',
];

const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');

// Play a random track and handle mute
function playRandomTrack() {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  bgMusic.src = tracks[randomIndex];

  // Check saved mute state
  const isMuted = localStorage.getItem('bgMusicMuted') === 'true';
  bgMusic.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';

  // Start playing
  bgMusic.volume = 0.2;
  bgMusic.play().catch(() => {
    // Some browsers require user interaction
    const onUserInteract = () => {
      bgMusic.play();
      window.removeEventListener('click', onUserInteract);
    };
    window.addEventListener('click', onUserInteract);
  });
}

// Toggle mute
function toggleMute() {
  bgMusic.muted = !bgMusic.muted;
  localStorage.setItem('bgMusicMuted', bgMusic.muted);
  muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
}

muteBtn.addEventListener('click', toggleMute);

// Start music on page load
window.addEventListener('load', playRandomTrack);

