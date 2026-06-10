const TIMEZONE_OPTIONS = [
  { value: "", label: "Sin especificar" },
  { value: "UTC-5 (Peru, Colombia, Panama - reset 7:00pm)", label: "UTC-5 — Peru, Colombia, Panama (reset 7:00pm)", shortLabel: "Peru/Colombia/Panama", resetHour: 19 },
  { value: "UTC-4 (Bolivia, Venezuela, Rep. Dominicana - reset 8:00pm)", label: "UTC-4 — Bolivia, Venezuela, Rep. Dominicana (reset 8:00pm)", shortLabel: "Bolivia/Venezuela/Rep. Dominicana", resetHour: 20 },
  { value: "UTC-3 (Argentina, Chile, Brasil - reset 9:00pm)", label: "UTC-3 — Argentina, Chile, Brasil (reset 9:00pm)", shortLabel: "Argentina/Chile/Brasil", resetHour: 21 },
  { value: "UTC-6 (Mexico, Centroamerica - reset 6:00pm)", label: "UTC-6 — Mexico, Centroamerica (reset 6:00pm)", shortLabel: "Mexico/Centroamerica", resetHour: 18 },
  { value: "UTC-8 (EE.UU. Pacifico - reset 4:00pm)", label: "UTC-8 — EE.UU. Pacifico (reset 4:00pm)", shortLabel: "EE.UU. Pacifico", resetHour: 16 },
  { value: "UTC-7 (EE.UU. Montana - reset 5:00pm)", label: "UTC-7 — EE.UU. Montana (reset 5:00pm)", shortLabel: "EE.UU. Montana", resetHour: 17 },
  { value: "UTC+0 (Reino Unido, Portugal - reset 12:00am)", label: "UTC+0 — Reino Unido, Portugal (reset 12:00am)", shortLabel: "Reino Unido/Portugal", resetHour: 0 },
  { value: "UTC+1 (Espana - reset 1:00am)", label: "UTC+1 — Espana (reset 1:00am)", shortLabel: "Espana", resetHour: 1 },
  { value: "UTC+8 (China, Filipinas, Singapur - reset 10:00am)", label: "UTC+8 — China, Filipinas, Singapur (reset 10:00am)", shortLabel: "China/Filipinas/Singapur", resetHour: 10 },
  { value: "UTC+9 (Japon, Corea del Sur - reset 9:00am)", label: "UTC+9 — Japon, Corea del Sur (reset 9:00am)", shortLabel: "Japon/Corea del Sur", resetHour: 9 },
  { value: "UTC+10 (Australia Este - reset 11:00am)", label: "UTC+10 — Australia Este (reset 11:00am)", shortLabel: "Australia Este", resetHour: 11 },
  { value: "UTC+12 (Nueva Zelanda - reset 1:00pm)", label: "UTC+12 — Nueva Zelanda (reset 1:00pm)", shortLabel: "Nueva Zelanda", resetHour: 13 },
];

function populateTimezoneSelect(select) {
  if (!select || select.options.length) return;
  select.innerHTML = TIMEZONE_OPTIONS.map((tz) => `<option value="${tz.value}">${tz.label}</option>`).join("");
}

const RUN_TIME_OFFSETS = Array.from({ length: 36 }, (_, index) => index - 12);

