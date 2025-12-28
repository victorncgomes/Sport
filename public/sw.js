// Service Worker para PWA Offline-First
// Sport Club de Natal v0.5.0

const CACHE_VERSION = 'scn-v0.5.0';
const CACHE_NAMES = {
    static: `${CACHE_VERSION}-static`,
    dynamic: `${CACHE_VERSION}-dynamic`,
    api: `${CACHE_VERSION}-api`,
    images: `${CACHE_VERSION}-images`
};

// Recursos para precache (App Shell)
const PRECACHE_URLS = [
    '/',
    '/offline',
    '/manifest.json',
    // Adicionar aqui CSS, JS principais após build
];

// Install: Precache do App Shell
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAMES.static)
            .then(cache => {
                console.log('[SW] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate: Limpar caches antigos
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => !Object.values(CACHE_NAMES).includes(name))
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Estratégias de cache por tipo de recurso
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requisições não-GET
    if (request.method !== 'GET') return;

    // Estratégia por tipo de recurso
    if (url.pathname.startsWith('/api/')) {
        // API: Network First com fallback para cache
        event.respondWith(networkFirstStrategy(request, CACHE_NAMES.api));
    } else if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
        // Imagens: Cache First
        event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.images));
    } else if (url.pathname.startsWith('/_next/') || url.pathname.match(/\.(js|css)$/)) {
        // Assets estáticos: Cache First
        event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.static));
    } else {
        // HTML e outros: Network First
        event.respondWith(networkFirstStrategy(request, CACHE_NAMES.dynamic));
    }
});

// Estratégia: Network First (API data, HTML)
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);

        // Cachear resposta bem-sucedida
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Fallback para cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] Serving from cache (offline):', request.url);
            return cachedResponse;
        }

        // Se não tem cache, retornar página offline
        if (request.destination === 'document') {
            return caches.match('/offline');
        }

        throw error;
    }
}

// Estratégia: Cache First (imagens, assets)
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Revalidar em background (stale-while-revalidate)
        fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
                caches.open(cacheName).then(cache => {
                    cache.put(request, networkResponse);
                });
            }
        }).catch(() => { });

        return cachedResponse;
    }

    // Não está em cache, buscar da rede
    try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        throw error;
    }
}

// Background Sync: Sincronizar dados offline
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-workouts') {
        event.waitUntil(syncWorkouts());
    } else if (event.tag === 'sync-reservations') {
        event.waitUntil(syncReservations());
    } else if (event.tag === 'sync-tasks') {
        event.waitUntil(syncVolunteerTasks());
    }
});

// Funções de sincronização (stubs - implementar com IndexedDB)
async function syncWorkouts() {
    console.log('[SW] Syncing workouts...');
    // TODO: Buscar workouts pendentes do IndexedDB e enviar para API
}

async function syncReservations() {
    console.log('[SW] Syncing reservations...');
    // TODO: Sincronizar check-ins/check-outs pendentes
}

async function syncVolunteerTasks() {
    console.log('[SW] Syncing volunteer tasks...');
    // TODO: Sincronizar submissões de tarefas
}

// Push Notifications (preparar para futuro)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Sport Club de Natal';
    const options = {
        body: data.body || 'Nova notificação',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data: data.url || '/',
        actions: data.actions || []
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                // Se já tem uma janela aberta, focar nela
                for (let client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Senão, abrir nova janela
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
