const BOSSES = [
  {
    id: "gloom",
    name: "Gloom",
    region: "Arcane River",
    subregion: "Moonbridge",
    tags: ["Boss", "Dark", "Chaos", "Weekly"],
    nivel: 235, af: 720, party: "1–6", modo: "Chaos",
    background: "bosses/gloom/background.png",
    bgPosition: "59% 48%",
    sprite: "bosses/gloom/sprite.png",
    accessories: "bosses/gloom/accessories.png",
    accessoriesBlend: "multiply",
    spriteSize: "min(700px, 90%)",
    stageDark: 0.38,
  },
  {
    id: "lucid",
    name: "Lucid",
    region: "Arcane River",
    subregion: "Lachelein",
    tags: ["Boss", "Dream", "Chaos", "Weekly"],
    nivel: 230, af: 700, party: "1–6", modo: "Chaos",
    background: "bosses/lucid/background.png",
    bgPosition: "55% 38%",
    sprite: "bosses/lucid/sprite.png",
    accessories: "bosses/lucid/accessories.png",
    accessoriesBlend: "screen",
    spriteSize: "min(960px, 96%)",
    transparentBg: true,
    stageDark: 0.22,
  },
  {
    id: "slime",
    name: "Slime",
    region: "Arcane River",
    subregion: "Sellas",
    tags: ["Boss", "Chaos", "Weekly"],
    nivel: 240, af: 750, party: "1–6", modo: "Chaos",
    background: null,
    sprite: null,
  },
  {
    id: "blackmage",
    name: "Black Mage",
    region: "Arcane River",
    subregion: "Black Mage's Domain",
    tags: ["Boss", "Final", "Story"],
    nivel: 255, af: 800, party: "1–6", modo: "Normal",
    background: null,
    sprite: null,
  },
  {
    id: "lotus",
    name: "Lotus",
    region: "Maple World",
    subregion: "Lab — Area C",
    tags: ["Boss", "Darknell", "Weekly"],
    nivel: 190, af: 500, party: "1–6", modo: "Hard",
    background: null,
    sprite: null,
  },
  {
    id: "damien",
    name: "Damien",
    region: "Maple World",
    subregion: "Tyrant's Castle",
    tags: ["Boss", "Hard", "Weekly"],
    nivel: 195, af: 550, party: "1–6", modo: "Hard",
    background: null,
    sprite: null,
  },
  {
    id: "darknell",
    name: "Darknell",
    region: "Arcane River",
    subregion: "Moonbridge",
    tags: ["Boss", "Hard", "Weekly"],
    nivel: 235, af: 720, party: "1–6", modo: "Hard",
    background: null,
    sprite: null,
  },
  {
    id: "will",
    name: "Will",
    region: "Arcane River",
    subregion: "Esfera",
    tags: ["Boss", "Spider", "Hard", "Weekly"],
    nivel: 235, af: 720, party: "1–6", modo: "Hard",
    background: "bosses/will/background.png",
    bgPosition: "50% 40%",
    bgFilter: "none",
    sprite: "bosses/will/sprite.png",
    accessories: "bosses/will/accessories.png",
    accessoriesBlend: "multiply",
    spriteSize: "min(520px, 58%)",
    stageDark: 0.22,
    spriteTop: "10%",
    accTop: "-38%",
    noMask: true,
  },
  {
    id: "verus-hilla",
    name: "Verus Hilla",
    region: "Arcane River",
    subregion: "Dark World Tree",
    tags: ["Boss", "Hard", "Weekly"],
    nivel: 238, af: 730, party: "1–6", modo: "Hard",
    background: null,
    sprite: null,
  },
];

// ── DOM refs ──────────────────────────────────────────────────────────────
const bgLayer         = document.getElementById("bgLayer");
const infoPanel       = document.getElementById("infoPanel");
const infoRegion      = document.getElementById("infoRegion");
const infoName        = document.getElementById("infoName");
const infoTags        = document.getElementById("infoTags");
const infoStats       = document.getElementById("infoStats");
const bossSprite      = document.getElementById("bossSprite");
const bossAccessories = document.getElementById("bossAccessories");
const bossWrap        = document.querySelector(".boss-wrap");
const selector        = document.getElementById("bossSelector");

