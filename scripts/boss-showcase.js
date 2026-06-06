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
    sprite: "bosses/will/will_showcase_aligned.png",
    accessories: null,
    accessoriesBlend: "normal",
    spriteSize: "min(940px, 114%)",
    spriteScale: 1,
    stageDark: 0,
    spriteTop: "8%",
    spriteX: "-13%",
    transparentBg: true,
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
const showcase        = document.getElementById("showcase");
const infoPanel       = document.getElementById("infoPanel");
const infoRegion      = document.getElementById("infoRegion");
const infoName        = document.getElementById("infoName");
const infoTags        = document.getElementById("infoTags");
const infoStats       = document.getElementById("infoStats");
const bossSprite      = document.getElementById("bossSprite");
const bossAccessories = document.getElementById("bossAccessories");
const bossWrap        = document.querySelector(".boss-wrap");
const selector        = document.getElementById("bossSelector");
const sidebarChar     = document.getElementById("sidebarChar");
const sidebarCharName = document.getElementById("sidebarCharName");
const sidebarCharSub  = document.querySelector(".sidebar-char-sub");
const sidebarCharAvatar = document.getElementById("sidebarCharAvatar");
const characterNav    = document.getElementById("characterNav");
const bossNav         = document.getElementById("bossNav");
const fragmentsNav    = document.getElementById("fragmentsNav");
const chatbotNav      = document.getElementById("chatbotNav");
const characterPanel  = document.getElementById("characterPanel");
const fragmentsPage   = document.getElementById("fragmentsPage");
const chatbotPage     = document.getElementById("chatbotPage");
const closeCharacterPanel = document.getElementById("closeCharacterPanel");
const characterSearchForm = document.getElementById("characterSearchForm");
const characterIgn    = document.getElementById("characterIgn");
const characterRegion = document.getElementById("characterRegion");
const fetchCharacterBtn = document.getElementById("fetchCharacterBtn");
const characterStatus = document.getElementById("characterStatus");
const characterPortrait = document.getElementById("characterPortrait");
const characterPortraitEmpty = document.getElementById("characterPortraitEmpty");
const characterWorld  = document.getElementById("characterWorld");
const characterName   = document.getElementById("characterName");
const characterJob    = document.getElementById("characterJob");
const characterLevel  = document.getElementById("characterLevel");
const characterRank   = document.getElementById("characterRank");
const characterJobRank = document.getElementById("characterJobRank");
const characterGlobalRank = document.getElementById("characterGlobalRank");
const characterCount  = document.getElementById("characterCount");
const characterRoster = document.getElementById("characterRoster");
const fragmentsCharacterAvatar = document.getElementById("fragmentsCharacterAvatar");
const fragmentsCharacterClass = document.getElementById("fragmentsCharacterClass");
const fragmentsCharacterName = document.getElementById("fragmentsCharacterName");
const fragmentsStatus = document.getElementById("fragmentsStatus");
const skillsGrid = document.getElementById("skillsGrid");
const fragsSpentTotal = document.getElementById("fragsSpentTotal");
const fragsDesiredTotal = document.getElementById("fragsDesiredTotal");
const fragsRemainingTotal = document.getElementById("fragsRemainingTotal");
const fragmentsCharacterSelect = document.getElementById("fragmentsCharacterSelect");
const fragmentsResetBtn = document.getElementById("fragmentsResetBtn");
const fragmentsMaxDesiredBtn = document.getElementById("fragmentsMaxDesiredBtn");
const chatbotIframe = document.getElementById("chatbotIframe");
const chatbotFallback = document.getElementById("chatbotFallback");

let activeId = null;
const CHARACTER_STORAGE_KEY = "mapletools_active_character";
const CHARACTER_LIST_STORAGE_KEY = "mapletools_characters";
const ACTIVE_CHARACTER_ID_KEY = "mapletools_active_character_id";
let skillsData = null;
let costsData = null;

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
  showcase.dataset.activeBoss = id;

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
    bossWrap.style.setProperty("--sprite-scale", boss.spriteScale || 1);
    bossWrap.style.setProperty("--sprite-x", boss.spriteX || "0%");
    bossWrap.style.setProperty("--acc-top", boss.accTop || "-20%");
    bossWrap.style.setProperty("--acc-left", boss.accLeft || "-20%");
    bossWrap.style.setProperty("--acc-width", boss.accWidth || "140%");
    bossWrap.style.setProperty("--acc-scale", boss.accScale || 1);

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
function showCharacterPage() {
  showcase?.classList.add("character-view");
  showcase?.classList.remove("fragments-view");
  showcase?.classList.remove("chatbot-view");
  characterPanel?.classList.remove("hidden");
  fragmentsPage?.classList.add("hidden");
  chatbotPage?.classList.add("hidden");
  document.querySelectorAll(".sidebar-item").forEach((item) => item.classList.remove("active"));
  characterNav?.classList.add("active");
  characterIgn?.focus();
}

