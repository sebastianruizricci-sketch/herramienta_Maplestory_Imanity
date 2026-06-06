(function () {
  const renderApiBase = "https://herramienta-maplestory-imanity-api.onrender.com";
  const hostname = window.location.hostname;
  const isFirebaseHosting = hostname.endsWith(".web.app") || hostname.endsWith(".firebaseapp.com");

  window.MAPLETOOLS_API_BASE = window.MAPLETOOLS_API_BASE || (isFirebaseHosting ? renderApiBase : "");
})();