function formatRunClock(hour24) {
  const normalized = ((hour24 % 24) + 24) % 24;
  const period = normalized < 12 ? "am" : "pm";
  let hour12 = normalized % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:00${period}`;
}

function getTimezoneOption(value) {
  return TIMEZONE_OPTIONS.find((tz) => tz.value === value) || null;
}

function getRunOffsetKey(value) {
  if (String(value || "").startsWith("Reset")) return "Reset";
  return String(value || "").match(/^([+-]\d+)/)?.[1] || "";
}

function buildRunTimeOptions(timezoneValue) {
  const timezone = getTimezoneOption(timezoneValue);
  if (!timezone?.value) return [{ value: "", label: "Sin especificar" }];

  const zoneLabel = timezone.shortLabel || "zona seleccionada";
  return [
    { value: "", label: "Sin especificar" },
    ...RUN_TIME_OFFSETS.map((offset) => {
      const clock = formatRunClock(timezone.resetHour + offset);
      const offsetLabel = offset === 0 ? "Reset" : (offset > 0 ? `+${offset}` : `${offset}`);
      return {
        value: `${offsetLabel} - ${clock} (hora ${zoneLabel})`,
        label: `${offsetLabel} - ${clock} (hora ${zoneLabel})`,
      };
    }),
  ];
}

function populateRunTimeSelect(select, timezoneValue, preferredValue = select?.value || "") {
  if (!select) return;
  const previousOffset = getRunOffsetKey(preferredValue);
  const options = buildRunTimeOptions(timezoneValue);
  select.innerHTML = options.map((rt) => `<option value="${rt.value}">${rt.label}</option>`).join("");

  const exactOption = options.find((rt) => rt.value === preferredValue);
  const offsetOption = previousOffset ? options.find((rt) => getRunOffsetKey(rt.value) === previousOffset) : null;
  select.value = exactOption?.value || offsetOption?.value || "";
}

function syncPartyRunTimeOptions(preferredValue = partysRunTimeSelect?.value || "") {
  populateRunTimeSelect(partysRunTimeSelect, partysTimezoneSelect?.value || "", preferredValue);
}

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

const PARTY_BOSS_OPTIONS = [
  "Balrog",
  "Monster Park Extreme",
  "Zakum",
  "Magnus",
  "Hilla",
  "OMNI-CLN",
  "Papulatus",
  "Pierre",
  "Von Bon",
  "Crimson Queen",
  "Vellum",
  "Von Leon",
  "Horntail",
  "Arkarium",
  "Pink Bean",
  "Cygnus",
  "Lotus",
  "Damien",
  "Guardian Angel Slime",
  "Lucid",
  "Will",
  "Gloom",
  "Verus Hilla",
  "Darknell",
  "Black Mage",
  "Chosen Seren",
  "Kalos the Guardian",
  "Kaling",
  "Limbo",
  "Gollux",
  "Ranmaru",
  "Princess No",
  "Akechi Mitsuhide",
  "Baldrix",
  "First Adversary",
].map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
}));

const PARTY_BOSS_CARD_IMAGES = {
  "lucid": "assets/party-boss-cards/lucid.png",
  "guardian-angel-slime": "assets/party-boss-cards/guardian-angel-slime.png",
};

const PARTY_BOSS_ACCENT_COLORS = [
  "#facc15", "#34d399", "#38bdf8", "#fb923c", "#f472b6",
  "#a78bfa", "#f87171", "#2dd4bf", "#a3e635", "#60a5fa",
];

function getBossAccentColor(bossId) {
  let hash = 0;
  for (let i = 0; i < bossId.length; i += 1) {
    hash = (hash * 31 + bossId.charCodeAt(i)) >>> 0;
  }
  return PARTY_BOSS_ACCENT_COLORS[hash % PARTY_BOSS_ACCENT_COLORS.length];
}

const PARTYS_PLAYER_COLUMN_MAX = 6;

const DEFAULT_PARTY_DIFFICULTIES = ["Easy", "Normal", "Hard", "Chaos", "Extreme"];
const PARTY_BOSS_DIFFICULTIES = {
  "baldrix": ["Normal", "Hard"],
  "limbo": ["Normal", "Hard"],
  "kaling": ["Easy", "Normal", "Hard", "Extreme"],
  "first-adversary": ["Easy", "Normal", "Hard", "Extreme"],
  "kalos-the-guardian": ["Easy", "Normal", "Chaos", "Extreme"],
  "chosen-seren": ["Normal", "Hard", "Extreme"],
  "black-mage": ["Hard", "Extreme"],
  "darknell": ["Normal", "Hard"],
  "verus-hilla": ["Normal", "Hard"],
  "gloom": ["Normal", "Chaos"],
  "will": ["Easy", "Normal", "Hard"],
  "lucid": ["Easy", "Normal", "Hard"],
  "guardian-angel-slime": ["Normal", "Chaos"],
  "damien": ["Normal", "Hard"],
  "lotus": ["Normal", "Hard", "Extreme"],
};

// ── DOM refs ──────────────────────────────────────────────────────────────
const bgLayer = document.getElementById("bgLayer");
const showcase = document.getElementById("showcase");
const infoPanel = document.getElementById("infoPanel");
const infoRegion = document.getElementById("infoRegion");
const infoName = document.getElementById("infoName");
const infoTags = document.getElementById("infoTags");
const infoStats = document.getElementById("infoStats");
const bossSprite = document.getElementById("bossSprite");
const bossAccessories = document.getElementById("bossAccessories");
const bossWrap = document.querySelector(".boss-wrap");
const selector = document.getElementById("bossSelector");
const sidebarChar = document.getElementById("sidebarChar");
const sidebarCharName = document.getElementById("sidebarCharName");
const sidebarCharRole = document.getElementById("sidebarCharRole");
const sidebarCharSub = document.querySelector(".sidebar-char-sub");
const sidebarCharAvatar = document.getElementById("sidebarCharAvatar");
const dashboardNav = document.getElementById("dashboardNav");
const dashboardPage = document.getElementById("dashboardPage");
const characterNav = document.getElementById("characterNav");
const bossNav = document.getElementById("bossNav");
const fragmentsNav = document.getElementById("fragmentsNav");
const chatbotNav = document.getElementById("chatbotNav");
const characterPanel = document.getElementById("characterPanel");
const fragmentsPage = document.getElementById("fragmentsPage");
const chatbotPage = document.getElementById("chatbotPage");
const partysNav = document.getElementById("partysNav");
const partysPage = document.getElementById("partysPage");
const adminNav = document.getElementById("adminNav");
const adminNavGroup = document.getElementById("adminNavGroup");
const adminPage = document.getElementById("adminPage");
const adminGuildFilterNav = document.getElementById("adminGuildFilterNav");
const adminUsersBody = document.getElementById("adminUsersBody");
const adminStatus = document.getElementById("adminStatus");
const partysOwnSectionTab = document.getElementById("partysOwnSectionTab");
const partysAllianceSectionTab = document.getElementById("partysAllianceSectionTab");
const partysCreateTab = document.getElementById("partysCreateTab");
const partysListTab = document.getElementById("partysListTab");
const partysBossSelectRow = document.getElementById("partysBossSelectRow");
const partysBossFilter = document.getElementById("partysBossFilter");
const partysBossFilterToggle = document.getElementById("partysBossFilterToggle");
const partysBossFilterPanel = document.getElementById("partysBossFilterPanel");
const partysBossFilterList = document.getElementById("partysBossFilterList");
const partysBossFilterAll = document.getElementById("partysBossFilterAll");
const partysBossFilterNone = document.getElementById("partysBossFilterNone");
const partysViewMode_ = document.getElementById("partysViewMode");
const partysViewModeToggle = document.getElementById("partysViewModeToggle");
const partysViewModePanel = document.getElementById("partysViewModePanel");
const partysViewModeOptions = document.querySelectorAll(".partys-view-mode-option");
const partysViewModePlayerRow = document.getElementById("partysViewModePlayerRow");
const partysViewModePlayerSelect = document.getElementById("partysViewModePlayerSelect");
const partysCreateBossSelect = document.getElementById("partysCreateBossSelect");
const partysCreateView = document.getElementById("partysCreateView");
const partysListView = document.getElementById("partysListView");
const partysRoster = document.getElementById("partysRoster");
const partySlotsGrid = document.getElementById("partySlotsGrid");
const partysSaveBtn = document.getElementById("partysSaveBtn");
const partysDifficultySelect = document.getElementById("partysDifficultySelect");
const partysTimezoneSelect = document.getElementById("partysTimezoneSelect");
populateTimezoneSelect(partysTimezoneSelect);
const partysRunTimeSelect = document.getElementById("partysRunTimeSelect");
syncPartyRunTimeOptions();
const partysDestinationSelect = document.getElementById("partysDestinationSelect");
const partysStatus = document.getElementById("partysStatus");
const partysGrid = document.getElementById("partysGrid");
const closeCharacterPanel = document.getElementById("closeCharacterPanel");
const characterSearchForm = document.getElementById("characterSearchForm");
const characterIgn = document.getElementById("characterIgn");
const characterRegion = document.getElementById("characterRegion");
const fetchCharacterBtn = document.getElementById("fetchCharacterBtn");
const characterStatus = document.getElementById("characterStatus");
const characterPortrait = document.getElementById("characterPortrait");
const characterPortraitEmpty = document.getElementById("characterPortraitEmpty");
const characterWorld = document.getElementById("characterWorld");
const characterName = document.getElementById("characterName");
const characterJob = document.getElementById("characterJob");
const characterLevel = document.getElementById("characterLevel");
const characterRank = document.getElementById("characterRank");
const characterJobRank = document.getElementById("characterJobRank");
const characterGlobalRank = document.getElementById("characterGlobalRank");
const characterCount = document.getElementById("characterCount");
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
const loginScreen = document.getElementById("loginScreen");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginStatus = document.getElementById("loginStatus");
const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword = document.getElementById("registerConfirmPassword");
const registerToken = document.getElementById("registerToken");
const registerTimezone = document.getElementById("registerTimezone");
populateTimezoneSelect(registerTimezone);
const registerStatus = document.getElementById("registerStatus");
const registerUserBtn = document.getElementById("registerUserBtn");
const backToLoginBtn = document.getElementById("backToLoginBtn");
const clearLoginBtn = document.getElementById("clearLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

let activeId = null;
let appShellInitialized = false;
let charactersCache = [];
const ACTIVE_CHARACTER_ID_KEY = "mapletools_active_character_id";
const API_BASE_URL = String(window.MAPLETOOLS_API_BASE || "").replace(/\/$/, "");
let skillsData = null;
let costsData = null;

async function getAuthToken() {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

async function fetchAuthedJson(path, options = {}) {
  const token = await getAuthToken();
  if (!token) throw new Error("No hay sesion activa.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `API respondio HTTP ${response.status}`);
  }

  return result;
}

function setLoginStatus(message, state = "neutral") {
  if (!loginStatus) return;
  loginStatus.textContent = message;
  loginStatus.dataset.state = state;
}

function setRegisterStatus(message, state = "neutral") {
  if (!registerStatus) return;
  registerStatus.textContent = message;
  registerStatus.dataset.state = state;
}

function normalizeUsername(value) {
  // Trim, lower-case, remove spaces and strip characters that could
  // break email-based auth (keeps letters, numbers, dot, underscore, hyphen).
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function getFirebaseAuth() {
  if (!window.firebase?.auth) return null;
  return window.firebase.auth();
}

function usernameToAuthEmail(username) {
  return username.includes("@") ? username : `${username}@imanity.local`;
}

function getRegisterAuthEmail(username, email) {
  return email || usernameToAuthEmail(username);
}

function getAuthErrorMessage(error) {
  const code = error?.code || "";
  if (code === "auth/email-already-in-use") return "Ese usuario ya existe. Usa Login para entrar.";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") return "Usuario o password incorrecto.";
  if (code === "auth/user-not-found") return "Usuario no registrado. Presiona Register primero.";
  if (code === "auth/weak-password") return "El password debe tener al menos 6 caracteres.";
  if (code === "auth/operation-not-allowed") return "Activa Email/Password en Firebase Authentication.";
  if (code === "auth/configuration-not-found") return "Inicializa Firebase Authentication y activa Email/Password.";
  if (code === "auth/network-request-failed") return "No hay conexion con Firebase Auth.";
  return error?.message || "No se pudo autenticar con Firebase.";
}

function setAuthButtonsDisabled(disabled) {
  const submitButton = loginForm?.querySelector('button[type="submit"]');
  const registerSubmitButton = registerForm?.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = disabled;
  if (registerUserBtn) registerUserBtn.disabled = disabled;
  if (registerSubmitButton) registerSubmitButton.disabled = disabled;
  if (backToLoginBtn) backToLoginBtn.disabled = disabled;
}

function showRegisterPanel() {
  loginScreen?.classList.add("register-mode");
  registerForm?.classList.remove("hidden");
  setLoginStatus("");
  setRegisterStatus("");
  if (registerUsername && loginUsername?.value) {
    registerUsername.value = loginUsername.value;
  }
  registerUsername?.focus();
}

function showLoginPanel(message = "") {
  loginScreen?.classList.remove("register-mode");
  registerForm?.classList.add("hidden");
  setRegisterStatus("");
  setLoginStatus(message);
  loginUsername?.focus();
}

function showAppSession(username) {
  document.body.classList.remove("auth-locked");
  loginScreen?.classList.add("hidden");
}

function showLoginSession(message = "") {
  document.body.classList.add("auth-locked");
  loginScreen?.classList.remove("hidden");
  setLoginStatus(message);
  loginUsername?.focus();
}

function initializeAuthenticatedApp() {
  if (appShellInitialized) return;
  appShellInitialized = true;

  selectBoss("gloom");
  renderCharacter(null);
  renderRoster([]);
  showDashboardPage();
}

function normalizeRemoteCharacter(character) {
  const id = `${(character.region || "na").toLowerCase()}:${(character.name || "").toLowerCase()}`;
  return {
    id,
    name: character.name || "",
    region: character.region || "na",
    jobName: character.jobName || "",
    level: character.level ?? "-",
    worldName: character.worldName || "",
    characterImgURL: character.characterImgURL || "",
    source: character.source || "dataconnect",
    fetchedAt: character.fetchedAt || character.updatedAt || null,
    ranking: {},
  };
}

async function syncCurrentUserProfile(firebaseUser) {
  const username = normalizeUsername(firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "usuario");
  return fetchAuthedJson("/api/me", {
    method: "POST",
    body: JSON.stringify({
      username,
      displayName: firebaseUser.displayName || username,
      email: firebaseUser.email || "",
    }),
  });
}

async function loadRemoteCharacters() {
  const result = await fetchAuthedJson("/api/characters");
  charactersCache = (result.characters || []).map(normalizeRemoteCharacter);
  const activeCharacter = getActiveCharacter(charactersCache);
  renderCharacter(activeCharacter);
  renderRoster(charactersCache, activeCharacter?.id);
  return charactersCache;
}

async function saveRemoteCharacter(character) {
  const result = await fetchAuthedJson("/api/characters", {
    method: "POST",
    body: JSON.stringify({
      region: character.region || "na",
      name: character.name,
      jobName: character.jobName || null,
      level: Number.isFinite(Number(character.level)) ? Number(character.level) : null,
      worldName: character.worldName || null,
      characterImgURL: character.characterImgURL || null,
      source: character.source || "maplehub",
      fetchedAt: character.fetchedAt || new Date().toISOString(),
    }),
  });
  charactersCache = (result.characters || []).map(normalizeRemoteCharacter);
  return charactersCache;
}

async function hydrateAuthenticatedData(firebaseUser) {
  try {
    await syncCurrentUserProfile(firebaseUser);
    await loadCurrentUserProfile();
    applyRoleVisibility();
    updateSidebarRoleBadge();
    await loadRemoteCharacters();
  } catch (error) {
    console.error("Data Connect sync error:", error);
    setLoginStatus(error.message || "No se pudo cargar la base de datos.", "error");
  }
}

async function registerFirebaseUser(event) {
  event?.preventDefault();
  const username = normalizeUsername(registerUsername?.value);
  const email = normalizeEmail(registerEmail?.value);
  const password = registerPassword?.value || "";
  const confirmPassword = registerConfirmPassword?.value || "";
  const inviteToken = registerToken?.value || "";
  const guild = registerForm?.querySelector('input[name="guild"]:checked')?.value || "";
  const timezone = document.getElementById("registerTimezone")?.value || "";

  if (!username || !password || !inviteToken) {
    setRegisterStatus("Completa usuario, password y token.", "error");
    return;
  }

  if (!guild) {
    setRegisterStatus("Selecciona tu gremio (Imanity o Lorien).", "error");
    return;
  }

  if (password.length < 6) {
    setRegisterStatus("El password debe tener al menos 6 caracteres.", "error");
    return;
  }

  if (password !== confirmPassword) {
    setRegisterStatus("Los passwords no coinciden.", "error");
    return;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    setRegisterStatus("Firebase Auth no cargo. Recarga la pagina.", "error");
    return;
  }

  setAuthButtonsDisabled(true);
  setRegisterStatus("Validando token...", "loading");

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, inviteToken, guild, timezone }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "No se pudo crear la cuenta.");
    }

    setRegisterStatus("Cuenta creada. Entrando...", "loading");
    const credential = await auth.signInWithEmailAndPassword(getRegisterAuthEmail(username, email), password);
    showAppSession(credential.user.displayName || username);
    setRegisterStatus("");
  } catch (error) {
    setRegisterStatus(error.message || getAuthErrorMessage(error), "error");
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function loginFirebaseUser(event) {
  event?.preventDefault();
  const username = normalizeUsername(loginUsername?.value);
  const password = loginPassword?.value || "";

  if (!username || !password) {
    setLoginStatus("Escribe usuario y password.", "error");
    return;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    setLoginStatus("Firebase Auth no cargo. Recarga la pagina.", "error");
    return;
  }

  setAuthButtonsDisabled(true);
  setLoginStatus("Conectando con Firebase...", "loading");

  try {
    const credential = await auth.signInWithEmailAndPassword(usernameToAuthEmail(username), password);
    showAppSession(credential.user.displayName || username);
    setLoginStatus("");
  } catch (error) {
    setLoginStatus(getAuthErrorMessage(error), "error");
  } finally {
    setAuthButtonsDisabled(false);
  }
}

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
function hideAllPages() {
  showcase?.classList.remove("character-view");
  showcase?.classList.remove("fragments-view");
  showcase?.classList.remove("chatbot-view");
  showcase?.classList.remove("partys-view");
  showcase?.classList.remove("dashboard-view");
  showcase?.classList.remove("admin-view");
  dashboardPage?.classList.add("hidden");
  characterPanel?.classList.add("hidden");
  fragmentsPage?.classList.add("hidden");
  chatbotPage?.classList.add("hidden");
  partysPage?.classList.add("hidden");
  adminPage?.classList.add("hidden");
  document.querySelectorAll(".sidebar-item").forEach((item) => item.classList.remove("active"));
}

function showDashboardPage() {
  hideAllPages();
  showcase?.classList.add("dashboard-view");
  dashboardPage?.classList.remove("hidden");
  dashboardNav?.classList.add("active");
}

function showCharacterPage() {
  hideAllPages();
  showcase?.classList.add("character-view");
  characterPanel?.classList.remove("hidden");
  characterNav?.classList.add("active");
  characterIgn?.focus();
}

function showBossPage() {
  hideAllPages();
  bossNav?.classList.add("active");
}

async function showFragmentsPage() {
  hideAllPages();
  showcase?.classList.add("fragments-view");
  fragmentsPage?.classList.remove("hidden");
  fragmentsNav?.classList.add("active");
  await renderFragmentsPage();
}

function showChatBotPage() {
  hideAllPages();
  showcase?.classList.add("chatbot-view");
  chatbotPage?.classList.remove("hidden");
  chatbotNav?.classList.add("active");
}

async function showPartysPage() {
  hideAllPages();
  showcase?.classList.add("partys-view");
  partysPage?.classList.remove("hidden");
  partysNav?.classList.add("active");
  await initPartysPage();
}

async function showAdminPage() {
  hideAllPages();
  showcase?.classList.add("admin-view");
  adminPage?.classList.remove("hidden");
  adminNav?.classList.add("active");
  await loadAdminUsers();
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
  const url = `${API_BASE_URL}/api/character/?characterName=${safeIgn}&region=${safeRegion}&_t=${timestamp}`;

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
      const fallback = await fetch(`${API_BASE_URL}/api/character-fallback/?characterName=${safeIgn}&region=${safeRegion}&_t=${timestamp}`, {
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
  setActiveCharacterId(character.id);
  renderRoster(characters, character.id);
}

function loadCharacters() {
  return charactersCache;
}

function saveCharacters(characters) {
  charactersCache = characters;
}

function upsertCharacter(character) {
  const characterWithId = {
    ...character,
    id: character.id || `${(character.region || "na").toLowerCase()}:${(character.name || "").toLowerCase()}`,
  };
  const characters = loadCharacters();
  const index = characters.findIndex((item) => item.id === characterWithId.id);
  if (index >= 0) {
    characters[index] = { ...characters[index], ...characterWithId };
  } else {
    characters.push(characterWithId);
  }
  saveCharacters(characters);
  return characters;
}

function getActiveCharacter(characters = loadCharacters()) {
  const activeId = sessionStorage.getItem(ACTIVE_CHARACTER_ID_KEY);
  return characters.find((character) => character.id === activeId) || characters[0] || null;
}

function setActiveCharacterId(characterId) {
  sessionStorage.setItem(ACTIVE_CHARACTER_ID_KEY, characterId);
}

function setActiveCharacter(characterId) {
  const characters = loadCharacters();
  const character = characters.find((item) => item.id === characterId);
  if (!character) return;
  setActiveCharacterId(character.id);
  renderCharacter(character);
  renderRoster(characters, character.id);
}

function removeCharacter(characterId) {
  const characters = loadCharacters().filter((character) => character.id !== characterId);
  saveCharacters(characters);

  const activeId = sessionStorage.getItem(ACTIVE_CHARACTER_ID_KEY);
  if (activeId === characterId) {
    const next = characters[0] || null;
    if (next) {
      setActiveCharacterId(next.id);
    } else {
      sessionStorage.removeItem(ACTIVE_CHARACTER_ID_KEY);
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

// ── Partys ────────────────────────────────────────────────────────────────
const PARTY_SLOT_COUNT = 6;
let partysGuildRoster = [];
let partysCurrentBossId = null;
let partysVisibleBossIds = new Set(PARTY_BOSS_OPTIONS.map((boss) => boss.id));
let partysViewMode = "board";
let partysSelectedPlayerId = null;
let partysCurrentParties = [];
let partySlotAssignments = new Array(PARTY_SLOT_COUNT).fill(null);
let partysInitialized = false;
let partysSection = "own"; // "own" | "alianza"
let currentUserGuild = null;
let currentUserTimezone = null;
let currentUserRole = "usuario";

function partysCurrentCategory() {
  if (partysSection === "alianza") return "alianza";
  if (currentUserGuild) return currentUserGuild;
  return currentUserRole === "admin" ? "imanity" : null;
}

function partysOwnSectionBlocked() {
  return partysSection === "own" && !currentUserGuild && currentUserRole !== "admin";
}

const GUILD_LABELS = { imanity: "Imanity", lorien: "Lorien" };
const ROLE_LABELS = { admin: "Admin", lider: "Líder", jr: "Jr", usuario: "Usuario" };

function guildLabel(guild) {
  return GUILD_LABELS[guild] || "Sin gremio";
}

function normalizeRole(value) {
  return ROLE_LABELS[value] ? value : "usuario";
}

async function loadCurrentUserProfile() {
  try {
    const data = await fetchAuthedJson("/api/me");
    currentUserGuild = data.user?.guild || null;
    currentUserTimezone = data.user?.timezone || null;
    currentUserRole = normalizeRole(data.user?.role);
  } catch (error) {
    setPartysStatus(error.message || "No se pudo cargar tu perfil de gremio.", "error");
  }
}

function updateSidebarRoleBadge() {
  if (!sidebarCharRole) return;
  let label = "";
  if (currentUserRole === "admin") {
    label = ROLE_LABELS.admin;
  } else {
    label = `${ROLE_LABELS[currentUserRole]} ${guildLabel(currentUserGuild)}`.trim();
  }
  sidebarCharRole.textContent = label;
  sidebarCharRole.classList.toggle("hidden", !label);
}

function applyRoleVisibility() {
  const isAdmin = currentUserRole === "admin";
  adminNav?.classList.toggle("hidden", !isAdmin);
  adminNavGroup?.classList.toggle("hidden", !isAdmin);
}

// ── Admin ────────────────────────────────────────────────────────────────
let adminUsersCache = [];
let adminGuildFilter = "all";
const ADMIN_GUILD_OPTIONS = [["", "Sin gremio"], ["imanity", "Imanity"], ["lorien", "Lorien"]];

async function loadAdminUsers() {
  try {
    const data = await fetchAuthedJson("/api/admin/users");
    adminUsersCache = data.users || [];
    renderAdminUsers();
  } catch (error) {
    if (adminUsersBody) {
      adminUsersBody.innerHTML = `<tr><td colspan="4">${error.message || "No se pudo cargar la lista de miembros."}</td></tr>`;
    }
  }
}

function renderAdminUsers() {
  if (!adminUsersBody) return;

  const users = adminUsersCache.filter((user) => {
    if (adminGuildFilter === "all") return true;
    return user.guild === adminGuildFilter;
  });

  if (!users.length) {
    adminUsersBody.innerHTML = `<tr><td colspan="4">Sin miembros para mostrar.</td></tr>`;
    return;
  }

  adminUsersBody.innerHTML = users.map((user) => {
    const userRole = normalizeRole(user.role);
    const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => `
      <option value="${value}" ${userRole === value ? "selected" : ""}>${label}</option>
    `).join("");

    const userGuild = user.guild || "";
    const guildOptions = ADMIN_GUILD_OPTIONS.map(([value, label]) => `
      <option value="${value}" ${userGuild === value ? "selected" : ""}>${label}</option>
    `).join("");

    return `
      <tr data-user-id="${user.id}">
        <td>${user.displayName || user.username}</td>
        <td><select class="admin-role-select" data-user-id="${user.id}">${roleOptions}</select></td>
        <td><select class="admin-guild-select" data-user-id="${user.id}">${guildOptions}</select></td>
        <td><button type="button" class="admin-remove-btn" data-user-id="${user.id}">Sacar del gremio</button></td>
      </tr>
    `;
  }).join("");
}

function setAdminStatus(message, state = "neutral") {
  if (!adminStatus) return;
  adminStatus.textContent = message;
  adminStatus.dataset.state = state;
}

async function updateAdminUserRole(userId, role) {
  setAdminStatus("Guardando rol...", "neutral");
  try {
    await fetchAuthedJson("/api/admin/users/role", {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    });
    const user = adminUsersCache.find((u) => u.id === userId);
    if (user) user.role = role;
    setAdminStatus("Rol actualizado correctamente.", "success");
  } catch (error) {
    setAdminStatus(error.message || "No se pudo actualizar el rol.", "error");
    renderAdminUsers();
  }
}

async function updateAdminUserGuild(userId, guild) {
  setAdminStatus("Guardando facción...", "neutral");
  try {
    await fetchAuthedJson("/api/admin/users/guild", {
      method: "POST",
      body: JSON.stringify({ userId, guild: guild || null }),
    });
    const user = adminUsersCache.find((u) => u.id === userId);
    if (user) user.guild = guild || null;
    renderAdminUsers();
    setAdminStatus("Facción actualizada correctamente.", "success");
  } catch (error) {
    setAdminStatus(error.message || "No se pudo actualizar la facción.", "error");
    renderAdminUsers();
  }
}

async function removeAdminUserFromGuild(userId) {
  if (!confirm("Sacar a este miembro de su gremio?")) return;
  setAdminStatus("Actualizando...", "neutral");
  try {
    await fetchAuthedJson("/api/admin/users/guild", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    const user = adminUsersCache.find((u) => u.id === userId);
    if (user) user.guild = null;
    renderAdminUsers();
    setAdminStatus("Miembro sacado del gremio.", "success");
  } catch (error) {
    setAdminStatus(error.message || "No se pudo sacar al usuario del gremio.", "error");
  }
}

adminUsersBody?.addEventListener("change", (event) => {
  const roleSelect = event.target.closest(".admin-role-select");
  if (roleSelect) {
    updateAdminUserRole(roleSelect.dataset.userId, roleSelect.value);
    return;
  }
  const guildSelect = event.target.closest(".admin-guild-select");
  if (guildSelect) {
    updateAdminUserGuild(guildSelect.dataset.userId, guildSelect.value);
  }
});

adminUsersBody?.addEventListener("click", (event) => {
  const button = event.target.closest(".admin-remove-btn");
  if (!button) return;
  removeAdminUserFromGuild(button.dataset.userId);
});

adminGuildFilterNav?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-guild-filter]");
  if (!button) return;
  adminGuildFilter = button.dataset.guildFilter;
  adminGuildFilterNav.querySelectorAll("[data-guild-filter]").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  renderAdminUsers();
});

function setPartysStatus(message, state = "neutral") {
  if (!partysStatus) return;
  partysStatus.textContent = message;
  partysStatus.dataset.state = state;
}

function getCurrentUserId() {
  return getFirebaseAuth()?.currentUser?.uid || null;
}

function rosterCharacterKey(character) {
  return `${character.ownerId || ""}:${(character.region || "").toLowerCase()}:${(character.name || "").toLowerCase()}`;
}

function findOwnerUsername(ownerId) {
  const character = partysGuildRoster.find((c) => c.ownerId === ownerId);
  return character?.owner?.username || null;
}

function getPartyBossLabel(bossId) {
  return PARTY_BOSS_OPTIONS.find((boss) => boss.id === bossId)?.name
    || BOSSES.find((boss) => boss.id === bossId)?.name
    || bossId;
}

function getPartyBossDifficulties(bossId) {
  return PARTY_BOSS_DIFFICULTIES[bossId] || DEFAULT_PARTY_DIFFICULTIES;
}

function populatePartysDifficultySelect(preferredValue = partysDifficultySelect?.value || "") {
  if (!partysDifficultySelect) return;
  const difficulties = getPartyBossDifficulties(partysCurrentBossId);
  partysDifficultySelect.innerHTML = difficulties
    .map((difficulty) => `<option value="${difficulty}">${difficulty}</option>`)
    .join("");
  partysDifficultySelect.value = difficulties.includes(preferredValue)
    ? preferredValue
    : difficulties[0] || "";
}

function populatePartysBossSelect() {
  const optionsMarkup = PARTY_BOSS_OPTIONS.map((boss) => `<option value="${boss.id}">${boss.name}</option>`).join("");
  if (partysCreateBossSelect && !partysCreateBossSelect.options.length) {
    partysCreateBossSelect.innerHTML = optionsMarkup;
  }
  if (partysBossFilterList && !partysBossFilterList.children.length) {
    partysBossFilterList.innerHTML = PARTY_BOSS_OPTIONS.map((boss) => `
      <label>
        <input type="checkbox" data-boss-filter-id="${boss.id}" checked />
        ${boss.name}
      </label>
    `).join("");
  }
}

function syncPartysBossSelects() {
  if (partysCreateBossSelect) partysCreateBossSelect.value = partysCurrentBossId || "";
  populatePartysDifficultySelect();
}

function populatePartysPlayerSelect() {
  if (!partysViewModePlayerSelect) return;

  const players = new Map();
  partysGuildRoster.forEach((character) => {
    if (character.ownerId && character.owner?.username && !players.has(character.ownerId)) {
      players.set(character.ownerId, character.owner.username);
    }
  });

  const currentUserId = getCurrentUserId();
  if (!players.size) {
    partysViewModePlayerSelect.innerHTML = `<option value="">Sin jugadores</option>`;
    partysSelectedPlayerId = null;
    return;
  }

  if (!partysSelectedPlayerId || !players.has(partysSelectedPlayerId)) {
    partysSelectedPlayerId = players.has(currentUserId) ? currentUserId : players.keys().next().value;
  }

  partysViewModePlayerSelect.innerHTML = Array.from(players.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([ownerId, username]) => `<option value="${ownerId}">${username}</option>`)
    .join("");
  partysViewModePlayerSelect.value = partysSelectedPlayerId;
}

function findRosterCharacter(ownerId, region, name) {
  return partysGuildRoster.find((c) => c.ownerId === ownerId && c.region === region && c.name === name) || null;
}

async function loadGuildRoster() {
  if (partysOwnSectionBlocked()) {
    partysGuildRoster = [];
    return;
  }
  try {
    const query = partysSection === "own" && currentUserGuild
      ? `?guild=${encodeURIComponent(currentUserGuild)}`
      : "";
    const data = await fetchAuthedJson(`/api/roster${query}`);
    partysGuildRoster = data.characters || [];
  } catch (error) {
    setPartysStatus(error.message || "No se pudo cargar el roster del gremio.", "error");
  }
}

async function loadPartiesList() {
  const category = partysCurrentCategory();
  if (!category) {
    partysCurrentParties = [];
    return;
  }
  try {
    const params = new URLSearchParams({ category });
    const data = await fetchAuthedJson(`/api/parties?${params.toString()}`);
    partysCurrentParties = data.parties || [];
  } catch (error) {
    setPartysStatus(error.message || "No se pudieron cargar las partys.", "error");
  }
}

function renderPartysRoster() {
  if (!partysRoster) return;

  if (partysOwnSectionBlocked()) {
    partysRoster.innerHTML = `
      <div class="roster-empty">
        <h4>Sin gremio asignado</h4>
        <p>Un administrador todavía no te asignó a Imanity o Lorien. Cuando lo haga, vas a ver acá el roster de tu gremio.</p>
      </div>
    `;
    return;
  }

  if (!partysGuildRoster.length) {
    partysRoster.innerHTML = `
      <div class="roster-empty">
        <h4>Sin personajes registrados</h4>
        <p>Cuando los miembros del gremio registren sus personajes en "Mi Personaje", aparecerán aquí.</p>
      </div>
    `;
    return;
  }

  const assignedKeys = new Set(partySlotAssignments.filter(Boolean).map(rosterCharacterKey));

  partysRoster.innerHTML = partysGuildRoster.map((character) => {
    const key = rosterCharacterKey(character);
    const assigned = assignedKeys.has(key);
    return `
      <article class="roster-card ${assigned ? "assigned" : ""}" data-character-key="${key}">
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
            ${character.owner?.timezone ? `<span class="roster-timezone-badge">${character.owner.timezone}</span>` : ""}
            ${assigned ? `<span class="party-assigned-badge">En la party</span>` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

const PARTY_SLOT_SILHOUETTE = `
  <svg class="party-slot-silhouette" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="7.5" r="4.5" />
    <path d="M3.5 21c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5v.5h-17v-.5z" />
  </svg>
`;

function renderPartySlots() {
  if (!partySlotsGrid) return;

  partySlotsGrid.innerHTML = partySlotAssignments.map((slot, index) => `
    <div class="party-slot ${slot ? "filled" : "empty"}">
      <span class="party-slot-index">${index + 1}</span>
      ${slot
      ? `
          <button type="button" class="party-slot-remove" data-slot-index="${index}" aria-label="Quitar de la party">✕</button>
          <div class="party-slot-avatar">
            ${slot.characterImgURL
        ? `<img src="${slot.characterImgURL}" alt="${slot.name}" />`
        : PARTY_SLOT_SILHOUETTE}
          </div>
          <div class="party-slot-member">
            <strong>${slot.name}</strong>
            <span>${slot.jobName || "Sin clase"} · Lv. ${slot.level ?? "-"}</span>
          </div>
        `
      : `
          ${PARTY_SLOT_SILHOUETTE}
          <div class="party-slot-placeholder">Vacío</div>
        `}
    </div>
  `).join("");
}

function renderPartyCard(party, currentUserId) {
  return `
    <article class="party-card">
      <header class="party-card-header">
        <div>
          <h4>${party.label || "Party sin nombre"}</h4>
          <p class="party-card-subtitle">
            Boss: ${getPartyBossLabel(party.bossId || partysCurrentBossId)}
          </p>
          <p class="party-card-leader">
            Líder: ${findOwnerUsername(party.ownerId) || "Desconocido"}
          </p>
        </div>
        <div class="party-card-header-actions">
          ${party.ownerId === currentUserId ? `<button type="button" class="party-delete" data-party-id="${party.id}">Eliminar</button>` : ""}
          <button type="button" class="party-card-toggle" aria-expanded="false" aria-label="Mostrar detalles de la party">
            <span class="party-card-toggle-icon">&#9662;</span>
          </button>
        </div>
      </header>
      <div class="party-card-body">
        ${(party.difficulty || party.runTime || party.timezone) ? `
          <div class="party-card-runline">
            ${party.difficulty ? `<span>Dificultad: ${party.difficulty}</span>` : ""}
            ${party.runTime ? `<span>Run: ${party.runTime}</span>` : ""}
            ${party.timezone ? `<span>${party.timezone}</span>` : ""}
          </div>
        ` : ""}
        <ul class="party-members-list">
          ${(party.members || []).map((member) => {
    const character = findRosterCharacter(member.characterOwnerId, member.characterRegion, member.characterName);
    return `
              <li>
                <span class="party-member-slot">#${member.slotIndex + 1}</span>
                <strong>${member.characterName}</strong>
                <em>${character?.jobName || "Sin clase"} · Lv. ${character?.level ?? "-"}</em>
                ${character?.owner?.guild ? `<span class="party-member-guild-badge">${guildLabel(character.owner.guild)}</span>` : ""}
                ${character?.owner?.timezone ? `<span class="party-member-timezone-badge">${character.owner.timezone}</span>` : ""}
              </li>
            `;
  }).join("") || "<li>Sin miembros aún</li>"}
        </ul>
      </div>
    </article>
  `;
}

function renderPartysListByBoard(currentUserId) {
  const partiesByBoss = new Map();
  partysCurrentParties.forEach((party) => {
    const bossId = party.bossId || partysCurrentBossId;
    if (!partiesByBoss.has(bossId)) partiesByBoss.set(bossId, []);
    partiesByBoss.get(bossId).push(party);
  });

  const bossesToRender = PARTY_BOSS_OPTIONS.filter((boss) => partysVisibleBossIds.has(boss.id));

  if (!bossesToRender.length) {
    partysGrid.innerHTML = `
      <div class="roster-empty">
        <h4>Sin bosses seleccionados</h4>
        <p>Elegí al menos un boss en "Filtrar bosses" para ver sus partys.</p>
      </div>
    `;
    return;
  }

  partysGrid.innerHTML = bossesToRender.map((boss) => {
    const parties = partiesByBoss.get(boss.id) || [];
    const cardImage = PARTY_BOSS_CARD_IMAGES[boss.id];
    return `
      <div class="partys-board-column">
        <div class="party-boss-card-slot">
          ${cardImage
        ? `<img src="${cardImage}" alt="${boss.name}" />`
        : `<span>${boss.name}</span>`}
        </div>
        <div class="partys-board-column-parties">
          ${parties.length
        ? parties.map((party) => renderPartyCard(party, currentUserId)).join("")
        : `<p class="partys-board-empty">Sin partys formadas</p>`}
        </div>
      </div>
    `;
  }).join("");
}

function renderPartysListByPlayer(currentUserId) {
  if (!partysSelectedPlayerId) {
    partysGrid.innerHTML = `
      <div class="roster-empty">
        <h4>Sin jugadores</h4>
        <p>No hay jugadores con personajes registrados en este gremio.</p>
      </div>
    `;
    return;
  }

  const partiesByBoss = new Map();
  partysCurrentParties.forEach((party) => {
    if (party.ownerId !== partysSelectedPlayerId) return;
    const bossId = party.bossId || partysCurrentBossId;
    if (!partiesByBoss.has(bossId)) partiesByBoss.set(bossId, []);
    partiesByBoss.get(bossId).push(party);
  });

  if (!partiesByBoss.size) {
    partysGrid.innerHTML = `
      <div class="roster-empty">
        <h4>Sin partys</h4>
        <p>Este jugador todavía no creó partys.</p>
      </div>
    `;
    return;
  }

  partysGrid.innerHTML = `
    <div class="partys-player-board">
      ${Array.from(partiesByBoss.entries()).map(([bossId, parties]) => {
    const boss = PARTY_BOSS_OPTIONS.find((option) => option.id === bossId);
    const cardImage = PARTY_BOSS_CARD_IMAGES[bossId];
    const bossName = boss?.name || bossId;
    const accentColor = getBossAccentColor(bossId);

    const columns = [];
    for (let i = 0; i < parties.length; i += PARTYS_PLAYER_COLUMN_MAX) {
      columns.push(parties.slice(i, i + PARTYS_PLAYER_COLUMN_MAX));
    }

    return `
        <div class="partys-player-boss-column" style="--boss-accent: ${accentColor}">
          ${cardImage
        ? `<div class="partys-player-boss-card"><img src="${cardImage}" alt="${bossName}" /></div>
             <h4 class="partys-player-boss-name">${bossName}</h4>`
        : `<div class="partys-player-boss-card"><span>${bossName}</span></div>`}
          <div class="partys-player-boss-parties">
            ${columns.map((columnParties) => `
              <div class="partys-player-boss-subcolumn">
                ${columnParties.map((party) => renderPartyCard(party, currentUserId)).join("")}
              </div>
            `).join("")}
          </div>
        </div>
      `;
  }).join("")}
    </div>
  `;
}

function renderPartysList() {
  if (!partysGrid) return;

  if (partysOwnSectionBlocked()) {
    partysGrid.innerHTML = `
      <div class="roster-empty">
        <h4>Sin gremio asignado</h4>
        <p>Un administrador todavía no te asignó a Imanity o Lorien. Cuando lo haga, vas a ver acá las partys de tu gremio.</p>
      </div>
    `;
    return;
  }

  const currentUserId = getCurrentUserId();

  if (partysViewMode === "player") {
    renderPartysListByPlayer(currentUserId);
  } else {
    renderPartysListByBoard(currentUserId);
  }
}

function updatePartysSectionLabels() {
  if (partysOwnSectionTab) {
    partysOwnSectionTab.textContent = currentUserGuild
      ? `Partys ${guildLabel(currentUserGuild)}`
      : "Partys de mi gremio";
  }
}

async function initPartysPage() {
  populatePartysBossSelect();
  if (!partysCurrentBossId) {
    partysCurrentBossId = PARTY_BOSS_OPTIONS[0]?.id || null;
  }
  syncPartysBossSelects();

  if (partysInitialized) {
    await loadCurrentUserProfile();
    updatePartysSectionLabels();
    await loadGuildRoster();
    populatePartysPlayerSelect();
    await loadPartiesList();
    renderPartysRoster();
    renderPartySlots();
    renderPartysList();
    return;
  }
  partysInitialized = true;

  await loadCurrentUserProfile();
  if (partysTimezoneSelect && currentUserTimezone && !partysTimezoneSelect.value) {
    partysTimezoneSelect.value = currentUserTimezone;
  }
  syncPartyRunTimeOptions();
  updatePartysSectionLabels();
  await loadGuildRoster();
  populatePartysPlayerSelect();
  await loadPartiesList();
  renderPartysRoster();
  renderPartySlots();
  renderPartysList();
}

async function changeCreatePartyBoss(bossId) {
  partysCurrentBossId = bossId;
  if (partysCreateBossSelect) partysCreateBossSelect.value = bossId || "";
  populatePartysDifficultySelect();
  partySlotAssignments = new Array(PARTY_SLOT_COUNT).fill(null);
  setPartysStatus("");
  renderPartySlots();
  renderPartysRoster();
}

partysBossFilterToggle?.addEventListener("click", () => {
  const expanded = partysBossFilterPanel?.classList.toggle("hidden") === false;
  partysBossFilterToggle.setAttribute("aria-expanded", String(expanded));
});

document.addEventListener("click", (event) => {
  if (!partysBossFilter || partysBossFilterPanel?.classList.contains("hidden")) return;
  if (!partysBossFilter.contains(event.target)) {
    partysBossFilterPanel.classList.add("hidden");
    partysBossFilterToggle?.setAttribute("aria-expanded", "false");
  }
});

partysBossFilterList?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[data-boss-filter-id]");
  if (!checkbox) return;
  const bossId = checkbox.dataset.bossFilterId;
  if (checkbox.checked) {
    partysVisibleBossIds.add(bossId);
  } else {
    partysVisibleBossIds.delete(bossId);
  }
  renderPartysList();
});

