const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const dotenv = require("dotenv");
const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const {
  getCurrentUser,
  listMyMapleCharacters,
  upsertCurrentUser,
  upsertMapleCharacter,
  listGuildRoster,
  listAllianceRoster,
  listPartiesByBoss,
  listPartiesByCategory,
  createBossParty,
  deleteBossParty,
  upsertPartyMember,
  removePartyMember,
  listTradePosts,
  createTradePost,
  updateTradePost,
  deleteTradePost,
  archiveTradePost,
  applyToTrade,
  updateTradeApplicationStatus,
  deleteTradeApplication,
  listAppUsers,
  updateUserRole,
  updateUserGuild,
} = require("@dataconnect/admin-generated");

const ROOT = __dirname;
const CHATBOT_ROOT = path.join(ROOT, "test chatbot", "Chatbot");

dotenv.config({ path: path.join(ROOT, ".env") });
dotenv.config({ path: path.join(CHATBOT_ROOT, ".env") });

const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1");
const CHATBOT_CONFIG = require(path.join(CHATBOT_ROOT, "docs.config.cjs"));
const SKILL_DATA = require(path.join(ROOT, "data", "skills.json"));

const isPlaceholderKey = (key) =>
  !key || /^your[_-]?gemini/i.test(String(key).trim());

const GEMINI_API_KEY = [process.env.GEMINI_API_KEY, process.env.VITE_API_KEY].find(
  (key) => !isPlaceholderKey(key)
);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_ENDPOINT = process.env.VITE_API_ENDPOINT || process.env.GEMINI_URL;
const buildGeminiUrl = (endpoint, apiKey) => {
  if (!apiKey) return null;
  if (!endpoint) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  }
  if (endpoint.includes("key=")) {
    return endpoint;
  }
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}key=${apiKey}`;
};
const GEMINI_URL = buildGeminiUrl(GEMINI_ENDPOINT, GEMINI_API_KEY);
const CACHE_TTL_MS = 1000 * 60 * 30;
const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || "AIzaSyCylI-FadSqtTED7fQH6-Z4LWMIkbOfbAI";
const REGISTER_TOKEN = String(process.env.REGISTER_TOKEN || "").trim();
const APP_VERSION = process.env.RENDER_GIT_COMMIT || process.env.APP_VERSION || "local";
const DEV_LIVE_RELOAD = process.env.DEV_LIVE_RELOAD === "1";

function initializeFirebaseAdmin() {
  if (getApps().length) return;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
    return;
  }

  initializeApp();
}

initializeFirebaseAdmin();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

const classNames = [
  "Hero",
  "Paladin",
  "Dark Knight",
  "Bishop",
  "Arch Mage (Ice/Lightning)",
  "Arch Mage (Fire/Poison)",
  "Bowmaster",
  "Marksman",
  "Pathfinder",
  "Night Lord",
  "Shadower",
  "Dual Blade",
  "Buccaneer",
  "Corsair",
  "Cannoneer",
  "Dawn Warrior",
  "Mihile",
  "Blaze Wizard",
  "Wind Archer",
  "Night Walker",
  "Thunder Breaker",
  "Aran",
  "Evan",
  "Mercedes",
  "Phantom",
  "Luminous",
  "Shade",
  "Demon Slayer",
  "Demon Avenger",
  "Battle Mage",
  "Wild Hunter",
  "Mechanic",
  "Blaster",
  "Xenon",
  "Kaiser",
  "Angelic Buster",
  "Cadena",
  "Kain",
  "Kanna",
  "Adele",
  "Ark",
  "Illium",
  "Khali",
  "Hoyoung",
  "Lara",
  "Zero",
  "Kinesis",
  "Beast Tamer (Lynn)",
];

const docCache = new Map();
// In-memory local storage for characters when running without Data Connect / Firebase Admin.
const LOCAL_CHARACTERS = new Map();

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers);
  res.end(body);
};

const liveReloadClients = new Set();
let liveReloadTimer = null;

const LIVE_RELOAD_SNIPPET = `
<script>
(() => {
  const source = new EventSource("/__dev/reload");
  source.addEventListener("reload", () => window.location.reload());
})();
</script>`;

function sendDevReload(res) {
  for (const client of liveReloadClients) {
    client.write("event: reload\\ndata: now\\n\\n");
  }
}

function scheduleDevReload() {
  clearTimeout(liveReloadTimer);
  liveReloadTimer = setTimeout(sendDevReload, 120);
}

function handleDevReload(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  res.write("retry: 500\\n\\n");
  liveReloadClients.add(res);
  req.on("close", () => liveReloadClients.delete(res));
}

function injectLiveReload(filePath, data) {
  if (!DEV_LIVE_RELOAD || path.extname(filePath) !== ".html") {
    return data;
  }

  const html = data.toString("utf8");
  return html.includes("</body>")
    ? html.replace("</body>", `${LIVE_RELOAD_SNIPPET}</body>`)
    : `${html}${LIVE_RELOAD_SNIPPET}`;
}

function watchDevFiles() {
  if (!DEV_LIVE_RELOAD) return;

  const targets = [
    path.join(ROOT, "index.html"),
    path.join(ROOT, "styles"),
    path.join(ROOT, "scripts"),
    path.join(ROOT, "assets"),
  ];

  for (const target of targets) {
    if (!fs.existsSync(target)) continue;
    fs.watch(target, { recursive: true }, scheduleDevReload);
  }
}

function setApiCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-MapleHub-Request");
}

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
  });

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTitleCase = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const googleDocToTextUrl = (url) => {
  const id = String(url).match(/\/document\/d\/([^/]+)/)?.[1];
  if (!id) return url;
  return `https://docs.google.com/document/d/${id}/export?format=txt`;
};

