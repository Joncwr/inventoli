
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('items', t => {
      t.integer('container_id').references('containers.id')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('items', t => {
      t.dropColumn('container_id')
    })
  ])
};
