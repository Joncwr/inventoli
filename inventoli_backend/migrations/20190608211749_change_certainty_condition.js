exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('items', t => {
      t.string('certainty').notNullable().alter()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('items', t => {
      t.boolean('certainty').notNullable().alter()
    })
  ])
};
