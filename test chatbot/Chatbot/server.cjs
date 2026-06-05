const http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const guideSources = require("./docs.config.cjs");

const ROOT = __dirname;
const PROJECT_ROOT = path.join(ROOT, "..", "..");
const SKILL_DATA = require(path.join(PROJECT_ROOT, "data", "skills.json"));

dotenv.config({ path: path.join(ROOT, ".env") });
dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });

const PORT = Number(process.env.PORT || 3000);
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
  "Hayato",
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

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

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

  for (const source of guideSources) {
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

const contentTypeByExtension = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const serveStatic = (req, res) => {
  const distDir = path.join(__dirname, "dist");
  const requestedPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.normalize(path.join(distDir, requestedPath));

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(distDir, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404);
          res.end("Not found. Run npm run build first.");
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fallback);
      });
      return;
    }

    const extension = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": contentTypeByExtension[extension] || "text/plain",
    });
    res.end(content);
  });
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    sendJson(res, 200, { ok: true, sources: guideSources.length });
    return;
  }

  if (req.method === "POST" && req.url === "/api/ask") {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY or VITE_API_KEY in .env.");
      }

      const body = await readJsonBody(req);
      const message = String(body.message || "").trim();
      const className = toTitleCase(body.className || "MapleStory");

      if (!message) {
        sendJson(res, 400, { error: "Message is required." });
        return;
      }

      const context = await buildGuideContext(className);

      const text = await askGemini({ message, className, context });
      sendJson(res, 200, { text: cleanBotText(text), hasContext: Boolean(context) });
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Imanity backend running at http://127.0.0.1:${PORT}`);
});
