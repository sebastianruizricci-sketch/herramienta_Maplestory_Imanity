const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const dotenv = require("dotenv");

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

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers);
  res.end(body);
};

function setApiCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type, X-MapleHub-Request");
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

    send(res, 200, data, {
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
  send(res, 200, JSON.stringify({ ok: true, sources: CHATBOT_CONFIG.length }), {
    "Content-Type": "application/json; charset=utf-8",
  });
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
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

async function handleRegister(req, res) {
  try {
    const body = await readJsonBody(req);
    const username = normalizeUsername(body.username);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const inviteToken = String(body.inviteToken || "").trim();

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

    send(res, 201, JSON.stringify({ ok: true, email: authEmail, username }), {
      "Content-Type": "application/json; charset=utf-8",
    });
  } catch (error) {
    const status = error.status === 400 ? 400 : 500;
    send(res, status, JSON.stringify({ error: getRegisterErrorMessage(error) }), {
      "Content-Type": "application/json; charset=utf-8",
    });
  }
}

http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    setApiCorsHeaders(res);
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