partysBossFilterAll?.addEventListener("click", () => {
  partysVisibleBossIds = new Set(PARTY_BOSS_OPTIONS.map((boss) => boss.id));
  partysBossFilterList?.querySelectorAll("input[data-boss-filter-id]").forEach((input) => {
    input.checked = true;
  });
  renderPartysList();
});

partysBossFilterNone?.addEventListener("click", () => {
  partysVisibleBossIds.clear();
  partysBossFilterList?.querySelectorAll("input[data-boss-filter-id]").forEach((input) => {
    input.checked = false;
  });
  renderPartysList();
});

partysViewModeToggle?.addEventListener("click", () => {
  const expanded = partysViewModePanel?.classList.toggle("hidden") === false;
  partysViewModeToggle.setAttribute("aria-expanded", String(expanded));
});

document.addEventListener("click", (event) => {
  if (!partysViewMode_ || partysViewModePanel?.classList.contains("hidden")) return;
  if (!partysViewMode_.contains(event.target)) {
    partysViewModePanel.classList.add("hidden");
    partysViewModeToggle?.setAttribute("aria-expanded", "false");
  }
});

partysViewModeOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.viewMode;
    if (mode === partysViewMode) return;
    partysViewMode = mode;
    partysViewModeOptions.forEach((option) => {
      option.classList.toggle("active", option.dataset.viewMode === mode);
    });
    partysBossFilter?.classList.toggle("hidden", mode === "player");
    partysViewModePlayerRow?.classList.toggle("hidden", mode !== "player");
    renderPartysList();
  });
});

