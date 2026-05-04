migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'Etwartjr@gmail.com')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('Etwartjr@gmail.com')
    record.setPassword('12345678')
    record.setVerified(true)
    record.set('name', 'Etward Junior')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'Etwartjr@gmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
