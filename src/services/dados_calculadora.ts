import pb from '@/lib/pocketbase/client'

export interface DadosCalculadora {
  id: string
  servico: string
  preco_venda: number
  custo_insumos: number
  impostos: number
  comissao: number
  tempo: number
  custo_operacional_minuto: number
  lucro_liquido: number
  user: string
}

export const getDadosCalculadora = async (userId: string) => {
  return pb.collection('dados_calculadora').getFullList<DadosCalculadora>({
    filter: `user="${userId}"`,
    sort: 'created',
  })
}

export const createDadosCalculadora = async (data: Omit<DadosCalculadora, 'id'>) => {
  return pb.collection('dados_calculadora').create<DadosCalculadora>(data)
}

export const updateDadosCalculadora = async (id: string, data: Partial<DadosCalculadora>) => {
  return pb.collection('dados_calculadora').update<DadosCalculadora>(id, data)
}

export const deleteDadosCalculadora = async (id: string) => {
  return pb.collection('dados_calculadora').delete(id)
}