partysViewModePlayerSelect?.addEventListener("change", () => {
  partysSelectedPlayerId = partysViewModePlayerSelect.value || null;
  renderPartysList();
});

partysCreateBossSelect?.addEventListener("change", () => {
  changeCreatePartyBoss(partysCreateBossSelect.value);
});

async function switchPartysSection(section) {
  partysSection = section;
  partysOwnSectionTab?.classList.toggle("active", section === "own");
  partysAllianceSectionTab?.classList.toggle("active", section === "alianza");
  partySlotAssignments = new Array(PARTY_SLOT_COUNT).fill(null);
  setPartysStatus("");
  renderPartySlots();
  await loadGuildRoster();
  populatePartysPlayerSelect();
  await loadPartiesList();
  renderPartysRoster();
  renderPartysList();
}

partysOwnSectionTab?.addEventListener("click", () => switchPartysSection("own"));
partysAllianceSectionTab?.addEventListener("click", () => switchPartysSection("alianza"));

partysTimezoneSelect?.addEventListener("change", () => {
  syncPartyRunTimeOptions();
});

partysCreateTab?.addEventListener("click", () => {
  partysCreateTab.classList.add("active");
  partysListTab?.classList.remove("active");
  partysCreateView?.classList.remove("hidden");
  partysListView?.classList.add("hidden");
  partysBossSelectRow?.classList.add("hidden");
});

