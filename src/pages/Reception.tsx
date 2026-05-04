import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Copy, Edit2, PlayCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { trackAccess } from '@/services/progress'

// Interfaces and Mock Data
interface VideoScript {
  id: string
  title: string
  duration: string
  description: string
  script: string
}

const mockVideos: VideoScript[] = [
  {
    id: 'mentalidade',
    title: 'A Mentalidade da Recepcionista de Elite',
    duration: '5-7 minutos',
    description: 'Descubra como uma recepcionista de elite pensa diferente e gera mais vendas',
    script:
      'Olá! Você sabe qual é a diferença entre uma recepcionista comum e uma de elite? Uma comum apenas anota recados, enquanto a de elite gera relacionamento e enxerga oportunidades. A de elite antecipa as necessidades da cliente e oferece soluções antes mesmo que ela peça. Resultado: Mais vendas, cliente mais satisfeito, salário maior.',
  },
  {
    id: 'upsell',
    title: 'Técnica de Upsell: Venda Cruzada Durante o Agendamento',
    duration: '5-7 minutos',
    description: 'Como oferecer serviços complementares sem parecer agressivo',
    script:
      'Upsell é oferecer um serviço complementar que agrega valor. Em vez de perguntar "Quer fazer mais alguma coisa?", diga "Notei que você agendou mechas. Para o loiro ficar perfeito, recomendamos o nosso protocolo de reconstrução rápida. Podemos incluir no seu agendamento?". Resultado: Ticket médio sobe 30-40%.',
  },
  {
    id: 'homecare',
    title: 'Venda de Produtos (Home Care) no Checkout',
    duration: '5-7 minutos',
    description: 'Técnica para vender produtos de cuidado em casa',
    script:
      'Home Care é o produto que o cliente usa em casa. Durante o pagamento, não pergunte se ela quer levar um produto. Diga: "Para manter esse resultado maravilhoso de hoje, nossa especialista separou esse kit de manutenção. Levando hoje, você economiza X%". Resultado: Venda adicional de R$ 80-150 por cliente.',
  },
]

const WHATSAPP_BASE_SCRIPT =
  'Oi [Nome]! 👋 Tudo bem? Notei que faz um tempo que você não vem nos visitar! 😊 Sabemos como o dia a dia é corrido, mas que tal tirar um tempinho para você? Preparamos uma oferta especial de [Promoção 1] por apenas [Preço Promo 1]! Podemos agendar para essa semana? Confirma aí! 💅'

// Subcomponents
function VideoCardItem({ video }: { video: VideoScript }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="border-purple-200 bg-purple-50/30 dark:border-purple-900/50 dark:bg-purple-900/10 flex flex-col h-full transition-all hover:border-purple-300 dark:hover:border-purple-800">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 dark:text-purple-300 leading-tight">
          {video.title}
        </CardTitle>
        <CardDescription className="font-medium text-purple-600/80 dark:text-purple-400/80">
          {video.duration}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-foreground/80">{video.description}</p>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/50 flex justify-between"
            >
              {isOpen ? 'Ocultar Script' : 'Ver Script'}
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in">
            <div className="p-3 bg-white dark:bg-background rounded-md border border-purple-100 dark:border-purple-800 text-sm italic text-foreground/90 leading-relaxed shadow-sm">
              "{video.script}"
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2" asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <PlayCircle className="h-4 w-4" />
            Assistir no YouTube
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Reception() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [videos, setVideos] = useState<VideoScript[]>([])

  // WhatsApp States
  const [nome, setNome] = useState('')
  const [promocao, setPromocao] = useState('')
  const [preco, setPreco] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    trackAccess?.('recepcao')

    let isMounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)
        // Simulate fetch delay
        await new Promise((r) => setTimeout(r, 800))
        if (isMounted) setVideos(mockVideos)
      } catch {
        if (isMounted) setError(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  const getCustomScript = () => {
    let script = WHATSAPP_BASE_SCRIPT
    script = script.replace('[Nome]', nome || '[Nome]')
    script = script.replace('[Promoção 1]', promocao || '[Promoção 1]')
    script = script.replace('[Preço Promo 1]', preco || '[Preço Promo 1]')
    return script
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Script copiado!',
      description: 'O script foi copiado para a área de transferência com sucesso.',
      duration: 3000,
    })
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 p-4 sm:p-6 animate-fade-in-up">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-fade-in-up">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Erro ao carregar. Tente novamente.</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-fade-in-up">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>Nenhum script disponível.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Recepção que Vende</h1>
        <p className="text-muted-foreground text-lg">
          Transforme sua recepção no coração estratégico de vendas do seu negócio.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-purple-900 dark:text-purple-400">
          3 Vídeos: Técnicas de Venda para Recepcionista
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCardItem key={video.id} video={video} />
          ))}
        </div>
      </section>

      <section className="space-y-6 pt-4">
        <Card className="border-orange-200 bg-orange-50/30 dark:border-orange-900/50 dark:bg-orange-900/10 transition-all hover:border-orange-300 dark:hover:border-orange-800">
          <CardHeader>
            <CardTitle className="text-xl text-orange-800 dark:text-orange-400">
              Script WhatsApp: Recuperando Clientes (45+ dias sem vir)
            </CardTitle>
            <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
              Utilize esta mensagem para atrair de volta clientes que não visitam o salão há algum
              tempo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white dark:bg-background rounded-md border border-orange-100 dark:border-orange-800 text-base whitespace-pre-wrap leading-relaxed shadow-sm text-foreground/90">
              {WHATSAPP_BASE_SCRIPT}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => handleCopy(WHATSAPP_BASE_SCRIPT)}
              className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:flex-1 gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar Script Base
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-orange-200 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/50 w-full sm:flex-1 gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Personalizar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Personalizar Script WhatsApp</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para gerar uma mensagem exclusiva.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome do Cliente</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Ana Maria"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="promocao">Promoção 1</Label>
                    <Input
                      id="promocao"
                      value={promocao}
                      onChange={(e) => setPromocao(e.target.value)}
                      placeholder="Ex: Combo Mechas + Hidratação"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="preco">Preço Promo 1</Label>
                    <Input
                      id="preco"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      placeholder="Ex: R$ 399,90"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-100 dark:border-orange-900/50 text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                    {getCustomScript()}
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleCopy(getCustomScript())}
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar e Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