const fetchGuideText = async (source) => {
  const cacheKey = source.url;
  const cached = docCache.get(cacheKey);

  if (cached && Date.now() - cached.updatedAt < CACHE_TTL_MS) {
    return cached.text;
  }

  const response = await fetch(googleDocToTextUrl(source.url));
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${source.name}: ${response.status} ${text.slice(0, 120)}`);
  }

  if (/JavaScript isn't enabled|<html|<!doctype/i.test(text.slice(0, 500))) {
    throw new Error(
      `${source.name}: the Google Doc is not publicly readable as plain text.`
    );
  }

  docCache.set(cacheKey, { text, updatedAt: Date.now() });
  return text;
};

const isClassHeading = (line) => {
  const cleanLine = normalize(line);
  if (!cleanLine || cleanLine.length > 55) return false;
  return classNames.some((className) => cleanLine === normalize(className));
};

const extractClassSection = (text, className) => {
  const target = normalize(className);
  const lines = text.split(/\r?\n/);
  let start = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const cleanLine = normalize(lines[index]);
    if (cleanLine === target || cleanLine.startsWith(`${target} `)) {
      start = index;
      break;
    }
  }

  if (start >= 0) {
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      if (isClassHeading(lines[index])) {
        end = index;
        break;
      }
    }
    return lines.slice(start, end).join("\n").trim();
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((paragraph) => normalize(paragraph).includes(target));

  return paragraphs.slice(0, 8).join("\n\n").trim();
};

const findClassKey = (className) =>
  Object.keys(SKILL_DATA).find(
    (key) => normalize(key) === normalize(className)
  );

const buildClassGuideContext = (className) => {
  const key = findClassKey(className);
  if (!key) return "";

  const data = SKILL_DATA[key];
  const sections = [`Local class guide: ${key}`];

  if (data.originSkill) sections.push(`Origen: ${data.originSkill}`);
  if (data.ascentSkill) sections.push(`Ascenso: ${data.ascentSkill}`);
  if (data.firstMastery?.length)
    sections.push(`First mastery skills: ${data.firstMastery.join(", ")}`);
  if (data.secondMastery?.length)
    sections.push(`Second mastery skills: ${data.secondMastery.join(", ")}`);
  if (data.thirdMastery?.length)
    sections.push(`Third mastery skills: ${data.thirdMastery.join(", ")}`);
  if (data.fourthMastery?.length)
    sections.push(`Fourth mastery skills: ${data.fourthMastery.join(", ")}`);
  if (data.boostSkills?.length)
    sections.push(`Boost skills: ${data.boostSkills.join(", ")}`);
  if (data.commonSkills?.length)
    sections.push(`Common skills: ${data.commonSkills.join(", ")}`);

  return sections.join("\n");
};

const buildGuideContext = async (className) => {
  const sections = [];
  const localContext = buildClassGuideContext(className);
  if (localContext) {
    sections.push(localContext);
  }

  for (const source of CHATBOT_CONFIG) {
    const text = await fetchGuideText(source);
    const section = extractClassSection(text, className);

    if (section) {
      sections.push(`Source: ${source.name}\n${section}`);
    }
  }

  return sections.join("\n\n---\n\n").slice(0, 18000);
};

const askGemini = async ({ message, className, context }) => {
  const prompt = `
You are Imanity Chatbot for MapleStory.
The selected class is: ${className}.

Use the provided guide context and local class guide data first for all responses.
If there is a class-specific guide context available, answer only from that context.
Do not use Google Search or any other external source when context is available.
If there is no relevant class context, say that the guide does not contain enough information to answer precisely.
Answer in Spanish. Keep it concise and well-structured.
Do not use Markdown, headings, bold, asterisks, or decorative formatting.

Guide context:
${context || "No class context found."}

Player question:
${message}
`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 },
  };

  if (!context) {
    requestBody.tools = [{ google_search: {} }];
  }

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Gemini request failed.");
  }

  return (
    result.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response received."
  );
};

const cleanBotText = (text) =>
  String(text || "")
    .replace(/\*\*/g, "")
    .replace(/#{1,6}\s?/g, "")
    .replace(/^\s*[-*]\s+/gm, "- ")
    .trim();

function proxyMapleHub(req, res) {
  const incomingUrl = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = new URL(`https://maplehub.app${incomingUrl.pathname}${incomingUrl.search}`);

  const proxyReq = https.request(targetUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Origin": "https://maplehub.app",
      "Referer": "https://maplehub.app/",
      "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
      "X-MapleHub-Request": "true",
    },
  }, (proxyRes) => {
    let body = "";
    proxyRes.setEncoding("utf8");
    proxyRes.on("data", (chunk) => { body += chunk; });
    proxyRes.on("end", () => {
      send(res, proxyRes.statusCode || 502, body, {
        "Content-Type": proxyRes.headers["content-type"] || "application/json; charset=utf-8",
      });
    });
  });

  proxyReq.on("error", (error) => {
    send(res, 502, JSON.stringify({ error: error.message }), {
      "Content-Type": "application/json; charset=utf-8",
    });
  });

  proxyReq.end();
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.normalize(path.join(ROOT, decodeURIComponent(pathname)));

  if (!filePath.startsWith(ROOT)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found");
      return;
    }

    send(res, 200, injectLiveReload(filePath, data), {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
    });
  });
}

function serveChatBotStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = requestUrl.pathname;

  if (pathname === "/chatbot" || pathname === "/chatbot/") {
    pathname = "/index.html";
  } else {
    pathname = pathname.replace(/^\/chatbot/, "") || "/index.html";
  }

  const filePath = path.normalize(path.join(CHATBOT_ROOT, decodeURIComponent(pathname)));

  if (!filePath.startsWith(CHATBOT_ROOT)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (pathname !== "/index.html") {
        fs.readFile(path.join(CHATBOT_ROOT, "index.html"), (fallbackError, fallback) => {
          if (fallbackError) {
            send(res, 404, "ChatBot resource not found");
            return;
          }

          send(res, 200, fallback, { "Content-Type": "text/html; charset=utf-8" });
        });
        return;
      }

      send(res, 404, "ChatBot resource not found");
      return;
    }

    send(res, 200, data, {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
    });
  });
}

async function handleChatBotAsk(req, res) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY or VITE_API_KEY in .env.");
    }

    const body = await readJsonBody(req);
    const message = String(body.message || "").trim();
    const className = toTitleCase(body.className || "MapleStory");

    if (!message) {
      send(res, 400, JSON.stringify({ error: "Message is required." }), {
        "Content-Type": "application/json; charset=utf-8",
      });
      return;
    }

    const context = await buildGuideContext(className);
    const text = await askGemini({ message, className, context });

    send(res, 200, JSON.stringify({ text: cleanBotText(text), hasContext: Boolean(context) }), {
      "Content-Type": "application/json; charset=utf-8",
    });
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message }), {
      "Content-Type": "application/json; charset=utf-8",
    });
  }
}

function handleChatBotHealth(req, res) {
  send(res, 200, JSON.stringify({ ok: true, sources: CHATBOT_CONFIG.length, version: APP_VERSION, registerEnabled: Boolean(REGISTER_TOKEN) }), {
    "Content-Type": "application/json; charset=utf-8",
  });
}

const VALID_GUILDS = ["imanity", "lorien"];
const VALID_PARTY_CATEGORIES = ["imanity", "lorien", "alianza"];
const VALID_TRADE_TYPES = [
  "daily",
  "chaos-tenebris",
  "chaos-tenebris-luwill",
  "chaos-tenebris-luwill-slime",
  "emblem",
  "badge",
  "cookies",
];
const VALID_TRADE_BOSSES = [
  "gollux",
  "chaos-gloom",
  "verus-hilla",
  "hard-darknell",
  "hard-lotus",
  "hard-damien",
  "chaos-slime",
  "hard-seren",
  "black-mage-hard",
  "black-mage-xtreme",
  "kaling",
  "adversary",
  "kalos",
  "limbo",
  "baldrix",
];
const VALID_ROLES = ["admin", "lider", "jr", "usuario"];

function normalizeUsername(value) {
  // Trim, lower-case, remove spaces and strip characters that are invalid
  // for an email local-part to avoid Firebase validation errors.
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "");
}

function normalizeGuild(value) {
  const guild = String(value || "").trim().toLowerCase();
  return VALID_GUILDS.includes(guild) ? guild : null;
}

function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();
  return VALID_ROLES.includes(role) ? role : "usuario";
}

function normalizeTimezone(value) {
  const timezone = String(value || "").trim();
  return timezone ? timezone.slice(0, 48) : null;
}

function normalizeRunTime(value) {
  const runTime = String(value || "").trim();
  return runTime ? runTime.slice(0, 64) : null;
}

function normalizeDifficulty(value) {
  const difficulty = String(value || "").trim();
  return difficulty ? difficulty.slice(0, 20) : null;
}

function normalizePartyCategory(value, fallbackGuild) {
  const category = String(value || "").trim().toLowerCase();
  if (VALID_PARTY_CATEGORIES.includes(category)) return category;
  return fallbackGuild || "imanity";
}

function normalizeTradeType(value) {
  const tradeType = String(value || "").trim().toLowerCase();
  return VALID_TRADE_TYPES.includes(tradeType) ? tradeType : "daily";
}