partysListTab?.addEventListener("click", () => {
  partysListTab.classList.add("active");
  partysCreateTab?.classList.remove("active");
  partysListView?.classList.remove("hidden");
  partysCreateView?.classList.add("hidden");
  partysBossSelectRow?.classList.remove("hidden");
});

partysRoster?.addEventListener("click", (event) => {
  const card = event.target.closest(".roster-card");
  if (!card) return;

  const key = card.dataset.characterKey;
  const character = partysGuildRoster.find((c) => rosterCharacterKey(c) === key);
  if (!character) return;

  if (partySlotAssignments.some((slot) => slot && rosterCharacterKey(slot) === key)) {
    setPartysStatus("Ese personaje ya está en la party.", "error");
    return;
  }

  const emptyIndex = partySlotAssignments.findIndex((slot) => slot === null);
  if (emptyIndex === -1) {
    setPartysStatus("La party ya tiene 6 miembros.", "error");
    return;
  }

  partySlotAssignments[emptyIndex] = character;
  setPartysStatus("");
  renderPartySlots();
  renderPartysRoster();
});

partySlotsGrid?.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".party-slot-remove");
  if (!removeBtn) return;

  const index = Number(removeBtn.dataset.slotIndex);
  partySlotAssignments[index] = null;
  renderPartySlots();
  renderPartysRoster();
});

