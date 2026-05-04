import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { PwaBanner } from './PwaBanner'
import { OfflineWarning } from './OfflineWarning'

export function PwaManager() {
  const { toast } = useToast()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast({
                      title: 'Nova versão disponível',
                      description: 'Atualize a página para acessar os novos recursos.',
                      action: (
                        <button
                          className="bg-[#8B5CF6] text-white px-3 py-1 rounded text-[14px] font-medium hover:bg-purple-600 transition-all duration-200 hover:scale-105"
                          onClick={() => window.location.reload()}
                        >
                          Atualizar
                        </button>
                      ),
                      duration: 10000,
                    })
                  }
                })
              }
            })
          },
          (err) => {
            console.error('ServiceWorker registration failed: ', err)
            toast({
              variant: 'destructive',
              title: 'Erro ao registrar PWA',
              description: 'Tente recarregar a página.',
            })
          },
        )
      })
    }
  }, [toast])

  return (
    <>
      <PwaBanner />
      <OfflineWarning />
    </>
  )
}
