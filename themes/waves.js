const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
let t = 0;

function draw() {
  t += 0.015;
  ctx.fillStyle = "rgba(10,10,25,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + Math.sin(x * 0.02 + t) * 30 + Math.cos(x * 0.015 + t * 2) * 20;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "rgba(0,150,255,0.7)";
  ctx.lineWidth = 2;
  ctx.stroke();
  requestAnimationFrame(draw);
}
draw();
