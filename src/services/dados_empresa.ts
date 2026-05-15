import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface DadosEmpresa extends RecordModel {
  user: string
  razao_social: string
  cnpj: string
  endereco_completo: string
  cidade_estado: string
  logotipo?: string
}

export const getDadosEmpresa = async (): Promise<DadosEmpresa | null> => {
  try {
    const records = await pb.collection('dados_empresa').getFullList<DadosEmpresa>()
    return records.length > 0 ? records[0] : null
  } catch (err) {
    return null
  }
}

export const saveDadosEmpresa = async (data: FormData, id?: string): Promise<DadosEmpresa> => {
  const userId = pb.authStore.record?.id
  if (!userId) throw new Error('Usuário não autenticado')

  data.append('user', userId)

  if (id) {
    return pb.collection('dados_empresa').update<DadosEmpresa>(id, data)
  } else {
    return pb.collection('dados_empresa').create<DadosEmpresa>(data)
  }
}
