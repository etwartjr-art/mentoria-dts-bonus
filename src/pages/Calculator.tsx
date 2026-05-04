import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, Printer } from 'lucide-react'
import { trackAccess } from '@/services/progress'

type ServiceData = {
  id: string
  servico: string
  preco: number
  insumos: number
  impostos: number
  comissao: number
  tempo: number
  custoMinuto: number
}

const initialData: ServiceData[] = [
  {
    id: '1',
    servico: 'Escova Progressiva',
    preco: 150,
    insumos: 25,
    impostos: 15,
    comissao: 10,
    tempo: 60,
    custoMinuto: 0.25,
  },
  {
    id: '2',
    servico: 'Hidratação',
    preco: 120,
    insumos: 18,
    impostos: 15,
    comissao: 10,
    tempo: 45,
    custoMinuto: 0.25,
  },
  {
    id: '3',
    servico: 'Coloração',
    preco: 200,
    insumos: 40,
    impostos: 15,
    comissao: 10,
    tempo: 90,
    custoMinuto: 0.25,
  },
]

export default function Calculator() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'empty'>('loading')
  const [data, setData] = useState<ServiceData[]>([])

  useEffect(() => {
    try {
      trackAccess('calculadora')
    } catch {
      // intentionally ignored
    }

    // Simulate loading the spreadsheet embed
    const timer = setTimeout(() => {
      setData(initialData)
      setStatus('success')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const calculateProfit = (row: ServiceData) => {
    const B = row.preco
    const C = row.insumos
    const D = row.impostos / 100
    const E = row.comissao / 100
    const F = row.tempo
    const G = row.custoMinuto
    return B - (C + B * D + B * E + F * G)
  }

  const updateRow = (index: number, field: keyof ServiceData, value: string | number) => {
    const newData = [...data]
    setData(newData.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  return (
    <div
      className="max-w-6xl mx-auto space-y-8 animate-slide-up opacity-0"
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

      {/* Section 1: Profit Formula Explanation */}
      <Card className="border-primary/30 bg-primary/5 shadow-lg relative overflow-hidden">
        <CardHeader>
          <CardTitle className="text-primary font-heading text-2xl">
            Como Calcular Seu Lucro Real por Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-background/80 p-6 border border-primary/20 backdrop-blur-sm">
            <p className="text-center font-mono text-lg md:text-xl font-medium tracking-tight break-words">
              Lucro Líquido = Preço de Venda - (Custo Insumos + Impostos + Comissão + Custo
              Operacional por Minuto)
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-lg p-5 space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground text-base">
              Exemplo prático: Escova progressiva
            </p>
            <ul className="space-y-2">
              <li>
                <strong className="text-foreground">Preço de Venda:</strong> R$ 150,00
              </li>
              <li>
                <strong className="text-foreground">Custo Insumos:</strong> R$ 25,00
              </li>
              <li>
                <strong className="text-foreground">Impostos (15%):</strong> R$ 22,50
              </li>
              <li>
                <strong className="text-foreground">Comissão (10%):</strong> R$ 15,00
              </li>
              <li>
                <strong className="text-foreground">
                  Custo Operacional por Minuto (60 min x R$ 0,50):
                </strong>{' '}
                R$ 30,00
              </li>
            </ul>
            <div className="pt-3 border-t border-border/50 mt-4">
              <p className="font-bold text-foreground text-base">
                Resultado Final: 150 - (25 + 22,50 + 15 + 30) ={' '}
                <span className="text-emerald-500">R$ 57,50</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Custo por Minuto */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Calculando Seu Custo Operacional por Minuto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md bg-secondary/30 p-6 text-center border border-border/50">
            <p className="font-mono text-lg md:text-xl text-primary font-semibold tracking-tight">
              Custo Fixo Total / Minutos Disponíveis no Mês
            </p>
          </div>

          <div className="text-sm text-muted-foreground bg-background/50 border border-border/50 p-5 rounded-lg space-y-2">
            <p className="font-medium text-foreground text-base">Exemplo:</p>
            <p className="text-base">
              Custos fixos de R$ 30.000 / 120.000 minutos disponíveis ={' '}
              <strong className="text-foreground">R$ 0,25 por minuto</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Google Sheets Integration */}
      <Card className="border-border/50 bg-card/50 overflow-hidden print:shadow-none print:border-none print:bg-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Planilha de Precificação</CardTitle>
            <CardDescription>
              Edite os valores abaixo para calcular seu lucro líquido.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto print:hidden">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.open('https://docs.google.com/spreadsheets', '_blank')}
            >
              <ExternalLink className="size-4 mr-2" />
              Editar Planilha
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => window.print()}>
              <Printer className="size-4 mr-2" />
              Baixar Relatório
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {status === 'loading' && (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {status === 'error' && (
            <div className="p-16 text-center">
              <p className="text-destructive font-medium text-lg">
                Erro ao carregar planilha. Tente novamente
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setStatus('loading')}>
                Tentar Novamente
              </Button>
            </div>
          )}

          {(status === 'empty' || (status === 'success' && data.length === 0)) && (
            <div className="p-16 text-center text-muted-foreground">
              <p className="text-lg font-medium">Nenhum serviço cadastrado</p>
              {status === 'empty' && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setData(initialData)
                    setStatus('success')
                  }}
                >
                  Recarregar Tabela
                </Button>
              )}
            </div>
          )}

          {status === 'success' && data.length > 0 && (
            <div className="overflow-x-auto p-1 pb-6">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">A: Serviço</TableHead>
                    <TableHead className="whitespace-nowrap">B: Preço de Venda (R$)</TableHead>
                    <TableHead className="whitespace-nowrap">C: Custo Insumos (R$)</TableHead>
                    <TableHead className="whitespace-nowrap">D: Impostos (%)</TableHead>
                    <TableHead className="whitespace-nowrap">E: Comissão (%)</TableHead>
                    <TableHead className="whitespace-nowrap">F: Tempo (minutos)</TableHead>
                    <TableHead className="whitespace-nowrap">
                      G: Custo Operacional por Minuto (R$)
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right pr-6">
                      H: Lucro Líquido (R$)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => {
                    const profit = calculateProfit(row)
                    const isLoss = profit < 0
                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Input
                            value={row.servico}
                            onChange={(e) => updateRow(index, 'servico', e.target.value)}
                            className="min-w-[160px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.preco === 0 ? '' : row.preco}
                            onChange={(e) => updateRow(index, 'preco', Number(e.target.value))}
                            className="min-w-[100px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.insumos === 0 ? '' : row.insumos}
                            onChange={(e) => updateRow(index, 'insumos', Number(e.target.value))}
                            className="min-w-[100px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.impostos === 0 ? '' : row.impostos}
                            onChange={(e) => updateRow(index, 'impostos', Number(e.target.value))}
                            className="min-w-[100px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.comissao === 0 ? '' : row.comissao}
                            onChange={(e) => updateRow(index, 'comissao', Number(e.target.value))}
                            className="min-w-[100px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.tempo === 0 ? '' : row.tempo}
                            onChange={(e) => updateRow(index, 'tempo', Number(e.target.value))}
                            className="min-w-[100px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={row.custoMinuto === 0 ? '' : row.custoMinuto}
                            onChange={(e) =>
                              updateRow(index, 'custoMinuto', Number(e.target.value))
                            }
                            className="min-w-[120px] h-9"
                          />
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div
                            className={`font-bold px-3 py-2 rounded-md whitespace-nowrap inline-block border ${isLoss ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}
                          >
                            R$ {profit.toFixed(2).replace('.', ',')}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
