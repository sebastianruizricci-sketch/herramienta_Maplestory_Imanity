(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCylI-FadSqtTED7fQH6-Z4LWMIkbOfbAI",
    authDomain: "herramienta-maplestory-imanity.firebaseapp.com",
    projectId: "herramienta-maplestory-imanity",
    storageBucket: "herramienta-maplestory-imanity.firebasestorage.app",
    messagingSenderId: "902791790114",
    appId: "1:902791790114:web:8b2f1d370fd679ce67d47b",
  };

  if (window.firebase && !window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }
})();
