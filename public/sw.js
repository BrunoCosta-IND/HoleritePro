const CACHE_NAME = 'holerites-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Não interceptar requisições para a API do Supabase ou Google Analytics
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('google-analytics.com') ||
      event.request.url.includes('googletagmanager.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o cache se encontrado
        if (response) {
          return response;
        }
        
        // Se não estiver no cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Se falhar na rede, retorna página offline
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            return new Response('', { status: 404 });
          });
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Forçar limpeza de caches antigos
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Limpando cache antigo:', cacheName)
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Forçar atualização de todas as abas abertas
      return self.clients.claim();
    })
  );
});

// Interceptar mensagens para forçar atualização
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  let options = {
    body: 'Novo holerite disponível!',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'Ver Holerite',
        icon: '/logo.png'
      },
      {
        action: 'dismiss',
        title: 'Fechar',
        icon: '/logo.png'
      }
    ]
  };

  // Se há dados na notificação, usar eles
  if (event.data) {
    try {
      const pushData = event.data.json();
      options = {
        ...options,
        title: pushData.title || 'Portal de Holerites',
        body: pushData.body || options.body,
        data: {
          ...options.data,
          ...pushData.data
        },
        actions: pushData.actions || options.actions
      };
    } catch (error) {
      // Erro ao processar dados da notificação
    }
  }

  event.waitUntil(
    self.registration.showNotification(options.title || 'Portal de Holerites', options)
  );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Abrir o dashboard do funcionário
    event.waitUntil(
      clients.openWindow('/funcionario-dashboard')
    );
  } else if (event.action === 'dismiss') {
    // Apenas fechar a notificação
    event.notification.close();
  } else {
    // Clique na notificação sem ação específica
    event.waitUntil(
      clients.openWindow('/funcionario-dashboard')
    );
  }
}); 