function normalizeTradeBossIds(value) {
  const rawValues = Array.isArray(value)
    ? value
    : String(value || "").split(",");
  const bossIds = rawValues
    .map((bossId) => String(bossId || "").trim().toLowerCase())
    .filter((bossId, index, values) => VALID_TRADE_BOSSES.includes(bossId) && values.indexOf(bossId) === index);
  return bossIds.join(",");
}

function canAccessCategory(role, userGuild, category) {
  return role === "admin" || category === "alianza" || category === userGuild;
}

function normalizeTradeStatus(value) {
  const status = String(value || "").trim().toLowerCase();
  return ["open", "paused", "closed", "archived"].includes(status) ? status : "open";
}

function normalizeTradeApplicationStatus(value) {
  const status = String(value || "").trim().toLowerCase();
  return ["pending", "accepted", "rejected"].includes(status) ? status : "pending";
}

function normalizeOptionalText(value, maxLength) {
  const text = String(value || "").trim();
  return text ? text.slice(0, maxLength) : null;
}

function normalizeOptionalInt(value, min = 0, max = 2147483647) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function usernameToAuthEmail(username) {
  return username.includes("@") ? username : `${username}@imanity.local`;
}

async function firebaseAuthRequest(action, body) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${action}?key=${FIREBASE_WEB_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.error?.message || "Firebase Auth request failed.");
    error.status = response.status;
    throw error;
  }

  return result;
}

function getRegisterErrorMessage(error) {
  const message = error?.message || "";
  if (message.includes("EMAIL_EXISTS")) return "Ese usuario ya existe. Usa Login para entrar.";
  if (message.includes("WEAK_PASSWORD")) return "El password debe tener al menos 6 caracteres.";
  if (message.includes("CONFIGURATION_NOT_FOUND")) return "Inicializa Firebase Authentication y activa Email/Password.";
  if (message.includes("OPERATION_NOT_ALLOWED")) return "Activa Email/Password en Firebase Authentication.";
  return "No se pudo crear la cuenta.";
}

async function getAuthClaimsFromRequest(req) {
  const token = req.headers.authorization?.replace(/^bearer\s+/i, "");
  if (!token) return null;
  // Allow a local bypass for testing when Firebase Admin credentials are not available.
  // Set LOCAL_AUTH_BYPASS=true in the environment to enable. This will decode the
  // JWT payload without verification — use only for local development.
  if (process.env.LOCAL_AUTH_BYPASS === "true") {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
      return JSON.parse(payload);
    } catch (err) {
      return null;
    }
  }

  return getAuth().verifyIdToken(token);
}

function getImpersonationOptions(authClaims) {
  return { impersonate: { authClaims } };
}

function sendJson(res, status, body) {
  send(res, status, JSON.stringify(body), {
    "Content-Type": "application/json; charset=utf-8",
  });
}

async function requireAuth(req, res) {
  try {
    const authClaims = await getAuthClaimsFromRequest(req);
    if (!authClaims) {
      sendJson(res, 401, { error: "Unauthorized" });
      return null;
    }
    return authClaims;
  } catch {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
}

async function requireAdmin(authClaims, res) {
  try {
    const result = await getCurrentUser(getImpersonationOptions(authClaims));
    const user = result.data.appUser || null;
    if (!user || normalizeRole(user.role) !== "admin") {
      sendJson(res, 403, { error: "Solo un admin puede realizar esta accion." });
      return null;
    }
    return user;
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo verificar el rol del usuario." });
    return null;
  }
}

async function handleRegister(req, res) {
  try {
    const body = await readJsonBody(req);
    const username = normalizeUsername(body.username);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const inviteToken = String(body.inviteToken || "").trim();
    const guild = normalizeGuild(body.guild);
    const timezone = normalizeTimezone(body.timezone);

    if (!REGISTER_TOKEN) {
      send(res, 500, JSON.stringify({ error: "REGISTER_TOKEN no esta configurado en Render." }), {
        "Content-Type": "application/json; charset=utf-8",
      });
      return;
    }

    if (inviteToken !== REGISTER_TOKEN) {
      send(res, 403, JSON.stringify({ error: "Token de invitacion invalido." }), {
        "Content-Type": "application/json; charset=utf-8",
      });
      return;
    }

    if (!username || !password) {
      send(res, 400, JSON.stringify({ error: "Usuario y password son obligatorios." }), {
        "Content-Type": "application/json; charset=utf-8",
      });
      return;
    }

    if (!guild) {
      send(res, 400, JSON.stringify({ error: "Debes elegir un gremio (Imanity o Lorien)." }), {
        "Content-Type": "application/json; charset=utf-8",
      });
      return;
    }

    if (password.length < 6) {
      send(res, 400, JSON.stringify({ error: "El password debe tener al menos 6 caracteres." }), {
        "Content-Type": "application/json; charset=utf-8",
      });
      return;
    }

    const authEmail = email || usernameToAuthEmail(username);
    const created = await firebaseAuthRequest("accounts:signUp", {
      email: authEmail,
      password,
      returnSecureToken: true,
    });

    await firebaseAuthRequest("accounts:update", {
      idToken: created.idToken,
      displayName: username,
      returnSecureToken: false,
    });

    let appUserSynced = false;
    try {
      const authClaims = await getAuth().verifyIdToken(created.idToken);
      await upsertCurrentUser(
        { username, displayName: username, email: authEmail, guild, timezone },
        getImpersonationOptions(authClaims)
      );
      appUserSynced = true;
    } catch (error) {
      console.warn("Data Connect user sync error:", error);
    }

    sendJson(res, 201, { ok: true, email: authEmail, username, appUserSynced });
  } catch (error) {
    const status = error.status === 400 ? 400 : 500;
    sendJson(res, status, { error: getRegisterErrorMessage(error) });
  }
}

async function handleUpsertMe(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const body = await readJsonBody(req);
    const username = normalizeUsername(body.username || authClaims.name || authClaims.email?.split("@")[0]);
    const displayName = String(body.displayName || username || "").trim() || null;
    const email = normalizeEmail(body.email || authClaims.email);

    if (!username) {
      sendJson(res, 400, { error: "Username is required." });
      return;
    }

    const existing = await getCurrentUser(getImpersonationOptions(authClaims));
    const existingUser = existing.data.appUser || null;
    const guild = body.guild !== undefined ? normalizeGuild(body.guild) : existingUser?.guild || null;
    const timezone = body.timezone !== undefined ? normalizeTimezone(body.timezone) : existingUser?.timezone || null;

    await upsertCurrentUser(
      { username, displayName, email: email || null, guild, timezone },
      getImpersonationOptions(authClaims)
    );
    const result = await getCurrentUser(getImpersonationOptions(authClaims));
    sendJson(res, 200, { user: result.data.appUser || null });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo sincronizar el usuario." });
  }
}

