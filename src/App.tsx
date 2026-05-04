import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import Index from './pages/Index'
import LegalKit from './pages/LegalKit'
import Calculator from './pages/Calculator'
import Reception from './pages/Reception'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/kit-juridico" element={<LegalKit />} />
            <Route path="/calculadora" element={<Calculator />} />
            <Route path="/recepcao-vende" element={<Reception />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
