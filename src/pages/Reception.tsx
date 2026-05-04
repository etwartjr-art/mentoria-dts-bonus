import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'
import { trackAccess } from '@/services/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Copy, MessageCircle, PlayCircle, Star, ShoppingBag } from 'lucide-react'

const scriptsData = [
  {
    id: 'mentalidade',
    icon: Star,
    label: 'Mentalidade',
    title: 'Mentalidade de Elite na Recepção',
    scenario: 'Primeiro contato com o cliente (Presencial ou WhatsApp).',
    action: 'Postura reta, tom de voz acolhedor, sorriso na voz. Nunca iniciar com "Pois não?".',
    speech:
      '"Olá, bom dia! Seja muito bem-vinda ao [Nome do Salão]. Meu nome é [Seu Nome], como posso tornar sua experiência incrível hoje?"',
  },
  {
    id: 'upsell',
    icon: ShoppingBag,
    label: 'Técnica de Upsell',
    title: 'Venda Adicional (Hidratação/Tratamento)',
    scenario: 'Cliente está aguardando ou durante a lavagem.',
    action:
      'Identificar a necessidade do fio antes de oferecer. Oferecer como uma solução, não como uma venda.',
    speech:
      '"[Nome do Cliente], conversando com a especialista, notamos que seu fio precisa de reposição hídrica hoje para o loiro durar mais. Temos um protocolo de nutrição rápida que leva apenas 10 minutos a mais. Podemos incluir no seu pacote hoje por apenas [Valor]?"',
  },
  {
    id: 'checkout',
    icon: PlayCircle,
    label: 'Checkout / Home Care',
    title: 'Venda de Manutenção (Home Care)',
    scenario: 'Momento do pagamento.',
    action: 'Ter os produtos indicados fisicamente no balcão, perto da máquina de cartão.',
    speech:
      '"[Nome], seu cabelo ficou maravilhoso! Para manter esse brilho de salão em casa, a [Profissional] separou este kit específico para sua estrutura de fio. Se você levar hoje, seu tratamento aqui vai durar o dobro do tempo. Levamos junto?"',
  },
]

const whatsappTemplate = `Olá [Nome da Cliente], quanto tempo! Sentimos sua falta por aqui. ✨

Percebi que faz 45 dias desde sua última visita e sabemos como é importante manter o cuidado em dia. Que tal renovarmos seu visual esta semana?

Tenho um horário especial e exclusivo para você na [Dia da Semana] às [Horário]. Podemos confirmar?`

export default function Reception() {
  const { toast } = useToast()

  useEffect(() => {
    trackAccess('recepcao')
  }, [])

  const copyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappTemplate)
    toast({
      title: 'Script Copiado!',
      description: 'Template de WhatsApp copiado para a área de transferência.',
    })
  }

  return (
    <div
      className="max-w-4xl mx-auto space-y-8 animate-slide-up opacity-0"
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Treinamento: Recepção que Vende
        </h1>
        <p className="text-muted-foreground">
          Transforme sua recepção no coração estratégico de vendas do seu negócio.
        </p>
      </div>

      <Tabs defaultValue="mentalidade" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1 rounded-lg">
          {scriptsData.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm transition-all"
            >
              <tab.icon className="size-4 mr-2 hidden sm:inline-block" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {scriptsData.map((script) => (
          <TabsContent key={script.id} value={script.id} className="mt-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-primary">{script.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Cenário
                  </h4>
                  <p className="text-sm text-foreground/90 bg-background/50 p-3 rounded-md border border-border/50">
                    {script.scenario}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Ação
                  </h4>
                  <p className="text-sm text-foreground/90 bg-background/50 p-3 rounded-md border border-border/50">
                    {script.action}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fala (O Script)
                  </h4>
                  <p className="text-base font-medium italic text-primary/90 bg-primary/5 p-4 rounded-md border border-primary/20">
                    {script.speech}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* WhatsApp Template Card */}
      <Card className="border-primary/20 bg-card/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <MessageCircle className="size-32" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5 text-emerald-500" />
              Template de Reativação (45 dias)
            </CardTitle>
            <CardDescription>
              Para clientes que não retornam há mais de 1 mês e meio.
            </CardDescription>
          </div>
          <Button onClick={copyWhatsApp} variant="secondary" size="sm" className="h-8 gap-2 z-10">
            <Copy className="size-4" />
            Copiar Script
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="rounded-md bg-secondary/30 p-4 border border-border/50 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {whatsappTemplate}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
