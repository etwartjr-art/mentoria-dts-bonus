import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'
import { trackAccess } from '@/services/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calculator as CalcIcon, DollarSign, Clock, LayoutGrid } from 'lucide-react'

export default function Calculator() {
  useEffect(() => {
    trackAccess('calculadora')
  }, [])

  return (
    <div
      className="max-w-4xl mx-auto space-y-8 animate-slide-up opacity-0"
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Calculadora de Lucro Real
        </h1>
        <p className="text-muted-foreground">
          Domine seus números para garantir o verdadeiro High-Ticket.
        </p>
      </div>

      {/* Formula Display */}
      <Card className="border-primary/30 bg-primary/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CalcIcon className="size-24" />
        </div>
        <CardHeader>
          <CardTitle className="text-primary font-heading text-2xl">A Fórmula de Ouro</CardTitle>
          <CardDescription>O cálculo definitivo do seu Lucro Líquido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-background/80 p-6 border border-primary/20 backdrop-blur-sm">
            <p className="text-center font-mono text-lg md:text-xl font-medium tracking-tight break-words">
              Lucro Líquido = <span className="text-emerald-500">Preço Venda</span> - (
              <span className="text-destructive/80">Insumos</span> +{' '}
              <span className="text-destructive/80">Impostos</span> +{' '}
              <span className="text-destructive/80">Comissão</span> +{' '}
              <span className="text-amber-500">Custo Op./Minuto</span>)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cost Per Minute Explainer */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-amber-500" />
            <CardTitle>Entendendo o Custo por Minuto</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Muitos profissionais esquecem de contabilizar o tempo que a cadeira fica ocupada. O
            custo por minuto é a métrica mais importante para salões e clínicas.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/50 bg-background/50 p-4 space-y-2">
              <h4 className="font-medium text-sm text-foreground/80 flex items-center gap-2">
                <DollarSign className="size-4 text-destructive/70" />
                Passo 1: Custos Fixos
              </h4>
              <p className="text-xs text-muted-foreground">
                Some todos os custos que você tem independente de vender ou não: Aluguel, Luz,
                Internet, Recepção, Limpeza.
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/50 p-4 space-y-2">
              <h4 className="font-medium text-sm text-foreground/80 flex items-center gap-2">
                <Clock className="size-4 text-primary/70" />
                Passo 2: Capacidade (Minutos)
              </h4>
              <p className="text-xs text-muted-foreground">
                Multiplique: Dias abertos no mês × Horas por dia × 60 minutos × Número de cadeiras
                ativas.
              </p>
            </div>
          </div>

          <div className="rounded-md bg-secondary/30 p-4 text-center border border-border/50">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Resultado:
            </span>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              Custo por Minuto = Custos Fixos / Total de Minutos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Table Structure Guide */}
      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-blue-500" />
            <CardTitle>Guia de Estruturação (Planilha)</CardTitle>
          </div>
          <CardDescription>
            Copie esta estrutura exata para o seu Excel ou Google Sheets.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="w-[150px]">Coluna</TableHead>
                  <TableHead>O que preencher</TableHead>
                  <TableHead>Exemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-primary">A: Serviço</TableCell>
                  <TableCell className="text-muted-foreground">Nome do procedimento</TableCell>
                  <TableCell>Mechas Premium</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-emerald-500">B: Preço Venda</TableCell>
                  <TableCell className="text-muted-foreground">Valor pago pelo cliente</TableCell>
                  <TableCell>R$ 850,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-destructive/80">C: Insumos</TableCell>
                  <TableCell className="text-muted-foreground">Custo de produtos usados</TableCell>
                  <TableCell>R$ 120,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-destructive/80">D: Impostos %</TableCell>
                  <TableCell className="text-muted-foreground">Taxa do Simples/Cartão</TableCell>
                  <TableCell>6% (R$ 51,00)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-destructive/80">E: Comissão %</TableCell>
                  <TableCell className="text-muted-foreground">Repasse ao profissional</TableCell>
                  <TableCell>30% (R$ 255,00)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-amber-500">F: Tempo (min)</TableCell>
                  <TableCell className="text-muted-foreground">Duração na cadeira</TableCell>
                  <TableCell>240 min</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-amber-500">G: Custo/Minuto</TableCell>
                  <TableCell className="text-muted-foreground">Cálculo fixo (F × Custo)</TableCell>
                  <TableCell>R$ 0,50 × 240 = R$ 120</TableCell>
                </TableRow>
                <TableRow className="bg-primary/5">
                  <TableCell className="font-bold text-emerald-500">H: Lucro Líquido</TableCell>
                  <TableCell className="text-muted-foreground font-medium">B - (C+D+E+G)</TableCell>
                  <TableCell className="font-bold">R$ 304,00 (35.7%)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
