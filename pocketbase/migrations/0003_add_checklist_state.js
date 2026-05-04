migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('progresso_juridico')
    col.fields.add(
      new JSONField({
        name: 'checklist_state',
        required: false,
        maxSize: 2000000,
      }),
    )
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('progresso_juridico')
    col.fields.removeByName('checklist_state')
    app.save(col)
  },
)
