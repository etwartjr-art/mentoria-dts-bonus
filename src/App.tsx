import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import { PwaManager } from './components/PwaManager'
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const Index = lazy(() => import('./pages/Index'))
const LegalKit = lazy(() => import('./pages/LegalKit'))
const Calculator = lazy(() => import('./pages/Calculator'))
const Reception = lazy(() => import('./pages/Reception'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

const PageFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center p-8">
    <div className="space-y-4 w-full max-w-sm flex flex-col items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
)

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PwaManager />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/kit-juridico" element={<LegalKit />} />
              <Route path="/calculadora" element={<Calculator />} />
              <Route path="/recepcao-vende" element={<Reception />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