function showBossPage() {
  showcase?.classList.remove("character-view");
  showcase?.classList.remove("fragments-view");
  showcase?.classList.remove("chatbot-view");
  characterPanel?.classList.add("hidden");
  fragmentsPage?.classList.add("hidden");
  chatbotPage?.classList.add("hidden");
  document.querySelectorAll(".sidebar-item").forEach((item) => item.classList.remove("active"));
  bossNav?.classList.add("active");
}

async function showFragmentsPage() {
  showcase?.classList.remove("character-view");
  showcase?.classList.add("fragments-view");
  showcase?.classList.remove("chatbot-view");
  characterPanel?.classList.add("hidden");
  fragmentsPage?.classList.remove("hidden");
  chatbotPage?.classList.add("hidden");
  document.querySelectorAll(".sidebar-item").forEach((item) => item.classList.remove("active"));
  fragmentsNav?.classList.add("active");
  await renderFragmentsPage();
}

function showChatBotPage() {
  showcase?.classList.remove("character-view");
  showcase?.classList.remove("fragments-view");
  showcase?.classList.add("chatbot-view");
  characterPanel?.classList.add("hidden");
  fragmentsPage?.classList.add("hidden");
  chatbotPage?.classList.remove("hidden");
  document.querySelectorAll(".sidebar-item").forEach((item) => item.classList.remove("active"));
  chatbotNav?.classList.add("active");
}

function setCharacterStatus(message, state = "neutral") {
  if (!characterStatus) return;
  characterStatus.textContent = message;
  characterStatus.dataset.state = state;
}

function formatRank(value) {
  if (value === null || value === undefined || value === "") return "-";
  return Number(value).toLocaleString("en-US");
}

