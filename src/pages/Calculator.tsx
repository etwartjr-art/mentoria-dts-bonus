import { useState, useEffect, useCallback } from 'react'
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
import { ExternalLink, Printer, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { trackAccess } from '@/services/progress'
import { useAuth } from '@/hooks/use-auth'
import {
  getDadosCalculadora,
  createDadosCalculadora,
  updateDadosCalculadora,
  deleteDadosCalculadora,
  DadosCalculadora,
} from '@/services/dados_calculadora'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'

type ServiceData = {
  id: string
  servico: string
  preco_venda: number
  custo_insumos: number
  impostos: number
  comissao: number
  tempo: number
  custo_operacional_minuto: number
  lucro_liquido?: number
  isNew?: boolean
}

const initialData: Omit<ServiceData, 'id'>[] = [
  {
    servico: 'Escova Progressiva',
    preco_venda: 150,
    custo_insumos: 25,
    impostos: 15,
    comissao: 10,
    tempo: 60,
    custo_operacional_minuto: 0.25,
  },
  {
    servico: 'Hidratação',
    preco_venda: 120,
    custo_insumos: 18,
    impostos: 15,
    comissao: 10,
    tempo: 45,
    custo_operacional_minuto: 0.25,
  },
  {
    servico: 'Coloração',
    preco_venda: 200,
    custo_insumos: 40,
    impostos: 15,
    comissao: 10,
    tempo: 90,
    custo_operacional_minuto: 0.25,
  },
]

export default function Calculator() {
  const { user } = useAuth()
  const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'empty'>('loading')
  const [data, setData] = useState<ServiceData[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      setStatus('loading')
      const records = await getDadosCalculadora(user.id)

      if (records.length === 0) {
        // Seed default rows for the new user
        const seededData = await Promise.all(
          initialData.map((item) =>
            createDadosCalculadora({
              ...item,
              lucro_liquido:
                item.preco_venda -
                (item.custo_insumos +
                  item.preco_venda * (item.impostos / 100) +
                  item.preco_venda * (item.comissao / 100) +
                  item.tempo * item.custo_operacional_minuto),
              user: user.id,
            }),
          ),
        )
        setData(seededData.map((d) => ({ ...d })))
      } else {
        setData(records.map((r) => ({ ...r })))
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }, [user])

  useEffect(() => {
    try {
      trackAccess('calculadora')
    } catch {
      // intentionally ignored
    }
    loadData()
  }, [loadData])

  const calculateProfit = (row: ServiceData) => {
    const B = row.preco_venda || 0
    const C = row.custo_insumos || 0
    const D = (row.impostos || 0) / 100
    const E = (row.comissao || 0) / 100
    const F = row.tempo || 0
    const G = row.custo_operacional_minuto || 0
    return B - (C + B * D + B * E + F * G)
  }

  const updateRow = (index: number, field: keyof ServiceData, value: string | number) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    setData(newData)
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      for (const row of data) {
        const lucro = calculateProfit(row)
        const rowData = {
          servico: row.servico,
          preco_venda: row.preco_venda,
          custo_insumos: row.custo_insumos,
          impostos: row.impostos,
          comissao: row.comissao,
          tempo: row.tempo,
          custo_operacional_minuto: row.custo_operacional_minuto,
          lucro_liquido: lucro,
          user: user.id,
        }

        if (row.isNew) {
          await createDadosCalculadora(rowData)
        } else {
          await updateDadosCalculadora(row.id, rowData)
        }
      }
      toast.success('Alterações salvas com sucesso!')
      await loadData()
    } catch (error) {
      toast.error('Erro ao salvar as alterações.')
    } finally {
      setIsSaving(false)
    }
  }

  const addNewRow = () => {
    setData([
      ...data,
      {
        id: `temp-${Date.now()}`,
        servico: 'Novo Serviço',
        preco_venda: 0,
        custo_insumos: 0,
        impostos: 0,
        comissao: 0,
        tempo: 0,
        custo_operacional_minuto: 0,
        isNew: true,
      },
    ])
  }

  const deleteRow = async (id: string) => {
    if (id.startsWith('temp-')) {
      setData(data.filter((r) => r.id !== id))
      return
    }

    try {
      await deleteDadosCalculadora(id)
      setData(data.filter((r) => r.id !== id))
      toast.success('Serviço removido.')
    } catch (err) {
      toast.error('Erro ao remover o serviço.')
    }
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
            <Button variant="outline" className="w-full sm:w-auto" onClick={addNewRow}>
              <Plus className="size-4 mr-2" />
              Novo Serviço
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Salvar Alterações
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
                <Button variant="outline" className="mt-4" onClick={loadData}>
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
                    <TableHead className="whitespace-nowrap text-right">
                      H: Lucro Líquido (R$)
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
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
                            value={row.preco_venda === 0 ? '' : row.preco_venda}
                            onChange={(e) =>
                              updateRow(index, 'preco_venda', Number(e.target.value))
                            }
                            className="min-w-[100px] h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.custo_insumos === 0 ? '' : row.custo_insumos}
                            onChange={(e) =>
                              updateRow(index, 'custo_insumos', Number(e.target.value))
                            }
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
                            value={
                              row.custo_operacional_minuto === 0 ? '' : row.custo_operacional_minuto
                            }
                            onChange={(e) =>
                              updateRow(index, 'custo_operacional_minuto', Number(e.target.value))
                            }
                            className="min-w-[120px] h-9"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`font-bold px-3 py-2 rounded-md whitespace-nowrap inline-block border ${isLoss ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}
                          >
                            R$ {profit.toFixed(2).replace('.', ',')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRow(row.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
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
