const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

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

http.createServer((req, res) => {
  if (req.url.startsWith("/api/character/") || req.url.startsWith("/api/character-fallback/")) {
    proxyMapleHub(req, res);
    return;
  }

  serveStatic(req, res);
}).listen(PORT, HOST, () => {
  console.log(`MapleTools running at http://${HOST}:${PORT}`);
});