function normalizeMapleHubCharacter(raw) {
  const id = `${(raw.region || "na").toLowerCase()}:${(raw.name || "").toLowerCase()}`;
  return {
    id,
    name: raw.name || "",
    region: raw.region || "na",
    jobName: raw.jobName || "",
    level: raw.level ?? "-",
    exp: raw.exp ?? null,
    rank: raw.rank ?? null,
    classRank: raw.classRank ?? raw.ranking?.jobGlobalRank ?? null,
    worldName: raw.worldName || "",
    worldID: raw.worldID ?? null,
    characterImgURL: raw.characterImgURL || "",
    ranking: {
      jobRank: raw.ranking?.jobRank ?? null,
      worldRank: raw.ranking?.worldRank ?? null,
      jobGlobalRank: raw.ranking?.jobGlobalRank ?? raw.classRank ?? null,
      globalRank: raw.ranking?.globalRank ?? null,
    },
    source: "maplehub",
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchMapleHubCharacter(ign, region = "na") {
  const safeIgn = encodeURIComponent(ign.trim());
  const safeRegion = encodeURIComponent(region);
  const timestamp = Date.now();
  const url = `/api/character/?characterName=${safeIgn}&region=${safeRegion}&_t=${timestamp}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Accept": "application/json",
      "X-MapleHub-Request": "true",
    },
  });

  if (!response.ok) {
    throw new Error(response.status === 404
      ? "No se encontro ese personaje en MapleHub."
      : `MapleHub respondio HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!data?.name) throw new Error("No se encontro ese personaje en MapleHub.");

  if ((data.level ?? 0) >= 260 && (!data.additionalData || !data.additionalData.expData)) {
    try {
      const fallback = await fetch(`/api/character-fallback/?characterName=${safeIgn}&region=${safeRegion}&_t=${timestamp}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Accept": "application/json",
          "X-MapleHub-Request": "true",
        },
      });
      if (fallback.ok) {
        const fallbackData = await fallback.json();
        if (fallbackData.additionalData) data.additionalData = fallbackData.additionalData;
      }
    } catch (error) {
      console.warn("MapleHub fallback fetch error:", error);
    }
  }

  return normalizeMapleHubCharacter(data);
}

function saveActiveCharacter(character) {
  const characters = upsertCharacter(character);
  localStorage.setItem(ACTIVE_CHARACTER_ID_KEY, character.id);
  localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
  renderRoster(characters, character.id);
}

function loadCharacters() {
  try {
    const savedList = localStorage.getItem(CHARACTER_LIST_STORAGE_KEY);
    if (savedList) return JSON.parse(savedList);

    const legacy = localStorage.getItem(CHARACTER_STORAGE_KEY);
    if (!legacy) return [];

    const character = JSON.parse(legacy);
    if (!character?.id && character?.name) {
      character.id = `${(character.region || "na").toLowerCase()}:${character.name.toLowerCase()}`;
    }
    localStorage.setItem(CHARACTER_LIST_STORAGE_KEY, JSON.stringify([character]));
    localStorage.setItem(ACTIVE_CHARACTER_ID_KEY, character.id);
    return [character];
  } catch {
    return [];
  }
}

function saveCharacters(characters) {
  localStorage.setItem(CHARACTER_LIST_STORAGE_KEY, JSON.stringify(characters));
}

function upsertCharacter(character) {
  const characters = loadCharacters();
  const index = characters.findIndex((item) => item.id === character.id);
  if (index >= 0) {
    characters[index] = { ...characters[index], ...character };
  } else {
    characters.push(character);
  }
  saveCharacters(characters);
  return characters;
}

function getActiveCharacter(characters = loadCharacters()) {
  const activeId = localStorage.getItem(ACTIVE_CHARACTER_ID_KEY);
  return characters.find((character) => character.id === activeId) || characters[0] || null;
}

function setActiveCharacter(characterId) {
  const characters = loadCharacters();
  const character = characters.find((item) => item.id === characterId);
  if (!character) return;
  localStorage.setItem(ACTIVE_CHARACTER_ID_KEY, character.id);
  localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
  renderCharacter(character);
  renderRoster(characters, character.id);
}

function removeCharacter(characterId) {
  const characters = loadCharacters().filter((character) => character.id !== characterId);
  saveCharacters(characters);

  const activeId = localStorage.getItem(ACTIVE_CHARACTER_ID_KEY);
  if (activeId === characterId) {
    const next = characters[0] || null;
    if (next) {
      localStorage.setItem(ACTIVE_CHARACTER_ID_KEY, next.id);
      localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(ACTIVE_CHARACTER_ID_KEY);
      localStorage.removeItem(CHARACTER_STORAGE_KEY);
    }
  }

  const active = getActiveCharacter(characters);
  renderCharacter(active);
  renderRoster(characters, active?.id);
}

function renderCharacter(character) {
  if (!character) {
    if (sidebarCharName) sidebarCharName.textContent = "Sin personaje";
    if (sidebarCharSub) sidebarCharSub.textContent = "Crear perfil ->";
    if (sidebarCharAvatar) {
      sidebarCharAvatar.textContent = "?";
      sidebarCharAvatar.style.backgroundImage = "";
    }
    if (characterWorld) characterWorld.textContent = "Sin datos";
    if (characterName) characterName.textContent = "Sin personaje activo";
    if (characterJob) characterJob.textContent = "Agrega un personaje para empezar";
    if (characterLevel) characterLevel.textContent = "-";
    if (characterRank) characterRank.textContent = "-";
    if (characterJobRank) characterJobRank.textContent = "-";
    if (characterGlobalRank) characterGlobalRank.textContent = "-";
    characterPortrait?.classList.add("hidden");
    characterPortraitEmpty?.classList.remove("hidden");
    return;
  }

  const subtitle = [character.jobName, character.worldName, `Lv. ${character.level}`]
    .filter(Boolean)
    .join(" - ");

  if (sidebarCharName) sidebarCharName.textContent = character.name || "Sin personaje";
  if (sidebarCharSub) sidebarCharSub.textContent = subtitle || "MapleHub";

  if (sidebarCharAvatar) {
    sidebarCharAvatar.textContent = character.characterImgURL ? "" : (character.name?.[0] || "?");
    sidebarCharAvatar.style.backgroundImage = character.characterImgURL
      ? `url("${character.characterImgURL}")`
      : "";
  }

  if (characterIgn) characterIgn.value = character.name || "";
  if (characterRegion) characterRegion.value = character.region || "na";
  if (characterWorld) characterWorld.textContent = character.worldName || "Sin mundo";
  if (characterName) characterName.textContent = character.name || "Sin personaje";
  if (characterJob) characterJob.textContent = character.jobName || "Sin clase";
  if (characterLevel) characterLevel.textContent = formatRank(character.level);
  if (characterRank) characterRank.textContent = formatRank(character.rank);
  if (characterJobRank) characterJobRank.textContent = formatRank(character.ranking?.jobRank);
  if (characterGlobalRank) characterGlobalRank.textContent = formatRank(character.ranking?.globalRank);

  if (characterPortrait && characterPortraitEmpty) {
    if (character.characterImgURL) {
      characterPortrait.src = character.characterImgURL;
      characterPortrait.alt = character.name || "Personaje";
      characterPortrait.classList.remove("hidden");
      characterPortraitEmpty.classList.add("hidden");
    } else {
      characterPortrait.src = "";
      characterPortrait.classList.add("hidden");
      characterPortraitEmpty.classList.remove("hidden");
    }
  }
}

function renderRoster(characters = loadCharacters(), activeCharacterId = getActiveCharacter(characters)?.id) {
  if (characterCount) {
    characterCount.textContent = `${characters.length} ${characters.length === 1 ? "personaje" : "personajes"}`;
  }

  if (!characterRoster) return;

  if (characters.length === 0) {
    characterRoster.innerHTML = `
      <div class="roster-empty">
        <h4>No hay personajes guardados</h4>
        <p>Busca un IGN arriba para agregarlo a tu roster.</p>
      </div>
    `;
    return;
  }

  const sorted = [...characters].sort((a, b) => {
    if (a.id === activeCharacterId) return -1;
    if (b.id === activeCharacterId) return 1;
    return (b.level || 0) - (a.level || 0);
  });

  characterRoster.innerHTML = sorted.map((character) => `
    <article class="roster-card ${character.id === activeCharacterId ? "active" : ""}" data-character-id="${character.id}">
      <div class="roster-avatar">
        ${character.characterImgURL ? `<img src="${character.characterImgURL}" alt="${character.name}" />` : `<span>${character.name?.[0] || "?"}</span>`}
      </div>
      <div class="roster-body">
        <div class="roster-title-row">
          <div>
            <p>${character.worldName || character.region?.toUpperCase() || "NA"}</p>
            <h4>${character.name || "Sin nombre"}</h4>
          </div>
          <span class="roster-level">Lv. ${character.level ?? "-"}</span>
        </div>
        <div class="roster-meta">
          <span>${character.jobName || "Sin clase"}</span>
          <span>Rank ${formatRank(character.rank)}</span>
          <span>Global ${formatRank(character.ranking?.globalRank)}</span>
        </div>
        <div class="roster-actions">
          <button type="button" data-action="active">Activo</button>
          <button type="button" data-action="refresh">Refrescar</button>
          <button type="button" data-action="remove">Eliminar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function normalizeSkillName(name) {
  return name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
}

function normalizeClassName(name) {
  return name.trim().replace(/\s+/g, "_").replace(/[(),]/g, "").replace(/_{2,}/g, "_");
}

const globalSkills = {
  "Sol Janus": { type: "soljanus", maxLevel: 30 },
};

async function ensureHexaData() {
  if (!skillsData) {
    const response = await fetch("data/skills.json");
    skillsData = await response.json();
  }
  if (!costsData) {
    const response = await fetch("data/costs.json");
    costsData = await response.json();
  }
}

function detectSkillType(skillName, classData) {
  if (globalSkills[skillName]) return globalSkills[skillName].type;
  if (classData?.originSkill === skillName) return "origin";
  if (classData?.ascentSkill === skillName) return "ascent";
  if (
    classData?.firstMastery?.includes(skillName) ||
    classData?.secondMastery?.includes(skillName) ||
    classData?.thirdMastery?.includes(skillName) ||
    classData?.fourthMastery?.includes(skillName)
  ) return "mastery";
  if (classData?.boostSkills?.includes(skillName)) return "boost";
  if (classData?.commonSkills?.includes(skillName)) return "mastery";
  return "unknown";
}

function getCostBetween(type, startLevel, targetLevel) {
  const costType = type === "ascent" ? "origin" : type;
  const table = costsData?.[costType]?.levels;
  const max = costsData?.[costType]?.max || 30;
  if (!table) return { frags: 0, energy: 0, maxLevel: max };

  let frags = 0;
  let energy = 0;
  const from = Math.max(0, Number(startLevel) || 0);
  const target = Math.min(max, Math.max(from, Number(targetLevel) || 0));

  for (let level = from + 1; level <= target; level++) {
    frags += table[level]?.frags || 0;
    energy += table[level]?.energy || 0;
  }

  return { frags, energy, maxLevel: max };
}

function getSkillGroups(classData) {
  return [
    { title: "Origin Skill", skills: [classData.originSkill], type: "origin" },
    { title: "Ascent Skill", skills: [classData.ascentSkill], type: "ascent" },
    { title: "First Mastery", skills: classData.firstMastery || [], type: "mastery", grouped: true },
    { title: "Second Mastery", skills: classData.secondMastery || [], type: "mastery", grouped: true },
    { title: "Third Mastery", skills: classData.thirdMastery || [], type: "mastery", grouped: true },
    { title: "Fourth Mastery", skills: classData.fourthMastery || [], type: "mastery", grouped: true },
    { title: "Boost Skills", skills: classData.boostSkills || [], type: "boost" },
    { title: "Common Skills", skills: classData.commonSkills || [], type: "common" },
  ];
}

function getRenderableSkills(className, classData, character) {
  const rendered = new Set();
  const safeClass = normalizeClassName(className);
  const rows = [];

  getSkillGroups(classData).forEach((group) => {
    const skills = [...new Set((group.skills || []).filter(Boolean))];
    if (skills.length === 0) return;

    if (group.grouped) {
      const primary = skills[0];
      const normalized = normalizeSkillName(primary);
      if (rendered.has(normalized)) return;
      rendered.add(normalized);
      rows.push(buildSkillRow(group, primary, skills.slice(1), safeClass, character, classData));
      return;
    }

    skills.forEach((skillName) => {
      const normalized = normalizeSkillName(skillName);
      if (rendered.has(normalized)) return;
      rendered.add(normalized);
      rows.push(buildSkillRow(group, skillName, [], safeClass, character, classData));
    });
  });

  return rows;
}

function buildSkillRow(group, skillName, linkedSkills, safeClass, character, classData) {
  const realType = detectSkillType(skillName, classData) === "unknown" ? group.type : detectSkillType(skillName, classData);
  const costType = realType === "ascent" ? "origin" : realType;
  const maxLevel = costsData?.[costType]?.max || globalSkills[skillName]?.maxLevel || 30;
  const currentLevel = Number(character.hexa?.skills?.[skillName] || 0);
  const desiredLevel = Number(character.hexa?.desired?.[skillName] ?? currentLevel);
  const spent = getCostBetween(realType, 0, currentLevel);
  const toDesired = getCostBetween(realType, currentLevel, desiredLevel);
  const remaining = getCostBetween(realType, currentLevel, maxLevel);
  const safeName = normalizeSkillName(skillName);

  return {
    groupTitle: group.title,
    skillName,
    linkedSkills,
    type: realType,
    maxLevel,
    currentLevel,
    desiredLevel,
    spent,
    toDesired,
    remaining,
    image: `assets/skills/${safeClass}/Skill_${safeName}.png`,
    disabled: false,
  };
}

function setFragmentsStatus(message, state = "neutral") {
  if (!fragmentsStatus) return;
  fragmentsStatus.textContent = message;
  fragmentsStatus.dataset.state = state;
}

function persistHexaValue(characterId, kind, skillName, value) {
  const characters = loadCharacters();
  const character = characters.find((item) => item.id === characterId);
  if (!character) return;

  character.hexa = character.hexa || { skills: {}, desired: {} };
  character.hexa.skills = character.hexa.skills || {};
  character.hexa.desired = character.hexa.desired || {};

  if (kind === "skills") {
    character.hexa.skills[skillName] = value;
    if ((character.hexa.desired[skillName] ?? 0) < value) {
      character.hexa.desired[skillName] = value;
    }
  } else {
    character.hexa.desired[skillName] = value;
  }

  saveCharacters(characters);
  if (character.id === localStorage.getItem(ACTIVE_CHARACTER_ID_KEY)) {
    localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
  }
}

async function renderFragmentsPage() {
  const characters = loadCharacters();
  const character = getActiveCharacter(characters);

  if (!character) {
    if (skillsGrid) skillsGrid.innerHTML = "";
    if (fragmentsCharacterName) fragmentsCharacterName.textContent = "Sin personaje activo";
    if (fragmentsCharacterClass) fragmentsCharacterClass.textContent = "Agrega un personaje en Mi Personaje";
    setFragmentsStatus("Necesitas agregar un personaje antes de trackear fragmentos.", "error");
    return;
  }

  await ensureHexaData();

  const className = character.jobName;
  const classData = skillsData?.[className];
  if (!classData) {
    if (skillsGrid) skillsGrid.innerHTML = "";
    setFragmentsStatus(`No encontre skills para la clase ${className}.`, "error");
    return;
  }

  if (fragmentsCharacterName) fragmentsCharacterName.textContent = character.name;
  if (fragmentsCharacterClass) fragmentsCharacterClass.textContent = `${className} - ${character.worldName || character.region?.toUpperCase()}`;
  if (fragmentsCharacterSelect) {
    fragmentsCharacterSelect.innerHTML = characters
      .map((item) => `<option value="${item.id}" ${item.id === character.id ? "selected" : ""}>${item.name} - ${item.jobName}</option>`)
      .join("");
  }
  if (fragmentsCharacterAvatar) {
    fragmentsCharacterAvatar.textContent = character.characterImgURL ? "" : (character.name?.[0] || "?");
    fragmentsCharacterAvatar.style.backgroundImage = character.characterImgURL ? `url("${character.characterImgURL}")` : "";
  }

  const rows = getRenderableSkills(className, classData, character);
  const totals = rows.reduce((acc, row) => {
    acc.spent += row.spent.frags;
    acc.desired += row.toDesired.frags;
    acc.remaining += row.remaining.frags;
    return acc;
  }, { spent: 0, desired: 0, remaining: 0 });

  if (fragsSpentTotal) fragsSpentTotal.textContent = formatRank(totals.spent);
  if (fragsDesiredTotal) fragsDesiredTotal.textContent = formatRank(totals.desired);
  if (fragsRemainingTotal) fragsRemainingTotal.textContent = formatRank(totals.remaining);

  if (skillsGrid) {
    let currentGroup = "";
    skillsGrid.innerHTML = rows.map((row) => {
      const groupHeader = row.groupTitle !== currentGroup
        ? (currentGroup = row.groupTitle, `<h3 class="skill-group-title">${row.groupTitle}</h3>`)
        : "";
      return `${groupHeader}
        <article class="skill-card ${row.disabled ? "disabled" : ""}" data-skill-name="${row.skillName}" data-character-id="${character.id}" data-max-level="${row.maxLevel}">
          <img src="${row.image}" alt="${row.skillName}" onerror="this.src='assets/manualentry.png'" />
          <div class="skill-card-main">
            <div class="skill-card-title">
              <div>
                <h4>${row.skillName}</h4>
                ${row.linkedSkills.length ? `<p>+ ${row.linkedSkills.join(", ")}</p>` : `<p>${row.type}</p>`}
              </div>
              <span>${row.currentLevel}/${row.maxLevel}</span>
            </div>
            <div class="skill-inputs">
              <label>Actual <input data-hexa-field="skills" type="number" min="0" max="${row.maxLevel}" value="${row.currentLevel}" ${row.disabled ? "disabled" : ""}></label>
              <label>Objetivo <input data-hexa-field="desired" type="number" min="${row.currentLevel}" max="${row.maxLevel}" value="${row.desiredLevel}" ${row.disabled ? "disabled" : ""}></label>
            </div>
            <div class="skill-costs">
              <span>Gastado <strong>${formatRank(row.spent.frags)}</strong></span>
              <span>Objetivo <strong>${formatRank(row.toDesired.frags)}</strong></span>
              <span>Max <strong>${formatRank(row.remaining.frags)}</strong></span>
            </div>
          </div>
        </article>`;
    }).join("");
  }

  setFragmentsStatus(`${rows.length} skills cargadas para ${className}.`, "success");
}

sidebarChar?.addEventListener("click", showCharacterPage);
characterNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showCharacterPage();
});
bossNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showBossPage();
});
fragmentsNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showFragmentsPage();
});
chatbotNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showChatBotPage();
});

