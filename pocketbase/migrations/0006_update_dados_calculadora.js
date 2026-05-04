migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('dados_calculadora')

    if (!col.fields.getByName('custo_fixo_mensal')) {
      col.fields.add(new NumberField({ name: 'custo_fixo_mensal' }))
    }
    if (!col.fields.getByName('minutos_disponiveis')) {
      col.fields.add(new NumberField({ name: 'minutos_disponiveis' }))
    }
    if (!col.fields.getByName('margem_lucro')) {
      col.fields.add(new NumberField({ name: 'margem_lucro' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('dados_calculadora')
    col.fields.removeByName('custo_fixo_mensal')
    col.fields.removeByName('minutos_disponiveis')
    col.fields.removeByName('margem_lucro')
    app.save(col)
  },
)
