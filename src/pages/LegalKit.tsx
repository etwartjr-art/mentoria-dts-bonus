import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { trackAccess, getProgress, updateProgress } from '@/services/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Share2, FileDown, CheckCircle2, AlertTriangle, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'

const checklistItems = [
  'Identificação das partes',
  'Descrição dos serviços',
  'Remuneração',
  'Horário de funcionamento',
  'Responsabilidade por insumos',
  'Confidencialidade',
  'Vigência e rescisão',
  'Direitos e deveres',
  'Assinatura',
]

const ndaText = `ACORDO DE CONFIDENCIALIDADE (NDA)

PARTES:
[Nome do Salão Parceiro], CNPJ [00.000.000/0000-00], neste ato representado por [Nome do Representante], doravante denominado SALÃO.
[Nome do Profissional Parceiro], CPF [000.000.000-00], doravante denominado PROFISSIONAL.

CONSIDERANDO QUE:
O Salão detém informações confidenciais sobre clientes, processos e técnicas de gestão;
O Profissional terá acesso a tais informações durante a vigência da parceria.

CLÁUSULA 1 - DO OBJETO
Este acordo visa proteger todas as informações sigilosas e dados de clientes aos quais o Profissional terá acesso.

CLÁUSULA 2 - DA CONFIDENCIALIDADE
O Profissional compromete-se a manter absoluto sigilo sobre dados, processos, planilhas e informações de clientes do Salão.

CLÁUSULA 3 - DAS PROIBIÇÕES
Fica expressamente proibida a captação direta de clientes do Salão para atendimento particular ou em concorrentes, assim como a cópia ou extração da base de dados do sistema de agendamento.

CLÁUSULA 4 - DAS EXCEÇÕES
Não são consideradas confidenciais as informações que já sejam de domínio público ou que tenham sido obtidas legalmente por outras fontes.

CLÁUSULA 5 - DA PENALIDADE
A quebra de confidencialidade sujeitará o infrator ao pagamento de multa de [Valor] reais, além de perdas e danos apurados judicialmente.

CLÁUSULA 6 - DO FORO
Fica eleito o foro da comarca de [Cidade/Estado] para dirimir quaisquer dúvidas decorrentes deste acordo.`

const errors = [
  {
    title: 'Falta de Contrato Escrito',
    summary: 'Não formalizar a parceria por escrito.',
    description:
      'A ausência de contrato escrito e homologado pelo sindicato invalida a relação de parceria, configurando imediatamente vínculo empregatício, gerando passivos trabalhistas imensos como férias, 13º, FGTS e multas.',
  },
  {
    title: 'Responsabilidade por Insumos',
    summary: 'Não definir quem paga os produtos.',
    description:
      'Deixar de especificar em contrato de quem é a responsabilidade pela compra e fornecimento dos insumos e materiais utilizados nos serviços. O salão pode acabar pagando por produtos que o desperdiça, ou o profissional pode cobrar reembolso indevido.',
  },
  {
    title: 'Ausência de Cláusula de Confidencialidade',
    summary: 'Não proteger dados de clientes.',
    description:
      'Permitir que o profissional tenha acesso livre ao banco de dados de clientes sem um termo de sigilo, facilitando a concorrência desleal caso ele saia e leve a clientela consigo.',
  },
]

