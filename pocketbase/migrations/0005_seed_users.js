migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    const seedUser = (email, name, password) => {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
      } catch (_) {
        const record = new Record(users)
        record.setEmail(email)
        record.setPassword(password)
        record.setVerified(true)
        record.set('name', name)
        app.save(record)
      }
    }

    seedUser('ana.silva@email.com', 'Ana Silva', 'senha123')
    seedUser('carlos.oliveira@email.com', 'Carlos Oliveira', 'senha123')
    seedUser('financeiro@etw-art-contabilidade.com.br', 'Admin', 'Skip@Pass')
  },
  (app) => {
    const emails = [
      'ana.silva@email.com',
      'carlos.oliveira@email.com',
      'financeiro@etw-art-contabilidade.com.br',
    ]
    for (const email of emails) {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    }
  },
)
