import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)

      const lastDismissed = localStorage.getItem('pwa-banner-dismissed')
      if (lastDismissed) {
        const dismissedAt = new Date(lastDismissed).getTime()
        const sevenDays = 7 * 24 * 60 * 60 * 1000
        if (Date.now() - dismissedAt < sevenDays) {
          return
        }
      }
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setShowBanner(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', new Date().toISOString())
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500 flex items-start gap-4">
      <img
        src="https://img.usecurling.com/i?q=beauty&shape=fill&color=violet&size=64"
        alt="App Icon"
        className="w-12 h-12 rounded-lg object-cover bg-purple-50"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 leading-tight">Adicionar à tela inicial</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">Acesse como app nativo</p>
        <div className="flex gap-2">
          <Button
            className="bg-[#10B981] hover:bg-[#059669] text-white flex-1 transition-colors"
            size="sm"
            onClick={handleInstall}
          >
            Instalar
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-gray-500 border-gray-200 hover:bg-gray-50 transition-colors"
            size="sm"
            onClick={handleDismiss}
          >
            Depois
          </Button>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-gray-600 absolute top-3 right-3 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
