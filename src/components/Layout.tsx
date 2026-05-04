import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Crown,
  ClipboardList,
  BarChart,
  Clapperboard,
  LayoutDashboard,
  LogOut,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kit Jurídico', href: '/kit-juridico', icon: ClipboardList },
  { name: 'Calculadora', href: '/calculadora', icon: BarChart },
  { name: 'Recepção', href: '/recepcao-vende', icon: Clapperboard },
]

export default function Layout() {
  const location = useLocation()
  const { user, loading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-[56px] lg:h-[64px] shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-5 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-11 w-11"
                aria-label="Abrir Menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <Crown className="size-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <SheetTitle className="text-xl font-bold text-primary m-0">
                      DTS Mentoria
                    </SheetTitle>
                    <span className="text-sm font-medium text-muted-foreground">
                      High-Ticket Beauty
                    </span>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Bônus Exclusivos
                </div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium transition-all duration-200 hover:scale-105 ${
                      location.pathname === item.href
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20'
                    }`}
                  >
                    <item.icon className="size-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/dashboard" className="flex items-center gap-2">
            <Crown className="size-6 text-primary lg:size-7" />
            <span className="text-[20px] lg:text-[24px] font-bold text-primary hidden sm:block">
              DTS Mentoria
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-[16px] font-medium transition-all duration-200 hover:scale-105 ${
                  location.pathname === item.href
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[16px] font-normal text-foreground hidden sm:inline-block max-w-[150px] truncate">
            {user.name || user.email}
          </span>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-foreground hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Sair"
          >
            <LogOut className="size-5 sm:mr-2" />
            <span className="hidden sm:inline-block text-[16px]">Sair</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-background animate-fade-in flex flex-col p-4 sm:p-5 lg:p-8">
        <div className="mx-auto w-full max-w-6xl flex-1">
          <Outlet />
        </div>
      </main>

      <footer className="p-4 border-t border-border bg-white mt-auto">
        <p className="text-center text-muted-foreground text-[14px] font-medium">
          &copy; {new Date().getFullYear()} DTS Mentoria
        </p>
      </footer>
    </div>
  )
}