async function handleGetMe(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const result = await getCurrentUser(getImpersonationOptions(authClaims));
    sendJson(res, 200, { user: result.data.appUser || null });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo obtener el usuario." });
  }
}

function normalizeCharacterInput(body) {
  const region = normalizeUsername(body.region || "na");
  const name = String(body.name || "").trim();
  if (!name) return null;

  return {
    region,
    name,
    jobName: body.jobName || null,
    level: Number.isFinite(Number(body.level)) ? Number(body.level) : null,
    worldName: body.worldName || null,
    characterImgURL: body.characterImgURL || null,
    source: body.source || "maplehub",
    fetchedAt: body.fetchedAt || new Date().toISOString(),
  };
}

async function handleListCharacters(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const result = await listMyMapleCharacters(getImpersonationOptions(authClaims));
    sendJson(res, 200, { characters: result.data.mapleCharacters || [] });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo obtener personajes." });
  }
}

async function handleSaveCharacter(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const body = await readJsonBody(req);
    const character = normalizeCharacterInput(body);
    if (!character) {
      sendJson(res, 400, { error: "Character name is required." });
      return;
    }
    // If running locally without Data Connect credentials, store characters in memory.
    if (process.env.LOCAL_AUTH_BYPASS === "true") {
      try {
        const userKey = authClaims?.sub || authClaims?.user_id || authClaims?.localId || authClaims?.email || "local";
        const list = LOCAL_CHARACTERS.get(userKey) || [];
        list.push(character);
        LOCAL_CHARACTERS.set(userKey, list);
        sendJson(res, 200, { character, characters: list });
        return;
      } catch (err) {
        sendJson(res, 500, { error: "Local character storage failed." });
        return;
      }
    }

    await upsertMapleCharacter(character, getImpersonationOptions(authClaims));
    const result = await listMyMapleCharacters(getImpersonationOptions(authClaims));
    sendJson(res, 200, { character, characters: result.data.mapleCharacters || [] });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo guardar el personaje." });
  }
}

async function handleListGuildRoster(req, res, guild) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const normalizedGuild = normalizeGuild(guild);
    const result = normalizedGuild
      ? await listGuildRoster({ guild: normalizedGuild }, getImpersonationOptions(authClaims))
      : await listAllianceRoster(getImpersonationOptions(authClaims));
    let characters = result.data.mapleCharacters || [];

    const me = await getCurrentUser(getImpersonationOptions(authClaims));
    const role = normalizeRole(me.data.appUser?.role);
    if (role === "usuario") {
      const userId = authClaims.uid || authClaims.sub;
      characters = characters.filter((character) => character.ownerId === userId);
    }

    sendJson(res, 200, { characters });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo obtener el roster del gremio." });
  }
}

async function handleListAppUsers(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;
  if (!(await requireAdmin(authClaims, res))) return;

  try {
    const result = await listAppUsers(getImpersonationOptions(authClaims));
    sendJson(res, 200, { users: result.data.appUsers || [] });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo obtener la lista de usuarios." });
  }
}

async function handleUpdateUserRole(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;
  if (!(await requireAdmin(authClaims, res))) return;

  try {
    const body = await readJsonBody(req);
    const userId = String(body.userId || "").trim();
    if (!userId) {
      sendJson(res, 400, { error: "userId es obligatorio." });
      return;
    }
    const role = normalizeRole(body.role);
    await updateUserRole({ userId, role }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true, userId, role });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo actualizar el rol del usuario." });
  }
}

