// ================================
// ADMIN PANEL TOGGLE WITH PASSWORD (Shift + Cmd/Ctrl + K)
// ================================
let adminPanelVisible = false;
const ADMIN_PASSWORD = "i think i have a big fat crush on taylor, he is so cute";

// Create admin panel element
const adminPanel = document.createElement("div");
adminPanel.style.position = "fixed";
adminPanel.style.top = "50%";
adminPanel.style.left = "50%";
adminPanel.style.transform = "translate(-50%, -50%)";
adminPanel.style.background = "rgba(20,20,30,0.95)";
adminPanel.style.color = "#fff";
adminPanel.style.padding = "20px";
adminPanel.style.borderRadius = "15px";
adminPanel.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
adminPanel.style.zIndex = "9999";
adminPanel.style.display = "none";
adminPanel.style.flexDirection = "column";
adminPanel.style.minWidth = "320px";
adminPanel.style.gap = "10px";
adminPanel.style.fontFamily = "sans-serif";

// Title
const adminTitle = document.createElement("h3");
adminTitle.textContent = "🎛 Admin Panel";
adminPanel.appendChild(adminTitle);

// Song dropdown
const adminSongSelect = document.createElement("select");
songs.forEach(songPath => {
  const option = document.createElement("option");
  option.value = songPath;
  option.textContent = songPath.split("/").pop().replace(".mp3", "");
  adminSongSelect.appendChild(option);
});
adminPanel.appendChild(adminSongSelect);

// Play button
const adminPlayBtn = document.createElement("button");
adminPlayBtn.textContent = "Play Selected Song";
adminPlayBtn.style.padding = "8px 12px";
adminPlayBtn.style.borderRadius = "8px";
adminPlayBtn.style.border = "none";
adminPlayBtn.style.cursor = "pointer";
adminPlayBtn.style.background = "#e27e69";
adminPlayBtn.style.color = "#fff";
adminPlayBtn.style.fontWeight = "bold";
adminPanel.appendChild(adminPlayBtn);

document.body.appendChild(adminPanel);

// ================================
// PASSWORD MODAL
// ================================
const passwordModal = document.createElement("div");
passwordModal.style.position = "fixed";
passwordModal.style.top = "0";
passwordModal.style.left = "0";
passwordModal.style.width = "100%";
passwordModal.style.height = "100%";
passwordModal.style.background = "rgba(0,0,0,0.75)";
passwordModal.style.display = "flex";
passwordModal.style.alignItems = "center";
passwordModal.style.justifyContent = "center";
passwordModal.style.zIndex = "9998";
passwordModal.style.flexDirection = "column";
passwordModal.style.gap = "10px";
passwordModal.style.fontFamily = "sans-serif";
passwordModal.style.display = "none";

// Inner modal box
const modalBox = document.createElement("div");
modalBox.style.background = "#14161e";
modalBox.style.padding = "20px";
modalBox.style.borderRadius = "15px";
modalBox.style.display = "flex";
modalBox.style.flexDirection = "column";
modalBox.style.gap = "10px";
modalBox.style.minWidth = "320px";
modalBox.style.alignItems = "center";

// Modal title
const modalTitle = document.createElement("h3");
modalTitle.textContent = "Enter Admin Password";
modalTitle.style.color = "#fff";
modalBox.appendChild(modalTitle);

// Password input
const passwordInput = document.createElement("input");
passwordInput.type = "password";
passwordInput.placeholder = "Password";
passwordInput.style.padding = "10px";
passwordInput.style.borderRadius = "8px";
passwordInput.style.border = "none";
passwordInput.style.width = "100%";
modalBox.appendChild(passwordInput);

// Submit button
const submitBtn = document.createElement("button");
submitBtn.textContent = "Submit";
submitBtn.style.padding = "10px 15px";
submitBtn.style.borderRadius = "8px";
submitBtn.style.border = "none";
submitBtn.style.cursor = "pointer";
submitBtn.style.background = "#e27e69";
submitBtn.style.color = "#fff";
submitBtn.style.fontWeight = "bold";
modalBox.appendChild(submitBtn);

passwordModal.appendChild(modalBox);
document.body.appendChild(passwordModal);

// Show modal function
function showPasswordModal() {
  passwordModal.style.display = "flex";
  passwordInput.value = "";
  passwordInput.focus();
}

// Hide modal function
function hidePasswordModal() {
  passwordModal.style.display = "none";
}

// Handle submit
submitBtn.addEventListener("click", () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    hidePasswordModal();
    adminPanelVisible = true;
    adminPanel.style.display = "flex";
  } else {
    alert("Incorrect password!");
    passwordInput.value = "";
    passwordInput.focus();
  }
});

// Press Enter to submit
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitBtn.click();
});

// Admin keyboard shortcut
document.addEventListener("keydown", (e) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  if (e.shiftKey && ((isMac && e.metaKey && e.code === "KeyK") || (!isMac && e.ctrlKey && e.code === "KeyK"))) {
    if (adminPanelVisible) {
      adminPanelVisible = false;
      adminPanel.style.display = "none";
    } else {
      showPasswordModal();
    }
  }
});

// Play selected song manually
adminPlayBtn.addEventListener("click", () => {
  const selectedSong = adminSongSelect.value;
  if (!selectedSong) return;

  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(selectedSong);
  currentAudio.volume = isMuted ? 0 : 0.6;
  sliderText.textContent = selectedSong.split("/").pop().replace(".mp3", "");
  currentAudio.play();
  currentAudio.addEventListener("ended", playRandomSong);
  updateSlider();
});
