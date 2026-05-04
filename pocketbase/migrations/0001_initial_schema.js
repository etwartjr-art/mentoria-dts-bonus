migrate(
  (app) => {
    const bonusAcesso = new Collection({
      name: 'bonus_acesso',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: null,
      fields: [
        {
          name: 'user',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          required: true,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'tipo_bonus',
          type: 'select',
          values: ['juridico', 'calculadora', 'recepcao'],
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(bonusAcesso)

    const progressoJuridico = new Collection({
      name: 'progresso_juridico',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: null,
      fields: [
        {
          name: 'user',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          required: true,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'checklist_completo', type: 'bool' },
        { name: 'nda_baixado', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_progresso_user ON progresso_juridico (user)'],
    })
    app.save(progressoJuridico)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('progresso_juridico'))
    app.delete(app.findCollectionByNameOrId('bonus_acesso'))
  },
)
