// Registrar Service Worker
// Sport Club de Natal v0.5.0

export function registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered:', registration.scope);

                    // Verificar atualizações a cada 1 hora
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });
    }
}

// Detectar se está offline
export function isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Listener para mudanças de status de rede
export function onNetworkChange(callback: (online: boolean) => void) {
    if (typeof window !== 'undefined') {
        window.addEventListener('online', () => callback(true));
        window.addEventListener('offline', () => callback(false));
    }
}

// Prompt de instalação PWA
export function setupInstallPrompt() {
    if (typeof window === 'undefined') return;

    let deferredPrompt: any = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Mostrar prompt customizado após 3 visitas ou 1 treino
        const visits = parseInt(localStorage.getItem('scn-visits') || '0');
        const workouts = parseInt(localStorage.getItem('scn-workouts') || '0');

        if (visits >= 3 || workouts >= 1) {
            showInstallBanner(deferredPrompt);
        }
    });

    // Incrementar contador de visitas
    const visits = parseInt(localStorage.getItem('scn-visits') || '0');
    localStorage.setItem('scn-visits', (visits + 1).toString());
}

function showInstallBanner(deferredPrompt: any) {
    // Verificar se já foi instalado ou rejeitado
    if (localStorage.getItem('scn-install-rejected')) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Criar banner discreto
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      max-width: 90%;
      width: 400px;
      animation: slideUp 0.3s ease-out;
    ">
      <p style="margin: 0 0 12px 0; font-weight: 600; font-size: 14px;">
        Instalar Sport Club de Natal
      </p>
      <p style="margin: 0 0 16px 0; font-size: 12px; opacity: 0.9;">
        Acesse rapidamente seus treinos e reservas
      </p>
      <div style="display: flex; gap: 8px;">
        <button id="install-btn" style="
          flex: 1;
          background: white;
          color: #DC2626;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        ">
          Instalar
        </button>
        <button id="dismiss-btn" style="
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        ">
          Agora não
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(banner);

    // Handler de instalação
    document.getElementById('install-btn')?.addEventListener('click', async () => {
        banner.remove();
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'dismissed') {
            localStorage.setItem('scn-install-rejected', 'true');
        }

        deferredPrompt = null;
    });

    // Handler de dismiss
    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
        banner.remove();
        localStorage.setItem('scn-install-rejected', 'true');
    });
}