partysSaveBtn?.addEventListener("click", async () => {
  const filled = partySlotAssignments
    .map((slot, index) => ({ slot, index }))
    .filter((entry) => entry.slot);

  if (!filled.length) {
    setPartysStatus("Asigna al menos un miembro antes de guardar.", "error");
    return;
  }

  if (partysRunTimeSelect?.value && !partysTimezoneSelect?.value) {
    setPartysStatus("Selecciona una zona horaria para guardar la hora de run.", "error");
    return;
  }

  setPartysStatus("Guardando party...", "neutral");
  partysSaveBtn.disabled = true;

  try {
    const bossLabel = getPartyBossLabel(partysCurrentBossId);
    const destinationCategory = partysDestinationSelect?.value || partysCurrentCategory();
    const created = await fetchAuthedJson("/api/parties", {
      method: "POST",
      body: JSON.stringify({
        bossId: partysCurrentBossId,
        label: `Party ${bossLabel}`,
        category: destinationCategory,
        difficulty: partysDifficultySelect?.value || "",
        timezone: partysTimezoneSelect?.value || "",
        runTime: partysRunTimeSelect?.value || "",
      }),
    });
    const partyId = created.party?.id;

    for (const { slot, index } of filled) {
      await fetchAuthedJson(`/api/parties/${partyId}/members`, {
        method: "POST",
        body: JSON.stringify({
          slotIndex: index,
          characterOwnerId: slot.ownerId,
          characterRegion: slot.region,
          characterName: slot.name,
        }),
      });
    }

    setPartysStatus("Party guardada correctamente.", "success");
    partySlotAssignments = new Array(PARTY_SLOT_COUNT).fill(null);
    renderPartySlots();
    renderPartysRoster();
    if (destinationCategory === "alianza") {
      partysAllianceSectionTab?.click();
    } else {
      partysOwnSectionTab?.click();
    }
    await loadPartiesList();
    renderPartysList();
  } catch (error) {
    setPartysStatus(error.message || "No se pudo guardar la party.", "error");
  } finally {
    partysSaveBtn.disabled = false;
  }
});

