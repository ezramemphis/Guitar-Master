// ================================
// ADMIN PANEL TOGGLE WITH PASSWORD (Shift + Cmd/Ctrl + K)
// ================================
let adminPanelVisible = false;
const ADMIN_PASSWORD = "test";

// Helper: quick styling function
const css = (el, styles) => Object.assign(el.style, styles);

// ================================
// ADMIN PANEL
// ================================
const adminPanel = document.createElement("div");
css(adminPanel, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#222",
  color: "#fff",
  padding: "15px",
  borderRadius: "8px",
  display: "none",
  flexDirection: "column",
  gap: "10px",
  zIndex: 9999,
  fontFamily: "sans-serif",
  minWidth: "250px"
});

// Title
const adminTitle = document.createElement("h3");
adminTitle.textContent = "Admin Panel";
css(adminTitle, { margin: "0", fontSize: "18px" });
adminPanel.appendChild(adminTitle);

// Song dropdown
const adminSongSelect = document.createElement("select");
songs.forEach(path => {
  const o = document.createElement("option");
  o.value = path;
  o.textContent = path.split("/").pop().replace(".mp3", "");
  adminSongSelect.appendChild(o);
});
adminPanel.appendChild(adminSongSelect);

// Play button
const adminPlayBtn = document.createElement("button");
adminPlayBtn.textContent = "Play";
css(adminPlayBtn, {
  padding: "6px 10px",
  cursor: "pointer",
  border: "1px solid #444",
  background: "#333",
  color: "#fff",
  borderRadius: "4px"
});
adminPanel.appendChild(adminPlayBtn);

document.body.appendChild(adminPanel);

// ================================
// PASSWORD MODAL
// ================================
const passwordModal = document.createElement("div");
css(passwordModal, {
  position: "fixed",
  inset: 0,
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.4)",
  zIndex: 9998,
  fontFamily: "sans-serif"
});

const modalBox = document.createElement("div");
css(modalBox, {
  background: "#222",
  padding: "15px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  minWidth: "240px",
  color: "#fff"
});

// Modal title
const modalTitle = document.createElement("div");
modalTitle.textContent = "Enter Admin Password";
modalBox.appendChild(modalTitle);

// Password input
const passwordInput = document.createElement("input");
passwordInput.type = "password";
css(passwordInput, { padding: "6px", borderRadius: "4px", border: "1px solid #444" });
modalBox.appendChild(passwordInput);

// Submit button
const submitBtn = document.createElement("button");
submitBtn.textContent = "Submit";
css(submitBtn, {
  padding: "6px 10px",
  cursor: "pointer",
  background: "#333",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px"
});
modalBox.appendChild(submitBtn);

passwordModal.appendChild(modalBox);
document.body.appendChild(passwordModal);

// ================================
// SHOW/HIDE MODAL + PANEL
// ================================
function showPasswordModal() {
  passwordModal.style.display = "flex";
  passwordInput.value = "";
  passwordInput.focus();
}

function hidePasswordModal() {
  passwordModal.style.display = "none";
}

submitBtn.addEventListener("click", () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    hidePasswordModal();
    adminPanelVisible = true;
    adminPanel.style.display = "flex";
  } else {
    alert("Incorrect password");
  }
});

// Enter key submits
passwordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") submitBtn.click();
});

// Keyboard shortcut
document.addEventListener("keydown", e => {
  const mac = navigator.platform.includes("Mac");
  const shortcut = mac ? e.metaKey : e.ctrlKey;

  if (shortcut && e.shiftKey && e.code === "KeyK") {
    if (adminPanelVisible) {
      adminPanelVisible = false;
      adminPanel.style.display = "none";
    } else {
      showPasswordModal();
    }
  }
});

// Escape key closes everything
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    adminPanel.style.display = "none";
    passwordModal.style.display = "none";
    adminPanelVisible = false;
  }
});

// Play song
adminPlayBtn.addEventListener("click", () => {
  const s = adminSongSelect.value;
  if (!s) return;

  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(s);
  currentAudio.volume = isMuted ? 0 : 0.6;
  sliderText.textContent = s.split("/").pop().replace(".mp3", "");
  currentAudio.play();
  currentAudio.addEventListener("ended", playRandomSong);
  updateSlider();
});