let activeId = null;

// ── Build selector cards ──────────────────────────────────────────────────
BOSSES.forEach((boss) => {
  const card = document.createElement("button");
  card.className = "boss-thumb";
  card.dataset.bossId = boss.id;
  card.setAttribute("aria-label", boss.name);

  const thumbBg = document.createElement("div");
  thumbBg.className = boss.background ? "thumb-bg" : "thumb-bg no-asset";
  if (boss.background) {
    thumbBg.style.backgroundImage = `url('${boss.background}')`;
  }

  const label = document.createElement("span");
  label.className = "thumb-label";
  label.textContent = boss.name;

  card.appendChild(thumbBg);
  card.appendChild(label);

  if (!boss.background && !boss.sprite) {
    const coming = document.createElement("span");
    coming.className = "thumb-coming";
    coming.textContent = "Soon";
    card.appendChild(coming);
  }

  card.addEventListener("click", () => selectBoss(boss.id));
  selector.appendChild(card);
});

// ── Select boss ───────────────────────────────────────────────────────────
function selectBoss(id) {
  if (id === activeId) return;
  activeId = id;

  const boss = BOSSES.find((b) => b.id === id);
  if (!boss) return;

  // Update active card
  document.querySelectorAll(".boss-thumb").forEach((c) => {
    c.classList.toggle("active", c.dataset.bossId === id);
  });

  // Fade out
  bgLayer.classList.add("fade-out");
  infoPanel.classList.add("fade-out");
  bossSprite.classList.add("fade-out");
  bossAccessories.classList.add("fade-out");

  setTimeout(() => {
    // Update background
    if (boss.background) {
      bgLayer.style.backgroundImage = `url('${boss.background}')`;
      bgLayer.style.backgroundPosition = boss.bgPosition || "center 48%";
      bgLayer.style.filter = boss.bgFilter || "none";
      bgLayer.classList.remove("no-asset");
    } else {
      bgLayer.style.backgroundImage = "";
      bgLayer.style.backgroundPosition = "center 48%";
      bgLayer.style.filter = "none";
      bgLayer.classList.add("no-asset");
    }

    // Update sprite size + stage darkness per boss
    const stage = document.querySelector(".boss-stage");
    bossWrap.style.width = boss.spriteSize || "min(700px, 90%)";
    stage.style.setProperty("--stage-dark", boss.stageDark ?? 0.42);
    stage.style.setProperty("--sprite-top", boss.spriteTop || "0%");
    document.querySelector(".boss-wrap").style.setProperty("--acc-top", boss.accTop || "-20%");

    // Update sprite
    if (boss.sprite) {
      bossSprite.src = boss.sprite;
      bossSprite.classList.remove("hidden");
      bossSprite.classList.toggle("transparent-bg", boss.transparentBg === true);
      bossSprite.classList.toggle("no-mask", boss.noMask === true);
    } else {
      bossSprite.src = "";
      bossSprite.classList.add("hidden");
    }

    // Update accessories
    if (boss.accessories) {
      bossAccessories.src = boss.accessories;
      bossAccessories.style.mixBlendMode = boss.accessoriesBlend || "multiply";
      bossAccessories.classList.remove("hidden");
    } else {
      bossAccessories.src = "";
      bossAccessories.classList.add("hidden");
    }

    // Update info
    infoRegion.innerHTML = `${boss.region} <span>•</span> ${boss.subregion}`;
    infoName.textContent = boss.name;

    infoTags.innerHTML = boss.tags
      .map((t) => `<span>${t}</span>`)
      .join("");

    infoStats.innerHTML = `
      <div><dt>Nivel</dt><dd>${boss.nivel}</dd></div>
      <div><dt>AF Req.</dt><dd>${boss.af}</dd></div>
      <div><dt>Party</dt><dd>${boss.party}</dd></div>
      <div><dt>Modo</dt><dd>${boss.modo}</dd></div>
    `;

    // Fade in
    bgLayer.classList.remove("fade-out");
    infoPanel.classList.remove("fade-out");
    bossSprite.classList.remove("fade-out");
    bossAccessories.classList.remove("fade-out");
  }, 300);
}

// ── Init: load first boss ─────────────────────────────────────────────────
selectBoss("gloom");
