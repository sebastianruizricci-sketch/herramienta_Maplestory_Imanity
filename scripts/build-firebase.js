const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const copyPaths = [
  "index.html",
  "trades.html",
  "assets",
  "bosses",
  "data",
  "scripts",
  "styles",
  "references",
];

const chatbotStaticFiles = [
  "index.html",
  "app.js",
  "styles.css",
  "image.png",
];

function resetDist() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
}

function copyRecursive(source, target) {
  const stats = fs.statSync(source);
  const baseName = path.basename(source);

  if (baseName === "build-firebase.js") return;

  if (stats.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyMainApp() {
  for (const relativePath of copyPaths) {
    const source = path.join(ROOT, relativePath);
    if (!fs.existsSync(source)) continue;
    copyRecursive(source, path.join(DIST, relativePath));
  }
}

function copyChatbot() {
  const sourceRoot = path.join(ROOT, "test chatbot", "Chatbot");
  const targetRoot = path.join(DIST, "chatbot");

  for (const fileName of chatbotStaticFiles) {
    const source = path.join(sourceRoot, fileName);
    if (!fs.existsSync(source)) continue;
    copyRecursive(source, path.join(targetRoot, fileName));
  }
}

resetDist();
copyMainApp();
copyChatbot();

console.log(`Firebase static build ready at ${path.relative(ROOT, DIST)}`);
