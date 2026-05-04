import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trackAccess, getProgress, updateProgress } from '@/services/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ShieldAlert, Copy, CheckCircle2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const checklist = [
  'Qualificação das partes como Salão-Parceiro e Profissional-Parceiro.',
  'Percentual de retenção de valores pelo salão (aluguel/serviços).',
  'Responsabilidade pelo recolhimento de tributos e encargos previdenciários.',
  'Direito do profissional de utilizar sua própria infraestrutura/ferramentas.',
  'Cláusula de rescisão com aviso prévio mínimo de 30 dias.',
]

const errors = [
  'Exigir subordinação e horários fixos (gera vínculo empregatício).',
  'Não possuir contrato assinado e homologado no sindicato.',
  'Pagamento total do serviço diretamente ao profissional sem nota fiscal do salão.',
]

const ndaText = `ACORDO DE CONFIDENCIALIDADE (NDA)

Este acordo visa proteger a lista de clientes, segredos comerciais e processos internos do salão. 

O profissional compromete-se a manter sob absoluto sigilo todas e quaisquer informações confidenciais a que tiver acesso durante a parceria, não podendo utilizá-las para fins próprios fora do estabelecimento sob pena de multa estipulada em contrato e sanções legais cabíveis. Fica proibida a captação direta de clientes do salão para atendimento particular.`

export default function LegalKit() {
  const { toast } = useToast()
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})

  useEffect(() => {
    trackAccess('juridico')
    getProgress().then((p) => {
      if (p) {
        if (p.checklist_completo) {
          const all = checklist.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
          setCheckedItems(all)
        }
      }
    })
  }, [])

  const toggleCheck = (index: number) => {
    const newItems = { ...checkedItems, [index]: !checkedItems[index] }
    setCheckedItems(newItems)
    const isAllChecked = checklist.every((_, i) => newItems[i])
    updateProgress({ checklist_completo: isAllChecked })
  }

  const copyNDA = () => {
    navigator.clipboard.writeText(ndaText)
    toast({
      title: 'Copiado com sucesso!',
      description: 'O texto do NDA foi copiado para a área de transferência.',
    })
    updateProgress({ nda_baixado: true })
  }

  return (
    <div
      className="max-w-4xl mx-auto space-y-8 animate-slide-up opacity-0"
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Kit de Sobrevivência Jurídica
        </h1>
        <p className="text-muted-foreground">
          Proteja seu negócio de passivos trabalhistas com os fundamentos corretos.
        </p>
      </div>

      {/* Checklist */}
      <Card className="border-primary/20 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <CardTitle>Checklist Cláusulas Indispensáveis</CardTitle>
          </div>
          <CardDescription>
            Segundo a Lei 13.352/2016 (Lei do Salão Parceiro), seu contrato deve conter no mínimo:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checklist.map((item, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start space-x-3 rounded-lg border p-4 transition-colors',
                checkedItems[index]
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border/50 bg-background/50',
              )}
            >
              <Checkbox
                id={`check-${index}`}
                checked={!!checkedItems[index]}
                onCheckedChange={() => toggleCheck(index)}
                className="mt-1"
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor={`check-${index}`}
                  className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                >
                  {item}
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NDA Section */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Modelo de NDA (Confidencialidade)</CardTitle>
            <CardDescription>Texto base para incluir em seus contratos.</CardDescription>
          </div>
          <Button onClick={copyNDA} variant="secondary" size="sm" className="h-8 gap-2">
            <Copy className="size-4" />
            Copiar Texto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-background/50 p-4 border border-border/50 text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {ndaText}
          </div>
        </CardContent>
      </Card>

      {/* Common Errors */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-semibold flex items-center gap-2 text-destructive">
          <ShieldAlert className="size-5" />3 Erros Fatais (Evite a todo custo)
        </h3>
        <div className="grid gap-4">
          {errors.map((error, idx) => (
            <Alert
              key={idx}
              variant="destructive"
              className="bg-destructive/10 border-destructive/20 text-destructive-foreground/90"
            >
              <ShieldAlert className="size-4" />
              <AlertTitle className="font-semibold tracking-wide">Erro #{idx + 1}</AlertTitle>
              <AlertDescription className="text-sm opacity-90">{error}</AlertDescription>
            </Alert>
          ))}
        </div>
      </div>
    </div>
  )
}