async function handleUpdateUserGuild(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;
  if (!(await requireAdmin(authClaims, res))) return;

  try {
    const body = await readJsonBody(req);
    const userId = String(body.userId || "").trim();
    if (!userId) {
      sendJson(res, 400, { error: "userId es obligatorio." });
      return;
    }
    const guild = body.guild === null || body.guild === undefined || body.guild === ""
      ? null
      : normalizeGuild(body.guild);
    if (body.guild && !guild) {
      sendJson(res, 400, { error: "Gremio invalido." });
      return;
    }
    await updateUserGuild({ userId, guild }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true, userId, guild });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo actualizar el gremio del usuario." });
  }
}

async function handleListParties(req, res, bossId, category) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const result = bossId && bossId !== "all"
      ? await listPartiesByBoss(
        { bossId, category: normalizePartyCategory(category) },
        getImpersonationOptions(authClaims)
      )
      : await listPartiesByCategory(
        { category: normalizePartyCategory(category) },
        getImpersonationOptions(authClaims)
      );
    sendJson(res, 200, { parties: result.data.bossParties || [] });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudieron obtener las partys." });
  }
}

async function handleCreateParty(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const body = await readJsonBody(req);
    const bossId = String(body.bossId || "").trim();
    if (!bossId) {
      sendJson(res, 400, { error: "bossId es requerido." });
      return;
    }

    const me = await getCurrentUser(getImpersonationOptions(authClaims));
    const role = normalizeRole(me.data.appUser?.role);
    const userGuild = me.data.appUser?.guild || null;
    let category = normalizePartyCategory(body.category, userGuild);
    if (role !== "admin" && category !== "alianza" && category !== userGuild) {
      sendJson(res, 403, { error: "Solo podes crear partys para tu propio gremio o para Alianza." });
      return;
    }

    const result = await createBossParty(
      {
        bossId,
        label: body.label || null,
        category,
        difficulty: normalizeDifficulty(body.difficulty),
        timezone: normalizeTimezone(body.timezone),
        runTime: normalizeRunTime(body.runTime),
      },
      getImpersonationOptions(authClaims)
    );
    sendJson(res, 201, { party: result.data.bossParty_insert });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo crear la party." });
  }
}

async function handleDeleteParty(req, res, partyId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    await deleteBossParty({ id: partyId }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo eliminar la party." });
  }
}

async function handleUpsertPartyMember(req, res, partyId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const body = await readJsonBody(req);
    const slotIndex = Number(body.slotIndex);
    if (!Number.isInteger(slotIndex) || slotIndex < 0) {
      sendJson(res, 400, { error: "slotIndex inválido." });
      return;
    }

    await upsertPartyMember(
      {
        partyId,
        slotIndex,
        characterOwnerId: String(body.characterOwnerId || ""),
        characterRegion: String(body.characterRegion || ""),
        characterName: String(body.characterName || ""),
      },
      getImpersonationOptions(authClaims)
    );
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo asignar el miembro." });
  }
}

async function handleRemovePartyMember(req, res, partyId, slotIndex) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    await removePartyMember(
      { partyId, slotIndex: Number(slotIndex) },
      getImpersonationOptions(authClaims)
    );
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo quitar el miembro." });
  }
}

async function findTradePostById(tradeId, authClaims) {
  const categories = VALID_PARTY_CATEGORIES;
  for (const category of categories) {
    const result = await listTradePosts({ category }, getImpersonationOptions(authClaims));
    const trade = (result.data.tradePosts || []).find((item) => String(item.id) === String(tradeId));
    if (trade) return trade;
  }
  return null;
}

function normalizeTradePayload(body, fallbackCategory) {
  const title = normalizeOptionalText(body.title, 80);
  if (!title) return null;

  return {
    title,
    tradeType: normalizeTradeType(body.tradeType),
    bossId: normalizeOptionalText(body.bossId, 40),
    bossIds: normalizeTradeBossIds(body.bossIds ?? body.bossId),
    category: normalizePartyCategory(body.category, fallbackCategory),
    weeklyRuns: normalizeOptionalInt(body.weeklyRuns, 1, 7),
    preferredDay: normalizeOptionalText(body.preferredDay, 32),
    preferredTime: normalizeRunTime(body.preferredTime),
    timezone: normalizeTimezone(body.timezone),
    itemsOffered: normalizeOptionalText(body.itemsOffered, 600),
    minCombatPower: normalizeOptionalInt(body.minCombatPower, 0),
    minSacredPower: normalizeOptionalInt(body.minSacredPower, 0),
    notes: normalizeOptionalText(body.notes, 800),
    status: normalizeTradeStatus(body.status),
  };
}

async function handleListTrades(req, res, category) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const me = await getCurrentUser(getImpersonationOptions(authClaims));
    const role = normalizeRole(me.data.appUser?.role);
    const userGuild = me.data.appUser?.guild || null;
    const normalizedCategory = normalizePartyCategory(category, userGuild);
    if (!canAccessCategory(role, userGuild, normalizedCategory)) {
      sendJson(res, 403, { error: "No puedes ver trades de otro gremio." });
      return;
    }
    const result = await listTradePosts(
      { category: normalizedCategory },
      getImpersonationOptions(authClaims)
    );
    sendJson(res, 200, { trades: result.data.tradePosts || [] });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudieron obtener los trades." });
  }
}

