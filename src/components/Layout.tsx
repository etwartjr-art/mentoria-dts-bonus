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
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Crown className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-heading font-bold text-lg text-primary text-gradient-gold">
              Mentoria
            </span>
            <span className="text-xs text-muted-foreground font-medium">High-Ticket Beauty</span>
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
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="w-px h-4 bg-border mx-2" />
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-primary hidden sm:block" />
              <h1 className="font-heading text-lg text-foreground/90 font-semibold truncate max-w-[150px] sm:max-w-none">
                Mentoria Beleza High-Ticket
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:inline-block">
              {user.name || user.email}
            </span>
            <Avatar className="size-8 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2"
            >
              <span className="hidden sm:inline-block">Sair</span>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 animate-fade-in flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Mentoria High-Ticket. Todos os direitos reservados.
            </p>
            <a href="#" className="hover:text-primary transition-colors font-medium">
              Suporte
            </a>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
