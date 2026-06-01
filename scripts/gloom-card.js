const card = document.querySelector("[data-boss-card]");
const bg = document.querySelector("[data-parallax-bg]");
const boss = document.querySelector("[data-parallax-boss]");
const referenceBoss = document.querySelector("[data-parallax-reference-boss]");
const particleField = document.querySelector("[data-particles]");

const requiredAssets = [
  "bosses/gloom/background.webp",
  "bosses/gloom/sprite.png",
  "bosses/gloom/chains.png",
  "bosses/gloom/rocks.png",
];

function assetExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

Promise.all(requiredAssets.map(assetExists)).then((results) => {
  if (results.every(Boolean)) {
    card.classList.add("assets-ready");
  }
});

function createParticles() {
  const total = 48;
  for (let i = 0; i < total; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.setProperty("--x", `${Math.random() * 100}%`);
    p.style.setProperty("--size", `${Math.random() * 5 + 3}px`);
    p.style.setProperty("--duration", `${Math.random() * 6 + 6}s`);
    p.style.setProperty("--delay", `${Math.random() * -14}s`);
    p.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
    p.style.setProperty("--opacity", `${Math.random() * 0.5 + 0.42}`);
    particleField.appendChild(p);
  }
}

// ── Parallax suave con lerp ───────────────────────────────────────────────────

let isHovered = false;
let rafId = null;

const state  = { tiltX: 0, tiltY: 0, scale: 1, bgX: 0, bgY: 0, bossX: 0, bossY: 0, refX: 0, refY: 0 };
const target = { tiltX: 0, tiltY: 0, scale: 1, bgX: 0, bgY: 0, bossX: 0, bossY: 0, refX: 0, refY: 0 };

function lerp(a, b, t) { return a + (b - a) * t; }

function applyTransforms() {
  card.style.transform =
    `perspective(1400px) rotateY(${state.tiltX}deg) rotateX(${state.tiltY}deg) scale(${state.scale})`;
  bg.style.transform           = `translate3d(${state.bgX}px,   ${state.bgY}px,   0)`;
  boss.style.transform         = `translate3d(${state.bossX}px, ${state.bossY}px, 0)`;
  referenceBoss.style.transform = `translate3d(${state.refX}px,  ${state.refY}px,  0)`;
}

function tick() {
  const ease = 0.09;
  let moving = false;

  for (const key of Object.keys(state)) {
    const next = lerp(state[key], target[key], ease);
    if (Math.abs(next - state[key]) > 0.0005) moving = true;
    state[key] = next;
  }

  applyTransforms();
  rafId = moving ? requestAnimationFrame(tick) : null;
}

function startTick() {
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function onMouseMove(event) {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width  - 0.5;
  const y = (event.clientY - rect.top)  / rect.height - 0.5;

  target.tiltX = x * 6;
  target.tiltY = -y * 4;
  target.bgX   = x * 10;
  target.bgY   = y * 6;
  target.bossX = x * 22;
  target.bossY = y * 13;
  target.refX  = x * 8;
  target.refY  = y * 5;

  startTick();
}

function onMouseEnter() {
  isHovered = true;
  target.scale = 1.03;
  startTick();
}

function onMouseLeave() {
  isHovered = false;
  target.tiltX = 0;
  target.tiltY = 0;
  target.scale = 1;
  target.bgX   = 0;
  target.bgY   = 0;
  target.bossX = 0;
  target.bossY = 0;
  target.refX  = 0;
  target.refY  = 0;
  startTick();
}

createParticles();
card.addEventListener("mouseenter", onMouseEnter);
card.addEventListener("mousemove",  onMouseMove);
card.addEventListener("mouseleave", onMouseLeave);
