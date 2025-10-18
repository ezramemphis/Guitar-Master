const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const drops = Array(Math.floor(canvas.width / 10)).fill(0);

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.font = "15px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * 10, drops[i] * 15);
    if (drops[i] * 15 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
  requestAnimationFrame(draw);
}
draw();