async function handleCreateTrade(req, res) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const body = await readJsonBody(req);
    const me = await getCurrentUser(getImpersonationOptions(authClaims));
    const role = normalizeRole(me.data.appUser?.role);
    const userGuild = me.data.appUser?.guild || null;
    const payload = normalizeTradePayload(body, userGuild);
    if (!payload) {
      sendJson(res, 400, { error: "El titulo del trade es obligatorio." });
      return;
    }
    if (!canAccessCategory(role, userGuild, payload.category)) {
      sendJson(res, 403, { error: "Solo podes publicar trades para tu propio gremio o para Alianza." });
      return;
    }

    const result = await createTradePost(payload, getImpersonationOptions(authClaims));
    sendJson(res, 201, { trade: result.data.tradePost_insert });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo crear el trade." });
  }
}

async function handleUpdateTrade(req, res, tradeId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const existing = await findTradePostById(tradeId, authClaims);
    const currentUserId = authClaims.uid || authClaims.sub;
    if (!existing) {
      sendJson(res, 404, { error: "Trade no encontrado." });
      return;
    }
    if (existing.ownerId !== currentUserId) {
      sendJson(res, 403, { error: "Solo el creador puede editar este trade." });
      return;
    }

    const body = await readJsonBody(req);
    const me = await getCurrentUser(getImpersonationOptions(authClaims));
    const role = normalizeRole(me.data.appUser?.role);
    const userGuild = me.data.appUser?.guild || null;
    const payload = normalizeTradePayload(body, existing.category);
    if (!payload) {
      sendJson(res, 400, { error: "El titulo del trade es obligatorio." });
      return;
    }
    if (!canAccessCategory(role, userGuild, payload.category)) {
      sendJson(res, 403, { error: "Solo podes mover trades a tu propio gremio o a Alianza." });
      return;
    }

    await updateTradePost({ id: tradeId, ...payload }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo actualizar el trade." });
  }
}

async function handleDeleteTrade(req, res, tradeId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const existing = await findTradePostById(tradeId, authClaims);
    const currentUserId = authClaims.uid || authClaims.sub;
    if (!existing) {
      sendJson(res, 404, { error: "Trade no encontrado." });
      return;
    }
    if (existing.ownerId !== currentUserId) {
      sendJson(res, 403, { error: "Solo el creador puede eliminar este trade." });
      return;
    }
    await archiveTradePost({ id: tradeId }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo eliminar el trade." });
  }
}

async function handleApplyToTrade(req, res, tradeId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const existing = await findTradePostById(tradeId, authClaims);
    if (!existing) {
      sendJson(res, 404, { error: "Trade no encontrado." });
      return;
    }

    const me = await getCurrentUser(getImpersonationOptions(authClaims));
    const role = normalizeRole(me.data.appUser?.role);
    const userGuild = me.data.appUser?.guild || null;
    if (!canAccessCategory(role, userGuild, existing.category)) {
      sendJson(res, 403, { error: "No puedes aplicar a trades de otro gremio." });
      return;
    }

    if (existing.status && existing.status !== "open") {
      sendJson(res, 400, { error: "Este trade no esta abierto a aplicaciones." });
      return;
    }

    const body = await readJsonBody(req);
    const characterOwnerId = normalizeOptionalText(body.characterOwnerId, 128);
    const characterRegion = normalizeOptionalText(body.characterRegion, 12);
    const characterName = normalizeOptionalText(body.characterName, 32);
    if (!characterOwnerId || !characterRegion || !characterName) {
      sendJson(res, 400, { error: "Selecciona un personaje para aplicar." });
      return;
    }

    const result = await applyToTrade(
      {
        tradeId,
        characterOwnerId,
        characterRegion,
        characterName,
        message: normalizeOptionalText(body.message, 500),
      },
      getImpersonationOptions(authClaims)
    );
    sendJson(res, 201, { application: result.data.tradeApplication_insert });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo aplicar al trade." });
  }
}

async function handleUpdateTradeApplication(req, res, applicationId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const currentUserId = authClaims.uid || authClaims.sub;
    const body = await readJsonBody(req);
    const status = normalizeTradeApplicationStatus(body.status);
    const categories = VALID_PARTY_CATEGORIES;
    let ownerMatch = false;
    for (const category of categories) {
      const result = await listTradePosts({ category }, getImpersonationOptions(authClaims));
      ownerMatch = (result.data.tradePosts || []).some((trade) =>
        trade.ownerId === currentUserId
        && (trade.applications || []).some((application) => String(application.id) === String(applicationId))
      );
      if (ownerMatch) break;
    }
    if (!ownerMatch) {
      sendJson(res, 403, { error: "Solo el creador del trade puede actualizar esa aplicacion." });
      return;
    }

    await updateTradeApplicationStatus({ id: applicationId, status }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo actualizar la aplicacion." });
  }
}

