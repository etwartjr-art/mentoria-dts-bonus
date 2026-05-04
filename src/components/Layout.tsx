import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Crown, ClipboardList, BarChart, Clapperboard, LayoutDashboard, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kit Jurídico', href: '/kit-juridico', icon: ClipboardList },
  { name: 'Calculadora de Lucro', href: '/calculadora', icon: BarChart },
  { name: 'Recepção que Vende', href: '/recepcao-vende', icon: Clapperboard },
]

export default function Layout() {
  const location = useLocation()
  const { user, loading, signOut } = useAuth()

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

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r-border/50">
        <SidebarHeader className="p-4 flex flex-row items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Crown className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-xl font-bold text-primary">DTS Mentoria</span>
            <span className="text-sm font-medium text-muted-foreground">High-Ticket Beauty</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground uppercase text-xs tracking-wider">
              Bônus Exclusivos
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      className="hover:bg-primary/10 hover:text-primary transition-colors data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                      <Link to={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 md:px-8 shadow-sm z-10 relative">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" aria-label="Abrir Menu" />
            <Link to="/dashboard" className="flex items-center gap-2">
              <Crown className="size-6 text-primary" />
              <h1 className="text-xl font-bold text-primary hidden sm:block">DTS Mentoria</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-base font-normal text-foreground hidden sm:inline-block">
              {user.name || user.email}
            </span>
            <Button
              variant="outline"
              onClick={signOut}
              className="text-foreground hover:text-primary transition-colors duration-200"
              aria-label="Sair"
            >
              <LogOut className="size-5 mr-2 hidden sm:inline-block" />
              Sair
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background animate-fade-in flex flex-col">
          <div className="px-4 md:px-8 py-8 flex-1">
            <Outlet />
          </div>
          <footer className="p-4 border-t border-border bg-white mt-auto">
            <p className="text-center text-muted-foreground text-sm font-medium">
              &copy; {new Date().getFullYear()} DTS Mentoria
            </p>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
