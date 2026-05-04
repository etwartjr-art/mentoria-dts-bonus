migrate(
  (app) => {
    const collection = new Collection({
      name: 'dados_calculadora',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'servico', type: 'text', required: true },
        { name: 'preco_venda', type: 'number' },
        { name: 'custo_insumos', type: 'number' },
        { name: 'impostos', type: 'number' },
        { name: 'comissao', type: 'number' },
        { name: 'tempo', type: 'number' },
        { name: 'custo_operacional_minuto', type: 'number' },
        { name: 'lucro_liquido', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('dados_calculadora')
      app.delete(collection)
    } catch (_) {}
  },
)
