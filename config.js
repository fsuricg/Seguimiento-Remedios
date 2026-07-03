/* ============================================================
   CONFIGURACIÓN — Edita SOLO este archivo.
   Lo usan tanto la app (index.html) como el service worker (sw.js).
   ============================================================ */

// 1) URL de tu Web App de Apps Script (termina en /exec)
const API_URL = https://script.google.com/macros/s/AKfycbyplDl6Ruwcr2QNLcUC6lzjS4cOBGNeUdk6afvRLZk2mMCP_23KaFkvLBNPthJwd2Emvg/exec

// 2) Configuración de tu proyecto Firebase (Ajustes del proyecto > Tus apps > Web)
const FIREBASE_CONFIG = {
  apiKey: "PEGA_AQUI",
  authDomain: "PEGA_AQUI.firebaseapp.com",
  projectId: "PEGA_AQUI",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};

// 3) Clave VAPID (Firebase > Cloud Messaging > Certificados push web > Par de claves)
const VAPID_KEY = "PEGA_AQUI_LA_CLAVE_VAPID";
