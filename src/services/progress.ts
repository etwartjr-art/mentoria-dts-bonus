import pb from '@/lib/pocketbase/client'

export const trackAccess = async (tipo_bonus: 'juridico' | 'calculadora' | 'recepcao') => {
  if (!pb.authStore.record) return
  try {
    const existing = await pb
      .collection('bonus_acesso')
      .getFirstListItem(`user="${pb.authStore.record.id}" && tipo_bonus="${tipo_bonus}"`)
    if (existing) return existing
  } catch {
    /* intentionally ignored */
  }

  try {
    return await pb.collection('bonus_acesso').create({
      user: pb.authStore.record.id,
      tipo_bonus,
    })
  } catch (_) {
    return null
  }
}

export const getProgress = async () => {
  if (!pb.authStore.record) return null
  try {
    return await pb
      .collection('progresso_juridico')
      .getFirstListItem(`user="${pb.authStore.record.id}"`)
  } catch (_) {
    return null
  }
}

export const updateProgress = async (
  data: Partial<{
    checklist_completo: boolean
    nda_baixado: boolean
    checklist_state: Record<number, boolean>
  }>,
) => {
  if (!pb.authStore.record) return null
  let record
  try {
    record = await pb
      .collection('progresso_juridico')
      .getFirstListItem(`user="${pb.authStore.record.id}"`)
    return await pb.collection('progresso_juridico').update(record.id, data)
  } catch (_) {
    try {
      return await pb.collection('progresso_juridico').create({
        user: pb.authStore.record.id,
        ...data,
      })
    } catch (_) {
      return null
    }
  }
}