partysGrid?.addEventListener("click", async (event) => {
  const deleteBtn = event.target.closest(".party-delete");
  if (deleteBtn) {
    if (!confirm("¿Eliminar esta party?")) return;

    try {
      await fetchAuthedJson(`/api/parties/${deleteBtn.dataset.partyId}`, { method: "DELETE" });
      await loadPartiesList();
      renderPartysList();
    } catch (error) {
      setPartysStatus(error.message || "No se pudo eliminar la party.", "error");
    }
    return;
  }

  const header = event.target.closest(".party-card-header");
  if (header) {
    const card = header.closest(".party-card");
    const expanded = card.classList.toggle("expanded");
    header.querySelector(".party-card-toggle")?.setAttribute("aria-expanded", String(expanded));
  }
});

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
dashboardNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showDashboardPage();
});
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

partysNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showPartysPage();
});

adminNav?.addEventListener("click", (event) => {
  event.preventDefault();
  showAdminPage();
});

partysOwnSectionTab?.addEventListener("click", () => {
  if (partysDestinationSelect) partysDestinationSelect.value = currentUserGuild || "imanity";
});

partysAllianceSectionTab?.addEventListener("click", () => {
  if (partysDestinationSelect) partysDestinationSelect.value = "alianza";
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
    await saveRemoteCharacter(character);
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
      await saveRemoteCharacter(updated);
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
  await renderFragmentsPage();
  setFragmentsStatus(`Objetivo max aplicado a ${character.name}.`, "success");
});

