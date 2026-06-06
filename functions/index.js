const https = require("https");
const { onRequest } = require("firebase-functions/v2/https");

function send(res, status, body, headers = {}) {
  res.status(status);
  Object.entries(headers).forEach(([key, value]) => res.set(key, value));
  res.send(body);
}

function proxyMapleHub(req, res) {
  if (!req.path.startsWith("/api/character/") && !req.path.startsWith("/api/character-fallback/")) {
    send(res, 404, JSON.stringify({ error: "Not found" }), {
      "Content-Type": "application/json; charset=utf-8",
    });
    return;
  }

  const targetUrl = new URL(`https://maplehub.app${req.originalUrl || req.url}`);

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

exports.api = onRequest({ region: "us-central1" }, proxyMapleHub);