chatbotIframe?.addEventListener("load", () => {
  chatbotFallback?.classList.add("hidden");
});

closeCharacterPanel?.addEventListener("click", showBossPage);

fragmentsCharacterSelect?.addEventListener("change", async () => {
  setActiveCharacter(fragmentsCharacterSelect.value);
  await renderFragmentsPage();
});

characterSearchForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const ign = characterIgn?.value.trim();
  const region = characterRegion?.value || "na";

  if (!ign) {
    setCharacterStatus("Escribe un IGN primero.", "error");
    return;
  }

  fetchCharacterBtn.disabled = true;
  fetchCharacterBtn.textContent = "Buscando...";
  setCharacterStatus("Consultando MapleHub...", "loading");

  try {
    const character = await fetchMapleHubCharacter(ign, region);
    saveActiveCharacter(character);
    renderCharacter(character);
    setCharacterStatus(`${character.name} agregado al roster.`, "success");
  } catch (error) {
    console.error("MapleHub character fetch error:", error);
    setCharacterStatus(error.message || "No se pudo obtener el personaje.", "error");
  } finally {
    fetchCharacterBtn.disabled = false;
    fetchCharacterBtn.textContent = "Agregar";
  }
});

characterRoster?.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  const card = event.target.closest(".roster-card");
  if (!button || !card) return;

  const characterId = card.dataset.characterId;
  const action = button.dataset.action;
  const character = loadCharacters().find((item) => item.id === characterId);
  if (!character) return;

  if (action === "active") {
    setActiveCharacter(characterId);
    setCharacterStatus(`${character.name} es el personaje activo.`, "success");
    return;
  }

  if (action === "remove") {
    removeCharacter(characterId);
    setCharacterStatus(`${character.name} eliminado del roster.`, "success");
    return;
  }

  if (action === "refresh") {
    button.disabled = true;
    button.textContent = "Actualizando...";
    setCharacterStatus(`Actualizando ${character.name}...`, "loading");
    try {
      const updated = await fetchMapleHubCharacter(character.name, character.region || "na");
      saveActiveCharacter(updated);
      renderCharacter(updated);
      setCharacterStatus(`${updated.name} actualizado desde MapleHub.`, "success");
    } catch (error) {
      console.error("MapleHub refresh error:", error);
      setCharacterStatus(error.message || "No se pudo actualizar el personaje.", "error");
    } finally {
      button.disabled = false;
      button.textContent = "Refrescar";
    }
  }
});

