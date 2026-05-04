import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  BarChart,
  Clapperboard,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'

type Status = 'loading' | 'success' | 'empty' | 'error'

export default function Index() {
  const [status, setStatus] = useState<Status>('loading')
  const [modules, setModules] = useState<any[]>([])

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setStatus('loading')
        let userAcessos: string[] = []
        let progresso: any = null
        if (pb.authStore.record) {
          try {
            const acessos = await pb
              .collection('bonus_acesso')
              .getFullList({ filter: `user="${pb.authStore.record.id}"` })
            userAcessos = acessos.map((a) => a.tipo_bonus)
          } catch {
            /* intentionally ignored */
          }
          try {
            progresso = await pb
              .collection('progresso_juridico')
              .getFirstListItem(`user="${pb.authStore.record.id}"`)
          } catch {
            /* intentionally ignored */
          }
        }

        const checkAcessado = (id: string) => userAcessos.includes(id)

        const data = [
          {
            title: 'Kit de Sobrevivência Jurídica',
            description: 'Checklist da Lei do Salão Parceiro, modelos de NDA e alertas vitais.',
            icon: ClipboardList,
            href: '/juridico',
            color: 'text-blue-500',
            acessado: checkAcessado('juridico'),
            progressoText: progresso
              ? `${[progresso.checklist_completo, progresso.nda_baixado].filter(Boolean).length}/2 Concluído`
              : null,
          },
          {
            title: 'Calculadora de Lucro Real',
            description: 'Estrutura exata para calcular seu custo por minuto e lucro líquido.',
            icon: BarChart,
            href: '/calculadora',
            color: 'text-emerald-500',
            acessado: checkAcessado('calculadora'),
            progressoText: checkAcessado('calculadora') ? 'Acessado' : 'Novo',
          },
          {
            title: 'Recepção que Vende',
            description: 'Scripts de vendas, mentalidade e mensagens de reativação.',
            icon: Clapperboard,
            href: '/recepcao',
            color: 'text-purple-500',
            acessado: checkAcessado('recepcao'),
            progressoText: checkAcessado('recepcao') ? 'Acessado' : 'Novo',
          },
        ]

        if (data.length === 0) {
          setStatus('empty')
        } else {
          setModules(data)
          setStatus('success')
        }
      } catch (err) {
        setStatus('error')
      }
    }

    fetchModules()
  }, [])

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-[250px] w-full rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[220px] rounded-xl" />
          <Skeleton className="h-[220px] rounded-xl" />
          <Skeleton className="h-[220px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 max-w-5xl mx-auto">
        <p className="text-destructive font-medium text-lg">Erro ao carregar. Tente novamente</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-20 max-w-5xl mx-auto text-muted-foreground">
        <p className="font-medium text-lg">Nenhum bônus disponível</p>
      </div>
    )
  }

  return (
    <div
      className="max-w-5xl mx-auto space-y-8 animate-slide-up opacity-0"
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            <span>Conteúdo Exclusivo</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Bem-vindo ao seu <br />
            <span className="text-gradient-gold">Dashboard de Elite</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Acesse as ferramentas práticas e materiais complementares da mentoria. Estes 3 bônus
            foram desenhados para proteger seu negócio, garantir sua margem de lucro e aumentar seu
            faturamento imediato.
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {modules.map((mod) => (
          <Card
            key={mod.href}
            className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <mod.icon className={`size-10 ${mod.color}`} />
                {mod.acessado ? (
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20 gap-1.5"
                  >
                    <CheckCircle2 className="size-3.5" />
                    {mod.progressoText || 'Acessado'}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                    Novo
                  </Badge>
                )}
              </div>
              <CardTitle className="font-heading text-xl">{mod.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed mt-2">
                {mod.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Button asChild className="w-full group/btn" variant="outline">
                <Link to={mod.href}>
                  Acessar Conteúdo
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Tips */}
      <section className="rounded-xl border border-border/50 bg-secondary/30 p-6">
        <h3 className="font-heading text-lg font-semibold mb-4 text-primary">
          Dicas de Ouro para o Sucesso
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Sempre adapte os scripts de vendas para o seu tom de voz e da sua marca.</li>
          <li>Revise seu custo por minuto a cada 3 meses para não perder margem de lucro.</li>
          <li>Contratos verbais não têm validade jurídica no regime de salão parceiro.</li>
        </ul>
      </section>
    </div>
  )
}
