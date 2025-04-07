'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Previne o comportamento padrão do navegador
      e.preventDefault();
      // Armazena o evento para uso posterior
      setDeferredPrompt(e);
      // Indica que o app pode ser instalado
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostra o prompt de instalação
    deferredPrompt.prompt();

    // Aguarda a resposta do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    // Limpa o prompt armazenado
    setDeferredPrompt(null);
    setIsInstallable(false);
    
    console.log(`Usuário respondeu ao prompt de instalação: ${outcome}`);
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Instale nosso aplicativo</h3>
          <p className="text-sm">Acesse mais rápido e use offline</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            Instalar
          </button>
          <button
            onClick={() => setIsInstallable(false)}
            className="bg-transparent border border-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
} 