/* Service worker: PWA + notificaciones en segundo plano (FCM) */

importScripts('./config.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const CACHE = 'remedios-v1';
const ASSETS = ['./', './index.html', './config.js', './manifest.webmanifest',
                './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Red primero para los datos; cache como respaldo para los archivos de la app.
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (url.includes('script.google.com') || url.includes('googleapis.com')) return; // datos: no cachear
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});

// Firebase Cloud Messaging (mensajes en segundo plano)
try {
  firebase.initializeApp(FIREBASE_CONFIG);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const n = payload.notification || {};
    self.registration.showNotification(n.title || '💊 Recordatorio de remedio', {
      body: n.body || 'Toca para abrir',
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: (payload.data && payload.data.tag) || 'dosis',
      data: { link: (payload.fcmOptions && payload.fcmOptions.link) || './index.html' }
    });
  });
} catch (err) {
  // Si Firebase aún no está configurado, la PWA igual funciona sin push.
}

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const link = (e.notification.data && e.notification.data.link) || './index.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(link);
    })
  );
});
