import { WifiOff } from 'lucide-react'
import { useNetwork } from '@/hooks/use-network'

export function OfflineWarning() {
  const { isOnline } = useNetwork()

  if (isOnline) return null

  return (
    <div className="bg-[#EF4444] text-white px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium w-full shadow-md z-[100] relative animate-in slide-in-from-top-4 fade-in">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>Você está offline. Verifique sua conexão para acessar dados atualizados.</span>
    </div>
  )
}