skillsGrid?.addEventListener("change", async (event) => {
  const input = event.target.closest("input[data-hexa-field]");
  const card = event.target.closest(".skill-card");
  if (!input || !card) return;

  const maxLevel = Number(card.dataset.maxLevel) || 30;
  const characterId = card.dataset.characterId;
  const skillName = card.dataset.skillName;
  const field = input.dataset.hexaField;
  let value = Math.max(0, Math.min(maxLevel, Number(input.value) || 0));

  if (field === "desired") {
    const currentInput = card.querySelector('input[data-hexa-field="skills"]');
    value = Math.max(Number(currentInput?.value) || 0, value);
  }

  persistHexaValue(characterId, field, skillName, value);
  await renderFragmentsPage();
});

fragmentsResetBtn?.addEventListener("click", async () => {
  const characters = loadCharacters();
  const character = getActiveCharacter(characters);
  if (!character) return;
  character.hexa = { skills: {}, desired: {} };
  saveCharacters(characters);
  localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
  await renderFragmentsPage();
  setFragmentsStatus(`Niveles de ${character.name} reseteados.`, "success");
});

fragmentsMaxDesiredBtn?.addEventListener("click", async () => {
  const characters = loadCharacters();
  const character = getActiveCharacter(characters);
  if (!character) return;
  await ensureHexaData();
  const classData = skillsData?.[character.jobName];
  if (!classData) return;

  character.hexa = character.hexa || { skills: {}, desired: {} };
  character.hexa.desired = character.hexa.desired || {};
  getRenderableSkills(character.jobName, classData, character)
    .filter((row) => !row.disabled)
    .forEach((row) => {
      character.hexa.desired[row.skillName] = row.maxLevel;
    });

  saveCharacters(characters);
  localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
  await renderFragmentsPage();
  setFragmentsStatus(`Objetivo max aplicado a ${character.name}.`, "success");
});

selectBoss("gloom");
const savedCharacters = loadCharacters();
const activeCharacter = getActiveCharacter(savedCharacters);
renderCharacter(activeCharacter);
renderRoster(savedCharacters, activeCharacter?.id);
