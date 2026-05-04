import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, Save, Download, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import {
  getHistoryCalculadora,
  createDadosCalculadora,
  DadosCalculadora,
} from '@/services/dados_calculadora'
import { trackAccess } from '@/services/progress'

const iframeContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #fff; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; color: #333; }
    th, td { border: 1px solid #e2e3e3; padding: 8px 12px; text-align: left; }
    th { background: #f8f9fa; color: #5f6368; font-weight: 600; text-align: center; }
    .row-header { background: #f8f9fa; color: #5f6368; text-align: center; width: 30px; font-weight: normal; }
    .header-row th { border-bottom: 2px solid #dadce0; }
    tr:hover td { background-color: #f1f3f4; }
  </style>
</head>
<body>
  <table>
    <tr class="header-row">
      <th class="row-header"></th>
      <th>A<br>Serviço</th>
      <th>B<br>Preço</th>
      <th>C<br>Insumos</th>
      <th>D<br>Impostos</th>
      <th>E<br>Comissão</th>
      <th>F<br>Duração (min)</th>
      <th>G<br>Custo Op./Min</th>
      <th>H<br>Lucro Líquido</th>
      <th>I<br>Margem (%)</th>
    </tr>
    <tr>
      <td class="row-header">1</td>
      <td>Escova</td><td>R$ 150,00</td><td>R$ 20,00</td><td>R$ 22,50</td><td>R$ 75,00</td><td>60 min.</td><td>R$ 0,50</td><td>R$ 2,50</td><td>1,67%</td>
    </tr>
    <tr>
      <td class="row-header">2</td>
      <td>Hidratação</td><td>R$ 120,00</td><td>R$ 15,00</td><td>R$ 18,00</td><td>R$ 60,00</td><td>45 min.</td><td>R$ 0,50</td><td>R$ 4,50</td><td>3,75%</td>
    </tr>
    <tr>
      <td class="row-header">3</td>
      <td>Corte</td><td>R$ 80,00</td><td>R$ 5,00</td><td>R$ 12,00</td><td>R$ 40,00</td><td>30 min.</td><td>R$ 0,50</td><td>R$ 8,00</td><td>10,00%</td>
    </tr>
  </table>
</body>
</html>
`

export default function Calculator() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState<DadosCalculadora[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [localForm, setLocalForm] = useState({
    servico: '',
    preco_venda: '',
    custo_insumos: '',
    impostos: '',
    comissao: '',
    tempo: '',
    custo_fixo_mensal: '',
    minutos_disponiveis: '',
  })

  const [form, setForm] = useState(localForm)

  useEffect(() => {
    const timer = setTimeout(() => {
      setForm(localForm)
    }, 300)
    return () => clearTimeout(timer)
  }, [localForm])

  const loadHistory = useCallback(async () => {
    if (!user) return
    try {
      setIsLoadingHistory(true)
      const data = await getHistoryCalculadora(user.id)
      setHistory(data)
    } catch (err) {
      toast.error('Erro ao carregar histórico')
    } finally {
      setIsLoadingHistory(false)
    }
  }, [user])

  useEffect(() => {
    try {
      trackAccess('calculadora')
    } catch {
      /* intentionally ignored */
    }
    loadHistory()
  }, [loadHistory])

  const pVenda = Number(form.preco_venda) || 0
  const cInsumos = Number(form.custo_insumos) || 0
  const impostos = Number(form.impostos) || 0
  const comissao = Number(form.comissao) || 0
  const tempo = Number(form.tempo) || 0
  const cFixo = Number(form.custo_fixo_mensal) || 0
  const minDisp = Number(form.minutos_disponiveis) || 0

  const custoPorMinuto = minDisp > 0 ? cFixo / minDisp : 0
  const custoOperacional = tempo * custoPorMinuto
  const comissaoRS = pVenda * (comissao / 100)

  const lucroLiquido = pVenda - (cInsumos + impostos + comissaoRS + custoOperacional)
  const margemLucro = pVenda > 0 ? (lucroLiquido / pVenda) * 100 : 0

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handleSave = async () => {
    if (
      !localForm.servico ||
      !localForm.preco_venda ||
      !localForm.custo_insumos ||
      !localForm.impostos ||
      !localForm.comissao ||
      !localForm.tempo ||
      !localForm.custo_fixo_mensal ||
      !localForm.minutos_disponiveis
    ) {
      return toast.error('Preencha todos os campos')
    }
    const values = [pVenda, cInsumos, impostos, comissao, tempo, cFixo, minDisp]
    if (values.some((v) => v < 0)) return toast.error('Valores devem ser positivos')
    if (tempo <= 0) return toast.error('Duração deve ser maior que 0')

    setIsSaving(true)
    try {
      await createDadosCalculadora({
        servico: localForm.servico,
        preco_venda: pVenda,
        custo_insumos: cInsumos,
        impostos,
        comissao,
        tempo,
        custo_fixo_mensal: cFixo,
        minutos_disponiveis: minDisp,
        custo_operacional_minuto: custoPorMinuto,
        lucro_liquido: lucroLiquido,
        margem_lucro: margemLucro,
        user: user!.id,
      })
      toast.success('Cálculo salvo com sucesso!')
      loadHistory()
    } catch (e) {
      toast.error('Erro ao salvar cálculo')
    } finally {
      setIsSaving(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Serviço',
      'Preço de Venda (R$)',
      'Insumos (R$)',
      'Impostos (R$)',
      'Comissão (%)',
      'Duração (min)',
      'Custo Fixo Mensal (R$)',
      'Minutos Disponíveis',
      'Lucro Líquido (R$)',
      'Margem (%)',
    ]
    const rows = history.map((item) =>
      [
        `"${item.servico}"`,
        item.preco_venda,
        item.custo_insumos,
        item.impostos,
        item.comissao,
        item.tempo,
        item.custo_fixo_mensal || 0,
        item.minutos_disponiveis || 0,
        item.lucro_liquido,
        item.margem_lucro || 0,
      ].join(','),
    )
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'calculadora_historico.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="w-fit -ml-4"
          aria-label="Voltar para Dashboard"
        >
          <ArrowLeft className="size-5 mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold text-primary">Calculadora de Lucro Real</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-semibold text-foreground">
                Dados do Serviço
              </CardTitle>
              <CardDescription className="text-base font-normal text-foreground">
                A fórmula calcula o lucro líquido por serviço:
                <br />
                <span className="font-mono text-sm mt-2 block bg-muted p-2 rounded">
                  Lucro Líquido = Preço de Venda - (Custo Insumos + Impostos + Comissão + Custo
                  Operacional por Minuto)
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="servico">Nome do Serviço</Label>
                  <Input
                    id="servico"
                    value={localForm.servico}
                    onChange={(e) => setLocalForm({ ...localForm, servico: e.target.value })}
                    placeholder="Ex: Escova Progressiva"
                    aria-label="Nome do Serviço"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço de Venda (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    value={localForm.preco_venda}
                    onChange={(e) => setLocalForm({ ...localForm, preco_venda: e.target.value })}
                    placeholder="ex: 150"
                    aria-label="Preço de Venda"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    Quanto você cobra pelo serviço
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insumos">Custo de Insumos (R$)</Label>
                  <Input
                    id="insumos"
                    type="number"
                    value={localForm.custo_insumos}
                    onChange={(e) => setLocalForm({ ...localForm, custo_insumos: e.target.value })}
                    placeholder="ex: 20"
                    aria-label="Custo de Insumos"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    Produtos usados no serviço
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impostos" className="flex items-center gap-2">
                    Impostos (R$)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex"
                          aria-label="Informação sobre impostos"
                        >
                          <Info className="size-5 text-muted-foreground cursor-help" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Consulte seu contador para valor exato</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="impostos"
                    type="number"
                    value={localForm.impostos}
                    onChange={(e) => setLocalForm({ ...localForm, impostos: e.target.value })}
                    placeholder="ex: 22.5"
                    aria-label="Impostos"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    ISS, PIS, COFINS (~15%)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comissao">Comissão (%)</Label>
                  <Input
                    id="comissao"
                    type="number"
                    value={localForm.comissao}
                    onChange={(e) => setLocalForm({ ...localForm, comissao: e.target.value })}
                    placeholder="ex: 50"
                    aria-label="Comissão"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    Percentual pago ao profissional
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempo">Duração do Serviço (min)</Label>
                  <Input
                    id="tempo"
                    type="number"
                    value={localForm.tempo}
                    onChange={(e) => setLocalForm({ ...localForm, tempo: e.target.value })}
                    placeholder="ex: 60"
                    aria-label="Duração do Serviço"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    Quantos minutos leva o serviço
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custofixo">Custo Fixo Mensal (R$)</Label>
                  <Input
                    id="custofixo"
                    type="number"
                    value={localForm.custo_fixo_mensal}
                    onChange={(e) =>
                      setLocalForm({ ...localForm, custo_fixo_mensal: e.target.value })
                    }
                    placeholder="ex: 5000"
                    aria-label="Custo Fixo Mensal"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    Aluguel, água, luz, etc.
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="minutos">Minutos Disponíveis no Mês</Label>
                  <Input
                    id="minutos"
                    type="number"
                    value={localForm.minutos_disponiveis}
                    onChange={(e) =>
                      setLocalForm({ ...localForm, minutos_disponiveis: e.target.value })
                    }
                    placeholder="ex: 10560"
                    aria-label="Minutos Disponíveis"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    Calculadora: 8 horas x 22 dias úteis x 60 minutos = 10.560
                  </p>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-6 border border-border mt-4">
                <p className="text-base font-semibold mb-2 text-foreground">
                  Cálculo do Custo por Minuto
                </p>
                <p className="text-sm font-normal text-muted-foreground font-mono">
                  Custo por Minuto = Custo Fixo Mensal ÷ Minutos Disponíveis
                </p>
                <div className="mt-2 text-primary font-bold text-lg">
                  {formatCurrency(cFixo)} ÷ {minDisp || 1} = {formatCurrency(custoPorMinuto)} por
                  minuto
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-4">
                <h3 className="text-[20px] lg:text-[24px] font-bold text-primary">
                  Resultado Final
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Lucro Líquido por Serviço
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(lucroLiquido)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
                    <p
                      className={`text-2xl font-bold ${margemLucro < 20 ? 'text-destructive' : 'text-success'}`}
                    >
                      {margemLucro.toFixed(2).replace('.', ',')}%
                    </p>
                  </div>
                </div>
                {margemLucro < 20 && pVenda > 0 && (
                  <div className="bg-destructive/10 text-destructive text-sm font-medium p-4 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="size-5 shrink-0" /> Se lucro &lt; 20%, revise preço ou
                    custos
                  </div>
                )}
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <Loader2 className="size-5 mr-2 animate-spin" />
                ) : (
                  <Save className="size-5 mr-2" />
                )}{' '}
                Salvar Cálculo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden h-[400px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                Comparativo na Planilha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-70px)]">
              <iframe
                srcDoc={iframeContent}
                className="w-full h-full border-0"
                title="Google Sheets Mock"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                Últimos Cálculos
              </CardTitle>
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={history.length === 0}
                aria-label="Exportar para Excel"
                className="w-full sm:w-auto"
              >
                <Download className="size-5 mr-2" />{' '}
                <span className="hidden sm:inline">Exportar para Excel</span>
                <span className="sm:hidden">Exportar</span>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <Skeleton className="h-32 w-full" />
              ) : history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum cálculo salvo ainda.
                </p>
              ) : (
                <>
                  <div className="hidden sm:block border rounded-md overflow-auto">
                    <Table>
                      <TableHeader className="bg-secondary/50">
                        <TableRow>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Lucro</TableHead>
                          <TableHead>Margem</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium truncate max-w-[100px]">
                              {item.servico}
                            </TableCell>
                            <TableCell>{formatCurrency(item.preco_venda)}</TableCell>
                            <TableCell>{formatCurrency(item.lucro_liquido)}</TableCell>
                            <TableCell>{item.margem_lucro?.toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="sm:hidden space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-card border rounded-lg p-4 space-y-2 shadow-sm"
                      >
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-bold text-[16px] truncate max-w-[150px] text-primary">
                            {item.servico}
                          </span>
                          <span className="text-[14px] font-medium bg-secondary/10 text-secondary px-2 py-1 rounded">
                            {item.margem_lucro?.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[14px] text-muted-foreground">Preço:</span>
                          <span className="text-[14px] font-medium">
                            {formatCurrency(item.preco_venda)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[14px] text-muted-foreground">Lucro:</span>
                          <span className="text-[14px] font-medium text-success">
                            {formatCurrency(item.lucro_liquido)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