export default function LegalKit() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const [checklistCompleto, setChecklistCompleto] = useState(false)
  const [ndaBaixado, setNdaBaixado] = useState(false)

  useEffect(() => {
    trackAccess('juridico')
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      let p = await getProgress()
      if (!p) {
        p = await updateProgress({
          checklist_completo: false,
          nda_baixado: false,
          checklist_state: {},
        })
      }
      if (p) {
        setCheckedItems(p.checklist_state || {})
        setChecklistCompleto(!!p.checklist_completo)
        setNdaBaixado(!!p.nda_baixado)
      }
      setLoading(false)
    } catch (err) {
      setError(true)
      setLoading(false)
    }
  }

  const toggleCheck = async (index: number) => {
    const newState = { ...checkedItems, [index]: !checkedItems[index] }
    setCheckedItems(newState)
    await updateProgress({ checklist_state: newState })
  }

  const toggleCompleteAll = async () => {
    const newValue = !checklistCompleto
    setChecklistCompleto(newValue)

    const newState = {} as Record<number, boolean>
    if (newValue) {
      checklistItems.forEach((_, i) => {
        newState[i] = true
      })
    }
    setCheckedItems(newState)

    await updateProgress({ checklist_completo: newValue, checklist_state: newState })
    toast({
      title: newValue ? 'Checklist completo!' : 'Checklist desmarcado',
      description: newValue
        ? 'Todas as cláusulas foram marcadas como verificadas.'
        : 'As cláusulas foram desmarcadas.',
    })
  }

  const handleDownloadNda = async () => {
    window.print()
    setNdaBaixado(true)
    await updateProgress({ nda_baixado: true })
    toast({
      title: 'Download iniciado',
      description: 'O PDF está sendo gerado para impressão/download.',
    })
  }

  const handleShare = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text })
      } catch (err) {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(`${title}\n\n${text}`)
      toast({
        title: 'Copiado!',
        description: 'Texto copiado para a área de transferência.',
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="size-12 text-destructive" />
        <h2 className="text-xl font-semibold">Erro ao carregar. Tente novamente</h2>
        <Button onClick={loadData}>Tentar Novamente</Button>
      </div>
    )
  }

  return (
    <>
      <div className="hidden print:block p-8 font-sans text-black whitespace-pre-wrap">
        {ndaText}
      </div>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up p-4 print:hidden">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Kit de Sobrevivência Jurídica
          </h1>
          <p className="text-muted-foreground">
            Proteja seu negócio de passivos trabalhistas com os fundamentos corretos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Checklist and Errors) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Checklist */}
            <Card className="border-blue-500/20 bg-blue-500/5 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="size-5" />
                  <CardTitle>
                    Checklist: Cláusulas Obrigatórias no Contrato de Salão Parceiro
                  </CardTitle>
                </div>
                <CardDescription>
                  Verifique se o seu contrato contempla todos os itens exigidos pela Lei
                  13.352/2016.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklistItems.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center space-x-3 rounded-md border p-3 transition-colors',
                      checkedItems[index]
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-border bg-background',
                    )}
                  >
                    <Checkbox
                      id={`check-${index}`}
                      checked={!!checkedItems[index]}
                      onCheckedChange={() => toggleCheck(index)}
                    />
                    <label
                      htmlFor={`check-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none flex-1"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant={checklistCompleto ? 'secondary' : 'default'}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={toggleCompleteAll}
                >
                  {checklistCompleto ? 'Desmarcar Todos' : 'Marcar como completo'}
                </Button>
              </CardFooter>
            </Card>

            {/* Common Errors */}
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="size-6" />3 Erros Jurídicos que Levam a Processos
                Trabalhistas
              </h3>
              <div className="grid gap-4 sm:grid-cols-1">
                {errors.map((error, idx) => (
                  <Card key={idx} className="border-red-500/20 bg-red-500/5">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`error-${idx}`} className="border-b-0">
                        <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-red-500/10 rounded-t-lg transition-colors">
                          <div className="flex flex-col items-start text-left gap-1">
                            <span className="font-semibold text-red-700 dark:text-red-400">
                              {error.title}
                            </span>
                            <span className="text-sm text-muted-foreground font-normal">
                              {error.summary}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <p className="text-sm leading-relaxed mb-4">{error.description}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleShare(error.title, error.description)}
                          >
                            <Share2 className="size-4 mr-2" />
                            Compartilhar
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (NDA) */}
          <div className="space-y-6">
            <Card className="border-green-500/20 bg-green-500/5 shadow-sm sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Scale className="size-5" />
                  <CardTitle>Modelo de NDA - Acordo de Confidencialidade</CardTitle>
                </div>
                <CardDescription>
                  Acordo de Confidencialidade para proteger sua base de clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="nda" className="border-border">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      Ver texto do contrato
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="mt-4 p-4 bg-background border rounded-md text-xs font-mono whitespace-pre-wrap text-muted-foreground max-h-[400px] overflow-y-auto">
                        {ndaText}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  onClick={handleDownloadNda}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileDown className="size-4 mr-2" />
                  Baixar PDF / Imprimir
                </Button>
                {ndaBaixado && (
                  <p className="text-xs text-green-600 text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="size-3" />
                    Documento baixado
                  </p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
