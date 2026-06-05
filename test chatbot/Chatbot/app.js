const chatHistory = document.getElementById("chatHistory");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const jobRoleInput = document.getElementById("jobRoleInput");
const setRoleBtn = document.getElementById("setRoleBtn");

let selectedClass = "MapleStory";
const cleanBotText = (text) =>
  text
    .replace(/\*\*/g, "")
    .replace(/#{1,6}\s?/g, "")
    .replace(/^\s*[-*]\s+/gm, "- ")
    .trim();

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMessageText = (text) => {
  const blocks = escapeHtml(text)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => block.replace(/\n/g, "<br />"))
    .map((block) => `<p>${block}</p>`)
    .join("");
};

const addMessage = (text, sender) => {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(
    "message",
    sender === "user" ? "user-message" : "ai-message"
  );

  if (sender === "ai") {
    messageDiv.innerHTML = formatMessageText(text);
  } else {
    messageDiv.textContent = text;
  }

  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
};

const showLoading = (show) => {
  if (show) {
    sendBtn.disabled = true;
    userInput.disabled = true;
    sendBtn.innerHTML = `
      <div class="flex items-center justify-center space-x-2">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>`;
  } else {
    sendBtn.disabled = false;
    userInput.disabled = false;
    sendBtn.textContent = "Send";
  }
};

const getGeminiResponse = async (query) => {
  showLoading(true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: query,
        className: selectedClass,
      }),
    });

    const result = await response.json();
    const text = result.text || result.error || "No response received.";

    addMessage(cleanBotText(text), "ai");
  } catch (error) {
    console.error("API call failed:", error);
    addMessage(
      "No pude conectar con el backend ahora mismo. Revisa que el servidor este corriendo.",
      "ai"
    );
  } finally {
    showLoading(false);
  }
};

const sendMessage = () => {
  syncSelectedClass();
  const query = userInput.value.trim();
  if (!query) return;

  addMessage(query, "user");
  userInput.value = "";
  getGeminiResponse(query);
};

const titleCase = (value) =>
  value
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const syncSelectedClass = (classRaw = jobRoleInput.value) => {
  selectedClass = classRaw && classRaw.trim() ? titleCase(classRaw) : "MapleStory";
};

const applyClass = (classRaw) => {
  syncSelectedClass(classRaw);
  chatHistory.innerHTML = "";
  addMessage(
    `Bienvenidos al ChatBot de Imanity! Clase seleccionada: ${selectedClass}. Preguntame por builds, bosses, farming, nodestones, legion o progresion.`,
    "ai"
  );
};

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

setRoleBtn.addEventListener("click", () => applyClass(jobRoleInput.value));

jobRoleInput.addEventListener("change", () => {
  syncSelectedClass(jobRoleInput.value);
});

jobRoleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applyClass(jobRoleInput.value);
  }
});

window.onload = function () {
  addMessage(
    "Bienvenidos al ChatBot de Imanity! Elige una clase de MapleStory o preguntame directo sobre tu personaje.",
    "ai"
  );
};
