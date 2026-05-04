import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'

const TABS = [
  {
    id: 'tab1',
    label: 'Vídeo 1',
    title: 'A Mentalidade da Recepcionista de Elite',
    description:
      'Assista e aprenda os 5 pilares que transformam uma recepção comum em uma máquina de vendas.',
    content: `1. Primeira Impressão:
A recepcionista é o primeiro e o último contato. O tom de voz e a postura definem o valor do serviço antes mesmo dele acontecer.

2. Oportunidade de Venda:
Enxergar além do agendamento. Identificar necessidades complementares e sugerir soluções proativamente.

3. Controle do Fluxo:
Gerenciar a agenda de forma estratégica, otimizando o tempo dos profissionais e reduzindo buracos.

4. Confiança vs Desconto:
Vender valor, não preço. Saber contornar pedidos de desconto reforçando a qualidade e o resultado esperado.

5. Follow-up:
O acompanhamento pós-serviço demonstra cuidado e gera retornos mais rápidos.

AÇÃO IMEDIATA:
Aplique hoje a regra da saudação com o nome da cliente e sorriso no rosto (mesmo ao telefone).`,
  },
  {
    id: 'tab2',
    label: 'Vídeo 2',
    title: 'Técnica de Upsell: Como Oferecer Mais Sem Parecer Ganancioso',
    description:
      'Aprenda a oferecer serviços complementares de forma natural e aumentar o ticket médio.',
    content: `Passo a Passo:

1. Escuta Ativa
Entenda a dor ou o desejo da cliente durante o agendamento ou chegada.

2. Oferta Natural
"Como você vai fazer X, aproveita que o profissional Y está livre e já faz Z".

3. Alternativa
"Você prefere a opção A ou a B?" (Dê escolhas limitadas).

4. Confirmação
Reforce os benefícios da escolha.

Exemplos de Upsell por Serviço:
- Mechas -> Tratamento de reconstrução e nutrição.
- Corte -> Finalização especial ou spa capilar.
- Manicure -> Spa dos pés ou esmaltação em gel.

REGRA DE OURO:
O upsell deve parecer um conselho de especialista, não uma tentativa desesperada de empurrar serviço.

AÇÃO IMEDIATA:
Liste 3 combos de serviços do seu salão e treine a abordagem de oferta para cada um deles hoje.`,
  },
  {
    id: 'tab3',
    label: 'Vídeo 3',
    title: 'Venda de Produtos no Checkout: Home Care que Vende',
    description:
      'O checkout é o momento de ouro. Aprenda a vender produtos sem parecer insistente.',
    content: `Fluxo de Checkout:

1. Validação
Elogie o resultado do serviço. "Seu cabelo ficou maravilhoso."

2. Educação
Explique que o cuidado em casa mantém o resultado do salão.

3. Oferta
"Para manter esse brilho, a especialista usou a linha X. Temos o kit disponível aqui."

4. Alternativa
Ofereça opções. "Temos o kit completo ou apenas a máscara. Qual você prefere?"

5. Fechamento
"Posso incluir no seu pagamento?"

Exemplos de Preços e Ancoragem:
"Esse tratamento no salão custa R$ 150 a sessão. Levando o kit hoje por R$ 199, você faz pelo menos 10 aplicações em casa."

REGRA DE OURO:
A venda do produto home care garante a durabilidade do serviço e a fidelização da cliente.

AÇÃO IMEDIATA:
Exponha os produtos perto do caixa e faça a oferta de um item de manutenção para cada cliente no momento do pagamento.`,
  },
  {
    id: 'tab4',
    label: 'Script WhatsApp',
    title: 'Script WhatsApp: Recuperando Clientes Inativos (45+ dias)',
    description: 'Use este script para trazer de volta clientes que desapareceram.',
    content: `Contexto:
Utilize para clientes que não visitam o salão há 45 dias ou mais.

Mensagem 1 (Dia 45):
"Oi [Nome]! 👋 Tudo bem? Notei que faz um tempo que você não vem nos visitar! Sabemos como o dia a dia é corrido, mas que tal tirar um tempinho para você? Preparamos uma condição especial para [Serviço]. Podemos agendar para essa semana?"

Follow-up (Dia 50):
"Oi [Nome], passando só para lembrar da nossa condição! Restam poucos horários na agenda desta semana. Posso reservar um para você?"

Contorno de Objeções:
- Tempo: "Podemos agendar no seu horário de almoço ou no fim do dia. Temos profissionais rápidos para te atender."
- Outro lugar: "Entendo! Se um dia quiser experimentar nossa nova técnica, estamos sempre de portas abertas."
- Preço: "Temos opções mais acessíveis que entregam um ótimo resultado. Quer dar uma olhada no nosso menu de serviços?"

Confirmação de Sucesso:
"Perfeito! Horário agendado para [Dia/Hora]. Te esperamos com um café quentinho! ☕"

REGRA DE OURO:
Nunca pareça que está cobrando a cliente, e sim que sentiu falta dela e quer cuidar dela.

DICAS:
- Personalize sempre com o nome da cliente.
- Use áudios curtos para gerar mais conexão se a cliente for mais próxima.
- Utilize emojis moderadamente.`,
  },
]

export default function Reception() {
  const { toast } = useToast()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return

    const trackAccess = async () => {
      try {
        await pb.collection('bonus_acesso').create({
          user: user.id,
          tipo_bonus: 'recepcao',
        })
      } catch {
        // Silently fail if tracking fails or if uniqueness constraint prevents duplicates
      }
    }
    trackAccess()
  }, [user, loading])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copiado!',
        description: 'Conteúdo copiado para a área de transferência.',
      })
    } catch {
      toast({
        title: 'Erro',
        description: 'Falha ao copiar. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadPDF = (title: string, content: string) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #000; font-size: 24px; margin-bottom: 24px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; background: #f9f9f9; padding: 24px; border-radius: 8px; border: 1px solid #eee; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${content}</pre>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="max-w-4xl mx-auto py-4 animate-fade-in">
        <div className="mb-6 flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-fit -ml-4"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold text-primary">Recepção que Vende</h1>
        </div>

        <Tabs defaultValue={TABS[0].id} className="w-full">
          <TabsList className="flex flex-wrap mb-6">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex-1 min-w-[120px]">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
              <Card>
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-primary">{tab.title}</CardTitle>
                  <CardDescription className="text-base font-normal text-foreground mt-2">
                    {tab.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-xl p-6 mb-6 border border-border">
                    <pre className="whitespace-pre-wrap font-sans text-base font-normal leading-relaxed text-foreground">
                      {tab.content}
                    </pre>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => handleCopy(tab.content)}
                      className="flex-1 gap-2"
                      aria-label="Copiar Script"
                    >
                      <Copy className="size-5" />
                      Copiar Script
                    </Button>
                    <Button
                      onClick={() => handleDownloadPDF(tab.title, tab.content)}
                      variant="outline"
                      className="flex-1 gap-2 text-primary"
                      aria-label="Baixar em PDF"
                    >
                      <Download className="size-5" />
                      Baixar em PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