loginForm?.addEventListener("submit", loginFirebaseUser);

registerUserBtn?.addEventListener("click", showRegisterPanel);

registerForm?.addEventListener("submit", registerFirebaseUser);

backToLoginBtn?.addEventListener("click", () => {
  showLoginPanel();
});

clearLoginBtn?.addEventListener("click", () => {
  if (loginUsername) loginUsername.value = "";
  if (loginPassword) loginPassword.value = "";
  if (registerUsername) registerUsername.value = "";
  if (registerEmail) registerEmail.value = "";
  if (registerPassword) registerPassword.value = "";
  if (registerConfirmPassword) registerConfirmPassword.value = "";
  if (registerToken) registerToken.value = "";
  showLoginPanel();
  setLoginStatus("");
  loginUsername?.focus();
});

logoutBtn?.addEventListener("click", async () => {
  try {
    await getFirebaseAuth()?.signOut();
  } finally {
    showLoginSession("Sesion cerrada.");
  }
});

const auth = getFirebaseAuth();
if (auth) {
  auth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
    console.warn("Firebase Auth persistence error:", error);
  });
  auth.onAuthStateChanged((user) => {
    if (user) {
      const username = user.displayName || user.email?.split("@")[0] || "usuario";
      showAppSession(username);
      initializeAuthenticatedApp();
      hydrateAuthenticatedData(user);
    } else {
      charactersCache = [];
      showLoginSession("Inicia sesion para entrar.");
    }
  });
} else {
  showLoginSession("Firebase Auth no cargo. Revisa la configuracion.");
}