async function handleDeleteTradeApplication(req, res, applicationId) {
  const authClaims = await requireAuth(req, res);
  if (!authClaims) return;

  try {
    const currentUserId = authClaims.uid || authClaims.sub;
    const categories = VALID_PARTY_CATEGORIES;
    let allowed = false;
    for (const category of categories) {
      const result = await listTradePosts({ category }, getImpersonationOptions(authClaims));
      allowed = (result.data.tradePosts || []).some((trade) => {
        const application = (trade.applications || []).find((item) => String(item.id) === String(applicationId));
        if (!application) return false;
        return trade.ownerId === currentUserId || application.applicantId === currentUserId;
      });
      if (allowed) break;
    }
    if (!allowed) {
      sendJson(res, 403, { error: "No podes eliminar esa aplicacion." });
      return;
    }

    await deleteTradeApplication({ id: applicationId }, getImpersonationOptions(authClaims));
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "No se pudo eliminar la aplicacion." });
  }
}

http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    setApiCorsHeaders(res);
  }

  if (DEV_LIVE_RELOAD && req.method === "GET" && req.url === "/__dev/reload") {
    handleDevReload(req, res);
    return;
  }

  if (req.method === "OPTIONS" && req.url.startsWith("/api/")) {
    send(res, 204, "");
    return;
  }

  if (req.method === "POST" && req.url === "/api/ask") {
    handleChatBotAsk(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/register") {
    handleRegister(req, res);
    return;
  }

  if (req.method === "GET" && req.url === "/api/me") {
    handleGetMe(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/me") {
    handleUpsertMe(req, res);
    return;
  }

  if (req.method === "GET" && req.url === "/api/characters") {
    handleListCharacters(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/characters") {
    handleSaveCharacter(req, res);
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/roster")) {
    const guild = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams.get("guild");
    handleListGuildRoster(req, res, guild);
    return;
  }

  if (req.method === "GET" && req.url === "/api/admin/users") {
    handleListAppUsers(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/admin/users/role") {
    handleUpdateUserRole(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/admin/users/guild") {
    handleUpdateUserGuild(req, res);
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/parties?")) {
    const searchParams = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams;
    handleListParties(req, res, searchParams.get("bossId"), searchParams.get("category"));
    return;
  }

  if (req.method === "POST" && req.url === "/api/parties") {
    handleCreateParty(req, res);
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/trades?")) {
    const searchParams = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams;
    handleListTrades(req, res, searchParams.get("category"));
    return;
  }

  if (req.method === "POST" && req.url === "/api/trades") {
    handleCreateTrade(req, res);
    return;
  }

  {
    const tradeMatch = req.url.match(/^\/api\/trades\/([^/]+)$/);
    if (tradeMatch && req.method === "PUT") {
      handleUpdateTrade(req, res, decodeURIComponent(tradeMatch[1]));
      return;
    }
    if (tradeMatch && req.method === "DELETE") {
      handleDeleteTrade(req, res, decodeURIComponent(tradeMatch[1]));
      return;
    }

    const tradeApplyMatch = req.url.match(/^\/api\/trades\/([^/]+)\/applications$/);
    if (tradeApplyMatch && req.method === "POST") {
      handleApplyToTrade(req, res, decodeURIComponent(tradeApplyMatch[1]));
      return;
    }

    const applicationMatch = req.url.match(/^\/api\/trade-applications\/([^/]+)$/);
    if (applicationMatch && req.method === "PATCH") {
      handleUpdateTradeApplication(req, res, decodeURIComponent(applicationMatch[1]));
      return;
    }
    if (applicationMatch && req.method === "DELETE") {
      handleDeleteTradeApplication(req, res, decodeURIComponent(applicationMatch[1]));
      return;
    }
  }

  {
    const partyMatch = req.url.match(/^\/api\/parties\/([^/]+)$/);
    if (partyMatch && req.method === "DELETE") {
      handleDeleteParty(req, res, decodeURIComponent(partyMatch[1]));
      return;
    }

    const memberMatch = req.url.match(/^\/api\/parties\/([^/]+)\/members$/);
    if (memberMatch && req.method === "POST") {
      handleUpsertPartyMember(req, res, decodeURIComponent(memberMatch[1]));
      return;
    }

    const memberDeleteMatch = req.url.match(/^\/api\/parties\/([^/]+)\/members\/(\d+)$/);
    if (memberDeleteMatch && req.method === "DELETE") {
      handleRemovePartyMember(req, res, decodeURIComponent(memberDeleteMatch[1]), memberDeleteMatch[2]);
      return;
    }
  }

  if (req.method === "GET" && req.url === "/api/health") {
    handleChatBotHealth(req, res);
    return;
  }

  if (req.url.startsWith("/chatbot")) {
    serveChatBotStatic(req, res);
    return;
  }

  if (req.url.startsWith("/api/character/") || req.url.startsWith("/api/character-fallback/")) {
    proxyMapleHub(req, res);
    return;
  }

  serveStatic(req, res);
}).listen(PORT, HOST, () => {
  console.log(`MapleTools running at http://${HOST}:${PORT}`);
});

watchDevFiles();
